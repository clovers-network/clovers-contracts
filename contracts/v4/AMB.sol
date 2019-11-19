
// File: contracts/interfaces/IBridgeValidators.sol

pragma solidity 0.4.24;

interface IBridgeValidators {
    function isValidator(address _validator) external view returns (bool);
    function requiredSignatures() external view returns (uint256);
    function owner() external view returns (address);
}

// File: contracts/libraries/Message.sol

pragma solidity 0.4.24;


library Message {
    // function uintToString(uint256 inputValue) internal pure returns (string) {
    //     // figure out the length of the resulting string
    //     uint256 length = 0;
    //     uint256 currentValue = inputValue;
    //     do {
    //         length++;
    //         currentValue /= 10;
    //     } while (currentValue != 0);
    //     // allocate enough memory
    //     bytes memory result = new bytes(length);
    //     // construct the string backwards
    //     uint256 i = length - 1;
    //     currentValue = inputValue;
    //     do {
    //         result[i--] = byte(48 + currentValue % 10);
    //         currentValue /= 10;
    //     } while (currentValue != 0);
    //     return string(result);
    // }

    function addressArrayContains(address[] array, address value) internal pure returns (bool) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }
    // layout of message :: bytes:
    // offset  0: 32 bytes :: uint256 - message length
    // offset 32: 20 bytes :: address - recipient address
    // offset 52: 32 bytes :: uint256 - value
    // offset 84: 32 bytes :: bytes32 - transaction hash
    // offset 104: 20 bytes :: address - contract address to prevent double spending

    // mload always reads 32 bytes.
    // so we can and have to start reading recipient at offset 20 instead of 32.
    // if we were to read at 32 the address would contain part of value and be corrupted.
    // when reading from offset 20 mload will read 12 bytes (most of them zeros) followed
    // by the 20 recipient address bytes and correctly convert it into an address.
    // this saves some storage/gas over the alternative solution
    // which is padding address to 32 bytes and reading recipient at offset 32.
    // for more details see discussion in:
    // https://github.com/paritytech/parity-bridge/issues/61
    function parseMessage(bytes message)
        internal
        pure
        returns (address recipient, uint256 amount, bytes32 txHash, address contractAddress)
    {
        require(isMessageValid(message));
        assembly {
            recipient := mload(add(message, 20))
            amount := mload(add(message, 52))
            txHash := mload(add(message, 84))
            contractAddress := mload(add(message, 104))
        }
    }

    function isMessageValid(bytes _msg) internal pure returns (bool) {
        return _msg.length == requiredMessageLength();
    }

    function requiredMessageLength() internal pure returns (uint256) {
        return 104;
    }

    function recoverAddressFromSignedMessage(bytes signature, bytes message, bool isAMBMessage)
        internal
        pure
        returns (address)
    {
        require(signature.length == 65);
        bytes32 r;
        bytes32 s;
        bytes1 v;

        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := mload(add(signature, 0x60))
        }
        return ecrecover(hashMessage(message, isAMBMessage), uint8(v), r, s);
    }

    function hashMessage(bytes message, bool isAMBMessage) internal pure returns (bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n";
        if (isAMBMessage) {
            return keccak256(abi.encodePacked(prefix, uintToString(message.length), message));
        } else {
            string memory msgLength = "104";
            return keccak256(abi.encodePacked(prefix, msgLength, message));
        }
    }

    function hasEnoughValidSignatures(
        bytes _message,
        uint8[] _vs,
        bytes32[] _rs,
        bytes32[] _ss,
        IBridgeValidators _validatorContract,
        bool isAMBMessage
    ) internal view {
        require(isAMBMessage || (!isAMBMessage && isMessageValid(_message)));
        uint256 requiredSignatures = _validatorContract.requiredSignatures();
        // It is not necessary to check that arrays have the same length since it will be handled
        // during attempt to access to the corresponding elements in the loop and the call will be reverted.
        // It will save gas for the rational validators actions and still be safe enough from security point of view
        require(_vs.length >= requiredSignatures);
        bytes32 hash = hashMessage(_message, isAMBMessage);
        address[] memory encounteredAddresses = new address[](requiredSignatures);

        for (uint256 i = 0; i < requiredSignatures; i++) {
            address recoveredAddress = ecrecover(hash, _vs[i], _rs[i], _ss[i]);
            require(_validatorContract.isValidator(recoveredAddress));
            require(!addressArrayContains(encounteredAddresses, recoveredAddress));
            encounteredAddresses[i] = recoveredAddress;
        }
    }

    function hasEnoughValidSignatures(
        bytes _message,
        bytes _signatures,
        IBridgeValidators _validatorContract,
        bool isAMBMessage
    ) internal view {
        require(isAMBMessage || (!isAMBMessage && isMessageValid(_message)));
        uint256 requiredSignatures = _validatorContract.requiredSignatures();
        uint8 amount;
        assembly {
            amount := mload(add(_signatures, 1))
        }
        require(amount >= requiredSignatures);
        bytes32 hash = hashMessage(_message, isAMBMessage);
        address[] memory encounteredAddresses = new address[](requiredSignatures);

        for (uint256 i = 0; i < requiredSignatures; i++) {
            uint8 v;
            bytes32 r;
            bytes32 s;
            uint256 posr = 33 + amount + 32 * i;
            uint256 poss = posr + 32 * amount;
            assembly {
                v := mload(add(_signatures, add(2, i)))
                r := mload(add(_signatures, posr))
                s := mload(add(_signatures, poss))
            }

            address recoveredAddress = ecrecover(hash, v, r, s);
            require(_validatorContract.isValidator(recoveredAddress));
            require(!addressArrayContains(encounteredAddresses, recoveredAddress));
            encounteredAddresses[i] = recoveredAddress;
        }
    }

    function uintToString(uint256 i) internal pure returns (string) {
        if (i == 0) return "0";
        uint256 j = i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length - 1;
        while (i != 0) {
            bstr[k--] = bytes1(48 + (i % 10));
            i /= 10;
        }
        return string(bstr);
    }
}

