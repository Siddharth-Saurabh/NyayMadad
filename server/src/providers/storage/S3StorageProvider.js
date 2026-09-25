import crypto from 'crypto';
import { StorageProvider } from './StorageProvider.js';
import { LocalStorageProvider } from './LocalStorageProvider.js';
import { config } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export class S3StorageProvider extends StorageProvider {
  constructor() {
    super();
    this.fallback = new LocalStorageProvider();
  }

  async uploadFile(buffer, fileName, mimeType) {
    if (!config.storage.s3.bucket || !config.storage.s3.accessKeyId) {
      logger.info('AWS S3 credentials not provided; using LocalStorageProvider.');
      return this.fallback.uploadFile(buffer, fileName, mimeType);
    }
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const storageReference = `s3://${config.storage.s3.bucket}/evidence/${Date.now()}_${fileName}`;
    return {
      storageReference,
      fileHash,
      sizeBytes: buffer.length,
      storageProvider: 's3',
    };
  }

  async getFile(storageReference) {
    if (!config.storage.s3.bucket || !config.storage.s3.accessKeyId) {
      return this.fallback.getFile(storageReference);
    }
    return this.fallback.getFile(storageReference);
  }

  async deleteFile(storageReference) {
    return this.fallback.deleteFile(storageReference);
  }
}
