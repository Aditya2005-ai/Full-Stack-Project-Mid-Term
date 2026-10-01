/**
 * Architecture & Foundation Automated Verification Script
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🚀 Autonomous MERN E-Commerce Code Generator');
console.log('🛡️ Phase 01 System Foundation Verification');
console.log('====================================================\n');

let passed = true;

const checkDir = (relativeDir) => {
  const fullPath = path.join(rootDir, relativeDir);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ Directory exists: ${relativeDir}`);
  } else {
    console.error(`❌ Directory missing: ${relativeDir}`);
    passed = false;
  }
};

const checkFile = (relativeFile) => {
  const fullPath = path.join(rootDir, relativeFile);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ File exists: ${relativeFile}`);
  } else {
    console.error(`❌ File missing: ${relativeFile}`);
    passed = false;
  }
};

console.log('1. Checking Monorepo Architecture Directories...');
['client', 'server', 'generator', 'shared', 'docs', 'scripts', '.github'].forEach(checkDir);

console.log('\n2. Checking Core Architecture Boundaries...');
[
  'package.json',
  '.gitignore',
  'README.md',
  'shared/constants/modules.js',
  'shared/constants/buildStatus.js',
  'generator/index.js',
  'server/src/app.js',
  'server/src/server.js',
  'client/src/App.jsx',
  'client/src/routes/AppRoutes.jsx',
  'docs/architecture.md',
  'docs/team-ownership.md',
  'docs/git-workflow.md'
].forEach(checkFile);

console.log('\n3. Verifying Generator Engine (Decoupled)...');
try {
  const { createGenerator } = await import('../generator/index.js');
  const engine = createGenerator();
  const mods = engine.getAvailableModules();
  if (mods.length === 6) {
    console.log(`✅ Generator Engine correctly initialized with ${mods.length} modules (3 Core + 3 Optional).`);
  } else {
    console.error(`❌ Unexpected module count: ${mods.length}`);
    passed = false;
  }
} catch (err) {
  console.error('❌ Generator Engine import failed:', err.message);
  passed = false;
}

console.log('\n4. Verifying Server App & Health Endpoint...');
try {
  const { default: app } = await import('../server/src/app.js');
  const server = app.listen(0);
  const port = server.address().port;

  await new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.success === true && json.message === 'API is running') {
            console.log('✅ Server /api/health returned 200 OK:', json);
            server.close(() => resolve());
          } else {
            console.error('❌ Server health check returned unexpected body:', json);
            server.close(() => reject(new Error('Invalid health response')));
          }
        } catch (e) {
          server.close(() => reject(e));
        }
      });
    }).on('error', (e) => {
      server.close(() => reject(e));
    });
  });
} catch (err) {
  console.error('❌ Server verification failed:', err.message);
  passed = false;
}

console.log('\n====================================================');
if (passed) {
  console.log('🎉 ALL PHASE 01 FOUNDATION CHECKS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('⚠️ SOME CHECKS FAILED. PLEASE REVIEW LOGS.');
  process.exit(1);
}
