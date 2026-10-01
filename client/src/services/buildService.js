import api from './api.js';

export const buildService = {
  createBuild: async (buildData) => {
    return api.post('/builds', buildData);
  },

  getUserBuilds: async () => {
    return api.get('/builds');
  },

  getBuildById: async (id) => {
    return api.get(`/builds/${id}`);
  },

  triggerBuildGeneration: async (buildId, config = {}) => {
    return api.post(`/builds/${buildId}/generate`, config);
  },

  getBuildStatus: async (buildId) => {
    return api.get(`/builds/${buildId}/status`);
  },

  getDownloadUrl: (buildId) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    return `${baseURL}/builds/${buildId}/download`;
  }
};

export default buildService;
