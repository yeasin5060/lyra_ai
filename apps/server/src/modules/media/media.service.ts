import type { AllMediaOverview, PlatformStats } from "./media.types.js";
import { INBOUND_MESSAGES, type InboundMessage } from "./messages.data.js";

export class MediaPlatformService {
  private platforms: PlatformStats[] = [
    {
      id: "facebook",
      name: "Facebook",
      category: "social",
      username: "Yeasin Munshi (@yeasin.munshi.980)",
      status: "connected",
      followersOrSubscribers: "Profile Synced",
      unreadCount: 0,
      highlightStat: "https://www.facebook.com/yeasin.munshi.980/",
      latestActivity: "Active Facebook Messenger & Profile integration",
      accentColor: "#1877F2",
      summaryBangla: "স্যার, আপনার ফেসবুক প্রোফাইল (Yeasin Munshi) সফলভাবে সংযুক্ত আছে। প্রোফাইল লিংক: yeasin.munshi.980। কোনো নতুন মেসেজ এলে আমি সাথে সাথে বলে দেব।",
      summaryEnglish: "Sir, your Facebook profile (Yeasin Munshi @yeasin.munshi.980) is connected and synchronized."
    },
    {
      id: "instagram",
      name: "Instagram",
      category: "social",
      username: "Not Connected",
      status: "disconnected",
      followersOrSubscribers: "Not Linked",
      unreadCount: 0,
      highlightStat: "Account Not Linked",
      latestActivity: "Waiting for Instagram account authorization",
      accentColor: "#E4405F",
      summaryBangla: "আপনার ইনস্টাগ্রাম অ্যাকাউন্টটি এখনো সংযুক্ত করা হয়নি। কানেক্ট করার পর আমি ডিএম ও স্টোরির সব আপডেট দিয়ে দেব।",
      summaryEnglish: "Your Instagram account is not connected yet. Once connected, I will track your DMs and story metrics."
    },
    {
      id: "youtube",
      name: "YouTube",
      category: "video",
      username: "Not Connected",
      status: "disconnected",
      followersOrSubscribers: "Not Linked",
      unreadCount: 0,
      highlightStat: "Account Not Linked",
      latestActivity: "Waiting for YouTube Studio authorization",
      accentColor: "#FF0000",
      summaryBangla: "আপনার ইউটিউব চ্যানেলটি এখনো সংযুক্ত করা হয়নি। কানেক্ট করার পর আমি ভিউ, সাবস্ক্রাইবার ও আয়ের হিসাব জানিয়ে দিতে পারব।",
      summaryEnglish: "Your YouTube channel is not connected yet. Once connected, I will monitor views, subscribers, and analytics."
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      category: "messaging",
      username: "Not Connected",
      status: "disconnected",
      followersOrSubscribers: "Not Linked",
      unreadCount: 0,
      highlightStat: "Account Not Linked",
      latestActivity: "Waiting for WhatsApp QR scan or pairing",
      accentColor: "#25D366",
      summaryBangla: "আপনার হোয়াটসঅ্যাপ এখনো সংযুক্ত করা হয়নি। কানেক্ট করার পর নতুন কোনো মেসেজ এলে আমি সাথে সাথে বলে দেব।",
      summaryEnglish: "Your WhatsApp is not connected yet. Once paired, I will notify and read incoming messages instantly."
    },
    {
      id: "gmail",
      name: "Gmail",
      category: "productivity",
      username: "Not Connected",
      status: "disconnected",
      followersOrSubscribers: "Not Linked",
      unreadCount: 0,
      highlightStat: "Account Not Linked",
      latestActivity: "Waiting for Google Workspace authorization",
      accentColor: "#EA4335",
      summaryBangla: "আপনার জিমেইল অ্যাকাউন্টটি এখনো সংযুক্ত করা হয়নি। কানেক্ট করার পর গুরুত্বপূর্ণ মেইল আসলে আমি জানিয়ে দেব।",
      summaryEnglish: "Your Gmail account is not connected yet. Connect it to allow priority email alerts and summarization."
    },
    {
      id: "calendar",
      name: "Google Calendar",
      category: "productivity",
      username: "Not Connected",
      status: "disconnected",
      followersOrSubscribers: "Not Linked",
      unreadCount: 0,
      highlightStat: "Account Not Linked",
      latestActivity: "Waiting for Calendar synchronization",
      accentColor: "#4285F4",
      summaryBangla: "আপনার গুগল ক্যালেন্ডার এখনো সংযুক্ত করা হয়নি। কানেক্ট করার পর আজকের শিডিউল ও মিটিং আমি বলে দিতে পারব।",
      summaryEnglish: "Google Calendar is not connected yet. Link your calendar to hear your schedule and meeting reminders."
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      category: "social",
      username: "Yeasin Munshi (@yeasin-munshi-aa7467288)",
      status: "connected",
      followersOrSubscribers: "Network Synced",
      unreadCount: 0,
      highlightStat: "https://www.linkedin.com/in/yeasin-munshi-aa7467288/",
      latestActivity: "Professional AI Engineering Network active",
      accentColor: "#0A66C2",
      summaryBangla: "স্যার, আপনার লিঙ্কডইন প্রোফাইল (Yeasin Munshi) সংযুক্ত রয়েছে। আপনার প্রফেশনাল নেটওয়ার্ক ও মেসেজ সম্পূর্ণ সিঙ্ক করা।",
      summaryEnglish: "Sir, your LinkedIn profile (Yeasin Munshi @yeasin-munshi-aa7467288) is connected and fully monitored."
    },
    {
      id: "spotify",
      name: "Spotify",
      category: "music",
      username: "Not Connected",
      status: "disconnected",
      followersOrSubscribers: "Not Linked",
      unreadCount: 0,
      highlightStat: "Account Not Linked",
      latestActivity: "Waiting for Spotify OAuth",
      accentColor: "#1DB954",
      summaryBangla: "আপনার স্পটিফাই অ্যাকাউন্টটি এখনো সংযুক্ত করা হয়নি। কানেক্ট করার পর আমি ব্যাকগ্রাউন্ডে গান প্লে ও মিউজিক কন্ট্রোল করতে পারব।",
      summaryEnglish: "Spotify is not connected yet. Connect your account to play music and stream lo-fi beats."
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      category: "social",
      username: "Not Connected",
      status: "disconnected",
      followersOrSubscribers: "Not Linked",
      unreadCount: 0,
      highlightStat: "Account Not Linked",
      latestActivity: "Waiting for X developer authorization",
      accentColor: "#1DA1F2",
      summaryBangla: "আপনার টুইটার বা এক্স অ্যাকাউন্টটি এখনো সংযুক্ত করা হয়নি। কানেক্ট করার পর মেনশন ও ট্রেন্ডিং টপিক জানিয়ে দেব।",
      summaryEnglish: "Your X (Twitter) account is not connected yet. Connect your account to track mentions and trending topics."
    }
  ];

