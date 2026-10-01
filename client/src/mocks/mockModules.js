/**
 * Client Module Catalogue
 * Core features are built into every app automatically.
 * Only Products, Payments, and Reviews are selectable optional modules.
 */

export const CORE_MODULES = [
  {
    id: 'auth',
    name: 'Authentication',
    description: 'JWT-based auth, login, registration, and protected routes',
    isCore: true
  },
  {
    id: 'cart',
    name: 'Shopping Cart',
    description: 'Persistent cart management, item counters, and subtotals',
    isCore: true
  },
  {
    id: 'orders',
    name: 'Orders & Checkout',
    description: 'Order placement flow, order history, and order tracking',
    isCore: true
  }
];

export const OPTIONAL_MODULES = [
  {
    id: 'products',
    name: 'Products',
    category: 'commerce',
    description: 'Product catalogue, categories management, and product details',
    dependencies: [],
    options: {
      categories: ['Electronics', 'Clothing', 'Shoes', 'Accessories'],
      variants: true
    }
  },
  {
    id: 'payments',
    name: 'Payments',
    category: 'commerce',
    description: 'Accept payments through Razorpay (Test mode)',
    dependencies: ['orders', 'cart', 'products'],
    dependencyNote: 'Payments uses the built-in Cart and Orders system.',
    options: {
      provider: 'razorpay',
      mode: 'test'
    }
  },
  {
    id: 'reviews',
    name: 'Reviews',
    category: 'engagement',
    description: 'Customer ratings and reviews',
    dependencies: ['auth', 'products'],
    dependencyNote: 'Reviews uses the built-in Authentication system.',
    options: {
      ratings: true,
      writtenReviews: true,
      requireAuth: true
    }
  }
];

export const MOCK_MODULES = [...CORE_MODULES, ...OPTIONAL_MODULES];
export const MODULE_CATALOGUE = OPTIONAL_MODULES;
