# Technical Specification (SPEC.md)
**Problem Statement 06 — Autonomous E-commerce Builder (Code Generator)**
*W3Grads Full Stack Vibe Coding Examination — 2026*

---

## 1. Domain & Core Challenge
- **Domain:** Developer Tools / Code Generation
- **Core Challenge:** Intelligent module dependency graph resolution, template rendering, and generating custom-coded, fully runnable MERN e-commerce project archives.
- **Roles:** Builder User, Admin
- **Design Philosophy:** Notion-inspired editorial canvas (`#FFFFFF` / `#F7F7F5`, `#E3E2DE`, `#37352F`, `#2383E2`).

---

## 2. Core vs Optional Module Architecture

### A. Internal Core Features (Always Built-in)
Non-selectable in the UI; automatically bundled into every generated MERN project:
1. `auth`: JWT authentication, User model, registration, login, protected routes.
2. `cart`: Shopping cart context/model, add/remove, quantity manipulation, persistent total.
3. `orders`: Order model with status tracking (`Pending`, `Delivered`), order history, checkout plumbing.

### B. Optional Selectable Modules
1. `products`: Multi-category filtering, custom category tag management, product details.
2. `payments`: Razorpay test mode payment gateway integration (uses built-in Cart & Orders).
3. `reviews`: 1-5 star ratings and reviews (uses built-in Authentication).

---

## 3. Dependency Resolution Rules
- Payments uses the built-in Cart and Orders system and automatically ensures Products is present.
- Reviews uses the built-in Authentication system and automatically ensures Products is present.
- Core e-commerce functionality (Auth, Cart, Orders) is included automatically without overwhelming users with duplicate dependency cards.

---

## 4. API Specification (`/api/v1`)
All endpoints conform to:
- **Success:** `{ success: true, data: ..., message?: string }`
- **Error:** `{ success: false, error: { code: string, message: string, details?: any[] } }`

Endpoints:
- `POST /api/v1/auth/register`: Register user
- `POST /api/v1/auth/login`: Issue JWT token
- `POST /api/v1/auth/logout`: Clear session
- `GET /api/v1/health`: Health probe
- `GET /api/v1/modules`: List catalogue modules
- `POST /api/v1/builds/resolve`: Dependency resolution & preview
- `POST /api/v1/generate`: Generate MERN project & get download token
- `GET /api/v1/download/:token`: Stream generated ZIP archive

---

## 5. Verification Commands
- `node scripts/verify-all-13-tests.js`: 13-point comprehensive integration test
- `npm test`: Server health & generator unit tests
- `npm run verify`: Foundation boundaries check
- `npm run build:client`: Client production build check
