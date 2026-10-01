# System Architecture & Technical Specifications

## 1. Overview
The **Autonomous MERN E-Commerce Code Generator** is a platform allowing developers and store owners to configure modular MERN applications and automatically generate, validate, and download complete, production-ready source code repositories.

## 2. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Frontend["Client (React + Vite)"]
        UI["UI & Layout"]
        Wizard["Builder Wizard"]
        Stores["Zustand State Stores"]
        APIClient["API Service Layer (Axios)"]
    end

    subgraph Backend["Server (Express + Node.js)"]
        Routes["Express API Routes"]
        Controllers["Controllers"]
        Services["Business Services"]
        Models[("MongoDB / Mongoose Models")]
    end

    subgraph Engine["Generator Engine"]
        Catalogue["Module Catalogue"]
        Resolver["Dependency Resolver"]
        Renderer["Template Renderer"]
        Merger["Safe File Merger"]
        Formatter["Code Formatter"]
        Validator["Output Validator"]
        Packager["ZIP Packager"]
    end

    subgraph Shared["Shared Contracts"]
        Constants["Module & Status Constants"]
        Contracts["Data Schemas"]
    end

    Frontend -->|REST API Requests| Backend
    Backend -->|Invokes Clean Public API| Engine
    Frontend -.->|Imports Contracts| Shared
    Backend -.->|Imports Contracts| Shared
    Engine -.->|Imports Contracts| Shared
```

## 3. Separation of Concerns & Isolation Rules
- **Client Isolation**: The client must **NEVER** import server files, database drivers, or generator internals.
- **Generator Isolation**: The generator is completely framework-agnostic and must **NEVER** depend on React or database models.
- **Backend Clean Interface**: The server communicates with the generator solely through the exported `GeneratorEngine` public API.
- **Shared Minimality**: The `shared/` directory contains strictly pure contracts, immutable constants, and schemas. No framework dependencies or heavy business logic.

## 4. End-to-End Generation Pipeline (Future Phases)

```mermaid
flowchart LR
    A["Store Basics"] --> B["Module Selection"]
    B --> C["Dependency Resolution"]
    C --> D["Module Options"]
    D --> E["Review & Validate"]
    E --> F["Code Generation"]
    F --> G["ZIP Package"]
    G --> H["Download"]
```
