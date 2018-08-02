pragma solidity ^0.4.24;

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

// File: contracts/IClubTokenController.sol

/**
 * The Clovers contract is the interface for the CloversController Contract
 */


contract IClubTokenController {
    function buy(address buyer) public payable returns(bool);
    function transferFrom(address from, address to, uint256 amount) public;
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

// File: contracts/SimpleCloversMarket.sol

contract SimpleCloversMarket is Ownable {

    event updatePrice(uint256 _tokenId, uint256 price);


    using SafeMath for uint256;

    address public clovers;
    address public clubToken;
    address public clubTokenController;
    address public cloversController;
    struct Sell {
        address from;
        uint256 price;
    }
    mapping(uint256 => Sell) sells;
    constructor(address _clovers, address _clubToken, address _clubTokenController, address _cloversController) public {
        updateClovers(_clovers);
        updateClubToken(_clubToken);
        updateClubTokenController(_clubTokenController);
        updateCloversController(_cloversController);
    }
    function sellFrom(uint256 _tokenId) public view returns(address) {
        return sells[_tokenId].from;
    }
    function sellPrice(uint256 _tokenId) public view returns(uint256){
        return sells[_tokenId].price;
    }
    function updateClubTokenController(address _clubTokenController) public onlyOwner {
        clubTokenController = _clubTokenController;
    }
    function updateCloversController(address _cloversController) public onlyOwner {
        cloversController = _cloversController;
    }
    function updateClubToken(address _clubToken) public onlyOwner {
        clubToken = _clubToken;
    }
    function updateClovers(address _clovers) public onlyOwner {
        clovers = _clovers;
    }
    function removeSell(uint256 _tokenId) public {
        address owner = IClovers(clovers).ownerOf(_tokenId);
        address seller = sells[_tokenId].from;
        require(owner == msg.sender || owner != seller);
        delete(sells[_tokenId]);
    }

    function sell(uint256 _tokenId, uint256 price) public {
        require(price > 0);
        require(IClovers(clovers).ownerOf(_tokenId) == msg.sender || msg.sender == cloversController);
        sells[_tokenId].price = price;
        sells[_tokenId].from = IClovers(clovers).ownerOf(_tokenId);
        updatePrice(_tokenId, price);
    }
    function buy (uint256 _tokenId) public payable {
        uint256 sellPrice = sells[_tokenId].price;
        address sellFrom = sells[_tokenId].from;
        require(sellPrice > 0);
        require(IClovers(clovers).ownerOf(_tokenId) == sellFrom);
        if(IClubToken(clubToken).balanceOf(msg.sender) < sellPrice) {
            IClubTokenController(clubTokenController).buy(msg.sender);
        }
        IClubTokenController(clubTokenController).transferFrom(msg.sender, sellFrom, sellPrice);
        ICloversController(cloversController).transferFrom(sellFrom, msg.sender, _tokenId);
        delete(sells[_tokenId]);
        updatePrice(_tokenId, 0);
    }

    /**
    * @dev Buy one of the Clovers which were given up when mining.
    * @param _tokenId The board being bought.
    * @return A boolean representing whether or not the purchase was successful.
    */
    /* function buyCloverFromContract(uint256 _tokenId) public payable returns(bool) {
        require(IClovers(clovers).ownerOf(_tokenId) == clovers);
        uint256 reward = IClovers(clovers).getReward(_tokenId);
        uint256 toPay = ICloversController(cloversController).basePrice().add(reward.mul(ICloversController(cloversController).priceMultiplier()));
        if (IClubToken(clubToken).balanceOf(msg.sender) < toPay) {
            IClubTokenController(clubTokenController).buy(msg.sender); // msg.value needs to be enough to buy "toPay" amount of Club Token
        }
        if (toPay > 0) {
            // IClubToken(clubToken).transferFrom(msg.sender, clubToken, toPay); // if we'd rather keep the money
            IClubToken(clubToken).burn(msg.sender, toPay);
        }
        IClovers(clovers).transferFrom(clovers, msg.sender, _tokenId);
        updatePrice(_tokenId, 0);
        return true;
    } */
}
