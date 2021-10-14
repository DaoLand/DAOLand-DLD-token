// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenDLS is ERC20Burnable, AccessControl {
    using SafeERC20 for IERC20;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    constructor(
        string memory name,
        string memory symbol
    ) public ERC20(name, symbol) {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
        _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
        
        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(BURNER_ROLE, ADMIN_ROLE);
    }
    
    function mint(address owner, uint256 amount) public payable onlyRole(MINTER_ROLE) {
        _mint(owner, amount);
    }
    
    function burn(address owner, uint256 amount) public payable onlyRole(BURNER_ROLE) {
        _burn(owner, amount);
    }
    
    function withdrawToken(address token, uint256 amount) public payable onlyRole(ADMIN_ROLE) {
        IERC20(token).safeTransfer(
            msg.sender,
            amount
        );
    }
}
