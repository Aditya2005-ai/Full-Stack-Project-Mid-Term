## Description
<!-- Provide a clear summary of the changes and the developer area ownership. -->

## Developer Ownership
- [ ] Developer 1: Frontend Core (`client/src/components/ui`, `layout`, `auth`, `pages`, `routes`)
- [ ] Developer 2: Frontend Builder (`client/src/components/builder`, `builds`, stores, hooks)
- [ ] Developer 3: Backend Auth + DB (`server/src/config`, `models/User`, auth routes/services)
- [ ] Developer 4: Backend APIs (`server/src/models`, `controllers`, `services`, `routes`)
- [ ] Developer 5: Generator Engine (`generator/`)

## Protected File Verification
- [ ] Does this PR modify any protected files (`App.jsx`, `AppRoutes.jsx`, `app.js`, `server.js`, `shared/*`, root `package.json`)?
- If yes, provide explicit justification:

## Checklist
- [ ] Code follows project architecture & boundaries
- [ ] No circular dependencies introduced
- [ ] Client does not import server or generator internals
- [ ] Generator does not import React
- [ ] Verified local tests pass (`npm run test:server`, `npm run test:generator`, `npm run build:client`)
- [ ] No secrets committed
