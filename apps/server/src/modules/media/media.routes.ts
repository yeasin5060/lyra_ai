import { Router, type Router as ExpressRouter } from "express";
import { mediaController } from "./media.controller.js";

const router: ExpressRouter = Router();

router.get("/messages", (req, res) => mediaController.getMessages(req, res));
router.get("/:id", (req, res) => mediaController.getPlatform(req, res));
router.get("/", (req, res) => mediaController.getAllPlatforms(req, res));

export default router;
