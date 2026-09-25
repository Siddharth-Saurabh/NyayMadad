/**
 * Abstract Base Class for NyayMadad AI Providers
 */
export class AIProvider {
  /**
   * Analyzes an incident description and extracts entities, reporting domain, urgency and missing fields.
   * @param {string} text - Raw citizen description
   * @returns {Promise<Object>} Analyzed schema
   */
  async analyzeIncident(text) {
    throw new Error('Method analyzeIncident() must be implemented');
  }

  /**
   * Generates targeted clarifying questions based on missing information.
   * @param {string} text - Raw citizen description
   * @param {Array<string>} missingFields - Identified missing attributes
   * @returns {Promise<Array<Object>>} List of targeted questions
   */
  async generateFollowupQuestions(text, missingFields) {
    throw new Error('Method generateFollowupQuestions() must be implemented');
  }

  /**
   * Synthesizes a formal structured complaint for citizen review.
   * @param {Object} incidentData - Extracted and citizen-confirmed data
   * @returns {Promise<string>} Formal synthesized complaint text
   */
  async generateStructuredComplaint(incidentData) {
    throw new Error('Method generateStructuredComplaint() must be implemented');
  }
}
