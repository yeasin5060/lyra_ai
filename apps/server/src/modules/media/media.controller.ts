import type { Request, Response } from "express";
import { mediaPlatformService } from "./media.service.js";

export class MediaController {
  public getAllPlatforms(_req: Request, res: Response): void {
    const data = mediaPlatformService.getAllPlatforms();
    res.json({
      success: true,
      data
    });
  }

  public getPlatform(req: Request, res: Response): void {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || typeof id !== "string") {
      res.status(400).json({ success: false, message: "Platform ID is required" });
      return;
    }

    const platform = mediaPlatformService.getPlatformById(id);
    if (!platform) {
      res.status(404).json({ success: false, message: "Platform not found" });
      return;
    }

    res.json({ success: true, data: platform });
  }

  public getMessages(req: Request, res: Response): void {
    const { platform } = req.query as { platform?: string };
    const messages = mediaPlatformService.getAllInboundMessages(platform);
    res.json({
      success: true,
      data: messages
    });
  }

  public getEvents(_req: Request, res: Response): void {
    const events = mediaPlatformService.getLiveEvents();
    res.json({
      success: true,
      data: events
    });
  }

  public getStats(_req: Request, res: Response): void {
    const stats = mediaPlatformService.getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  }
}

export const mediaController = new MediaController();
