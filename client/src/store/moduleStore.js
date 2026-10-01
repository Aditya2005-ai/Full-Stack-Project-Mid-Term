import { create } from 'zustand';

export const useModuleStore = create((set) => ({
  modules: [],
  loading: false,
  error: null,
  search: '',
  filters: {
    category: 'all'
  },

  setModules: (modules) => set({ modules }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearch: (search) => set({ search }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } }))
}));