// File: contracts/libraries/ArbitraryMessage.sol

pragma solidity 0.4.24;



library ArbitraryMessage {
    // layout of message :: bytes:
    // offset  0: 32 bytes :: uint256 - message length
    // offset 32: 32 bytes :: bytes32 txHash
    // offset 52: 20 bytes :: address - sender address
    // offset 72: 20 bytes :: address - executor contract
    // offset 104: 32 bytes :: uint256 - gasLimit
    // offset 136: 1 bytes :: bytes1 - dataType
    // (optional) 137: 32 bytes :: uint256 - gasPrice
    // (optional) 137: 1 bytes :: bytes1 - gasPriceSpeed

    // bytes 1 to 32 are 0 because message length is stored as little endian.
    // mload always reads 32 bytes.
    // so we can and have to start reading recipient at offset 20 instead of 32.
    // if we were to read at 32 the address would contain part of value and be corrupted.
    // when reading from offset 20 mload will read 12 zero bytes followed
    // by the 20 recipient address bytes and correctly convert it into an address.
    // this saves some storage/gas over the alternative solution
    // which is padding address to 32 bytes and reading recipient at offset 32.
    // for more details see discussion in:
    // https://github.com/paritytech/parity-bridge/issues/61

    function unpackData(bytes _data, bool applyDataOffset)
        internal
        pure
        returns (
            address sender,
            address executor,
            bytes32 txHash,
            uint256 gasLimit,
            bytes1 dataType,
            uint256 gasPrice,
            bytes memory data
        )
    {
        uint256 dataOffset = 0;
        uint256 datasize;
        // 32 (tx hash) + 20 (sender)  + 20 (executor) + 32 (gasLimit) + 1 (dataType)
        uint256 srcdataptr = 32 + 20 + 20 + 32 + 1;
        assembly {
            txHash := mload(add(_data, 32))
            sender := mload(add(_data, 52))
            executor := mload(add(_data, 72))
            gasLimit := mload(add(_data, 104))
            dataType := and(mload(add(_data, 136)), 0xFF00000000000000000000000000000000000000000000000000000000000000)
            switch dataType
                case 0x0000000000000000000000000000000000000000000000000000000000000000 {
                    gasPrice := 0
                }
                case 0x0100000000000000000000000000000000000000000000000000000000000000 {
                    gasPrice := mload(add(_data, 137)) // 32
                    srcdataptr := add(srcdataptr, 0x20)
                }
                case 0x0200000000000000000000000000000000000000000000000000000000000000 {
                    gasPrice := 0
                    srcdataptr := add(srcdataptr, 0x01)
                }
            datasize := sub(mload(_data), srcdataptr)
        }
        data = new bytes(datasize);
        assembly {
            // BYTES_HEADER_SIZE
            let dataptr := add(data, 32)
            if eq(applyDataOffset, 1) {
                dataOffset := 32
            }
            // 68 = 4 (selector) + 32 (bytes header) + 32 (bytes length)
            calldatacopy(dataptr, add(add(68, srcdataptr), dataOffset), datasize)
        }
    }
}