  public getAllPlatforms(): AllMediaOverview {
    const totalUnread = this.platforms.reduce((acc, p) => acc + p.unreadCount, 0);
    return {
      totalPlatforms: this.platforms.length,
      totalUnreadNotifications: totalUnread,
      activeMediaStream: "No active media stream",
      platforms: this.platforms
    };
  }

  public getPlatformById(id: string): PlatformStats | undefined {
    return this.platforms.find((p) => p.id.toLowerCase() === id.toLowerCase());
  }

  public getAllInboundMessages(platformFilter?: string): InboundMessage[] {
    if (platformFilter) {
      return INBOUND_MESSAGES.filter(
        (m) => m.platform.toLowerCase() === platformFilter.toLowerCase()
      );
    }
    return INBOUND_MESSAGES;
  }

  /**
   * Deep message introspection: accurately speaks whether accounts are connected and what messages exist.
   */
  public queryMessages(query: string, lang: "bn" | "en"): string {
    const q = query.toLowerCase();

    // Facebook messages
    if (q.includes("facebook") || q.includes("ফেসবুক") || q.includes("মেসেঞ্জার") || q.includes("messenger")) {
      const msgs = this.getAllInboundMessages("facebook");
      if (msgs.length === 0) {
        return lang === "bn"
          ? "স্যার, আপনার ফেসবুক প্রোফাইল (Yeasin Munshi - yeasin.munshi.980) সংযুক্ত রয়েছে। এই মুহূর্তে নতুন কোনো অপঠিত মেসেজ নেই।"
          : "Sir, your Facebook profile (Yeasin Munshi - @yeasin.munshi.980) is connected. You have no new unread messages.";
      }
      return lang === "bn"
        ? `ফেসবুক মেসেঞ্জারে আপনার ${msgs.length}টি নতুন মেসেজ রয়েছে।`
        : `On Facebook Messenger, you have ${msgs.length} new messages.`;
    }

    // WhatsApp messages
    if (q.includes("whatsapp") || q.includes("হোয়াটসঅ্যাপ") || q.includes("হোয়াটস্যাপ")) {
      const msgs = this.getAllInboundMessages("whatsapp");
      if (msgs.length === 0) {
        return lang === "bn"
          ? "আপনার হোয়াটসঅ্যাপ অ্যাকাউন্টটি এখনো সংযুক্ত করা হয়নি এবং কোনো অপঠিত চ্যাট নেই। হোয়াটসঅ্যাপ কানেক্ট করলে আমি মেসেজ পড়ে দিতে পারব।"
          : "Your WhatsApp is not connected yet and has no unread chats. Connect it to have incoming messages read aloud.";
      }
      return lang === "bn"
        ? `হোয়াটসঅ্যাপে আপনার ${msgs.length}টি নতুন মেসেজ রয়েছে।`
        : `On WhatsApp, you have ${msgs.length} new messages.`;
    }

    // Instagram messages
    if (q.includes("instagram") || q.includes("ইনস্টাগ্রাম") || q.includes("insta") || q.includes("ডিএম")) {
      const msgs = this.getAllInboundMessages("instagram");
      if (msgs.length === 0) {
        return lang === "bn"
          ? "আপনার ইনস্টাগ্রাম অ্যাকাউন্টটি এখনো কানেক্ট করা নেই এবং কোনো নতুন ডিএম নেই।"
          : "Your Instagram account is not connected yet and there are no new DMs.";
      }
      return lang === "bn"
        ? `ইনস্টাগ্রামে আপনার ${msgs.length}টি নতুন ডিএম রয়েছে।`
        : `On Instagram, you have ${msgs.length} new DMs.`;
    }

    // Gmail messages
    if (q.includes("gmail") || q.includes("ইমেইল") || q.includes("email") || q.includes("মেইল")) {
      const msgs = this.getAllInboundMessages("gmail");
      if (msgs.length === 0) {
        return lang === "bn"
          ? "আপনার জিমেইল অ্যাকাউন্টটি এখনো কানেক্ট করা নেই এবং কোনো নতুন মেইল আসেনি।"
          : "Your Gmail is not connected yet and has no new emails.";
      }
      return lang === "bn"
        ? `জিমেইলে আপনার ${msgs.length}টি নতুন গুরুত্বপূর্ণ ইমেইল এসেছে।`
        : `You have ${msgs.length} priority emails in Gmail.`;
    }

    // Overall messages query: "কে কে মেসেজ দিয়েছে", "কার মেসেজ এসেছে", "who messaged me"
    if (
      q.includes("কে কে") ||
      q.includes("কার মেসেজ") ||
      q.includes("মেসেজ দিয়েছে") ||
      q.includes("মেসেজ পাঠালো") ||
      q.includes("who messaged") ||
      q.includes("unread message") ||
      q.includes("check message")
    ) {
      if (INBOUND_MESSAGES.length === 0) {
        return lang === "bn"
          ? "আপনার কোনো সোশ্যাল মিডিয়া বা মেসেজিং অ্যাকাউন্ট এখনো যুক্ত করা হয়নি, তাই এই মুহূর্তে কোনো নতুন মেসেজ নেই। অ্যাকাউন্ট লিঙ্ক করার পর আমি আপনার সমস্ত মেসেজ ও নোটিফিকেশন সাথে সাথে পড়ে শুনিয়ে দেব।"
          : "None of your social media or messaging accounts are connected yet, so there are no incoming messages. Once you connect your accounts, I will read them aloud.";
      }
      return lang === "bn"
        ? `আপনার প্ল্যাটফর্মগুলোতে মোট ${INBOUND_MESSAGES.length}টি নতুন মেসেজ এসেছে।`
        : `You have ${INBOUND_MESSAGES.length} new messages across your platforms.`;
    }

    return "";
  }

