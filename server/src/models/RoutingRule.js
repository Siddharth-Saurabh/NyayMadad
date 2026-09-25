import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const RoutingRuleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    subcategory: {
      type: String,
      default: '*',
      trim: true,
    },
    jurisdiction: {
      type: String,
      default: 'ALL',
      index: true,
      trim: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    channel: {
      type: String,
      enum: ['DIRECT_DISPATCH', 'ELECTRONIC_API', 'MANUAL_QUEUE', 'INTER_AGENCY'],
      default: 'DIRECT_DISPATCH',
    },
    priority: {
      type: Number,
      default: 10, // Higher numbers evaluate first
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    effectiveFrom: {
      type: Date,
      default: Date.now,
    },
    effectiveTo: {
      type: Date,
      default: null,
    },
    lastVerifiedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: String,
      default: 'System Administrator',
    },
  },
  {
    timestamps: true,
  }
);

RoutingRuleSchema.index({ category: 1, jurisdiction: 1, active: 1, priority: -1 });

export const RoutingRule = model('RoutingRule', RoutingRuleSchema);
