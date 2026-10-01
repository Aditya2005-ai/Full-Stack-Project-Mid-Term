# Autonomous E-commerce Builder (Code Generator) — PS 06 | Team Full-Stack Engineers

> **Architectural Foundation & Full-Stack MERN Generator**  
> *Conforms strictly to W3Grads Problem Statement 06 & Team Architecture Specifications*

---

## Team

| Name | Roll No. | GitHub | Primary responsibility |
|---|---|---|---|
| Developer 1 | FS-2026-01 | @dev1-lead | Frontend Core & Notion Design System (`client/src/components/ui/`, `layout/`, `pages/`) |
| Developer 2 | FS-2026-02 | @dev2-builder | Frontend Builder Wizard & State (`client/src/components/builder/`, `store/`) |
| Developer 3 | FS-2026-03 | @dev3-auth | Backend Auth & DB Architecture (`server/src/config/`, `models/User.js`, JWT) |
| Developer 4 | FS-2026-04 | @dev4-api | Backend APIs & Build Management (`server/src/models/`, `controllers/`, routes) |
| Developer 5 | FS-2026-05 | @dev5-engine | Generator Engine & ZIP Synthesizer (`generator/`, templates, archiver) |

---

## Live Links
- **Frontend App:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/v1
- **Health Endpoint:** http://localhost:5000/api/v1/health (and `/api/health`)
- **Demo Video:** https://drive.google.com/ (3-5 min walkthrough link placeholder)

---

## Tech Stack
- **Frontend:** React 18, Vite 6, Tailwind CSS 3 (Notion-inspired editorial canvas: `#FFFFFF` / `#F7F7F5` background, `#E3E2DE` subtle borders, `#37352F` primary charcoal ink, `#2383E2` restrained blue accent), React Router v6, Zustand 5, Axios, Lucide React icons.
- **Backend:** Node.js v22 (ES Modules), Express 4, Mongoose 8, MongoDB (with in-memory test fallback), CORS, Dotenv.
- **Generator Engine:** Standalone Node.js ES Modules, Dependency Resolver, MERN Store Template Synthesizer, Archiver ZIP packager.

---

## Core Architecture & Module Design

### 1. Internal Core Features (Always Included Automatically)
Every generated MERN e-commerce application automatically includes complete commerce plumbing:
1. **Authentication:** User registration, login, JWT token auth, protected routes, customer role.
2. **Shopping Cart:** Cart state, add/remove items, quantity manipulation, persistent subtotal calculation.
3. **Orders & Checkout:** Order placement, shipping details collection, order status tracking (`Pending`, `Delivered`).

> *Note: Core modules are NOT exposed as selectable checkboxes to avoid user confusion.*

### 2. Optional Modules (Selectable in Builder)
Users configure only what their specific store requires:
1. **Products:** Category manager (with dynamic tag addition/removal), product catalog grid, search, and detail views.
2. **Payments (Razorpay Only):** Razorpay test mode payment gateway integration. Uses built-in Cart & Orders system.
3. **Reviews:** Customer product ratings (1-5 stars) and feedback. Uses built-in Authentication system.

---

## 5-Step Builder Flow

```text
Store Basics  -->  Optional Modules  -->  Module Options  -->  Review Summary  -->  Generate & ZIP Download
   (Step 1)             (Step 2)               (Step 3)             (Step 4)                (Step 5)
```

1. **Store Basics:** Configure store name, currency (`INR ₹`, `USD $`, `EUR €`, `GBP £`), and theme color.
2. **Optional Modules:** Select from Products, Payments (Razorpay), and Reviews with core feature banner.
3. **Module Options:** Dynamic category tag manager (add/remove custom categories), Razorpay test mode notice, reviews authentication toggle.
4. **Review Summary:** Live generated file tree preview, environment variable preview, and configuration audit.
5. **Generate & Download:** Multi-stage progress tracking (Preparing → Resolving → Generating → Validating → Packaging) and 1-click ZIP download.

---

## Generated MERN Project Structure

Each downloaded ZIP archive contains a complete, runnable MERN e-commerce application:

```text
<store-name>/
├── package.json              # Root scripts (install:all, dev, seed)
├── .env.example              # Pre-configured environment variables
├── README.md                 # Complete startup and setup documentation
├── server/
│   ├── package.json
│   ├── server.js             # Express API with MongoDB connection
│   ├── seed.js               # Database seeder with user-configured categories
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Review.js
│   └── routes/
│       ├── auth.js
│       ├── products.js
│       ├── orders.js
│       ├── payments.js       # (If Razorpay selected)
│       └── reviews.js        # (If Reviews selected)
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProductCard.jsx
        └── pages/
            ├── Home.jsx      # Features custom categories & hero banner
            ├── Products.jsx  # Multi-category filtering
            ├── ProductDetails.jsx
            ├── Cart.jsx
            ├── Checkout.jsx  # Razorpay test mode payment flow
            ├── Profile.jsx
            ├── Login.jsx
            └── Register.jsx
```

---

## Quick Start & Verification

### Running Verification Tests
To run all test suites from the project root:

```bash
# 1. Run all 13 comprehensive end-to-end integration tests
node scripts/verify-all-13-tests.js

# 2. Run server and generator unit/API tests
npm test

# 3. Verify monorepo foundation and decoupling boundaries
npm run verify

# 4. Verify client production build
npm run build:client
```

### Running the Platform Locally

1. **Install Dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start Backend (Terminal 1):**
   ```bash
   npm run dev:server
   # Runs on http://localhost:5000
   ```

3. **Start Frontend (Terminal 2):**
   ```bash
   npm run dev:client
   # Runs on http://localhost:5173
   ```

### Demo User Accounts
- **Developer Account:** `developer@demo.com` / `Dev@123`
- **Admin Account:** `admin@demo.com` / `Admin@123`

---

## API Endpoints

Base URL: `/api/v1`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/health` | Public | Health and liveness probe |
| `POST` | `/api/v1/auth/register` | Public | Register new builder user |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & issue JWT |
| `POST` | `/api/v1/auth/logout` | Public | Clear user session |
| `GET` | `/api/v1/modules` | Public | Retrieve module catalogue & options |
| `POST` | `/api/v1/builds/resolve` | Public | Resolve dependencies & generate file tree preview |
| `POST` | `/api/v1/generate` | Protected | Synthesize full MERN codebase and package ZIP |
| `GET` | `/api/v1/download/:token` | Protected | Download generated `.zip` archive |
