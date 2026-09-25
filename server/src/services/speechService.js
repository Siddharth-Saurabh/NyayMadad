import { config } from '../config/env.js';
import { GeminiTranscribeProvider } from '../providers/speech/GeminiTranscribeProvider.js';
import { MockSpeechProvider } from '../providers/speech/MockSpeechProvider.js';

let activeSpeechProvider = null;

export const getSpeechProvider = () => {
  if (!activeSpeechProvider) {
    if (config.speech.provider === 'gemini' && config.ai.geminiApiKey) {
      activeSpeechProvider = new GeminiTranscribeProvider();
    } else {
      activeSpeechProvider = new MockSpeechProvider();
    }
  }
  return activeSpeechProvider;
};

export const transcribeAudio = async (audioBuffer, mimeType) => {
  const provider = getSpeechProvider();
  return provider.transcribe(audioBuffer, mimeType);
};
