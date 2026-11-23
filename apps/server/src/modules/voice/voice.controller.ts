import type { Request, Response } from "express";
import { voiceService } from "./voice.service.js";

export class VoiceController {
  public detectLanguage(req: Request, res: Response): void {
    const { text } = req.body as { text?: string };
    if (!text || typeof text !== "string") {
      res.status(400).json({
        success: false,
        message: "Text field is required"
      });
      return;
    }

    const result = voiceService.detectLanguage(text);
    res.json({
      success: true,
      data: result
    });
  }

  public getProfiles(_req: Request, res: Response): void {
    const profiles = voiceService.getVoiceProfiles();
    res.json({
      success: true,
      data: profiles
    });
  }

  public processVoice(req: Request, res: Response): void {
    const { text, language } = req.body as {
      text?: string;
      language?: "bn" | "en" | "auto";
    };

    if (!text || typeof text !== "string") {
      res.status(400).json({
        success: false,
        message: "Transcript text is required"
      });
      return;
    }

    const result = voiceService.processVoice(text, language);
    res.json({
      success: true,
      data: result
    });
  }
}

export const voiceController = new VoiceController();
