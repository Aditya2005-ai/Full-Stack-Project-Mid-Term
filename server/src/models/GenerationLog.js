/**
 * Generation Model (History & Analytics)
 * Exactly conforms to Problem Statement 06 (Page 10)
 */

import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema(
  {
    buildId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Build',
      required: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    resolvedModules: [
      {
        type: String,
        required: true
      }
    ],
    fileCount: {
      type: Number,
      default: 0
    },
    sizeBytes: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'resolving', 'rendering', 'zipping', 'completed', 'failed'],
      default: 'pending'
    },
    downloadToken: {
      type: String,
      default: null
    },
    downloadUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Generation = mongoose.model('Generation', generationSchema);
export const GenerationLog = Generation; // Export alias for backward compatibility
