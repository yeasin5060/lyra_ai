import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";
import { env } from "./config/env.js";
import { auth } from "./lib/auth.js";
import healthRoutes from "./modules/health/health.routes.js";
import voiceRoutes from "./modules/voice/voice.routes.js";
import mediaRoutes from "./modules/media/media.routes.js";
import worldRoutes from "./modules/world/world.routes.js";
import integrationsRoutes from "./modules/integrations/integrations.routes.js";
import visionRoutes from "./modules/vision/vision.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

const app: Express = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.WEB_URL, credentials: true }));
app.use(compression());

// Authentication rate limiter
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

// Better Auth must be before body parsers
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100
  })
);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Welcome to LYRA AI API" });
});

app.use("/api/health", healthRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/world", worldRoutes);
app.use("/api/integrations", integrationsRoutes);
app.use("/api/vision", visionRoutes);
app.use(errorHandler);

export default app;
