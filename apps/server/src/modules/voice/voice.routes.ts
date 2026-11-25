import { Router, type Router as ExpressRouter } from "express";
import { voiceController } from "./voice.controller.js";

const router: ExpressRouter = Router();

router.post("/detect", (req, res) => voiceController.detectLanguage(req, res));
router.get("/profiles", (req, res) => voiceController.getProfiles(req, res));
router.post("/process", (req, res) => {
  void voiceController.processVoice(req, res);
});
router.get("/tts", (req, res) => {
  void voiceController.synthesizeAudio(req, res);
});
router.post("/tts", (req, res) => {
  void voiceController.synthesizeAudio(req, res);
});

export default router;
