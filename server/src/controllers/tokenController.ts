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
        transactionHash: tx.hash
      });
    } catch (error: any) {
      console.error('Error minting tokens:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Burn tokens.
   * Meta-transaction burn: body must contain { from, amount, deadline, v, r, s }.
   * The backend (relayer) submits burnWithSig so the user pays no gas.
   */
  static async burnTokens(req: Request, res: Response): Promise<void> {
    try {
      const { from, amount, deadline, v, r, s } = req.body;

      // Validate presence of all meta-tx fields
      if (!from || !amount || !deadline || v === undefined || !r || !s) {
        res.status(400).json({ error: 'Missing required fields: from, amount, deadline, v, r, s' });
        return;
      }

      // Validate amount value
      if (amount <= 0) {
        res.status(400).json({ error: 'Amount must be greater than 0' });
        return;
      }

      // Ensure from address is valid
      if (!isValidAddress(from)) {
        res.status(400).json({ error: 'Invalid from address' });
        return;
      }

      // Convert amount to wei
      const amountWei = parseAmount(amount);

      // Execute meta-tx burn
      const tx = await (token as any).burnWithSig(from, amountWei, BigInt(deadline), v, r, s);

      await tx.wait();

      res.json({
        message: 'Tokens burned successfully',
        transactionHash: tx.hash
      });
    } catch (error: any) {
      console.error('Error burning tokens:', error);
      res.status(500).json({ error: error.message });
    }
  }
} 