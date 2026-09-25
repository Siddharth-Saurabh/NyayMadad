import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DepartmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    jurisdiction: {
      type: String,
      required: true,
      trim: true,
    },
    supportedCategories: [{
      type: String,
      trim: true,
    }],
    routingChannel: {
      type: String,
      enum: ['DIRECT_DISPATCH', 'ELECTRONIC_API', 'MANUAL_QUEUE', 'INTER_AGENCY'],
      default: 'DIRECT_DISPATCH',
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    isDemo: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Department = model('Department', DepartmentSchema);
