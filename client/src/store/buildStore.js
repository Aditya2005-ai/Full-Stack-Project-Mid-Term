import { create } from 'zustand';

export const useBuildStore = create((set) => ({
  builds: [],
  currentBuild: null,
  loading: false,
  error: null,

  setBuilds: (builds) => set({ builds }),
  setCurrentBuild: (currentBuild) => set({ currentBuild }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));
