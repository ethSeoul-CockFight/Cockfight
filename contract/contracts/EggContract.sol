// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "./interfaces/IEggContract.sol";
import "./access/Ownable.sol";
import "./utils/math/Math.sol";
import "./ERC20/ERC20.sol";

contract EggContract is ERC20, Ownable {
    address public vault;

    constructor()
        ERC20("EggToken", "EGG")
        Ownable(msg.sender)
    {}

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == vault || msg.sender == owner(), "Invalid caller");
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        require(msg.sender == vault, "Invalid caller");
        _burn(vault, amount);
    } 
}