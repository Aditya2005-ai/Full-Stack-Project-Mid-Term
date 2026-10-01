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
  }
};
