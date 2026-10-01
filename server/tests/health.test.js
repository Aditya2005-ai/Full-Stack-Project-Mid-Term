/**
 * Server Health & Resolve Verification Test
 * Conforms to Problem Statement 06 (Page 8-9)
 */

import http from 'http';
import app from '../src/app.js';

console.log('🧪 Testing Server Endpoints (/api/health, /api/v1/health, /api/v1/builds/resolve)...');

const server = app.listen(0, async () => {
  const port = server.address().port;

  const testGet = (path) => new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          if (res.statusCode === 200 && parsed.success === true) {
            resolve(parsed);
          } else {
            reject(new Error(`Endpoint ${path} returned status ${res.statusCode}: ${rawData}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });

  const testPost = (path, body) => new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          if ((res.statusCode === 200 || res.statusCode === 201) && parsed.success === true) {
            resolve(parsed);
          } else {
            reject(new Error(`Endpoint ${path} returned status ${res.statusCode}: ${rawData}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  try {
    const health1 = await testGet('/api/health');
    console.log('✅ /api/health passed:', health1.message);

    const health2 = await testGet('/api/v1/health');
    console.log('✅ /api/v1/health passed:', health2.message);

    const resolveSample = await testPost('/api/v1/builds/resolve', {
      modules: ['products', 'payments', 'reviews'],
      options: {
        products: { variants: true, categories: true },
        payments: { provider: 'razorpay' },
        auth: { strategy: 'jwt' }
      }
    });

    console.log('✅ /api/v1/builds/resolve passed with autoAdded dependencies:');
    console.log('   Resolved:', resolveSample.data.resolved.join(', '));
    console.log('   Auto-added count:', resolveSample.data.autoAdded.length);
    console.log('   Env keys:', resolveSample.data.envKeys.join(', '));

    console.log('🧪 Testing POST /api/v1/generate...');
    const genResult = await testPost('/api/v1/generate', {
      name: 'Server Test Boutique',
      currency: 'INR',
      theme: '#2383E2',
      selectedModules: ['products', 'payments', 'reviews'],
      productsConfig: {
        categories: ['Kurtas', 'Sarees', 'Jewelry']
      },
      paymentsConfig: {
        provider: 'razorpay'
      },
      reviewsConfig: {
        ratingScale: 5
      }
    });

    if (!genResult.data || !genResult.data.downloadToken) {
      throw new Error('Generate endpoint did not return downloadToken');
    }
    console.log(`✅ /api/v1/generate succeeded: token=${genResult.data.downloadToken}, files=${genResult.data.filesCount}`);

    console.log(`🧪 Testing GET /api/v1/download/${genResult.data.downloadToken}...`);
    const downloadBuffer = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/api/v1/download/${genResult.data.downloadToken}`, (res) => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          if (res.statusCode === 200 && res.headers['content-type'] === 'application/zip') {
            resolve(Buffer.concat(chunks));
          } else {
            reject(new Error(`Download failed with status ${res.statusCode}`));
          }
        });
      }).on('error', reject);
    });

    console.log(`✅ /api/v1/download returned valid ZIP archive (${downloadBuffer.length} bytes)`);

    server.close(() => {
      console.log('🎉 All Server tests passed successfully!');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    server.close(() => process.exit(1));
  }
});
