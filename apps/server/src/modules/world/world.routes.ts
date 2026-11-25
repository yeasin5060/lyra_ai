import { Router, type Router as ExpressRouter } from "express";
import { worldController } from "./world.controller.js";

const router: ExpressRouter = Router();

router.get("/news", (req, res) => {
  void worldController.getNews(req, res);
});

router.get("/weather", (req, res) => {
  void worldController.getWeather(req, res);
});

router.get("/search", (req, res) => {
  void worldController.search(req, res);
});

export default router;
