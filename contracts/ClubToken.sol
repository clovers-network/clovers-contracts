pragma solidity ^0.4.18;

/**
 * ClubToken adheres to ERC20
 * it is a continuously mintable token administered by CloversController/ClubTokenController
 */

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";

contract ClubToken is StandardToken, DetailedERC20, MintableToken, BurnableToken {

    address cloversController;
    address clubTokenController;

    modifier hasMintPermission() {
      require(
          msg.sender == clubTokenController ||
          msg.sender == cloversController ||
          msg.sender == owner
      );
      _;
    }

    /**
    * @dev constructor for the ClubTokens contract
    * @param _name The name of the token
    * @param _symbol The symbol of the token
    * @param _decimals The decimals of the token
    */
    function ClubToken(string _name, string _symbol, uint8 _decimals) public
        DetailedERC20(_name, _symbol, _decimals)
    {}

    function updateClubTokenControllerAddress(address _clubTokenController) public onlyOwner {
        require(_clubTokenController != 0);
        clubTokenController = _clubTokenController;
    }

    function updateCloversControllerAddress(address _cloversController) public onlyOwner {
        require(_cloversController != 0);
        cloversController = _cloversController;
    }

    /**
     * @dev Burns a specific amount of tokens.
     * @param _value The amount of token to be burned.
     * NOTE: Disabled as tokens should not be burned under circumstances beside selling tokens.
     */
    function burn(uint256 _value) public {
        revert();
    }

    /**
     * @dev Burns a specific amount of tokens.
     * @param _burner The address of the token holder burning their tokens.
     * @param _value The amount of token to be burned.
     */
    function burn(address _burner, uint256 _value) public hasMintPermission {
      _burn(_burner, _value);
    }
}
