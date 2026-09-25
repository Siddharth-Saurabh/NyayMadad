import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from './AIProvider.js';
import { MockAIProvider } from './MockAIProvider.js';
import { config } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export class GeminiProvider extends AIProvider {
  constructor() {
    super();
    this.fallback = new MockAIProvider();
    if (config.ai.geminiApiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({
          model: config.ai.model || 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });
      } catch (err) {
        logger.warn('Failed to initialize GoogleGenerativeAI client, using fallback:', err.message);
      }
    }
  }

  async analyzeIncident(text) {
    if (!this.model) {
      return this.fallback.analyzeIncident(text);
    }

    try {
      const prompt = `You are the AI assistant for NyayMadad, an Indian crime reporting assistance platform.
Your task is to analyze the citizen's unstructured incident description and extract structured facts.
DO NOT make legal determinations of guilt or innocent. Only classify the reporting domain and extract facts.

User Incident Description:
"""${text}"""

Return a strictly valid JSON object matching this schema:
{
  "category": "Cyber Crime" | "Theft" | "Assault" | "Women Safety" | "Financial Fraud" | "General Grievance",
  "subcategory": "string (specific incident subtype)",
  "urgency": "Low" | "Medium" | "High" | "Emergency",
  "requiresEmergencyResponse": boolean (true only if immediate physical danger / active crime in progress),
  "confidence": number between 0.0 and 1.0,
  "extractedInformation": {
    "financialLoss": { "amount": number or null, "currency": "INR", "transactionId": string or null },
    "suspects": ["string"],
    "witnesses": ["string"],
    "evidenceMentioned": ["string"]
  },
  "missingInformation": ["incidentDate", "incidentLocation", "transactionReference", etc.]
}`;

      const result = await this.model.generateContent(prompt);
      const rawJson = result.response.text();
      const parsed = JSON.parse(rawJson);
      return parsed;
    } catch (error) {
      logger.warn('Gemini API analysis failed, using MockAIProvider fallback:', error.message);
      return this.fallback.analyzeIncident(text);
    }
  }

  async generateFollowupQuestions(text, missingFields) {
    if (!this.model) {
      return this.fallback.generateFollowupQuestions(text, missingFields);
    }

    try {
      const prompt = `Based on the following citizen incident report and missing fields: [${missingFields.join(', ')}], generate 1 to 3 clear, empathetic, plain-language follow-up questions to collect necessary details.
Incident Report:
"""${text}"""

Return a strictly valid JSON array of objects:
[
  {
    "field": "string matching one of the missing fields",
    "question": "string"
  }
]`;

      const result = await this.model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      return Array.isArray(parsed) ? parsed : this.fallback.generateFollowupQuestions(text, missingFields);
    } catch (error) {
      logger.warn('Gemini follow-up questions failed, using fallback:', error.message);
      return this.fallback.generateFollowupQuestions(text, missingFields);
    }
  }

  async generateStructuredComplaint(incidentData) {
    if (!this.model) {
      return this.fallback.generateStructuredComplaint(incidentData);
    }

    try {
      const prompt = `Transform the following citizen-provided incident report into a structured, formal, and objective complaint document suitable for submission to authorized public authorities.
Do not add unstated facts. Keep it factual and clear.

Incident Data:
${JSON.stringify(incidentData, null, 2)}

Return a plain-text formal complaint draft with clear sections:
- FORMAL COMPLAINT RECORD
- INCIDENT CLASSIFICATION
- APPROXIMATE DATE & LOCATION
- SUMMARY OF FACTS
- LOSS / DAMAGES (if any)
- CITIZEN CONFIRMATION`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'text/plain' },
      });

      return result.response.text();
    } catch (error) {
      logger.warn('Gemini complaint synthesis failed, using fallback:', error.message);
      return this.fallback.generateStructuredComplaint(incidentData);
    }
  }
}
