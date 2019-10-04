pragma solidity ^0.5.9;

/**
 * ReversiMock helps w testing Reversi.sol
 */

import "../Reversi.sol";


contract ReversiMock {
    function logGame(bytes28[2] memory moves) public {
        Reversi.playGame(moves);
    }
}
