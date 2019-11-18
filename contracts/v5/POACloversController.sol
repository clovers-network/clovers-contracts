pragma solidity ^0.5.8;

/**
 * The POACloversController is a replaceable endpoint for minting and unminting Clovers.sol and ClubToken.sol
 */

import "./Reversi.sol";
import "./IAMB.sol";
import "./CloversController.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";

contract POACloversController is Ownable {
    event cloverClaimed(uint256 tokenId, bytes28[2] moves, address sender, address recepient, uint reward, uint256 symmetries, bool keep);

    using SafeMath for uint256;
    using ECDSA for bytes32;

    bool public paused;
    address public oracle;
    IAMB public amb;
    CloversController public cloversController;
    uint256 public executionGasLimit;

    mapping(bytes32=>Submission) public submissions;

    struct Submission {
        uint256 tokenId;
        bytes28[2] moves;
        uint256 symmetries;
        address recepient;
        bool keep;
    }

    function setMessageHashValue(bytes32 _hash, uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, address recepient, bool keep)
        internal {
        require(submissions[_hash].tokenId == 0, "Hash has already been submitted");
        submissions[_hash] = Submission(tokenId, moves, symmetries, recepient, keep);
    }

    modifier notPaused() {
        require(!paused, "Must not be paused");
        _;
    }

    constructor(
        IAMB _amb,
        uint256 _executionGasLimit
    ) public {
        amb = _amb;
        executionGasLimit = _executionGasLimit;
    }

    function getMovesHash(bytes28[2] memory moves) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(moves));
    }

    function getMovesHashWithRecepient(bytes32 movesHash, address recepient) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(movesHash, recepient));
    }

    /**
    * @dev Checks whether the game is valid.
    * @param moves The moves needed to play validate the game.
    * @return A boolean representing whether or not the game is valid.
    */
    function isValid(bytes28[2] memory moves) public pure returns (bool) {
        Reversi.Game memory game = Reversi.playGame(moves);
        return isValidGame(game.error, game.complete);
    }

    /**
    * @dev Checks whether the game is valid.
    * @param error The pre-played game error
    * @param complete The pre-played game complete boolean
    * @return A boolean representing whether or not the game is valid.
    */
    function isValidGame(bool error, bool complete) public pure returns (bool) {
        if (error || !complete) {
            return false;
        } else {
            return true;
        }
    }

    function getGame (bytes28[2] memory moves) public pure returns
        (bool error, bool complete, bool symmetrical, bytes16 board, uint8 currentPlayer, uint8 moveKey) {
        // return Reversi.getGame(moves);
        Reversi.Game memory game = Reversi.playGame(moves);
        return (
            game.error,
            game.complete,
            game.symmetrical,
            game.board,
            game.currentPlayer,
            game.moveKey
            // game.msg
        );
    }

    // In order to prevent commit reveal griefing the first commit is a combined hash of the moves and the recepient.
    // In order to use the same commit mapping, we mark this hash simply as address(1) so it is no longer the equivalent of address(0)
    function claimCloverSecurelyPartOne(bytes32 movesHashWithRecepient, address recepient) public {
        bytes4 methodSelector = CloversController(address(0)).claimCloverSecurelyPartOne.selector;
        bytes memory data = abi.encodeWithSelector(methodSelector, movesHashWithRecepient, recepient);
        amb.requireToPassMessage(address(cloversController), data, executionGasLimit); // TODO: set different gas limits

    }

    // Once a commit has been made to guarantee the move hash is associated with the recepient we can make a commit on the hash of the moves themselves
    // If we were to make a claim on the moves in plaintext, the transaction could be front run on the claimCloverWithVerification or the claimCloverWithSignature
    function claimCloverSecurelyPartTwo(bytes32 movesHash, address recepient) public {
        bytes4 methodSelector = CloversController(address(0)).claimCloverSecurelyPartTwo.selector;
        bytes memory data = abi.encodeWithSelector(methodSelector, movesHash, recepient);
        amb.requireToPassMessage(address(cloversController), data, executionGasLimit); // TODO: set different gas limits
    }

    function claimCloverWithVerification(bytes28[2] memory moves, bool keep, address recepient) public payable returns (bool) {
        Reversi.Game memory game = Reversi.playGame(moves);
        require(isValidGame(game.error, game.complete), "Invalid game");
        uint256 tokenId = convertBytes16ToUint(game.board);

        uint256 symmetries = Reversi.returnSymmetricals(game.RotSym, game.Y0Sym, game.X0Sym, game.XYSym, game.XnYSym);
        require(_claimClover(tokenId, moves, symmetries, recepient, keep), "Claim must succeed");
        return true;
    }



    /**
    * @dev Claim the Clover without a commit or reveal. Payable so you can buy tokens if needed.
    * @param tokenId The board that results from the moves.
    * @param moves The moves that make up the Clover reversi game.
    * @param symmetries symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * @param keep symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * @param signature symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * types.
    * @return A boolean representing whether or not the claim was successful.
    */
    /* solium-disable-next-line  max-len */
    function claimCloverWithSignature(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, bool keep, address recepient, bytes memory signature)
        public payable notPaused returns (bool) {
        require(checkSignature(tokenId, moves, symmetries, keep, recepient, signature, oracle), "Invalid Signature");
        require(_claimClover(tokenId, moves, symmetries, recepient, keep), "Claim must succeed");
        return true;
    }

    function _claimClover(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, address recepient, bool keep) internal returns (bool) {

        bytes4 methodSelector = CloversController(address(0)).claimCloverFromAMB.selector;
        bytes memory data = abi.encodeWithSelector(methodSelector, tokenId, moves, symmetries, keep, recepient);
        amb.requireToPassMessage(address(cloversController), data, executionGasLimit);

        // Save value and from related to the data hash in case the message fails on the other side
        // bytes32 dataHash = keccak256(data);
        // setMessageHashValue(dataHash, tokenId, moves, symmetries, recepient, keep);
        return true;
    }


    /**
    * @dev Convert a bytes16 board into a uint256.
    * @param _board The board being converted.
    * @return number the uint256 being converted.
    */
    function convertBytes16ToUint(bytes16 _board) public pure returns(uint256 number) {
        for(uint i = 0;i<_board.length;i++){
            number = number + uint(uint8(_board[i]))*(2**(8*(_board.length-(i+1))));
        }
    }

    /**
    * @dev Updates pause boolean.
    * @param _paused The new puased boolean.
    */
    function updatePaused(bool _paused) public onlyOwner {
        paused = _paused;
    }

    /**
    * @dev Updates oracle Address.
    * @param _oracle The new oracle Address.
    */
    function updateOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    /**
    * @dev Updates arbitrary message bridge Address.
    * @param _amb The new amb address.
    */
    function updateAMB(IAMB _amb) public onlyOwner {
        amb = _amb;
    }

    /**
    * @dev Updates executionGasLimit.
    * @param _executionGasLimit The new executionGasLimit.
    */
    function updateExecutionGasLimit(uint256 _executionGasLimit) public onlyOwner {
        executionGasLimit = _executionGasLimit;
    }

    /**
    * @dev Updates cloversController Address.
    * @param _cloversController The new cloversController address.
    */
    function updateCloversController(CloversController _cloversController) public onlyOwner {
        cloversController = _cloversController;
    }

    function checkSignature(
        uint256 tokenId,
        bytes28[2] memory moves,
        uint256 symmetries,
        bool keep,
        address recepient,
        bytes memory signature,
        address signer
    ) public pure returns (bool) {
        bytes32 hash = toEthSignedMessageHash(getHash(tokenId, moves, symmetries, keep, recepient));
        address result = recover(hash, signature);
        return (result != address(0) && result == signer);
    }

    function getHash(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, bool keep, address recepient) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenId, moves, symmetries, keep, recepient));
    }
    function recover(bytes32 hash, bytes memory signature) public pure returns (address) {
        return hash.recover(signature);
    }
    function toEthSignedMessageHash(bytes32 hash) public pure returns (bytes32) {
        return hash.toEthSignedMessageHash();
    }
}
