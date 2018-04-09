pragma solidity ^0.4.18;

/**
 * Mintable is a contract interface for CloversController to use
 */


contract IMintable {

    function IMintable() public {}

    function mint(address _to, uint256 amount) public returns(bool);
  
}