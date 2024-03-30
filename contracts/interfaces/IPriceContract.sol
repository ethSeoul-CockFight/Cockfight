// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPriceContract {
  function getPriceUSDC() external view returns (uint256);
  function getPriceNative() external view returns (uint256);
}
