import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();

// Health check endpoint
router.get('/', HealthController.getHealthStatus);

export default router; 