import { Router, type Router as ExpressRouter } from "express";
import mongoose from "mongoose";

const router: ExpressRouter = Router();

router.get("/", (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    success: connected,
    service: "LYRA AI API",
    version: "1.0.0",
    status: connected ? "healthy" : "degraded",
    database: connected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

export default router;
