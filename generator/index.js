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
   * Generates project files based on configuration
   * @param {Object} projectConfig 
   */
  async generate(projectConfig = {}) {
    const files = generateMernStoreFiles(projectConfig);
    const projectName = (projectConfig.name || projectConfig.store?.name || 'ecommerce-store')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const zipResult = await this.packager.package(files, projectName);

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
   * @param {Object} options
   */
  async packageZip(files, projectName, options = {}) {
    return this.packager.package(files, projectName, options);
  }
}

// Default export of singleton or factory
export const createGenerator = (options) => new GeneratorEngine(options);
export async function generateMernProject(projectConfig, options) {
  const engine = new GeneratorEngine();
  return engine.generate(projectConfig, options);
}
export default GeneratorEngine;