// File: contracts/interfaces/IUpgradeabilityOwnerStorage.sol

pragma solidity 0.4.24;

interface IUpgradeabilityOwnerStorage {
    function upgradeabilityOwner() external view returns (address);
}

// File: contracts/upgradeable_contracts/Upgradeable.sol

pragma solidity 0.4.24;


contract Upgradeable {
    // Avoid using onlyUpgradeabilityOwner name to prevent issues with implementation from proxy contract
    modifier onlyIfUpgradeabilityOwner() {
        require(msg.sender == IUpgradeabilityOwnerStorage(this).upgradeabilityOwner());
        /* solcov ignore next */
        _;
    }
}

// File: contracts/upgradeability/EternalStorage.sol

pragma solidity 0.4.24;

/**
 * @title EternalStorage
 * @dev This contract holds all the necessary state variables to carry out the storage of any contract.
 */
contract EternalStorage {
    mapping(bytes32 => uint256) internal uintStorage;
    mapping(bytes32 => string) internal stringStorage;
    mapping(bytes32 => address) internal addressStorage;
    mapping(bytes32 => bytes) internal bytesStorage;
    mapping(bytes32 => bool) internal boolStorage;
    mapping(bytes32 => int256) internal intStorage;

}

// File: contracts/upgradeable_contracts/Initializable.sol

pragma solidity 0.4.24;


contract Initializable is EternalStorage {
    bytes32 internal constant INITIALIZED = keccak256(abi.encodePacked("isInitialized"));
    bytes32 internal constant DEPLOYED_AT_BLOCK = keccak256(abi.encodePacked("deployedAtBlock"));

    function setInitialize() internal {
        boolStorage[INITIALIZED] = true;
    }

    function isInitialized() public view returns (bool) {
        return boolStorage[INITIALIZED];
    }

    function deployedAtBlock() external view returns (uint256) {
        return uintStorage[DEPLOYED_AT_BLOCK];
    }
}

// File: openzeppelin-solidity/contracts/AddressUtils.sol

pragma solidity ^0.4.24;


/**
 * Utility library of inline functions on addresses
 */
