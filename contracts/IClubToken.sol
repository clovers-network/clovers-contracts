pragma solidity ^0.4.18;

/**
 * Interface for ERC20 Club Token
 */


contract IClubToken {
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    function mint(address _to, uint256 _amount) public returns (bool);
    function burn(address _burner, uint256 _value) public;
    function moveEth(address _to, uint256 _amount) public;
    function moveToken(address _to, uint256 _amount, address _token) public returns (bool);
    function approveToken(address _to, uint256 _amount, address _token) public returns (bool);

    function allowance(address owner, address spender) public view returns (uint256);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
    function approve(address spender, uint256 value) public returns (bool);
    function increaseApproval(address _spender, uint256 _addedValue) public returns (bool);
    function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
}
