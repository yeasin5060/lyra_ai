# LYRA AI API Documentation

## Base URL
- **Local Development**: `http://localhost:5000`

---

## 1. System Endpoints

### 1.1 Welcome
- **GET `/`**
  - **Description**: Verifies that the API service is running.
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "Welcome to LYRA AI API"
    }
    ```

### 1.2 Health Check
- **GET `/api/health`**
  - **Description**: Returns database connectivity and service health.
  - **Response (200 - Healthy)**:
    ```json
    {
      "success": true,
      "service": "LYRA AI API",
      "version": "1.0.0",
      "status": "healthy",
      "database": "connected",
      "timestamp": "2026-11-24T12:00:00.000Z"
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
      "timestamp": "2026-11-24T12:00:00.000Z"
    }
    ```

---

## 2. Voice & Conversational Intelligence

### 2.1 Process Voice Query
- **POST `/api/voice/process`**
  - **Description**: Analyzes speech text, detects language, interprets commands (wake word, sleep mode, platform inquiries), and produces synthesized voice configuration.
  - **Request Body**:
    ```json
    {
      "text": "লায়রা তুমি ঘুমাও",
      "language": "auto"
    }
    ```
  - **Response (200)**:
    ```json
    {
      "success": true,
      "data": {
        "inputTranscript": "লায়রা তুমি ঘুমাও",
        "detectedLanguage": "bn",
        "replyLanguage": "bn",
        "replyText": "ঠিক আছে, আমি এখন স্লিপ মোডে যাচ্ছি। আমাকে প্রয়োজন হলে শুধু 'Hey LYRA' বললেই আমি সাথে সাথে জেগে উঠব। শুভ রাত্রি!",
        "isSleepCommand": true,
        "isWakeCommand": false,
        "voiceConfig": {
          "pitch": 1.05,
          "rate": 0.90,
          "suggestedVoiceNames": ["Google বাংলা", "Microsoft Sayantani", "Bangla Female"],
          "style": "soft-sweet"
        },
        "timestamp": "2026-11-24T12:00:00.000Z"
      }
    }
    ```

### 2.2 Voice Profiles
- **GET `/api/voice/profiles`**
  - **Description**: Retrieves configured voice personas for Bengali and English.
  - **Response (200)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "lyra-female-bn",
          "language": "bn",
          "name": "LYRA Bangla Sweet Female",
          "tone": "Soft, Warm & Sweet (নরম ও মিষ্টভাষী)",
          "pitch": 1.15,
          "rate": 0.94,
          "sampleGreeting": "হ্যালো! আমি লায়রা, আপনার পার্সোনাল এআই সহকারী..."
        },
        {
          "id": "lyra-female-en",
          "language": "en",
          "name": "LYRA English Gentle Female",
          "tone": "Soft, Elegant & Articulate",
          "pitch": 1.08,
          "rate": 0.95,
          "sampleGreeting": "Hello! I am LYRA, your intelligent personal AI assistant..."
        }
      ]
    }
    ```

---

## 3. Media & Social Integrations

### 3.1 All Platforms Overview
- **GET `/api/media/platforms`**
  - **Description**: Returns connectivity status and stats across all 9 supported platforms.
  - **Response (200)**:
    ```json
    {
      "success": true,
      "data": {
        "totalPlatforms": 9,
        "totalUnreadNotifications": 0,
        "activeMediaStream": "No active media stream",
        "platforms": [
          {
            "id": "facebook",
            "name": "Facebook",
            "category": "social",
            "username": "Not Connected",
            "status": "disconnected",
            "followersOrSubscribers": "Not Linked",
            "unreadCount": 0,
            "highlightStat": "Account Not Linked",
            "latestActivity": "Waiting for Facebook account authorization",
            "accentColor": "#1877F2",
            "summaryBangla": "আপনার ফেসবুক অ্যাকাউন্টটি এখনো সংযুক্ত করা হয়নি...",
            "summaryEnglish": "Your Facebook account is not connected yet..."
          }
        ]
      }
    }
    ```

### 3.2 Single Platform Details
- **GET `/api/media/platforms/:id`**
  - **Description**: Returns detailed statistics for an individual platform (e.g., `facebook`, `whatsapp`, `gmail`, `youtube`, `spotify`).

### 3.3 Inbound Messages Vault
- **GET `/api/media/messages`**
  - **Query Parameters**:
    - `platform` *(optional)*: Filter by platform (`facebook`, `whatsapp`, `instagram`, `gmail`, `linkedin`, `twitter`)
  - **Response (200)**:
    ```json
    {
      "success": true,
      "data": []
    }
    ```

---

## 4. Authentication (Better Auth)
- **Path prefix**: `/api/auth/*`
- Managed via Better Auth with MongoDB adapter.
- Supported operations:
  - `POST /api/auth/sign-up/email`
  - `POST /api/auth/sign-in/email`
  - `POST /api/auth/sign-out`
  - `GET /api/auth/get-session`
