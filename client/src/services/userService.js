import api from './api.js';

export const userService = {
  getProfile: async (id) => {
    return api.get(`/users/${id}`);
  },

  updateProfile: async (id, data) => {
    return api.put(`/users/${id}`, data);
  }
};
