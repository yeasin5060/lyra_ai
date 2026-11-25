import type { Request, Response } from "express";
import { worldIntelligenceService } from "./world.service.js";

export class WorldController {
  public async getNews(req: Request, res: Response): Promise<void> {
    const { category, lang } = req.query as { category?: string; lang?: "bn" | "en" };
    const data = await worldIntelligenceService.getLatestNews(category, lang || "bn");
    res.json({ success: true, data });
  }

  public async getWeather(req: Request, res: Response): Promise<void> {
    const { city, lang } = req.query as { city?: string; lang?: "bn" | "en" };
    const data = await worldIntelligenceService.getLiveWeather(city || "Dhaka", lang || "bn");
    res.json({ success: true, data });
  }

  public async search(req: Request, res: Response): Promise<void> {
    const { q, lang } = req.query as { q?: string; lang?: "bn" | "en" };
    if (!q || typeof q !== "string") {
      res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
      return;
    }
    const data = await worldIntelligenceService.searchWeb(q, lang || "bn");
    res.json({ success: true, data });
  }
}

export const worldController = new WorldController();
