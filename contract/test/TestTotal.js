const { expect } = require("chai");
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { constants } = require("@openzeppelin/test-helpers");
require("dotenv").config();

describe("After Contract Connect", function () {
  before(async function () {
    [owner, testUser] = await ethers.getSigners();
    const address = process.env.EVMAddress;
    await helpers.impersonateAccount(address);
    assetWallet = await ethers.getSigner(address);

    usdcContract = await ethers.getContractAt("IERC20", "0x28661511CDA7119B2185c647F23106a637CC074f");
    tokenContract = await ethers.deployContract("SBTContract", ["TokenforSale", "TfS"]);
    priceContract = await ethers.deployContract("SBTPriceContract", [1000000]);
    saleContract = await ethers.deployContract("SaleContract");

    await saleContract.setSBTContract(tokenContract.target);
    await saleContract.setSBTPriceContract(priceContract.target);
    await tokenContract.setSeller(saleContract.target);

    await usdcContract.connect(assetWallet).transfer(owner.address, 100000000);
    await usdcContract.connect(assetWallet).transfer(testUser.address, 100000000);
  });

  beforeEach(async function () {
    snapshotId = await network.provider.send("evm_snapshot");
  });

  afterEach(async function () {
    await network.provider.send("evm_revert", [snapshotId]);
  });

  describe("Initialize", function () {
    it("should correct initial state", async function () {
      expect(await tokenContract.name()).to.equal("TokenforSale");
      expect(await tokenContract.symbol()).to.equal("TfS");
      expect(await tokenContract.balanceOf(owner.address)).to.equal(0);
      expect(await tokenContract.owner()).to.equal(owner.address);
      expect(await tokenContract.seller()).to.equal(saleContract.target);

      expect(await priceContract.owner()).to.equal(owner.address);
      expect(await priceContract.tokenPrice()).to.equal(1000000);
      expect(await priceContract.timeInterval()).to.equal(0);

      expect(await saleContract.killSwitch()).to.equal(false);
      expect(await saleContract.owner()).to.equal(owner.address);
      expect(await saleContract.tokenContract()).to.equal(tokenContract.target);
      expect(await saleContract.priceContract()).to.equal(priceContract.target);
      expect(await saleContract.stableContract()).to.equal("0x28661511CDA7119B2185c647F23106a637CC074f");
      expect(await saleContract.count()).to.equal(0);

      expect(await usdcContract.balanceOf(owner.address)).to.equal(100000000);
      expect(await usdcContract.balanceOf(testUser.address)).to.equal(100000000);
    });
  });

  describe("User test", function () {
    before(async function () {
      await priceContract.setSBTPrice(2000000);
      await priceContract.setInterval(2000);
      bfcPrice = await priceContract.getSBTPriceBFC();
      usdcPrice = await priceContract.getSBTPriceUSDC();
    });

    it("should get price", async function () {
      expect(await priceContract.getSBTPriceUSDC()).to.be.equal("2000000");
    });

    it("should fail mint before token approve", async function () {
      await expect(saleContract.buySBTUSDC()).to.be.revertedWith("ERC20: insufficient allowance");
      await expect(saleContract.connect(testUser).buySBTUSDC()).to.be.revertedWith("ERC20: insufficient allowance");
      expect(await saleContract.count()).to.equal(0);
    });

    it("should mint exact value(USDC)", async function () {
      await usdcContract.approve(saleContract.target, usdcPrice);
      await saleContract.buySBTUSDC();
      expect(await tokenContract.balanceOf(owner.address)).to.equal(1);
      expect(await tokenContract.ownerOf(1)).to.equal(owner.address);
      expect(await saleContract.count()).to.equal(1);

      await usdcContract.connect(testUser).approve(saleContract.target, usdcPrice);
      await saleContract.connect(testUser).buySBTUSDC();
      expect(await tokenContract.connect(testUser).balanceOf(testUser.address)).to.equal(1);
      expect(await tokenContract.connect(testUser).ownerOf(2)).to.equal(testUser.address);
      expect(await saleContract.count()).to.equal(2);
    });

    it("should fail inexact value(BFC)", async function () {
      const errorPrice = bfcPrice + "3";
      await expect(saleContract.buySBTBFC({ value: errorPrice })).to.be.revertedWith("Invalid price");
      await expect(saleContract.connect(testUser).buySBTBFC({ value: errorPrice })).to.be.revertedWith("Invalid price");
      expect(await saleContract.count()).to.equal(0);
    });

    it("should mint exact value(BFC)", async function () {
      await saleContract.buySBTBFC({ value: bfcPrice });
      expect(await tokenContract.balanceOf(owner.address)).to.equal(1);
      expect(await tokenContract.ownerOf(1)).to.equal(owner.address);
      expect(await saleContract.count()).to.equal(1);

      await saleContract.connect(testUser).buySBTBFC({ value: bfcPrice });
      expect(await tokenContract.connect(testUser).balanceOf(testUser.address)).to.equal(1);
      expect(await tokenContract.connect(testUser).ownerOf(2)).to.equal(testUser.address);
      expect(await saleContract.count()).to.equal(2);
    });

    it("should emit 'Issued, Transfer' event", async () => {
      await expect(await saleContract.buySBTBFC({ value: bfcPrice }))
        .to.emit(tokenContract, "Issued")
        .withArgs(saleContract.target, owner.address, 1, 1)
        .to.emit(tokenContract, "Transfer")
        .withArgs(constants.ZERO_ADDRESS, owner.address, 1);

      await usdcContract.connect(testUser).approve(saleContract.target, usdcPrice);
      await expect(await saleContract.connect(testUser).buySBTUSDC())
        .to.emit(tokenContract, "Issued")
        .withArgs(saleContract.target, testUser.address, 2, 1)
        .to.emit(tokenContract, "Transfer")
        .withArgs(constants.ZERO_ADDRESS, testUser.address, 2);
    });

    it("should change BFC balance", async () => {
      await expect(await saleContract.buySBTBFC({ value: bfcPrice })).to.changeEtherBalances(
        [owner, saleContract],
        ["-" + bfcPrice, bfcPrice],
      );
    });

    it("should change USDC balance", async () => {
      await usdcContract.approve(saleContract.target, usdcPrice);
      await expect(await saleContract.buySBTUSDC()).to.changeTokenBalances(
        usdcContract,
        [owner, saleContract],
        ["-" + usdcPrice, usdcPrice],
      );
    });
  });

  describe("Kill switch on", function () {
    before(async function () {
      await saleContract.setSwitch(true);
    });

    after(async function () {
      await saleContract.setSwitch(false);
    });

    it("should fail mint", async function () {
      await usdcContract.approve(saleContract.target, usdcPrice);
      await expect(saleContract.buySBTUSDC()).to.be.revertedWith("Contract stopped");

      await usdcContract.connect(testUser).approve(saleContract.target, usdcPrice);
      await expect(saleContract.connect(testUser).buySBTUSDC()).to.be.revertedWith("Contract stopped");

      const errorPrice = (await priceContract.getSBTPriceBFC()) + "3";
      await expect(saleContract.buySBTBFC({ value: errorPrice })).to.be.revertedWith("Contract stopped");
      await expect(saleContract.connect(testUser).buySBTBFC({ value: errorPrice })).to.be.revertedWith(
        "Contract stopped",
      );

      await expect(saleContract.buySBTBFC({ value: bfcPrice })).to.be.revertedWith("Contract stopped");
      await expect(saleContract.connect(testUser).buySBTBFC({ value: bfcPrice })).to.be.revertedWith(
        "Contract stopped",
      );
    });

    it("should fail withdraw", async function () {
      await expect(saleContract.connect(testUser).withdrawUSDC(500)).to.be.revertedWith("Contract stopped");
      await expect(saleContract.connect(testUser).withdrawBFC(500)).to.be.revertedWith("Contract stopped");
    });
  });

  describe("Withdraw asset", function () {
    before(async function () {
      await usdcContract.connect(testUser).approve(saleContract.target, usdcPrice);
      await saleContract.connect(testUser).buySBTUSDC();
      await saleContract.buySBTBFC({ value: bfcPrice });
    });

    it("should withdraw from owner", async function () {
      await expect(await saleContract.withdrawUSDC(500)).to.changeTokenBalances(
        usdcContract,
        [owner, saleContract],
        [500, -500],
      );
      await expect(await saleContract.withdrawBFC(500)).to.changeEtherBalances([owner, saleContract], [500, -500]);
    });

    it("should fail withdraw from owner insufficient balance", async function () {
      const overPrice = "100000000000000000000000";
      await expect(saleContract.withdrawUSDC(overPrice)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      await expect(saleContract.withdrawBFC(overPrice)).to.be.reverted;
    });

    it("should fail withdraw from other ", async function () {
      await expect(saleContract.connect(testUser).withdrawUSDC(500)).to.be.revertedWithCustomError(
        saleContract,
        "OwnableUnauthorizedAccount",
      );
      await expect(saleContract.connect(testUser).withdrawBFC(500)).to.be.revertedWithCustomError(
        saleContract,
        "OwnableUnauthorizedAccount",
      );
    });
  });
});
