pragma solidity ^0.4.18;

/**
 * The CloversController is a replaceable endpoint for minting and unminting Clovers.sol and ClubToken.sol
 */

import "./Reversi.sol";
import "./Clovers.sol";
import "./ClubToken.sol";
import "./ClubTokenController.sol";
import "zeppelin-solidity/contracts/ownership/HasNoTokens.sol";
import "zeppelin-solidity/contracts/ownership/HasNoEther.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


contract ISimpleCloversMarket {
    function sell(uint256 _tokenId, uint256 price) public;
} 

contract CloversController is HasNoEther, HasNoTokens {
    event cloverCommitted(bytes32 movesHash, address owner);
    event cloverClaimed(bytes28[2] moves, uint256 tokenId, address owner, uint stake, uint reward, uint256 symmetries, bool keep);
    event stakeRetrieved(uint256 tokenId, address owner, uint stake);
    event cloverChallenged(bytes28[2] moves, uint256 tokenId, address owner, address challenger, uint stake);

    using SafeMath for uint256;
    bool public paused;
    address public oracle;
    address public clovers;
    address public clubToken;
    address public clubTokenController;
    address public simpleCloversMarket;
    address public curationMarket;

    uint256 public gasLastUpdated_fastGasPrice_averageGasPrice_safeLowGasPrice;

    uint256 public basePrice;
    uint256 public priceMultiplier;
    uint256 public payMultiplier;
    uint256 public stakeAmount;
    uint256 public stakePeriod;
    uint256 public constant oneGwei = 1000000000;
    uint256 public gasBlockMargin = 240; // ~1 hour at 15 second blocks

    struct Commit {
        bool collected;
        uint256 stake;
        address committer;
    }

    mapping (bytes32 => Commit) public commits;

    modifier notPaused() {
        require(!paused, "Must not be paused");
        _;
    }

    modifier onlyOwnerOrOracle () {
        require(msg.sender == owner || msg.sender == oracle);
        _;
    }

    constructor(address _clovers, address _clubToken, address _clubTokenController) public {
        clovers = _clovers;
        clubToken = _clubToken;
        clubTokenController = _clubTokenController;
        paused = true;
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
        return keccak256(Clovers(clovers).getCloverMoves(_tokenId));
    }
    /**
    * @dev Checks whether the game is valid.
    * @param moves The moves needed to play validate the game.
    * @return A boolean representing whether or not the game is valid.
    */
    function isValid(bytes28[2] moves) public constant returns (bool) {
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
        if (error) return false;
        if (!complete) return false;
        return true;
    }
    /**
    * @dev Checks whether the game has passed the verification period.
    * @param _tokenId The board being checked.
    * @return A boolean representing whether or not the game has been verified.
    */
    function isVerified(uint256 _tokenId) public constant returns (bool) {
        uint256 _blockMinted = Clovers(clovers).getBlockMinted(_tokenId);
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
        XnYSym) = Clovers(clovers).getAllSymmetries();
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
        require(isValidGame(game.error, game.complete));
        uint256 tokenId = uint256(game.board);
        require(Clovers(clovers).getBlockMinted(tokenId) == 0);
        require(!Clovers(clovers).exists(tokenId));
        Clovers(clovers).setBlockMinted(tokenId, block.number);
        Clovers(clovers).setCloverMoves(tokenId, moves);

        uint256 symmetries = Reversi.returnSymmetricals(game.RotSym, game.Y0Sym, game.X0Sym, game.XYSym, game.XnYSym);
        uint256 reward;

        if (uint256(symmetries) > 0) {
            Clovers(clovers).setSymmetries(tokenId, uint256(symmetries));
            reward = calculateReward(uint256(symmetries));
            Clovers(clovers).setReward(tokenId, reward);
        }
        if (_keep) {
            // If the user decides to keep the Clover, they must
            // pay for it in club tokens according to the reward price.
            if (ClubToken(clubToken).balanceOf(msg.sender) < reward) {
                ClubTokenController(clubTokenController).buy.value(msg.value)(msg.sender); // msg.value needs to be enough to buy "reward" amount of Club Token
            }
            if (reward > 0) {
                // ClubToken(clubToken).transferFrom(msg.sender, clubToken, reward); // if we'd rather keep the money
                ClubToken(clubToken).burn(msg.sender, reward);
            }
            Clovers(clovers).mint(msg.sender, tokenId);
        } else {
            // If the user decides not to keep the Clover, they will
            // receive the reward price in club tokens, and the clover will
            // go for sale at 10x the reward price.
            if (reward > 0) {
                require(ClubToken(clubToken).mint(msg.sender, reward));
            }
            Clovers(clovers).mint(clovers, tokenId);
        }

    } */

    function getPrice(uint256 _symmetries) public constant returns(uint256) {
        return basePrice.add(calculateReward(_symmetries));
    }

    function updateGasBlockMargin(uint256 _gasBlockMargin) public onlyOwnerOrOracle {
        gasBlockMargin = _gasBlockMargin;
    }

    function updateGasPrices(uint256 _fastGasPrice, uint256 _averageGasPrice, uint256 _safeLowGasPrice) public onlyOwnerOrOracle {
        uint256 gasLastUpdated = block.number << 192;
        uint256 fastGasPrice = _fastGasPrice << 128;
        uint256 averageGasPrice = _averageGasPrice << 64;
        uint256 safeLowGasPrice = _safeLowGasPrice;
        gasLastUpdated_fastGasPrice_averageGasPrice_safeLowGasPrice = gasLastUpdated | fastGasPrice | averageGasPrice | safeLowGasPrice;
    }

    function gasLastUpdated() public view returns(uint256) {
        return uint256(uint64(gasLastUpdated_fastGasPrice_averageGasPrice_safeLowGasPrice >> 192));
    }
    function fastGasPrice() public view returns(uint256) {
        return uint256(uint64(gasLastUpdated_fastGasPrice_averageGasPrice_safeLowGasPrice >> 128));
    }
    function averageGasPrice() public view returns(uint256) {
        return uint256(uint64(gasLastUpdated_fastGasPrice_averageGasPrice_safeLowGasPrice >> 64));
    }
    function safeLowGasPrice() public view returns(uint256) {
        return uint256(uint64(gasLastUpdated_fastGasPrice_averageGasPrice_safeLowGasPrice));
    }
    function getGasPriceForApp() public view returns(uint256) {
        if (block.number.sub(gasLastUpdated()) > gasBlockMargin) {
            return oneGwei.mul(10);
        } else {
            return fastGasPrice();
        }
    }

    /**
    * @dev Claim the Clover without a commit or reveal. Payable so you can attach enough for the stake,
    * as well as enough to buy tokens if needed to keep the Clover.
    * @param moves The moves that make up the Clover reversi game.
    * @param _tokenId The board that results from the moves.
    * @param _symmetries symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * @param _keep symmetries saved as a uint256 value like 00010101 where bits represent symmetry
    * types.
    * @return A boolean representing whether or not the claim was successful.
    */
    function claimClover(bytes28[2] moves, uint256 _tokenId, uint256 _symmetries, bool _keep) public payable notPaused returns (bool) {
        emit cloverClaimed(moves, _tokenId, msg.sender, _tokenId, _tokenId, _symmetries, _keep);

        bytes32 movesHash = keccak256(moves);

        uint256 stakeWithGas = stakeAmount.mul(getGasPriceForApp());
        require(msg.value >= stakeWithGas);
        require(getCommit(movesHash) == 0);

        setCommit(movesHash, msg.sender);
        if (stakeWithGas > 0) {
            setStake(movesHash, stakeWithGas);
            clovers.transfer(stakeWithGas);
        }

        emit cloverCommitted(movesHash, msg.sender);

        require(!Clovers(clovers).exists(_tokenId));
        require(Clovers(clovers).getBlockMinted(_tokenId) == 0);

        Clovers(clovers).setBlockMinted(_tokenId, block.number);
        Clovers(clovers).setCloverMoves(_tokenId, moves);
        Clovers(clovers).setKeep(_tokenId, _keep);

        uint256 reward;
        if (_symmetries > 0) {
            Clovers(clovers).setSymmetries(_tokenId, _symmetries);
            reward = calculateReward(_symmetries);
            Clovers(clovers).setReward(_tokenId, reward);
        }
        uint256 price = basePrice.add(reward);
        if (_keep && price > 0) {
            // If the user decides to keep the Clover, they must
            // pay for it in club tokens according to the reward price.
            if (ClubToken(clubToken).balanceOf(msg.sender) < price) {
                ClubTokenController(clubTokenController).buy.value(msg.value.sub(stakeWithGas))(msg.sender);
            }
            // require(ClubToken(clubToken).transferFrom(msg.sender, clovers, price));
            ClubToken(clubToken).burn(msg.sender, price);
        }
        Clovers(clovers).mint(clovers, _tokenId);
        emit cloverClaimed(moves, _tokenId, msg.sender, stakeWithGas, reward, _symmetries, _keep);
        return true;
    }


    // This is better than current commit hash because the commiter's address is part of the move sequence
    // otherwise griefing could still take place....
    // function generateCommit(bytes28[2] moves) public view returns(bytes32 commitHash) {
    //     return sha256(moves, msg.sender);
    // }

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
        require(msg.value >= stakeAmount);
        require(getCommit(movesHash) == 0);

        setCommit(movesHash, msg.sender);
        setStake(movesHash, stakeAmount);

        clovers.transfer(stakeAmount);

        emit cloverCommitted(movesHash, msg.sender);
        return true;
    }
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

        require(Clovers(clovers).getBlockMinted(_tokenId) == 0);

        Clovers(clovers).setBlockMinted(_tokenId, block.number);
        Clovers(clovers).setCloverMoves(_tokenId, moves);
        Clovers(clovers).setKeep(_tokenId, _keep);
        uint256 reward;
        if (_symmetries > 0) {
            Clovers(clovers).setSymmetries(_tokenId, _symmetries);
            reward = calculateReward(_symmetries);
            Clovers(clovers).setReward(_tokenId, reward);
        }
        if (_keep) {
            ClubToken(clubToken).increaseApproval(address(this), basePrice.add(reward));
        }
        uint256 stake = getStake(movesHash);
        emit cloverClaimed(moves, _tokenId, committer, stake, reward, _symmetries, _keep);
        return true;
    } */


    /**
    * @dev Retrieve the stake from a Clover claim after the stake period has ended, or with the authority of the oracle.
    * @param _tokenId The board which holds the stake.
    * @param _fastGasPrice The current fast gas price.
    * @param _averageGasPrice The current average gas price.
    * @param _safeLowGasPrice The current slow safe gas price
    * @return A boolean representing whether or not the retrieval was successful.
    */
    function retrieveStakeWithGas(uint256 _tokenId, uint256 _fastGasPrice, uint256 _averageGasPrice, uint256 _safeLowGasPrice) public payable returns (bool) {
        require(retrieveStake(_tokenId));
        if (msg.sender == owner || msg.sender == oracle) {
            updateGasPrices(_fastGasPrice, _averageGasPrice, _safeLowGasPrice);
        }
    }

    /**
    * @dev Retrieve the stake from a Clover claim after the stake period has ended, or with the authority of the oracle.
    * @param _tokenId The board which holds the stake.
    * @return A boolean representing whether or not the retrieval was successful.
    */
    function retrieveStake(uint256 _tokenId) public payable returns (bool) {
        bytes28[2] memory moves = Clovers(clovers).getCloverMoves(_tokenId);
        bytes32 movesHash = keccak256(moves);


        require(!commits[movesHash].collected);
        commits[movesHash].collected = true;

        require(isVerified(_tokenId) || msg.sender == owner || msg.sender == oracle);

        uint256 stake = getStake(movesHash);
        addSymmetries(_tokenId);
        address committer = getCommit(movesHash);
        require(committer == msg.sender || msg.sender == owner || msg.sender == oracle);
        uint256 reward = Clovers(clovers).getReward(_tokenId);
        bool _keep = Clovers(clovers).getKeep(_tokenId);

        if (_keep) {
            // If the user decided to keep the Clover, they will
            // receive the clover now that it has been verified
            Clovers(clovers).transferFrom(clovers, committer, _tokenId);
        } else {
            // If the user decided not to keep the Clover, they will
            // receive the reward price in club tokens, and the clover will
            // go for sale by the contract.
            ISimpleCloversMarket(simpleCloversMarket).sell(_tokenId, basePrice.add(reward.mul(priceMultiplier)));
            if (reward > 0) {
                require(ClubToken(clubToken).mint(committer, reward));
            }
        }
        if (stake > 0) {
            Clovers(clovers).moveEth(msg.sender, stake);
        }
        emit stakeRetrieved(_tokenId, msg.sender, stake);

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
    * @param _fastGasPrice The current fast gas price.
    * @param _averageGasPrice The current average gas price.
    * @param _safeLowGasPrice The current slow safe gas price
    * @return A boolean representing whether or not the challenge was successful.
    */
    function challengeCloverWithGas(uint256 _tokenId, uint256 _fastGasPrice, uint256 _averageGasPrice, uint256 _safeLowGasPrice) public returns (bool) {
        require(challengeClover(_tokenId));
        if (msg.sender == owner || msg.sender == oracle) {
            updateGasPrices(_fastGasPrice, _averageGasPrice, _safeLowGasPrice);
        }
        return true;
    }
    /**
    * @dev Challenge a staked Clover for being invalid.
    * @param _tokenId The board being challenged.
    * @return A boolean representing whether or not the challenge was successful.
    */
    function challengeClover(uint256 _tokenId) public returns (bool) {
        bool valid = true;
        bytes28[2] memory moves = Clovers(clovers).getCloverMoves(_tokenId);

        if (msg.sender != owner && msg.sender != oracle) {
            Reversi.Game memory game = Reversi.playGame(moves);
            if(convertBytes16ToUint(game.board) != _tokenId) {
                valid = false;
            }
            if(valid && isValidGame(game.error, game.complete)) {
                uint256 _symmetries = Clovers(clovers).getSymmetries(_tokenId);
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
            Clovers(clovers).moveEth(msg.sender, stake);
        }
        if (commits[movesHash].collected) {
            removeSymmetries(_tokenId);
        }

        address committer = getCommit(movesHash);
        emit cloverChallenged(moves, _tokenId, committer, msg.sender, stake);

        Clovers(clovers).deleteClover(_tokenId);
        deleteCommit(movesHash);
        return true;
    }

    function fixSalePrice(uint256 _tokenId, uint256 _price) public onlyOwnerOrOracle {
        ISimpleCloversMarket(simpleCloversMarket).sell(_tokenId, _price);
    }

    /**
    * @dev Moves clovers without explicit allow permission for use by simpleCloversMarket
    * in order to avoid double transaction (allow, transferFrom)
    * @param _from The current owner of the Clover
    * @param _to The future owner of the Clover
    * @param _tokenId The Clover
    */
    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        require(msg.sender == simpleCloversMarket || msg.sender == curationMarket);
        Clovers(clovers).transferFrom(_from, _to, _tokenId);
    }

    /**
    * @dev Updates pause boolean.
    * @param _paused The new puased boolean.
    */
    function updatePaused(bool _paused) public onlyOwner {
        paused = _paused;
    }

    /**
    * @dev Updates curationMarket Address.
    * @param _curationMarket The new curationMarket Address.
    */
    function updateCurationMarket(address _curationMarket) public onlyOwner {
        curationMarket = _curationMarket;
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

    function _setCommit(bytes32 movesHash, address committer) public onlyOwner {
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
        XnYSym) = Clovers(clovers).getAllSymmetries();
        uint256 _symmetries = Clovers(clovers).getSymmetries(_tokenId);
        Symmetricals = Symmetricals.add(_symmetries > 0 ? 1 : 0);
        RotSym = RotSym.add(uint256(_symmetries >> 4 & 1));
        Y0Sym = Y0Sym.add(uint256(_symmetries >> 3 & 1));
        X0Sym = X0Sym.add(uint256(_symmetries >> 2 & 1));
        XYSym = XYSym.add(uint256(_symmetries >> 1 & 1));
        XnYSym = XnYSym.add(uint256(_symmetries & 1));
        Clovers(clovers).setAllSymmetries(Symmetricals, RotSym, Y0Sym, X0Sym, XYSym, XnYSym);
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
        XnYSym) = Clovers(clovers).getAllSymmetries();
        uint256 _symmetries = Clovers(clovers).getSymmetries(_tokenId);
        Symmetricals = Symmetricals.sub(_symmetries > 0 ? 1 : 0);
        RotSym = RotSym.sub(uint256(_symmetries >> 4 & 1));
        Y0Sym = Y0Sym.sub(uint256(_symmetries >> 3 & 1));
        X0Sym = X0Sym.sub(uint256(_symmetries >> 2 & 1));
        XYSym = XYSym.sub(uint256(_symmetries >> 1 & 1));
        XnYSym = XnYSym.sub(uint256(_symmetries & 1));
        Clovers(clovers).setAllSymmetries(Symmetricals, RotSym, Y0Sym, X0Sym, XYSym, XnYSym);
    }

}
