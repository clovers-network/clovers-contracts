pragma solidity ^0.4.24;

import "./IClovers.sol";
import "./IClubToken.sol";
import "./IClubTokenController.sol";
import "./ICloversController.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

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
        address owner = IClovers(clovers).ownerOf(_tokenId);
        address seller = sells[_tokenId].from;
        require(owner == msg.sender || owner != seller);
        delete(sells[_tokenId]);
    }

    function sell(uint256 _tokenId, uint256 price) public {
        require(price > 0);
        require(IClovers(clovers).ownerOf(_tokenId) == msg.sender || msg.sender == cloversController);
        sells[_tokenId].price = price;
        sells[_tokenId].from = IClovers(clovers).ownerOf(_tokenId);
        updatePrice(_tokenId, price);
    }
    function buy (uint256 _tokenId) public payable {
        uint256 sellPrice = sells[_tokenId].price;
        address sellFrom = sells[_tokenId].from;
        require(sellPrice > 0);
        require(IClovers(clovers).ownerOf(_tokenId) == sellFrom);
        if(IClubToken(clubToken).balanceOf(msg.sender) < sellPrice) {
            IClubTokenController(clubTokenController).buy(msg.sender);
        }
        IClubTokenController(clubTokenController).transferFrom(msg.sender, sellFrom, sellPrice);
        ICloversController(cloversController).transferFrom(sellFrom, msg.sender, _tokenId);
        delete(sells[_tokenId]);
        updatePrice(_tokenId, 0);
    }

    /**
    * @dev Buy one of the Clovers which were given up when mining.
    * @param _tokenId The board being bought.
    * @return A boolean representing whether or not the purchase was successful.
    */
    /* function buyCloverFromContract(uint256 _tokenId) public payable returns(bool) {
        require(IClovers(clovers).ownerOf(_tokenId) == clovers);
        uint256 reward = IClovers(clovers).getReward(_tokenId);
        uint256 toPay = ICloversController(cloversController).basePrice().add(reward.mul(ICloversController(cloversController).priceMultiplier()));
        if (IClubToken(clubToken).balanceOf(msg.sender) < toPay) {
            IClubTokenController(clubTokenController).buy(msg.sender); // msg.value needs to be enough to buy "toPay" amount of Club Token
        }
        if (toPay > 0) {
            // IClubToken(clubToken).transferFrom(msg.sender, clubToken, toPay); // if we'd rather keep the money
            IClubToken(clubToken).burn(msg.sender, toPay);
        }
        IClovers(clovers).transferFrom(clovers, msg.sender, _tokenId);
        updatePrice(_tokenId, 0);
        return true;
    } */
}
