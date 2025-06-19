import { expect } from "chai";
import { ethers } from "hardhat";
import { TestToken } from "../typechain-types";
import { Signer } from "ethers";

describe("TestToken", function () {
  let testToken: TestToken;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  
  const INITIAL_SUPPLY = ethers.parseEther("1000"); // 1000 tokens with 18 decimals
  const MINT_AMOUNT = ethers.parseEther("100"); // 100 tokens
  const BURN_AMOUNT = ethers.parseEther("50"); // 50 tokens

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy contract
    const TestTokenFactory = await ethers.getContractFactory("TestToken");
    testToken = await TestTokenFactory.deploy();
    await testToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name, symbol, and decimals", async function () {
      expect(await testToken.name()).to.equal("TestToken");
      expect(await testToken.symbol()).to.equal("STT");
      expect(await testToken.decimals()).to.equal(18);
    });

    it("Should set the deployer as the owner", async function () {
      expect(await testToken.owner()).to.equal(await owner.getAddress());
    });

    it("Should mint initial supply to the deployer", async function () {
      const ownerBalance = await testToken.balanceOf(await owner.getAddress());
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const addr1Address = await addr1.getAddress();
      const initialBalance = await testToken.balanceOf(addr1Address);

      await testToken.mint(addr1Address, MINT_AMOUNT);

      expect(await testToken.balanceOf(addr1Address)).to.equal(initialBalance + MINT_AMOUNT);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const addr1Address = await addr1.getAddress();
      
      await expect(testToken.connect(addr1).mint(addr1Address, MINT_AMOUNT))
        .to.be.revertedWith("TestToken: caller is not the owner");
    });

    it("Should not allow minting to zero address", async function () {
      await expect(testToken.mint(ethers.ZeroAddress, MINT_AMOUNT))
        .to.be.revertedWith("TestToken: cannot mint to zero address");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Give addr1 some tokens to burn
      await testToken.mint(await addr1.getAddress(), MINT_AMOUNT);
    });

    it("Should allow users to burn their own tokens", async function () {
      const addr1Address = await addr1.getAddress();
      const initialBalance = await testToken.balanceOf(addr1Address);

      await testToken.connect(addr1).burn(BURN_AMOUNT);

      expect(await testToken.balanceOf(addr1Address)).to.equal(initialBalance - BURN_AMOUNT);
    });

    it("Should not allow burning more tokens than balance", async function () {
      const addr1Address = await addr1.getAddress();
      const balance = await testToken.balanceOf(addr1Address);
      const excessAmount = balance + ethers.parseEther("1");

      await expect(testToken.connect(addr1).burn(excessAmount))
        .to.be.revertedWith("TestToken: burn amount exceeds balance");
    });

    it("Should allow burning entire balance", async function () {
      const addr1Address = await addr1.getAddress();
      const balance = await testToken.balanceOf(addr1Address);

      await testToken.connect(addr1).burn(balance);

      expect(await testToken.balanceOf(addr1Address)).to.equal(0);
    });
  });

  describe("Balance Check", function () {
    it("Should return correct balance for any address", async function () {
      const addr1Address = await addr1.getAddress();
      const addr2Address = await addr2.getAddress();
      
      // Initially should be 0
      expect(await testToken.balanceOf(addr1Address)).to.equal(0);
      expect(await testToken.balanceOf(addr2Address)).to.equal(0);
      
      // After minting
      await testToken.mint(addr1Address, MINT_AMOUNT);
      expect(await testToken.balanceOf(addr1Address)).to.equal(MINT_AMOUNT);
      expect(await testToken.balanceOf(addr2Address)).to.equal(0);
    });

    it("Should handle zero balance correctly", async function () {
      const addr1Address = await addr1.getAddress();
      expect(await testToken.balanceOf(addr1Address)).to.equal(0);
    });
  });
}); 