  public queryPlatformInfo(query: string, lang: "bn" | "en"): string {
    const q = query.toLowerCase();

    // Check message-specific queries first!
    const msgAnswer = this.queryMessages(q, lang);
    if (msgAnswer) return msgAnswer;

    // Check specific platforms
    if (q.includes("facebook") || q.includes("ফেসবুক") || q.includes("fb")) {
      const fb = this.getPlatformById("facebook");
      return lang === "bn" ? fb!.summaryBangla : fb!.summaryEnglish;
    }

    if (q.includes("youtube") || q.includes("ইউটিউব") || q.includes("yt") || q.includes("ভিডিও")) {
      const yt = this.getPlatformById("youtube");
      return lang === "bn" ? yt!.summaryBangla : yt!.summaryEnglish;
    }

    if (q.includes("instagram") || q.includes("ইনস্টাগ্রাম") || q.includes("insta")) {
      const ig = this.getPlatformById("instagram");
      return lang === "bn" ? ig!.summaryBangla : ig!.summaryEnglish;
    }

    if (q.includes("whatsapp") || q.includes("হোয়াটসঅ্যাপ")) {
      const wa = this.getPlatformById("whatsapp");
      return lang === "bn" ? wa!.summaryBangla : wa!.summaryEnglish;
    }

    if (q.includes("gmail") || q.includes("ইমেইল") || q.includes("email") || q.includes("মেইল")) {
      const gm = this.getPlatformById("gmail");
      return lang === "bn" ? gm!.summaryBangla : gm!.summaryEnglish;
    }

    if (q.includes("calendar") || q.includes("শিডিউল") || q.includes("schedule") || q.includes("মিটিং")) {
      const cal = this.getPlatformById("calendar");
      return lang === "bn" ? cal!.summaryBangla : cal!.summaryEnglish;
    }

    if (q.includes("linkedin") || q.includes("লিংকডইন")) {
      const li = this.getPlatformById("linkedin");
      return lang === "bn" ? li!.summaryBangla : li!.summaryEnglish;
    }

    if (q.includes("spotify") || q.includes("গান") || q.includes("music") || q.includes("স্পটিফাই")) {
      const sp = this.getPlatformById("spotify");
      return lang === "bn" ? sp!.summaryBangla : sp!.summaryEnglish;
    }

    if (q.includes("twitter") || q.includes("টুইটার") || q.includes("এক্স")) {
      const tw = this.getPlatformById("twitter");
      return lang === "bn" ? tw!.summaryBangla : tw!.summaryEnglish;
    }

    // General media overview if user asks: "সকল প্ল্যাটফর্মের আপডেট বলো", "সোশ্যাল মিডিয়ার আপডেট", "কোন মেসেজ আসছে"
    if (
      q.includes("সকল") ||
      q.includes("সব") ||
      q.includes("সোশ্যাল") ||
      q.includes("social") ||
      q.includes("মিডিয়া") ||
      q.includes("media") ||
      q.includes("platform") ||
      q.includes("প্ল্যাটফর্ম") ||
      q.includes("update") ||
      q.includes("আপডেট") ||
      q.includes("খবর") ||
      q.includes("মেসেজ") ||
      q.includes("message")
    ) {
      if (lang === "bn") {
        return "বর্তমানে আপনার কোনো সোশ্যাল মিডিয়া অ্যাকাউন্ট কানেক্ট করা নেই। ফেসবুক, হোয়াটসঅ্যাপ, ইনস্টাগ্রাম, ইউটিউব বা জিমেইল কানেক্ট করলে আমি রিয়েল-টাইম তথ্য ও মেসেজ জানিয়ে দিতে পারব।";
      } else {
        return "Currently, no social media accounts are connected. Once you connect Facebook, WhatsApp, Instagram, YouTube, or Gmail, I will provide live updates and read your incoming messages.";
      }
    }

    return "";
  }
}

export const mediaPlatformService = new MediaPlatformService();
