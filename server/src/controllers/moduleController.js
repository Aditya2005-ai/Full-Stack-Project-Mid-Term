/**
 * Module Controller
 * Owned by Developer 4
 */

import { moduleService } from '../services/moduleService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getModules = asyncHandler(async (req, res) => {
  const modules = await moduleService.getAllModules();
  return ApiResponse.success(res, modules, 'Modules retrieved successfully');
});

export const getModuleById = asyncHandler(async (req, res) => {
  const moduleItem = await moduleService.getModuleById(req.params.id);
  return ApiResponse.success(res, moduleItem, 'Module retrieved successfully');
});
