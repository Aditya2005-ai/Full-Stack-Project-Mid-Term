/**
 * Generator Foundation Verification Test
 */

import { GeneratorEngine, createGenerator } from '../index.js';
import fs from 'fs/promises';

console.log('🧪 Testing Generator Engine initialization...');

try {
  const engine = createGenerator();
  const modules = engine.getAvailableModules();

  if (!Array.isArray(modules) || modules.length === 0) {
    throw new Error('Module catalogue is empty or invalid');
  }

  const resolution = engine.resolveDependencies(['cart']);
  if (!resolution || !resolution.isValid) {
    throw new Error('Dependency resolution interface failed');
  }

  console.log(`✅ Generator Engine initialized successfully with ${modules.length} catalogue modules.`);

  console.log('🧪 Testing MERN Project Generation & ZIP Packaging...');
  const genResult = await engine.generate({
    name: 'Test Store',
    currency: 'INR',
    theme: '#2383E2',
    selectedModules: ['products', 'payments', 'reviews'],
    productsConfig: {
      categories: ['Electronics', 'Clothing']
    }
  });

  if (!genResult.success) {
    throw new Error('Generation failed');
  }

  if (!genResult.files || Object.keys(genResult.files).length < 15) {
    throw new Error(`Insufficient files generated: ${Object.keys(genResult.files).length}`);
  }

  if (!genResult.zip || genResult.zip.size === 0) {
    throw new Error('ZIP packaging failed or produced empty buffer');
  }

  if (genResult.zip.filePath) {
    await fs.access(genResult.zip.filePath);
  } else if (!genResult.zip.buffer) {
    throw new Error('ZIP packaging output is missing both filePath and buffer');
  }

  console.log(`✅ Generated ${Object.keys(genResult.files).length} files, packaged into ${genResult.zip.size} bytes ZIP.`);
  process.exit(0);
} catch (error) {
  console.error('❌ Generator Engine test failed:', error);
  process.exit(1);
}
