pragma solidity ^0.5.8;

contract IClubToken {
    function balanceOf(address _owner) public view returns (uint256);
    function burn(address _burner, uint256 _value) public;
    function mint(address _to, uint256 _amount) public returns (bool);
}