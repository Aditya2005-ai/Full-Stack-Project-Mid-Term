# Team Ownership Matrix & Boundaries

This matrix defines the clear boundaries for the 5-member engineering team to prevent Git merge conflicts.

## Ownership Matrix

| Developer | Role | Primary Directory / Files | Primary Responsibilities |
|---|---|---|---|
| **Developer 1** | Frontend Core Lead | `client/src/components/ui/`<br>`client/src/components/layout/`<br>`client/src/components/auth/`<br>`client/src/components/dashboard/`<br>`client/src/components/common/`<br>`client/src/pages/`<br>`client/src/routes/` | UI system, design tokens, app layout, core pages, route definitions, auth presentation |
| **Developer 2** | Frontend Builder Lead | `client/src/components/builder/`<br>`client/src/components/builds/`<br>`client/src/store/builderStore.js`<br>`client/src/store/moduleStore.js`<br>`client/src/store/buildStore.js`<br>`client/src/hooks/`<br>`client/src/services/` (builder-related) | Multi-step builder wizard, module selection UI, builder state management, code preview |
| **Developer 3** | Backend Auth & DB Lead | `server/src/config/`<br>`server/src/models/User.js`<br>`server/src/services/authService.js`<br>`server/src/controllers/authController.js`<br>`server/src/routes/authRoutes.js`<br>`server/src/middleware/`<br>`server/src/utils/jwt.js`<br>`server/src/utils/password.js` | Database connection, JWT authentication, user model, auth routes, security middleware |
| **Developer 4** | Backend APIs & Builds Lead | `server/src/models/Module.js`<br>`server/src/models/Build.js`<br>`server/src/models/GenerationLog.js`<br>`server/src/controllers/` (build, module, generation, user)<br>`server/src/services/` (build, module, generation, user)<br>`server/src/routes/` (build, module, generation, user)<br>`server/src/validators/`<br>`server/src/utils/` (apiResponse, asyncHandler, errors, logger) | Module catalogue APIs, build configuration persistence, generation queue orchestration |
| **Developer 5** | Generator Engine Lead | `generator/` (all subdirectories: catalogue, resolver, templates, renderer, merger, formatter, validator, zip, tests) | Module dependency resolution graph, AST/string template rendering, file merging, ZIP packaging |

## Protected Critical Files (Rare Modification Only)
To eliminate bottleneck merge conflicts, modifications to the following files require all-team review:
- `client/src/App.jsx`
- `client/src/routes/AppRoutes.jsx`
- `server/src/app.js`
- `server/src/server.js`
- `shared/*`
- Root `package.json`
