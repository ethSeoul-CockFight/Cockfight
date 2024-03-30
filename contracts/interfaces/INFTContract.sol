// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface INFTContract {
  function setSeller(address _seller) external;
  function mintNFT(address to, uint256 count) external;
}
