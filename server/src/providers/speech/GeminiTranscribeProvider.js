import { GoogleGenerativeAI } from '@google/generative-ai';
import { SpeechToTextProvider } from './SpeechToTextProvider.js';
import { MockSpeechProvider } from './MockSpeechProvider.js';
import { config } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export class GeminiTranscribeProvider extends SpeechToTextProvider {
  constructor() {
    super();
    this.fallback = new MockSpeechProvider();
    if (config.ai.geminiApiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({
          model: config.ai.transcribeModel || 'gemini-1.5-flash',
        });
      } catch (err) {
        logger.warn('Failed to initialize Gemini audio transcription client:', err.message);
      }
    }
  }

  async transcribe(audioBuffer, mimeType = 'audio/webm') {
    if (!this.model || !audioBuffer) {
      return this.fallback.transcribe(audioBuffer, mimeType);
    }

    try {
      const audioBase64 = Buffer.isBuffer(audioBuffer)
        ? audioBuffer.toString('base64')
        : audioBuffer;

      const result = await this.model.generateContent([
        {
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: audioBase64,
          },
        },
        {
          text: 'Transcribe this incident report audio verbatim in the spoken language (English, Hindi, or Punjabi) and also provide the English translation if spoken in an Indian regional language. Output format: JSON with keys "transcript", "detectedLanguage", and "confidence".',
        },
      ]);

      const responseText = result.response.text();
      try {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          transcript: parsed.transcript || responseText,
          detectedLanguage: parsed.detectedLanguage || 'en-IN',
          confidence: parsed.confidence || 0.92,
        };
      } catch {
        return {
          transcript: responseText,
          detectedLanguage: 'en-IN',
          confidence: 0.90,
        };
      }
    } catch (error) {
      logger.warn('Gemini audio transcription failed, falling back to mock:', error.message);
      return this.fallback.transcribe(audioBuffer, mimeType);
    }
  }
}
