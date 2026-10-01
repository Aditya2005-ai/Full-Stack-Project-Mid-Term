/**
 * Auth Request Validators
 * Phase 01: Validation schema skeletons
 */

export const registerSchema = {
  safeParse: (data) => {
    const errors = [];
    if (!data?.email || !data.email.includes('@')) errors.push('Valid email is required');
    if (!data?.password || data.password.length < 6) errors.push('Password must be at least 6 characters');
    if (!data?.name) errors.push('Name is required');
    return {
      success: errors.length === 0,
      error: { errors }
    };
  }
};

export const loginSchema = {
  safeParse: (data) => {
    const errors = [];
    if (!data?.email) errors.push('Email is required');
    if (!data?.password) errors.push('Password is required');
    return {
      success: errors.length === 0,
      error: { errors }
    };
  }
};
