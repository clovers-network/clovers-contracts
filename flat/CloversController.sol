pragma solidity ^0.4.24;

// File: contracts/Reversi.sol

/* pragma experimental ABIEncoderV2; */

library Reversi {
    // event DebugBool(bool boolean);
    // event DebugBoard(bytes16 board);
    // event DebugUint(uint u);
    uint8 constant BLACK = 1; //0b01 //0x1
    uint8 constant WHITE = 2; //0b10 //0x2
    uint8 constant EMPTY = 3; //0b11 //0x3

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


    function isValid (bytes28[2] moves) public pure returns (bool) {
      Game memory game = playGame(moves);
      if (game.error) {
        return false;
      } else if (!game.complete) {
        return false;
      } else {
        return true;
      }
    }

    function getGame (bytes28[2] moves) public pure returns (bool error, bool complete, bool symmetrical, bytes16 board, uint8 currentPlayer, uint8 moveKey) {
      Game memory game = playGame(moves);
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

    function showColors () public pure returns(uint8, uint8, uint8) {
        return (EMPTY, BLACK, WHITE);
    }

    function playGame (bytes28[2] moves) internal pure returns (Game)  {
        Game memory game;

        game.first32Moves = moves[0];
        game.lastMoves = moves[1];
        game.moveKey = 0;
        game.blackScore = 2;
        game.whiteScore = 2;

        game.error = false;
        game.complete = false;
        game.currentPlayer = BLACK;


        // game.board = bytes16(10625432672847758622720); // completely empty board
        game.board = bytes16(340282366920938456379662753540715053055); // empty board except for center pieces

        bool skip;
        uint8 move;
        uint8 col;
        uint8 row;
        uint8 i;
        bytes28 currentMoves;

        for (i = 0; i < 60 && !skip; i++) {
            currentMoves = game.moveKey < 32 ? game.first32Moves : game.lastMoves;
            move = readMove(currentMoves, game.moveKey % 32, 32);
            (col, row) = convertMove(move);
            skip = !validMove(move);
            if (i == 0 && (col != 2 || row != 3)) {
                skip = true; // this is to force the first move to always be C4 to avoid repeatable boards via mirroring translations
                game.error = true;
            }
            if (!skip && col < 8 && row < 8 && col >= 0 && row >= 0) {
                // game.msg = "make a move";
                game = makeMove(game, col, row);
                game.moveKey = game.moveKey + 1;
                if (game.error) {
                    game.error = false;
                    // maybe player has no valid moves and must pass
                    if (game.currentPlayer == BLACK) {
                        game.currentPlayer = WHITE;
                    } else {
                        game.currentPlayer = BLACK;
                    }
                    game = makeMove(game, col, row);
                    if (game.error) {
                        game.error = true;
                        skip = true;
                    }
                }
            }
        }
        if (!game.error) {
            game.error = false;
            game = isComplete(game);
            game = isSymmetrical(game);
        }
        return game;
    }

    function makeMove (Game memory game, uint8 col, uint8 row) internal pure returns (Game)  {
        // square is already occupied
        if (returnTile(game.board, col, row) != EMPTY){
            game.error = true;
            // game.msg = "Invalid Game (square is already occupied)";
            return game;
        }
        int8[2][8] memory possibleDirections;
        uint8  possibleDirectionsLength;
        (possibleDirections, possibleDirectionsLength) = getPossibleDirections(game, col, row);
        // no valid directions
        if (possibleDirectionsLength == 0) {
            game.error = true;
            // game.msg = "Invalid Game (doesnt border other tiles)";
            return game;
        }

        bytes28 newFlips;
        uint8 newFlipsLength;
        uint8 newFlipCol;
        uint8 newFlipRow;
        uint8 j;
        bool valid = false;
        for (uint8 i = 0; i < possibleDirectionsLength; i++) {
            delete newFlips;
            delete newFlipsLength;
            (newFlips, newFlipsLength) = traverseDirection(game, possibleDirections[i], col, row);
            for (j = 0; j < newFlipsLength; j++) {
                if (!valid) valid = true;
                (newFlipCol, newFlipRow) = convertMove(readMove(newFlips, j, newFlipsLength));
                game.board = turnTile(game.board, game.currentPlayer, newFlipCol, newFlipRow);
                if (game.currentPlayer == WHITE) {
                    game.whiteScore += 1;
                    game.blackScore -= 1;
                } else {
                    game.whiteScore -= 1;
                    game.blackScore += 1;
                }
            }
        }

        //no valid flips in directions
        if (valid) {
            game.board = turnTile(game.board, game.currentPlayer, col, row);
            if (game.currentPlayer == WHITE) {
                game.whiteScore += 1;
            } else {
                game.blackScore += 1;
            }
        } else {
            game.error = true;
            // game.msg = "Invalid Game (doesnt flip any other tiles)";
            return game;
        }

        // switch players
        if (game.currentPlayer == BLACK) {
            game.currentPlayer = WHITE;
        } else {
            game.currentPlayer = BLACK;
        }
        return game;
    }

    function getPossibleDirections (Game memory game, uint8 col, uint8 row) internal pure returns(int8[2][8], uint8){

        int8[2][8] memory possibleDirections;
        uint8 possibleDirectionsLength = 0;
        int8[2][8] memory dirs = [
            [int8(-1), int8(0)], // W
            [int8(-1), int8(1)], // SW
            [int8(0), int8(1)], // S
            [int8(1), int8(1)], // SE
            [int8(1), int8(0)], // E
            [int8(1), int8(-1)], // NE
            [int8(0), int8(-1)], // N
            [int8(-1), int8(-1)] // NW
        ];
        int8 focusedRowPos;
        int8 focusedColPos;
        int8[2] memory dir;
        uint8 testSquare;

        for (uint8 i = 0; i < 8; i++) {
            dir = dirs[i];
            focusedColPos = int8(col) + dir[0];
            focusedRowPos = int8(row) + dir[1];

            // if tile is off the board it is not a valid move
            if (!(focusedRowPos > 7 || focusedRowPos < 0 || focusedColPos > 7 || focusedColPos < 0)) {
                testSquare = returnTile(game.board, uint8(focusedColPos), uint8(focusedRowPos));

                // if the surrounding tile is current color or no color it can"t be part of a capture
                if (testSquare != game.currentPlayer) {
                    if (testSquare != EMPTY) {
                        possibleDirections[possibleDirectionsLength] = dir;
                        possibleDirectionsLength++;
                    }
                }
            }
        }
        return (possibleDirections, possibleDirectionsLength);
    }

    function traverseDirection (Game memory game, int8[2] dir, uint8 col, uint8 row) internal pure returns(bytes28, uint8) {
        bytes28 potentialFlips;
        uint8 potentialFlipsLength = 0;

        if (game.currentPlayer == BLACK) {
            uint8 opponentColor = WHITE;
        } else {
            opponentColor = BLACK;
        }

        // take one step at a time in this direction
        // ignoring the first step look for the same color as your tile
        bool skip = false;
        int8 testCol;
        int8 testRow;
        uint8 tile;
        for (uint8 j = 1; j < 9; j++) {
            if (!skip) {
                testCol = (int8(j) * dir[0]) + int8(col);
                testRow = (int8(j) * dir[1]) + int8(row);
                // ran off the board before hitting your own tile
                if (testCol > 7 || testCol < 0 || testRow > 7 || testRow < 0) {
                    delete potentialFlips;
                    potentialFlipsLength = 0;
                    skip = true;
                } else{

                    tile = returnTile(game.board, uint8(testCol), uint8(testRow));

                    if (tile == opponentColor) {
                        // if tile is opposite color it could be flipped, so add to potential flip array
                        (potentialFlips, potentialFlipsLength) = addMove(potentialFlips, potentialFlipsLength, uint8(testCol), uint8(testRow));
                    } else if (tile == game.currentPlayer && j > 1) {
                        // hit current players tile which means capture is complete
                        skip = true;
                    } else {
                        // either hit current players own color before hitting an opponent"s
                        // or hit an empty space
                        delete potentialFlips;
                        delete potentialFlipsLength;
                        skip = true;
                    }
                }
            }
        }
        return (potentialFlips, potentialFlipsLength);
    }

    function isComplete (Game memory game) internal pure returns (Game) {

        if (game.moveKey == 60) {
            // game.msg = "good game";
            game.complete = true;
            return game;
        } else {
            uint8[2][60] memory empties;
            uint8 emptiesLength = 0;
            for (uint8 i = 0; i < 64; i++) {
                uint8 tile = returnTile(game.board, ((i - (i % 8)) / 8), (i % 8));
                if (tile == EMPTY) {
                    empties[emptiesLength] = [((i - (i % 8)) / 8), (i % 8)];
                    emptiesLength++;
                }
            }
            bool validMovesRemains = false;
            if (emptiesLength > 0) {
                bytes16 board = game.board;
                uint8[2] memory move;
                for (i = 0; i < emptiesLength && !validMovesRemains; i++) {
                    move = empties[i];

                    game.currentPlayer = BLACK;
                    game.error = false;
                    game.board = board;
                    game = makeMove(game, move[0], move[1]);
                    if (!game.error) {
                        validMovesRemains = true;
                    }
                    game.currentPlayer = WHITE;
                    game.error = false;
                    game.board = board;
                    game = makeMove(game, move[0], move[1]);
                    if (!game.error) {
                        validMovesRemains = true;
                    }
                }
                game.board = board;
            }
            if (validMovesRemains) {
                game.error = true;
                // game.msg = "Invalid Game (moves still available)";
            } else {
                // game.msg = "good game";
                game.complete = true;
                game.error = false;
            }
        }
        return game;
    }

    function isSymmetrical (Game memory game) internal pure returns (Game) {
        bool RotSym = true;
        bool Y0Sym = true;
        bool X0Sym = true;
        bool XYSym = true;
        bool XnYSym = true;
        for (uint8 i = 0; i < 8 && (RotSym || Y0Sym || X0Sym || XYSym || XnYSym); i++) {
            for (uint8 j = 0; j < 8 && (RotSym || Y0Sym || X0Sym || XYSym || XnYSym); j++) {

                // rotational symmetry
                if (returnBytes(game.board, i, j) != returnBytes(game.board, (7 - i), (7 - j))) {
                    RotSym = false;
                }
                // symmetry on y = 0
                if (returnBytes(game.board, i, j) != returnBytes(game.board, i, (7 - j))) {
                    Y0Sym = false;
                }
                // symmetry on x = 0
                if (returnBytes(game.board, i, j) != returnBytes(game.board, (7 - i), j)) {
                    X0Sym = false;
                }
                // symmetry on x = y
                if (returnBytes(game.board, i, j) != returnBytes(game.board, (7 - j), (7 - i))) {
                    XYSym = false;
                }
                // symmetry on x = -y
                if (returnBytes(game.board, i, j) != returnBytes(game.board, j, i)) {
                    XnYSym = false;
                }
            }
        }
        if (RotSym || Y0Sym || X0Sym || XYSym || XnYSym) {
            game.symmetrical = true;
            game.RotSym = RotSym;
            game.Y0Sym = Y0Sym;
            game.X0Sym = X0Sym;
            game.XYSym = XYSym;
            game.XnYSym = XnYSym;
        }
        return game;
    }



    // Utilities

    function returnSymmetricals (bool RotSym, bool Y0Sym, bool X0Sym, bool XYSym, bool XnYSym) public constant returns (uint256) {
        uint256 symmetries = (RotSym ? 1  : 0) << 1;
        symmetries = (symmetries & (Y0Sym ? 1 : 0)) << 1;
        symmetries = (symmetries & (X0Sym ? 1 : 0)) << 1;
        symmetries = (symmetries & (XYSym ? 1 : 0)) << 1;
        symmetries = symmetries & (XnYSym ? 1 : 0);
        return symmetries;
    }


    function returnBytes (bytes16 board, uint8 col, uint8 row) internal pure returns (bytes16) {
        uint128 push = posToPush(col, row);
        return (board >> push) & bytes16(3);
    }

    function turnTile (bytes16 board, uint8 color, uint8 col, uint8 row) internal pure returns (bytes16){
        if (col > 7) revert();
        if (row > 7) revert();
        uint128 push = posToPush(col, row);
        bytes16 mask = bytes16(3) << push;// 0b00000011 (ones)

        board = ((board ^ mask) & board);

        return board | (bytes16(color) << push);
    }

    function returnTile (bytes16 board, uint8 col, uint8 row) internal pure returns (uint8){
        uint128 push = posToPush(col, row);
        bytes16 tile = (board >> push ) & bytes16(3);
        return uint8(tile); // returns 2
    }

    function posToPush (uint8 col, uint8 row) internal pure returns (uint128){
        return uint128(((64) - ((8 * col) + row + 1)) * 2);
    }

    function readMove (bytes28 moveSequence, uint8 moveKey, uint8 movesLength) public pure returns(uint8) {
        bytes28 mask = bytes28(127);
        uint8 push = (movesLength * 7) - (moveKey * 7) - 7;
        return uint8((moveSequence >> push) & mask);
    }

    function addMove (bytes28 moveSequence, uint8 movesLength, uint8 col, uint8 row) internal pure returns (bytes28, uint8) {
        bytes28 move = bytes28(col + (row * 8) + 64);
        moveSequence = moveSequence << 7;
        moveSequence = moveSequence | move;
        movesLength++;
        return (moveSequence, movesLength);
    }

    function validMove (uint8 move) internal pure returns(bool) {
        return move >= 64;
    }

    function convertMove (uint8 move) public pure returns(uint8, uint8) {
        move = move - 64;
        uint8 col = move % 8;
        uint8 row = (move - col) / 8;
        return (col, row);
    }


}

// File: contracts/IClovers.sol

/**
 * Interface for Digital Asset Registry for the Non Fungible Token Clover
 * with upgradeable contract reference for returning metadata.
 */


contract IClovers {

    function tokenURI(uint _tokenId) public view returns (string _infoUrl);

    function getKeep(uint256 _tokenId) public view returns (bool);
    function getBlockMinted(uint256 _tokenId) public view returns (uint256);
    function getCloverMoves(uint256 _tokenId) public view returns (bytes28[2]);
    function getReward(uint256 _tokenId) public view returns (uint256);
    function getSymmetries(uint256 _tokenId) public view returns (uint256);
    function getAllSymmetries() public view returns (uint256, uint256, uint256, uint256, uint256, uint256);

    function moveEth(address _to, uint256 _amount) public;
    function moveToken(address _to, uint256 _amount, address _token) public returns (bool);
    function approveToken(address _to, uint256 _amount, address _token) public returns (bool);

    function setKeep(uint256 _tokenId, bool value) public;
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

// File: contracts/IClubToken.sol

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

// File: contracts/ICloversController.sol

pragma experimental ABIEncoderV2;

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

// File: contracts/IClubTokenController.sol

/**
 * The Clovers contract is the interface for the CloversController Contract
 */


contract IClubTokenController {
    function buy(address buyer) public payable returns(bool);
    function transferFrom(address from, address to, uint256 amount) public;
}

// File: contracts/ISimpleCloversMarket.sol

contract ISimpleCloversMarket {
    function sell(uint256 _tokenId, uint256 price) public;
}

// File: zeppelin-solidity/contracts/ownership/Ownable.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}

// File: zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * See https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

// File: zeppelin-solidity/contracts/token/ERC20/ERC20.sol

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender)
    public view returns (uint256);

  function transferFrom(address from, address to, uint256 value)
    public returns (bool);

  function approve(address spender, uint256 value) public returns (bool);
  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
}

