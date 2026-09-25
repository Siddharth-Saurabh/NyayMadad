/**
 * Abstract Base Class for Speech-to-Text Providers
 */
export class SpeechToTextProvider {
  /**
   * Transcribes an audio file/buffer to text
   * @param {Buffer|string} audioData - Audio buffer or base64
   * @param {string} mimeType - e.g. audio/webm or audio/wav
   * @returns {Promise<{ transcript: string, confidence: number, detectedLanguage: string }>}
   */
  async transcribe(audioData, mimeType) {
    throw new Error('Method transcribe() must be implemented');
  }
}
