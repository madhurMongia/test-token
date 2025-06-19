import { Router } from 'express';
import { TokenController } from '../controllers/tokenController';

const router = Router();

// GET /balance/:address - Get token balance for an address
router.get('/balance/:address', TokenController.getBalance);

// POST /mint - Mint tokens to an address (owner only)
router.post('/mint', TokenController.mintTokens);

// POST /burn - Burn tokens via meta-transaction (gasless)
router.post('/burn', TokenController.burnTokens);

export default router; 