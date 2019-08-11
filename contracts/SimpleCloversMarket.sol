pragma solidity ^0.4.24;

import "./Clovers.sol";
import "./ClubToken.sol";
import "./ClubTokenController.sol";
// import "./CloversController.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract CloversController {
    function transferFrom(address _from, address _to, uint256 _tokenId) public;
}

contract SimpleCloversMarket is Ownable {

    event updatePrice(uint256 _tokenId, uint256 price);


    using SafeMath for uint256;

    address public clovers;
    address public clubToken;
    address public clubTokenController;
    address public cloversController;
    struct Sell {
        address from;
        uint256 price;
    }
    mapping(uint256 => Sell) sells;
    constructor(address _clovers, address _clubToken, address _clubTokenController, address _cloversController) public {
        updateClovers(_clovers);
        updateClubToken(_clubToken);
        updateClubTokenController(_clubTokenController);
        updateCloversController(_cloversController);
    }
    function sellFrom(uint256 _tokenId) public view returns(address) {
        return sells[_tokenId].from;
    }
    function sellPrice(uint256 _tokenId) public view returns(uint256){
        return sells[_tokenId].price;
    }
    function updateClubTokenController(address _clubTokenController) public onlyOwner {
        clubTokenController = _clubTokenController;
    }
    function updateCloversController(address _cloversController) public onlyOwner {
        cloversController = _cloversController;
    }
    function updateClubToken(address _clubToken) public onlyOwner {
        clubToken = _clubToken;
    }
    function updateClovers(address _clovers) public onlyOwner {
        clovers = _clovers;
    }
    function removeSell(uint256 _tokenId) public {
        address owner = Clovers(clovers).ownerOf(_tokenId);
        address seller = sells[_tokenId].from;
        require(owner == msg.sender || owner != seller);
        delete(sells[_tokenId]);
        updatePrice(_tokenId, 0);
    }

    function sell(uint256 _tokenId, uint256 price) public {
        require(price > 0);
        address tokenOwner = Clovers(clovers).ownerOf(_tokenId);
        require(tokenOwner == msg.sender || tokenOwner == clovers || msg.sender == cloversController);
        if (tokenOwner == clovers) {
            require(sells[_tokenId].price == 0);
        }
        sells[_tokenId].price = price;
        sells[_tokenId].from = Clovers(clovers).ownerOf(_tokenId);
        updatePrice(_tokenId, price);
    }
    function buy (uint256 _tokenId) public payable {
        uint256 sellPrice = sells[_tokenId].price;
        address sellFrom = sells[_tokenId].from;
        require(sellPrice > 0);
        require(Clovers(clovers).ownerOf(_tokenId) == sellFrom);
        if(ClubToken(clubToken).balanceOf(msg.sender) < sellPrice) {
            ClubTokenController(clubTokenController).buy.value(msg.value)(msg.sender);
        }
        // if seller is Clovers Contract, burn the money
        if (sellFrom == clovers) {
            ClubTokenController(clubTokenController).burn(msg.sender, sellPrice);
        } else {
            ClubTokenController(clubTokenController).transferFrom(msg.sender, sellFrom, sellPrice);
        }
        CloversController(cloversController).transferFrom(sellFrom, msg.sender, _tokenId);
        delete(sells[_tokenId]);
        updatePrice(_tokenId, 0);
    }

}
