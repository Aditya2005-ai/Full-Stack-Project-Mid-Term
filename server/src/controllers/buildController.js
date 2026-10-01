/**
 * Build Controller
 * Owned by Developer 4
 * Conforms to Problem Statement 06 (Page 8-10)
 */

import { buildService } from '../services/buildService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createBuild = asyncHandler(async (req, res) => {
  const build = await buildService.createBuild(req.body, req.user?.id);
  return ApiResponse.success(res, build, 'Build created successfully', 201);
});

export const getBuildById = asyncHandler(async (req, res) => {
  const build = await buildService.getBuildById(req.params.id);
  return ApiResponse.success(res, build, 'Build retrieved successfully');
});

export const getUserBuilds = asyncHandler(async (req, res) => {
  const builds = await buildService.getUserBuilds(req.user?.id);
  return ApiResponse.success(res, builds, 'User builds retrieved successfully');
});

export const updateBuild = asyncHandler(async (req, res) => {
  const updated = await buildService.updateBuild(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Build updated successfully');
});

export const duplicateBuild = asyncHandler(async (req, res) => {
  const duplicated = await buildService.duplicateBuild(req.params.id);
  return ApiResponse.success(res, duplicated, 'Build duplicated successfully', 201);
});

export const deleteBuild = asyncHandler(async (req, res) => {
  const result = await buildService.deleteBuild(req.params.id);
  return ApiResponse.success(res, result, 'Build deleted successfully');
});

export const resolveBuild = asyncHandler(async (req, res) => {
  const modules = req.body.modules || [];
  const options = req.body.options || {};
  const data = await buildService.resolveBuildModules(modules, options);
  return ApiResponse.success(res, data, 'Module graph resolved successfully');
});
