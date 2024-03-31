// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPriceContract {
  function getChickenPriceUSDC() external view returns (uint256);
  function getChickenPriceNative() external view returns (uint256);
  function getChickenPriceEgg() external view returns (uint256);
  function getEggPriceNative() external view returns (uint256);
  function getEggPriceEgg() external view returns (uint256);
}
