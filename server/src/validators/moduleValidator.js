/**
 * Module Request Validators
 * Phase 01: Validation schema skeletons
 */

export const createModuleSchema = {
  safeParse: (data) => {
    const errors = [];
    if (!data?.moduleId) errors.push('Module ID is required');
    if (!data?.name) errors.push('Module name is required');
    return {
      success: errors.length === 0,
      error: { errors }
    };
  }
};
