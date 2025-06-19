import { ethers } from 'ethers';
import { TestToken, TestToken__factory } from '@contract/typechain-types';
import { config } from './config';

// Initialize provider
const provider = new ethers.JsonRpcProvider(config.rpcUrl);

// Initialize signer (owner wallet)
const signer = new ethers.Wallet(config.privateKey, provider);

const token: TestToken = TestToken__factory.connect(
  config.contractAddress,
  signer  // signer is connected as the owner, required for mint operations
);

// Helper function to check if address is valid
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// Helper function to parse ether amount
export const parseAmount = (amount: string | number): bigint => {
  return ethers.parseEther(amount.toString());
};

// Helper function to format ether amount
export const formatAmount = (amount: bigint): string => {
  return ethers.formatEther(amount);
};

export { provider, signer, token }; 