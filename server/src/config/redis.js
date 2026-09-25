import Redis from 'ioredis';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

// In-memory fallback map if Redis is not running locally
class MemoryStoreFallback {
  constructor() {
    this.store = new Map();
    this.ttls = new Map();
  }
  async get(key) {
    if (this.ttls.has(key) && this.ttls.get(key) < Date.now()) {
      this.store.delete(key);
      this.ttls.delete(key);
      return null;
    }
    return this.store.get(key) || null;
  }
  async set(key, value, mode, duration) {
    this.store.set(key, value);
    if (mode === 'EX' && duration) {
      this.ttls.set(key, Date.now() + duration * 1000);
    }
    return 'OK';
  }
  async del(key) {
    this.store.delete(key);
    this.ttls.delete(key);
    return 1;
  }
  async ping() {
    return 'PONG';
  }
}

let redisClient = null;

export const initRedis = () => {
  try {
    const client = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 2) {
          logger.warn('Redis unavailable, switching to MemoryStoreFallback.');
          return null;
        }
        return Math.min(times * 100, 1000);
      },
      enableOfflineQueue: false,
    });

    client.on('connect', () => logger.info('Redis connected successfully'));
    client.on('error', (err) => {
      logger.debug('Redis client connection note:', { message: err.message });
      redisClient = new MemoryStoreFallback();
    });

    redisClient = client;
  } catch (err) {
    logger.warn('Failed to initialize Redis client, using in-memory store.');
    redisClient = new MemoryStoreFallback();
  }

  return redisClient;
};

export const getRedisClient = () => {
  if (!redisClient) {
    return initRedis();
  }
  return redisClient;
};
