import { Request, Response } from 'express';

export class HealthController {
  // Health check endpoint
  static async getHealthStatus(req: Request, res: Response): Promise<void> {
    res.json({ 
      status: 'OK', 
      message: 'TestToken API Server is running',
      timestamp: new Date().toISOString()
    });
  }
} 