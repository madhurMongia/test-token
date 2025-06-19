import express from 'express';
import { setupMiddleware } from './middleware/common';
import { notFoundHandler, errorHandler } from './middleware/error';
import healthRoutes from './routes/health';
import tokenRoutes from './routes/token';

const app = express();

// Setup middleware
setupMiddleware(app);

// Routes
app.use('/health', healthRoutes);
app.use('/api', tokenRoutes);

// Error handling
app.use('*', notFoundHandler);
app.use(errorHandler);

export default app; 