import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getWorkspaceRoot } from '../filesystem/buildManager.js';

const execAsync = promisify(exec);

/**
 * Extracts ZIP into a temporary validation directory and tests extracted files
 * Conforms to Phase 16 & Phase 17 specifications
 */
export async function testZipExtraction(zipPath, buildId, projectName = 'bloom-boutique') {
  const errors = [];
  const safeBuildId = String(buildId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const workspaceRoot = getWorkspaceRoot();
  const extractBaseDir = path.resolve(workspaceRoot, 'tmp', 'zip-validation', safeBuildId);

  // Clean extraction target directory
  if (fs.existsSync(extractBaseDir)) {
    await fs.promises.rm(extractBaseDir, { recursive: true, force: true });
  }
  await fs.promises.mkdir(extractBaseDir, { recursive: true });

  // Extract using PowerShell Expand-Archive (guaranteeing Windows Explorer compatibility)
  try {
    const psCmd = `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractBaseDir}' -Force"`;
    await execAsync(psCmd);
  } catch (psErr) {
    // Fallback to tar if PowerShell encounters an issue
    try {
      await execAsync(`tar -xf "${zipPath}" -C "${extractBaseDir}"`);
    } catch (tarErr) {
      errors.push(`ZIP extraction failed: ${psErr.message} (fallback: ${tarErr.message})`);
      return {
        valid: false,
        extractedProjectDir: null,
        errors
      };
    }
  }

  // Determine extracted project directory
  let extractedProjectDir = path.join(extractBaseDir, projectName);
  if (!fs.existsSync(extractedProjectDir)) {
    if (fs.existsSync(path.join(extractBaseDir, 'package.json'))) {
      extractedProjectDir = extractBaseDir;
    } else {
      const entries = await fs.promises.readdir(extractBaseDir, { withFileTypes: true });
      const dirEntry = entries.find(e => e.isDirectory());
      if (dirEntry) {
        extractedProjectDir = path.join(extractBaseDir, dirEntry.name);
      } else {
        errors.push(`Extracted directory structure not found in: ${extractBaseDir}`);
        return { valid: false, extractedProjectDir: null, errors };
      }
    }
  }

  // Verify critical extracted files exist on physical disk
  const requiredExtracted = [
    'package.json',
    'README.md',
    '.env.example',
    'client/package.json',
    'client/src/App.jsx',
    'client/src/main.jsx',
    'server/package.json',
    'server/src/server.js'
  ];

  for (const rel of requiredExtracted) {
    const full = path.join(extractedProjectDir, rel);
    if (!fs.existsSync(full)) {
      errors.push(`Extracted project is missing expected file: ${rel}`);
    }
  }

  return {
    valid: errors.length === 0,
    extractedProjectDir,
    extractBaseDir,
    errors
  };
}
