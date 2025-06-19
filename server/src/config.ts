import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Local Hardhat network configuration
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:8545',
  
  // Deployed contract address (update this after deployment)
  contractAddress: process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  
  // Private key for the deployer account (first Hardhat account)
  privateKey: process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  
  // Server configuration
  port: process.env.PORT || 4000,
  
  // Chain ID for local Hardhat network
  chainId: 31337
}; 