import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getWorkspaceRoot } from '../filesystem/buildManager.js';

const execAsync = promisify(exec);

/**
 * Validates that the extracted client can successfully build
 * Conforms to Phase 28 specifications
 */
export async function testClientBuild(extractedProjectDir) {
  const clientDir = path.join(extractedProjectDir, 'client');
  if (!fs.existsSync(clientDir)) {
    return {
      valid: false,
      errors: ['Client directory not found in extracted project']
    };
  }

  const workspaceRoot = getWorkspaceRoot();
  const repoNodeModules = path.resolve(workspaceRoot, 'client', 'node_modules');
  const targetNodeModules = path.join(clientDir, 'node_modules');

  let junctionCreated = false;

  try {
    // If client does not have node_modules, link to existing repo client/node_modules for instant offline build
    if (!fs.existsSync(targetNodeModules) && fs.existsSync(repoNodeModules)) {
      await fs.promises.symlink(repoNodeModules, targetNodeModules, 'junction');
      junctionCreated = true;
    }

    // Locate vite binary
    const viteBin = path.join(repoNodeModules, 'vite', 'bin', 'vite.js');
    if (!fs.existsSync(viteBin)) {
      return {
        valid: false,
        errors: [`Vite CLI binary not found at ${viteBin}`]
      };
    }

    // Execute vite build
    const cmd = `node "${viteBin}" build`;
    await execAsync(cmd, {
      cwd: clientDir,
      timeout: 30000,
      env: { ...process.env, NODE_ENV: 'production' }
    });

    const distIndex = path.join(clientDir, 'dist', 'index.html');
    if (!fs.existsSync(distIndex)) {
      return {
        valid: false,
        errors: ['Client build finished but dist/index.html was not created']
      };
    }

    return {
      valid: true,
      errors: []
    };
  } catch (err) {
    return {
      valid: false,
      errors: [`Client build failed: ${err.message}`]
    };
  } finally {
    // Safely remove junction link
    if (junctionCreated && fs.existsSync(targetNodeModules)) {
      try {
        await fs.promises.unlink(targetNodeModules);
      } catch {
        // Ignore cleanup failure
      }
    }
  }
}
