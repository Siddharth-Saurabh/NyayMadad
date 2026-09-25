import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const InformationRequestSchema = new Schema(
  {
    complaintId: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    officerName: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['PENDING', 'RESPONDED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    evidenceIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Evidence',
    }],
  },
  {
    timestamps: true,
  }
);

export const InformationRequest = model('InformationRequest', InformationRequestSchema);
