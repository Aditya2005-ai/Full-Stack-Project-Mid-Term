import { MOCK_MODULES } from './mockModules.js';
import { MOCK_BUILDS } from './mockBuilds.js';

export const mockApi = {
  getModules: async () => ({ success: true, data: MOCK_MODULES }),
  getBuilds: async () => ({ success: true, data: MOCK_BUILDS })
};

export { MOCK_MODULES, MOCK_BUILDS };
