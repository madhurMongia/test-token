import { ethers } from "hardhat";

async function main() {
  console.log("Deploying TestToken contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy();
  
  // Wait for deployment to complete
  await testToken.waitForDeployment();
  
  const contractAddress = await testToken.getAddress();
  console.log("TestToken deployed to:", contractAddress);
  
  // Verify initial state
  const name = await testToken.name();
  const symbol = await testToken.symbol();
  const decimals = await testToken.decimals();
  const owner = await testToken.owner();
  const deployerBalance = await testToken.balanceOf(deployer.address);
  
  console.log("\nContract Details:");
  console.log("- Name:", name);
  console.log("- Symbol:", symbol);
  console.log("- Decimals:", decimals);
  console.log("- Owner:", owner);
  console.log("- Deployer Balance:", ethers.formatEther(deployerBalance), "STT");
  
  console.log("\nDeployment completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 