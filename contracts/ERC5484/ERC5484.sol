// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../ERC721/ERC721.sol";
import "../interfaces/IERC5484.sol";

// OpenZeppelin Contracts (v5.0.0)
// OwnerOnly : 소각권리가 Owner 있는것 가정.

abstract contract ERC5484 is ERC721, IERC5484 {
  mapping(uint256 => BurnAuth) private burnAuthState;

  /// @notice Returns the BurnAuth
  /// @dev Calls the _requireOwned function
  /// @param tokenId The token ID for which BurnAuth is to be returned.
  function burnAuth(uint256 tokenId) external view override returns (BurnAuth) {
    _requireOwned(tokenId);
    return burnAuthState[tokenId];
  }

  /// @notice TransferFrom
  /// @dev Overrides function to disallow transfers.
  function transferFrom(address, address, uint256) public pure override {
    revert("Transfer is not allowed");
  }

  /// @notice Checks if the contract supports the specified interface.
  /// @dev Implements support for the IERC5484 interface and defers to ERC721"s supportsInterface.
  /// @param interfaceId The ID of the interface
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721) returns (bool) {
    return interfaceId == type(IERC5484).interfaceId || super.supportsInterface(interfaceId);
  }

  /// @notice Check burn authorization of the token
  /// @dev When burnAuthState invalid, reverted
  /// @param tokenId The ID of the token
  /// @param spender _msgSender()
  modifier _checkBurnAuth(uint tokenId, address spender) virtual {
    require(spender == _ownerOf(tokenId), "Invaild user");
    _;
  }

  /// @notice Issued token
  /// @dev Mints using the _safeMint embedded in 721. sets burnAuth. Emits the Issued event.
  /// @param to The receiver
  /// @param tokenId The ID of the token
  function _mintSBT(address to, uint256 tokenId, BurnAuth state) internal virtual {
    _safeMint(to, tokenId, "");
    burnAuthState[tokenId] = state;
    emit Issued(msg.sender, to, tokenId, state);
  }

  /// @notice Burn token
  /// @dev Burn using the _burn embedded in 721.
  /// @param tokenId The ID of the token
  function _burnSBT(uint tokenId) internal virtual _checkBurnAuth(tokenId, _msgSender()) {
    _burn(tokenId);
  }
}
