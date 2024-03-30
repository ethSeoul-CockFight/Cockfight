const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants } = require("@openzeppelin/test-helpers");

describe("SBTContract", function () {
  before(async function () {
    [owner, testUser] = await ethers.getSigners();
    tokenContract = await ethers.deployContract("SBTContract", ["TokenforSale", "TfS"]);
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
      expect(await tokenContract.seller()).to.equal(constants.ZERO_ADDRESS);
    });
  });

  describe("Set state", function () {
    it("should fail set seller from other", async function () {
      await expect(tokenContract.connect(testUser).setSeller(testUser.address)).to.be.revertedWithCustomError(
        tokenContract,
        "OwnableUnauthorizedAccount",
      );
    });

    it("should set seller from owner", async function () {
      await tokenContract.setSeller(owner.address);
      expect(await tokenContract.seller()).to.equal(owner.address);
    });
  });

  describe("mintSBT", function () {
    describe("Before set seller", function () {
      it("should fail mint", async function () {
        await expect(tokenContract.mintSBT(owner.address, 1)).to.be.revertedWith("Invalid seller");
        await expect(tokenContract.connect(testUser).mintSBT(owner.address, 1)).to.be.revertedWith("Invalid seller");
      });
    });

    describe("After set seller", function () {
      before(async function () {
        await tokenContract.setSeller(testUser.address);
      });

      // issued, transfer, balance, count 이벤트 체크
      it("should mint from seller", async function () {
        await expect(tokenContract.connect(testUser).mintSBT(testUser.address, 1))
          .to.emit(tokenContract, "Issued")
          .withArgs(testUser.address, testUser.address, 1, 1)
          .to.emit(tokenContract, "Transfer")
          .withArgs(constants.ZERO_ADDRESS, testUser.address, 1);
        expect(await tokenContract.balanceOf(testUser.address)).to.equal(1);
        expect(await tokenContract.ownerOf(1)).to.equal(testUser.address);
      });

      it("disallow mint from others", async function () {
        await expect(tokenContract.mintSBT(owner.address, 2)).to.be.revertedWith("Invalid seller");
      });
    });
  });
});
