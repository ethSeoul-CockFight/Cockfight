// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "./IERC20.sol";

interface IEggContract is IERC20 {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
}
