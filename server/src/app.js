import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getRedisClient } from './config/redis.js';

export const createApp = () => {
  const app = express();

  // Security Middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS Configuration
  const allowedOrigins = [
    config.clientUrl,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || config.env === 'development') {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-clerk-auth-token', 'x-demo-role', 'x-demo-user-id'],
  }));

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP Request Logger
  if (config.env !== 'test') {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
  }

  // Health check endpoints
  app.get('/health', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
    
    let redisStatus = 'ready';
    try {
      const redis = getRedisClient();
      await redis.ping();
    } catch {
      redisStatus = 'fallback_memory';
    }

    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      services: {
        api: 'online',
        database: dbStatus,
        redis: redisStatus,
        aiProvider: config.ai.provider,
        storageProvider: config.storage.provider,
      }
    });
  });

  app.get('/live', (req, res) => {
    res.status(200).json({ status: 'alive' });
  });

  app.get('/ready', (req, res) => {
    const isDbReady = mongoose.connection.readyState === 1;
    if (isDbReady) {
      res.status(200).json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not_ready', database: mongoose.connection.readyState });
    }
  });

  // Placeholder root endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'NyayMadad API',
      tagline: 'Tell us what happened. We’ll help you report it.',
      version: '1.0.0',
      documentation: '/api/docs',
      health: '/health'
    });
  });

  return app;
};
