import axios from 'axios';
import { storage } from '../utils/storage.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response handling conforming to PPT error/data format
api.interceptors.response.use(
  (response) => {
    // Return either data directly or the whole body
    return response.data;
  },
  (error) => {
    const errBody = error.response?.data?.error;
    const customError = {
      message: errBody?.message || error.response?.data?.message || error.message || 'An unexpected error occurred',
      code: errBody?.code || 'SERVER_ERROR',
      status: error.response?.status,
      details: errBody?.details || []
    };
    return Promise.reject(customError);
  }
);

export default api;
