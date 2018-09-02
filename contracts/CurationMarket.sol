pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/ownable.sol";
import "bancor-contracts/solidity/contracts/converter/BancorFormula.sol";
import "./ICloversController.sol";
import "./IClovers.sol";
import "./IClubTokenController.sol";
import "./IClubToken.sol";

contract CurationMarket is BancorFormula, Ownable {

    address public clovers;
    address public cloversController;
    address public clubToken;
    address public clubTokenController;

    uint256 public virtualSupply;
    uint256 public virtualBalance;
    uint32 public reserveRatio; // represented in ppm, 1-1000000

    struct Market {
        bool exists;
        uint256 poolBalance;
        uint256 totalSupply;
        mapping(address => uint256) balances;
    }
    mapping(uint256 => Market) public cloverMarkets;

    event Transfer(uint256 _tokenId, address indexed from, address indexed to, uint256 value);
    event Mint(uint256 _tokenId, address indexed to, uint256 amount);
    event Burn(uint256 _tokenId, address indexed burner, uint256 value);

    event Buy(uint256 _tokenId, address buyer, uint256 tokens, uint256 value, uint256 poolBalance, uint256 tokenSupply);
    event Sell(uint256 _tokenId, address seller, uint256 tokens, uint256 value, uint256 poolBalance, uint256 tokenSupply);

    constructor(
        uint256 _virtualSupply,
        uint256 _virtualBalance,
        uint32 _reserveRatio,
        address _clovers,
        address _cloversController,
        address _clubToken,
        address _clubTokenController
    ) public {
        updateVirtualSupply(_virtualSupply);
        updateVirtualBalance(_virtualBalance);
        updateReserveRatio(_reserveRatio);

        updateClovers(_clovers);
        updateCloversController(_cloversController);
        updateClubToken(_clubToken);
        updateClubTokenController(_clubTokenController);

    }

    modifier marketExists(uint256 _tokenId) {
        require(cloverMarkets[_tokenId].exists);
        _;
    }


    /**
    * @dev Total number of tokens in existence
    */
    function totalSupply(uint256 _tokenId) public view marketExists(_tokenId) returns (uint256) {
        return cloverMarkets[_tokenId].totalSupply;
    }

    /**
    * @dev Gets the balance of the specified address.
    * @param _owner The address to query the the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(uint256 _tokenId, address _owner) public view marketExists(_tokenId) returns (uint256) {
        return cloverMarkets[_tokenId].balances[_owner];
    }

    /**
    * @dev gets the amount of tokens returned from spending Eth
    * @param buyValue The amount of Eth to be spent
    * @return A uint256 representing the amount of tokens gained in exchange for the Eth.
    */
    function getBuy(uint256 _tokenId, uint256 buyValue) public constant
    marketExists(_tokenId)
    returns(uint256){
        return calculatePurchaseReturn(
            safeAdd(cloverMarkets[_tokenId].totalSupply, virtualSupply),
            safeAdd(cloverMarkets[_tokenId].poolBalance, virtualBalance),
            reserveRatio,
            buyValue);
    }


    /**
    * @dev gets the amount of Eth returned from selling tokens
    * @param sellAmount The amount of tokens to be sold
    * @return A uint256 representing the amount of Eth gained in exchange for the tokens.
    */

    function getSell(uint256 _tokenId, uint256 sellAmount) public constant
    marketExists(_tokenId)
    returns(uint256) {
        return calculateSaleReturn(
            safeAdd(cloverMarkets[_tokenId].totalSupply, virtualSupply),
            safeAdd(cloverMarkets[_tokenId].poolBalance, virtualBalance),
            reserveRatio,
            sellAmount);
    }

    /**
    * @dev Transfer token for a specified address
    * @param _tokenId The _tokenId of the market.
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */
    function transfer(uint256 _tokenId, address _to, uint256 _value) public marketExists(_tokenId) returns (bool) {
        require(_to != address(0));
        require(_value <= cloverMarkets[_tokenId].balances[msg.sender]);

        cloverMarkets[_tokenId].balances[msg.sender] = safeSub(cloverMarkets[_tokenId].balances[msg.sender], _value);
        cloverMarkets[_tokenId].balances[_to] = safeAdd(cloverMarkets[_tokenId].balances[_to], _value);
        emit Transfer(_tokenId, msg.sender, _to, _value);
        return true;
    }

    function updateVirtualSupply(uint256 _virtualSupply) public onlyOwner {
        virtualSupply = _virtualSupply;
    }
    function updateVirtualBalance(uint256 _virtualBalance) public onlyOwner {
        virtualBalance = _virtualBalance;
    }
    function updateReserveRatio(uint32 _reserveRatio) public onlyOwner {
        reserveRatio = _reserveRatio;
    }

    function updateClovers(address _clovers) public onlyOwner {
        clovers = _clovers;
    }
    function updateCloversController(address _cloversController) public onlyOwner {
        cloversController = _cloversController;
    }
    function updateClubToken(address _clubToken) public onlyOwner {
        clubToken = _clubToken;
    }
    function updateClubTokenController(address _clubTokenController) public onlyOwner {
        clubTokenController = _clubTokenController;
    }


    function addCloverToMarket(uint256 _tokenId, uint256 _spendAmount) public payable {
        require(IClovers(clovers).ownerOf(_tokenId) == msg.sender);
        require(!cloverMarkets[_tokenId].exists);
        cloverMarkets[_tokenId].exists = true;
        ICloversController(cloversController).transferFrom(msg.sender, address(this), _tokenId);
        if (_spendAmount > 0) {
            buy(msg.sender, _tokenId, _spendAmount);
        }
    }

    /**
    * @dev buy Buy shares with Eth
    * @param _to The address that should receive the new tokens
    * @param _tokenId The tokenId that should be bought into
    * @param _spendAmount The amount of Club Token to spend
    */
    function buy(address _to, uint256 _tokenId, uint256 _spendAmount) public payable
    marketExists(_tokenId)
    returns(bool) {
        require(_spendAmount > 0);
        if (IClubToken(clubToken).balanceOf(msg.sender) < _spendAmount) {
            IClubTokenController(clubTokenController).buy.value(msg.value)(msg.sender);
        }
        require(IClubToken(clubToken).balanceOf(msg.sender) >= _spendAmount);
        uint256 tokens = getBuy(_tokenId, _spendAmount);
        require(tokens > 0);
        require(_mint(_tokenId, _to, tokens));
        cloverMarkets[_tokenId].poolBalance = safeAdd(cloverMarkets[_tokenId].poolBalance, _spendAmount);
        IClubTokenController(clubTokenController).transferFrom(msg.sender, address(this), _spendAmount);
        emit Buy(_tokenId, _to, tokens, _spendAmount, cloverMarkets[_tokenId].poolBalance, cloverMarkets[_tokenId].totalSupply);
        return true;
    }


    function _mint(uint256 _tokenId, address _to, uint256 _amount) internal returns(bool) {
        cloverMarkets[_tokenId].totalSupply = safeAdd(cloverMarkets[_tokenId].totalSupply, _amount);
        cloverMarkets[_tokenId].balances[_to] = safeAdd(cloverMarkets[_tokenId].balances[_to], _amount);
        emit Mint(_tokenId, _to, _amount);
        emit Transfer(_tokenId, address(0), _to, _amount);
        return true;
    }


    /**
    * @dev sell Sell ClubTokens for Eth
    * @param _tokenId The token getting sold
    * @param sellAmount The amount of tokens to sell
    */
    function sell(uint256 _tokenId, uint256 sellAmount) public
    marketExists(_tokenId)
    returns(bool) {
        require(sellAmount > 0);
        require(balanceOf(_tokenId, msg.sender) >= sellAmount);
        uint256 saleReturn = getSell(_tokenId, sellAmount);
        require(saleReturn > 0);
        require(saleReturn <= cloverMarkets[_tokenId].poolBalance);
        require(_burn(_tokenId, msg.sender, sellAmount));
        cloverMarkets[_tokenId].poolBalance = safeSub(cloverMarkets[_tokenId].poolBalance, saleReturn);
        IClubTokenController(clubTokenController).transferFrom(address(this), msg.sender, saleReturn);
        emit Sell(_tokenId, msg.sender, sellAmount, saleReturn, cloverMarkets[_tokenId].poolBalance, cloverMarkets[_tokenId].totalSupply);

        return true;
    }


    function _burn(uint256 _tokenId, address _who, uint256 _value) internal returns(bool){
        require(_value <= balanceOf(_tokenId, _who));
        // no need to require value <= totalSupply, since that would imply the
        // sender's balance is greater than the totalSupply, which *should* be an assertion failure

        cloverMarkets[_tokenId].balances[_who] = safeSub(cloverMarkets[_tokenId].balances[_who], _value);
        cloverMarkets[_tokenId].totalSupply = safeSub(cloverMarkets[_tokenId].totalSupply, _value);
        emit Burn(_tokenId, _who, _value);
        emit Transfer(_tokenId, _who, address(0), _value);
        return true;
    }
}
