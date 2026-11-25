import type { Request, Response } from "express";
import { integrationsService } from "./integrations.service.js";

export class IntegrationsController {
  public getProfile(_req: Request, res: Response): void {
    const profile = integrationsService.getUserProfile();
    const accounts = integrationsService.getAllAccounts();
    res.json({
      success: true,
      data: {
        profile,
        accounts
      }
    });
  }

  public getAccounts(_req: Request, res: Response): void {
    const accounts = integrationsService.getAllAccounts();
    res.json({ success: true, data: accounts });
  }

  public updateAccount(req: Request, res: Response): void {
    const rawId = req.params.id;
    const platformId = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!platformId) {
      res.status(400).json({ success: false, message: "Platform ID is required" });
      return;
    }

    const { token, username, profileUrl } = req.body as {
      token?: string;
      username?: string;
      profileUrl?: string;
    };

    const updated = integrationsService.updateAccountCredentials(platformId, {
      token,
      username,
      profileUrl
    });

    if (!updated) {
      res.status(404).json({ success: false, message: "Platform not found" });
      return;
    }

    res.json({ success: true, data: updated });
  }
}

export const integrationsController = new IntegrationsController();
