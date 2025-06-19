import express from 'express';
import cors from 'cors';

export const setupMiddleware = (app: express.Application) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${ip}`);
    
    if (req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = { ...req.body };
      if (sanitizedBody.r) sanitizedBody.r = sanitizedBody.r.substring(0, 10) + '...';
      if (sanitizedBody.s) sanitizedBody.s = sanitizedBody.s.substring(0, 10) + '...';
      console.log(`[${timestamp}] Request Body:`, JSON.stringify(sanitizedBody, null, 2));
    }
    
    const originalSend = res.send;
    res.send = function(data) {
      console.log(`[${timestamp}] Response: ${res.statusCode} ${res.statusMessage}`);
      return originalSend.call(this, data);
    };
    
    next();
  });

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });
}; 