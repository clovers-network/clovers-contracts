pragma solidity ^0.4.18;

/**
 * The Clovers contract is the interface for the CloversController Contract
 */


contract IClubTokenController {
    function buy(address buyer) public payable returns(bool);
}
