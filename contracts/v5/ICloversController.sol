pragma solidity ^0.5.8;

/**
 * The CloversController is a replaceable endpoint for minting and unminting Clovers.sol and ClubToken.sol
 */

contract ICloversController {

    function claimCloverSecurelyPartOne(bytes32 movesHashWithRecipient, address recipient) public;
    function claimCloverSecurelyPartTwo(bytes32 movesHash, address recipient) public;
    function claimCloverWithVerification(bytes28[2] memory moves, bool keep, address recipient) public payable returns (bool);
    /* solium-disable-next-line  max-len */
    function claimCloverWithSignature(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, bool keep, bytes memory signature, address recipient)
        public payable returns (bool);
    function claimCloverFromAMB(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, bool keep, address recipient)
        public payable returns (bool);
}
