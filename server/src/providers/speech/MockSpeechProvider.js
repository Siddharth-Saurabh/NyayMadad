import { SpeechToTextProvider } from './SpeechToTextProvider.js';

export class MockSpeechProvider extends SpeechToTextProvider {
  async transcribe(audioData, mimeType = 'audio/webm') {
    return {
      transcript:
        'Yesterday around 7:30 PM, I received a phone call from someone pretending to be a customer support officer from my bank. They told me my account was blocked and asked me to verify my identity by reading back an OTP. As soon as I shared it, 25,000 rupees was debited from my account to an unknown UPI ID.',
      confidence: 0.95,
      detectedLanguage: 'en-IN',
    };
  }
}
