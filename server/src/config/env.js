import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/nyaymadad',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'mock',
    geminiApiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    transcribeModel: process.env.GEMINI_TRANSCRIBE_MODEL || 'gemini-1.5-flash',
  },
  speech: {
    provider: process.env.SPEECH_PROVIDER || 'mock',
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    localUploadDir: process.env.UPLOAD_DIR || './uploads',
    s3: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_S3_BUCKET,
    },
  },
  identity: {
    provider: process.env.IDENTITY_PROVIDER || 'mock',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
