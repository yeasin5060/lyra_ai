import { Router, type Router as ExpressRouter } from "express";
import { voiceController } from "./voice.controller.js";

const router: ExpressRouter = Router();

router.post("/detect", (req, res) => voiceController.detectLanguage(req, res));
router.get("/profiles", (req, res) => voiceController.getProfiles(req, res));
router.post("/process", (req, res) => voiceController.processVoice(req, res));

export default router;
