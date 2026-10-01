/**
 * Generator Engine - Public Interface
 * Clean architectural boundary for Server integration.
 * Conforms to Problem Statement 06 & Phase 5, Phase 9-16, Phase 46
 */

import path from 'path';
import { ModuleCatalogue, MODULE_CATALOGUE } from './catalogue/index.js';
import { DependencyResolver } from './resolver/index.js';
import { TemplateRegistry } from './templates/index.js';
import { CodeRenderer } from './renderer/index.js';
import { FileMerger } from './merger/index.js';
import { CodeFormatter } from './formatter/index.js';
import {
  OutputValidator,
  validateGeneratedProject,
  validateZipArchive,
  testZipExtraction,
  testClientBuild,
  testServerValidation,
  validateBuildArtifact
} from './validator/index.js';
import { ZipPackager } from './zip/index.js';
import {
  sanitizeProjectName,
  getBuildDirectory,
  writeProjectFiles,
  countDirectoryFiles,
  getWorkspaceRoot
} from './filesystem/buildManager.js';
import { generateMernStoreFiles } from './templates/mernStoreTemplate.js';

export class GeneratorEngine {
  constructor(options = {}) {
    this.catalogue = new ModuleCatalogue(options.catalogue || MODULE_CATALOGUE);
    this.resolver = new DependencyResolver(this.catalogue);
    this.templates = new TemplateRegistry();
    this.renderer = new CodeRenderer();
    this.merger = new FileMerger();
    this.packager = new ZipPackager();
  }

  /**
   * Retrieves catalogue of available modules
   */
  getAvailableModules() {
    return this.catalogue.getAll();
  }

  /**
   * Resolves module dependencies
   * @param {string[]} moduleIds 
   * @param {Object} options
   */
  resolveDependencies(moduleIds, options = {}) {
    return this.resolver.resolve(moduleIds, options);
  }

