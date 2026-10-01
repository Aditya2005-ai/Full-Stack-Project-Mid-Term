/**
 * Build Management Service
 * Owned by Developer 4
 * Conforms to Problem Statement 06 (Page 8-10)
 */

import { createGenerator } from '../../../generator/index.js';
import { Build } from '../models/Build.js';

export class BuildService {
  constructor() {
    this.generator = createGenerator();
  }

  async createBuild(buildData, userId) {
    const build = {
      id: `bld-${Date.now().toString(36)}`,
      name: buildData.name || buildData.projectName || 'My E-Commerce Store',
      store: {
        currency: buildData.currency || buildData.store?.currency || 'INR',
        theme: buildData.theme || buildData.store?.theme || '#6366F1',
        logoUrl: buildData.logoUrl || buildData.store?.logoUrl || '',
        description: buildData.description || buildData.store?.description || ''
      },
      modules: buildData.modules || ['products', 'cart'],
      options: buildData.options || {},
      ownerId: userId || 'demo-user',
      createdAt: new Date().toISOString()
    };
    return build;
  }

  async getBuildById(buildId) {
    return {
      id: buildId,
      name: 'Bloom Boutique',
      store: {
        currency: 'INR',
        theme: '#6366F1',
        logoUrl: '',
        description: 'Boutique floral store'
      },
      modules: ['auth', 'products', 'cart', 'orders', 'payments'],
      options: {
        products: { variants: true, categories: true },
        payments: { provider: 'razorpay' }
      },
      status: 'completed',
      createdAt: new Date().toISOString()
    };
  }

  async getUserBuilds(userId) {
    return [
      {
        id: 'bld-001',
        name: 'Bloom Boutique',
        store: { currency: 'INR', theme: '#6366F1', logoUrl: '' },
        modules: ['auth', 'products', 'cart', 'orders', 'payments'],
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'bld-002',
        name: 'Gadget Express',
        store: { currency: 'USD', theme: '#14B8A6', logoUrl: '' },
        modules: ['products', 'cart', 'reviews', 'search'],
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ];
  }

  async updateBuild(buildId, updateData) {
    return {
      id: buildId,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
  }

  async duplicateBuild(buildId) {
    const original = await this.getBuildById(buildId);
    return {
      ...original,
      id: `bld-${Date.now().toString(36)}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
  }

  async deleteBuild(buildId) {
    return { id: buildId, deleted: true };
  }

  async resolveBuildModules(modules = [], options = {}) {
    return this.generator.resolveDependencies(modules, options);
  }
}

export const buildService = new BuildService();
