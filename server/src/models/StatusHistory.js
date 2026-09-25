import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const StatusHistorySchema = new Schema(
  {
    complaintId: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    fromStatus: {
      type: String,
      required: true,
    },
    toStatus: {
      type: String,
      required: true,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actorRole: {
      type: String,
      default: 'SYSTEM',
    },
    note: {
      type: String,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

StatusHistorySchema.index({ complaintId: 1, createdAt: -1 });

export const StatusHistory = model('StatusHistory', StatusHistorySchema);
