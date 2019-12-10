pragma solidity ^0.5.9;

/**
 * The CloversController is a replaceable endpoint for minting and unminting Clovers.sol and ClubToken.sol
 */

import "./Reversi.sol";
import "./IClovers.sol";
import "./IClubToken.sol";
import "./IClubTokenController.sol";
import "./ISimpleCloversMarket.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";

contract CloversController is Ownable {
    event cloverCommitted(bytes32 movesHash, address owner);
    event cloverClaimed(uint256 tokenId, bytes28[2] moves, address sender, address recipient, uint reward, uint256 symmetries, bool keep);
    event cloverChallenged(uint256 tokenId, bytes28[2] moves, address owner, address challenger);

    using SafeMath for uint256;
    using ECDSA for bytes32;

    bool public paused;
    address payable public oracle;
    IClovers public clovers;
    IClubToken public clubToken;
    IClubTokenController public clubTokenController;
    ISimpleCloversMarket public simpleCloversMarket;
    // Reversi public reversi;

    uint256 public gasLastUpdated_fastGasPrice_averageGasPrice_safeLowGasPrice;
    uint256 public gasBlockMargin = 240; // ~1 hour at 15 second blocks

    uint256 public basePrice;
    uint256 public priceMultiplier;
    uint256 public payMultiplier;

    mapping(bytes32=>address) public commits;

    modifier notPaused() {
        require(!paused, "Must not be paused");
        _;
    }

    constructor(
        IClovers _clovers,
        IClubToken _clubToken,
        IClubTokenController _clubTokenController
        // Reversi _reversi
    ) public {
        clovers = _clovers;
        clubToken = _clubToken;
        clubTokenController = _clubTokenController;
        // reversi = _reversi;
        paused = true;
    }

    function getMovesHash(bytes28[2] memory moves) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(moves));
    }

    function getMovesHashWithRecipient(bytes32 movesHash, address recipient) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(movesHash, recipient));
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

    function getGame (bytes28[2] memory moves) public pure returns (bool error, bool complete, bool symmetrical, bytes16 board, uint8 currentPlayer, uint8 moveKey) {
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
        XnYSym) = clovers.getAllSymmetries();
        uint256 base = 0;
        if (symmetries >> 4 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(RotSym + 1));
        if (symmetries >> 3 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(Y0Sym + 1));
        if (symmetries >> 2 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(X0Sym + 1));
        if (symmetries >> 1 & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(XYSym + 1));
        if (symmetries & 1 == 1) base = base.add(payMultiplier.mul(Symmetricals + 1).div(XnYSym + 1));
        return base;
    }

    function calculateRewardFunctional(
        uint256 symmetries,
        uint256 Symmetricals,
        uint256 RotSym,
        uint256 Y0Sym,
        uint256 X0Sym,
        uint256 XYSym,
        uint256 XnYSym
    ) public view returns (
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256
    ) {
        uint256 base = 0;

        if (symmetries >> 4 & 1 == 1) {
            base += payMultiplier * (Symmetricals + 1) / (RotSym + 1);
            RotSym += 1;
        }
        if (symmetries >> 3 & 1 == 1) {
            base += payMultiplier * (Symmetricals + 1) / (Y0Sym + 1);
            Y0Sym += 1;
        }
        if (symmetries >> 2 & 1 == 1) {
            base += payMultiplier * (Symmetricals + 1) / (X0Sym + 1);
            X0Sym += 1;
        }
        if (symmetries >> 1 & 1 == 1) {
            base += payMultiplier * (Symmetricals + 1) / (XYSym + 1);
            XYSym += 1;
        }
        if (symmetries & 1 == 1) {
            base += payMultiplier * (Symmetricals + 1) / (XnYSym + 1);
            XnYSym += 1;
        }
        if (symmetries > 0) {
            Symmetricals += 1;
        }
        return (base, Symmetricals, RotSym, Y0Sym, X0Sym, XYSym, XnYSym);
    }

    function getPrice(uint256 symmetries) public view returns(uint256) {
        return basePrice.add(calculateReward(symmetries));
    }

    // In order to prevent commit reveal griefing the first commit is a combined hash of the moves and the recipient.
    // In order to use the same commit mapping, we mark this hash simply as address(1) so it is no longer the equivalent of address(0)
    function claimCloverSecurelyPartOne(bytes32 movesHashWithRecipient, address recipient) public {
        commits[movesHashWithRecipient] = address(1);
        commits[keccak256(abi.encodePacked(recipient))] = address(block.number);
    }

    // Once a commit has been made to guarantee the move hash is associated with the recipient we can make a commit on the hash of the moves themselves
    // If we were to make a claim on the moves in plaintext, the transaction could be front run on the claimCloverWithVerification or the claimCloverWithSignature
    function claimCloverSecurelyPartTwo(bytes32 movesHash, address recipient) public {
        require(uint256(commits[keccak256(abi.encodePacked(recipient))]) < block.number, "Can't combine step1 with step2");
        bytes32 commitHash = getMovesHashWithRecipient(movesHash, recipient);
        address commitOfMovesHashWithRecipient = commits[commitHash];
        require(
            address(commitOfMovesHashWithRecipient) == address(1),
            "Invalid commitOfMovesHashWithRecipient, please do claimCloverSecurelyPartOne"
        );
        delete(commits[commitHash]);
        commits[movesHash] = recipient;
    }

    function claimCloverWithVerification(bytes28[2] memory moves, bool keep, address recipient) public payable returns (bool) {
        bytes32 movesHash = getMovesHash(moves);
        address committedRecipient = commits[movesHash];
        require(committedRecipient == address(0) || committedRecipient == recipient, "Invalid committedRecipient");

        Reversi.Game memory game = Reversi.playGame(moves);
        require(isValidGame(game.error, game.complete), "Invalid game");
        uint256 tokenId = convertBytes16ToUint(game.board);
        require(!clovers.exists(tokenId), "Clover already exists");

        uint256 symmetries = Reversi.returnSymmetricals(game.RotSym, game.Y0Sym, game.X0Sym, game.XYSym, game.XnYSym);
        require(_claimClover(tokenId, moves, symmetries, recipient, keep), "Claim must succeed");
        delete(commits[movesHash]);
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
    function claimCloverWithSignature(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, bool keep, bytes memory signature, address recipient) public payable notPaused returns (bool) {
        address committedRecipient = commits[getMovesHash(moves)];
        require(committedRecipient == address(0) || committedRecipient == recipient, "Invalid committedRecipient");
        require(!clovers.exists(tokenId), "Clover already exists");
        require(checkSignature(tokenId, moves, symmetries, keep, recipient, signature, oracle), "Invalid Signature");
        require(_claimClover(tokenId, moves, symmetries, recipient, keep), "Claim must succeed");
        return true;
    }

    function estimateCashOut(uint256[] memory symmetries) public view returns (uint256) {
        uint256 totalReward;
        uint256 reward;
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
        XnYSym) = clovers.getAllSymmetries();
        for (uint64 i = 0; i < symmetries.length; i++) {
            (reward,
            Symmetricals,
            RotSym,
            Y0Sym,
            X0Sym,
            XYSym,
            XnYSym) = calculateRewardFunctional(
                symmetries[i],
                Symmetricals,
                RotSym,
                Y0Sym,
                X0Sym,
                XYSym,
                XnYSym
            );
            totalReward += reward;
        }
        return clubTokenController.getSell(totalReward);
    }

    function claimAndCashOut(uint256[] memory tokenId, bytes28[2][] memory moves, uint256[] memory symmetries, address payable recipient) public notPaused returns (bool) {
        // uint256 beginGas = gasleft();
        require(msg.sender == oracle, "Only oracle can do this");
        require(tokenId.length == moves.length && moves.length == symmetries.length, "Some information missing");
        for (uint64 i = 0; i < tokenId.length; i++) {
            require(!clovers.exists(tokenId[i]), "Clover already exists");
            require(_claimClover(tokenId[i], moves[i], symmetries[i], recipient, false), "Claim must succeed");
        }
        uint256 weiReturned = clubTokenController.sellOnBehalf(clubToken.balanceOf(recipient), recipient);

        // uint256 endGas = gasleft();
        // uint256 payBackToOracleRaw = beginGas - endGas + 2300 + 2300;
        // uint256 payBackToOracleWithGas = payBackToOracleRaw;
        // uint256 payBackToOracleWithGas = payBackToOracleRaw * tx.gasprice;
        // require(weiReturned > payBackToOracleWithGas, "Not worth the gas to execute this tx");

        // clubToken.moveEth(oracle, payBackToOracleWithGas);
        // clubToken.moveEth(recipient, weiReturned - payBackToOracleWithGas);
        clubToken.moveEth(recipient, weiReturned);
        return true;
    }

    function _claimClover(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, address recipient, bool keep) internal returns (bool) {
        clovers.setCloverMoves(tokenId, moves);
        clovers.setKeep(tokenId, keep);
        uint256 reward;
        if (symmetries > 0) {
            clovers.setSymmetries(tokenId, symmetries);
            reward = calculateReward(symmetries);
            clovers.setReward(tokenId, reward);
            addSymmetries(symmetries);
        }
        uint256 price = basePrice.add(reward);
        if (keep && price > 0) {
            // If the user decides to keep the Clover, they must
            // pay for it in club tokens according to the reward price.
            if (clubToken.balanceOf(msg.sender) < price) {
                clubTokenController.buy.value(msg.value)(msg.sender);
            }
            clubToken.burn(msg.sender, price);
        }

        if (keep) {
            // If the user decided to keep the Clover
            clovers.mint(recipient, tokenId);
        } else {
            // If the user decided not to keep the Clover, they will
            // receive the reward price in club tokens, and the clover will
            // go for sale by the contract.
            clovers.mint(address(clovers), tokenId);
            simpleCloversMarket.sell(tokenId, basePrice.add(reward.mul(priceMultiplier)));
            if (reward > 0) {
                require(clubToken.mint(recipient, reward), "mint must succeed");
            }
        }
        emit cloverClaimed(tokenId, moves, msg.sender, recipient, reward, symmetries, keep);
        return true;
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
        require(clovers.exists(tokenId), "Clover must exist to be challenged");
        bool valid = true;
        bytes28[2] memory moves = clovers.getCloverMoves(tokenId);
        address payable _owner = address(uint160(owner()));
        if (msg.sender != _owner && msg.sender != oracle) {
            Reversi.Game memory game = Reversi.playGame(moves);
            if(convertBytes16ToUint(game.board) != tokenId) {
                valid = false;
            }
            if(valid && isValidGame(game.error, game.complete)) {
                uint256 symmetries = clovers.getSymmetries(tokenId);
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
        address committer = clovers.ownerOf(tokenId);
        emit cloverChallenged(tokenId, moves, committer, msg.sender);
        clovers.deleteClover(tokenId);
        return true;
    }

    function updateSalePrice(uint256 tokenId, uint256 _price) public onlyOwner {
        simpleCloversMarket.sell(tokenId, _price);
    }

    /**
    * @dev Moves clovers without explicit allow permission for use by simpleCloversMarket
    * in order to avoid double transaction (allow, transferFrom)
    * @param _from The current owner of the Clover
    * @param _to The future owner of the Clover
    * @param tokenId The Clover
    */
    function transferFrom(address _from, address _to, uint256 tokenId) public {
        require(msg.sender == address(simpleCloversMarket), "transferFrom can only be done by simpleCloversMarket");
        clovers.transferFrom(_from, _to, tokenId);
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
    function updateOracle(address payable _oracle) public onlyOwner {
        oracle = _oracle;
    }

    /**
    * @dev Updates simpleCloversMarket Address.
    * @param _simpleCloversMarket The new simpleCloversMarket address.
    */
    function updateSimpleCloversMarket(ISimpleCloversMarket _simpleCloversMarket) public onlyOwner {
        simpleCloversMarket = _simpleCloversMarket;
    }

    /**
    * @dev Updates clubTokenController Address.
    * @param _clubTokenController The new clubTokenController address.
    */
    function updateClubTokenController(IClubTokenController _clubTokenController) public onlyOwner {
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
    * @param symmetries The symmetries which needs to be added.
    */
    function addSymmetries(uint256 symmetries) private {
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
        XnYSym) = clovers.getAllSymmetries();
        Symmetricals = Symmetricals.add(symmetries > 0 ? 1 : 0);
        RotSym = RotSym.add(uint256(symmetries >> 4 & 1));
        Y0Sym = Y0Sym.add(uint256(symmetries >> 3 & 1));
        X0Sym = X0Sym.add(uint256(symmetries >> 2 & 1));
        XYSym = XYSym.add(uint256(symmetries >> 1 & 1));
        XnYSym = XnYSym.add(uint256(symmetries & 1));
        clovers.setAllSymmetries(Symmetricals, RotSym, Y0Sym, X0Sym, XYSym, XnYSym);
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
        XnYSym) = clovers.getAllSymmetries();
        uint256 symmetries = clovers.getSymmetries(tokenId);
        Symmetricals = Symmetricals.sub(symmetries > 0 ? 1 : 0);
        RotSym = RotSym.sub(uint256(symmetries >> 4 & 1));
        Y0Sym = Y0Sym.sub(uint256(symmetries >> 3 & 1));
        X0Sym = X0Sym.sub(uint256(symmetries >> 2 & 1));
        XYSym = XYSym.sub(uint256(symmetries >> 1 & 1));
        XnYSym = XnYSym.sub(uint256(symmetries & 1));
        clovers.setAllSymmetries(Symmetricals, RotSym, Y0Sym, X0Sym, XYSym, XnYSym);
    }

    function checkSignature(
        uint256 tokenId,
        bytes28[2] memory moves,
        uint256 symmetries,
        bool keep,
        address recipient,
        bytes memory signature,
        address signer
    ) public pure returns (bool) {
        bytes32 hash = toEthSignedMessageHash(getHash(tokenId, moves, symmetries, keep, recipient));
        address result = recover(hash, signature);
        return (result != address(0) && result == signer);
    }

    function getHash(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, bool keep, address recipient) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenId, moves, symmetries, keep, recipient));
    }
    function recover(bytes32 hash, bytes memory signature) public pure returns (address) {
        return hash.recover(signature);
    }
    function toEthSignedMessageHash(bytes32 hash) public pure returns (bytes32) {
        return hash.toEthSignedMessageHash();
    }
}
