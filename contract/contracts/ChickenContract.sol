// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC721/ERC721Enumerable.sol";
import "./access/Ownable.sol";
import "./interfaces/IChickenContract.sol";
import "./utils/math/Math.sol";

contract ChickenContract is ERC721Enumerable, Ownable, IChickenContract {
  using Math for uint256;

  address public vault;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(_msgSender()) {}

  function setVault(address _vault) external onlyOwner {
    vault = _vault;
  }

  function mintNFT(address to, uint256 count) external {
    require(_msgSender() == vault, "Invalid caller");
    _mintNft(to, count);
  }

  function burnNFT(uint256 tokenId) external {
    require(_msgSender() == vault, "Invalid caller");
    _burnNft(tokenId);
  }

  function _mintNft(address to, uint256 tokenId) internal virtual {
    _safeMint(to, tokenId, "");
  }
  function _burnNft(uint tokenId) internal virtual {
    _burn(tokenId);
  }

  // Todo 
  // when user transfers chicken nft,
  // it must call vault's claim function for resonable logic
}
