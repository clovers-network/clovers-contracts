pragma solidity ^0.4.18;

/**
* The ClubTokenController is a replaceable endpoint for minting and unminting ClubToken.sol
*/


import "./ClubToken.sol";
import "bancor-contracts/solidity/contracts/converter/BancorFormula.sol";
import "./helpers/Admin.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract ClubTokenController is BancorFormula, Admin, Ownable {
    event Buy(address buyer, uint256 tokens, uint256 value, uint256 poolBalance, uint256 tokenSupply);
    event Sell(address seller, uint256 tokens, uint256 value, uint256 poolBalance, uint256 tokenSupply);

    bool public paused;
    address public clubToken;
    address public simpleCloversMarket;
    address public cloversController;
    address public curationMarket;
    address public support;

    /* uint256 public poolBalance; */
    uint256 public virtualSupply;
    uint256 public virtualBalance;
    uint32 public reserveRatio; // represented in ppm, 1-1000000

    constructor(address _clubToken) public {
        clubToken = _clubToken;
        paused = true;
    }

    function () public payable {
        buy(msg.sender);
    }

    modifier notPaused() {
        require(!paused || owner == msg.sender || admins[tx.origin], "Contract must not be paused");
        _;
    }

    function poolBalance() public constant returns(uint256) {
        return clubToken.balance;
    }

    /**
    * @dev gets the amount of tokens returned from spending Eth
    * @param buyValue The amount of Eth to be spent
    * @return A uint256 representing the amount of tokens gained in exchange for the Eth.
    */
    function getBuy(uint256 buyValue) public constant returns(uint256) {
        return calculatePurchaseReturn(
            safeAdd(ClubToken(clubToken).totalSupply(), virtualSupply),
            safeAdd(poolBalance(), virtualBalance),
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
            safeAdd(ClubToken(clubToken).totalSupply(), virtualSupply),
            safeAdd(poolBalance(), virtualBalance),
            reserveRatio,
            sellAmount);
    }

    function updatePaused(bool _paused) public onlyOwner {
        paused = _paused;
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
    * @dev updates the poolBalance
    * @param _poolBalance The eth balance of ClubToken.sol
    * @return A boolean representing whether or not the update was successful.
    */
    /* function updatePoolBalance(uint256 _poolBalance) public onlyOwner returns(bool){
        poolBalance = _poolBalance;
        return true;
    } */

    /**
    * @dev updates the SimpleCloversMarket address
    * @param _simpleCloversMarket The address of the simpleCloversMarket
    * @return A boolean representing whether or not the update was successful.
    */
    function updateSimpleCloversMarket(address _simpleCloversMarket) public onlyOwner returns(bool){
        simpleCloversMarket = _simpleCloversMarket;
        return true;
    }

    /**
    * @dev updates the CloversController address
    * @param _cloversController The address of the cloversController
    * @return A boolean representing whether or not the update was successful.
    */
    function updateCloversController(address _cloversController) public onlyOwner returns(bool){
        cloversController = _cloversController;
        return true;
    }

    /**
    * @dev updates the Support address
    * @param _support The address of the Support
    * @return A boolean representing whether or not the update was successful.
    */
    function updateSupport(address _support) public onlyOwner returns(bool){
        support = _support;
        return true;
    }

    /**
    * @dev donate Donate Eth to the poolBalance without increasing the totalSupply
    */
    function donate() public payable {
        require(msg.value > 0);
        /* poolBalance = safeAdd(poolBalance, msg.value); */
        clubToken.transfer(msg.value);
    }

    function burn(address from, uint256 amount) public {
        require(msg.sender == simpleCloversMarket);
        ClubToken(clubToken).burn(from, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public {
        require(msg.sender == simpleCloversMarket || msg.sender == curationMarket || msg.sender == support);
        ClubToken(clubToken).transferFrom(from, to, amount);
    }

    /**
    * @dev buy Buy ClubTokens with Eth
    * @param buyer The address that should receive the new tokens
    */
    function buy(address buyer) public payable notPaused returns(bool) {
        require(msg.value > 0);
        uint256 tokens = getBuy(msg.value);
        require(tokens > 0);
        require(ClubToken(clubToken).mint(buyer, tokens));
        /* poolBalance = safeAdd(poolBalance, msg.value); */
        clubToken.transfer(msg.value);
        emit Buy(buyer, tokens, msg.value, poolBalance(), ClubToken(clubToken).totalSupply());
    }


    /**
    * @dev sell Sell ClubTokens for Eth
    * @param sellAmount The amount of tokens to sell
    */
    function sell(uint256 sellAmount) public notPaused returns(bool) {
        require(sellAmount > 0);
        require(ClubToken(clubToken).balanceOf(msg.sender) >= sellAmount);
        uint256 saleReturn = getSell(sellAmount);
        require(saleReturn > 0);
        require(saleReturn <= poolBalance());
        ClubToken(clubToken).burn(msg.sender, sellAmount);
        /* poolBalance = safeSub(poolBalance, saleReturn); */
        ClubToken(clubToken).moveEth(msg.sender, saleReturn);
        emit Sell(msg.sender, sellAmount, saleReturn, poolBalance(), ClubToken(clubToken).totalSupply());
    }

    function sellOnBehalf(uint256 sellAmount, address recipient) public notPaused returns(uint256 weiReturned) {
        require(msg.sender == cloversController, "Only allowed by CloversController");
        require(sellAmount > 0, "Sell amount must be greater than 0");
        require(ClubToken(clubToken).balanceOf(recipient) >= sellAmount, "User doen't have enough clubToken");
        uint256 saleReturn = getSell(sellAmount);
        require(saleReturn > 0, "Sale Return must be greater than 0");
        require(saleReturn <= poolBalance(), "Not enough eth in pool");
        ClubToken(clubToken).burn(recipient, sellAmount);
        // let cloversController move it
        // ClubToken(clubToken).moveEth(cloversController, saleReturn);
        emit Sell(recipient, sellAmount, saleReturn, poolBalance(), ClubToken(clubToken).totalSupply());
        return saleReturn;
    }

}
