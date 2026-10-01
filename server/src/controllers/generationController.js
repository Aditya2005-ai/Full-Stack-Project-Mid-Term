/**
 * Generation Controller
 * Owned by Developer 4
 * Conforms to Problem Statement 06 & Phase 18-19
 */

import fs from 'fs';
import { generationService } from '../services/generationService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../utils/errors.js';

import { buildService } from '../services/buildService.js';
import { buildGenerationJob } from '../jobs/buildGenerationJob.js';

export const generate = asyncHandler(async (req, res) => {
  if (req.query.async === 'true' || req.body.async === 'true') {
    const buildId = req.body.buildId || `bld_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    let build = await buildService.getBuildById(buildId);
    if (!build) {
      build = await buildService.createBuild({ id: buildId, ...req.body }, req.user?.id);
    }

    if (buildGenerationJob.isGenerating(buildId)) {
      return res.status(409).json({
        success: false,
        message: 'Generation is already in progress.',
        buildId,
        status: build.status
      });
    }

    await buildService.updateBuildStatus(buildId, {
      status: 'queued',
      progress: 0,
      currentStep: 'Queued for generation',
      message: 'Build generation job registered in background queue',
      error: null
    });

    const config = { ...build, ...req.body, buildId };
    setImmediate(() => {
      buildGenerationJob.runBuildGeneration(buildId, config).catch((err) => {
        console.error(`[GenerationController] Async job error for ${buildId}:`, err);
      });
    });

    return res.status(200).json({
      success: true,
      buildId,
      status: 'queued',
      message: 'Build generation queued successfully',
      statusUrl: `/api/v1/builds/${buildId}/status`
    });
  }

  const result = await generationService.generateStore(req.body);
  return ApiResponse.success(res, result, 'Generated project archive created successfully', 201);
});

export const download = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const archive = await generationService.getArchive(token);

  if (!archive) {
    throw new NotFoundError('Requested build archive not found');
  }

  const filename = archive.filename || 'mern-ecommerce.zip';

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  if (archive.size) {
    res.setHeader('Content-Length', archive.size);
  }

  // Stream physical file from disk if available
  if (archive.zipPath && fs.existsSync(archive.zipPath)) {
    const fileStream = fs.createReadStream(archive.zipPath);
    return fileStream.pipe(res);
  }

  // Fallback to in-memory buffer if present
  if (archive.buffer) {
    return res.status(200).send(archive.buffer);
  }

  throw new NotFoundError('Archive content is empty or unavailable');
});

export const triggerGeneration = asyncHandler(async (req, res) => {
  const result = await generationService.triggerGeneration(req.params.buildId);
  return ApiResponse.success(res, result, 'Generation initiated');
});

export const getGenerationLogs = asyncHandler(async (req, res) => {
  const logs = await generationService.getGenerationLogs(req.params.buildId);
  return ApiResponse.success(res, logs, 'Generation logs retrieved');
});