library AddressUtils {

  /**
   * Returns whether the target address is a contract
   * @dev This function will return false if invoked during the constructor of a contract,
   * as the code is not actually created until after the constructor finishes.
   * @param _addr address to check
   * @return whether the target address is a contract
   */
  function isContract(address _addr) internal view returns (bool) {
    uint256 size;
    // XXX Currently there is no better way to check if there is a contract in an address
    // than to check the size of the code at that address.
    // See https://ethereum.stackexchange.com/a/14016/36603
    // for more details about how this works.
    // TODO Check this again before the Serenity release, because all addresses will be
    // contracts then.
    // solium-disable-next-line security/no-inline-assembly
    assembly { size := extcodesize(_addr) }
    return size > 0;
  }

}

// File: contracts/upgradeable_contracts/ValidatorStorage.sol

pragma solidity 0.4.24;

contract ValidatorStorage {
    bytes32 internal constant VALIDATOR_CONTRACT = keccak256(abi.encodePacked("validatorContract"));
}

// File: contracts/upgradeable_contracts/Validatable.sol

pragma solidity 0.4.24;




contract Validatable is EternalStorage, ValidatorStorage {
    function validatorContract() public view returns (IBridgeValidators) {
        return IBridgeValidators(addressStorage[VALIDATOR_CONTRACT]);
    }

    modifier onlyValidator() {
        require(validatorContract().isValidator(msg.sender));
        /* solcov ignore next */
        _;
    }

    function requiredSignatures() public view returns (uint256) {
        return validatorContract().requiredSignatures();
    }

}

// File: contracts/upgradeable_contracts/Ownable.sol

pragma solidity 0.4.24;


/**
 * @title Ownable
 * @dev This contract has an owner address providing basic authorization control
 */
contract Ownable is EternalStorage {
    /**
    * @dev Event to show ownership has been transferred
    * @param previousOwner representing the address of the previous owner
    * @param newOwner representing the address of the new owner
    */
    event OwnershipTransferred(address previousOwner, address newOwner);

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == owner());
        /* solcov ignore next */
        _;
    }

    /**
    * @dev Tells the address of the owner
    * @return the address of the owner
    */
    function owner() public view returns (address) {
        return addressStorage[keccak256(abi.encodePacked("owner"))];
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param newOwner the address to transfer ownership to.
    */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0));
        setOwner(newOwner);
    }

    /**
    * @dev Sets a new owner address
    */
    function setOwner(address newOwner) internal {
        emit OwnershipTransferred(owner(), newOwner);
        addressStorage[keccak256(abi.encodePacked("owner"))] = newOwner;
    }
}

// File: openzeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol

pragma solidity ^0.4.24;


