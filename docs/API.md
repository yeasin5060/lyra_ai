# LYRA AI API Documentation

## Base URL
- Development: `http://localhost:5000`

## Endpoints

### 1. Root
- **GET `/`**
  - **Description**: API welcome message.
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "Welcome to LYRA AI API"
    }
    ```

### 2. Health & Status
- **GET `/api/health`**
  - **Description**: Returns the operational status of the API and its database connection.
  - **Response (200 - Connected)**:
    ```json
    {
      "success": true,
      "service": "LYRA AI API",
      "version": "1.0.0",
      "status": "healthy",
      "database": "connected",
      "timestamp": "2026-11-23T09:00:00.000Z"
    }
    ```
  - **Response (503 - Degraded)**:
    ```json
    {
      "success": false,
      "service": "LYRA AI API",
      "version": "1.0.0",
      "status": "degraded",
      "database": "disconnected",
      "timestamp": "2026-11-23T09:00:00.000Z"
    }
    ```

### 3. Authentication (Better Auth)
- **Path prefix**: `/api/auth/*`
- Managed automatically by Better Auth.
- Endpoints include sign up, sign in, session management, sign out.
