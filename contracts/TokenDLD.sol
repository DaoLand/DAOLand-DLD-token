// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IAntisnipe {
    function assureCanTransfer(
        address account,
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract TokenDLD is ERC20, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    address private owner;
    uint256 public constant initialSupply = 100_000_000 * 1e18; // 1_000_000 tokens(with 18 decimals)

    bool public antisnipeEnabled;
    IAntisnipe public antisnipe =
        IAntisnipe(0x2E5dDfb5F950fd98fb159E1FA9ABc8DB12DCcFCf);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);

        _mint(msg.sender, initialSupply);

        owner = msg.sender;
    }

    function withdrawToken(address token, uint256 amount)
        external
        onlyRole(ADMIN_ROLE)
    {
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function setOwner(address _newOnwer) external {
        require(msg.sender == owner, "you are not owner");
        owner = _newOnwer;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (antisnipeEnabled && address(antisnipe) != address(0)) {
            require(antisnipe.assureCanTransfer(msg.sender, from, to, amount));
        }
    }

    function setAntisnipeDisable(bool _antisnipeEnabled)
        external
        onlyRole(ADMIN_ROLE)
    {
        require(antisnipeEnabled);
        antisnipeEnabled = _antisnipeEnabled;
    }
}

