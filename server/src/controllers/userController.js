/**
 * User Controller
 * Owned by Developer 4
 */

import { userService } from '../services/userService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.params.id || req.user?.id);
  return ApiResponse.success(res, profile, 'User profile retrieved');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await userService.updateProfile(req.params.id || req.user?.id, req.body);
  return ApiResponse.success(res, updated, 'User profile updated');
});
