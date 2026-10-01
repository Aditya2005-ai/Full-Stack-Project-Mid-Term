/**
 * Generation Controller
 * Owned by Developer 4
 * Conforms to Problem Statement 06 (Page 8-10)
 */

import { generationService } from '../services/generationService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generate = asyncHandler(async (req, res) => {
  const result = await generationService.generateStore(req.body);
  return ApiResponse.success(res, result, 'Generated project archive created successfully', 201);
});

export const download = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const archive = await generationService.getArchive(token);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${archive.filename || 'mern-ecommerce.zip'}"`);
  if (archive.size || archive.buffer?.length) {
    res.setHeader('Content-Length', archive.size || archive.buffer?.length);
  }
  return res.status(200).send(archive.buffer);
});

export const triggerGeneration = asyncHandler(async (req, res) => {
  const result = await generationService.triggerGeneration(req.params.buildId);
  return ApiResponse.success(res, result, 'Generation initiated');
});

export const getGenerationLogs = asyncHandler(async (req, res) => {
  const logs = await generationService.getGenerationLogs(req.params.buildId);
  return ApiResponse.success(res, logs, 'Generation logs retrieved');
});
