// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/INFTContract.sol";
import "./interfaces/IPriceContract.sol";
import "./interfaces/IERC20.sol";
import "./access/Ownable.sol";

contract SaleContract is Ownable {
  INFTContract public tokenContract;
  IPriceContract public priceContract;
  IERC20 public constant stableContract = IERC20(0xf32237F75615268565e41f4B99998773c99E56B8);
  uint256 public count;
  bool public killSwitch = false;

  modifier checkSwitch() {
    require(killSwitch == false, "Contract stopped");
    _;
  }

  modifier checkContract() {
    require(tokenContract != INFTContract(address(0)), "Contract not set");
    require(priceContract != IPriceContract(address(0)), "Contract not set");
    _;
  }

  constructor() Ownable(_msgSender()) {}

  function buyNative() external payable checkContract checkSwitch {
    // BFC : native token
    uint256 price = priceContract.getPriceNative();
    require(msg.value == price, "Invalid price");
    count = count + 1;
    tokenContract.mintNFT(_msgSender(), count);
  }

  function buyToken() external checkContract checkSwitch {
    uint256 price = priceContract.getPriceUSDC();
    stableContract.transferFrom(_msgSender(), address(this), price);
    count = count + 1;
    tokenContract.mintNFT(_msgSender(), count);
  }

  function withdrawNative(uint256 amount) external checkSwitch onlyOwner {
    payable(owner()).transfer(amount);
  }

  function withdrawUSDC(uint256 amount) external checkSwitch onlyOwner {
    stableContract.transfer(owner(), amount);
  }

  function setPriceContract(address _contract) external onlyOwner {
    priceContract = IPriceContract(_contract);
  }

  function setSwitch(bool input) external onlyOwner {
    killSwitch = input;
  }

  function setNFTContract(address _contract) external onlyOwner {
    tokenContract = INFTContract(_contract);
  }
}
