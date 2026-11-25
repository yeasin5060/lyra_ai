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

  public async processVoice(req: Request, res: Response): Promise<void> {
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

    try {
      const result = await voiceService.processVoice(text, language);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error("Voice processing error:", error);
      res.status(500).json({
        success: false,
        message: "Voice processing failed"
      });
    }
  }

  public async synthesizeAudio(req: Request, res: Response): Promise<void> {
    const text = (req.query.text as string) || (req.body?.text as string) || "";
    const lang = ((req.query.lang as string) || (req.body?.lang as string) || "bn") as "bn" | "en";

    if (!text || typeof text !== "string" || !text.trim()) {
      res.status(400).json({
        success: false,
        message: "Text parameter is required for TTS synthesis"
      });
      return;
    }

    try {
      const audioBuffer = await voiceService.fetchTtsAudioStream(text, lang);
      if (!audioBuffer || audioBuffer.length === 0) {
        res.status(502).json({
          success: false,
          message: "Unable to synthesize audio stream"
        });
        return;
      }

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", audioBuffer.length);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(audioBuffer);
    } catch (error) {
      console.error("TTS audio synthesis failed:", error);
      res.status(500).json({
        success: false,
        message: "TTS synthesis failed"
      });
    }
  }
}

export const voiceController = new VoiceController();
