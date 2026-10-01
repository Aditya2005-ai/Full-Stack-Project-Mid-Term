/**
 * ZIP Packaging Interface
 * Packages generated files into a downloadable archive
 * Phase 01: Architectural interface skeleton
 */

import { createRequire } from 'module';
import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';

const require = createRequire(import.meta.url);
const archiverPkg = require('archiver');

function createZipArchive(options = { zlib: { level: 9 } }) {
  if (archiverPkg.ZipArchive) {
    return new archiverPkg.ZipArchive(options);
  }
  if (typeof archiverPkg === 'function') {
    return archiverPkg('zip', options);
  }
  if (typeof archiverPkg.create === 'function') {
    return archiverPkg.create('zip', options);
  }
  throw new Error('Unsupported archiver module structure');
}

function sanitizeProjectName(projectName) {
  return (projectName || 'mern-ecommerce')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'mern-ecommerce';
}

export class ZipPackager {
  /**
   * Packages file tree into a ZIP archive on disk.
   * @param {Record<string, string>} files
   * @param {string} projectName
   * @param {{ outputDir?: string }} options
   * @returns {Promise<{ filename: string, size: number, filePath: string, outputDir: string }>}
   */
  async package(files, projectName = 'mern-ecommerce', options = {}) {
    const safeProjectName = sanitizeProjectName(projectName);
    const outputDir = options.outputDir || await fs.mkdtemp(path.join(tmpdir(), 'mern-zip-'));
    await fs.mkdir(outputDir, { recursive: true });

    const filename = `${safeProjectName}.zip`;
    const filePath = path.join(outputDir, filename);

    const archive = createZipArchive({ zlib: { level: 9 } });
    const output = createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn('ZIP packager warning:', err.message);
          return;
        }
        reject(err);
      });
      archive.on('error', reject);

      archive.pipe(output);

      for (const [filePathEntry, content] of Object.entries(files)) {
        archive.append(content, { name: filePathEntry });
      }

      archive.finalize();
    });

    const stats = await fs.stat(filePath);

    return {
      filename,
      size: stats.size,
      filePath,
      outputDir
    };
  }
}
