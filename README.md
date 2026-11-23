# LYRA AI

> Your Personal Intelligent Multilingual AI Assistant (বাংলা + English)
> Soft • Sweet • Intelligent • Multilingual

---

## 🌟 Overview

LYRA AI is a personal female AI assistant designed to communicate seamlessly in both **Bengali** and **English**, with capabilities for wake-word activation, conversational intelligence, voice synthesis, and integration with approved social media and personal accounts.

## 🏗️ Architecture

LYRA uses a **Monorepo + Modular Backend** architecture:

```text
lyra-ai/
├── apps/
│   ├── web/                       # Next.js 15+ frontend dashboard
│   ├── server/                    # Node.js + Express 5 backend API
│   ├── mobile/                    # React Native + Expo (Future)
│   └── desktop/                   # Electron desktop assistant (Future)
├── packages/
│   ├── shared/                    # Shared types and utility logic
│   ├── api-client/                # Reusable client library
│   └── config/                    # Shared configurations
├── infrastructure/
│   └── docker/                    # Docker configurations
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
├── .env.example
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 Quick Start (Milestone 1)

### Prerequisites

- **Node.js**: v22 LTS or higher
- **pnpm**: 10.x or higher
- **Docker**: Docker Desktop (for MongoDB container)

### Setup & Run

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env` in root
   - Copy `apps/server/.env.example` to `apps/server/.env`
   - Set matching MongoDB passwords and a generated `BETTER_AUTH_SECRET` (at least 32 characters)

3. **Start MongoDB:**
   ```bash
   docker compose up -d
   ```

4. **Start Development (Frontend + Backend concurrently):**
   ```bash
   pnpm dev
   ```

5. **Access services:**
   - Web Dashboard: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - Health Status: [http://localhost:5000/api/health](http://localhost:5000/api/health)
