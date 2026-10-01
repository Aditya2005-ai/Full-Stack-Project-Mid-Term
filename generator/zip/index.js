/**
 * ZIP Packaging Interface
 * Packages generated files into a downloadable archive
 * Phase 01: Architectural interface skeleton
 */

import { createRequire } from 'module';
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
   * Packages file tree into a buffer
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
        archive.append(content, { name: filePath });
      }

      archive.finalize();
    });
  }
}

