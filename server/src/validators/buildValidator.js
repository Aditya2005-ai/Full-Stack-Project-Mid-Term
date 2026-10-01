/**
 * Build Request Validators
 * Phase 01: Validation schema skeletons
 */

export const createBuildSchema = {
  safeParse: (data) => {
    const errors = [];
    if (!data?.projectName) errors.push('Project name is required');
    if (!data?.modules || !Array.isArray(data.modules)) errors.push('Modules array is required');
    return {
      success: errors.length === 0,
      error: { errors }
    };
  }
};
