// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IChickenContract.sol";
import "./interfaces/IEggContract.sol";
import "./interfaces/IPriceContract.sol";
import "./interfaces/IERC20.sol";
import "./access/Ownable.sol";

contract CockfightVault is Ownable {
  // chicken contract
  IChickenContract public volatileChickenNft;
  IChickenContract public stableChickenNft;
  uint256 public count;
  mapping(uint256 chickenId => uint8) chickenTypes; // 1: volatile, 2: stable

  // chicken selling
  uint256[] onSaleChickens;
  mapping(uint256 chickenId => uint256) chickenPrices;
  uint256 sellingChickenCnt;

  // egg setting 
  IEggContract public eggToken;
  uint256 private eggEmissionPerBlock;
  mapping(uint256 chickenId => uint256) lastClaimed; // = lock up date

  // ect contract addrs
  IPriceContract public priceContract;
  IERC20 public usdcContract;

  modifier onlyChickenOwner(uint256 chickenId) {
    uint8 chickenType = chickenTypes[chickenId];
    require(chickenType > 0, "no chicken id");

    address chickenOwner;
    if(chickenType == 1) {
      // volatile
      chickenOwner = volatileChickenNft.ownerOf(chickenId);
    }
    else {
      // stable
      chickenOwner = stableChickenNft.ownerOf(chickenId);
    }

    require(_msgSender() == chickenOwner, "not chicken owner");

    _;
  }

  constructor(
    address _owner,
    address _volatile, 
    address _stable,
    address _egg,
    address _price,
    address _usdc
  ) Ownable(_owner) {
    volatileChickenNft = IChickenContract(_volatile);
    stableChickenNft = IChickenContract(_stable);
    eggToken = IEggContract(_egg);
    priceContract = IPriceContract(_price);
    usdcContract = IERC20(_usdc);
  }

  function setContracts(
    address _volatile, 
    address _stable,
    address _egg,
    address _price,
    address _usdc
  ) external onlyOwner {
    volatileChickenNft = IChickenContract(_volatile);
    stableChickenNft = IChickenContract(_stable);
    eggToken = IEggContract(_egg);
    priceContract = IPriceContract(_price);
    usdcContract = IERC20(_usdc);
  }

  function buyVolatile(uint256 lockUpDays) external payable returns(uint256) {
    uint256 price = priceContract.getChickenPriceNative();
    require(msg.value == price, "Invalid price");

    _mintChicken(volatileChickenNft, lockUpDays, _msgSender());
    chickenTypes[count] = 1;

    return count;
  }

  function buyStable(uint256 lockUpDays) external returns(uint256){
    uint256 price = priceContract.getChickenPriceUSDC();
    usdcContract.transferFrom(_msgSender(), address(this), price);

    _mintChicken(stableChickenNft, lockUpDays, _msgSender());
    chickenTypes[count] = 2;

    return count;
  }

  function hatchEggs(uint8 chickenType) external returns(uint256){ 
    claimAll(_msgSender());
    
    uint256 price = priceContract.getEggPriceEgg();
    eggToken.transferFrom(_msgSender(), address(this), price);
    eggToken.burn(price); // egg burn

    if(chickenType == 1) {
      _mintChicken(volatileChickenNft, 0, _msgSender());
      chickenTypes[count] = chickenType;
    }
    else if(chickenType == 2) {
      _mintChicken(stableChickenNft, 0, _msgSender());
      chickenTypes[count] = chickenType;
    }
    else {
      revert("invalid chicken type");
    }

    return count;
  }

  function _mintChicken(IChickenContract chickenCtrt, uint256 lockUpDays, address receiver) internal {
    count = count + 1;
    chickenCtrt.mintNFT(receiver, count);

    lastClaimed[count] = block.timestamp + (lockUpDays * 1 days); 
    eggToken.mint(receiver, eggEmissionPerBlock * lockUpDays * 1 days);
  }

  function withdrawVolatile(uint256 chickenId) external onlyChickenOwner(chickenId) {
    claim(chickenId);

    volatileChickenNft.burnNFT(chickenId);
    uint256 returnAmt = priceContract.getChickenPriceNative();
    delete lastClaimed[chickenId];

    payable(_msgSender()).transfer(returnAmt); 
  }

  function withdrawStable(uint256 chickenId) external onlyChickenOwner(chickenId) {
    claim(chickenId);

    stableChickenNft.burnNFT(chickenId);
    uint256 returnAmt = priceContract.getChickenPriceUSDC();
    delete lastClaimed[chickenId];

    usdcContract.transfer(_msgSender(), returnAmt); 
  }

  function claim(uint256 chickenId) public returns (uint256 reward) {
    uint8 chickenType = chickenTypes[chickenId];
    require(chickenType > 0, "no chicken id");

    address chickenOwner;
    if(chickenType == 1) {
      chickenOwner = volatileChickenNft.ownerOf(chickenId);
    }
    else {
      chickenOwner = stableChickenNft.ownerOf(chickenId);
    }
    
    reward = _claim(chickenId, chickenOwner);
  }

  function _claim(uint256 chickenId, address owner) internal returns(uint256 reward) {
    require(lastClaimed[chickenId] < block.timestamp, "lock-up period");
    reward = (block.timestamp - lastClaimed[chickenId]) * eggEmissionPerBlock;
    lastClaimed[chickenId] = block.timestamp;

    eggToken.mint(owner, reward);
  }

  function estimateReward(uint256 chickenId) public view returns(uint256 reward) {
    if(lastClaimed[chickenId] < block.timestamp) {
      reward = (block.timestamp - lastClaimed[chickenId]) * eggEmissionPerBlock;
    }
  }

  function claimAll(address user) public returns (uint256 reward) {
    uint256 volatileBal = volatileChickenNft.balanceOf(user);
    for (uint256 i=0; i<volatileBal; i++) {
      uint256 chickenId = volatileChickenNft.tokenOfOwnerByIndex(user, i);
      reward += _claim(chickenId, user);
    }

    uint256 stableBal = stableChickenNft.balanceOf(user);
    for (uint256 i=0; i<stableBal; i++) {
      uint256 chickenId = stableChickenNft.tokenOfOwnerByIndex(user, i);
      reward += _claim(chickenId, user);
    }
  }

  function estimateAllReward(address user) public view returns(uint256 reward) {
    uint256 volatileBal = volatileChickenNft.balanceOf(user);
    for (uint256 i=0; i<volatileBal; i++) {
      uint256 chickenId = volatileChickenNft.tokenOfOwnerByIndex(user, i);
      reward += estimateReward(chickenId);
    }

    uint256 stableBal = stableChickenNft.balanceOf(user);
    for (uint256 i=0; i<stableBal; i++) {
      uint256 chickenId = stableChickenNft.tokenOfOwnerByIndex(user, i);
      reward += estimateReward(chickenId);
    }
  }

  function sellChicken(uint256[] memory chickens, uint256[] memory prices) public {
    require(chickens.length == prices.length, "Invalid input");

    for(uint256 i=0; i<chickens.length; i++){
      chickenPrices[chickens[i]] = prices[i];
      sellingChickenCnt += 1;
    }
  }

  function buyChicken(uint256 chickenId) public payable{
    require(chickenPrices[chickenId] != 0, "Not on sale");

    uint256 price = chickenPrices[chickenId];
    chickenPrices[chickenId] = 0; 
    sellingChickenCnt -= 1;

    if(chickenTypes[chickenId] == 1) { // volatile
      require(msg.value == price, "Invalid price");
      address chickenOwner = volatileChickenNft.ownerOf(chickenId);
      volatileChickenNft.transferFrom(chickenOwner, _msgSender(), chickenId);
    }
    else {
      address chickenOwner = stableChickenNft.ownerOf(chickenId);
      usdcContract.transferFrom(_msgSender(), address(this), price);
      stableChickenNft.transferFrom(chickenOwner, _msgSender(), chickenId);
    }
  }

  function getSellingChickens() external view returns(uint256[] memory, uint256[] memory) {
    uint256[] memory chickens = new uint256[](sellingChickenCnt);
    uint256[] memory prices = new uint256[](sellingChickenCnt);

    uint256 cnt = 0;
    for (uint256 i = 0; i<count; i++) {
      if(chickenPrices[i] > 0) {
        chickens[cnt] = i;
        prices[cnt] = chickenPrices[i];
        cnt += 1;
      }
    }

    return (chickens, prices);
  }

}
