import { Router, type Router as ExpressRouter } from "express";
import { aiController } from "./ai.controller.js";

const router: ExpressRouter = Router();

router.get("/models", (req, res) => aiController.getModels(req, res));
router.post("/model", (req, res) => aiController.setActiveModel(req, res));
router.post("/chat", (req, res) => {
  void aiController.chat(req, res);
});

export default router;
