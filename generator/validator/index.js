/**
 * Generated Output Validator Interface
 * Phase 01: Architectural interface skeleton
 */

export class OutputValidator {
  /**
   * Validates generated file tree integrity
   * @param {Record<string, string>} files 
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validate(files = {}) {
    const errors = [];
    if (!files || Object.keys(files).length === 0) {
      errors.push('Generated project contains no files');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
