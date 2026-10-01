# Team Vibe Coding Prompts Log (PROMPTS.md)
**Problem Statement 06 — Autonomous E-commerce Builder (Code Generator)**
*W3Grads Full Stack Examination — 2026*

This document tracks the prompts used to architect, scaffold, and implement the system in accordance with Section 1.3 and Section 19 of the examination guidelines.

---

### Prompt 01 — Monorepo Architecture & Isolation
> **Prompt:**  
> "Initialize a clean, scalable monorepo structure with separated client, server, generator, shared, and docs directories. Ensure the client never imports server or generator files, the generator has zero dependencies on React or MongoDB, and all 5 team developer ownership boundaries are strictly protected."  
*Produced:* Monorepo directory structure, boundary configuration, root `package.json`, and `.gitignore`.

---

### Prompt 02 — Module Catalogue & Dependency Modelling
> **Prompt:**  
> "Define a module catalogue (products, cart, orders, payments, auth, admin, reviews, coupons, wishlist, search) with dependsOn, options, and envKeys. Write a dependency resolver that returns the transitive, topologically-sorted module set and an autoAdded list explaining why each extra module was included."  
*Produced:* `generator/catalogue/modules.js` and `generator/resolver/dependencyResolver.js`.

---

### Prompt 03 — Express Backend API & /api/v1 Health
> **Prompt:**  
> "Scaffold the Express backend under /api/v1 with CORS, JSON body parser, centralized error handler, and a verified GET /api/v1/health endpoint returning `{ success: true, message: 'API is running' }`."  
*Produced:* `server/src/app.js`, `server/src/server.js`, `server/src/utils/apiResponse.js`, and `server/tests/health.test.js`.

---

### Prompt 04 — MongoDB Mongoose Schemas per PPT Design
> **Prompt:**  
> "Create Mongoose data models for User, Build, Module, and Generation matching the database design table in Section 11 of Problem Statement 06, including currency, theme, and lastGeneratedAt."  
*Produced:* `server/src/models/User.js`, `server/src/models/Build.js`, `server/src/models/Module.js`, and `server/src/models/GenerationLog.js`.

---

### Prompt 05 — Client Design System & Tokens
> **Prompt:**  
> "Configure Tailwind CSS with the developer-tool design system from Section 14: Base `#0B1020`, Surface `#151B2E`, Primary Indigo `#6366F1`, Accent Teal `#14B8A6`, Amber `#F59E0B`, Line `#27304A`, Text `#E5E9F5`, and Muted `#8A93AD`."  
*Produced:* `client/tailwind.config.js` and `client/src/index.css`.

---

### Prompt 06 — Store Basics Form in Dashboard
> **Prompt:**  
> "Create a Store Basics Form in the Dashboard allowing users to configure store name, INR currency, color theme picker, logo, and quick modules, with instant state sync to the builder store and redirection to the builder wizard."  
*Produced:* `client/src/components/dashboard/StoreBasicsForm.jsx` and updated `client/src/pages/DashboardPage.jsx`.

---

### Prompt 07 — Dashboard Saved Builds Manager
> **Prompt:**  
> "Build the My Builds dashboard table with actions to open, duplicate, regenerate, and delete saved store configurations."  
*Produced:* Interactive build list and actions in `client/src/pages/DashboardPage.jsx`.

---

### Prompt 08 — Multi-Step Builder Wizard & Live Structure Preview
> **Prompt:**  
> "Create the 4-step Builder Wizard (Basics, Modules, Options, Review) with interactive module toggle cards, auto-selection indicators with 'required by X' badges, and a live monospaced file-tree preview panel."  
*Produced:* `client/src/components/builder/BuilderWizard.jsx`.

---

### Prompt 09 — Review & Generate Screen
> **Prompt:**  
> "Build the /build/review page featuring a live project file tree, unioned .env keys list with inline comments, progress state animations (resolving -> rendering -> zipping -> ready), and a prominent teal Download ZIP CTA."  
*Produced:* `client/src/pages/ReviewPage.jsx`.

---

### Prompt 10 — Generator Engine Public Interface
> **Prompt:**  
> "Expose a clean public interface for the generator engine in `generator/index.js` supporting catalogue queries, dependency resolution with autoAdded reasons, output tree validation, and zip packaging."  
*Produced:* `generator/index.js` and `generator/tests/generator.test.js`.

---

### Prompt 11 — Automated End-to-End Foundation Verification
> **Prompt:**  
> "Write an automated Node.js test script `scripts/verify-foundation.js` that checks monorepo directory layout, verifies the generator import, verifies /api/health returns 200 OK, and asserts zero cross-layer contamination."  
*Produced:* `scripts/verify-foundation.js`.
