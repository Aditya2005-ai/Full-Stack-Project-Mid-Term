import fs from 'fs';
import path from 'path';
import { countDirectoryFiles } from '../filesystem/buildManager.js';

/**
 * Validates the physical generated project directory on disk
 * Conforms to Phase 11 & Phase 12 specifications
 */
export async function validateGeneratedProject(projectPath) {
  const errors = [];

  if (!fs.existsSync(projectPath)) {
    return {
      valid: false,
      fileCount: 0,
      errors: [`Project directory does not exist at: ${projectPath}`]
    };
  }

  // Count files recursively
  const fileCount = await countDirectoryFiles(projectPath);
  if (fileCount === 0) {
    errors.push('Project directory is empty (0 files generated)');
  }

  // Required files definition
  const requiredFiles = [
    // Root
    'package.json',
    'README.md',
    '.env.example',
    '.gitignore',

    // Client
    'client/package.json',
    'client/vite.config.js',
    'client/index.html',
    'client/src/main.jsx',
    'client/src/App.jsx',
    'client/src/pages/Home.jsx',
    'client/src/pages/Products.jsx',
    'client/src/pages/Cart.jsx',

    // Server
    'server/package.json',
    'server/src/server.js',
    'server/src/models/User.js',
    'server/src/models/Product.js',
    'server/src/models/Order.js',
    'server/src/controllers/authController.js',
    'server/src/controllers/productController.js',
    'server/src/controllers/orderController.js',
    'server/src/routes/authRoutes.js',
    'server/src/routes/productRoutes.js',
    'server/src/routes/orderRoutes.js'
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(projectPath, relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required file: ${relPath}`);
      continue;
    }

    try {
      const stats = await fs.promises.stat(fullPath);
      if (stats.size === 0) {
        errors.push(`File is unexpectedly empty (0 bytes): ${relPath}`);
      }

      // Check package.json files for valid JSON syntax
      if (relPath.endsWith('package.json')) {
        const raw = await fs.promises.readFile(fullPath, 'utf8');
        JSON.parse(raw);
      }
    } catch (err) {
      errors.push(`File validation error for ${relPath}: ${err.message}`);
    }
  }

  return {
    valid: errors.length === 0,
    fileCount,
    errors
  };
}
