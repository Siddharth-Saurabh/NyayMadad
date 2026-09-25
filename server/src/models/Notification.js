import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    complaintId: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'COMPLAINT_SUBMITTED',
        'COMPLAINT_ROUTED',
        'COMPLAINT_RECEIVED',
        'INFORMATION_REQUESTED',
        'OFFICER_ASSIGNED',
        'STATUS_UPDATED',
        'COMPLAINT_RESOLVED',
        'COMPLAINT_CLOSED',
        'SYSTEM_ALERT',
      ],
      default: 'STATUS_UPDATED',
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = model('Notification', NotificationSchema);
