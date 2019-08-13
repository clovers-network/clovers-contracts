pragma solidity ^0.4.24;


/**
 * @title Ownable
 * @dev The Ownable contract has an admin address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Admin {
  mapping (address => bool) public admins;


  event AdminshipRenounced(address indexed previousAdmin);
  event AdminshipTransferred(
    address indexed previousAdmin,
    address indexed newAdmin
  );


  /**
   * @dev The Ownable constructor sets the original `admin` of the contract to the sender
   * account.
   */
  constructor() public {
    admins[msg.sender] = true;
  }

  /**
   * @dev Throws if called by any account other than the admin.
   */
  modifier onlyAdmin() {
    require(admins[msg.sender]);
    _;
  }

  function isAdmin(address _admin) public view returns(bool) {
    return admins[_admin];
  }

  /**
   * @dev Allows the current admin to relinquish control of the contract.
   * @notice Renouncing to adminship will leave the contract without an admin.
   * It will not be possible to call the functions with the `onlyAdmin`
   * modifier anymore.
   */
  function renounceAdminship(address _previousAdmin) public onlyAdmin {
    emit AdminshipRenounced(_previousAdmin);
    admins[_previousAdmin] = false;
  }

  /**
   * @dev Allows the current admin to transfer control of the contract to a newAdmin.
   * @param _newAdmin The address to transfer adminship to.
   */
  function transferAdminship(address _newAdmin) public onlyAdmin {
    _transferAdminship(_newAdmin);
  }

  /**
   * @dev Transfers control of the contract to a newAdmin.
   * @param _newAdmin The address to transfer adminship to.
   */
  function _transferAdminship(address _newAdmin) internal {
    require(_newAdmin != address(0));
    emit AdminshipTransferred(msg.sender, _newAdmin);
    admins[_newAdmin] = true;
  }
}
