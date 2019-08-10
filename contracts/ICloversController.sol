pragma solidity ^0.4.18;

/**
 * The Clovers contract is the interface for the CloversController Contract
 */


contract ICloversController {

    event cloverCommitted(bytes32 movesHash, address owner);
    event cloverClaimed(bytes28[2] moves, uint256 tokenId, address owner, uint stake, uint reward, uint256 symmetries);
    event stakeRetrieved(uint256 tokenId, address owner);
    event cloverChallenged(bytes28[2] moves, uint256 tokenId, address owner, address challenger, uint stake);

    function basePrice() public constant returns(uint256);
    function priceMultiplier() public constant returns(uint256);
    function isValid(bytes28[2] moves) public constant returns (bool);
    function isVerified(uint256 _tokenId) public constant returns (bool);
    function calculateReward(uint256 _symmetries) public constant returns (uint256);
    function getCommit(bytes32 movesHash) public view returns (address);
    function getStake(bytes32 movesHash) public view returns (uint256);
    function transferFrom(address _from, address _to, uint256 _tokenId) public;

    function claimClover(bytes28[2] moves, uint256 _tokenId, uint256 _symmetries, address _to) public payable returns (bool);
    function claimCloverCommit(bytes32 movesHash, address _to) public payable returns (bool);
    function claimCloverReveal(bytes28[2] moves, uint256 _tokenId, uint256 _symmetries) public returns (bool);
    function retrieveStake(uint256 _tokenId, bool _keep, uint256 _amountToPayToKeep) public payable returns (bool);
    function buyCloverFromContract(uint256 _tokenId) public payable returns(bool);
    function challengeClover(uint256 _tokenId, address _to) public returns (bool);

}
