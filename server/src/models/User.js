import mongoose from 'express';
import mongoosepkg from 'mongoose';
const { Schema, model } = mongoosepkg;

const UserSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['citizen', 'officer', 'department_admin', 'system_admin'],
      default: 'citizen',
      index: true,
    },
    identityVerified: {
      type: Boolean,
      default: false,
    },
    verificationLevel: {
      type: String,
      enum: ['NONE', 'BASIC_OTP', 'GOVT_ID', 'LIVENESS_VERIFIED'],
      default: 'NONE',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active',
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    officerId: {
      type: Schema.Types.ObjectId,
      ref: 'Officer',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model('User', UserSchema);
