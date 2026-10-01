/**
 * Shared Module Contracts
 * Core features are always included. Optional modules are selectable.
 */

export const CORE_MODULE_IDS = Object.freeze({
  AUTH: 'auth',
  CART: 'cart',
  ORDERS: 'orders'
});

export const OPTIONAL_MODULE_IDS = Object.freeze({
  PRODUCTS: 'products',
  PAYMENTS: 'payments',
  REVIEWS: 'reviews'
});

export const MODULE_IDS = Object.freeze({
  ...CORE_MODULE_IDS,
  ...OPTIONAL_MODULE_IDS
});
