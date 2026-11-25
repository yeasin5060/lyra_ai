import { NextRequest, NextResponse } from "next/server";

/**
 * High-fidelity Bengali & Multilingual Text-To-Speech API Route
 * Uses Google TTS audio chunking to produce crisp, natural female Bengali speech
 * without requiring the Express server on port 5000.
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

  try {
    const cleanText = text
      .replace(/[*#_`~]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Split text into chunks <= 150 chars to avoid TTS limits
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

    const targetLang = lang === "bn" ? "bn" : "en";
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodeURIComponent(chunk.trim())}`;
      
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

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
      } catch (e) {
        console.warn("Next.js TTS chunk fetch warning:", e);
      }
    }

    if (audioBuffers.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate audio stream" },
        { status: 502 }
      );
    }

    const combined = Buffer.concat(audioBuffers);

    return new NextResponse(combined, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": combined.length.toString(),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
      }
    });
  } catch (error) {
    console.error("Next.js TTS Route Handler error:", error);
    return NextResponse.json(
      { error: "Internal TTS Error" },
      { status: 500 }
    );
  }
}
