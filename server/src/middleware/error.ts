import { Request, Response, NextFunction } from 'express';

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
};

// Global error handler
export const errorHandler = (
  error: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
}; 