/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * See https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address _who) public view returns (uint256);
  function transfer(address _to, uint256 _value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

// File: contracts/upgradeable_contracts/Sacrifice.sol

pragma solidity 0.4.24;

contract Sacrifice {
    constructor(address _recipient) public payable {
        selfdestruct(_recipient);
    }
}

// File: contracts/upgradeable_contracts/Claimable.sol

pragma solidity 0.4.24;



contract Claimable {
    bytes4 internal constant TRANSFER = 0xa9059cbb; // transfer(address,uint256)

    modifier validAddress(address _to) {
        require(_to != address(0));
        /* solcov ignore next */
        _;
    }

    function claimValues(address _token, address _to) internal {
        if (_token == address(0)) {
            claimNativeCoins(_to);
        } else {
            claimErc20Tokens(_token, _to);
        }
    }

    function claimNativeCoins(address _to) internal {
        uint256 value = address(this).balance;
        if (!_to.send(value)) {
            (new Sacrifice).value(value)(_to);
        }
    }

    function claimErc20Tokens(address _token, address _to) internal {
        ERC20Basic token = ERC20Basic(_token);
        uint256 balance = token.balanceOf(this);
        safeTransfer(_token, _to, balance);
    }

    function safeTransfer(address _token, address _to, uint256 _value) internal {
        bytes memory returnData;
        bool returnDataResult;
        bytes memory callData = abi.encodeWithSelector(TRANSFER, _to, _value);
        assembly {
            let result := call(gas, _token, 0x0, add(callData, 0x20), mload(callData), 0, 32)
            returnData := mload(0)
            returnDataResult := mload(0)

            switch result
                case 0 {
                    revert(0, 0)
                }
        }

        // Return data is optional
        if (returnData.length > 0) {
            require(returnDataResult);
        }
    }
}

// File: contracts/upgradeable_contracts/VersionableBridge.sol

pragma solidity 0.4.24;

contract VersionableBridge {
    function getBridgeInterfacesVersion() external pure returns (uint64 major, uint64 minor, uint64 patch) {
        return (2, 3, 0);
    }

    /* solcov ignore next */
    function getBridgeMode() external pure returns (bytes4);
}

// File: contracts/upgradeable_contracts/BasicBridge.sol

pragma solidity 0.4.24;








contract BasicBridge is Initializable, Validatable, Ownable, Upgradeable, Claimable, VersionableBridge {
    event GasPriceChanged(uint256 gasPrice);
    event RequiredBlockConfirmationChanged(uint256 requiredBlockConfirmations);

    bytes32 internal constant GAS_PRICE = keccak256(abi.encodePacked("gasPrice"));
    bytes32 internal constant REQUIRED_BLOCK_CONFIRMATIONS = keccak256(abi.encodePacked("requiredBlockConfirmations"));

    function setGasPrice(uint256 _gasPrice) external onlyOwner {
        require(_gasPrice > 0);
        uintStorage[GAS_PRICE] = _gasPrice;
        emit GasPriceChanged(_gasPrice);
    }

    function gasPrice() external view returns (uint256) {
        return uintStorage[GAS_PRICE];
    }

    function setRequiredBlockConfirmations(uint256 _blockConfirmations) external onlyOwner {
        require(_blockConfirmations > 0);
        uintStorage[REQUIRED_BLOCK_CONFIRMATIONS] = _blockConfirmations;
        emit RequiredBlockConfirmationChanged(_blockConfirmations);
    }

    function requiredBlockConfirmations() external view returns (uint256) {
        return uintStorage[REQUIRED_BLOCK_CONFIRMATIONS];
    }

    function claimTokens(address _token, address _to) public onlyIfUpgradeabilityOwner validAddress(_to) {
        claimValues(_token, _to);
    }
}

// File: contracts/upgradeable_contracts/arbitrary_message/BasicAMB.sol

pragma solidity 0.4.24;


contract BasicAMB is BasicBridge {
    bytes32 internal constant MAX_GAS_PER_TX = keccak256(abi.encodePacked("maxGasPerTx"));

    function initialize(
        address _validatorContract,
        uint256 _maxGasPerTx,
        uint256 _gasPrice,
        uint256 _requiredBlockConfirmations,
        address _owner
    ) public returns (bool) {
        require(!isInitialized());
        require(_validatorContract != address(0) && AddressUtils.isContract(_validatorContract));
        require(_gasPrice > 0);
        require(_requiredBlockConfirmations > 0);

        addressStorage[VALIDATOR_CONTRACT] = _validatorContract;
        uintStorage[DEPLOYED_AT_BLOCK] = block.number;
        uintStorage[MAX_GAS_PER_TX] = _maxGasPerTx;
        uintStorage[GAS_PRICE] = _gasPrice;
        uintStorage[REQUIRED_BLOCK_CONFIRMATIONS] = _requiredBlockConfirmations;
        setOwner(_owner);
        setInitialize();

        emit RequiredBlockConfirmationChanged(_requiredBlockConfirmations);
        emit GasPriceChanged(_gasPrice);

        return isInitialized();
    }

    function getBridgeMode() external pure returns (bytes4 _data) {
        return bytes4(keccak256(abi.encodePacked("arbitrary-message-bridge-core")));
    }

    function maxGasPerTx() public view returns (uint256) {
        return uintStorage[MAX_GAS_PER_TX];
    }

    function setMaxGasPerTx(uint256 _maxGasPerTx) external onlyOwner {
        uintStorage[MAX_GAS_PER_TX] = _maxGasPerTx;
    }
}

// File: openzeppelin-solidity/contracts/math/SafeMath.sol

pragma solidity ^0.4.24;


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (_a == 0) {
      return 0;
    }

    c = _a * _b;
    assert(c / _a == _b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
    // assert(_b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = _a / _b;
    // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold
    return _a / _b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
    assert(_b <= _a);
    return _a - _b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    c = _a + _b;
    assert(c >= _a);
    return c;
  }
}

