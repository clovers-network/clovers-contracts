pragma solidity ^0.4.18;
pragma experimental ABIEncoderV2;

/**
 * The CloversController is a replaceable endpoint for minting and unminting Clovers.sol and ClubToken.sol
 */

import "./Reversi.sol";
import "./IClovers.sol";
import "./IClubToken.sol";
import "./ICloversController.sol";
import "./ClubTokenController.sol";
import "zeppelin-solidity/contracts/ownership/HasNoTokens.sol";
import "zeppelin-solidity/contracts/ownership/HasNoEther.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


contract CloversController is ICloversController, HasNoEther, HasNoTokens {
    event cloverCommitted(bytes32 movesHash, address owner);
    event cloverClaimed(bytes28[2] moves, uint256 tokenId, address owner, uint stake, uint reward, uint256 symmetries);
    event stakeRetrieved(uint256 tokenId, address owner, uint stake);

    event cloverChallenged(bytes28[2] moves, uint256 tokenId, address owner, address challenger, uint stake);

    using SafeMath for uint256;

    address public clovers;
    address public clubToken;
    address public clubTokenController;

    uint256 public priceMultiplier;
    uint256 public payMultiplier;
    uint256 public stakeAmount;
    uint256 public stakePeriod;

    mapping (bytes32 => address) public commits;
    mapping (bytes32 => uint256) public stakes;

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
        return stakes[movesHash];
    }
    /**
    * @dev Gets the address of the commiter of a Clover based on the hash of the moves.
    * @param movesHash The hash of the moves that make up the clover.
    * @return The address of the commiter.
    */
    function getCommit(bytes32 movesHash) public view returns (address) {
        return commits[movesHash];
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
        if (msg.sender == owner) return true;
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


    function synchronousClaim(bytes28[2] moves, bool _keep) public payable returns (bool) {
        Reversi.Game memory game = Reversi.playGame(moves);
        require(isValidGame(game));
        uint256 tokenId = uint256(game.board);
        require(IClovers(clovers).getBlockMinted(tokenId) == 0);
        require(!IClovers(clovers).exists(tokenId));
        IClovers(clovers).setBlockMinted(tokenId, block.number);
        IClovers(clovers).setCloverMoves(tokenId, moves);

        uint256 symmetries = (game.RotSym ? 1  : 0) << 1;
        symmetries = (symmetries & (game.Y0Sym ? 1 : 0)) << 1;
        symmetries = (symmetries & (game.X0Sym ? 1 : 0)) << 1;
        symmetries = (symmetries & (game.XYSym ? 1 : 0)) << 1;
        symmetries = symmetries & (game.XnYSym ? 1 : 0);

        uint256 reward;

        if (uint256(symmetries) > 0) {
            IClovers(clovers).setSymmetries(tokenId, uint256(symmetries));
            reward = calculateReward(uint256(symmetries));
            IClovers(clovers).setReward(tokenId, reward);
        }
        if (_keep) {
            /* If the user decides to keep the Clover, they must
            pay for it in club tokens according to the reward price. */
            if (IClubToken(clubToken).balanceOf(msg.sender) < reward) {
                ClubTokenController(clubTokenController).buy(msg.sender); // msg.value needs to be enough to buy "reward" amount of Club Token
            }
            if (reward > 0) {
                IClubToken(clubToken).burn(msg.sender, reward);
            }
            IClovers(clovers).mint(msg.sender, tokenId);
        } else {
            /* If the user decides not to keep the Clover, they will
            receive the reward price in club tokens, and the clover will
            go for sale at 10x the reward price. */
            if (reward > 0) {
                require(IClubToken(clubToken).mint(msg.sender, reward));
            }
            IClovers(clovers).mint(clovers, tokenId);
        }

    }

    /**
    * @dev Claim the Clover without a commit or reveal.
    * @param moves The moves that make up the Clover reversi game.
    * @param _tokenId The board that results from the moves.
    * @param _symmetries symmetries saved as a uint256 value like 00010101 where bits represent symmetry types.
    * @param _to The address claiming the Clover.
    * @return A boolean representing whether or not the claim was successful.
    */
    function claimClover(bytes28[2] moves, uint256 _tokenId, uint256 _symmetries, address _to) public payable returns (bool) {
        require(moves[0] != 0);
        require(msg.value == stakeAmount);
        bytes32 movesHash = keccak256(moves);
        require(getCommit(movesHash) == 0);
        setCommit(movesHash, _to);
        setStake(movesHash, stakeAmount);
        clovers.transfer(stakeAmount);
        emit cloverCommitted(movesHash, _to);
        require(!IClovers(clovers).exists(_tokenId));
        require(IClovers(clovers).getBlockMinted(_tokenId) == 0);
        IClovers(clovers).setBlockMinted(_tokenId, block.number);
        IClovers(clovers).setCloverMoves(_tokenId, moves);
        if (_symmetries > 0) {
            IClovers(clovers).setSymmetries(_tokenId, _symmetries);
            uint256 reward = calculateReward(_symmetries);
            IClovers(clovers).setReward(_tokenId, reward);
        }
        emit cloverClaimed(moves, _tokenId, _to, stakeAmount, reward, _symmetries);
        return true;
    }
    /**
    * @dev Commit the hash of the moves needed to claim the Clover. A stake should be made for counterfactual verification.
    * @param movesHash The hash of the moves that makes up the Clover reversi game.
    * @param _to The address claiming the Clover.
    * @return A boolean representing whether or not the commit was successful.
    */
    function claimCloverCommit(bytes32 movesHash, address _to) public payable returns (bool) {
        require(_to != 0);
        require(msg.value == stakeAmount);
        require(getCommit(movesHash) == 0);
        setCommit(movesHash, _to);
        setStake(movesHash, stakeAmount);
        clovers.transfer(stakeAmount);
        emit cloverCommitted(movesHash, _to);
        return true;
    }
    /**
    * @dev Reveal the solution to the previous commit to claim the Clover.
    * @param moves The moves that make up the Clover reversi game.
    * @param _tokenId The board that results from the moves.
    * @param _symmetries symmetries saved as a uint256 value like 00010101 where bits represent symmetry types.
    * @return A boolean representing whether or not the reveal and claim was successful.
    */
    function claimCloverReveal(bytes28[2] moves, uint256 _tokenId, uint256 _symmetries) public returns (bool) {
        require(moves[0] != 0);
        bytes32 movesHash = keccak256(moves);
        address commiter = getCommit(movesHash);
        require(IClovers(clovers).getBlockMinted(_tokenId) == 0);
        IClovers(clovers).setBlockMinted(_tokenId, block.number);
        IClovers(clovers).setCloverMoves(_tokenId, moves);
        if (_symmetries > 0) {
            IClovers(clovers).setSymmetries(_tokenId, _symmetries);
            uint256 reward = calculateReward(_symmetries);
            IClovers(clovers).setReward(_tokenId, reward);
        }
        uint256 stake = getStake(movesHash);
        emit cloverClaimed(moves, _tokenId, commiter, stake, reward, _symmetries);
        return true;
    }
    /**
    * @dev Retrieve the stake from a Clover claim after the stake period has ended.
    * @param _tokenId The board which holds the stake.
    * @return A boolean representing whether or not the retrieval was successful.
    */
    function retrieveStake(uint256 _tokenId, bool _keep) public payable returns (bool) {
        bytes28[2] memory moves = IClovers(clovers).getCloverMoves(_tokenId);
        require(moves[0] != 0);
        bytes32 movesHash = keccak256(moves);
        uint256 stake = getStake(movesHash);
        require(stake != 0);
        require(isVerified(_tokenId));
        setStake(movesHash, 0);
        addSymmetries(_tokenId);
        address commiter = getCommit(movesHash);
        require(msg.sender == commiter);
        uint256 reward = IClovers(clovers).getReward(_tokenId);
        if (_keep) {
            /* If the user decides to keep the Clover, they must
            pay for it in club tokens according to the reward price. */
            if (IClubToken(clubToken).balanceOf(commiter) < reward) {
                ClubTokenController(clubTokenController).buy(commiter); // msg.value needs to be enough to buy "reward" amount of Club Token
            }
            if (reward > 0) {
                IClubToken(clubToken).burn(commiter, reward);
            }
            IClovers(clovers).mint(commiter, _tokenId);
        } else {
            /* If the user decides not to keep the Clover, they will
            receive the reward price in club tokens, and the clover will
            go for sale at 10x the reward price. */
            if (reward > 0) {
                require(IClubToken(clubToken).mint(commiter, reward));
            }
            IClovers(clovers).mint(clovers, _tokenId);
        }
        IClovers(clovers).moveEth(commiter, stake);
        emit stakeRetrieved(_tokenId, commiter, stake);
        return true;
    }

    /**
    * @dev Buy one of the Clovers which were given up when mining.
    * @param _tokenId The board being bought.
    * @return A boolean representing whether or not the purchase was successful.
    */
    function buyCloverFromContract(uint256 _tokenId) public payable returns(bool) {
        uint256 reward = IClovers(clovers).getReward(_tokenId);
        uint256 toPay = reward.mul(priceMultiplier);
        if (IClubToken(clubToken).balanceOf(msg.sender) < toPay) {
            ClubTokenController(clubTokenController).buy(msg.sender); // msg.value needs to be enough to buy "toPay" amount of Club Token
        }
        if (toPay > 0) {
            IClubToken(clubToken).burn(msg.sender, toPay);
        }
        IClovers(clovers).transferFrom(clovers, msg.sender, _tokenId);
        return true;
    }

    /**
    * @dev Challenge a staked Clover for being invalid.
    * @param _tokenId The board being challenged.
    * @param _to The address challenging the Clover.
    * @return A boolean representing whether or not the challenge was successful.
    */
    function challengeClover(uint256 _tokenId, address _to) public returns (bool) {
        bool valid = true;
        bytes28[2] memory moves = IClovers(clovers).getCloverMoves(_tokenId);
        require(moves[0] != 0);
        Reversi.Game memory game = Reversi.playGame(moves);
        require(game.board == bytes16(_tokenId));
        if(isValidGame(game)) {
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

        IClovers(clovers).deleteClover(_tokenId);
        bytes32 movesHash = keccak256(moves);
        if (!isVerified(_tokenId)) {
            uint256 stake = getStake(movesHash);
            IClovers(clovers).moveEth(_to, stake);
        }
        IClovers(clovers).unmint(_tokenId);
        setCommit(movesHash, 0);
        setStake(movesHash, 0);
        removeSymmetries(_tokenId);

        address commiter = getCommit(movesHash);
        emit cloverChallenged(moves, _tokenId, commiter, _to, stake);
        return true;
    }


    /**
    * @dev Updates clubTokenController Address.
    * @param _clubTokenController The new amount needed to stake.
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
    * @dev Sets the stake of a Clover based on the hash of the moves.
    * @param movesHash The hash of the moves that make up the clover.
    * @param stake A uint256 value of stake.
    */
    function setStake(bytes32 movesHash, uint256 stake) private {
        stakes[movesHash] = stake;
    }

    /**
    * @dev Sets the address of the commiter of a Clover based on the hash of the moves.
    * @param movesHash The hash of the moves that make up the clover.
    * @param commiter The address of the commiter.
    */
    function setCommit(bytes32 movesHash, address commiter) private {
        commits[movesHash] = commiter;
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
