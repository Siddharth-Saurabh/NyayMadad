import { AIProvider } from './AIProvider.js';

export class MockAIProvider extends AIProvider {
  async analyzeIncident(text) {
    const lower = text.toLowerCase();

    // 1. Domain / Category Detection
    let category = 'General Grievance';
    let subcategory = 'Unspecified';
    let urgency = 'Medium';
    let requiresEmergencyResponse = false;
    let confidence = 0.92;

    if (
      lower.includes('kill') ||
      lower.includes('gun') ||
      lower.includes('bleeding') ||
      lower.includes('danger') ||
      lower.includes('attack right now') ||
      lower.includes('immediate help')
    ) {
      urgency = 'Emergency';
      requiresEmergencyResponse = true;
      category = 'Assault';
      subcategory = 'Active Physical Threat';
    } else if (
      lower.includes('sms') ||
      lower.includes('otp') ||
      lower.includes('apk') ||
      lower.includes('upi') ||
      lower.includes('hacked') ||
      lower.includes('scam') ||
      lower.includes('phishing') ||
      lower.includes('debited') ||
      lower.includes('account')
    ) {
      category = 'Cyber Crime';
      subcategory = lower.includes('otp') || lower.includes('apk') || lower.includes('debited')
        ? 'Financial Fraud / UPI Scam'
        : 'Cyber Harassment / Unauthorized Access';
      urgency = 'High';
    } else if (
      lower.includes('stole') ||
      lower.includes('theft') ||
      lower.includes('bag') ||
      lower.includes('laptop') ||
      lower.includes('phone') ||
      lower.includes('robbed') ||
      lower.includes('snatched')
    ) {
      category = 'Theft';
      subcategory = lower.includes('laptop') ? 'Electronic Device Theft' : 'Personal Belongings Theft';
      urgency = 'Medium';
    } else if (
      lower.includes('stalk') ||
      lower.includes('harass') ||
      lower.includes('women') ||
      lower.includes('domestic') ||
      lower.includes('abused')
    ) {
      category = 'Women Safety';
      subcategory = lower.includes('domestic') ? 'Domestic Incident' : 'Public Harassment / Stalking';
      urgency = 'High';
    } else if (
      lower.includes('hit') ||
      lower.includes('beaten') ||
      lower.includes('fight') ||
      lower.includes('assault')
    ) {
      category = 'Assault';
      subcategory = 'Physical Altercation';
      urgency = 'High';
    }

    // 2. Entity & Information Extraction
    const amountMatch = text.match(/(?:₹|rs\.?|inr)\s?(\d+(?:,\d+)*(?:\.\d+)?)/i) || text.match(/(\d{3,7})\s*(?:rupees|rs|inr)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

    const suspects = [];
    if (lower.includes('caller') || lower.includes('sender') || lower.includes('unknown person')) {
      suspects.push('Unknown caller / digital sender');
    }
    const phoneMatch = text.match(/(?:\+91[\-\s]?)?[6-9]\d{9}/);
    if (phoneMatch) {
      suspects.push(`Identified Phone Number: ${phoneMatch[0]}`);
    }

    const missingInformation = [];
    if (!text.match(/\b(yesterday|today|morning|evening|pm|am|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2}))/i)) {
      missingInformation.push('incidentDate');
    }
    if (!text.match(/\b(delhi|noida|mumbai|bengaluru|pune|gurgaon|sector|station|street|nagar|road|cafe|market|shop)\b/i)) {
      missingInformation.push('incidentLocation');
    }
    if (category === 'Cyber Crime' && !text.match(/upi|transaction|utr|bank|reference/i)) {
      missingInformation.push('transactionReference');
    }

    return {
      category,
      subcategory,
      urgency,
      requiresEmergencyResponse,
      confidence,
      extractedInformation: {
        financialLoss: amount ? { amount, currency: 'INR' } : null,
        suspects,
        witnesses: [],
        evidenceMentioned: lower.includes('screenshot') || lower.includes('sms') ? ['Digital screenshot / SMS record'] : [],
      },
      missingInformation,
    };
  }

  async generateFollowupQuestions(text, missingFields = []) {
    const questions = [];
    if (missingFields.includes('incidentDate')) {
      questions.push({
        field: 'incidentDate',
        question: 'Approximately when did this incident occur (date and approximate time)?',
      });
    }
    if (missingFields.includes('incidentLocation')) {
      questions.push({
        field: 'incidentLocation',
        question: 'Where did this incident take place (city, landmark, or online platform)?',
      });
    }
    if (missingFields.includes('transactionReference')) {
      questions.push({
        field: 'transactionReference',
        question: 'Do you have a bank transaction ID, UPI reference number, or payment screenshot reference?',
      });
    }

    if (questions.length === 0) {
      questions.push({
        field: 'additionalDetails',
        question: 'Are there any other specific identifying marks, vehicle numbers, or communications to note?',
      });
    }

    return questions;
  }

  async generateStructuredComplaint(incidentData) {
    const { originalStatement, category, subcategory, incidentDate, incidentLocation, extractedInformation } = incidentData;
    
    const locationStr = typeof incidentLocation === 'string' 
      ? incidentLocation 
      : incidentLocation?.city 
        ? `${incidentLocation.address || ''}, ${incidentLocation.city} (${incidentLocation.state || ''})`
        : 'Location as stated in report';

    const lossStr = extractedInformation?.financialLoss?.amount 
      ? `Financial Loss incurred: ₹${extractedInformation.financialLoss.amount.toLocaleString('en-IN')}` 
      : '';

    return `FORMAL COMPLAINT RECORD

INCIDENT CLASSIFICATION: ${category || 'General Incident'} (${subcategory || 'Standard'})
REPORTED LOCATION: ${locationStr}
APPROXIMATE DATE/TIME: ${incidentDate ? new Date(incidentDate).toLocaleString() : 'As per citizen statement'}
${lossStr ? `LOSS / DAMAGES: ${lossStr}\n` : ''}
STATEMENT OF FACTS:
${originalStatement}

SUMMARY OF COMPLAINT:
The complainant reports an incident concerning ${category.toLowerCase()} involving ${subcategory.toLowerCase()}. The matter has been recorded for review, verification of presented facts, and forwarding to the competent jurisdictional department for appropriate official action.

CITIZEN DECLARATION:
The citizen has reviewed and confirmed the veracity of the above statement.`;
  }
}
