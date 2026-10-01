import { create } from 'zustand';
import { storage } from '../utils/storage.js';
import { authService } from '../services/authService.js';

const initialUser = storage.getUser();
const initialToken = storage.getToken();

export const useAuthStore = create((set, get) => ({
  user: initialUser || null,
  token: initialToken || null,
  isAuthenticated: !!(initialUser && initialToken),
  loading: false,
  error: null,

  setUser: (user) => {
    storage.setUser(user);
    set({ user, isAuthenticated: !!user });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const data = response?.data || response;
      const user = data.user || {
        id: 'u-1',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'USER'
      };
      const token = data.token || `jwt_${Date.now()}`;

      storage.setUser(user);
      storage.setToken(token);

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      return { success: true, user };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(userData);
      const data = response?.data || response;
      const user = data.user || {
        id: `u-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: 'USER'
      };
      const token = data.token || `jwt_${Date.now()}`;

      storage.setUser(user);
      storage.setToken(token);

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      return { success: true, user };
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    storage.removeToken();
    storage.removeUser();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  }
}));
