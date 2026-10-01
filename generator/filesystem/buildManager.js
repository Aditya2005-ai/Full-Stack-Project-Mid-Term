import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Finds the workspace root directory reliably, regardless of current working directory
 */
export function getWorkspaceRoot() {
  let curr = __dirname;
  while (curr && curr !== path.dirname(curr)) {
    const pkgPath = path.join(curr, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.name === 'autonomous-mern-ecommerce-code-generator') {
          return curr;
        }
      } catch {}
    }
    curr = path.dirname(curr);
  }
  return path.resolve(__dirname, '..', '..');
}

/**
 * Sanitizes project name to be filesystem-safe and Windows-safe.
 * Removes invalid Windows characters: / \ : * ? " < > |
 * Prevents path traversal (e.g., ../, ..\)
 * Converts "Bloom Boutique" to "bloom-boutique"
 */
export function sanitizeProjectName(name) {
  if (!name || typeof name !== 'string') {
    return 'bloom-boutique';
  }

  let sanitized = name
    .toLowerCase()
    .trim()
    // Replace backslashes, slashes, and forbidden Windows characters with hyphen
    .replace(/[\\/:*?"<>|]+/g, '-')
    // Replace whitespace and underscores with hyphen
    .replace(/[\s_]+/g, '-')
    // Replace non-alphanumeric (except hyphen)
    .replace(/[^a-z0-9-]/g, '-')
    // Deduplicate consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens and dots
    .replace(/^[-.]+|[-.]+$/g, '');

  if (!sanitized || sanitized.length === 0) {
    return 'bloom-boutique';
  }

  // Prevent path traversal keywords
  if (sanitized === '..' || sanitized === '.') {
    return 'bloom-boutique';
  }

  return sanitized;
}

/**
 * Creates and returns a unique build directory path for a build
 */
export function getBuildDirectory(buildId, projectName) {
  const safeName = sanitizeProjectName(projectName);
  const safeBuildId = String(buildId).replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.resolve(getWorkspaceRoot(), 'tmp', 'builds', safeBuildId, safeName);
}

/**
 * Writes all generated files to physical disk in the target directory
 * Verifies every file exists and is readable
 */
export async function writeProjectFiles(targetDirectory, files) {
  if (!files || Object.keys(files).length === 0) {
    throw new Error('No files provided for generation');
  }

  await fs.promises.mkdir(targetDirectory, { recursive: true });

  const writtenFiles = [];

  for (const [relPath, content] of Object.entries(files)) {
    // Normalize path separators to forward slash, then join
    const normalizedRelPath = relPath.replace(/\\/g, '/');
    
    // Prevent path traversal
    if (normalizedRelPath.includes('..')) {
      throw new Error(`Path traversal attempt detected in filename: ${relPath}`);
    }

    const fullPath = path.join(targetDirectory, normalizedRelPath);

    // Verify fullPath is strictly inside targetDirectory
    const resolvedFullPath = path.resolve(fullPath);
    if (!resolvedFullPath.startsWith(path.resolve(targetDirectory))) {
      throw new Error(`Invalid destination path escaping build directory: ${relPath}`);
    }

    // Ensure parent directory exists
    const parentDir = path.dirname(resolvedFullPath);
    await fs.promises.mkdir(parentDir, { recursive: true });

    // Write file
    const fileContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    await fs.promises.writeFile(resolvedFullPath, fileContent, 'utf8');

    // Verify file exists on disk and is readable
    const stat = await fs.promises.stat(resolvedFullPath);
    if (!stat.isFile()) {
      throw new Error(`File verification failed - not a regular file: ${relPath}`);
    }

    writtenFiles.push({
      path: relPath,
      fullPath: resolvedFullPath,
      size: stat.size
    });
  }

  return {
    fileCount: writtenFiles.length,
    files: writtenFiles,
    directory: targetDirectory
  };
}

/**
 * Recursively counts files in a directory
 */
export async function countDirectoryFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  let count = 0;
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      count += await countDirectoryFiles(full);
    } else if (entry.isFile()) {
      count++;
    }
  }
  return count;
}
