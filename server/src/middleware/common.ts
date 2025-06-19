import express from 'express';
import cors from 'cors';

export const setupMiddleware = (app: express.Application) => {
  app.use(cors());
  app.use(express.json());
}; 