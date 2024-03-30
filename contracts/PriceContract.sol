// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPriceContract.sol";
import "./access/Ownable.sol";
import "./utils/math/Math.sol";

contract PriceContract is IPriceContract, Ownable {
  using Math for uint256;

  uint256 public tokenPrice;
  uint256 public nativePrice;
  uint256 public timeInterval;
  uint256 internal constant decimalsUSDC = 10 ** 6;

  /**
   * Network: BFC_Testnet
   * Aggregator: BFC/USDC
   * Address: 0x18Ff9c6B6777B46Ca385fd17b3036cEb30982ea9
   */
  constructor(uint256 price, uint256 price2) Ownable(_msgSender()) {
    tokenPrice = price;
    nativePrice = price2;
  }

  function setInterval(uint256 input) external onlyOwner {
    timeInterval = input;
  }

  function setPrice(uint256 input) external onlyOwner {
    tokenPrice = input;
  }

  function setPriceNative(uint256 input) external onlyOwner {
    nativePrice = input;
  }

  // saleContract 에서 호출하기 위함
  function getPriceUSDC() external view returns (uint256) {
    return tokenPrice;
  }

  function getPriceNative() external view returns (uint256) {
    return nativePrice;
  }

  // function _getNativeUSDCRatio() internal view returns (uint256) {
  //   int256 oralcePrice = _getChainlinkDataFeedLatestAnswer();
  //   require(oralcePrice > 0, "Failed data integrity check");
  //   uint256 ratio = 10 ** 26;
  //   (bool chkCalculation, uint256 price) = ratio.tryDiv(uint256(oralcePrice));
  //   require(chkCalculation == true, "Calculation fail");
  //   ratio = price;
  //   return ratio;
  // }

  // function _getChainlinkDataFeedLatestAnswer() internal view returns (int256) {
  //   (, int256 answer, , uint256 timeStamp, ) = dataFeed.latestRoundData();
  //   require(block.timestamp < timeStamp + timeInterval, "Failed data integrity check");
  //   return (answer);
  // }
}
