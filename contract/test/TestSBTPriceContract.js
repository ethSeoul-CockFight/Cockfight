const { expect } = require("chai");
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");
require("dotenv").config();

describe("SBTPriceContract", function () {
  before(async function () {
    [owner, testUser] = await ethers.getSigners();
    priceContract = await ethers.deployContract("SBTPriceContract", [1000000]);
  });

  beforeEach(async function () {
    snapshotId = await network.provider.send("evm_snapshot");
  });

  afterEach(async function () {
    await network.provider.send("evm_revert", [snapshotId]);
  });

  describe("Initialize", function () {
    it("should correct initial state", async function () {
      expect(await priceContract.owner()).to.equal(owner.address);
      expect(await priceContract.tokenPrice()).to.equal(1000000);
      expect(await priceContract.timeInterval()).to.equal(0);
    });
  });

  describe("Set state", function () {
    it("should fail set price from other", async function () {
      await expect(priceContract.connect(testUser).setSBTPrice(100)).to.be.revertedWithCustomError(
        priceContract,
        "OwnableUnauthorizedAccount",
      );
    });

    it("should set price from owner", async function () {
      await priceContract.setSBTPrice(100);
      expect(await priceContract.getSBTPriceUSDC()).to.equal(100);
    });
  });

  describe("Oracle Data Test", function () {
    it("should get data", async function () {
      await priceContract.setInterval(2000);
      expect(await priceContract.getSBTPriceBFC());
    });

    it("should fail verify data", async function () {
      await helpers.time.increase(2000);
      await expect(priceContract.getSBTPriceBFC()).to.be.revertedWith("Failed data integrity check");
    });
  });
});
