import { mediaPlatformService } from "../media/media.service.js";

export interface LanguageDetectionResult {
  language: "bn" | "en" | "mixed";
  confidence: number;
  banglaCharacters: number;
  englishCharacters: number;
  totalLetters: number;
}

export interface VoiceProfile {
  id: string;
  language: "bn" | "en";
  name: string;
  tone: string;
  pitch: number;
  rate: number;
  sampleGreeting: string;
}

export interface VoiceProcessResult {
  inputTranscript: string;
  detectedLanguage: "bn" | "en" | "mixed";
  replyLanguage: "bn" | "en";
  replyText: string;
  isSleepCommand?: boolean;
  isWakeCommand?: boolean;
  voiceConfig: {
    pitch: number;
    rate: number;
    suggestedVoiceNames: string[];
    style: "soft-sweet" | "gentle-warm";
  };
  timestamp: string;
}

export class VoiceService {
  /**
   * Detects whether text is Bengali, English, or Mixed.
   */
  public detectLanguage(text: string): LanguageDetectionResult {
    if (!text || text.trim().length === 0) {
      return {
        language: "en",
        confidence: 1.0,
        banglaCharacters: 0,
        englishCharacters: 0,
        totalLetters: 0
      };
    }

    const banglaMatches = text.match(/[\u0980-\u09FF]/g) || [];
    const englishMatches = text.match(/[a-zA-Z]/g) || [];

    const banglaCount = banglaMatches.length;
    const englishCount = englishMatches.length;
    const total = banglaCount + englishCount;

    if (total === 0) {
      return {
        language: "en",
        confidence: 0.5,
        banglaCharacters: 0,
        englishCharacters: 0,
        totalLetters: 0
      };
    }

    const banglaRatio = banglaCount / total;
    const englishRatio = englishCount / total;

    let language: "bn" | "en" | "mixed" = "en";
    let confidence = englishRatio;

    if (banglaRatio > 0.6) {
      language = "bn";
      confidence = banglaRatio;
    } else if (englishRatio > 0.6) {
      language = "en";
      confidence = englishRatio;
    } else {
      language = "mixed";
      confidence = Math.max(banglaRatio, englishRatio);
    }

    return {
      language,
      confidence: Number(confidence.toFixed(2)),
      banglaCharacters: banglaCount,
      englishCharacters: englishCount,
      totalLetters: total
    };
  }

  public getVoiceProfiles(): VoiceProfile[] {
    return [
      {
        id: "lyra-female-bn",
        language: "bn",
        name: "LYRA Bangla Sweet Female",
        tone: "Soft, Warm & Sweet (নরম ও মিষ্টভাষী)",
        pitch: 1.15,
        rate: 0.94,
        sampleGreeting: "হ্যালো! আমি লায়রা, আপনার পার্সোনাল এআই সহকারী। আমি আপনার সমস্ত মিডিয়া প্ল্যাটফর্ম ও কাজ পরিচালনায় প্রস্তুত।"
      },
      {
        id: "lyra-female-en",
        language: "en",
        name: "LYRA English Gentle Female",
        tone: "Soft, Elegant & Articulate",
        pitch: 1.08,
        rate: 0.95,
        sampleGreeting: "Hello! I am LYRA, your intelligent personal AI assistant. All your social and media platforms are synced and ready."
      }
    ];
  }

