pragma solidity ^0.4.18;

/**
 * The Clovers contract is the interface for the CloversController Contract
 */


contract IClubTokenController {
    function buy(address buyer) public payable returns(bool);
    function transferFrom(address from, address to, uint256 amount) public;
}
