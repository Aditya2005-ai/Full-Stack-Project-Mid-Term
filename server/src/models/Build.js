/**
 * Build Model (User Project Configuration)
 * Exactly conforms to Problem Statement 06 (Page 10)
 */

import mongoose from 'mongoose';

const buildSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    store: {
      currency: { type: String, default: 'INR' },
      theme: { type: String, default: '#6366F1' },
      logoUrl: { type: String, default: '' },
      description: { type: String, default: '' }
    },
    modules: [
      {
        type: String,
        required: true
      }
    ],
    options: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    lastGeneratedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Backward-compatible virtual for projectName
buildSchema.virtual('projectName').get(function() {
  return this.name;
});

export const Build = mongoose.model('Build', buildSchema);
