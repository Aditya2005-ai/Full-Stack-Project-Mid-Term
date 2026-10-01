# API Specifications & Contracts

## Base URL
Default: `http://localhost:5000/api`

## Standard Response Format
All JSON responses follow the standardized envelope:

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Endpoints

### 1. Health & Status
- **`GET /api/health`**
  - **Access**: Public
  - **Status**: Active (Phase 01)
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "API is running"
    }
    ```

### 2. Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and retrieve JWT
- `GET /api/auth/me` - Retrieve current user profile (Protected)

### 3. User Management (`/api/users`)
- `GET /api/users/:id` - Fetch user profile (Protected)
- `PUT /api/users/:id` - Update user profile (Protected)

### 4. Modules Catalogue (`/api/modules`)
- `GET /api/modules` - List all available e-commerce modules
- `GET /api/modules/:id` - Get specific module details & dependencies

### 5. Builds & Configurations (`/api/builds`)
- `POST /api/builds` - Create or save a builder configuration
- `GET /api/builds` - List user builds
- `GET /api/builds/:id` - Get details of a specific build

### 6. Code Generation (`/api/generation`)
- `POST /api/generation/:buildId/trigger` - Queue generation pipeline
- `GET /api/generation/:buildId/logs` - Stream/fetch generation progress logs
