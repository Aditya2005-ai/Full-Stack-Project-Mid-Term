import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarOpen: false,
  activeModal: null,
  toast: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  setToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null })
}));
