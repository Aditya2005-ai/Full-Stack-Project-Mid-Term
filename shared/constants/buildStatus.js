/**
 * Shared Build Status Lifecycle Constants
 */

export const BUILD_STATUS = Object.freeze({
  PENDING: 'pending',
  RESOLVING: 'resolving',
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed'
});

export const GENERATION_STEPS = Object.freeze({
  STORE_BASICS: 'store_basics',
  MODULE_SELECTION: 'module_selection',
  DEPENDENCY_RESOLUTION: 'dependency_resolution',
  MODULE_OPTIONS: 'module_options',
  REVIEW: 'review',
  GENERATE: 'generate',
  DOWNLOAD: 'download'
});
