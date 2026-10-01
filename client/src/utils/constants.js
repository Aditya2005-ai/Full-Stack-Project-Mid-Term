export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const BUILD_STEPS = Object.freeze([
  { id: 1, key: 'store_basics', label: 'Store Basics' },
  { id: 2, key: 'module_selection', label: 'Module Selection' },
  { id: 3, key: 'dependency_resolution', label: 'Dependency Graph' },
  { id: 4, key: 'module_options', label: 'Module Options' },
  { id: 5, key: 'review', label: 'Review & Config' },
  { id: 6, key: 'generate', label: 'Generate & Download' }
]);
