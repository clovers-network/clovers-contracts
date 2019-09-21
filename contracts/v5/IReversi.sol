pragma solidity ^0.5.9;

library IReversi {
    struct Game {
        bool error;
        bool complete;
        bool symmetrical;
        bool RotSym;
        bool Y0Sym;
        bool X0Sym;
        bool XYSym;
        bool XnYSym;
        bytes16 board;
        bytes28 first32Moves;
        bytes28 lastMoves;

        uint8 currentPlayer;
        uint8 moveKey;
        uint8 blackScore;
        uint8 whiteScore;
        // string msg;
    }
    function playGame (bytes28[2] memory moves) internal pure returns (Game memory){}
    function returnSymmetricals (bool RotSym, bool Y0Sym, bool X0Sym, bool XYSym, bool XnYSym) public view returns (uint256);
}