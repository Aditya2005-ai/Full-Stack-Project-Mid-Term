/**
 * User Model
 * Conforms to Problem Statement 06 (Page 10)
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'user', 'admin'],
      default: 'USER'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Backward-compatible virtual for password
userSchema.virtual('password').set(function(pw) {
  this.passwordHash = pw;
});

export const User = mongoose.model('User', userSchema);
