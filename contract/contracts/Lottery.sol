// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IEggContract.sol";
import "./access/Ownable.sol";
interface IClaimable {
    function claim(address user) external;
}
contract Lottery is Ownable {
    uint256 constant INITIAL_LOTTO_NUM = 999999999;
    IEggContract eggToken;
    IClaimable vault;

    mapping(address => mapping(uint256 => uint256)) betAmounts; 
    mapping(uint256 => uint256) betAmountsPerNums; 

    uint256 totalBetAmounts;
    uint256 lottoResult;

    constructor(address _egg, address _vault) Ownable(msg.sender) {
        eggToken = IEggContract(_egg);
        vault = IClaimable(_vault);
        lottoResult = INITIAL_LOTTO_NUM; 
    }

    function setEggToken(address _egg) external onlyOwner {
        eggToken = IEggContract(_egg);
    }

    function setVault(address _vault) external onlyOwner {
        vault = IClaimable(_vault);
    }

    function makeBet(uint256 lottoNum, uint256 bettingAmount) public {
        require(lottoResult == INITIAL_LOTTO_NUM, "Lottery betting period ended");
        vault.claim(msg.sender);

        _makeBet(lottoNum, bettingAmount);
    }

    function makeMultiBet(uint256[] calldata lottoNums, uint256[] calldata bettingAmounts) external {
        require(lottoResult == INITIAL_LOTTO_NUM, "Lottery betting period ended");
        vault.claim(msg.sender);

        for (uint256 i=0; i<lottoNums.length; i++) {
            _makeBet(lottoNums[i], bettingAmounts[i]);
        }
    }

    function _makeBet(uint256 lottoNum, uint256 bettingAmount) internal {
        betAmounts[msg.sender][lottoNum] += bettingAmount;
        betAmountsPerNums[lottoNum] += bettingAmount;
        totalBetAmounts += bettingAmount;
        
        eggToken.transferFrom(msg.sender, address(this), bettingAmount);
    }

    function makeResult() external returns (uint256 result) {
        result = 1842; // Todo make lotto result using random function
        lottoResult = result;
    }

    function makeResultByOffchain(uint256 result) external {
        lottoResult = result;
    }

    function claim() external returns(uint256 prize){
        require(lottoResult < 10000, "No result");
        uint256 userShare = betAmounts[msg.sender][lottoResult];
        uint256 totalShare = betAmountsPerNums[lottoResult];
        prize = totalBetAmounts * userShare / totalShare;

        require(prize > 0, "Claim nothing");
        betAmounts[msg.sender][lottoResult] = 0; 
        
        eggToken.transferFrom(address(this), msg.sender, prize);
    }
}