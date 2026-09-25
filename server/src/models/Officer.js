import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const OfficerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true,
    },
    badgeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rank: {
      type: String,
      default: 'Investigating Officer',
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    assignedCasesCount: {
      type: Number,
      default: 0,
    },
    permissions: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Officer = model('Officer', OfficerSchema);
