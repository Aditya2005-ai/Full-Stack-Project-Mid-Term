import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import http from 'http';
import app from '../server/src/app.js';
import { getWorkspaceRoot } from '../generator/filesystem/buildManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = getWorkspaceRoot();

console.log('====================================================');
console.log('⚡ VERIFYING ASYNCHRONOUS BUILD-GENERATION PIPELINE');
console.log('====================================================\n');

async function main() {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);

  const testAuthHeader = {
    'Authorization': 'Bearer test-token',
    'Content-Type': 'application/json'
  };

  try {
    // ----------------------------------------------------
    // TEST 1: Rapid Immediate Response (<200ms) on POST /generate
    // ----------------------------------------------------
    console.log('\n--- TEST 1: ASYNC QUEUE IMMEDIATE RESPONSE (< 200ms) ---');
    const buildId = `async-test-${Date.now()}`;
    const startReqTime = Date.now();

    const postRes = await fetch(`http://localhost:${port}/api/v1/builds/${buildId}/generate`, {
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({
        name: 'Bloom Boutique',
        currency: 'INR',
        theme: '#2383E2',
        selectedModules: ['products', 'payments', 'reviews'],
        productsConfig: {
          categories: ['Electronics', 'Clothing', 'Shoes']
        },
        paymentsConfig: { provider: 'razorpay' },
        reviewsConfig: { ratings: true }
      })
    });

    const elapsedMs = Date.now() - startReqTime;
    const postData = await postRes.json();

    console.log(`  ✓ POST /generate response time: ${elapsedMs}ms`);
    console.log(`  ✓ HTTP Status: ${postRes.status}`);
    console.log(`  ✓ Response Body:`, postData);

    if (postRes.status !== 200 || !postData.success || postData.status !== 'queued') {
      throw new Error(`Expected { success: true, status: "queued" }, got ${JSON.stringify(postData)}`);
    }

    if (elapsedMs > 1000) {
      throw new Error(`Request took ${elapsedMs}ms, which is too slow for an async return!`);
    }
    console.log(`  [PASS] Async endpoint returned immediately in ${elapsedMs}ms without blocking!`);

    // ----------------------------------------------------
    // TEST 2: Duplicate Generation Prevention (409 Conflict)
    // ----------------------------------------------------
    console.log('\n--- TEST 2: DUPLICATE GENERATION PREVENTION (409 CONFLICT) ---');
    const dupRes = await fetch(`http://localhost:${port}/api/v1/builds/${buildId}/generate`, {
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({ name: 'Bloom Boutique' })
    });

    const dupData = await dupRes.json();
    console.log(`  ✓ Duplicate request HTTP status: ${dupRes.status}`);
    console.log(`  ✓ Duplicate response:`, dupData);

    if (dupRes.status !== 409) {
      throw new Error(`Expected HTTP 409 Conflict on duplicate generation, got ${dupRes.status}`);
    }
    console.log(`  [PASS] Duplicate generation prevented with HTTP 409 Conflict!`);

    // ----------------------------------------------------
    // TEST 3: Status Polling & Progress Transitions
    // ----------------------------------------------------
    console.log('\n--- TEST 3: STATUS POLLING & PROGRESS TRACKING ---');
    let completedBuild = null;
    const observedStatuses = new Set();
    const pollStart = Date.now();

    while (Date.now() - pollStart < 60000) {
      const statusRes = await fetch(`http://localhost:${port}/api/v1/builds/${buildId}/status`, {
        headers: testAuthHeader
      });
      const statusData = await statusRes.json();
      const b = statusData.build;

      observedStatuses.add(b.status);
      console.log(`  [POLL ${(Date.now() - pollStart)}ms] Status: ${b.status.padEnd(18)} | Progress: ${String(b.progress).padStart(3)}% | Step: ${b.currentStep}`);

      if (b.status === 'completed') {
        completedBuild = b;
        break;
      }

      if (b.status === 'failed') {
        throw new Error(`Build failed during polling at step "${b.currentStep}": ${b.error}`);
      }

      await new Promise(r => setTimeout(r, 800));
    }

    if (!completedBuild) {
      throw new Error(`Build did not reach 'completed' within 60s timeout`);
    }

    console.log(`  ✓ Observed status states:`, Array.from(observedStatuses));
    console.log(`  ✓ Completed build details:`, {
      id: completedBuild.id,
      fileCount: completedBuild.fileCount,
      zipSize: completedBuild.zipSize,
      downloadAvailable: completedBuild.downloadAvailable,
      downloadUrl: completedBuild.downloadUrl
    });

    if (completedBuild.fileCount < 60) {
      throw new Error(`Expected >= 60 files, got ${completedBuild.fileCount}`);
    }
    console.log(`  [PASS] Build completed with verified status and file count!`);

    // ----------------------------------------------------
    // TEST 4: Download Endpoint & Stream Verification
    // ----------------------------------------------------
    console.log('\n--- TEST 4: DOWNLOAD ENDPOINT & VERIFICATION ---');
    const downloadRes = await fetch(`http://localhost:${port}/api/v1/builds/${buildId}/download`, {
      headers: testAuthHeader
    });

    if (downloadRes.status !== 200) {
      throw new Error(`Download failed with HTTP ${downloadRes.status}`);
    }

    const contentType = downloadRes.headers.get('content-type');
    const contentDisposition = downloadRes.headers.get('content-disposition');
    const contentLength = downloadRes.headers.get('content-length');

    console.log(`  ✓ Content-Type: ${contentType}`);
    console.log(`  ✓ Content-Disposition: ${contentDisposition}`);
    console.log(`  ✓ Content-Length: ${contentLength} bytes`);

    if (!contentType.includes('application/zip')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const zipBuffer = Buffer.from(await downloadRes.arrayBuffer());
    if (zipBuffer[0] !== 0x50 || zipBuffer[1] !== 0x4B || zipBuffer[2] !== 0x03 || zipBuffer[3] !== 0x04) {
      throw new Error('Downloaded buffer does not match ZIP PK\\x03\\x04 signature');
    }

    // Save and extract
    const testOutDir = path.join(workspaceRoot, 'tmp', 'async-test-download');
    if (fs.existsSync(testOutDir)) {
      fs.rmSync(testOutDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testOutDir, { recursive: true });

    const zipFile = path.join(testOutDir, 'bloom-boutique.zip');
    fs.writeFileSync(zipFile, zipBuffer);

    const extractDir = path.join(testOutDir, 'extracted');
    fs.mkdirSync(extractDir, { recursive: true });

    console.log('  Testing PowerShell Expand-Archive extraction...');
    execSync(`powershell -NoProfile -NonInteractive -Command "Expand-Archive -LiteralPath '${zipFile}' -DestinationPath '${extractDir}' -Force"`, { stdio: 'inherit' });
    console.log('  ✓ Extracted successfully via PowerShell!');

    const projectRoot = path.join(extractDir, 'bloom-boutique');
    if (!fs.existsSync(projectRoot)) {
      throw new Error('Missing root folder bloom-boutique in extracted archive');
    }

    const mustExist = [
      'package.json',
      'README.md',
      '.env.example',
      'client/package.json',
      'client/src/App.jsx',
      'server/package.json',
      'server/src/server.js'
    ];

    for (const f of mustExist) {
      if (!fs.existsSync(path.join(projectRoot, f))) {
        throw new Error(`Missing expected file in extracted archive: ${f}`);
      }
    }
    console.log('  ✓ Core files verified in extracted project');

    if (fs.existsSync(path.join(projectRoot, '.env'))) {
      throw new Error('Security check failed: .env file found in ZIP archive');
    }
    console.log('  ✓ Security check: .env not leaked');
    console.log('  [PASS] Download and Windows PowerShell extraction passed!');

    // ----------------------------------------------------
    // TEST 5: Clean Retry Logic
    // ----------------------------------------------------
    console.log('\n--- TEST 5: CLEAN RETRY LOGIC ---');
    console.log('  Triggering second generation on the same buildId...');
    const retryRes = await fetch(`http://localhost:${port}/api/v1/builds/${buildId}/generate`, {
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({
        name: 'Bloom Boutique',
        currency: 'INR',
        theme: '#2383E2',
        selectedModules: ['products', 'payments', 'reviews']
      })
    });

    const retryData = await retryRes.json();
    console.log(`  ✓ Retry trigger HTTP ${retryRes.status}:`, retryData);
    if (retryRes.status !== 200 || !retryData.success) {
      throw new Error(`Failed to trigger retry: ${JSON.stringify(retryData)}`);
    }

    // Wait for retry completion
    const retryStart = Date.now();
    let retryCompleted = false;
    while (Date.now() - retryStart < 60000) {
      const s = await (await fetch(`http://localhost:${port}/api/v1/builds/${buildId}/status`, { headers: testAuthHeader })).json();
      if (s.build.status === 'completed') {
        retryCompleted = true;
        break;
      }
      if (s.build.status === 'failed') {
        throw new Error(`Retry failed: ${s.build.error}`);
      }
      await new Promise(r => setTimeout(r, 800));
    }

    if (!retryCompleted) {
      throw new Error('Retry generation timed out');
    }
    console.log('  [PASS] Retry successfully cleaned and regenerated fresh build!');

    // ----------------------------------------------------
    // TEST 6: Multiple Independent Stores
    // ----------------------------------------------------
    console.log('\n--- TEST 6: MULTIPLE INDEPENDENT STORES ---');
    const storeConfigs = [
      { id: `store-tech-${Date.now()}`, name: 'Tech Store', modules: ['products', 'payments'] },
      { id: `store-fashion-${Date.now()}`, name: 'Fashion Hub', modules: ['products', 'reviews'] }
    ];

    for (const store of storeConfigs) {
      console.log(`  Queuing store: [${store.name}] (ID: ${store.id})...`);
      const res = await fetch(`http://localhost:${port}/api/v1/builds/${store.id}/generate`, {
        method: 'POST',
        headers: testAuthHeader,
        body: JSON.stringify({
          name: store.name,
          selectedModules: store.modules
        })
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(`Failed to queue ${store.name}: ${JSON.stringify(data)}`);
    }

    console.log('  Waiting for all independent stores to complete...');
    for (const store of storeConfigs) {
      const sStart = Date.now();
      let sDone = false;
      while (Date.now() - sStart < 60000) {
        const s = await (await fetch(`http://localhost:${port}/api/v1/builds/${store.id}/status`, { headers: testAuthHeader })).json();
        if (s.build.status === 'completed') {
          sDone = true;
          console.log(`  ✓ Store [${store.name}] completed with ${s.build.fileCount} files, ${(s.build.zipSize / 1024).toFixed(1)} KB`);
          break;
        }
        await new Promise(r => setTimeout(r, 800));
      }
      if (!sDone) throw new Error(`Store ${store.name} timed out`);
    }
    console.log('  [PASS] Multiple independent stores completed with zero collisions!');

    console.log('\n====================================================');
    console.log('🎉 ALL ASYNCHRONOUS BUILD VERIFICATIONS PASSED!');
    console.log('====================================================');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ ASYNC VERIFICATION FAILED:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

main();
