import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const EvidenceSchema = new Schema(
  {
    complaintId: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'SCREENSHOT'],
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
    },
    storageReference: {
      type: String,
      required: true,
    },
    storageProvider: {
      type: String,
      default: 'local',
    },
    fileHash: {
      type: String,
      required: true,
      index: true, // SHA-256 integrity hash
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    integrityStatus: {
      type: String,
      enum: ['VERIFIED', 'TAMPERED', 'PENDING'],
      default: 'VERIFIED',
    },
    description: {
      type: String,
      default: '',
    },
    isSensitive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Evidence = model('Evidence', EvidenceSchema);
