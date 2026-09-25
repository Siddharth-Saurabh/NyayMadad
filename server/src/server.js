import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { initRedis } from './config/redis.js';

const startServer = async () => {
  try {
    // 1. Connect database & cache
    await connectDB();
    initRedis();

    // 2. Initialize Express app
    const app = createApp();

    // 3. Attach Socket.IO for real-time alerts
    const server = http.createServer(app);
    const io = new SocketIOServer(server, {
      cors: {
        origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
      },
    });

    app.set('io', io);

    io.on('connection', (socket) => {
      logger.info(`Socket client connected: ${socket.id}`);
      
      socket.on('join_user_room', (userId) => {
        if (userId) socket.join(`user:${userId}`);
      });

      socket.on('join_complaint_room', (complaintId) => {
        if (complaintId) socket.join(`complaint:${complaintId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Socket client disconnected: ${socket.id}`);
      });
    });

    // 4. Start HTTP Server
    server.listen(config.port, () => {
      logger.info(`🚀 NyayMadad Server running in ${config.env} mode on port ${config.port}`);
      logger.info(`🔗 Health Check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    logger.error('Failed to start NyayMadad server:', error);
    process.exit(1);
  }
};

startServer();
