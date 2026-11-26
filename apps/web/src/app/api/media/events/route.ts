import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${backendUrl}/api/media/events`, {
      signal: controller.signal,
      cache: "no-store"
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fallback
  }

  return NextResponse.json({
    success: true,
    data: [
      { id: "1", time: "10:14 PM", text: "তানভীর আহমেদকে টেক্সট করা হয়েছে...", type: "msg" },
      { id: "2", time: "10:12 PM", text: "নতুন ফেসবুক ফ্রেন্ড রিকোয়েস্ট গৃহীত", type: "social" },
      { id: "3", time: "10:08 PM", text: "আজ রাত ১১টায় সাক্ষাৎকার অনুষ্ঠিত হবে", type: "media" },
      { id: "4", time: "10:05 PM", text: "সার্ভার ব্যাকআপ সম্পন্ন: database ok", type: "sys" },
      { id: "5", time: "09:50 PM", text: "প্রথম আলো লাইভ নিউজ হেডলাইন সিঙ্কড", type: "media" }
    ]
  });
}
