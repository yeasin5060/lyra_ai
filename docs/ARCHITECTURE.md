# LYRA AI Architecture

## Overview
LYRA AI is designed as a unified monorepo supporting multiple client targets (Web, Mobile, Desktop) driven by a single common modular backend API.

## Monorepo Layout
- **`apps/web`**: Next.js 15+ Web application providing the primary user interface, assistant status, visual identity, and settings.
- **`apps/server`**: Express 5 + TypeScript backend service providing authentication (Better Auth), MongoDB persistence, real-time communications (Socket.IO), and future AI assistant modules (voice, memory, integrations).
- **`apps/mobile`**: (Milestone 8) React Native + Expo application.
- **`apps/desktop`**: (Milestone 8) Electron background assistant.
- **`packages/shared`**: Common types, schemas, and utility constants.
- **`packages/api-client`**: Strongly typed HTTP/WebSocket client for communicating with `apps/server`.
- **`packages/config`**: Shared linting, formatting, and TypeScript configurations.

## Technology Stack
- **Frontend**: Next.js, React 19, Tailwind CSS, Framer Motion, Zustand, TanStack Query, Lucide React, Sonner
- **Backend**: Express 5, TypeScript, Mongoose 8+, MongoDB Driver, Better Auth (MongoDB Adapter), Zod, Pino
- **Database**: MongoDB 8.x
- **Containerization**: Docker Compose
