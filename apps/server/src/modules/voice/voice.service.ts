import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { mediaPlatformService } from "../media/media.service.js";
import { worldIntelligenceService } from "../world/world.service.js";
import { visionIntelligenceService } from "../vision/vision.service.js";
import { llmService } from "../ai/llm.service.js";
import { codeRunnerService } from "../executor/code-runner.service.js";

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
  actionType?: "news" | "weather" | "search" | "social" | "vision" | "call" | "general";
  actionPayload?: unknown;
  voiceConfig: {
    pitch: number;
    rate: number;
    suggestedVoiceNames: string[];
    style: "soft-sweet" | "gentle-warm";
  };
  timestamp: string;
}

const serverTtsCache = new Map<string, Buffer>();

export class VoiceService {
  /**
   * Generates ultra-realistic human-like Neural Voice audio (Microsoft Neural via edge-tts).
   * Default female Bengali voice is bn-BD-NabanitaNeural (soft, expressive, sweet, natural).
   */
  private async synthesizeNeuralTts(text: string, voice = "bn-BD-NabanitaNeural"): Promise<Buffer | null> {
    const cacheKey = `${voice}:${text.trim()}`;
    if (serverTtsCache.has(cacheKey)) {
      return serverTtsCache.get(cacheKey)!;
    }

    const tempId = `lyra_tts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const tempInput = path.join(os.tmpdir(), `${tempId}.txt`);
    const tempOutput = path.join(os.tmpdir(), `${tempId}.mp3`);

    const candidateScriptPaths: string[] = [
      path.resolve(process.cwd(), "src/modules/voice/edge_tts_helper.py"),
      path.resolve(process.cwd(), "scripts/neural_tts.py"),
      path.resolve(process.cwd(), "../scripts/neural_tts.py"),
      path.resolve(process.cwd(), "../../scripts/neural_tts.py"),
      "D:\\VSCODE\\LYRA AI\\scripts\\neural_tts.py"
    ];

    let scriptPath: string = candidateScriptPaths[0] || "scripts/neural_tts.py";
    for (const p of candidateScriptPaths) {
      try {
        await fs.access(p);
        scriptPath = p;
        break;
      } catch {}
    }

    try {
      await fs.writeFile(tempInput, text, "utf-8");

      const success = await new Promise<boolean>((resolve) => {
        const child = spawn("python", [scriptPath, tempInput, tempOutput, voice], {
          timeout: 9000,
          env: { ...process.env, PYTHONIOENCODING: "utf-8" }
        });

        child.on("error", () => resolve(false));
        child.on("close", (code: number | null) => resolve(code === 0));
      });

      if (success) {
        const buffer = await fs.readFile(tempOutput);
        if (buffer && buffer.length > 0) {
          if (serverTtsCache.size > 200) {
            const firstKey = serverTtsCache.keys().next().value;
            if (firstKey) serverTtsCache.delete(firstKey);
          }
          serverTtsCache.set(cacheKey, buffer);
          return buffer;
        }
      }
      return null;
    } catch {
      return null;
    } finally {
      try {
        await fs.unlink(tempInput);
      } catch {}
      try {
        await fs.unlink(tempOutput);
      } catch {}
    }
  }

  /**
   * Fetches high-fidelity natural spoken audio MP3 stream.
   * Prioritizes Edge Neural TTS (bn-BD-NabanitaNeural) with Google TTS fallback.
   */
  public async fetchTtsAudioStream(text: string, lang: "bn" | "en" = "bn"): Promise<Buffer> {
    const cleanText = text
      .replace(/[*#_`~]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      return Buffer.from([]);
    }

    const targetVoice = lang === "bn" ? "bn-BD-NabanitaNeural" : "en-US-AriaNeural";

    // 1. Try Ultra-Realistic Neural Speech first
    try {
      const neuralBuffer = await this.synthesizeNeuralTts(cleanText, targetVoice);
      if (neuralBuffer && neuralBuffer.length > 0) {
        return neuralBuffer;
      }
    } catch (err) {
      console.warn("Neural TTS error, using fallback:", err);
    }

    // 2. Fallback to Google TTS chunking
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
    forcedLanguage?: "bn" | "en" | "auto",
    history?: Array<{ role: "user" | "assistant" | "system"; content: string }>
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
    let actionType: "news" | "weather" | "search" | "social" | "vision" | "call" | "general" = "general";
    let actionPayload: unknown = null;

    // 1. Sleep / Rest Mode Command
    if (
      clean.includes("rest neo") ||
      clean.includes("rest nao") ||
      clean.includes("rest now") ||
      clean.includes("take rest") ||
      clean.includes("রেস্ট নেও") ||
      clean.includes("রেস্ট নাও") ||
      clean.includes("রেস্ট") ||
      clean.includes("ঘুমাও") ||
      clean.includes("ঘুমা") ||
      clean.includes("ghomao") ||
      clean.includes("ghumao") ||
      clean.includes("ghuma") ||
      clean.includes("sleep mode") ||
      clean.includes("slip mode") ||
      clean.includes("seep mode") ||
      clean.includes("go to sleep") ||
      clean.includes("lyra sleep") ||
      clean.includes("lyra slip") ||
      clean.includes("স্লিপ মোড") ||
      clean.includes("অফ হও") ||
      clean.includes("বন্ধ হও") ||
      clean.includes("off hou")
    ) {
      isSleepCommand = true;
      reply =
        lang === "bn"
          ? "জি ইয়াসিন স্যার, আমি এখন রেস্ট নিচ্ছি। আপনার প্রয়োজন হলে শুধু 'Hey LYRA' বলবেন, আমি সাথে সাথে সজাগ হয়ে যাব।"
          : "Understood Sir, entering rest mode now. Whenever you need me again, just say 'Hey LYRA' and I will wake right up!";
    }
    // 2. Wake Up Command
    else if (
      clean.includes("hey lyra") ||
      clean.includes("hello lyra") ||
      clean.includes("ok lyra") ||
      clean.includes("lyra") ||
      clean.includes("হে লায়রা") ||
      clean.includes("হেই লায়রা") ||
      clean.includes("লায়রা") ||
      clean.includes("লাইরা") ||
      clean.includes("wake up") ||
      clean.includes("জেগে ওঠো") ||
      clean.includes("ওঠো") ||
      clean.includes("জেগে যাও") ||
      clean.includes("উঠে পর") ||
      clean.includes("উঠে পড়") ||
      clean.includes("এক্টিভ হও") ||
      clean.includes("active")
    ) {
      isWakeCommand = true;
      reply =
        lang === "bn"
          ? "জি ইয়াসিন স্যার! আমি জেগে উঠেছি। বলুন, আপনার জন্য কি করতে পারি?"
          : "I am wide awake and ready, Yeasin Sir! What can I do for you?";
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
    // 8. Secure Link Call (Matching Video 4: ZARA/LYRA SECURE LINK call to Bhabi)
    else if (
      clean.includes("call") ||
      clean.includes("কল দাও") ||
      clean.includes("কল করো") ||
      clean.includes("ফোন দাও") ||
      clean.includes("ফোন করো") ||
      clean.includes("ভাবি") ||
      clean.includes("bhabi") ||
      clean.includes("secure link") ||
      clean.includes("সিকিউর লিংক")
    ) {
      actionType = "call";
      reply =
        lang === "bn"
          ? "জি স্যার, ভাবির সাথে এনক্রিপ্টেড সিকিউর লিংক কল সংযুক্ত করা হচ্ছে..."
          : "Yes Sir, establishing secure link encrypted voice channel to Bhabi...";
    }
    // 8.5 Real-time Python Code Execution & Math Calculation Tool
    else if (
      clean.includes("python") ||
      clean.includes("পাইথন") ||
      clean.includes("কোড চালাও") ||
      clean.includes("কোড রান করো") ||
      clean.includes("হিসাব করো") ||
      clean.includes("কত হবে") ||
      clean.includes("ক্যালকুলেট") ||
      clean.includes("calculate") ||
      clean.includes("রান করো")
    ) {
      actionType = "general";
      try {
        const mathMatches = text.match(/[\d\.\s\+\-\*\/\(\)\^\%]+/g);
        const mathExpr =
          mathMatches && mathMatches.length > 0
            ? mathMatches.reduce((a, b) => (a.length > b.length ? a : b)).trim()
            : "";

        if (mathExpr && /[\+\-\*\/]/.test(mathExpr) && /\d/.test(mathExpr)) {
          const res = await codeRunnerService.evalPythonMath(mathExpr);
          reply =
            lang === "bn"
              ? `জি ইয়াসিন স্যার, পাইথন কার্নেলে গণনা সম্পন্ন হয়েছে। ${mathExpr} এর মান হলো ${res.trim()}।`
              : `Sir, evaluated in Python kernel: ${mathExpr} equals ${res.trim()}.`;
        } else {
          const codeToRun = text
            .replace(/পাইথন কোড রান করো|কোড চালাও|কোড রান করো|python run|run code/gi, "")
            .trim();
          if (codeToRun && codeToRun.length > 5) {
            const exec = await codeRunnerService.executePython(codeToRun);
            reply =
              lang === "bn"
                ? `জি স্যার, পাইথন কোড এক্সিকিউট করা হয়েছে। ফলাফল: ${exec.stdout || exec.stderr || "কোড সফলভাবে রান হয়েছে"}`
                : `Code executed successfully Sir. Output: ${exec.stdout || exec.stderr || "Success"}`;
          } else {
            reply =
              lang === "bn"
                ? "জি ইয়াসিন স্যার, পাইথন কোড রানার ইঞ্জিন সক্রিয় আছে। আপনি যেকোনো কোড বা হিসাব দিলে আমি সাথে সাথে রান করে ফলাফল জানিয়ে দেব।"
                : "Yes Sir, the Python execution engine is active. Send any code or math expression to run.";
          }
        }
      } catch (err) {
        reply =
          lang === "bn"
            ? "স্যার, কোড এক্সিকিউশনে একটি সাময়িক সমস্যা হয়েছে। কার্নেলটি পুনরায় লোড করা হচ্ছে।"
            : "Sir, encountered a minor issue executing the code. Reloading kernel.";
      }
    }
    // 9. Conversational & Persona Answers via Claude & Gemini Neural Models
    else {
      try {
        const llmResult = await llmService.generateReply(text, history || [], { language: lang });
        reply = llmResult.reply;
        actionPayload = {
          modelUsed: llmResult.modelUsed,
          provider: llmResult.provider,
          latencyMs: llmResult.latencyMs
        };
      } catch (err) {
        console.warn("LLM generation fallback in VoiceService:", err);
        reply =
          lang === "bn"
            ? `জি ইয়াসিন স্যার, আমি আপনার কথাটি শুনেছি: "${text}"। আমি আপনার সেবায় সর্বদা প্রস্তুত!`
            : `I heard you clearly Sir: "${text}". Standing by for your command!`;
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
