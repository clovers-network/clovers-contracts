pragma solidity ^0.5.8;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";

contract ECDSAMock {
    using ECDSA for bytes32;

    function getHash(uint256 tokenId, bytes28[2] memory moves) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenId, moves));
    }

    function getHashWithPrefix(uint256 tokenId, bytes28[2] memory moves) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\u0019Ethereum Signed Message:\n", tokenId, moves));
    }

    function checkClover(address signer, bytes memory signature, uint256 tokenId, bytes28[2] memory moves) public pure returns (bool) {
        bytes32 hash = toEthSignedMessageHash(getHash(tokenId, moves));
        address result = recover(hash, signature);
        return result == signer;
    }

    function recover(bytes32 hash, bytes memory signature) public pure returns (address) {
        return hash.recover(signature);
    }

    function toEthSignedMessageHash(bytes32 hash) public pure returns (bytes32) {
        return hash.toEthSignedMessageHash();
    }
}
