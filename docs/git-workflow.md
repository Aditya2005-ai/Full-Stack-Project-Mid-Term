# Git & Collaboration Workflow

## 1. Branch Strategy

```mermaid
gitGraph
   commit id: "Initial Foundation (Phase 01)"
   branch develop
   checkout develop
   branch feature/frontend-core
   checkout feature/frontend-core
   commit id: "D1: UI System"
   checkout develop
   branch feature/generator-engine
   checkout feature/generator-engine
   commit id: "D5: Resolver"
   checkout develop
   merge feature/frontend-core
   merge feature/generator-engine
   checkout main
   merge develop tag: "v0.1.0-release"
```

### Primary Branches
- **`main`**: Production-ready, stable demo code. Protected branch.
- **`develop`**: Integration branch for merging feature branches.

### Team Feature Branches
- Developer 1: `feature/frontend-core`
- Developer 2: `feature/frontend-builder`
- Developer 3: `feature/backend-auth`
- Developer 4: `feature/backend-api`
- Developer 5: `feature/generator-engine`

## 2. Collaboration Rules
1. **Never force push** to `main` or `develop`.
2. **Never commit secrets** (such as `.env`, keys, or credentials).
3. **Never directly modify another developer's ownership files** without explicit coordination.
4. **Always use Pull Requests (PRs)** targeting `develop`.
5. Require at least one peer code review before merging into `develop`.

## 3. Commit Convention
Follow Conventional Commits:
- `feat(scope): add new capability`
- `fix(scope): resolve bug`
- `docs(scope): update documentation`
- `refactor(scope): internal code restructuring`
- `chore(scope): build, deps, or workflow changes`
