pragma solidity ^0.4.18;

/**
 * ReversiMock helps w testing Reversi.sol
 */

import "../Reversi.sol";


contract ReversiMock {
    function ReversiMock() public {}
    function logGame(bytes28[2] moves) public {
        Reversi.playGame(moves);
    }
}
