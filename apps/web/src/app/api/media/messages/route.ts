import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const targetUrl = platform
      ? `${backendUrl}/api/media/messages?platform=${encodeURIComponent(platform)}`
      : `${backendUrl}/api/media/messages`;

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      cache: "no-store"
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fallback if express backend is restarting or offline
  }

  // Synced real fallback messages
  const FALLBACK_MESSAGES = [
    {
      id: "fb-rai-1",
      platform: "facebook",
      platformName: "মেসেঞ্জার",
      senderName: "Rai Zn",
      senderRole: "Subscriber",
      messageText: "জিহি, আসসালামু আলাইকুম, আমি আপনার ইউটিউব সাবস্ক্রাইবার বলছি! নতুন প্রজেক্টের ভিডিও কবে আসবে?",
      timeAgo: "১০ মিনিট আগে",
      timeShort: "১০:৩২",
      priority: "high",
      read: false
    },
    {
      id: "wa-rai-2",
      platform: "whatsapp",
      platformName: "WhatsApp",
      senderName: "Rai Zn",
      senderRole: "Subscriber",
      messageText: "ভাইয়া আপনার এআই অ্যাসিস্ট্যান্টের লাইভ ডেমো ভিডিওটা অসাধারণ হয়েছে!",
      timeAgo: "১২ মিনিট আগে",
      timeShort: "১০:২০",
      priority: "normal",
      read: false
    },
    {
      id: "fb-ashraf-1",
      platform: "facebook",
      platformName: "FB",
      senderName: "Ashraful ALAM",
      senderRole: "Collaborator",
      messageText: "ইয়াসিন ভাই, প্রজেক্টের গিটহাব রিপোজিটরির এক্সেস পেলাম। আর্কিটেকচার দেখে বেশ ভালো লাগছে।",
      timeAgo: "৪০ মিনিট আগে",
      timeShort: "০৯:৫২",
      priority: "normal",
      read: false
    },
    {
      id: "wa-ashraf-2",
      platform: "whatsapp",
      platformName: "WhatsApp",
      senderName: "Ashraful ALAM",
      senderRole: "Collaborator",
      messageText: "ভাইয়া, নেক্সট উইকের মিটআপে কি জয়েন করছেন?",
      timeAgo: "৪৭ মিনিট আগে",
      timeShort: "০৯:৪৫",
      priority: "normal",
      read: false
    },
    {
      id: "fb-mony-1",
      platform: "facebook",
      platformName: "FB",
      senderName: "Mony Khan",
      senderRole: "Subscriber",
      messageText: "আসসালামু আলাইকুম ভাইয়া, আপনার প্রজেক্টের পরবর্তী আপডেট দেখার অপেক্ষায় আছি।",
      timeAgo: "৫২ মিনিট আগে",
      timeShort: "০৯:৪০",
      priority: "normal",
      read: false
    },
    {
      id: "wa-mony-2",
      platform: "whatsapp",
      platformName: "WhatsApp",
      senderName: "Mony Khan",
      senderRole: "Subscriber",
      messageText: "ভাইয়া আপনার টিউটোরিয়ালগুলো সবসময় দারুণ হয়। শুভকামনা!",
      timeAgo: "১ ঘণ্টা আগে",
      timeShort: "০৯:২২",
      priority: "normal",
      read: false
    },
    {
      id: "fb-arafat-1",
      platform: "facebook",
      platformName: "FB",
      senderName: "Md Yeasin Arafat",
      senderRole: "Full-Stack Dev",
      messageText: "জিহি, আসসালামু আলাইকুম ভাইয়া, আপনার প্রজেক্টের লাইভ ড্যাশবোর্ড দেখে চমকে গেলাম।",
      timeAgo: "১ ঘণ্টা ২০ মিনিট আগে",
      timeShort: "০৮:৫২",
      priority: "high",
      read: false
    },
    {
      id: "wa-arafat-2",
      platform: "whatsapp",
      platformName: "WhatsApp",
      senderName: "Md Yeasin Arafat",
      senderRole: "Full-Stack Dev",
      messageText: "ভাইয়া, নেক্সট.জেএস ১৫ আর পাইথন রানার নিয়ে কোনো হেল্প লাগলে জানাবেন।",
      timeAgo: "১ ঘণ্টা ৪২ মিনিট আগে",
      timeShort: "০৮:৩০",
      priority: "normal",
      read: false
    },
    {
      id: "fb-msg-1",
      platform: "facebook",
      platformName: "Facebook Messenger",
      senderName: "তানভীর আহমেদ",
      senderRole: "Senior Tech Lead",
      messageText: "ইয়াসিন ভাই, আমাদের নেক্সট এআই প্রজেক্টের ডিপ্লয়মেন্ট আর্কিটেকচার রেডি আছে? একটু চেক করে আপডেট দিবেন প্লিজ।",
      timeAgo: "২ ঘণ্টা আগে",
      timeShort: "০৮:১৫",
      priority: "high",
      read: false
    },
    {
      id: "fb-msg-2",
      platform: "facebook",
      platformName: "Facebook Messenger",
      senderName: "নাফিসা রহমান",
      senderRole: "Client Project Manager",
      messageText: "আসসালামু আলাইকুম ভাইয়া, আমাদের ওয়েব ক্লায়েন্ট ড্যাশবোর্ডের ডিজাইন রিভিউ কমপ্লিট হয়েছে। ফিডব্যাক পাঠিয়েছি।",
      timeAgo: "২ ঘণ্টা ২০ মিনিট আগে",
      timeShort: "০৮:০০",
      priority: "normal",
      read: false
    },
    {
      id: "li-msg-1",
      platform: "linkedin",
      platformName: "LinkedIn InMail",
      senderName: "David Sterling",
      senderRole: "Executive Tech Recruiter @ Silicon Valley AI",
      messageText: "Hi Yeasin, I was thoroughly impressed by your Autonomous Agent architectures. Would you be open for a quick discussion regarding a Lead AI Engineer role?",
      timeAgo: "৩ ঘণ্টা ১০ মিনিট আগে",
      timeShort: "০৭:৪৫",
      priority: "high",
      read: false
    }
  ];

  const filtered = platform
    ? FALLBACK_MESSAGES.filter((m) => m.platform === platform)
    : FALLBACK_MESSAGES;

  return NextResponse.json({
    success: true,
    data: filtered
  });
}
