import { create } from 'zustand';

export const useBuilderStore = create((set, get) => ({
  // Step 1: Store Basics
  project: {
    name: 'Bloom Boutique',
    currency: 'INR',
    theme: '#2383E2',
    logoUrl: '',
    description: 'Curated premium organic goods & handcrafted accessories'
  },

  // Core Features (Always enabled in every generated app)
  core: {
    auth: true,
    cart: true,
    orders: true
  },

  // Step 2: Optional Modules (Only products, payments, reviews)
  selectedModules: ['products'],

  // Step 3: Module Options
  productsConfig: {
    categories: ['Electronics', 'Clothing', 'Shoes', 'Accessories'],
    variants: true
  },
  paymentsConfig: {
    provider: 'razorpay',
    mode: 'test'
  },
  reviewsConfig: {
    ratings: true,
    writtenReviews: true,
    requireAuth: true
  },

  // Wizard Navigation
  currentStep: 1,

  // Generation state
  generation: {
    isGenerating: false,
    step: 0, // 0: idle, 1: preparing, 2: resolving, 3: generating, 4: validating, 5: zipping, 6: complete
    downloadToken: null,
    downloadUrl: null,
    error: null
  },

  // Actions
  setProject: (projectUpdates) =>
    set((state) => ({ project: { ...state.project, ...projectUpdates } })),

  setCurrentStep: (step) => set({ currentStep: step }),

  toggleModule: (moduleId) =>
    set((state) => {
      const exists = state.selectedModules.includes(moduleId);
      return {
        selectedModules: exists
          ? state.selectedModules.filter((m) => m !== moduleId)
          : [...state.selectedModules, moduleId]
      };
    }),

  setSelectedModules: (modules) => set({ selectedModules: modules }),

  // Categories actions
  addCategory: (categoryName) =>
    set((state) => {
      const trimmed = categoryName.trim();
      if (!trimmed) return state;
      const lower = trimmed.toLowerCase();
      const current = state.productsConfig.categories;
      if (current.some((c) => c.toLowerCase() === lower)) {
        return state; // prevent duplicate
      }
      return {
        productsConfig: {
          ...state.productsConfig,
          categories: [...current, trimmed]
        }
      };
    }),

  removeCategory: (categoryName) =>
    set((state) => ({
      productsConfig: {
        ...state.productsConfig,
        categories: state.productsConfig.categories.filter((c) => c !== categoryName)
      }
    })),

  setProductsConfig: (updates) =>
    set((state) => ({
      productsConfig: { ...state.productsConfig, ...updates }
    })),

  setPaymentsConfig: (updates) =>
    set((state) => ({
      paymentsConfig: { ...state.paymentsConfig, ...updates }
    })),

  setReviewsConfig: (updates) =>
    set((state) => ({
      reviewsConfig: { ...state.reviewsConfig, ...updates }
    })),

  setGenerationState: (updates) =>
    set((state) => ({
      generation: { ...state.generation, ...updates }
    })),

  resetBuilder: () =>
    set({
      project: {
        name: 'Bloom Boutique',
        currency: 'INR',
        theme: '#2383E2',
        logoUrl: '',
        description: 'Curated premium organic goods & handcrafted accessories'
      },
      selectedModules: ['products'],
      productsConfig: {
        categories: ['Electronics', 'Clothing', 'Shoes', 'Accessories'],
        variants: true
      },
      paymentsConfig: {
        provider: 'razorpay',
        mode: 'test'
      },
      reviewsConfig: {
        ratings: true,
        writtenReviews: true,
        requireAuth: true
      },
      currentStep: 1,
      generation: {
        isGenerating: false,
        step: 0,
        downloadToken: null,
        downloadUrl: null,
        error: null
      }
    })
}));