// File: zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure.
 * To use this library you can add a `using SafeERC20 for ERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
  function safeTransfer(ERC20Basic token, address to, uint256 value) internal {
    require(token.transfer(to, value));
  }

  function safeTransferFrom(
    ERC20 token,
    address from,
    address to,
    uint256 value
  )
    internal
  {
    require(token.transferFrom(from, to, value));
  }

  function safeApprove(ERC20 token, address spender, uint256 value) internal {
    require(token.approve(spender, value));
  }
}

// File: zeppelin-solidity/contracts/ownership/CanReclaimToken.sol

/**
 * @title Contracts that should be able to recover tokens
 * @author SylTi
 * @dev This allow a contract to recover any ERC20 token received in a contract by transferring the balance to the contract owner.
 * This will prevent any accidental loss of tokens.
 */
contract CanReclaimToken is Ownable {
  using SafeERC20 for ERC20Basic;

  /**
   * @dev Reclaim all ERC20Basic compatible tokens
   * @param token ERC20Basic The address of the token contract
   */
  function reclaimToken(ERC20Basic token) external onlyOwner {
    uint256 balance = token.balanceOf(this);
    token.safeTransfer(owner, balance);
  }

}

// File: zeppelin-solidity/contracts/ownership/HasNoTokens.sol

/**
 * @title Contracts that should not own Tokens
 * @author Remco Bloemen <remco@2π.com>
 * @dev This blocks incoming ERC223 tokens to prevent accidental loss of tokens.
 * Should tokens (any ERC20Basic compatible) end up in the contract, it allows the
 * owner to reclaim the tokens.
 */
contract HasNoTokens is CanReclaimToken {

 /**
  * @dev Reject all ERC223 compatible tokens
  * @param from_ address The address that is transferring the tokens
  * @param value_ uint256 the amount of the specified token
  * @param data_ Bytes The data passed from the caller.
  */
  function tokenFallback(address from_, uint256 value_, bytes data_) external {
    from_;
    value_;
    data_;
    revert();
  }

}

// File: zeppelin-solidity/contracts/ownership/HasNoEther.sol

/**
 * @title Contracts that should not own Ether
 * @author Remco Bloemen <remco@2π.com>
 * @dev This tries to block incoming ether to prevent accidental loss of Ether. Should Ether end up
 * in the contract, it will allow the owner to reclaim this ether.
 * @notice Ether can still be sent to this contract by:
 * calling functions labeled `payable`
 * `selfdestruct(contract_address)`
 * mining directly to the contract address
 */
contract HasNoEther is Ownable {

  /**
  * @dev Constructor that rejects incoming Ether
  * The `payable` flag is added so we can access `msg.value` without compiler warning. If we
  * leave out payable, then Solidity will allow inheriting contracts to implement a payable
  * constructor. By doing it this way we prevent a payable constructor from working. Alternatively
  * we could use assembly to access msg.value.
  */
  constructor() public payable {
    require(msg.value == 0);
  }

  /**
   * @dev Disallows direct send by settings a default function without the `payable` flag.
   */
  function() external {
  }

  /**
   * @dev Transfer all Ether held by the contract to the owner.
   */
  function reclaimEther() external onlyOwner {
    owner.transfer(address(this).balance);
  }
}

// File: zeppelin-solidity/contracts/math/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

// File: contracts/CloversController.sol

pragma experimental ABIEncoderV2;

/**
 * The CloversController is a replaceable endpoint for minting and unminting Clovers.sol and ClubToken.sol
 */











contract CloversController is HasNoEther, HasNoTokens {
    event cloverCommitted(bytes32 movesHash, address owner);
    event cloverClaimed(bytes28[2] moves, uint256 tokenId, address owner, uint stake, uint reward, uint256 symmetries, bool keep);
    event stakeRetrieved(uint256 tokenId, address owner, uint stake);
    event cloverChallenged(bytes28[2] moves, uint256 tokenId, address owner, address challenger, uint stake);

    using SafeMath for uint256;

    address public oracle;
    address public clovers;
    address public clubToken;
    address public clubTokenController;
    address public simpleCloversMarket;

    uint256 public basePrice;
    uint256 public priceMultiplier;
    uint256 public payMultiplier;
    uint256 public stakeAmount;
    uint256 public stakePeriod;

    struct Commit {
        bool collected;
        uint256 stake;
        address committer;
    }

    mapping (bytes32 => Commit) public commits;

    constructor(address _clovers, address _clubToken, address _clubTokenController) public {
        clovers = _clovers;
        clubToken = _clubToken;
        clubTokenController = _clubTokenController;
    }
    /**
    * @dev Gets the current stake of a Clover based on the hash of the moves.
    * @param movesHash The hash of the moves that make up the clover.
    * @return A uint256 value of stake.
    */
    function getStake(bytes32 movesHash) public view returns (uint256) {
        return commits[movesHash].stake;
    }
    /**
    * @dev Gets the address of the committer of a Clover based on the hash of the moves.
    * @param movesHash The hash of the moves that make up the clover.
    * @return The address of the committer.
    */
    function getCommit(bytes32 movesHash) public view returns (address) {
        return commits[movesHash].committer;
    }
    /**
    * @dev Gets the current staking period needed to verify a Clover.
    * @param _tokenId The token Id of the clover.
    * @return A uint256 value of stake period in seconds.
    */
    function getMovesHash(uint _tokenId) public constant returns (bytes32) {
        return keccak256(IClovers(clovers).getCloverMoves(_tokenId));
    }
    /**
    * @dev Checks whether the game is valid.
    * @param moves The moves needed to play validate the game.
    * @return A boolean representing whether or not the game is valid.
    */
    function isValid(bytes28[2] moves) public constant returns (bool) {
        Reversi.Game memory game = Reversi.playGame(moves);
        return isValidGame(game);
    }

    /**
    * @dev Checks whether the game is valid.
    * @param game The pre-played game.
    * @return A boolean representing whether or not the game is valid.
    */
    function isValidGame(Reversi.Game game) public pure returns (bool) {
        if (game.error) return false;
        if (!game.complete) return false;
        return true;
    }
    /**
    * @dev Checks whether the game has passed the verification period.
    * @param _tokenId The board being checked.
    * @return A boolean representing whether or not the game has been verified.
    */
    function isVerified(uint256 _tokenId) public constant returns (bool) {
        uint256 _blockMinted = IClovers(clovers).getBlockMinted(_tokenId);
        if(_blockMinted == 0) return false;
        return block.number.sub(_blockMinted) > stakePeriod;
    }
    /**
    * @dev Calculates the reward of the board.
    * @param _symmetries symmetries saved as a uint256 value like 00010101 where bits represent symmetry types.
    * @return A uint256 representing the reward that would be returned for claiming the board.
    */
    function calculateReward(uint256 _symmetries) public constant returns (uint256) {
        uint256 Symmetricals;
        uint256 RotSym;
        uint256 Y0Sym;
        uint256 X0Sym;
        uint256 XYSym;
        uint256 XnYSym;
        (Symmetricals,
        RotSym,
        Y0Sym,
        X0Sym,
        XYSym,
        XnYSym) = IClovers(clovers).getAllSymmetries();
        uint256 base = 0;
        if (_symmetries >> 4 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(RotSym + 1));
        if (_symmetries >> 3 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(Y0Sym + 1));
        if (_symmetries >> 2 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(X0Sym + 1));
        if (_symmetries >> 1 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(XYSym + 1));
        if (_symmetries & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(XnYSym + 1));
        return base;
    }

/*
    // NOTE: Disabled to reduce contract size
    function instantClaimClover(bytes28[2] moves, bool _keep) public payable returns (bool) {
        Reversi.Game memory game = Reversi.playGame(moves);
        require(isValidGame(game));
        uint256 tokenId = uint256(game.board);
        require(IClovers(clovers).getBlockMinted(tokenId) == 0);
        require(!IClovers(clovers).exists(tokenId));
        IClovers(clovers).setBlockMinted(tokenId, block.number);
        IClovers(clovers).setCloverMoves(tokenId, moves);

        uint256 symmetries = Reversi.returnSymmetricals(game.RotSym, game.Y0Sym, game.X0Sym, game.XYSym, game.XnYSym);
        uint256 reward;

        if (uint256(symmetries) > 0) {
            IClovers(clovers).setSymmetries(tokenId, uint256(symmetries));
            reward = calculateReward(uint256(symmetries));
            IClovers(clovers).setReward(tokenId, reward);
        }
        if (_keep) {
            // If the user decides to keep the Clover, they must
            // pay for it in club tokens according to the reward price.
            if (IClubToken(clubToken).balanceOf(msg.sender) < reward) {
                IClubTokenController(clubTokenController).buy(msg.sender); // msg.value needs to be enough to buy "reward" amount of Club Token
            }
            if (reward > 0) {
                // IClubToken(clubToken).transferFrom(msg.sender, clubToken, reward); // if we'd rather keep the money
                IClubToken(clubToken).burn(msg.sender, reward);
            }
            IClovers(clovers).mint(msg.sender, tokenId);
        } else {
            // If the user decides not to keep the Clover, they will
            // receive the reward price in club tokens, and the clover will
            // go for sale at 10x the reward price.
            if (reward > 0) {
                require(IClubToken(clubToken).mint(msg.sender, reward));
            }
            IClovers(clovers).mint(clovers, tokenId);
        }

    } */


    /**
    * @dev Claim the Clover without a commit or reveal. Payable so you can attach enough for the stake,
    * as well as enough to buy tokens if needed to keep the Clover.
    * @param moves The moves that make up the Clover reversi game.
    * @param _tokenId The board that results from the moves.
    * @param _symmetries symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * types.
    * @return A boolean representing whether or not the claim was successful.
    */
    function claimClover(bytes28[2] moves, uint256 _tokenId, uint256 _symmetries, bool _keep) public payable returns (bool) {
        bytes32 movesHash = keccak256(moves);

        require(msg.value >= stakeAmount);
        require(getCommit(movesHash) == 0);

        setCommit(movesHash, msg.sender);
        if (stakeAmount > 0) {
            setStake(movesHash, stakeAmount);
            clovers.transfer(stakeAmount);
        }

        emit cloverCommitted(movesHash, msg.sender);

        require(!IClovers(clovers).exists(_tokenId));
        require(IClovers(clovers).getBlockMinted(_tokenId) == 0);

        IClovers(clovers).setBlockMinted(_tokenId, block.number);
        IClovers(clovers).setCloverMoves(_tokenId, moves);
        IClovers(clovers).setKeep(_tokenId, _keep);

        uint256 reward;
        if (_symmetries > 0) {
            IClovers(clovers).setSymmetries(_tokenId, _symmetries);
            reward = calculateReward(_symmetries);
            IClovers(clovers).setReward(_tokenId, reward);
        }
        uint256 price = basePrice.add(reward);
        if (_keep && price > 0) {
            // If the user decides to keep the Clover, they must
            // pay for it in club tokens according to the reward price.
            if (IClubToken(clubToken).balanceOf(msg.sender) < price) {
                IClubTokenController(clubTokenController).buy(msg.sender);
            }
            IClubToken(clubToken).transferFrom(msg.sender, clovers, price);
            /* IClubToken(clubToken).burn(committer, price); */
        }
        IClovers(clovers).mint(clovers, _tokenId);
        emit cloverClaimed(moves, _tokenId, msg.sender, stakeAmount, reward, _symmetries, _keep);

        return true;
    }
    /**
    * @dev Commit the hash of the moves needed to claim the Clover. A stake should be
    * made for counterfactual verification.
    * @param movesHash The hash of the moves that makes up the Clover reversi
    * game.
    * @return A boolean representing whether or not the commit was successful.
    NOTE: Disabled for contract size, if front running becomes a problem it can be
    implemented with an upgrade
    */
    /* function claimCloverCommit(bytes32 movesHash) public payable returns (bool) {
        require(msg.value <= stakeAmount);
        require(getCommit(movesHash) == 0);

        setCommit(movesHash, msg.sender);
        setStake(movesHash, stakeAmount);

        clovers.transfer(stakeAmount);

        emit cloverCommitted(movesHash, msg.sender);
        return true;
    } */
    /**
    * @dev Reveal the solution to the previous commit to claim the Clover.
    * @param moves The moves that make up the Clover reversi game.
    * @param _tokenId The board that results from the moves.
    * @param _symmetries symmetries saved as a uint256 value like 00010101 where bits represent symmetry types.
    * @return A boolean representing whether or not the reveal and claim was successful.
    NOTE: Disabled for contract size, if front running becomes a problem it can be implemented with an upgrade
    */
    /* function claimCloverReveal(bytes28[2] moves, uint256 _tokenId, uint256 _symmetries, bool _keep) public returns (bool) {
        bytes32 movesHash = keccak256(moves);
        address committer = getCommit(movesHash);

        require(IClovers(clovers).getBlockMinted(_tokenId) == 0);

        IClovers(clovers).setBlockMinted(_tokenId, block.number);
        IClovers(clovers).setCloverMoves(_tokenId, moves);
        IClovers(clovers).setKeep(_tokenId, _keep);
        uint256 reward;
        if (_symmetries > 0) {
            IClovers(clovers).setSymmetries(_tokenId, _symmetries);
            reward = calculateReward(_symmetries);
            IClovers(clovers).setReward(_tokenId, reward);
        }
        if (_keep) {
            IClubToken(clubToken).increaseApproval(address(this), basePrice.add(reward));
        }
        uint256 stake = getStake(movesHash);
        emit cloverClaimed(moves, _tokenId, committer, stake, reward, _symmetries, _keep);
        return true;
    } */

    /**
    * @dev Retrieve the stake from a Clover claim after the stake period has ended, or with the authority of the oracle.
    * @param _tokenId The board which holds the stake.
    * @return A boolean representing whether or not the retrieval was successful.
    */
    function retrieveStake(uint256 _tokenId) public payable returns (bool) {
        bytes28[2] memory moves = IClovers(clovers).getCloverMoves(_tokenId);
        bytes32 movesHash = keccak256(moves);

        require(!commits[movesHash].collected);
        commits[movesHash].collected = true;

        require(isVerified(_tokenId) || msg.sender == owner || msg.sender == oracle);

        uint256 stake = getStake(movesHash);
        addSymmetries(_tokenId);
        address committer = getCommit(movesHash);
        require(msg.sender == committer);

        uint256 reward = IClovers(clovers).getReward(_tokenId);
        bool _keep = IClovers(clovers).getKeep(_tokenId);

        if (_keep) {
            // If the user decided to keep the Clover, they will
            // receive the clover now that it has been verified
            IClovers(clovers).transferFrom(clovers, committer, _tokenId);
        } else {
            // If the user decided not to keep the Clover, they will
            // receive the reward price in club tokens, and the clover will
            // go for sale by the contract.
            ISimpleCloversMarket(simpleCloversMarket).sell(_tokenId, basePrice.add(reward.mul(priceMultiplier)));
            if (reward > 0) {
                require(IClubToken(clubToken).mint(committer, reward));
            }
        }
        if (stake > 0) {
            IClovers(clovers).moveEth(committer, stake);
        }
        emit stakeRetrieved(_tokenId, committer, stake);
        return true;
    }


    /**
    * @dev Convert a bytes16 board into a uint256.
    * @param _board The board being converted.
    * @return number the uint256 being converted.
    */
    function convertBytes16ToUint(bytes16 _board) public view returns(uint256 number) {
        for(uint i=0;i<_board.length;i++){
            number = number + uint(_board[i])*(2**(8*(_board.length-(i+1))));
        }
    }

    /**
    * @dev Challenge a staked Clover for being invalid.
    * @param _tokenId The board being challenged.
    * @return A boolean representing whether or not the challenge was successful.
    */
    function challengeClover(uint256 _tokenId) public returns (bool) {
        bool valid = true;
        bytes28[2] memory moves = IClovers(clovers).getCloverMoves(_tokenId);

        if (msg.sender != owner && msg.sender != oracle) {
            Reversi.Game memory game = Reversi.playGame(moves);
            if(convertBytes16ToUint(game.board) != _tokenId) {
                valid = false;
            }
            if(valid && isValidGame(game)) {
                uint256 _symmetries = IClovers(clovers).getSymmetries(_tokenId);
                valid = (_symmetries >> 4 & 1) > 0 == game.RotSym ? valid : false;
                valid = (_symmetries >> 3 & 1) > 0 == game.Y0Sym ? valid : false;
                valid = (_symmetries >> 2 & 1) > 0 == game.X0Sym ? valid : false;
                valid = (_symmetries >> 1 & 1) > 0 == game.XYSym ? valid : false;
                valid = (_symmetries & 1) > 0 == game.XnYSym ? valid : false;
            } else {
                valid = false;
            }
            require(!valid);
        }
        bytes32 movesHash = keccak256(moves);
        uint256 stake = getStake(movesHash);
        if (!isVerified(_tokenId) && stake > 0) {
            IClovers(clovers).moveEth(msg.sender, stake);
        }
        if (commits[movesHash].collected) {
            removeSymmetries(_tokenId);
        }

        address committer = getCommit(movesHash);
        emit cloverChallenged(moves, _tokenId, committer, msg.sender, stake);

        IClovers(clovers).deleteClover(_tokenId);
        deleteCommit(movesHash);
        return true;
    }


    /**
    * @dev Moves clovers without explicit allow permission for use by simpleCloversMarket
    * in order to avoid double transaction (allow, transferFrom)
    * @param _from The current owner of the Clover
    * @param _to The future owner of the Clover
    * @param _tokenId The Clover
    */
    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        require(msg.sender == simpleCloversMarket);
        IClovers(clovers).transferFrom(_from, _to, _tokenId);
    }

    /**
    * @dev Updates oracle Address.
    * @param _oracle The new oracle Address.
    */
    function updateOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    /**
    * @dev Updates simpleCloversMarket Address.
    * @param _simpleCloversMarket The new simpleCloversMarket address.
    */
    function updateSimpleCloversMarket(address _simpleCloversMarket) public onlyOwner {
        simpleCloversMarket = _simpleCloversMarket;
    }

    /**
    * @dev Updates clubTokenController Address.
    * @param _clubTokenController The new clubTokenController address.
    */
    function updateClubTokenController(address _clubTokenController) public onlyOwner {
        clubTokenController = _clubTokenController;
    }
    /**
    * @dev Updates the stake amount.
    * @param _stakeAmount The new amount needed to stake.
    */
    function updateStakeAmount(uint256 _stakeAmount) public onlyOwner {
        stakeAmount = _stakeAmount;
    }
    /**
    * @dev Updates the stake period.
    * @param _stakePeriod The uint256 value of time needed to stake before being verified.
    */
    function updateStakePeriod(uint256 _stakePeriod) public onlyOwner {
        stakePeriod = _stakePeriod;
    }
    /**
    * @dev Updates the pay multiplier, used to calculate token reward.
    * @param _payMultiplier The uint256 value of pay multiplier.
    */
    function updatePayMultipier(uint256 _payMultiplier) public onlyOwner {
        payMultiplier = _payMultiplier;
    }
    /**
    * @dev Updates the price multiplier, used to calculate the clover price (multiplied by the original reward).
    * @param _priceMultiplier The uint256 value of the price multiplier.
    */
    function updatePriceMultipier(uint256 _priceMultiplier) public onlyOwner {
        priceMultiplier = _priceMultiplier;
    }
    /**
    * @dev Updates the base price, used to calculate the clover cost.
    * @param _basePrice The uint256 value of the base price.
    */
    function updateBasePrice(uint256 _basePrice) public onlyOwner {
        basePrice = _basePrice;
    }

    /**
    * @dev Sets the stake of a Clover based on the hash of the moves.
    * @param movesHash The hash of the moves that make up the clover.
    * @param stake A uint256 value of stake.
    */
    function setStake(bytes32 movesHash, uint256 stake) private {
        commits[movesHash].stake = stake;
    }

    /**
    * @dev Sets the address of the committer of a Clover based on the hash of the moves.
    * @param movesHash The hash of the moves that make up the clover.
    * @param committer The address of the committer.
    */
    function setCommit(bytes32 movesHash, address committer) private {
        commits[movesHash].committer = committer;
    }

    function _setCommit(bytes32 movesHash, address committer) onlyOwner {
        setCommit(movesHash, committer);
    }
    function deleteCommit(bytes32 movesHash) private {
        delete(commits[movesHash]);
    }

    /**
    * @dev Adds new tallys of the totals numbers of clover symmetries.
    * @param _tokenId The token which needs to be examined.
    */
    function addSymmetries(uint256 _tokenId) private {
        uint256 Symmetricals;
        uint256 RotSym;
        uint256 Y0Sym;
        uint256 X0Sym;
        uint256 XYSym;
        uint256 XnYSym;
        (Symmetricals,
        RotSym,
        Y0Sym,
        X0Sym,
        XYSym,
        XnYSym) = IClovers(clovers).getAllSymmetries();
        uint256 _symmetries = IClovers(clovers).getSymmetries(_tokenId);
        Symmetricals = Symmetricals.add(_symmetries > 0 ? 1 : 0);
        RotSym = RotSym.add(uint256(_symmetries >> 4 & 1));
        Y0Sym = Y0Sym.add(uint256(_symmetries >> 3 & 1));
        X0Sym = X0Sym.add(uint256(_symmetries >> 2 & 1));
        XYSym = XYSym.add(uint256(_symmetries >> 1 & 1));
        XnYSym = XnYSym.add(uint256(_symmetries & 1));
        IClovers(clovers).setAllSymmetries(Symmetricals, RotSym, Y0Sym, X0Sym, XYSym, XnYSym);
    }
    /**
    * @dev Remove false tallys of the totals numbers of clover symmetries.
    * @param _tokenId The token which needs to be examined.
    */
    function removeSymmetries(uint256 _tokenId) private {
        uint256 Symmetricals;
        uint256 RotSym;
        uint256 Y0Sym;
        uint256 X0Sym;
        uint256 XYSym;
        uint256 XnYSym;
        (Symmetricals,
        RotSym,
        Y0Sym,
        X0Sym,
        XYSym,
        XnYSym) = IClovers(clovers).getAllSymmetries();
        uint256 _symmetries = IClovers(clovers).getSymmetries(_tokenId);
        Symmetricals = Symmetricals.sub(_symmetries > 0 ? 1 : 0);
        RotSym = RotSym.sub(uint256(_symmetries >> 4 & 1));
        Y0Sym = Y0Sym.sub(uint256(_symmetries >> 3 & 1));
        X0Sym = X0Sym.sub(uint256(_symmetries >> 2 & 1));
        XYSym = XYSym.sub(uint256(_symmetries >> 1 & 1));
        XnYSym = XnYSym.sub(uint256(_symmetries & 1));
        IClovers(clovers).setAllSymmetries(Symmetricals, RotSym, Y0Sym, X0Sym, XYSym, XnYSym);
    }

}
