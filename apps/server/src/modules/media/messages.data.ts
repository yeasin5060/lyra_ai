export interface InboundMessage {
  id: string;
  platform: "facebook" | "whatsapp" | "instagram" | "gmail" | "linkedin" | "twitter";
  platformName: string;
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  messageText: string;
  timeAgo: string;
  timeShort?: string;
  priority: "high" | "normal";
  read: boolean;
}

export interface EventLog {
  id: string;
  time: string;
  text: string;
  type: "msg" | "social" | "sys" | "media";
}

export interface DashboardStats {
  inboxCount: number;
  unreadCount: number;
  newChatsCount: number;
  claude: {
    status: string;
    latency: string;
    memory: string;
    rps: string;
    percentage: number;
  };
  voice: {
    status: string;
    latency: string;
    charsUsed: string;
    charsLimit: string;
    delivery: string;
    percentage: number;
  };
}

// Synced inbound messages for Yeasin Munshi's verified accounts:
// Facebook Messenger (yeasin.munshi.980), WhatsApp & LinkedIn (yeasin-munshi-aa7467288)
export const INBOUND_MESSAGES: InboundMessage[] = [
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
    id: "fb-rai-2",
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
    id: "fb-msg-3",
    platform: "facebook",
    platformName: "Facebook Messenger",
    senderName: "সাব্বির হোসেন",
    senderRole: "Collaborator",
    messageText: "ভাইয়া, ফ্রিল্যান্স এআই প্রজেক্টের বাজেট আর ডেডলাইন কনফার্ম করা হয়েছে। কবে থেকে শুরু করবেন?",
    timeAgo: "৩ ঘণ্টা আগে",
    timeShort: "০৭:৫০",
    priority: "normal",
    read: false
  },
  {
    id: "li-msg-1",
    platform: "linkedin",
    platformName: "LinkedIn InMail",
    senderName: "David Sterling",
    senderRole: "Executive Tech Recruiter @ Silicon Valley AI",
    messageText: "Hi Yeasin, I was thoroughly impressed by your Autonomous Agent architectures and Full-Stack AI engineering portfolio. Would you be open for a quick discussion regarding a Lead AI Engineer role?",
    timeAgo: "৩ ঘণ্টা ১০ মিনিট আগে",
    timeShort: "০৭:৪৫",
    priority: "high",
    read: false
  },
  {
    id: "li-msg-2",
    platform: "linkedin",
    platformName: "LinkedIn InMail",
    senderName: "Sarah Jenkins",
    senderRole: "Head of AI Products @ CloudSphere",
    messageText: "Hello Yeasin! Loved your recent LinkedIn updates regarding Next.js 15 and AI Voice systems. We'd love to invite you to collaborate on our next enterprise AI pipeline.",
    timeAgo: "৪ ঘণ্টা আগে",
    timeShort: "০৬:৩০",
    priority: "high",
    read: false
  },
  {
    id: "li-msg-3",
    platform: "linkedin",
    platformName: "LinkedIn Connect",
    senderName: "শাহরিয়ার কবির",
    senderRole: "Founder @ DevNation Bangladesh",
    messageText: "ইয়াসিন ভাই, আপনার লিঙ্কডইন কানেকশন রিকোয়েস্ট একসেপ্ট করেছি। আগামী মাসের এআই মিটআপে একজন কি-নোট স্পিকার হিসেবে আপনাকে চাই।",
    timeAgo: "৫ ঘণ্টা আগে",
    timeShort: "০৫:১৫",
    priority: "normal",
    read: false
  }
];

export const LIVE_EVENTS: EventLog[] = [
  { id: "1", time: "10:14 PM", text: "তানভীর আহমেদকে টেক্সট করা হয়েছে...", type: "msg" },
  { id: "2", time: "10:12 PM", text: "নতুন ফেসবুক ফ্রেন্ড রিকোয়েস্ট গৃহীত", type: "social" },
  { id: "3", time: "10:08 PM", text: "আজ রাত ১১টায় সাক্ষাৎকার অনুষ্ঠিত হবে", type: "media" },
  { id: "4", time: "10:05 PM", text: "সার্ভার ব্যাকআপ সম্পন্ন: database ok", type: "sys" },
  { id: "5", time: "09:50 PM", text: "প্রথম আলো লাইভ নিউজ হেডলাইন সিঙ্কড", type: "media" }
];

export const DASHBOARD_STATS: DashboardStats = {
  inboxCount: 26,
  unreadCount: 72,
  newChatsCount: 34,
  claude: {
    status: "Active",
    latency: "১.১s",
    memory: "২২%",
    rps: "১২ রিক/মি",
    percentage: 37
  },
  voice: {
    status: "Active",
    latency: "০.৩s",
    charsUsed: "১,৫০২",
    charsLimit: "১৫,০০০",
    delivery: "৯৯.৭%",
    percentage: 81
  }
};
