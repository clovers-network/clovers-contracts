pragma solidity ^0.4.18;

/**
* The ClubTokenController is a replaceable endpoint for minting and unminting ClubToken.sol
*/


import './IClubToken.sol';
import './IClubTokenController.sol';
import "bancor-contracts/solidity/contracts/converter/BancorFormula.sol";
import "zeppelin-solidity/contracts/ownership/HasNoTokens.sol";

contract ClubTokenController is IClubTokenController, BancorFormula, HasNoTokens {


    address clubToken;

    uint256 public poolBalance;
    uint256 public virtualSupply;
    uint256 public virtualBalance;
    uint32 public reserveRatio; // represented in ppm, 1-1000000

    constructor(address _clubToken) public {
        clubToken = _clubToken;
    }

    function () public payable {
        buy(msg.sender);
    }

    /**
    * @dev gets the amount of tokens returned from spending Eth
    * @param buyValue The amount of Eth to be spent
    * @return A uint256 representing the amount of tokens gained in exchange for the Eth.
    */
    function getBuy(uint256 buyValue) public constant returns(uint256) {
        return calculatePurchaseReturn(
            safeAdd(IClubToken(clubToken).totalSupply(), virtualSupply),
            safeAdd(poolBalance, virtualBalance),
            reserveRatio,
            buyValue);
    }


    /**
    * @dev gets the amount of Eth returned from selling tokens
    * @param sellAmount The amount of tokens to be sold
    * @return A uint256 representing the amount of Eth gained in exchange for the tokens.
    */

    function getSell(uint256 sellAmount) public constant returns(uint256) {
        return calculateSaleReturn(
            safeAdd(IClubToken(clubToken).totalSupply(), virtualSupply),
            safeAdd(poolBalance, virtualBalance),
            reserveRatio,
            sellAmount);
    }

    /**
    * @dev updates the Reserve Ratio variable
    * @param _reserveRatio The reserve ratio that determines the curve
    * @return A boolean representing whether or not the update was successful.
    */
    function updateReserveRatio(uint32 _reserveRatio) public onlyOwner returns(bool){
        reserveRatio = _reserveRatio;
        return true;
    }

    /**
    * @dev updates the Virtual Supply variable
    * @param _virtualSupply The virtual supply of tokens used for calculating buys and sells
    * @return A boolean representing whether or not the update was successful.
    */
    function updateVirtualSupply(uint256 _virtualSupply) public onlyOwner returns(bool){
        virtualSupply = _virtualSupply;
        return true;
    }

    /**
    * @dev updates the Virtual Balance variable
    * @param _virtualBalance The virtual balance of the contract used for calculating buys and sells
    * @return A boolean representing whether or not the update was successful.
    */
    function updateVirtualBalance(uint256 _virtualBalance) public onlyOwner returns(bool){
        virtualBalance = _virtualBalance;
        return true;
    }

    /**
    * @dev donate Donate Eth to the poolBalance without increasing the totalSupply
    */
    function donate() public payable {
        require(msg.value > 0);
        poolBalance = safeAdd(poolBalance, msg.value);
        clubToken.transfer(msg.value);
    }

    /**
    * @dev buy Buy ClubTokens with Eth
    * @param buyer The address that should receive the new tokens
    */
    function buy(address buyer) public payable returns(bool) {
        require(msg.value > 0);
        uint256 tokens = getBuy(msg.value);
        require(tokens > 0);
        require(IClubToken(clubToken).mint(buyer, tokens));
        poolBalance = safeAdd(poolBalance, msg.value);
        clubToken.transfer(msg.value);
    }


    /**
    * @dev sell Sell ClubTokens for Eth
    * @param sellAmount The amount of tokens to sell
    */
    function sell(uint256 sellAmount) public returns(bool) {
        require(sellAmount > 0);
        require(IClubToken(clubToken).balanceOf(msg.sender) >= sellAmount);
        uint256 saleReturn = getSell(sellAmount);
        require(saleReturn > 0);
        require(saleReturn <= poolBalance);
        require(saleReturn <= clubToken.balance);
        IClubToken(clubToken).burn(msg.sender, sellAmount);
        poolBalance = safeSub(poolBalance, saleReturn);
        IClubToken(clubToken).moveEth(msg.sender, saleReturn);
    }


 }
