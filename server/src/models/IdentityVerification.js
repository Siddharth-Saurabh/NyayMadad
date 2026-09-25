import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const IdentityVerificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      default: 'mock_digilocker',
    },
    verificationType: {
      type: String,
      enum: ['MOBILE_OTP', 'GOVT_ID', 'FACE_LIVENESS'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    verificationReference: {
      type: String,
      trim: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
    metadata: {
      maskedIdNumber: String,
      idType: String,
      livenessScore: Number,
      verifiedAttributes: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const IdentityVerification = model('IdentityVerification', IdentityVerificationSchema);
