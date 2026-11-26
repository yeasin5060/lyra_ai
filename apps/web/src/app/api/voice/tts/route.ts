import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

// In-memory cache for instantaneous repeated playback (< 30ms)
const webTtsCache = new Map<string, Buffer>();

async function synthesizeNeuralVoice(text: string, voice: string): Promise<Buffer | null> {
  const cacheKey = `${voice}:${text.trim()}`;
  if (webTtsCache.has(cacheKey)) {
    return webTtsCache.get(cacheKey)!;
  }

  const tempId = `web_tts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const tempInput = path.join(os.tmpdir(), `${tempId}.txt`);
  const tempOutput = path.join(os.tmpdir(), `${tempId}.mp3`);

  const candidateScriptPaths: string[] = [
    path.resolve(process.cwd(), "scripts/neural_tts.py"),
    path.resolve(process.cwd(), "../../scripts/neural_tts.py"),
    path.resolve(process.cwd(), "../scripts/neural_tts.py"),
    path.resolve(process.cwd(), "apps/server/src/modules/voice/edge_tts_helper.py"),
    "D:\\VSCODE\\LYRA AI\\scripts\\neural_tts.py"
  ];

  let scriptPath: string = candidateScriptPaths[0] || "scripts/neural_tts.py";
  for (const p of candidateScriptPaths) {
    try {
      await fs.access(p);
      scriptPath = p;
      break;
    } catch {}
  }

  try {
    await fs.writeFile(tempInput, text, "utf-8");

    const success = await new Promise<boolean>((resolve) => {
      const child = spawn("python", [scriptPath, tempInput, tempOutput, voice], {
        timeout: 9000,
        env: { ...process.env, PYTHONIOENCODING: "utf-8" }
      });

      child.on("error", () => resolve(false));
      child.on("close", (code: number | null) => resolve(code === 0));
    });

    if (success) {
      const buffer = await fs.readFile(tempOutput);
      if (buffer && buffer.length > 0) {
        if (webTtsCache.size > 200) {
          const firstKey = webTtsCache.keys().next().value;
          if (firstKey) webTtsCache.delete(firstKey);
        }
        webTtsCache.set(cacheKey, buffer);
        return buffer;
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    try {
      await fs.unlink(tempInput);
    } catch {}
    try {
      await fs.unlink(tempOutput);
    } catch {}
  }
}

/**
 * High-fidelity Studio-Grade Neural Text-To-Speech API Route
 * Powers LYRA with Microsoft Edge Neural Voices:
 * - Bengali: bn-BD-NabanitaNeural (natural, expressive, sweet, articulate)
 * - English: en-US-AriaNeural (warm, clear, professional female voice)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") || "";
  const lang = searchParams.get("lang") || "bn";

  if (!text.trim()) {
    return NextResponse.json(
      { error: "Text parameter is required" },
      { status: 400 }
    );
  }

  const cleanText = text
    .replace(/[*#_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const isBengali = /[\u0980-\u09FF]/.test(cleanText) || lang === "bn";
  const targetVoice = isBengali ? "bn-BD-NabanitaNeural" : "en-US-AriaNeural";

  // 1. Try Express backend TTS stream if active
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const serverRes = await fetch(
      `${backendUrl}/api/voice/tts?text=${encodeURIComponent(cleanText)}&lang=${isBengali ? "bn" : "en"}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (serverRes.ok) {
      const arrayBuffer = await serverRes.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        return new NextResponse(new Uint8Array(arrayBuffer), {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": arrayBuffer.byteLength.toString(),
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
          }
        });
      }
    }
  } catch {
    // Backend offline or timed out; continue to Next.js local neural synthesizer
  }

  // 2. Synthesize with Neural Voice engine
  try {
    const neuralAudio = await synthesizeNeuralVoice(cleanText, targetVoice);
    if (neuralAudio && neuralAudio.length > 0) {
      return new NextResponse(new Uint8Array(neuralAudio), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": neuralAudio.length.toString(),
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
        }
      });
    }
  } catch (err) {
    console.warn("Local neural voice synthesis warning:", err);
  }

  // 3. Fallback: Google TTS chunking
  try {
    const chunks: string[] = [];
    const sentences = cleanText.split(/([।?!.\n]+)/);

    let currentChunk = "";
    for (const part of sentences) {
      if ((currentChunk + part).length < 150) {
        currentChunk += part;
      } else {
        if (currentChunk.trim()) chunks.push(currentChunk.trim());
        currentChunk = part;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    const targetLang = isBengali ? "bn" : "en";
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodeURIComponent(chunk.trim())}`;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(ttsUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Referer: "https://translate.google.com/"
          },
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (res.ok) {
          const ab = await res.arrayBuffer();
          audioBuffers.push(Buffer.from(ab));
        }
      } catch {}
    }

    if (audioBuffers.length > 0) {
      const combined = Buffer.concat(audioBuffers);
      return new NextResponse(new Uint8Array(combined), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": combined.length.toString(),
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
        }
      });
    }

    return NextResponse.json({ error: "Failed to generate audio" }, { status: 502 });
  } catch (error) {
    console.error("TTS Route Handler error:", error);
    return NextResponse.json({ error: "Internal TTS Error" }, { status: 500 });
  }
}
