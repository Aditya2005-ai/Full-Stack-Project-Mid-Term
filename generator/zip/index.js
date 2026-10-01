/**
 * ZIP Packaging Interface
 * Packages generated files into a downloadable archive
 * Ensures Windows compatibility, valid central directory, and strict stream completion
 */

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';

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

export class ZipPackager {
  /**
   * Packages project directory from disk into a ZIP archive on disk
   * @param {string} projectDir - Path to generated project folder on disk
   * @param {string} zipOutputPath - Destination path for .zip file
   * @param {string} rootFolderName - Root folder name inside archive (e.g. 'bloom-boutique')
   * @returns {Promise<{ zipPath: string, filename: string, size: number, buffer: Buffer }>}
   */
  async packageDirectory(projectDir, zipOutputPath, rootFolderName = 'mern-ecommerce') {
    await fs.promises.mkdir(path.dirname(zipOutputPath), { recursive: true });

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipOutputPath);
      const archive = createZipArchive({ zlib: { level: 9 } });

      let closed = false;

      output.on('close', async () => {
        closed = true;
        try {
          const stats = await fs.promises.stat(zipOutputPath);
          const buffer = await fs.promises.readFile(zipOutputPath);
          resolve({
            zipPath: zipOutputPath,
            filename: path.basename(zipOutputPath),
            size: stats.size,
            buffer
          });
        } catch (err) {
          reject(err);
        }
      });

      output.on('error', (err) => reject(err));
      archive.on('error', (err) => reject(err));

      archive.pipe(output);

      // Add entire projectDir contents under rootFolderName/
      // archiver automatically uses forward slashes '/' ensuring Windows Explorer compatibility
      archive.directory(projectDir, rootFolderName);

      archive.finalize();
    });
  }

  /**
   * Packages file tree into a buffer (backward compatibility)
   * @param {Record<string, string>} files 
   * @param {string} projectName 
   * @returns {Promise<{ filename: string, size: number, buffer: Buffer }>}
   */
  async package(files, projectName = 'mern-ecommerce') {
    return new Promise((resolve, reject) => {
      const archive = createZipArchive({ zlib: { level: 9 } });
      const buffers = [];
      const passThrough = new PassThrough();

      passThrough.on('data', (chunk) => buffers.push(chunk));
      passThrough.on('end', () => {
        const buffer = Buffer.concat(buffers);
        resolve({
          filename: `${projectName}.zip`,
          size: buffer.length,
          buffer
        });
      });
      archive.on('error', (err) => reject(err));

      archive.pipe(passThrough);

      for (const [filePath, content] of Object.entries(files)) {
        // Normalize slashes to forward slashes for Windows Explorer compatibility
        const normalizedName = `${projectName}/${filePath.replace(/\\/g, '/')}`;
        archive.append(content, { name: normalizedName });
      }

      archive.finalize();
    });
  }
}
