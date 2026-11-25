import { NextRequest, NextResponse } from "next/server";

// In-memory active model for the frontend session
let activeAIModel = "gemini-2.0-flash";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      activeModel: activeAIModel,
      models: [
        {
          id: "gemini-2.0-flash",
          name: "Google Gemini 2.0 Flash",
          provider: "google",
          description: "Superfast multimodal Bengali reasoning & instant voice turnaround",
          latency: "0.4s",
          badge: "RECOMMENDED"
        },
        {
          id: "claude-3-5-sonnet",
          name: "Anthropic Claude 3.5 Sonnet",
          provider: "anthropic",
          description: "Nuanced cognitive intelligence and sophisticated conversation",
          latency: "1.1s",
          badge: "DEEP THINKING"
        },
        {
          id: "gemini-1.5-pro",
          name: "Google Gemini 1.5 Pro",
          provider: "google",
          description: "Long-context reasoning and extensive world knowledge",
          latency: "1.4s",
          badge: "RESEARCH"
        }
      ]
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const model = body?.model;
    if (model && typeof model === "string") {
      activeAIModel = model;

      // Also notify backend server if reachable
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        await fetch(`${backendUrl}/api/ai/model`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model })
        }).catch(() => {});
      } catch {}

      return NextResponse.json({
        success: true,
        data: { activeModel: activeAIModel }
      });
    }

    return NextResponse.json(
      { success: false, message: "Valid model ID is required" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update model" },
      { status: 500 }
    );
  }
}
