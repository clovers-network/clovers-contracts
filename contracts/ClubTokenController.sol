pragma solidity ^0.4.18;

/**
* The ClubTokenController is a replaceable endpoint for minting and unminting ClubToken.sol
*/


import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import './ClubToken.sol';
import "bancor-contracts/solidity/contracts/converter/BancorFormula.sol";

contract ClubTokenController is BancorFormula, Ownable {


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
    }

    /**
    * @dev buy Buy ClubTokens with Eth
    * @param buyer The address that should receive the new tokens
    */
    function buy(address buyer) public payable returns(bool) {
        require(msg.value > 0);
        uint256 tokens = calculatePurchaseReturn(
            safeAdd(ClubToken(clubToken).totalSupply(), virtualSupply),
            safeAdd(poolBalance, virtualBalance),
            reserveRatio,
            msg.value);
        require(tokens > 0);
        require(ClubToken(clubToken).mint(buyer, tokens));
        poolBalance = safeAdd(poolBalance, msg.value);
    }

    /**
    * @dev sell Sell ClubTokens for Eth
    * @param sellAmount The amount of tokens to sell
    */
    function sell(uint256 sellAmount) public returns(bool) {
        require(sellAmount > 0);
        require(ClubToken(clubToken).balanceOf(msg.sender) >= sellAmount);
        uint256 saleReturn = calculateSaleReturn(
            safeAdd(ClubToken(clubToken).totalSupply(), virtualSupply),
            safeAdd(poolBalance, virtualBalance),
            reserveRatio,
            sellAmount);
        require(saleReturn > 0);
        require(saleReturn <= poolBalance);
        ClubToken(clubToken).burn(msg.sender, sellAmount);
        poolBalance = safeSub(poolBalance, saleReturn);
        msg.sender.transfer(saleReturn);
    }

 }
