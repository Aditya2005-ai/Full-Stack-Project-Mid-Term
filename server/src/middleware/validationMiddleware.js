/**
 * Validation Middleware Wrapper
 */

import { ValidationError } from '../utils/errors.js';

export const validate = (schema) => (req, res, next) => {
  if (!schema) return next();
  
  const result = typeof schema.safeParse === 'function' 
    ? schema.safeParse(req.body) 
    : { success: true };

  if (!result.success) {
    const issues = result.error ? result.error.errors : ['Invalid request payload'];
    return next(new ValidationError('Validation failed', issues));
  }

  next();
};
