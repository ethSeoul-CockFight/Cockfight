// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPriceContract.sol";
import "./access/Ownable.sol";
import "./utils/math/Math.sol";

// volatile chicken과 usdc chicken의 금액을 결정하기 위함
contract PriceContract is IPriceContract, Ownable {
  using Math for uint256;

  // 총 5개의 price를 관리
  uint256 public usdcChickenPrice; // chicken 1개의 usdc 가격
  uint256 public nativeChickenPrice; // chicken 1개의 native 가격
  uint256 public usdcEggPrice; // egg 1의 usdc 가격
  uint256 public nativeEggPrice; // egg 1의 native 가격 
  uint256 public eggChickenPrice; // chicken 1개의 egg 가격

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

  function getChickenPriceUSDC() external view returns (uint256) { // usdc로 나타낸 chicken 1마리 가격
    return usdcChickenPrice;
  }

  function getChickenPriceNative() external view returns (uint256) { // native로 나타낸 chicken 1마리 가격
    return nativeChickenPrice;
  }

  function getChickenPriceEgg() external view returns (uint256) { // egg로 나타낸 chicken 1마리 가격
    return eggChickenPrice;
  }

  function getEggPriceNative() external view returns (uint256) { // native로 나타낸 chicken 1마리 가격
    return nativeEggPrice;
  }

  function getEggPriceEgg() external view returns (uint256) { // egg로 나타낸 chicken 1마리 가격
    return usdcEggPrice;
  }
}
