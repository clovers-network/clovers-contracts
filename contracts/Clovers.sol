pragma solidity ^0.4.18;
pragma experimental ABIEncoderV2;

/**
 * Digital Asset Registry for the Non Fungible Token Clover
 * with upgradeable contract reference for returning metadata.
 */

import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Reversi.sol";
import "./IClovers.sol";
import "./CloversMetadata.sol";


contract Clovers is IClovers, ERC721Token, Ownable {

    address cloversMetadata;
    uint256 totalSymmetries;
    uint256[5] symmetries; // RotSym, Y0Sym, X0Sym, XYSym, XnYSym
    address cloversController;

    mapping (uint256 => Clover) public clovers;
    struct Clover {
        bool keep;
        uint256 symmetries;
        bytes28[2] cloverMoves;
        uint256 blockMinted;
        uint256 rewards;
    }

    modifier onlyOwnerOrController() {
        require(
            msg.sender == cloversController ||
            msg.sender == owner
        );
        _;
    }

    constructor(string name, string symbol) public
        ERC721Token(name, symbol)
    { }

    function () public payable {}

    function implementation() public view returns (address) {
        return cloversMetadata;
    }

    function tokenURI(uint _tokenId) public view returns (string _infoUrl) {
        // require(ownerOf(_tokenId) != 0);
        address _impl = implementation();
        bytes memory data = msg.data;
        assembly {
            let result := delegatecall(gas, _impl, add(data, 0x20), mload(data), 0, 0)
            let size := returndatasize
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
        // return CloversMetadata(cloversMetadata).tokenMetadata(_tokenId);
    }
    function getHash(bytes28[2] moves) public pure returns (bytes32) {
        return keccak256(moves);
    }
    function getKeep(uint256 _tokenId) public view returns (bool) {
        return clovers[_tokenId].keep;
    }
    function getBlockMinted(uint256 _tokenId) public view returns (uint256) {
        return clovers[_tokenId].blockMinted;
    }
    function getCloverMoves(uint256 _tokenId) public view returns (bytes28[2]) {
        return clovers[_tokenId].cloverMoves;
    }
    function getReward(uint256 _tokenId) public view returns (uint256) {
        return clovers[_tokenId].rewards;
    }
    function getSymmetries(uint256 _tokenId) public view returns (uint256) {
        return clovers[_tokenId].symmetries;
    }
    function getAllSymmetries() public view returns (uint256, uint256, uint256, uint256, uint256, uint256) {
        return (
            totalSymmetries,
            symmetries[0], //RotSym,
            symmetries[1], //Y0Sym,
            symmetries[2], //X0Sym,
            symmetries[3], //XYSym,
            symmetries[4] //XnYSym
        );
    }

/* ---------------------------------------------------------------------------------------------------------------------- */

    /**
    * @dev Moves Eth to a certain address for use in the CloversController
    * @param _to The address to receive the Eth.
    * @param _amount The amount of Eth to be transferred.
    */
    function moveEth(address _to, uint256 _amount) public onlyOwnerOrController {
        require(_amount <= this.balance);
        _to.transfer(_amount);
    }
    /**
    * @dev Moves Token to a certain address for use in the CloversController
    * @param _to The address to receive the Token.
    * @param _amount The amount of Token to be transferred.
    * @param _token The address of the Token to be transferred.
    */
    function moveToken(address _to, uint256 _amount, address _token) public onlyOwnerOrController returns (bool) {
        require(_amount <= ERC20(_token).balanceOf(this));
        return ERC20(_token).transfer(_to, _amount);
    }
    /**
    * @dev Approves Tokens to a certain address for use in the CloversController
    * @param _to The address to receive the Token approval.
    * @param _amount The amount of Token to be approved.
    * @param _token The address of the Token to be approved.
    */
    function approveToken(address _to, uint256 _amount, address _token) public onlyOwnerOrController returns (bool) {
        return ERC20(_token).approve(_to, _amount);
    }

    /**
    * @dev Sets whether the minter will keep the clover
    * @param _tokenId The token Id.
    * @param value Whether the clover will be kept.
    */
    function setKeep(uint256 _tokenId, bool value) public onlyOwnerOrController {
        clovers[_tokenId].keep = value;
    }
    function setBlockMinted(uint256 _tokenId, uint256 value) public onlyOwnerOrController {
        clovers[_tokenId].blockMinted = value;
    }
    function setCloverMoves(uint256 _tokenId, bytes28[2] moves) public onlyOwnerOrController {
        clovers[_tokenId].cloverMoves = moves;
    }
    function setReward(uint256 _tokenId, uint256 _amount) public onlyOwnerOrController {
        clovers[_tokenId].rewards = _amount;
    }
    function setSymmetries(uint256 _tokenId, uint256 _symmetries) public onlyOwnerOrController {
        clovers[_tokenId].symmetries = _symmetries;
    }

    /**
    * @dev Sets total tallies of symmetry counts. For use by the controller to correct for invalid Clovers.
    * @param _totalSymmetries The total number of Symmetries.
    * @param RotSym The total number of RotSym Symmetries.
    * @param Y0Sym The total number of Y0Sym Symmetries.
    * @param X0Sym The total number of X0Sym Symmetries.
    * @param XYSym The total number of XYSym Symmetries.
    * @param XnYSym The total number of XnYSym Symmetries.
    */
    function setAllSymmetries(uint256 _totalSymmetries, uint256 RotSym, uint256 Y0Sym, uint256 X0Sym, uint256 XYSym, uint256 XnYSym) public onlyOwnerOrController {
        totalSymmetries = _totalSymmetries;
        symmetries[0] = RotSym;
        symmetries[1] = Y0Sym;
        symmetries[2] = X0Sym;
        symmetries[3] = XYSym;
        symmetries[4] = XnYSym;
    }

    /**
    * @dev Deletes data about a Clover.
    * @param _tokenId The Id of the clover token to be deleted.
    */
    function deleteClover(uint256 _tokenId) public onlyOwnerOrController {
        delete(clovers[_tokenId]);
    }
    /**
    * @dev Updates the CloversController contract address and approves that contract to manage the Clovers owned by the Clovers contract.
    * @param _cloversController The address of the new contract.
    */
    function updateCloversControllerAddress(address _cloversController) public onlyOwner {
        require(_cloversController != 0);

        operatorApprovals[address(this)][cloversController] = false;
        emit ApprovalForAll(address(this), cloversController, false);

        operatorApprovals[address(this)][_cloversController] = true;
        emit ApprovalForAll(address(this), _cloversController, true);

        cloversController = _cloversController;
    }

    /**
    * @dev Updates the CloversMetadata contract address.
    * @param _cloversMetadata The address of the new contract.
    */
    function updateCloversMetadataAddress(address _cloversMetadata) public onlyOwner {
        require(_cloversMetadata != 0);
        cloversMetadata = _cloversMetadata;
    }

    /**
    * @dev Mints new Clovers.
    * @param _to The address of the new clover owner.
    * @param _tokenId The Id of the new clover token.
    */
    function mint (address _to, uint256 _tokenId) public onlyOwnerOrController {
        super._mint(_to, _tokenId);
    }
    /**
    * @dev Unmints Clovers.
    * @param _tokenId The Id of the clover token to be destroyed.
    */
    function unmint (uint256 _tokenId) public onlyOwnerOrController {
        super._burn(ownerOf(_tokenId), _tokenId);
    }


}
