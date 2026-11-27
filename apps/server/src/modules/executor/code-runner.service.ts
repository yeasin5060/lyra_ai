import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export interface CodeExecutionResult {
  success: boolean;
  language: "python" | "javascript" | "bash";
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  exitCode: number | null;
}

export class CodeRunnerService {
  /**
   * Executes Python code securely with timeout and returns real stdout/stderr.
   */
  public async executePython(code: string, timeoutMs = 8000): Promise<CodeExecutionResult> {
    const startTime = Date.now();
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `lyra_script_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.py`);

    try {
      // Write python code to temporary file
      await fs.writeFile(tempFile, code, "utf-8");

      return await new Promise<CodeExecutionResult>((resolve) => {
        let stdout = "";
        let stderr = "";

        const child = spawn("python", [tempFile], {
          timeout: timeoutMs,
          env: { ...process.env, PYTHONIOENCODING: "utf-8" }
        });

        child.stdout.on("data", (data) => {
          stdout += data.toString("utf-8");
        });

        child.stderr.on("data", (data) => {
          stderr += data.toString("utf-8");
        });

        child.on("error", (err) => {
          resolve({
            success: false,
            language: "python",
            stdout: stdout.trim(),
            stderr: `Execution error: ${err.message}`,
            executionTimeMs: Date.now() - startTime,
            exitCode: -1
          });
        });

        child.on("close", (code) => {
          resolve({
            success: code === 0,
            language: "python",
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            executionTimeMs: Date.now() - startTime,
            exitCode: code
          });
        });
      });
    } catch (err: any) {
      return {
        success: false,
        language: "python",
        stdout: "",
        stderr: err?.message || "File I/O or execution failure",
        executionTimeMs: Date.now() - startTime,
        exitCode: -1
      };
    } finally {
      // Clean up temp file
      try {
        await fs.unlink(tempFile);
      } catch {}
    }
  }

  /**
   * Executes JavaScript code snippet via Node.js.
   */
  public async executeJavaScript(code: string, timeoutMs = 8000): Promise<CodeExecutionResult> {
    const startTime = Date.now();
    return await new Promise<CodeExecutionResult>((resolve) => {
      let stdout = "";
      let stderr = "";

      const child = spawn("node", ["-e", code], {
        timeout: timeoutMs
      });

      child.stdout.on("data", (data) => {
        stdout += data.toString("utf-8");
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString("utf-8");
      });

      child.on("error", (err) => {
        resolve({
          success: false,
          language: "javascript",
          stdout: stdout.trim(),
          stderr: `Execution error: ${err.message}`,
          executionTimeMs: Date.now() - startTime,
          exitCode: -1
        });
      });

      child.on("close", (code) => {
        resolve({
          success: code === 0,
          language: "javascript",
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          executionTimeMs: Date.now() - startTime,
          exitCode: code
        });
      });
    });
  }

  /**
   * Quick evaluation of mathematical expressions or one-liners.
   */
  public async evalPythonMath(expression: string): Promise<string> {
    const script = `import math\ntry:\n    res = ${expression}\n    print(res)\nexcept Exception as e:\n    print(f"Error: {e}")`;
    const result = await this.executePython(script, 4000);
    return result.stdout || result.stderr || "No output";
  }

  /**
   * Server hardware and operating system metrics.
   */
  public getSystemMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpus = os.cpus();

    return {
      platform: os.platform(),
      osType: os.type(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpuCount: cpus.length,
      cpuModel: cpus[0]?.model || "Generic CPU",
      ramUsedMb: Math.round(usedMem / (1024 * 1024)),
      ramTotalMb: Math.round(totalMem / (1024 * 1024)),
      ramPercent: Math.round((usedMem / totalMem) * 100),
      uptimeHours: Number((os.uptime() / 3600).toFixed(2))
    };
  }
}

export const codeRunnerService = new CodeRunnerService();
