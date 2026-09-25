import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const AuditLogSchema = new Schema(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    actorClerkId: {
      type: String,
      default: null,
    },
    actorRole: {
      type: String,
      required: true,
      default: 'ANONYMOUS',
    },
    action: {
      type: String,
      required: true,
      index: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'IDENTITY_VERIFIED',
        'COMPLAINT_CREATED',
        'COMPLAINT_SUBMITTED',
        'EVIDENCE_UPLOADED',
        'EVIDENCE_ACCESSED',
        'STATUS_CHANGED',
        'OFFICER_ASSIGNED',
        'INFORMATION_REQUESTED',
        'INFORMATION_RESPONDED',
        'ROUTING_CHANGED',
        'CASE_TRANSFERRED',
        'ADMIN_ACTION',
      ],
    },
    resourceType: {
      type: String,
      required: true,
    },
    resourceId: {
      type: String,
      default: null,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1 });

export const AuditLog = model('AuditLog', AuditLogSchema);
