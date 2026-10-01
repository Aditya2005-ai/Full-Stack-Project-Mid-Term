import fs from 'fs';
import path from 'path';
import { createGenerator } from '../../../generator/index.js';
import { getWorkspaceRoot } from '../../../generator/filesystem/buildManager.js';
import { buildService } from '../services/buildService.js';
import { generationService } from '../services/generationService.js';

export class BuildGenerationJob {
  constructor() {
    this.generator = createGenerator();
    this.activeJobs = new Set();
  }

  /**
   * Check if a build is actively running in background
   * @param {string} buildId 
   * @returns {boolean}
   */
  isGenerating(buildId) {
    return this.activeJobs.has(buildId);
  }

  /**
   * Clean up temporary directories for clean generation/retry
   * @param {string} buildId 
   */
  cleanPreviousBuild(buildId) {
    try {
      const root = getWorkspaceRoot();
      const buildDir = path.resolve(root, 'tmp', 'builds', buildId);
      const valDir = path.resolve(root, 'tmp', 'zip-validation', buildId);
      if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true, force: true });
      }
      if (fs.existsSync(valDir)) {
        fs.rmSync(valDir, { recursive: true, force: true });
      }
    } catch (err) {
      console.warn(`[BuildJob] Cleanup warning for ${buildId}: ${err.message}`);
    }
  }

  /**
   * Executes the full asynchronous build pipeline
   * @param {string} buildId 
   * @param {Object} projectConfig 
   */
  async runBuildGeneration(buildId, projectConfig = {}) {
    if (this.activeJobs.has(buildId)) {
      throw new Error(`Build ${buildId} is already generating`);
    }

    this.activeJobs.add(buildId);
    let currentStep = 'Build queued';

    try {
      // 1. Clean previous build attempt (ensures idempotent retry)
      this.cleanPreviousBuild(buildId);

      // 2. Mark build queued
      await buildService.updateBuildStatus(buildId, {
        status: 'queued',
        progress: 0,
        currentStep: 'Queued for generation',
        message: 'Build generation job registered in background queue',
        error: null
      });

      // 3. Define progress callback to sync with DB & memory state
      const onProgress = async (progressEvent) => {
        currentStep = progressEvent.currentStep || currentStep;
        await buildService.updateBuildStatus(buildId, {
          status: progressEvent.status,
          progress: progressEvent.progress,
          currentStep: progressEvent.currentStep,
          message: progressEvent.message,
          error: null
        });
      };

      // 4. Run generator with real disk creation, 13 validations, and progress reporting
      const result = await this.generator.generate(
        { ...projectConfig, buildId },
        { onProgress }
      );

      // 5. Generate download token and cache archive for download endpoints
      const token = `tok_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      const archiveData = {
        buildId,
        zipPath: result.zip.path || result.zipPath,
        buffer: result.zip.buffer,
        filename: result.zip.filename,
        size: result.zip.size,
        filesCount: result.summary.filesCount,
        summary: result.summary,
        validation: result.validation,
        createdAt: Date.now()
      };

      generationService.registerArchive(token, archiveData);
      generationService.registerArchiveForBuild(buildId, archiveData);

      // 6. Mark build as completed
      await buildService.updateBuildStatus(buildId, {
        status: 'completed',
        progress: 100,
        currentStep: 'Generation Complete',
        message: 'Project assembled, validated, and ready for download',
        fileCount: result.summary.filesCount,
        zipSize: result.zip.size,
        zipPath: result.zip.path || result.zipPath,
        downloadToken: token,
        downloadAvailable: true,
        completedAt: new Date(),
        error: null
      });

      console.log(`[BuildJob] Successfully generated & validated build: ${buildId}`);
      return result;
    } catch (err) {
      console.error(`[BuildJob] Generation failed for ${buildId} at step "${currentStep}":`, err.message);
      
      await buildService.updateBuildStatus(buildId, {
        status: 'failed',
        progress: 0,
        currentStep,
        message: `Generation failed during: ${currentStep}`,
        error: err.message || String(err),
        downloadAvailable: false
      });
      
      // Top-level error boundary ensures no unhandled rejection crashes the process
      return { success: false, error: err.message };
    } finally {
      this.activeJobs.delete(buildId);
    }
  }
}

export const buildGenerationJob = new BuildGenerationJob();
