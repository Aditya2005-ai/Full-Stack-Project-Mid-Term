/**
 * Generation Orchestration Service
 * Owned by Developer 4
 * Communicates with the Generator Engine via clean public API
 * Phase 01: Service interface skeleton
 */

import { createGenerator } from '../../../generator/index.js';
import { Build } from '../models/Build.js';
import { GenerationLog } from '../models/GenerationLog.js';

export class GenerationService {
  constructor() {
    this.generator = createGenerator();
    this.archiveCache = new Map();
  }

  /**
   * Generates full MERN project and stores ZIP in memory
   * @param {Object} config
   */
  async generateStore(config = {}) {
    const result = await this.generator.generate(config);
    const token = `tok_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    const archiveData = {
      buffer: result.zip.buffer,
      filename: result.zip.filename,
      size: result.zip.size,
      filesCount: result.summary.filesCount,
      summary: result.summary,
      createdAt: Date.now()
    };

    this.archiveCache.set(token, archiveData);

    return {
      downloadToken: token,
      downloadUrl: `/api/v1/download/${token}`,
      filename: result.zip.filename,
      size: result.zip.size,
      filesCount: result.summary.filesCount,
      summary: result.summary
    };
  }

  /**
   * Retrieves archive by download token
   * @param {string} token
   */
  async getArchive(token) {
    if (this.archiveCache.has(token)) {
      return this.archiveCache.get(token);
    }
    // Fallback generate default store if token not found
    const fallback = await this.generator.generate({ name: 'mern-store' });
    return {
      buffer: fallback.zip.buffer,
      filename: fallback.zip.filename,
      size: fallback.zip.size,
      filesCount: fallback.summary.filesCount
    };
  }

  async triggerGeneration(buildId) {
    return {
      buildId,
      status: 'initiated',
      message: 'Code generation pipeline queued'
    };
  }

  async getGenerationLogs(buildId) {
    return [];
  }
}

export const generationService = new GenerationService();

