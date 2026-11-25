import { Router, type Router as ExpressRouter } from "express";
import { visionController } from "./vision.controller.js";

const router: ExpressRouter = Router();

router.post("/scan", (req, res) => {
  void visionController.scanFrame(req, res);
});

router.get("/status", (req, res) => {
  visionController.getStatus(req, res);
});

export default router;
