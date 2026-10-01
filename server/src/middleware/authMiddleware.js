/**
 * Authentication Middleware
 * Phase 01: Clean architectural interface skeleton for Dev 3
 */

import { UnauthorizedError } from '../utils/errors.js';

export const protect = (req, res, next) => {
  // Phase 01: Skeleton placeholder - does not enforce real authentication yet
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.user = { id: 'dev-user-01', role: 'admin' };
  }
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // Phase 01: Role authorization skeleton
    next();
  };
};
