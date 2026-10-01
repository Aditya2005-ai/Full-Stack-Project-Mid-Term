import fs from 'fs';
import path from 'path';
import { validateGeneratedProject } from './projectValidator.js';
import { validateZipArchive } from './zipValidator.js';
import { testZipExtraction } from './extractionValidator.js';
import { testClientBuild } from './clientBuildValidator.js';
import { testServerValidation } from './serverValidator.js';

/**
 * Single comprehensive build artifact validation function
 * Conforms to Phase 46 & Phase 47 specifications
 */
export async function validateBuildArtifact({ buildId, buildDir, zipPath, projectName }) {
  const allErrors = [];

  // 1-5. Validate project on physical disk
  const projRes = await validateGeneratedProject(buildDir);
  if (!projRes.valid) {
    allErrors.push(...projRes.errors);
  }

  // 6-9. Validate ZIP on physical disk
  const zipRes = await validateZipArchive(zipPath, projectName);
  if (!zipRes.valid) {
    allErrors.push(...zipRes.errors);
  }

  // 10-11. Extract ZIP to temporary validation directory & test structure
  const extRes = await testZipExtraction(zipPath, buildId, projectName);
  if (!extRes.valid) {
    allErrors.push(...extRes.errors);
  }

  // 12-13. Test client build & server validation on extracted codebase
  if (extRes.valid && extRes.extractedProjectDir) {
    const clientRes = await testClientBuild(extRes.extractedProjectDir);
    if (!clientRes.valid) {
      allErrors.push(...clientRes.errors);
    }

    const serverRes = await testServerValidation(extRes.extractedProjectDir);
    if (!serverRes.valid) {
      allErrors.push(...serverRes.errors);
    }

    // Cleanup temporary extraction directory after tests pass
    if (extRes.extractBaseDir && fs.existsSync(extRes.extractBaseDir)) {
      try {
        await fs.promises.rm(extRes.extractBaseDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup error
      }
    }
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors
  };
}