// File: contracts/upgradeable_contracts/arbitrary_message/MessageDelivery.sol

pragma solidity 0.4.24;



contract MessageDelivery is BasicAMB {
    using SafeMath for uint256;

    function requireToPassMessage(address _contract, bytes _data, uint256 _gas) public {
        require(_gas >= getMinimumGasUsage(_data) && _gas <= maxGasPerTx());
        emitEventOnMessageRequest(abi.encodePacked(msg.sender, _contract, _gas, uint8(0x00), _data));
    }

    function getMinimumGasUsage(bytes _data) public pure returns (uint256 gas) {
        //From Ethereum Yellow Paper
        // 68 gas is paid for every non-zero byte of data or code for a transaction
        return _data.length.mul(68);
    }

    /* solcov ignore next */
    function emitEventOnMessageRequest(bytes encodedData) internal;
}

// File: contracts/libraries/Bytes.sol

pragma solidity 0.4.24;

library Bytes {
    function bytesToBytes32(bytes _bytes) internal pure returns (bytes32 result) {
        assembly {
            result := mload(add(_bytes, 32))
        }
    }
}

// File: contracts/upgradeable_contracts/arbitrary_message/MessageProcessor.sol

pragma solidity 0.4.24;



contract MessageProcessor is EternalStorage {
    bytes32 internal constant MESSAGE_SENDER = keccak256(abi.encodePacked("messageSender"));
    bytes32 internal constant TRANSACTION_HASH = keccak256(abi.encodePacked("transactionHash"));

    function messageCallStatus(bytes32 _txHash) external view returns (bool) {
        return boolStorage[keccak256(abi.encodePacked("messageCallStatus", _txHash))];
    }

    function setMessageCallStatus(bytes32 _txHash, bool _status) internal {
        boolStorage[keccak256(abi.encodePacked("messageCallStatus", _txHash))] = _status;
    }

    function failedMessageDataHash(bytes32 _txHash) external view returns (bytes32) {
        return Bytes.bytesToBytes32(bytesStorage[keccak256(abi.encodePacked("failedMessageDataHash", _txHash))]);
    }

    function setFailedMessageDataHash(bytes32 _txHash, bytes data) internal {
        bytesStorage[keccak256(abi.encodePacked("failedMessageDataHash", _txHash))] = abi.encodePacked(keccak256(data));
    }

    function failedMessageReceiver(bytes32 _txHash) external view returns (address) {
        return addressStorage[keccak256(abi.encodePacked("failedMessageReceiver", _txHash))];
    }

    function setFailedMessageReceiver(bytes32 _txHash, address _receiver) internal {
        addressStorage[keccak256(abi.encodePacked("failedMessageReceiver", _txHash))] = _receiver;
    }

    function failedMessageSender(bytes32 _txHash) external view returns (address) {
        return addressStorage[keccak256(abi.encodePacked("failedMessageSender", _txHash))];
    }

    function setFailedMessageSender(bytes32 _txHash, address _sender) internal {
        addressStorage[keccak256(abi.encodePacked("failedMessageSender", _txHash))] = _sender;
    }

    function messageSender() external view returns (address) {
        return addressStorage[MESSAGE_SENDER];
    }

    function setMessageSender(address _sender) internal {
        addressStorage[MESSAGE_SENDER] = _sender;
    }

    function transactionHash() external view returns (bytes32) {
        return Bytes.bytesToBytes32(bytesStorage[TRANSACTION_HASH]);
    }

    function setTransactionHash(bytes32 _txHash) internal {
        bytesStorage[TRANSACTION_HASH] = abi.encodePacked(_txHash);
    }

    function processMessage(
        address sender,
        address executor,
        bytes32 txHash,
        uint256 gasLimit,
        bytes1, /* dataType */
        uint256, /* gasPrice */
        bytes memory data
    ) internal {
        bool status = _passMessage(sender, executor, data, gasLimit, txHash);

        setMessageCallStatus(txHash, status);
        if (!status) {
            setFailedMessageDataHash(txHash, data);
            setFailedMessageReceiver(txHash, executor);
            setFailedMessageSender(txHash, sender);
        }
        emitEventOnMessageProcessed(sender, executor, txHash, status);
    }

    function _passMessage(address _sender, address _contract, bytes _data, uint256 _gas, bytes32 _txHash)
        internal
        returns (bool)
    {
        setMessageSender(_sender);
        setTransactionHash(_txHash);
        bool status = _contract.call.gas(_gas)(_data);
        setMessageSender(address(0));
        setTransactionHash(bytes32(0));
        return status;
    }

    /* solcov ignore next */
    function emitEventOnMessageProcessed(address sender, address executor, bytes32 txHash, bool status) internal;
}