  /**
   * Intelligent conversational response handler in soft female tone with Sleep/Wake & Media Knowledge.
   */
  public processVoice(
    text: string,
    forcedLanguage?: "bn" | "en" | "auto"
  ): VoiceProcessResult {
    const detection = this.detectLanguage(text);
    const lang =
      forcedLanguage && forcedLanguage !== "auto"
        ? forcedLanguage
        : detection.language === "bn"
        ? "bn"
        : "en";

    const clean = text.toLowerCase().trim();
    let reply = "";
    let isSleepCommand = false;
    let isWakeCommand = false;

    // Check for Sleep Mode command:
    // e.g. "lyra tumi ghomao", "lyra sleep", "tumi sleep mode e chole jao", "ঘুমাও", "স্লিপ মোডে যাও"
    if (
      clean.includes("ghomao") ||
      clean.includes("ghumao") ||
      clean.includes("ghuma") ||
      clean.includes("ঘুমাও") ||
      clean.includes("ঘুমা") ||
      clean.includes("sleep mode") ||
      clean.includes("slip mode") ||
      clean.includes("seep mode") ||
      clean.includes("go to sleep") ||
      clean.includes("lyra sleep") ||
      clean.includes("lyra slip") ||
      clean.includes("স্লিপ মোড") ||
      clean.includes("অফ হও") ||
      clean.includes("বন্ধ হও")
    ) {
      isSleepCommand = true;
      if (lang === "bn") {
        reply =
          "ঠিক আছে, আমি এখন স্লিপ মোডে যাচ্ছি। আমাকে প্রয়োজন হলে শুধু 'Hey LYRA' বললেই আমি সাথে সাথে জেগে উঠব। শুভ রাত্রি!";
      } else {
        reply =
          "Understood! Entering sleep mode now. Whenever you need me again, just say 'Hey LYRA' and I will wake right up. Sweet dreams!";
      }
    }
    // Check for Wake command:
    else if (
      clean.includes("wake up") ||
      clean.includes("জেগে ওঠো") ||
      clean.includes("ওঠো") ||
      clean.includes("জেগে যাও") ||
      clean.includes("উঠে পর")
    ) {
      isWakeCommand = true;
      if (lang === "bn") {
        reply = "আমি সম্পূর্ণ সজাগ হয়ে গেছি! বলুন, আপনার জন্য কি করতে পারি?";
      } else {
        reply = "I am wide awake and ready! What can I do for you?";
      }
    }
    // 2. Check if query relates to connected social/media platforms & inbound messages
    else {
      const mediaReply = mediaPlatformService.queryPlatformInfo(clean, lang);
      if (mediaReply) {
        reply = mediaReply;
      } else if (lang === "bn") {
        if (
          clean.includes("কেমন আছ") ||
          clean.includes("কেমন আছেন") ||
          clean.includes("কি খবর")
        ) {
          reply =
            "আমি খুব ভালো আছি! আশা করি আপনার দিনটিও চমৎকার কাটছে। বলুন, আমি আপনাকে কিভাবে সাহায্য করতে পারি?";
        } else if (
          clean.includes("তুমি কে") ||
          clean.includes("তোমার নাম কি") ||
          clean.includes("লায়রা")
        ) {
          reply =
            "আমি লায়রা (LYRA), আপনার পার্সোনাল ফিমেল এআই অ্যাসিস্ট্যান্ট। আমি আপনার ফেসবুক, ইউটিউব, ইনস্টাগ্রাম, জিমেইল, ক্যালেন্ডার সহ সমস্ত ডিজিটাল অ্যাকাউন্ট ও শিডিউল নিয়ন্ত্রণ করতে পারি।";
        } else if (
          clean.includes("কি করতে পার") ||
          clean.includes("কী করতে পার") ||
          clean.includes("সাহায্য")
        ) {
          reply =
            "আমি আপনার সকল মিডিয়া প্ল্যাটফর্ম পর্যবেক্ষণ করি—ফেসবুকের মেসেজ, ইউটিউবের ভিউ, ইনস্টাগ্রাম ডিএম, জিমেইলের গুরুত্বপূর্ণ মেইল এবং ক্যালেন্ডার শিডিউল ইত্যাদি যেকোনো কিছু মুখে জিজ্ঞেস করলেই আমি মিষ্টি কণ্ঠে বিস্তারিত বলে দিতে পারি। আর 'ঘুমাও' বললে আমি স্লিপ মোডে চলে যাই।";
        } else if (clean.includes("সময়") || clean.includes("কয়টা বাজে")) {
          const now = new Date().toLocaleTimeString("bn-BD", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          });
          reply = `এখন সময় প্রায় ${now}। আর কোন প্ল্যাটফর্মের আপডেট দিতে হবে?`;
        } else {
          reply = `আমি আপনার কথাটি শুনেছি: "${text}"। আমি আপনার নির্দেশ কার্যকর করতে সম্পূর্ণ প্রস্তুত!`;
        }
      } else {
        if (
          clean.includes("how are you") ||
          clean.includes("how's it going") ||
          clean.includes("how do you do")
        ) {
          reply =
            "I am doing fantastic, thank you! How can I assist you today?";
        } else if (
          clean.includes("who are you") ||
          clean.includes("your name") ||
          clean.includes("lyra")
        ) {
          reply =
            "I am LYRA, your personal female AI companion. I manage your entire digital ecosystem—Facebook, YouTube, Instagram, Gmail, Spotify, and more.";
        } else if (
          clean.includes("what can you do") ||
          clean.includes("help") ||
          clean.includes("features")
        ) {
          reply =
            "I monitor and manage all your connected accounts: reviewing unread DMs on Instagram & Facebook, checking YouTube analytics, summarizing Gmail inbox, scheduling meetings, and streaming music on Spotify. Just say 'Hey LYRA' anytime, or tell me to go to sleep!";
        } else if (clean.includes("time") || clean.includes("what time")) {
          const now = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          });
          reply = `The current time is ${now}. How can I help you further?`;
        } else {
          reply = `I heard you clearly: "${text}". I am ready to assist you!`;
        }
      }
    }

    const suggestedVoiceNames =
      lang === "bn"
        ? [
            "Google বাংলা",
            "Microsoft Sayantani",
            "Bangla Female",
            "bn-BD-Female",
            "bn-IN-Female"
          ]
        : [
            "Google UK English Female",
            "Microsoft Zira",
            "Google US English",
            "Samantha",
            "Victoria",
            "en-US-Female"
          ];

    return {
      inputTranscript: text,
      detectedLanguage: detection.language,
      replyLanguage: lang,
      replyText: reply,
      isSleepCommand,
      isWakeCommand,
      voiceConfig: {
        pitch: isSleepCommand ? 1.05 : lang === "bn" ? 1.15 : 1.08,
        rate: isSleepCommand ? 0.90 : lang === "bn" ? 0.94 : 0.95,
        suggestedVoiceNames,
        style: "soft-sweet"
      },
      timestamp: new Date().toISOString()
    };
  }
}

export const voiceService = new VoiceService();
