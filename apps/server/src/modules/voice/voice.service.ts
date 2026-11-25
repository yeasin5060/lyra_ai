import { mediaPlatformService } from "../media/media.service.js";
import { worldIntelligenceService } from "../world/world.service.js";
import { visionIntelligenceService } from "../vision/vision.service.js";

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
  actionType?: "news" | "weather" | "search" | "social" | "vision" | "general";
  actionPayload?: unknown;
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
   * Fetches high-fidelity natural spoken audio MP3 stream.
   * Splits long text into chunks, queries Google TTS client=tw-ob, and concatenates audio.
   */
  public async fetchTtsAudioStream(text: string, lang: "bn" | "en" = "bn"): Promise<Buffer> {
    const cleanText = text
      .replace(/[*#_`~]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      return Buffer.from([]);
    }

    // Split text into readable chunks <= 160 chars
    const chunks: string[] = [];
    const sentences = cleanText.split(/([।?!.\n]+)/);

    let currentChunk = "";
    for (const part of sentences) {
      if ((currentChunk + part).length < 160) {
        currentChunk += part;
      } else {
        if (currentChunk.trim()) chunks.push(currentChunk.trim());
        currentChunk = part;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    const audioBuffers: Buffer[] = [];
    const targetLang = lang === "bn" ? "bn" : "en";

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodeURIComponent(chunk.trim())}`;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://translate.google.com/"
          },
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (res.ok) {
          const ab = await res.arrayBuffer();
          audioBuffers.push(Buffer.from(ab));
        }
      } catch (err) {
        console.warn("TTS chunk fetch error:", err);
      }
    }

    return Buffer.concat(audioBuffers);
  }

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
        sampleGreeting:
          "হ্যালো ইয়াসিন স্যার! আমি লায়রা, আপনার পার্সোনাল এআই সহকারী। ফেসবুক, লিঙ্কডইন, সংবাদ ও বিশ্বের যেকোনো তথ্য জানাতে আমি প্রস্তুত।"
      },
      {
        id: "lyra-female-en",
        language: "en",
        name: "LYRA English Gentle Female",
        tone: "Soft, Elegant & Articulate",
        pitch: 1.08,
        rate: 0.95,
        sampleGreeting:
          "Hello Sir! I am LYRA, your intelligent personal AI assistant. All your social accounts and live world intelligence streams are active."
      }
    ];
  }

  /**
   * Autonomous Action Dispatcher: Connects Live News, Weather, Web Search, and Social Profiles.
   */
  public async processVoice(
    text: string,
    forcedLanguage?: "bn" | "en" | "auto"
  ): Promise<VoiceProcessResult> {
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
    let actionType: "news" | "weather" | "search" | "social" | "vision" | "general" = "general";
    let actionPayload: unknown = null;

    // 1. Sleep Mode Command
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
      reply =
        lang === "bn"
          ? "ঠিক আছে স্যার, আমি এখন স্লিপ মোডে যাচ্ছি। আমাকে প্রয়োজন হলে শুধু 'Hey LYRA' বললেই আমি জেগে উঠব। শুভ রাত্রি!"
          : "Understood Sir! Entering sleep mode now. Whenever you need me again, just say 'Hey LYRA' and I will wake right up. Sweet dreams!";
    }
    // 2. Wake Command
    else if (
      clean.includes("wake up") ||
      clean.includes("জেগে ওঠো") ||
      clean.includes("ওঠো") ||
      clean.includes("জেগে যাও") ||
      clean.includes("উঠে পর")
    ) {
      isWakeCommand = true;
      reply =
        lang === "bn"
          ? "আমি সম্পূর্ণ সজাগ হয়ে গেছি স্যার! বলুন, আপনার জন্য কি করতে পারি?"
          : "I am wide awake and ready, Sir! What can I do for you?";
    }
    // 3. Live Breaking News / Prothom Alo / Country Situation
    else if (
      clean.includes("prothom alo") ||
      clean.includes("prothomalo") ||
      clean.includes("প্রথম আলো") ||
      clean.includes("প্রথমআলো") ||
      clean.includes("দেশের কি অবস্থা") ||
      clean.includes("দেশের অবস্থা") ||
      clean.includes("দেশের খবর") ||
      clean.includes("আজকের খবর") ||
      clean.includes("তাজা খবর") ||
      clean.includes("নিউজ") ||
      clean.includes("news") ||
      clean.includes("headline") ||
      clean.includes("পত্রিকা") ||
      clean.includes("আপডেট দাও") ||
      clean.includes("কী অবস্থা")
    ) {
      actionType = "news";
      const newsResult = await worldIntelligenceService.getProthomAloNews(lang);
      reply = newsResult.spokenSummary;
      actionPayload = newsResult.articles;
    }
    // 4. Live Weather & Environmental Report
    else if (
      clean.includes("আবহাওয়া") ||
      clean.includes("আবহাওয়া") ||
      clean.includes("weather") ||
      clean.includes("বৃষ্টি") ||
      clean.includes("তাপমাত্রা") ||
      clean.includes("temperature") ||
      clean.includes("গরম")
    ) {
      actionType = "weather";
      const weatherResult = await worldIntelligenceService.getLiveWeather("Dhaka", lang);
      reply = weatherResult.spokenSummary;
      actionPayload = weatherResult;
    }
    // 5. Live Web Knowledge & Search
    else if (
      clean.includes("সার্চ করো") ||
      clean.includes("সার্চ") ||
      clean.includes("search") ||
      clean.includes("খোঁজো") ||
      clean.includes("গুগল করো") ||
      clean.includes("who is") ||
      clean.includes("what is") ||
      clean.includes("সম্পর্কে বলো")
    ) {
      actionType = "search";
      const query = clean
        .replace(/সার্চ করো|সার্চ|search|খোঁজো|গুগল করো|who is|what is|সম্পর্কে বলো/gi, "")
        .trim() || "Artificial Intelligence";
      const searchResult = await worldIntelligenceService.searchWeb(query, lang);
      reply = searchResult.spokenSummary;
      actionPayload = searchResult;
    }
    // 6. Connected Social Platforms & Yeasin Munshi's Accounts (Facebook, Messenger, LinkedIn, WhatsApp, Gmail)
    else if (
      clean.includes("facebook") ||
      clean.includes("ফেসবুক") ||
      clean.includes("fb") ||
      clean.includes("messenger") ||
      clean.includes("মেসেঞ্জার") ||
      clean.includes("linkedin") ||
      clean.includes("লিঙ্কডইন") ||
      clean.includes("লিংকডইন") ||
      clean.includes("whatsapp") ||
      clean.includes("হোয়াটসঅ্যাপ") ||
      clean.includes("gmail") ||
      clean.includes("জিমেইল") ||
      clean.includes("মেসেজ") ||
      clean.includes("message") ||
      clean.includes("social") ||
      clean.includes("সোশ্যাল") ||
      clean.includes("কে কে") ||
      clean.includes("কার মেসেজ") ||
      clean.includes("ইনমেইল") ||
      clean.includes("inmail")
    ) {
      actionType = "social";
      const mediaReply = mediaPlatformService.queryPlatformInfo(clean, lang);
      reply =
        mediaReply ||
        (lang === "bn"
          ? "জি ইয়াসিন স্যার, আপনার ফেসবুক মেসেঞ্জার (yeasin.munshi.980) এবং লিঙ্কডইন (yeasin-munshi-aa7467288) সফলভাবে সংযুক্ত রয়েছে। ৬টি নতুন বার্তা পাওয়া গেছে। তানভীর আহমেদ, নাফিসা রহমান ও ডেভিড স্টার্লিং মেসেজ দিয়েছেন।"
          : "Sir, your Facebook Messenger (@yeasin.munshi.980) and LinkedIn account are connected with 6 incoming messages from Tanvir Ahmed, Nafisa Rahman, and David Sterling.");
    }
    // 7. Multimodal Optical Vision & Face/Person Recognition (like Zara AI with Brother recognition)
    else if (
      clean.includes("camera") ||
      clean.includes("ক্যামেরা") ||
      clean.includes("vision") ||
      clean.includes("ভিশন") ||
      clean.includes("সামনে কে") ||
      clean.includes("কে আছে দেখো") ||
      clean.includes("কে বসে আছে") ||
      clean.includes("ছোট ভাই") ||
      clean.includes("ভাইকে চেনো") ||
      clean.includes("brother") ||
      clean.includes("আমাকে চেনো") ||
      clean.includes("আমার দিকে তাকাও") ||
      clean.includes("চোখ খোলো") ||
      clean.includes("দেখো তো") ||
      clean.includes("তাকাও")
    ) {
      actionType = "vision";
      const isBro = clean.includes("ছোট ভাই") || clean.includes("ভাই") || clean.includes("brother");
      const visionResult = await visionIntelligenceService.analyzeCameraFrame(
        undefined,
        clean,
        isBro ? "brother" : "auto"
      );
      reply = lang === "bn" ? visionResult.spokenFeedback : visionResult.spokenFeedbackEnglish;
      actionPayload = visionResult;
    }
    // 8. Conversational & Persona Answers
    else if (lang === "bn") {
      if (
        clean.includes("কেমন আছ") ||
        clean.includes("কেমন আছেন") ||
        clean.includes("কি খবর")
      ) {
        reply =
          "আমি খুব ভালো আছি ইয়াসিন স্যার! আশা করি আপনার দিনটিও চমৎকার কাটছে। আপনার ফেসবুক, লিঙ্কডইন, আজকের তাজা খবর বা কোনো কাজের আপডেট জানতে চান?";
      } else if (
        clean.includes("তুমি কে") ||
        clean.includes("তোমার নাম কি") ||
        clean.includes("লায়রা")
      ) {
        reply =
          "আমি লায়রা (LYRA), আপনার পার্সোনাল ফিমেল এআই অ্যাসিস্ট্যান্ট। আমি আপনার ফেসবুক, লিঙ্কডইন, হোয়াটসঅ্যাপ সহ সমস্ত ডিজিটাল অ্যাকাউন্ট ও বিশ্বের রিয়েল-টাইম তথ্য ও খবর তাৎক্ষণিকভাবে মুখে জানিয়ে দিতে পারি।";
      } else if (clean.includes("সময়") || clean.includes("কয়টা বাজে")) {
        const now = new Date().toLocaleTimeString("bn-BD", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
        reply = `এখন সময় প্রায় ${now}। আর কোনো খবর বা সোশ্যাল আপডেট দিতে হবে স্যার?`;
      } else {
        reply = `আমি আপনার কথাটি শুনেছি স্যার: "${text}"। আমি যেকোনো নির্দেশ কার্যকর করতে প্রস্তুত!`;
      }
    } else {
      if (
        clean.includes("how are you") ||
        clean.includes("how's it going")
      ) {
        reply = "I am doing fantastic, thank you Sir! All your social channels and live world feeds are active. How may I assist you?";
      } else if (
        clean.includes("who are you") ||
        clean.includes("your name")
      ) {
        reply = "I am LYRA, your personal female AI companion, managing your social accounts, Facebook, LinkedIn, live news, and web intelligence.";
      } else {
        reply = `I heard you clearly Sir: "${text}". Standing by for your command!`;
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
      actionType,
      actionPayload,
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
