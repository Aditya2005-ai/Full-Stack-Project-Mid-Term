# E-Commerce Module Catalogue & Dependency Map

## 1. Overview
The platform generates modular MERN applications. Each module provides backend routes, models, services, and frontend builder options.

## 2. Module Catalogue

| Module ID | Module Name | Category | Direct Dependencies | Description |
|-----------|-------------|----------|---------------------|-------------|
| `auth` | Authentication & Authorization | `core` | None | JWT auth, user roles (admin/customer), route guards |
| `products` | Product Catalog | `commerce` | None | Products, categories, variants, inventory management |
| `cart` | Shopping Cart | `commerce` | `products` | Persistent cart, item counters, session handling |
| `orders` | Order Management | `commerce` | `auth`, `cart`, `products` | Order placement, status tracking, checkout workflow |
| `payments` | Payment Gateway | `commerce` | `orders` | Stripe / PayPal checkout & webhook handlers |
| `admin` | Admin Dashboard | `operations` | `auth` | Operations management, store analytics, user auditing |
| `reviews` | Reviews & Ratings | `engagement` | `auth`, `products` | Customer reviews, ratings, verified purchase marks |
| `coupons` | Discounts & Coupons | `commerce` | `cart` | Promo codes, discount rules, percentage/flat discounts |
| `wishlist` | Customer Wishlist | `engagement` | `auth`, `products` | User saved favorites list |
| `search` | Search & Filtering | `commerce` | `products` | Full-text search, price filtering, facet filtering |

## 3. Dependency Resolution Rules
- Selecting `orders` automatically resolves and includes `auth`, `cart`, and `products`.
- Selecting `payments` automatically includes `orders` (and recursively `cart`, `products`, `auth`).
- Circular dependencies are strictly forbidden and detected at build configuration time.
