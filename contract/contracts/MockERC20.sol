// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "./utils/math/Math.sol";
import "./ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    uint8 private overridingDecimal;
    constructor(string memory _name, string memory _symbol, uint8 _decimals)
        ERC20(_name, _symbol)
    {
        overridingDecimal = _decimals;
    }

    function decimals() public view override returns (uint8) {
        return overridingDecimal;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}