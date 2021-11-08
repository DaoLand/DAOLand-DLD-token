// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenDLD is ERC20, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    uint256 public constant initialSupply =  100_000_000*1e18; // 100M tokens(with 18 decimals)
    address private owner;

    mapping(address => bool) public whitelist;
    mapping(address => bool) public blocklist;

    bool public paused;

    modifier notBlocked(address _recipient) {
        require(
            !blocklist[msg.sender] && !blocklist[_recipient],
            "You are in blocklist"
        );
        _;
    }

    modifier pausable(address _recipient) {
        if (paused) {
            require(
                whitelist[msg.sender] || whitelist[_recipient],
                "Only whitelisted users can transfer while token paused!"
            );
        }
        _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);

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
        address _from,
        address _to,
        uint256 _amount
    ) internal override notBlocked(_to) pausable(_to) {
        super._beforeTokenTransfer(_from, _to, _amount);
    }

    function setPause(bool _state) public onlyRole(ADMIN_ROLE) {
        paused = _state;
    }

    function setWhiteStatus(address _user, bool _state)
        public
        onlyRole(ADMIN_ROLE)
    {
        whitelist[_user] = _state;
    }

    function setBlockStatus(address _user, bool _state)
        public
        onlyRole(ADMIN_ROLE)
    {
        blocklist[_user] = _state;
    }
}
