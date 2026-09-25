import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StorageProvider } from './StorageProvider.js';
import { config } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export class LocalStorageProvider extends StorageProvider {
  constructor() {
    super();
    this.uploadDir = path.resolve(config.storage.localUploadDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(buffer, originalFileName, mimeType) {
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const ext = path.extname(originalFileName);
    const uniqueFileName = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(this.uploadDir, uniqueFileName);

    await fs.promises.writeFile(filePath, buffer);
    logger.info(`Evidence file securely saved locally: ${uniqueFileName} (SHA-256: ${fileHash.substring(0, 10)}...)`);

    return {
      storageReference: uniqueFileName,
      fileHash,
      sizeBytes: buffer.length,
      storageProvider: 'local',
    };
  }

  async getFile(storageReference) {
    // Sanitize filename to prevent directory traversal
    const safeName = path.basename(storageReference);
    const filePath = path.join(this.uploadDir, safeName);

    if (!fs.existsSync(filePath)) {
      throw new Error('Requested evidence file does not exist on disk');
    }

    const buffer = await fs.promises.readFile(filePath);
    return { buffer };
  }

  async deleteFile(storageReference) {
    const safeName = path.basename(storageReference);
    const filePath = path.join(this.uploadDir, safeName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}
