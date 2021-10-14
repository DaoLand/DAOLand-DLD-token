// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenDLD is ERC20, AccessControl {
    using SafeERC20 for IERC20;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public constant initialSupply = 1000000 * 10 ** 18; // 1_000_000 tokens(with 18 decimals)

    constructor(
        string memory name,
        string memory symbol
    ) public ERC20(name, symbol) {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);

        _mint(msg.sender, initialSupply);
    }
    
    function withdrawToken(address token, uint256 amount) public payable onlyRole(ADMIN_ROLE) {
        IERC20(token).safeTransfer(
            msg.sender,
            amount
        );
    }
}