// File: contracts/upgradeable_contracts/arbitrary_message/BasicHomeAMB.sol

pragma solidity 0.4.24;






contract BasicHomeAMB is BasicAMB, MessageDelivery, MessageProcessor {
    event SignedForUserRequest(address indexed signer, bytes32 messageHash);
    event SignedForAffirmation(address indexed signer, bytes32 messageHash);

    event CollectedSignatures(
        address authorityResponsibleForRelay,
        bytes32 messageHash,
        uint256 NumberOfCollectedSignatures
    );

    function executeAffirmation(bytes message) external onlyValidator {
        bytes32 hashMsg = keccak256(abi.encodePacked(message));
        bytes32 hashSender = keccak256(abi.encodePacked(msg.sender, hashMsg));
        // Duplicated affirmations
        require(!affirmationsSigned(hashSender));
        setAffirmationsSigned(hashSender, true);

        uint256 signed = numAffirmationsSigned(hashMsg);
        require(!isAlreadyProcessed(signed));
        // the check above assumes that the case when the value could be overflew will not happen in the addition operation below
        signed = signed + 1;

        setNumAffirmationsSigned(hashMsg, signed);

        emit SignedForAffirmation(msg.sender, hashMsg);

        if (signed >= requiredSignatures()) {
            setNumAffirmationsSigned(hashMsg, markAsProcessed(signed));
            handleMessage(message);
        }
    }

    function handleMessage(bytes _message) internal {
        address sender;
        address executor;
        bytes32 txHash;
        uint256 gasLimit;
        bytes1 dataType;
        uint256 gasPrice;
        bytes memory data;
        (sender, executor, txHash, gasLimit, dataType, gasPrice, data) = ArbitraryMessage.unpackData(_message, false);
        processMessage(sender, executor, txHash, gasLimit, dataType, gasPrice, data);
    }

    function submitSignature(bytes signature, bytes message) external onlyValidator {
        // ensure that `signature` is really `message` signed by `msg.sender`
        require(msg.sender == Message.recoverAddressFromSignedMessage(signature, message, true));
        bytes32 hashMsg = keccak256(abi.encodePacked(message));
        bytes32 hashSender = keccak256(abi.encodePacked(msg.sender, hashMsg));

        uint256 signed = numMessagesSigned(hashMsg);
        require(!isAlreadyProcessed(signed));
        // the check above assumes that the case when the value could be overflew
        // will not happen in the addition operation below
        signed = signed + 1;
        if (signed > 1) {
            // Duplicated signatures
            require(!messagesSigned(hashSender));
        } else {
            setMessages(hashMsg, message);
        }
        setMessagesSigned(hashSender, true);

        bytes32 signIdx = keccak256(abi.encodePacked(hashMsg, (signed.sub(1))));
        setSignatures(signIdx, signature);

        setNumMessagesSigned(hashMsg, signed);

        emit SignedForUserRequest(msg.sender, hashMsg);

        uint256 reqSigs = requiredSignatures();
        if (signed >= reqSigs) {
            setNumMessagesSigned(hashMsg, markAsProcessed(signed));
            emit CollectedSignatures(msg.sender, hashMsg, reqSigs);
        }
    }

    function isAlreadyProcessed(uint256 _number) public pure returns (bool) {
        return _number & (2**255) == 2**255;
    }

    function numMessagesSigned(bytes32 _message) public view returns (uint256) {
        return uintStorage[keccak256(abi.encodePacked("numMessagesSigned", _message))];
    }

    function signature(bytes32 _hash, uint256 _index) public view returns (bytes) {
        bytes32 signIdx = keccak256(abi.encodePacked(_hash, _index));
        return bytesStorage[keccak256(abi.encodePacked("signatures", signIdx))];
    }

    function messagesSigned(bytes32 _message) public view returns (bool) {
        return boolStorage[keccak256(abi.encodePacked("messagesSigned", _message))];
    }

    function message(bytes32 _hash) public view returns (bytes) {
        return messages(_hash);
    }

    function affirmationsSigned(bytes32 _hash) public view returns (bool) {
        return boolStorage[keccak256(abi.encodePacked("affirmationsSigned", _hash))];
    }

    function numAffirmationsSigned(bytes32 _hash) public view returns (uint256) {
        return uintStorage[keccak256(abi.encodePacked("numAffirmationsSigned", _hash))];
    }

    function setMessagesSigned(bytes32 _hash, bool _status) internal {
        boolStorage[keccak256(abi.encodePacked("messagesSigned", _hash))] = _status;
    }

    function messages(bytes32 _hash) internal view returns (bytes) {
        return bytesStorage[keccak256(abi.encodePacked("messages", _hash))];
    }

    function setSignatures(bytes32 _hash, bytes _signature) internal {
        bytesStorage[keccak256(abi.encodePacked("signatures", _hash))] = _signature;
    }

    function setMessages(bytes32 _hash, bytes _message) internal {
        bytesStorage[keccak256(abi.encodePacked("messages", _hash))] = _message;
    }

    function setNumMessagesSigned(bytes32 _message, uint256 _number) internal {
        uintStorage[keccak256(abi.encodePacked("numMessagesSigned", _message))] = _number;
    }

    function markAsProcessed(uint256 _v) internal pure returns (uint256) {
        return _v | (2**255);
    }

    function setAffirmationsSigned(bytes32 _hash, bool _status) internal {
        boolStorage[keccak256(abi.encodePacked("affirmationsSigned", _hash))] = _status;
    }

    function setNumAffirmationsSigned(bytes32 _hash, uint256 _number) internal {
        uintStorage[keccak256(abi.encodePacked("numAffirmationsSigned", _hash))] = _number;
    }
}

// File: contracts/upgradeable_contracts/arbitrary_message/HomeAMB.sol

pragma solidity 0.4.24;


contract HomeAMB is BasicHomeAMB {
    event UserRequestForSignature(bytes encodedData);
    event AffirmationCompleted(
        address indexed sender,
        address indexed executor,
        bytes32 indexed transactionHash,
        bool status
    );

    function emitEventOnMessageRequest(bytes encodedData) internal {
        emit UserRequestForSignature(encodedData);
    }

    function emitEventOnMessageProcessed(address sender, address executor, bytes32 txHash, bool status) internal {
        emit AffirmationCompleted(sender, executor, txHash, status);
    }
}
