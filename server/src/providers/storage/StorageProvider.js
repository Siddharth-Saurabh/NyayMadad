/**
 * Abstract Base Class for Storage Providers
 */
export class StorageProvider {
  /**
   * Stores a file buffer or stream
   * @param {Buffer} buffer 
   * @param {string} fileName 
   * @param {string} mimeType 
   * @returns {Promise<{ storageReference: string, fileHash: string, sizeBytes: number }>}
   */
  async uploadFile(buffer, fileName, mimeType) {
    throw new Error('Method uploadFile() must be implemented');
  }

  /**
   * Retrieves a file stream or buffer
   * @param {string} storageReference 
   * @returns {Promise<{ buffer: Buffer, mimeType: string }>}
   */
  async getFile(storageReference) {
    throw new Error('Method getFile() must be implemented');
  }

  /**
   * Deletes a stored file
   * @param {string} storageReference 
   * @returns {Promise<boolean>}
   */
  async deleteFile(storageReference) {
    throw new Error('Method deleteFile() must be implemented');
  }
}
