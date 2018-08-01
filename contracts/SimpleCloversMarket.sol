pragma solidity ^0.4.24;

import "./IClovers.sol";
import "./IClubToken.sol";
import "./IClubTokenController.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract SimpleCloversMarket is Ownable {
    address clovers;
    address clubToken;
    address clubTokenController;
    struct Sell {
        address from;
        uint256 price;
    }
    mapping(uint256 => Sell) sells;
    constructor(address _clovers, address _clubToken, address _clubTokenController) public {
        updateClovers(_clovers);
        updateClubToken(_clubToken);
        updateClubTokenController(_clubTokenController);
    }
    updateClubTokenController(address _clubTokenController) public onlyOwner {
        clubTokenController = _clubTokenController;
    }
    updateClubToken(address _clubToken) public onlyOwner {
        clubToken = _clubToken;
    }
    updateClovers(address _clovers) public onlyOwner {
        clovers = _clovers;
    }
    removeSell(uint256 _tokenId) public {
        address owner = IClovers(clovers).ownerOf(_tokenId);
        address seller = sells[_tokenId].from;
        require(owner == msg.sender || owner != seller);
        delete(sells[_tokenId]);
    }
    sell(uint256 _tokenId, uint256 price) public {
        require(price > 0);
        require(IClovers(clovers).ownerOf(_tokenId) == msg.sender);
        approve(address(this), _tokenId);
        sells[_tokenId][msg.sender] = price;
    }
    buy (uint256 _tokenId) public payable {
        uint256 price = sells[_tokenId].price;
        address from = sells[_tokenId].from;
        require(price > 0);
        require(IClovers(clovers).ownerOf(_tokenId) == from);
        if(IClubToken(clubToken).balanceOf(msg.sender) < price) {
            IClubTokenController(clubTokenController).buy(msg.sender);
        }
        require(IClubToken(clubToken).transferFrom(msg.sender, from, price));
        require(IClovers(clovers).transferFrom(from, msg.sender, _tokenId));
        delete(sells[_tokenId]);
    }
}
