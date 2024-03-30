// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPriceContract.sol";
import "./access/Ownable.sol";
import "./utils/math/Math.sol";

contract PriceContract is IPriceContract, Ownable {
  using Math for uint256;

  uint256 public usdcChickenPrice; 
  uint256 public nativeChickenPrice; 
  uint256 public usdcEggPrice; 
  uint256 public nativeEggPrice; 
  uint256 public eggChickenPrice; 

  constructor(
    uint256 price1, 
    uint256 price2, 
    uint256 price3, 
    uint256 price4, 
    uint256 price5
  ) Ownable(_msgSender()) {
    usdcChickenPrice = price1;
    nativeChickenPrice = price2;
    eggChickenPrice = price3;
    usdcEggPrice = price4;
    nativeEggPrice = price5;
  }

  function setPrice(
    uint256 price1, 
    uint256 price2, 
    uint256 price3, 
    uint256 price4, 
    uint256 price5
  ) external onlyOwner {
    if(price1 != 0) 
      usdcChickenPrice = price1;
    if(price2 != 0)
      nativeChickenPrice = price2;
    if(price3 != 0)
      eggChickenPrice = price3;
    if(price4 != 0)
      usdcEggPrice = price4;
    if (price5 != 0)
      nativeEggPrice = price5;
  }

  function getChickenPriceUSDC() external view returns (uint256) { 
    return usdcChickenPrice;
  }

  function getChickenPriceNative() external view returns (uint256) { 
    return nativeChickenPrice;
  }

  function getChickenPriceEgg() external view returns (uint256) { 
    return eggChickenPrice;
  }

  function getEggPriceNative() external view returns (uint256) { 
    return nativeEggPrice;
  }

  function getEggPriceEgg() external view returns (uint256) { 
    return usdcEggPrice;
  }
}
