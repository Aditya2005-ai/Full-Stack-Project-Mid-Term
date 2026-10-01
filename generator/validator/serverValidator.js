import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Validates that the extracted server code passes syntax and startup readiness validation
 * Conforms to Phase 29 specifications
 */
export async function testServerValidation(extractedProjectDir) {
  const errors = [];
  const serverDir = path.join(extractedProjectDir, 'server');

  if (!fs.existsSync(serverDir)) {
    return {
      valid: false,
      errors: ['Server directory not found in extracted project']
    };
  }

  // Validate server/package.json
  const pkgPath = path.join(serverDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    errors.push('server/package.json is missing');
  } else {
    try {
      const raw = await fs.promises.readFile(pkgPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (!parsed.dependencies?.express) {
        errors.push('server/package.json is missing express dependency');
      }
    } catch (e) {
      errors.push(`server/package.json is invalid JSON: ${e.message}`);
    }
  }

  // Validate server/src/server.js syntax
  const serverJsPath = path.join(serverDir, 'src', 'server.js');
  if (!fs.existsSync(serverJsPath)) {
    errors.push('server/src/server.js is missing');
  } else {
    try {
      await execAsync(`node --check "${serverJsPath}"`);
    } catch (syntaxErr) {
      errors.push(`server/src/server.js syntax check failed: ${syntaxErr.message}`);
    }
  }

  // Validate core routes syntax
  const routesDir = path.join(serverDir, 'src', 'routes');
  if (fs.existsSync(routesDir)) {
    const routeFiles = await fs.promises.readdir(routesDir);
    for (const rf of routeFiles) {
      if (rf.endsWith('.js')) {
        try {
          await execAsync(`node --check "${path.join(routesDir, rf)}"`);
        } catch (rErr) {
          errors.push(`Syntax error in route ${rf}: ${rErr.message}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
