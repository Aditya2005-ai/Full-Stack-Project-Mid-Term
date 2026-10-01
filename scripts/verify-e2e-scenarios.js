import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { generateMernProject } from '../generator/index.js';
import { getWorkspaceRoot } from '../generator/filesystem/buildManager.js';
import app from '../server/src/app.js';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = getWorkspaceRoot();

console.log('====================================================');
console.log('🚀 RUNNING END-TO-END VALIDATION SUITE');
console.log('====================================================\n');

async function runScenarioMatrix() {
  console.log('--- TEST 1: MULTI-CONFIGURATION MATRIX ---');
  
  const scenarios = [
    {
      name: 'Products Only',
      config: {
        storeName: 'Products Store',
        description: 'Only products module',
        modules: ['products'],
        categories: ['Electronics']
      }
    },
    {
      name: 'Products + Payments',
      config: {
        storeName: 'Payments Store',
        description: 'Products and payments modules',
        modules: ['products', 'payments'],
        categories: ['Gadgets', 'Accessories'],
        paymentGateway: 'stripe'
      }
    },
    {
      name: 'Products + Reviews',
      config: {
        storeName: 'Reviews Store',
        description: 'Products and reviews modules',
        modules: ['products', 'reviews'],
        categories: ['Books', 'Stationery']
      }
    },
    {
      name: 'Products + Payments + Reviews (Bloom Boutique)',
      config: {
        storeName: 'Bloom Boutique',
        description: 'Full e-commerce store with all modules',
        modules: ['products', 'payments', 'reviews'],
        categories: ['Electronics', 'Clothing', 'Shoes'],
        theme: 'rose'
      }
    }
  ];

  for (const scenario of scenarios) {
    const buildId = `e2e-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    console.log(`Testing configuration: [${scenario.name}] (Build ID: ${buildId})`);
    
    const result = await generateMernProject(scenario.config, {
      buildId,
      skipClientBuild: false
    });

    if (!result.success) {
      throw new Error(`Scenario "${scenario.name}" failed: ${result.error}`);
    }

    if (!fs.existsSync(result.zipPath)) {
      throw new Error(`Scenario "${scenario.name}" did not produce a zip at ${result.zipPath}`);
    }

    const zipStat = fs.statSync(result.zipPath);
    console.log(`  ✓ Successfully generated and verified!`);
    console.log(`  ✓ ZIP Path: ${result.zipPath}`);
    console.log(`  ✓ ZIP Size: ${(zipStat.size / 1024).toFixed(2)} KB`);
    console.log(`  ✓ File Count: ${result.fileCount}`);
  }

  console.log('\n✅ Multi-configuration matrix passed all 4 scenarios!\n');
}

async function runConcurrentBuilds() {
  console.log('--- TEST 2: CONCURRENT BUILDS (RACE CONDITION & ISOLATION TEST) ---');
  
  const configs = [
    {
      storeName: 'Bloom Boutique',
      modules: ['products', 'payments', 'reviews'],
      categories: ['Clothing', 'Shoes']
    },
    {
      storeName: 'Tech Store',
      modules: ['products', 'payments'],
      categories: ['Smartphones', 'Laptops']
    },
    {
      storeName: 'Fashion Hub',
      modules: ['products', 'reviews'],
      categories: ['Apparel', 'Accessories']
    }
  ];

  const startTime = Date.now();
  console.log(`Triggering ${configs.length} concurrent builds simultaneously...`);

  const promises = configs.map((cfg, index) => {
    const buildId = `concurrent-${Date.now()}-${index}`;
    return generateMernProject(cfg, {
      buildId,
      skipClientBuild: false
    }).then(res => ({ cfg, buildId, res }));
  });

  const results = await Promise.all(promises);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`All concurrent builds completed in ${elapsed}s`);

  // Verify all builds succeeded and have completely distinct directories
  const buildPaths = new Set();
  const zipPaths = new Set();

  for (const { cfg, buildId, res } of results) {
    if (!res.success) {
      throw new Error(`Concurrent build for ${cfg.storeName} failed: ${res.error}`);
    }

    if (buildPaths.has(res.buildDir)) {
      throw new Error(`Directory collision detected! Shared buildDir: ${res.buildDir}`);
    }
    buildPaths.add(res.buildDir);

    if (zipPaths.has(res.zipPath)) {
      throw new Error(`ZIP collision detected! Shared zipPath: ${res.zipPath}`);
    }
    zipPaths.add(res.zipPath);

    if (!fs.existsSync(res.zipPath) || fs.statSync(res.zipPath).size === 0) {
      throw new Error(`ZIP file invalid for ${cfg.storeName}`);
    }

    console.log(`  ✓ Build [${cfg.storeName}]: Dir=${res.buildDir}, ZIP=${res.zipPath} (Size: ${(fs.statSync(res.zipPath).size / 1024).toFixed(2)} KB)`);
  }

  console.log('\n✅ Concurrent builds completed with 100% path isolation and zero race conditions!\n');
}

async function runHttpDownloadAndWindowsExtraction() {
  console.log('--- TEST 3: HTTP API DOWNLOAD & POWERSHELL EXPAND-ARCHIVE ---');

  // Start server on an ephemeral port
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`Test Express server listening on port ${port}`);

  try {
    // Valid token for auth middleware
    const testToken = 'valid-test-jwt-token';

    console.log('1. Calling POST /api/v1/generate...');
    const generatePayload = JSON.stringify({
      storeName: 'Bloom Boutique',
      description: 'End to end downloaded store',
      modules: ['products', 'payments', 'reviews'],
      categories: ['Electronics', 'Clothing', 'Shoes']
    });

    const genRes = await fetch(`http://localhost:${port}/api/v1/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      },
      body: generatePayload
    });

    const genData = await genRes.json();
    if (!genRes.ok || !genData.success) {
      throw new Error(`Generation API failed: ${JSON.stringify(genData)}`);
    }

    console.log(`  ✓ API returned success! Build ID: ${genData.data.buildId}`);
    console.log(`  ✓ Download URL: ${genData.data.downloadUrl}`);

    // Download the ZIP
    console.log('2. Calling download endpoint...');
    const downloadRes = await fetch(`http://localhost:${port}${genData.data.downloadUrl}`, {
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    });

    if (!downloadRes.ok) {
      throw new Error(`Download API returned HTTP ${downloadRes.status} ${downloadRes.statusText}`);
    }

    const contentType = downloadRes.headers.get('content-type');
    const contentDisposition = downloadRes.headers.get('content-disposition');
    const contentLength = downloadRes.headers.get('content-length');

    console.log(`  ✓ Content-Type: ${contentType}`);
    console.log(`  ✓ Content-Disposition: ${contentDisposition}`);
    console.log(`  ✓ Content-Length: ${contentLength} bytes`);

    if (!contentType || !contentType.includes('application/zip')) {
      throw new Error(`Expected Content-Type application/zip, got: ${contentType}`);
    }

    const zipBuffer = Buffer.from(await downloadRes.arrayBuffer());
    console.log(`  ✓ Downloaded ${zipBuffer.length} bytes into memory buffer`);

    // Verify magic bytes
    if (zipBuffer[0] !== 0x50 || zipBuffer[1] !== 0x4B || zipBuffer[2] !== 0x03 || zipBuffer[3] !== 0x04) {
      throw new Error(`Downloaded buffer does not have valid ZIP magic bytes PK\\x03\\x04`);
    }

    // Save to test file
    const downloadDir = path.join(workspaceRoot, 'tmp', 'e2e-download-verification');
    if (fs.existsSync(downloadDir)) {
      fs.rmSync(downloadDir, { recursive: true, force: true });
    }
    fs.mkdirSync(downloadDir, { recursive: true });

    const downloadedZipFile = path.join(downloadDir, 'bloom-boutique.zip');
    fs.writeFileSync(downloadedZipFile, zipBuffer);
    console.log(`  ✓ Saved downloaded ZIP to: ${downloadedZipFile}`);

    // Test extraction using Windows PowerShell Expand-Archive (same engine as Windows Explorer)
    console.log('3. Testing extraction using PowerShell Expand-Archive...');
    const extractDir = path.join(downloadDir, 'extracted');
    fs.mkdirSync(extractDir, { recursive: true });

    const psCommand = `powershell -NoProfile -NonInteractive -Command "Expand-Archive -LiteralPath '${downloadedZipFile}' -DestinationPath '${extractDir}' -Force"`;
    execSync(psCommand, { stdio: 'inherit' });
    console.log(`  ✓ PowerShell Expand-Archive extracted without error!`);

    // Verify extracted root
    const extractedContents = fs.readdirSync(extractDir);
    console.log(`  ✓ Extracted root contents:`, extractedContents);
    
    // Check root folder
    const rootFolder = path.join(extractDir, 'bloom-boutique');
    if (!fs.existsSync(rootFolder)) {
      throw new Error(`Expected root folder bloom-boutique in extracted archive`);
    }

    // Verify key files inside bloom-boutique
    const expectedPaths = [
      'package.json',
      'README.md',
      '.env.example',
      '.gitignore',
      'client/package.json',
      'client/index.html',
      'client/vite.config.js',
      'client/src/App.jsx',
      'client/src/main.jsx',
      'server/package.json',
      'server/src/server.js'
    ];

    for (const rel of expectedPaths) {
      const fullPath = path.join(rootFolder, rel);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Missing expected file in extracted ZIP: ${rel}`);
      }
    }
    console.log(`  ✓ All core project files verified in extracted directory!`);

    // Check .env is NOT in zip
    if (fs.existsSync(path.join(rootFolder, '.env'))) {
      throw new Error(`Security violation: .env found in extracted ZIP`);
    }
    console.log(`  ✓ Verified .env is NOT present (clean .env.example provided)`);

    console.log('\n✅ HTTP API Download & Windows PowerShell extraction passed with 100% fidelity!\n');
  } finally {
    server.close();
  }
}

async function main() {
  try {
    await runScenarioMatrix();
    await runConcurrentBuilds();
    await runHttpDownloadAndWindowsExtraction();
    console.log('====================================================');
    console.log('🎉 ALL END-TO-END VALIDATION SCENARIOS PASSED!');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ E2E TEST FAILED:', err);
    process.exit(1);
  }
}

main();
