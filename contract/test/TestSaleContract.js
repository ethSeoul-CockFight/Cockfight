const { expect } = require("chai");
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { constants } = require("@openzeppelin/test-helpers");
require("dotenv").config();

describe("SaleContract", function () {
  before(async function () {
    [owner, testUser] = await ethers.getSigners();
    const address = process.env.EVMAddress;
    await helpers.impersonateAccount(address);
    assetWallet = await ethers.getSigner(address);

    usdcContract = await ethers.getContractAt("IERC20", "0x28661511CDA7119B2185c647F23106a637CC074f");
    tokenContract = await ethers.deployContract("SBTContract", ["TokenforSale", "TfS"]);
    priceContract = await ethers.deployContract("SBTPriceContract", [1000000]);
    saleContract = await ethers.deployContract("SaleContract");
  });

  beforeEach(async function () {
    snapshotId = await network.provider.send("evm_snapshot");
  });

  afterEach(async function () {
    await network.provider.send("evm_revert", [snapshotId]);
  });

  describe("Initialize", function () {
    it("should correct initial state", async function () {
      expect(await saleContract.killSwitch()).to.equal(false);
      expect(await saleContract.owner()).to.equal(owner.address);
      expect(await saleContract.tokenContract()).to.equal(constants.ZERO_ADDRESS);
      expect(await saleContract.priceContract()).to.equal(constants.ZERO_ADDRESS);
      expect(await saleContract.stableContract()).to.equal("0x28661511CDA7119B2185c647F23106a637CC074f");
    });
  });

  describe("Set state", function () {
    it("should set state from owner", async function () {
      await saleContract.setSwitch(true);
      expect(await saleContract.killSwitch()).to.equal(true);

      await saleContract.setSBTContract(testUser.address);
      expect(await saleContract.tokenContract()).to.equal(testUser.address);

      await saleContract.setSBTPriceContract(testUser.address);
      expect(await saleContract.priceContract()).to.equal(testUser.address);
    });

    it("should fail set state from other", async function () {
      await expect(saleContract.connect(testUser).setSwitch(true)).to.be.revertedWithCustomError(
        saleContract,
        "OwnableUnauthorizedAccount",
      );
      expect(await saleContract.killSwitch()).to.equal(false);

      await expect(saleContract.connect(testUser).setSBTContract(testUser.address)).to.be.revertedWithCustomError(
        saleContract,
        "OwnableUnauthorizedAccount",
      );
      expect(await saleContract.tokenContract()).to.equal(constants.ZERO_ADDRESS);

      await expect(saleContract.connect(testUser).setSBTPriceContract(testUser.address)).to.be.revertedWithCustomError(
        saleContract,
        "OwnableUnauthorizedAccount",
      );
      expect(await saleContract.priceContract()).to.equal(constants.ZERO_ADDRESS);
    });
  });

  describe("Contract connect error", function () {
    it("shoule fail buySBT", async function () {
      await expect(saleContract.buySBTUSDC()).to.be.revertedWith("Contract not set");
      await expect(saleContract.buySBTBFC()).to.be.revertedWith("Contract not set");
    });

    it("shoule fail buySBT", async function () {
      await saleContract.setSBTContract(testUser.address);
      await saleContract.setSBTPriceContract(testUser.address);
      await expect(saleContract.buySBTUSDC()).to.be.reverted;
      await expect(saleContract.buySBTBFC()).to.be.reverted;
    });
  });

  describe("Contract connect", function () {
    before(async function () {
      await priceContract.setSBTPrice(2000000);
      await priceContract.setInterval(2000);
      bfcPrice = await priceContract.getSBTPriceBFC();
      usdcPrice = await priceContract.getSBTPriceUSDC();

      await saleContract.setSBTContract(tokenContract.target);
      await saleContract.setSBTPriceContract(priceContract.target);
      await tokenContract.setSeller(saleContract.target);
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
      await usdcContract.connect(assetWallet).transfer(owner.address, 100000000);
      await usdcContract.connect(assetWallet).transfer(testUser.address, 100000000);

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

    it("should withdraw from owner", async function () {
      await usdcContract.connect(assetWallet).transfer(owner.address, 100000000);
      await usdcContract.approve(saleContract.target, usdcPrice);
      await saleContract.buySBTUSDC();
      await saleContract.buySBTBFC({ value: bfcPrice });

      await expect(await saleContract.withdrawUSDC(500)).to.changeTokenBalances(
        usdcContract,
        [owner, saleContract],
        [500, -500],
      );
      await expect(await saleContract.withdrawBFC(500)).to.changeEtherBalances([owner, saleContract], [500, -500]);
    });

    it("should fail withdraw", async function () {
      await expect(saleContract.withdrawUSDC(100)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      await expect(saleContract.withdrawBFC(100)).to.be.reverted;
    });
  });
});
