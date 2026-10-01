/**
 * Module Catalogue Definitions for Generator Engine
 * Core modules are built into every generated app automatically.
 * Optional modules are configurable by the user.
 */

export const CORE_MODULES = Object.freeze([
  {
    id: 'auth',
    key: 'auth',
    name: 'Authentication',
    isCore: true,
    isActive: true,
    dependencies: [],
    description: 'JWT-based authentication, user registration, login, and protected routes'
  },
  {
    id: 'cart',
    key: 'cart',
    name: 'Shopping Cart',
    isCore: true,
    isActive: true,
    dependencies: [],
    description: 'Session and user-persistent cart management, item quantities, and subtotals'
  },
  {
    id: 'orders',
    key: 'orders',
    name: 'Order Management',
    isCore: true,
    isActive: true,
    dependencies: ['auth', 'cart'],
    description: 'Order placement workflow, order lifecycle, invoices, and history'
  }
]);

export const OPTIONAL_MODULES = Object.freeze([
  {
    id: 'products',
    key: 'products',
    name: 'Products & Categories',
    category: 'commerce',
    isCore: false,
    isActive: true,
    dependencies: [],
    description: 'Product catalog, customizable categories, and product details'
  },
  {
    id: 'payments',
    key: 'payments',
    name: 'Payments (Razorpay)',
    category: 'commerce',
    isCore: false,
    isActive: true,
    dependencies: ['orders', 'cart'],
    description: 'Razorpay payment gateway integration in test mode'
  },
  {
    id: 'reviews',
    key: 'reviews',
    name: 'Reviews & Ratings',
    category: 'engagement',
    isCore: false,
    isActive: true,
    dependencies: ['auth'],
    description: 'Customer ratings, verified reviews, and product feedback'
  }
]);

export const MODULE_CATALOGUE = Object.freeze([
  ...CORE_MODULES,
  ...OPTIONAL_MODULES
]);
