import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { worldIntelligenceService } from "../world/world.service.js";
import { mediaPlatformService } from "../media/media.service.js";

export interface AgentToolResult {
  toolName: string;
  success: boolean;
  data: any;
  summary: string;
}

export interface SystemInfoMetrics {
  platform: string;
  osType: string;
  release: string;
  arch: string;
  hostname: string;
  cpus: { model: string; speed: number; count: number };
  memory: {
    totalMb: number;
    freeMb: number;
    usedMb: number;
    usagePercent: number;
  };
  uptimeHours: number;
  nodeVersion: string;
}

export class AgentToolsService {
  /**
   * Real-time Multi-Source Web Search:
   * Queries Wikipedia (Bangla & English), Google News BD RSS, and DuckDuckGo
   * to retrieve factual information on any topic, person, science, tech, or event.
   */
  public async searchWeb(query: string, lang: "bn" | "en" = "bn"): Promise<AgentToolResult> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return {
        toolName: "web_search",
        success: false,
        data: null,
        summary: "Empty search query provided."
      };
    }

    try {
      // 1. Wikipedia Summary API (High quality, neutral factual data)
      const wikiLangs = lang === "bn" ? ["bn", "en"] : ["en", "bn"];
      for (const wLang of wikiLangs) {
        try {
          const wikiUrl = `https://${wLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(wikiUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) LYRA-AI-Bot/1.0" },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (data.extract && data.extract.length > 30) {
              return {
                toolName: "web_search",
                success: true,
                data: {
                  title: data.title,
                  extract: data.extract,
                  url: data.content_urls?.desktop?.page || `https://${wLang}.wikipedia.org`,
                  source: `Wikipedia (${wLang.toUpperCase()})`
                },
                summary: data.extract
              };
            }
          }
        } catch {
          // Continue to next source
        }
      }

      // 2. Google News Search for real-time topical queries
      try {
        const newsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(cleanQuery)}&hl=${lang === "bn" ? "bn" : "en-US"}&gl=BD&ceid=BD:${lang === "bn" ? "bn" : "en"}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(newsUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) LYRA-AI-Bot/1.0" },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const xml = await res.text();
          const titleMatches = [...xml.matchAll(/<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>/g)].slice(0, 3);
          if (titleMatches.length > 0) {
            const articles = titleMatches.map((m) => ({
              title: m[1]!.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
              url: m[2]!.replace(/<!\[CDATA\[|\]\]>/g, "").trim()
            }));
            const summary = articles.map((a, i) => `${i + 1}. ${a.title}`).join("\n");
            return {
              toolName: "web_search",
              success: true,
              data: { articles, source: "Google News Realtime" },
              summary
            };
          }
        }
      } catch {
        // Fallback
      }

      // 3. Fallback to worldIntelligenceService
      const genericResult = await worldIntelligenceService.searchWeb(cleanQuery, lang);
      return {
        toolName: "web_search",
        success: true,
        data: genericResult,
        summary: genericResult.snippet
      };
    } catch (err: any) {
      return {
        toolName: "web_search",
        success: false,
        data: null,
        summary: `Search lookup failed: ${err?.message || "Network timeout"}`
      };
    }
  }

  /**
   * Live Python 3 Code Execution (ChatGPT Advanced Data Analysis / Code Interpreter).
   */
  public async executePython(code: string, timeoutMs = 9000): Promise<AgentToolResult> {
    const startTime = Date.now();
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `lyra_agent_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.py`);

    try {
      await fs.writeFile(tempFile, code, "utf-8");

      return await new Promise<AgentToolResult>((resolve) => {
        let stdout = "";
        let stderr = "";

        const child = spawn("python", [tempFile], {
          timeout: timeoutMs,
          env: { ...process.env, PYTHONIOENCODING: "utf-8" }
        });

        child.stdout.on("data", (d) => {
          stdout += d.toString("utf-8");
        });
        child.stderr.on("data", (d) => {
          stderr += d.toString("utf-8");
        });

        child.on("error", (err) => {
          resolve({
            toolName: "execute_python",
            success: false,
            data: { stdout, stderr: err.message, executionTimeMs: Date.now() - startTime },
            summary: `Error: ${err.message}`
          });
        });

        child.on("close", (codeVal) => {
          const success = codeVal === 0;
          const output = stdout.trim() || stderr.trim() || "Script finished with no console output.";
          resolve({
            toolName: "execute_python",
            success,
            data: {
              stdout: stdout.trim(),
              stderr: stderr.trim(),
              exitCode: codeVal,
              executionTimeMs: Date.now() - startTime
            },
            summary: output
          });
        });
      });
    } catch (err: any) {
      return {
        toolName: "execute_python",
        success: false,
        data: null,
        summary: `Python file execution error: ${err?.message}`
      };
    } finally {
      try {
        await fs.unlink(tempFile);
      } catch {}
    }
  }

  /**
   * Live JavaScript / Node.js Code Execution.
   */
  public async executeJavaScript(code: string, timeoutMs = 8000): Promise<AgentToolResult> {
    const startTime = Date.now();
    try {
      return await new Promise<AgentToolResult>((resolve) => {
        let stdout = "";
        let stderr = "";

        const child = spawn("node", ["-e", code], {
          timeout: timeoutMs
        });

        child.stdout.on("data", (d) => {
          stdout += d.toString("utf-8");
        });
        child.stderr.on("data", (d) => {
          stderr += d.toString("utf-8");
        });

        child.on("error", (err) => {
          resolve({
            toolName: "execute_javascript",
            success: false,
            data: { stdout, stderr: err.message, executionTimeMs: Date.now() - startTime },
            summary: `Error: ${err.message}`
          });
        });

        child.on("close", (codeVal) => {
          const success = codeVal === 0;
          const output = stdout.trim() || stderr.trim() || "Node.js snippet finished with no output.";
          resolve({
            toolName: "execute_javascript",
            success,
            data: {
              stdout: stdout.trim(),
              stderr: stderr.trim(),
              exitCode: codeVal,
              executionTimeMs: Date.now() - startTime
            },
            summary: output
          });
        });
      });
    } catch (err: any) {
      return {
        toolName: "execute_javascript",
        success: false,
        data: null,
        summary: `Node.js execution failed: ${err?.message}`
      };
    }
  }

  /**
   * Mathematical and Scientific Evaluation in Python Kernel.
   */
  public async evalMath(expression: string): Promise<AgentToolResult> {
    const script = `
import math
try:
    res = ${expression}
    print(res)
except Exception as e:
    print(f"Error: {e}")
`;
    const execRes = await this.executePython(script, 4000);
    return {
      toolName: "eval_math",
      success: execRes.success,
      data: { expression, output: execRes.summary },
      summary: execRes.summary
    };
  }

  /**
   * Live Weather Intelligence via Open-Meteo API.
   */
  public async getLiveWeather(city = "Dhaka", lang: "bn" | "en" = "bn"): Promise<AgentToolResult> {
    try {
      const weather = await worldIntelligenceService.getLiveWeather(city, lang);
      return {
        toolName: "get_live_weather",
        success: true,
        data: weather,
        summary: weather.spokenSummary
      };
    } catch (err: any) {
      return {
        toolName: "get_live_weather",
        success: false,
        data: null,
        summary: `Weather service error: ${err?.message}`
      };
    }
  }

  /**
   * Real-time Prothom Alo & National Breaking News.
   */
  public async getLiveNews(lang: "bn" | "en" = "bn"): Promise<AgentToolResult> {
    try {
      const news = await worldIntelligenceService.getProthomAloNews(lang);
      return {
        toolName: "get_live_news",
        success: true,
        data: news.articles,
        summary: news.spokenSummary
      };
    } catch (err: any) {
      return {
        toolName: "get_live_news",
        success: false,
        data: null,
        summary: `News service error: ${err?.message}`
      };
    }
  }

  /**
   * Hardware, OS & System Resource Metrics.
   */
  public getSystemMetrics(): SystemInfoMetrics {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      platform: os.platform(),
      osType: os.type(),
      release: os.release(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpus: {
        model: cpus[0]?.model || "Generic CPU",
        speed: cpus[0]?.speed || 0,
        count: cpus.length
      },
      memory: {
        totalMb: Math.round(totalMem / (1024 * 1024)),
        freeMb: Math.round(freeMem / (1024 * 1024)),
        usedMb: Math.round(usedMem / (1024 * 1024)),
        usagePercent: Math.round((usedMem / totalMem) * 100)
      },
      uptimeHours: Number((os.uptime() / 3600).toFixed(2)),
      nodeVersion: process.version
    };
  }

  /**
   * System Info Tool Handler.
   */
  public async getSystemInfo(lang: "bn" | "en" = "bn"): Promise<AgentToolResult> {
    const metrics = this.getSystemMetrics();
    const summary =
      lang === "bn"
        ? `জি ইয়াসিন স্যার, সার্ভার সিস্টেম রিয়েলটাইম স্ট্যাটাস: সিপিইউ: ${metrics.cpus.count} কোর (${metrics.cpus.model}), ব্যবহৃত র‍্যাম: ${metrics.memory.usedMb}MB / ${metrics.memory.totalMb}MB (${metrics.memory.usagePercent}%), অপারেটিং সিস্টেম: ${metrics.osType} (${metrics.arch}), আপটাইম: ${metrics.uptimeHours} ঘণ্টা।`
        : `System status: CPU ${metrics.cpus.count} Cores (${metrics.cpus.model}), RAM Usage: ${metrics.memory.usedMb}MB / ${metrics.memory.totalMb}MB (${metrics.memory.usagePercent}%), OS: ${metrics.osType} (${metrics.arch}), Node: ${metrics.nodeVersion}.`;

    return {
      toolName: "get_system_info",
      success: true,
      data: metrics,
      summary
    };
  }

  /**
   * Safe Workspace File Reader.
   */
  public async readWorkspaceFile(relativeFilePath: string): Promise<AgentToolResult> {
    const workspaceRoot = process.cwd();
    const safePath = path.resolve(workspaceRoot, relativeFilePath);

    // Prevent directory traversal attacks
    if (!safePath.startsWith(workspaceRoot)) {
      return {
        toolName: "read_workspace_file",
        success: false,
        data: null,
        summary: "Access denied: File outside workspace directory."
      };
    }

    try {
      const content = await fs.readFile(safePath, "utf-8");
      return {
        toolName: "read_workspace_file",
        success: true,
        data: {
          filePath: relativeFilePath,
          sizeBytes: content.length,
          preview: content.slice(0, 1000)
        },
        summary: content.slice(0, 800)
      };
    } catch (err: any) {
      return {
        toolName: "read_workspace_file",
        success: false,
        data: null,
        summary: `Could not read file "${relativeFilePath}": ${err?.message}`
      };
    }
  }

  /**
   * Connected Social and Messaging Channels.
   */
  public getSocialUpdates(lang: "bn" | "en" = "bn"): AgentToolResult {
    const messages = mediaPlatformService.getAllInboundMessages().slice(0, 8);
    const summary =
      lang === "bn"
        ? "জি ইয়াসিন স্যার, আপনার ফেসবুক মেসেঞ্জার এবং লিঙ্কডইন সফলভাবে কানেক্টেড রয়েছে। নতুন বার্তাগুলি স্ক্রিনে প্রদর্শিত হয়েছে।"
        : "Sir, your Facebook Messenger and LinkedIn feeds are active with recent incoming communications.";

    return {
      toolName: "get_social_updates",
      success: true,
      data: messages,
      summary
    };
  }
}

export const agentToolsService = new AgentToolsService();
