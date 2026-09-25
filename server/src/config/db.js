import dns from 'dns';
import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

// Configure reliable DNS servers for MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom DNS fails
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = !!conn.connections[0].readyState;
    logger.info(`MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    logger.error('Primary MongoDB connection error:', error.message);
    if (config.env === 'development' || config.env === 'test') {
      try {
        logger.info('Starting embedded in-memory MongoDB fallback...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        isConnected = !!conn.connections[0].readyState;
        logger.info(`Connected to embedded MongoDB fallback at ${uri}`);
      } catch (memErr) {
        logger.error('Failed to start memory fallback MongoDB:', memErr);
      }
    } else {
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('MongoDB Disconnected');
};
