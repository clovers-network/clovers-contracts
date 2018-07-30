pragma solidity ^0.4.18;

/**
 * Interface for Digital Asset Registry for the Non Fungible Token Clover
 * with upgradeable contract reference for returning metadata.
 */


contract IClovers {

    function tokenURI(uint _tokenId) public view returns (string _infoUrl);
    function getBlockMinted(uint256 _tokenId) public view returns (uint256);
    function getCloverMoves(uint256 _tokenId) public view returns (bytes28[2]);
    function getReward(uint256 _tokenId) public view returns (uint256);
    function getSymmetries(uint256 _tokenId) public view returns (uint256);
    function getAllSymmetries() public view returns (uint256, uint256, uint256, uint256, uint256, uint256);

    function moveEth(address _to, uint256 _amount) public;
    function moveToken(address _to, uint256 _amount, address _token) public returns (bool);
    function approveToken(address _to, uint256 _amount, address _token) public returns (bool);

    function setBlockMinted(uint256 _tokenId, uint256 value) public;
    function setCloverMoves(uint256 _tokenId, bytes28[2] moves) public;
    function setReward(uint256 _tokenId, uint256 _amount) public;
    function setSymmetries(uint256 _tokenId, uint256 _symmetries) public;
    function setAllSymmetries(uint256 _totalSymmetries, uint256 RotSym, uint256 Y0Sym, uint256 X0Sym, uint256 XYSym, uint256 XnYSym) public;
    function deleteClover(uint256 _tokenId) public;

    function updateCloversControllerAddress(address _cloversController) public;
    function updateCloversMetadataAddress(address _cloversMetadata) public;

    function mint (address _to, uint256 _tokenId) public;
    function unmint (uint256 _tokenId) public;

    event Transfer(
      address indexed _from,
      address indexed _to,
      uint256 indexed _tokenId
    );
    event Approval(
      address indexed _owner,
      address indexed _approved,
      uint256 indexed _tokenId
    );
    event ApprovalForAll(
      address indexed _owner,
      address indexed _operator,
      bool _approved
    );

    function balanceOf(address _owner) public view returns (uint256 _balance);
    function ownerOf(uint256 _tokenId) public view returns (address _owner);
    function exists(uint256 _tokenId) public view returns (bool _exists);

    function approve(address _to, uint256 _tokenId) public;
    function getApproved(uint256 _tokenId)
      public view returns (address _operator);

    function setApprovalForAll(address _operator, bool _approved) public;
    function isApprovedForAll(address _owner, address _operator)
      public view returns (bool);

    function transferFrom(address _from, address _to, uint256 _tokenId) public;
    function safeTransferFrom(address _from, address _to, uint256 _tokenId)
      public;

    function safeTransferFrom(
      address _from,
      address _to,
      uint256 _tokenId,
      bytes _data
    )
      public;
}
