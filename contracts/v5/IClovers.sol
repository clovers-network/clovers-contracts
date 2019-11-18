pragma solidity ^0.5.8;

contract IClovers {
    function ownerOf(uint256 _tokenId) public view returns (address _owner);
    function setCloverMoves(uint256 _tokenId, bytes28[2] memory moves) public;
    function getCloverMoves(uint256 _tokenId) public view returns (bytes28[2] memory);
    function getAllSymmetries() public view returns (uint256, uint256, uint256, uint256, uint256, uint256);
    function exists(uint256 _tokenId) public view returns (bool _exists);
    function getBlockMinted(uint256 _tokenId) public view returns (uint256);
    function setBlockMinted(uint256 _tokenId, uint256 value) public;
    function setKeep(uint256 _tokenId, bool value) public;
    function setSymmetries(uint256 _tokenId, uint256 _symmetries) public;
    function setReward(uint256 _tokenId, uint256 _amount) public;
    function mint (address _to, uint256 _tokenId) public;
    function getReward(uint256 _tokenId) public view returns (uint256);
    function getKeep(uint256 _tokenId) public view returns (bool);
    function transferFrom(address _from, address _to, uint256 _tokenId) public;
    function moveEth(address _to, uint256 _amount) public;
    function getSymmetries(uint256 _tokenId) public view returns (uint256);
    function deleteClover(uint256 _tokenId) public;
    function setAllSymmetries(uint256 _totalSymmetries, uint256 RotSym, uint256 Y0Sym, uint256 X0Sym, uint256 XYSym, uint256 XnYSym) public;
}