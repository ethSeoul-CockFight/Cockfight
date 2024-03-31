// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICockfightVault {
    function setContracts(
        address _volatile, 
        address _stable,
        address _egg,
        address _price,
        address _usdc
    ) external;

    function buyVolatile(uint256 lockUpDays) external payable returns(uint256);

    function buyStable(uint256 lockUpDays) external returns(uint256);

    function hatchEggs(uint8 chickenType) external returns(uint256); // 1: volatile, 2: stable

    function withdrawVolatile(uint256 chickenId) external;

    function withdrawStable(uint256 chickenId) external;

    function claim(uint256 chickenId) external returns (uint256 reward);

    function estimateReward(uint256 chickenId) external view returns(uint256 reward);

    function claimAll(address user) external returns (uint256 reward);

    function estimateAllReward(address user) external view returns(uint256 reward);

    function sellChicken(uint256[] memory chickens, uint256[] memory prices) external;

    function buyChicken(uint256 chickenId) external payable;

    function getSellingChickens() external view returns(uint256[] memory, uint256[] memory);
}