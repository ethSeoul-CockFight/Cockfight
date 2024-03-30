// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC721A.sol";
import "./access/Ownable.sol";
import "./interfaces/INFTContract.sol";
import "./utils/math/Math.sol";

contract NFTContract is ERC721A, Ownable, INFTContract {
  using Math for uint256;

  address public seller;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(_msgSender()) {}

  function setSeller(address _seller) external onlyOwner {
    seller = _seller;
  }

  function mintNFT(address to, uint256 count) external {
    require(_msgSender() == seller, "Invalid seller");
    _mintNft(to, count);
  }
}
