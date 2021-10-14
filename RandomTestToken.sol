// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RandomTestToken is ERC20 {
    constructor() public ERC20('RandomTestToken', 'RAND') {
        _mint(msg.sender, 1000000000 * 10 ** 18);
    }
}
