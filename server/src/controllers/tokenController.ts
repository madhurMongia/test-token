import { Request, Response } from 'express';
import { token, isValidAddress, parseAmount, formatAmount } from '../blockchain';

export class TokenController {
  // Get token balance for an address
  static async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;
      
      // Validate address
      if (!isValidAddress(address)) {
        res.status(400).json({ error: 'Invalid Ethereum address' });
        return;
      }
      
      // Get balance from contract
      const balanceWei = await token.balanceOf(address);
      const balance = Number(formatAmount(balanceWei));
      
      res.json({ balance });
    } catch (error: any) {
      console.error('Error getting balance:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Mint tokens to an address (owner only)
  static async mintTokens(req: Request, res: Response): Promise<void> {
    try {
      const { to, amount } = req.body;
      
      // Validate input
      if (!to || !amount) {
        res.status(400).json({ error: 'Missing required fields: to, amount' });
        return;
      }
      
      if (!isValidAddress(to)) {
        res.status(400).json({ error: 'Invalid recipient address' });
        return;
      }
      
      if (amount <= 0) {
        res.status(400).json({ error: 'Amount must be greater than 0' });
        return;
      }
      
      // Convert amount to wei
      const amountWei = parseAmount(amount);
      
      // Execute mint transaction
      const tx = await token.mint(to, amountWei);
      await tx.wait(); // Wait for transaction to be mined
      
      res.json({
        message: 'Tokens minted successfully',
        transactionHash: tx.hash,
        to,
        amount: Number(amount)
      });
    } catch (error: any) {
      console.error('Error minting tokens:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Burn tokens from the owner's balance
  static async burnTokens(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = req.body;
      
      // Validate input
      if (!amount) {
        res.status(400).json({ error: 'Missing required field: amount' });
        return;
      }
      
      if (amount <= 0) {
        res.status(400).json({ error: 'Amount must be greater than 0' });
        return;
      }
      
      // Convert amount to wei
      const amountWei = parseAmount(amount);
      
      // Execute burn transaction
      const tx = await token.burn(amountWei);
      await tx.wait(); // Wait for transaction to be mined
      
      res.json({
        message: 'Tokens burned successfully',
        transactionHash: tx.hash,
        amount: Number(amount)
      });
    } catch (error: any) {
      console.error('Error burning tokens:', error);
      res.status(500).json({ error: error.message });
    }
  }
} 