export interface InboundMessage {
  id: string;
  platform: "facebook" | "whatsapp" | "instagram" | "gmail" | "linkedin" | "twitter";
  platformName: string;
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  messageText: string;
  timeAgo: string;
  priority: "high" | "normal";
  read: boolean;
}

// Synced inbound messages for Yeasin Munshi's verified accounts:
// Facebook Messenger (yeasin.munshi.980) & LinkedIn (yeasin-munshi-aa7467288)
export const INBOUND_MESSAGES: InboundMessage[] = [
  {
    id: "fb-msg-1",
    platform: "facebook",
    platformName: "Facebook Messenger",
    senderName: "তানভীর আহমেদ",
    senderRole: "Senior Tech Lead",
    messageText: "ইয়াসিন ভাই, আমাদের নেক্সট এআই প্রজেক্টের ডিপ্লয়মেন্ট আর্কিটেকচার রেডি আছে? একটু চেক করে আপডেট দিবেন প্লিজ।",
    timeAgo: "১০ মিনিট আগে",
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
    timeAgo: "৩৫ মিনিট আগে",
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
    timeAgo: "২ ঘণ্টা আগে",
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
    timeAgo: "২৫ মিনিট আগে",
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
    timeAgo: "১ ঘণ্টা আগে",
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
    timeAgo: "৩ ঘণ্টা আগে",
    priority: "normal",
    read: false
  }
];
