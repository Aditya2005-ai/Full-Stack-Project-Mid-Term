/**
 * Generated Output Validator Interface
 * Conforms to Problem Statement 06 & Phase 11-17, Phase 46
 */

export { validateGeneratedProject } from './projectValidator.js';
export { validateZipArchive } from './zipValidator.js';
export { testZipExtraction } from './extractionValidator.js';
export { testClientBuild } from './clientBuildValidator.js';
export { testServerValidation } from './serverValidator.js';
export { validateBuildArtifact } from './buildArtifactValidator.js';

export class OutputValidator {
  /**
   * Validates in-memory generated file tree integrity (backward compatibility)
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
