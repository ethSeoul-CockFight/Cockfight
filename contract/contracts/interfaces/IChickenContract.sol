// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721Enumerable} from "./IERC721Enumerable.sol";

interface IChickenContract is IERC721Enumerable {
  function setVault(address _seller) external;
  function mintNFT(address to, uint256 count) external;
  function burnNFT(uint256 tokenId) external;
}
