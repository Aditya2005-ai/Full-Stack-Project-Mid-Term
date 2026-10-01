/**
 * Authentication Controller
 * Owned by Developer 3
 */

import { authService } from '../services/authService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return ApiResponse.success(res, result, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return ApiResponse.success(res, result, 'Login successful');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user?.id);
  return ApiResponse.success(res, user, 'Current user profile');
});

export const logout = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, null, 'Logged out successfully');
});
