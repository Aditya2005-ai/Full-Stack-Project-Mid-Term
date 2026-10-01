/**
 * Module Dependency Resolver Interface & Resolution Engine
 * Core modules (auth, cart, orders) are built-in automatically.
 * Optional modules (products, payments, reviews) are resolved intelligently.
 */

export class DependencyResolver {
  constructor(catalogue) {
    this.catalogue = catalogue;
  }

  /**
   * Resolves selected modules and their implicit transitive dependencies
   * @param {string[]} selectedModuleIds
   * @param {Record<string, any>} options
   * @returns {{ core: string[], resolved: string[], autoAdded: Array<{ module: string, requiredBy: string[] }>, envKeys: string[], fileTree: string[], isValid: boolean }}
   */
  resolve(selectedModuleIds = [], options = {}) {
    const core = ['auth', 'cart', 'orders'];
    const selectedSet = new Set(selectedModuleIds);
    const resolvedSet = new Set(selectedModuleIds);
    const autoAdded = [];

    // Core is always included in the final compilation
    const finalModules = new Set([...core, ...selectedModuleIds]);

    // If Payments is selected, ensure Products is also in the application
    if (finalModules.has('payments') && !finalModules.has('products')) {
      finalModules.add('products');
      autoAdded.push({
        module: 'products',
        requiredBy: ['payments']
      });
    }

    // If Reviews is selected, ensure Products is also in the application
    if (finalModules.has('reviews') && !finalModules.has('products')) {
      finalModules.add('products');
      autoAdded.push({
        module: 'products',
        requiredBy: ['reviews']
      });
    }

    // Conventional ordering: auth -> products -> cart -> orders -> payments -> reviews
    const canonicalOrder = ['auth', 'products', 'cart', 'orders', 'payments', 'reviews'];
    const resolved = Array.from(finalModules).sort((a, b) => {
      const idxA = canonicalOrder.indexOf(a);
      const idxB = canonicalOrder.indexOf(b);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });

    // Required Environment Keys
    const envKeysSet = new Set(['PORT', 'MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL']);

    if (finalModules.has('payments')) {
      envKeysSet.add('RAZORPAY_KEY_ID');
      envKeysSet.add('RAZORPAY_KEY_SECRET');
    }

    // Generated file tree preview
    const fileTreeSet = new Set([
      'server/package.json',
      'server/server.js',
      'server/models/User.js',
      'server/models/Order.js',
      'server/routes/auth.js',
      'server/routes/orders.js',
      'server/middleware/auth.js',
      'server/seed.js',
      'client/package.json',
      'client/src/App.jsx',
      'client/src/main.jsx',
      'client/src/components/Navbar.jsx',
      'client/src/components/ProductCard.jsx',
      'client/src/pages/Home.jsx',
      'client/src/pages/Cart.jsx',
      'client/src/pages/Checkout.jsx',
      'client/src/pages/Profile.jsx',
      'client/src/pages/Login.jsx',
      'client/src/pages/Register.jsx',
      '.env.example',
      'package.json',
      'README.md'
    ]);

    if (finalModules.has('products')) {
      fileTreeSet.add('server/models/Product.js');
      fileTreeSet.add('server/routes/products.js');
      fileTreeSet.add('client/src/pages/Products.jsx');
      fileTreeSet.add('client/src/pages/ProductDetails.jsx');
    }

    if (finalModules.has('payments')) {
      fileTreeSet.add('server/routes/payments.js');
    }

    if (finalModules.has('reviews')) {
      fileTreeSet.add('server/models/Review.js');
      fileTreeSet.add('server/routes/reviews.js');
    }

    return {
      core,
      resolved,
      autoAdded,
      envKeys: Array.from(envKeysSet),
      fileTree: Array.from(fileTreeSet),
      isValid: true
    };
  }
}
