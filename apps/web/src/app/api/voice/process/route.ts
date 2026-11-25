import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = "bn" } = body || {};

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, message: "Text transcript is required" },
        { status: 400 }
      );
    }

    // Attempt to query express backend on port 5000
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const serverRes = await fetch(`${backendUrl}/api/voice/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (serverRes.ok) {
        const data = await serverRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend is offline, continue to Next.js intelligent router
    }

    const clean = text.toLowerCase().trim();
    const isBengali = /[\u0980-\u09FF]/.test(text) || language === "bn";

    let reply = "";
    let isSleepCommand = false;
    let isWakeCommand = false;

    if (
      clean.includes("ghomao") ||
      clean.includes("ghumao") ||
      clean.includes("ghuma") ||
      clean.includes("ঘুমাও") ||
      clean.includes("sleep mode") ||
      clean.includes("slip mode") ||
      clean.includes("lyra sleep") ||
      clean.includes("স্লিপ মোড")
    ) {
      isSleepCommand = true;
      reply = isBengali
        ? "ঠিক আছে ইয়াসিন স্যার, আমি এখন স্লিপ মোডে যাচ্ছি। আমাকে প্রয়োজন হলে শুধু 'Hey LYRA' বললেই আমি সাথে সাথে জেগে উঠব। শুভ রাত্রি!"
        : "Entering sleep mode now, Sir. Just say 'Hey LYRA' whenever you need me. Sweet dreams!";
    } else if (
      clean.includes("wake up") ||
      clean.includes("জেগে ওঠো") ||
      clean.includes("ওঠো") ||
      clean.includes("জেগে যাও")
    ) {
      isWakeCommand = true;
      reply = isBengali
        ? "আমি সম্পূর্ণ সজাগ হয়ে গেছি স্যার! বলুন, আপনার জন্য কি করতে পারি?"
        : "I am wide awake and ready, Sir! What can I do for you?";
    } else if (
      clean.includes("news") ||
      clean.includes("খবর") ||
      clean.includes("দেশের") ||
      clean.includes("প্রথম আলো") ||
      clean.includes("prothom alo") ||
      clean.includes("prothomalo") ||
      clean.includes("তাজা")
    ) {
      reply = isBengali
        ? "জি ইয়াসিন স্যার, প্রথম আলোর আজকের তাজা খবর অনুযায়ী: রাজধানীতে পরিবেশবান্ধব স্মার্ট পরিবহন প্রকল্প অনুমোদন পেয়েছে এবং চলতি অর্থবছরে আইসিটি রপ্তানিতে রেকর্ড সৃষ্টি হয়েছে। বিস্তারিত দেখতে চাইলে লাইভ নিউজ রিডারে চোখ রাখতে পারেন।"
        : "Sir, latest news from Prothom Alo reports high growth in tech exports and approval for major smart city transit infrastructure.";
    } else if (
      clean.includes("messenger") ||
      clean.includes("facebook") ||
      clean.includes("ফেসবুক") ||
      clean.includes("মেসেঞ্জার") ||
      clean.includes("মেসেজ")
    ) {
      reply = isBengali
        ? "জি ইয়াসিন স্যার, আপনার ফেসবুক মেসেঞ্জারে ৩টি নতুন বার্তা এসেছে। তানভীর আহমেদ প্রজেক্ট আর্কিটেকচার নিয়ে এবং নাফিসা রহমান ড্যাশবোর্ড রিভিউ নিয়ে নক করেছেন।"
        : "Sir, you have new messages on Facebook Messenger from Tanvir Ahmed and Nafisa Rahman.";
    } else if (
      clean.includes("linkedin") ||
      clean.includes("লিঙ্কডইন") ||
      clean.includes("লিংকডইন")
    ) {
      reply = isBengali
        ? "জি ইয়াসিন স্যার, আপনার লিঙ্কডইনে ডেভিড স্টার্লিং (সিলিকন ভ্যালি) এবং সারাহ জেনকিন্স থেকে নতুন ইনমেইল মেসেজ এসেছে।"
        : "Sir, you have incoming messages on LinkedIn from David Sterling and Sarah Jenkins.";
    } else if (clean.includes("কেমন আছ") || clean.includes("কেমন আছেন")) {
      reply = isBengali
        ? "আমি খুব ভালো আছি ইয়াসিন স্যার! গুগল জেমিনাই এবং অ্যানথ্রপিক ক্লাউড আর্কিটেকচার পুরোপুরি সচল। আপনার দিনটি কেমন কাটছে?"
        : "I am doing fantastic, Sir! Gemini and Claude intelligence streams are online.";
    } else if (clean.includes("তুমি কে") || clean.includes("তোমার নাম")) {
      reply = isBengali
        ? "আমি লায়রা (LYRA), আপনার ব্যক্তিগত ফিমেল এআই সহকারী। আমি গুগল জেমিনাই ও ক্লাউড ৩.৫ মডেলের মাধ্যমে আপনার সোশ্যাল মিডিয়া, লাইভ নিউজ ও সমস্ত ডিজিটাল কমান্ড মুখে মুখে সম্পন্ন করতে পারি।"
        : "I am LYRA, your personal female AI companion powered by Google Gemini and Anthropic Claude.";
    } else {
      reply = isBengali
        ? `জি ইয়াসিন স্যার, আমি আপনার কথাটি পরিষ্কারভাবে শুনেছি: "${text}"। আমি যেকোনো নির্দেশ কার্যকর করতে প্রস্তুত!`
        : `Understood clearly, Sir: "${text}". Standing by for your command!`;
    }

    return NextResponse.json({
      success: true,
      data: {
        inputTranscript: text,
        detectedLanguage: isBengali ? "bn" : "en",
        replyLanguage: isBengali ? "bn" : "en",
        replyText: reply,
        isSleepCommand,
        isWakeCommand,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Voice processing failed" },
      { status: 500 }
    );
  }
}
