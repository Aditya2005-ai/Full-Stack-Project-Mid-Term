import api from './api.js';

export const generationService = {
  generateProject: async (projectData) => {
    return api.post('/generate', projectData);
  },

  generateProjectAsync: async (projectData) => {
    return api.post('/generate?async=true', projectData);
  },

  getBuildStatus: async (buildId) => {
    return api.get(`/builds/${buildId}/status`);
  },

  getDownloadUrl: (token) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    return `${baseURL}/download/${token}`;
  },

  triggerGeneration: async (buildId, config = {}) => {
    return api.post(`/builds/${buildId}/generate`, config);
  },

  getGenerationLogs: async (buildId) => {
    return api.get(`/generation/${buildId}/logs`);
  }
};

export default generationService;
