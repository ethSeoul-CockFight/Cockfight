// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./ERC721/ERC721.sol";

// OpenZeppelin Contracts (v5.0.0)
abstract contract ERC721A is ERC721 {
  
  function _mintNft(address to, uint256 tokenId) internal virtual {
    _safeMint(to, tokenId, "");
  }
  function _burnNft(uint tokenId) internal virtual {
    _burn(tokenId);
  }
}
