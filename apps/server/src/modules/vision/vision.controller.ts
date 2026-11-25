import type { Request, Response } from "express";
import { visionIntelligenceService } from "./vision.service.js";

export class VisionController {
  public async scanFrame(req: Request, res: Response): Promise<void> {
    try {
      const { imageBase64, prompt, mode } = req.body || {};
      const result = await visionIntelligenceService.analyzeCameraFrame(
        imageBase64,
        prompt,
        mode
      );
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error("Vision scan controller error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process visual frame"
      });
    }
  }

  public getStatus(req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      data: {
        engine: "LYRA Quantum Multimodal Optical Vision",
        capabilities: ["Face Recognition", "Brother Detection", "Emotion Analysis", "Environment Tracking"],
        status: "Active & Ready"
      }
    });
  }
}

export const visionController = new VisionController();
