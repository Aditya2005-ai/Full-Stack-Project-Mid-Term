/**
 * 404 Route Not Found Middleware
 */

import { NotFoundError } from '../utils/errors.js';

export const notFound = (req, res, next) => {
  next(new NotFoundError(`Endpoint not found: ${req.method} ${req.originalUrl}`));
};
