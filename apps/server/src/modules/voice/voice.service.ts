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

    // Bangla Unicode block: U+0980 to U+09FF
    const banglaMatches = text.match(/[\u0980-\u09FF]/g) || [];
    // English/Latin letters: A-Z, a-z
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

  /**
   * Available Soft & Sweet Female voice profiles for LYRA.
   */
  public getVoiceProfiles(): VoiceProfile[] {
    return [
      {
        id: "lyra-female-bn",
        language: "bn",
        name: "LYRA Bangla Sweet Female",
        tone: "Soft, Warm & Sweet (নরম ও মিষ্টভাষী)",
        pitch: 1.1,
        rate: 0.95,
        sampleGreeting: "হ্যালো! আমি লায়রা, আপনার ব্যক্তিগত এআই সহকারী। আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
      },
      {
        id: "lyra-female-en",
        language: "en",
        name: "LYRA English Gentle Female",
        tone: "Soft, Elegant & Articulate",
        pitch: 1.08,
        rate: 0.96,
        sampleGreeting: "Hello! I am LYRA, your intelligent personal AI assistant. How may I assist you today?"
      }
    ];
  }

  /**
   * Intelligent conversational response handler in soft female tone.
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

    if (lang === "bn") {
      if (
        clean.includes("কেমন আছ") ||
        clean.includes("কেমন আছেন") ||
        clean.includes("কি খবর")
      ) {
        reply =
          "আমি খুব ভালো আছি! আশা করি আপনার দিনটিও চমৎকার কাটছে। আপনার কোন কাজে সাহায্য করতে পারি বলুন?";
      } else if (
        clean.includes("তুমি কে") ||
        clean.includes("তোমার নাম কি") ||
        clean.includes("লায়রা")
      ) {
        reply =
          "আমি লায়রা (LYRA), আপনার পার্সোনাল ফিমেল এআই অ্যাসিস্ট্যান্ট। আমি আপনার সোশ্যাল মিডিয়া, ইমেইল, শিডিউল এবং দৈনন্দিন সকল ডিজিটাল কাজ সহজ করতে প্রস্তুত।";
      } else if (
        clean.includes("কি করতে পার") ||
        clean.includes("কী করতে পার") ||
        clean.includes("সাহায্য")
      ) {
        reply =
          "আমি বাংলা ও ইংরেজিতে কথা বলতে পারি, আপনার জিমেইল, ক্যালেন্ডার চেক করতে পারি, সোশ্যাল পোস্ট ড্রাফট করতে পারি এবং যেকোনো প্রশ্নের উত্তর দিতে পারি।";
      } else if (clean.includes("সময়") || clean.includes("কয়টা বাজে")) {
        const now = new Date().toLocaleTimeString("bn-BD", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
        reply = `এখন সময় প্রায় ${now}। আর কিছু কি জানতে চান?`;
      } else {
        reply = `আমি আপনার কথাটি শুনেছি: "${text}"। আমি আপনার নির্দেশ অনুযায়ী কাজ করতে প্রস্তুত!`;
      }
    } else {
      if (
        clean.includes("how are you") ||
        clean.includes("how's it going") ||
        clean.includes("how do you do")
      ) {
        reply =
          "I am feeling wonderful, thank you! Ready to make your day more productive and seamless. What can I do for you?";
      } else if (
        clean.includes("who are you") ||
        clean.includes("your name") ||
        clean.includes("lyra")
      ) {
        reply =
          "I am LYRA, your personal intelligent AI assistant. I'm here with a gentle voice and sharp intellect to manage your accounts and workflows.";
      } else if (
        clean.includes("what can you do") ||
        clean.includes("help") ||
        clean.includes("features")
      ) {
        reply =
          "I can assist you in Bengali and English with voice interactions, social media management, email drafting, calendar scheduling, and automated workflows.";
      } else if (clean.includes("time") || clean.includes("what time")) {
        const now = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
        reply = `The current time is ${now}. How else can I assist you?`;
      } else {
        reply = `I heard you clearly: "${text}". I am ready to process this instruction for you!`;
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
      voiceConfig: {
        pitch: lang === "bn" ? 1.1 : 1.08,
        rate: lang === "bn" ? 0.95 : 0.96,
        suggestedVoiceNames,
        style: "soft-sweet"
      },
      timestamp: new Date().toISOString()
    };
  }
}

export const voiceService = new VoiceService();
