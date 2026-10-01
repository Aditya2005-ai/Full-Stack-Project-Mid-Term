/**
 * Build Controller
 * Supports asynchronous job queueing, polling, and verified download
 * Conforms to Problem Statement 06 & Async Architecture
 */

import fs from 'fs';
import { buildService } from '../services/buildService.js';
import { generationService } from '../services/generationService.js';
import { buildGenerationJob } from '../jobs/buildGenerationJob.js';
import { sanitizeProjectName } from '../../../generator/filesystem/buildManager.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../utils/errors.js';

export const createBuild = asyncHandler(async (req, res) => {
  const build = await buildService.createBuild(req.body, req.user?.id);
  return ApiResponse.success(res, build, 'Build created successfully', 201);
});

export const getBuildById = asyncHandler(async (req, res) => {
  const buildId = req.params.buildId || req.params.id;
  const build = await buildService.getBuildById(buildId);
  return ApiResponse.success(res, build, 'Build retrieved successfully');
});

export const getUserBuilds = asyncHandler(async (req, res) => {
  const builds = await buildService.getUserBuilds(req.user?.id);
  return ApiResponse.success(res, builds, 'User builds retrieved successfully');
});

export const updateBuild = asyncHandler(async (req, res) => {
  const buildId = req.params.buildId || req.params.id;
  const updated = await buildService.updateBuild(buildId, req.body);
  return ApiResponse.success(res, updated, 'Build updated successfully');
});

export const duplicateBuild = asyncHandler(async (req, res) => {
  const buildId = req.params.buildId || req.params.id;
  const duplicated = await buildService.duplicateBuild(buildId);
  return ApiResponse.success(res, duplicated, 'Build duplicated successfully', 201);
});

export const deleteBuild = asyncHandler(async (req, res) => {
  const buildId = req.params.buildId || req.params.id;
  const result = await buildService.deleteBuild(buildId);
  return ApiResponse.success(res, result, 'Build deleted successfully');
});

export const resolveBuild = asyncHandler(async (req, res) => {
  const modules = req.body.modules || [];
  const options = req.body.options || {};
  const data = await buildService.resolveBuildModules(modules, options);
  return ApiResponse.success(res, data, 'Module graph resolved successfully');
});

/**
 * Triggers asynchronous background build generation
 * Returns immediately with { success: true, buildId, status: "queued" }
 */
export const triggerBuildGeneration = asyncHandler(async (req, res) => {
  const buildId = req.params.buildId || req.params.id;
  let build = await buildService.getBuildById(buildId);

  if (!build) {
    build = await buildService.createBuild({ id: buildId, ...req.body }, req.user?.id);
  }

  // Prevent duplicate concurrent generation
  const activeStatuses = [
    'queued',
    'generating',
    'validating_project',
    'creating_zip',
    'validating_zip',
    'testing_extraction',
    'testing_project'
  ];

  if (buildGenerationJob.isGenerating(buildId) || activeStatuses.includes(build.status)) {
    return res.status(409).json({
      success: false,
      message: 'Generation is already in progress.',
      buildId,
      status: build.status
    });
  }

  // Merge request body options if provided
  const config = {
    ...build,
    ...req.body,
    name: req.body.name || req.body.storeName || build.name,
    modules: req.body.modules || req.body.selectedModules || build.modules,
    buildId
  };

  // Set status queued immediately
  await buildService.updateBuildStatus(buildId, {
    status: 'queued',
    progress: 0,
    currentStep: 'Queued for generation',
    message: 'Build generation job registered in background queue',
    error: null
  });

  // Launch background job asynchronously - DO NOT await here!
  setImmediate(() => {
    buildGenerationJob.runBuildGeneration(buildId, config).catch((err) => {
      console.error(`[BuildController] Uncaught error in background generation for ${buildId}:`, err);
    });
  });

  return res.status(200).json({
    success: true,
    buildId,
    status: 'queued',
    message: 'Build generation queued successfully',
    statusUrl: `/api/v1/builds/${buildId}/status`
  });
});

/**
 * Retrieves live generation status and progress
 */
export const getBuildStatus = asyncHandler(async (req, res) => {
  const buildId = req.params.buildId || req.params.id;
  const build = await buildService.getBuildById(buildId);

  if (!build) {
    throw new NotFoundError(`Build not found: ${buildId}`);
  }

  const isCompleted = build.status === 'completed';
  const isFailed = build.status === 'failed';

  return res.status(200).json({
    success: true,
    build: {
      id: build.id || buildId,
      status: build.status || 'draft',
      progress: build.progress || 0,
      currentStep: build.currentStep || '',
      message: build.message || '',
      error: build.error || null,
      downloadAvailable: isCompleted && Boolean(build.zipPath),
      downloadUrl: isCompleted ? `/api/v1/builds/${buildId}/download` : null,
      downloadToken: build.downloadToken || null,
      fileCount: build.fileCount || 0,
      zipSize: build.zipSize || 0,
      completedAt: build.completedAt || null
    }
  });
});

/**
 * Downloads verified ZIP archive
 * Only allowed when status === 'completed'
 */
export const downloadBuildZip = asyncHandler(async (req, res) => {
  const buildId = req.params.buildId || req.params.id;
  const build = await buildService.getBuildById(buildId);

  if (!build) {
    throw new NotFoundError('Build not found');
  }

  if (build.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: `Build is not completed yet (current status: ${build.status})`
    });
  }

  const archive =
    (await generationService.getArchiveByBuildId(buildId)) ||
    (await generationService.getArchive(build.downloadToken || buildId));

  const zipPath = build.zipPath || archive?.zipPath;
  if (!zipPath || !fs.existsSync(zipPath)) {
    throw new NotFoundError('Generated ZIP archive file not found on disk');
  }

  const projectName = sanitizeProjectName(build.name || 'store');
  const filename = `${projectName}.zip`;
  const stat = fs.statSync(zipPath);

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', stat.size);

  const fileStream = fs.createReadStream(zipPath);
  return fileStream.pipe(res);
});
