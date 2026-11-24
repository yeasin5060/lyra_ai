# LYRA AI Architecture

## 1. Architectural Philosophy
LYRA AI is engineered with a **Monorepo + Unified Modular Backend** architecture. Rather than building fragmented backends for Web, Desktop, and Mobile, all platform targets interface with the single Express 5 API service and shared account state.

```text
               ┌────────────────────────────────────────────────────────┐
               │                      CLIENT TIERS                      │
               ├───────────────────┬───────────────────┬────────────────┤
               │   Next.js 15+     │   React Native    │    Electron    │
               │   Web Dashboard   │    Expo Mobile    │    Desktop     │
               └─────────┬─────────┴─────────┬─────────┴────────┬───────┘
                         │                   │                  │
                         ▼                   ▼                  ▼
               ┌────────────────────────────────────────────────────────┐
               │            MODULAR EXPRESS 5 BACKEND API               │
               ├───────────────┬───────────────────────┬────────────────┤
               │  Better Auth  │   Voice & Synthesis   │ Media & Social │
               │  (Mongo Adap) │   Language Detection  │ Messages Vault │
               └───────────────┴───────────┬───────────┴────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                 DATABASE & CLOUD STATE                 │
               ├────────────────────────────────────────────────────────┤
               │  MongoDB Atlas (8.x) / Docker MongoDB Container        │
               │  Resilient Degraded Offline Fallback Mode              │
               └────────────────────────────────────────────────────────┘
```

## 2. Core Modules

### 2.1 Voice Engine & Synthesis (`apps/web/src/lib/voice`)
- **SpeechRecognizer**: Manages Web Speech API recognition sessions, handling microphone authorization, transient error recovery, and auto-restart loops.
- **SoftFemaleVoiceSynthesizer**: Synthesizes speech using available natural female voices (e.g., Google বাংলা, Microsoft Sayantani, Google UK Female, Samantha) calibrated at pitch 1.15x and rate 0.94. Plays a gentle Web Audio sine oscillator chime (659Hz to 880Hz) before speaking.
- **WakeWordEngine**: Continuously analyzes speech tokens for activation triggers (`"Hey LYRA"`, `"লায়রা"`).
- **Sleep Mode Controller**: Puts the assistant into a tranquil resting state upon receiving sleep commands (`"লায়রা তুমি ঘুমাও"`, `"lyra sleep"`), disabling wake-word triggers until explicitly awakened.

### 2.2 Media Command Center & Messages Vault (`apps/server/src/modules/media`)
- **MediaPlatformService**: Maintains normalized status for 9 platforms: Facebook, Instagram, YouTube, WhatsApp, Gmail, Calendar, LinkedIn, Spotify, and X/Twitter.
- **Query Introspection**: Translates natural speech queries (e.g. *"কে কে মেসেজ দিয়েছে"*, *"ফেসবুকের আপডেট বলো"*) into contextual platform answers.
- **Clean Disconnected State**: Reflects actual authorization status (`disconnected`) rather than simulated mock metrics.

### 2.3 Resilient Database Strategy (`apps/server/src/config/database.ts`)
- Dual-driver support: Native `MongoClient` for Better Auth adapter + `mongoose` for application models.
- Graceful startup: If MongoDB Atlas is unreachable or IP whitelist is pending, the server logs a warning and enters **degraded mode** without crashing, allowing frontend voice and UI interaction to continue.

## 3. Technology Stack Summary
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15.5, React 19, Tailwind CSS v4, Framer Motion, Lucide Icons, Web Speech API, Web Audio API |
| **Backend** | Node.js 22 LTS, Express 5, TypeScript 5, Better Auth, Zod, Helmet, Compression, Rate Limit |
| **Database** | MongoDB 8.x / MongoDB Atlas Cloud |
| **Package Tooling** | pnpm 10 Workspace Monorepo |
