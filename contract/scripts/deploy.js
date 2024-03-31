// scripts/deploy_nft.js
const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.getContractFactory("NFTContract");
  //   const nft = await NFT.deploy("nft_name", "nft_symbol");
  const B = await hre.ethers.getContractFactory("PriceContract");
  //   const b = await B.deploy(hre.ethers.parseEther("1"), hre.ethers.parseEther("0.1"));

  const C = await hre.ethers.getContractFactory("SaleContract");
  const c = await C.deploy();
}
//SaleContract: 0xdfad3c40b7D83fF1f97a1f8AEC88439B82f259e6
//Price : 0x9dA28C8eA1d9a96adEB442151149b837ABB3Ff6F
//NFT : 0x0C1d18f804F3BfDf43e61a7e542a6f31573fecE2

main().catch(error => {
  console.error(error);
  process.exit(1);
});
