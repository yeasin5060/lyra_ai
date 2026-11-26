import type { Request, Response } from "express";
import { llmService } from "./llm.service.js";
import { codeRunnerService } from "../executor/code-runner.service.js";

export class AIController {
  public getModels(_req: Request, res: Response): void {
    const models = llmService.getAvailableModels();
    const activeModel = llmService.getActiveModel();

    res.json({
      success: true,
      data: {
        activeModel,
        models
      }
    });
  }

  public setActiveModel(req: Request, res: Response): void {
    const { model } = req.body as { model?: string };

    if (!model || typeof model !== "string") {
      res.status(400).json({
        success: false,
        message: "Model identifier is required"
      });
      return;
    }

    const result = llmService.setActiveModel(model);
    res.json({
      success: result.success,
      data: {
        activeModel: result.activeModel
      }
    });
  }

  public async chat(req: Request, res: Response): Promise<void> {
    const { message, history, model, language } = req.body as {
      message?: string;
      history?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
      model?: string;
      language?: "bn" | "en" | "auto";
    };

    if (!message || typeof message !== "string") {
      res.status(400).json({
        success: false,
        message: "Message string is required"
      });
      return;
    }

    try {
      const response = await llmService.generateReply(message, history || [], {
        model,
        language
      });

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error("AI Controller Chat error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate AI response"
      });
    }
  }

  public async executeCode(req: Request, res: Response): Promise<void> {
    const { code, language = "python", expression } = req.body as {
      code?: string;
      language?: "python";
      expression?: string;
    };

    try {
      if (expression && typeof expression === "string") {
        const mathResult = await codeRunnerService.evalPythonMath(expression);
        res.json({
          success: true,
          data: {
            output: mathResult,
            expression
          }
        });
        return;
      }

      if (!code || typeof code !== "string") {
        res.status(400).json({
          success: false,
          message: "Code snippet or expression is required"
        });
        return;
      }

      const result = await codeRunnerService.executePython(code);
      res.json({
        success: result.success,
        data: result
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err?.message || "Execution failed"
      });
    }
  }
}

export const aiController = new AIController();
