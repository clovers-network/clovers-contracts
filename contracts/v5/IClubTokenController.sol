pragma solidity ^0.5.9;

contract IClubTokenController {
    function buy(address buyer) public payable returns(bool);
    function sellOnBehalf(uint256 sellAmount, address recipient) public returns(uint256 weiReturned);
    function getSell(uint256 sellAmount) public view returns(uint256);
}