pragma solidity ^0.5.9;

/**
 * The CloversController is a replaceable endpoint for minting and unminting Clovers.sol and ClubToken.sol
 */

import "./IReversi.sol";
import "./IClovers.sol";
import "./IClubToken.sol";
import "./IClubTokenController.sol";
import "./ISimpleCloversMarket.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";

contract CloversController is Ownable {
    event cloverCommitted(bytes32 movesHash, address owner);
    event cloverClaimed(bytes28[2] moves, uint256 tokenId, address sender, address recepient, uint reward, uint256 symmetries, bool keep);
    event cloverChallenged(bytes28[2] moves, uint256 tokenId, address owner, address challenger);

    using SafeMath for uint256;
    using ECDSA for bytes32;

    bool public paused;
    address public oracle;
    address public clovers;
    address public clubToken;
    address public clubTokenController;
    address public simpleCloversMarket;

    uint256 public gasLastUpdated_fastGasPrice_averageGasPrice_safeLowGasPrice;
    uint256 public gasBlockMargin = 240; // ~1 hour at 15 second blocks

    uint256 public basePrice;
    uint256 public priceMultiplier;
    uint256 public payMultiplier;

    mapping(bytes32=>bool) public commits;

    modifier notPaused() {
        require(!paused, "Must not be paused");
        _;
    }

    constructor(address _clovers, address _clubToken, address _clubTokenController) public {
        clovers = _clovers;
        clubToken = _clubToken;
        clubTokenController = _clubTokenController;
        paused = true;
    }
   
    /**
    * @dev Gets the current staking period needed to verify a Clover.
    * @param tokenId The token Id of the clover.
    * @return moves hash
    */
    function getMovesHashByClover(uint tokenId) public view returns (bytes32) {
        return getMovesHashByMoves(IClovers(clovers).getCloverMoves(tokenId));
    }

    function getMovesHashByMoves(bytes28[2] memory moves) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(moves));
    }

    /**
    * @dev Checks whether the game is valid.
    * @param moves The moves needed to play validate the game.
    * @return A boolean representing whether or not the game is valid.
    */
    function isValid(bytes28[2] memory moves) public pure returns (bool) {
        IReversi.Game memory game = IReversi.playGame(moves);
        return isValidGame(game.error, game.complete);
    }

    /**
    * @dev Checks whether the game is valid.
    * @param error The pre-played game error
    * @param complete The pre-played game complete boolean
    * @return A boolean representing whether or not the game is valid.
    */
    function isValidGame(bool error, bool complete) public pure returns (bool) {
        if (error) return false;
        if (!complete) return false;
        return true;
    }
   
    /**
    * @dev Calculates the reward of the board.
    * @param symmetries symmetries saved as a uint256 value like 00010101 where bits represent symmetry types.
    * @return A uint256 representing the reward that would be returned for claiming the board.
    */
    function calculateReward(uint256 symmetries) public view returns (uint256) {
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
        if (symmetries >> 4 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(RotSym + 1));
        if (symmetries >> 3 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(Y0Sym + 1));
        if (symmetries >> 2 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(X0Sym + 1));
        if (symmetries >> 1 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(XYSym + 1));
        if (symmetries & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(XnYSym + 1));
        return base;
    }

    function getPrice(uint256 symmetries) public view returns(uint256) {
        return basePrice.add(calculateReward(symmetries));
    }

    function claimCloverWithVerificationCommit(bytes32 movesHash, bytes32 movesHashWithRecepient) public {
        commits[movesHash] = true;
        commits[movesHashWithRecepient] = true;
    }

    function claimCloverWithVerificationReveal(bytes28[2] memory moves, bool keep) public payable returns (bool) {
        require(commits[keccak256(abi.encodePacked(moves, keep, msg.sender))], "No commit with that info");
        require(claimCloverWithVerification(moves, keep), "Claim must succeed");
        return true;
    }

    function claimCloverWithVerification(bytes28[2] memory moves, bool keep) internal returns (bool) {
        IReversi.Game memory game = IReversi.playGame(moves);
        require(isValidGame(game.error, game.complete), "Invalid game");
        uint256 tokenId = convertBytes16ToUint(game.board);
        require(!IClovers(clovers).exists(tokenId), "Clover already exists");
  
        uint256 symmetries = IReversi.returnSymmetricals(game.RotSym, game.Y0Sym, game.X0Sym, game.XYSym, game.XnYSym);
        require(_claimClover(tokenId, symmetries, msg.sender, keep), "Claim must succeed");
        return true;
    }



    /**
    * @dev Claim the Clover without a commit or reveal. Payable so you can buy tokens if needed.
    * @param moves The moves that make up the Clover reversi game.
    * @param tokenId The board that results from the moves.
    * @param symmetries symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * @param keep symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * @param recepient symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * @param signature symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * types.
    * @return A boolean representing whether or not the claim was successful.
    */
    function claimCloverWithSignature(bytes28[2] memory moves, uint256 tokenId, uint256 symmetries, bool keep, address recepient, bytes memory signature) public payable notPaused returns (bool) {
        require(!IClovers(clovers).exists(tokenId), "Clover already exists");
        require(!commits[getMovesHashByMoves(moves)], "Moves already committed");
        bytes32 hash = toEthSignedMessageHash(getHash(tokenId, moves, symmetries, keep, recepient));
        address result = recover(hash, signature);
        require(result != address(0) && result == oracle, "Invalid signature");

        require(_claimClover(moves, tokenId, symmetries, recepient, keep), "Claim must succeed");

        return true;
    }


    function _claimClover(bytes28[2] memory moves, uint256 tokenId, uint256 symmetries, address recepient, bool keep) internal returns (bool) {
        IClovers(clovers).setCloverMoves(tokenId, moves);
        IClovers(clovers).setKeep(tokenId, keep);

        uint256 reward;
        if (symmetries > 0) {
            IClovers(clovers).setSymmetries(tokenId, symmetries);
            reward = calculateReward(symmetries);
            IClovers(clovers).setReward(tokenId, reward);
        }
        uint256 price = basePrice.add(reward);
        if (keep && price > 0) {
            // If the user decides to keep the Clover, they must
            // pay for it in club tokens according to the reward price.
            if (IClubToken(clubToken).balanceOf(msg.sender) < price) {
                IClubTokenController(clubTokenController).buy.value(msg.value)(msg.sender);
            }
            IClubToken(clubToken).burn(msg.sender, price);
        }

        if (keep) {
            // If the user decided to keep the Clover
            IClovers(clovers).mint(recepient, tokenId);
        } else {
            // If the user decided not to keep the Clover, they will
            // receive the reward price in club tokens, and the clover will
            // go for sale by the contract.
            IClovers(clovers).mint(clovers, tokenId);
            ISimpleCloversMarket(simpleCloversMarket).sell(tokenId, basePrice.add(reward.mul(priceMultiplier)));
            if (reward > 0) {
                require(IClubToken(clubToken).mint(recepient, reward), "mint must succeed");
            }
        }
        emit cloverClaimed(moves, tokenId, msg.sender, recepient, reward, symmetries, keep);
    }


    /**
    * @dev Convert a bytes16 board into a uint256.
    * @param _board The board being converted.
    * @return number the uint256 being converted.
    */
    function convertBytes16ToUint(bytes16 _board) public pure returns(uint256 number) {
        for(uint i=0;i<_board.length;i++){
            number = number + uint(uint8(_board[i]))*(2**(8*(_board.length-(i+1))));
        }
    }


    /**
    * @dev Challenge a Clover for being invalid.
    * @param tokenId The board being challenged.
    * @return A boolean representing whether or not the challenge was successful.
    */
    function challengeClover(uint256 tokenId) public returns (bool) {
        require(IClovers(clovers).exists(tokenId), "Clover must exist to be challenged");
        bool valid = true;
        bytes28[2] memory moves = IClovers(clovers).getCloverMoves(tokenId);
        address payable _owner = address(uint160(owner()));
        if (msg.sender != _owner && msg.sender != oracle) {
            IReversi.Game memory game = IReversi.playGame(moves);
            if(convertBytes16ToUint(game.board) != tokenId) {
                valid = false;
            }
            if(valid && isValidGame(game.error, game.complete)) {
                uint256 symmetries = IClovers(clovers).getSymmetries(tokenId);
                valid = (symmetries >> 4 & 1) > 0 == game.RotSym ? valid : false;
                valid = (symmetries >> 3 & 1) > 0 == game.Y0Sym ? valid : false;
                valid = (symmetries >> 2 & 1) > 0 == game.X0Sym ? valid : false;
                valid = (symmetries >> 1 & 1) > 0 == game.XYSym ? valid : false;
                valid = (symmetries & 1) > 0 == game.XnYSym ? valid : false;
            } else {
                valid = false;
            }
            require(!valid, "Must be invalid to challenge");
        }

        removeSymmetries(tokenId);
        address committer = IClovers(clovers).ownerOf(tokenId);
        emit cloverChallenged(moves, tokenId, committer, msg.sender);
        IClovers(clovers).deleteClover(tokenId);
        return true;
    }

    function updateSalePrice(uint256 tokenId, uint256 _price) public onlyOwner {
        ISimpleCloversMarket(simpleCloversMarket).sell(tokenId, _price);
    }

    /**
    * @dev Moves clovers without explicit allow permission for use by simpleCloversMarket
    * in order to avoid double transaction (allow, transferFrom)
    * @param _from The current owner of the Clover
    * @param _to The future owner of the Clover
    * @param tokenId The Clover
    */
    function transferFrom(address _from, address _to, uint256 tokenId) public {
        require(msg.sender == simpleCloversMarket, "transferFrom can only be done by simpleCloversMarket");
        IClovers(clovers).transferFrom(_from, _to, tokenId);
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
    * @dev Adds new tallys of the totals numbers of clover symmetries.
    * @param tokenId The token which needs to be examined.
    */
    function addSymmetries(uint256 tokenId) private {
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
        uint256 symmetries = IClovers(clovers).getSymmetries(tokenId);
        Symmetricals = Symmetricals.add(symmetries > 0 ? 1 : 0);
        RotSym = RotSym.add(uint256(symmetries >> 4 & 1));
        Y0Sym = Y0Sym.add(uint256(symmetries >> 3 & 1));
        X0Sym = X0Sym.add(uint256(symmetries >> 2 & 1));
        XYSym = XYSym.add(uint256(symmetries >> 1 & 1));
        XnYSym = XnYSym.add(uint256(symmetries & 1));
        IClovers(clovers).setAllSymmetries(Symmetricals, RotSym, Y0Sym, X0Sym, XYSym, XnYSym);
    }
    /**
    * @dev Remove false tallys of the totals numbers of clover symmetries.
    * @param tokenId The token which needs to be examined.
    */
    function removeSymmetries(uint256 tokenId) private {
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
        uint256 symmetries = IClovers(clovers).getSymmetries(tokenId);
        Symmetricals = Symmetricals.sub(symmetries > 0 ? 1 : 0);
        RotSym = RotSym.sub(uint256(symmetries >> 4 & 1));
        Y0Sym = Y0Sym.sub(uint256(symmetries >> 3 & 1));
        X0Sym = X0Sym.sub(uint256(symmetries >> 2 & 1));
        XYSym = XYSym.sub(uint256(symmetries >> 1 & 1));
        XnYSym = XnYSym.sub(uint256(symmetries & 1));
        IClovers(clovers).setAllSymmetries(Symmetricals, RotSym, Y0Sym, X0Sym, XYSym, XnYSym);
    }

    function getHash(uint256 tokenId, bytes28[2] memory moves) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenId, moves));
    }
    function recover(bytes32 hash, bytes memory signature) public pure returns (address) {
        return hash.recover(signature);
    }
    function toEthSignedMessageHash(bytes32 hash) public pure returns (bytes32) {
        return hash.toEthSignedMessageHash();
    }
}
