import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Validates the generated ZIP archive on disk
 * Conforms to Phase 15 & Phase 17 specifications
 */
export async function validateZipArchive(zipPath, projectName = 'bloom-boutique') {
  const errors = [];

  if (!fs.existsSync(zipPath)) {
    return {
      valid: false,
      size: 0,
      fileCount: 0,
      errors: [`ZIP file does not exist at: ${zipPath}`]
    };
  }

  const stats = await fs.promises.stat(zipPath);
  if (stats.size < 100) {
    errors.push(`ZIP archive is suspiciously small or empty (${stats.size} bytes)`);
  }

  // Verify ZIP magic bytes: 'PK\x03\x04' (0x50, 0x4B, 0x03, 0x04)
  const fd = await fs.promises.open(zipPath, 'r');
  const headerBuf = Buffer.alloc(4);
  await fd.read(headerBuf, 0, 4, 0);
  await fd.close();

  if (headerBuf[0] !== 0x50 || headerBuf[1] !== 0x4b) {
    errors.push('File is not a valid ZIP archive (missing PK header signature)');
  }

  // Enumerate entries via tar or PowerShell
  let entries = [];
  try {
    const { stdout } = await execAsync(`tar -tf "${zipPath}"`);
    entries = stdout.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  } catch (tarErr) {
    try {
      const psCmd = `powershell -NoProfile -Command "$zip = [System.IO.Compression.ZipFile]::OpenRead('${zipPath}'); $zip.Entries | ForEach-Object { $_.FullName }; $zip.Dispose()"`;
      const { stdout } = await execAsync(psCmd);
      entries = stdout.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    } catch (psErr) {
      errors.push(`Failed to enumerate archive entries: ${tarErr.message || psErr.message}`);
    }
  }

  if (entries.length === 0) {
    errors.push('ZIP archive contains 0 readable entries');
  }

  // Verify that required files exist inside archive
  const expectedSubstrings = [
    'package.json',
    'README.md',
    '.env.example',
    'client/package.json',
    'client/src/App.jsx',
    'server/package.json',
    'server/src/server.js'
  ];

  for (const exp of expectedSubstrings) {
    const found = entries.some(e => e.endsWith(exp) || e.includes(`/${exp}`) || e === exp);
    if (!found) {
      errors.push(`Archive missing expected entry: ${exp}`);
    }
  }

  return {
    valid: errors.length === 0,
    size: stats.size,
    fileCount: entries.length,
    errors
  };
}
