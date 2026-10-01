import api from './api.js';

export const moduleService = {
  getModules: async () => {
    return api.get('/modules');
  },

  getModuleById: async (id) => {
    return api.get(`/modules/${id}`);
  }
};
