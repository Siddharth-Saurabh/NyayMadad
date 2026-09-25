import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const COMPLAINT_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'ROUTING',
  'ROUTED',
  'RECEIVED',
  'UNDER_REVIEW',
  'INFORMATION_REQUESTED',
  'ACCEPTED',
  'ASSIGNED',
  'PROCESSING',
  'INVESTIGATION',
  'RESOLVED',
  'CLOSED',
  'TRANSFERRED',
  'ROUTING_FAILED',
];

const ComplaintSchema = new Schema(
  {
    complaintNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalStatement: {
      type: String,
      required: true,
    },
    reportingMode: {
      type: String,
      enum: ['TEXT', 'VOICE'],
      default: 'TEXT',
    },
    audioMetadata: {
      durationSeconds: Number,
      detectedLanguage: String,
      confidenceScore: Number,
      originalAudioTranscript: String,
    },
    category: {
      type: String,
      default: 'Uncategorized',
      index: true,
    },
    subcategory: {
      type: String,
      default: null,
    },
    description: {
      type: String,
    },
    aiGeneratedComplaint: {
      type: String,
    },
    citizenEditedComplaint: {
      type: String,
    },
    incidentDate: {
      type: Date,
      default: null,
    },
    incidentTime: {
      type: String,
      default: null,
    },
    incidentLocation: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      jurisdiction: String,
      landmark: String,
      latitude: Number,
      longitude: Number,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium',
    },
    requiresEmergencyResponse: {
      type: Boolean,
      default: false,
    },
    extractedInformation: {
      suspects: [String],
      witnesses: [String],
      financialLoss: {
        amount: Number,
        currency: { type: String, default: 'INR' },
        transactionId: String,
      },
      evidenceMentioned: [String],
      additionalEntities: Schema.Types.Mixed,
    },
    missingInformation: [{
      field: String,
      question: String,
      answered: { type: Boolean, default: false },
      answer: String,
    }],
    aiConfidence: {
      type: Number,
      default: 1.0,
    },
    status: {
      type: String,
      enum: COMPLAINT_STATUSES,
      default: 'DRAFT',
      index: true,
    },
    assignedDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
      index: true,
    },
    assignedOfficer: {
      type: Schema.Types.ObjectId,
      ref: 'Officer',
      default: null,
    },
    routingResult: {
      ruleId: { type: Schema.Types.ObjectId, ref: 'RoutingRule' },
      channel: String,
      routingRationale: String,
      routedAt: Date,
      fallbackUsed: Boolean,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionSummary: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal queries
ComplaintSchema.index({ userId: 1, createdAt: -1 });
ComplaintSchema.index({ assignedDepartment: 1, status: 1 });
ComplaintSchema.index({ category: 1, status: 1 });

export const Complaint = model('Complaint', ComplaintSchema);
