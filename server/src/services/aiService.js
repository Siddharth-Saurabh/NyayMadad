import { config } from '../config/env.js';
import { GeminiProvider } from '../providers/ai/GeminiProvider.js';
import { MockAIProvider } from '../providers/ai/MockAIProvider.js';

let activeProvider = null;

export const getAIProvider = () => {
  if (!activeProvider) {
    if (config.ai.provider === 'gemini' && config.ai.geminiApiKey) {
      activeProvider = new GeminiProvider();
    } else {
      activeProvider = new MockAIProvider();
    }
  }
  return activeProvider;
};

export const analyzeIncident = async (text) => {
  const provider = getAIProvider();
  return provider.analyzeIncident(text);
};

export const generateQuestions = async (text, missingFields) => {
  const provider = getAIProvider();
  return provider.generateFollowupQuestions(text, missingFields);
};

export const generateComplaintDraft = async (incidentData) => {
  const provider = getAIProvider();
  return provider.generateStructuredComplaint(incidentData);
};