  /**
   * Complete robust generation pipeline
   * 1. Sanitize project name
   * 2. Create unique build directory
   * 3. Render real source files
   * 4. Write files to physical disk
   * 5. Validate generated project on disk
   * 6. Package ZIP archive on disk
   * 7. Validate ZIP archive
   * 8. Extract ZIP into temporary test directory
   * 9. Run client build test
   * 10. Run server validation test
   * 11. Run master build artifact validation
   * @param {Object} projectConfig 
   */
  async generate(projectConfig = {}, options = {}) {
    const rawName = projectConfig.name || projectConfig.store?.name || 'Bloom Boutique';
    const projectName = sanitizeProjectName(rawName);
    const buildId = projectConfig.buildId || options.buildId || `bld_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    const onProgress = options.onProgress || projectConfig.onProgress || (() => {});

    console.log(`[BUILD] Starting build ${buildId} for project "${projectName}"`);

    // Stage 1: Generating files on disk (20%)
    onProgress({
      status: 'generating',
      progress: 20,
      currentStep: 'Generating project files...',
      message: 'Rendering full-stack MERN files on disk'
    });

    console.log(`[GENERATOR] Rendering full-stack MERN files...`);
    const files = generateMernStoreFiles({ ...projectConfig, name: projectName });

    console.log(`[GENERATOR] Creating project directory on disk...`);
    const buildDir = getBuildDirectory(buildId, projectName);
    await writeProjectFiles(buildDir, files);

    const fileCount = await countDirectoryFiles(buildDir);
    console.log(`[VALIDATOR] Files written to disk: ${fileCount}`);
    if (fileCount === 0) {
      throw new Error(`Generation failed: 0 files written to ${buildDir}`);
    }

    // Stage 2: Project static validation (40%)
    onProgress({
      status: 'validating_project',
      progress: 40,
      currentStep: 'Validating project structure...',
      message: 'Validating generated files and configurations'
    });

    console.log(`[VALIDATOR] Validating project structure...`);
    const projectValidation = await validateGeneratedProject(buildDir);
    if (!projectValidation.valid) {
      throw new Error(`Project validation failed:\n${projectValidation.errors.join('\n')}`);
    }

    // Stage 3: Create ZIP archive (60%)
    onProgress({
      status: 'creating_zip',
      progress: 60,
      currentStep: 'Creating ZIP archive...',
      message: 'Packaging project into ZIP'
    });

    console.log(`[ZIP] Creating archive...`);
    const zipDir = path.resolve(getWorkspaceRoot(), 'tmp', 'builds', buildId);
    const zipPath = path.join(zipDir, `${projectName}.zip`);
    const zipResult = await this.packager.packageDirectory(buildDir, zipPath, projectName);
    console.log(`[ZIP] Archive created: ${zipResult.size} bytes`);

    // Stage 4: Validate ZIP archive (70%)
    onProgress({
      status: 'validating_zip',
      progress: 70,
      currentStep: 'Validating ZIP archive...',
      message: 'Checking magic bytes and central directory'
    });

    console.log(`[ZIP] Validating archive...`);
    const zipValidation = await validateZipArchive(zipPath, projectName);
    if (!zipValidation.valid) {
      throw new Error(`ZIP validation failed:\n${zipValidation.errors.join('\n')}`);
    }

    // Stage 5: Test ZIP extraction (80%)
    onProgress({
      status: 'testing_extraction',
      progress: 80,
      currentStep: 'Testing ZIP extraction...',
      message: 'Testing extraction with system archive engine'
    });

    console.log(`[ZIP] Testing extraction...`);
    const extractionValidation = await testZipExtraction(zipPath, buildId, projectName);
    if (!extractionValidation.valid) {
      throw new Error(`Extraction validation failed:\n${extractionValidation.errors.join('\n')}`);
    }

    // Stage 6: Testing generated project (Client build + Server syntax) (90%)
    onProgress({
      status: 'testing_project',
      progress: 90,
      currentStep: 'Testing generated project...',
      message: 'Running client build and server syntax checks'
    });

    console.log(`[TEST] Running client build test...`);
    const clientBuildRes = await testClientBuild(extractionValidation.extractedProjectDir);
    if (!clientBuildRes.valid) {
      throw new Error(`Client build test failed:\n${clientBuildRes.errors.join('\n')}`);
    }
    console.log(`[TEST] Client build passed!`);

    console.log(`[TEST] Validating server configuration...`);
    const serverValRes = await testServerValidation(extractionValidation.extractedProjectDir);
    if (!serverValRes.valid) {
      throw new Error(`Server validation failed:\n${serverValRes.errors.join('\n')}`);
    }
    console.log(`[TEST] Server validation passed!`);

    // Final artifact validation
    const masterValidation = await validateBuildArtifact({
      buildId,
      buildDir,
      zipPath,
      projectName
    });
    if (!masterValidation.valid) {
      throw new Error(`Final artifact validation failed:\n${masterValidation.errors.join('\n')}`);
    }

    // Stage 7: Completed (100%)
    onProgress({
      status: 'completed',
      progress: 100,
      currentStep: 'Generation Complete',
      message: 'Project assembled, validated, and ready for download'
    });

    console.log(`[BUILD] Completed successfully for ${buildId}`);

    return {
      success: true,
      buildId,
      projectName,
      buildDir,
      zipPath,
      files,
      zip: {
        filename: `${projectName}.zip`,
        size: zipResult.size,
        buffer: zipResult.buffer,
        path: zipPath
      },
      validation: {
        projectValid: true,
        zipValid: true,
        extractionValid: true,
        clientBuildValid: true,
        serverValid: true,
        fileCount
      },
      summary: {
        projectName,
        filesCount: fileCount,
        modulesCount: (projectConfig.selectedModules || projectConfig.modules || []).length,
        size: zipResult.size
      }
    };
  }

  /**
   * Validates generated file tree
   * @param {Record<string, string>} files 
   */
  validate(files) {
    return OutputValidator.validate(files);
  }

  /**
   * Packages project into downloadable ZIP
   * @param {Record<string, string>} files 
   * @param {string} projectName 
   */
  async packageZip(files, projectName) {
    return this.packager.package(files, projectName);
  }
}

// Default export of singleton or factory
export const createGenerator = (options) => new GeneratorEngine(options);
export async function generateMernProject(projectConfig, options) {
  const engine = new GeneratorEngine();
  return engine.generate(projectConfig, options);
}
export default GeneratorEngine;
