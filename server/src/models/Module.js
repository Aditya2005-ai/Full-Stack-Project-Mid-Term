/**
 * Module Model (Catalogue)
 * Exactly conforms to Problem Statement 06 (Page 9)
 */

import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'Box'
    },
    dependsOn: [
      {
        type: String
      }
    ],
    options: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    templates: [
      {
        path: { type: String, required: true },
        engine: { type: String, default: 'ejs' }
      }
    ],
    envKeys: [
      {
        key: { type: String, required: true },
        comment: { type: String, default: '' },
        required: { type: Boolean, default: true }
      }
    ],
    category: {
      type: String,
      default: 'core'
    },
    order: {
      type: Number,
      default: 0
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

// Backward-compatible virtual for moduleId
moduleSchema.virtual('moduleId').get(function() {
  return this.key;
});

export const Module = mongoose.model('Module', moduleSchema);
