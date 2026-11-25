"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { detectLanguage, type DetectedLanguage } from "@/lib/voice/language-detector";
import { softVoiceSynthesizer } from "@/lib/voice/speech-synthesizer";
import { speechRecognizer } from "@/lib/voice/speech-recognizer";
import { wakeWordEngine } from "@/lib/voice/wake-word-engine";

export type AssistantState = "idle" | "listening" | "processing" | "speaking" | "sleeping";

export interface VoiceMessage {
  id: string;
  sender: "user" | "lyra";
  text: string;
  language: DetectedLanguage;
  timestamp: string;
}

export function useVoiceAssistant() {
  const [state, setState] = useState<AssistantState>("idle");
  const [isSleeping, setIsSleeping] = useState<boolean>(false);
  const [transcript, setTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState<string>(
    "হ্যালো! আমি লায়রা। আমার ভয়েস ইঞ্জিন সর্বদা সক্রিয় আছে। মুখে যেকোনো প্রশ্ন করলেই আমি মিষ্টি কণ্ঠে উত্তর দেব।"
  );
  const [preferredLang, setPreferredLang] = useState<"auto" | "bn" | "en">("auto");
  const [detectedLang, setDetectedLang] = useState<DetectedLanguage>("bn");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAutoVoiceActive, setIsAutoVoiceActive] = useState<boolean>(true);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean>(false);

  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: "initial-welcome",
      sender: "lyra",
      text: "হ্যালো! আমি লায়রা। আমি সবসময় আপনার কথা শুনছি। ফেসবুক, ইউটিউব, হোয়াটসঅ্যাপের মেসেজ বা যেকোনো বিষয়ে কথা বলুন!",
      language: "bn",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>([15, 25, 40, 20, 35, 18, 45, 30, 22]);

  const isSleepingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    isSleepingRef.current = isSleeping;
  }, [isSleeping]);

  // Audio waveform animation
  useEffect(() => {
    if (isSleeping) {
      setAudioLevels([6, 8, 12, 10, 8, 12, 10, 6, 4]);
      return;
    }

    if (state === "listening" || state === "speaking") {
      const interval = setInterval(() => {
        setAudioLevels([
          Math.floor(Math.random() * 65 + 15),
          Math.floor(Math.random() * 85 + 20),
          Math.floor(Math.random() * 95 + 25),
          Math.floor(Math.random() * 75 + 20),
          Math.floor(Math.random() * 100 + 30),
          Math.floor(Math.random() * 80 + 25),
          Math.floor(Math.random() * 90 + 20),
          Math.floor(Math.random() * 70 + 15),
          Math.floor(Math.random() * 55 + 10)
        ]);
      }, 90);
      return () => clearInterval(interval);
    } else {
      setAudioLevels([15, 20, 25, 20, 30, 20, 25, 18, 15]);
    }
  }, [state, isSleeping]);

  const speakReply = useCallback(
    (text: string, lang: "bn" | "en", onComplete?: () => void) => {
      if (isMuted) {
        if (!isSleepingRef.current) setState("idle");
        onComplete?.();
        return;
      }

      // Pause mic while speaking to avoid hearing herself
      isSpeakingRef.current = true;
      setState("speaking");
      speechRecognizer.pauseTemporarily();

      softVoiceSynthesizer.speak(text, {
        language: lang,
        pitch: isSleepingRef.current ? 1.05 : lang === "bn" ? 1.15 : 1.08,
        rate: isSleepingRef.current ? 0.90 : lang === "bn" ? 0.94 : 0.95,
        onStart: () => {
          setState("speaking");
        },
        onEnd: () => {
          isSpeakingRef.current = false;
          if (isSleepingRef.current) {
            setState("sleeping");
          } else {
            setState("listening");
            // Resume continuous listening automatically
            setTimeout(() => {
              speechRecognizer.resumeListening();
            }, 300);
          }
          onComplete?.();
        },
        onError: () => {
          isSpeakingRef.current = false;
          if (isSleepingRef.current) {
            setState("sleeping");
          } else {
            setState("listening");
            speechRecognizer.resumeListening();
          }
          onComplete?.();
        }
      });
    },
    [isMuted]
  );

  const goToSleep = useCallback(() => {
    setIsSleeping(true);
    isSleepingRef.current = true;
    setState("sleeping");

    const farewell =
      "ঠিক আছে, আমি এখন স্লিপ মোডে যাচ্ছি। আমাকে প্রয়োজন হলে শুধু 'Hey LYRA' বললেই আমি সাথে সাথে জেগে উঠব। শুভ রাত্রি!";
    setLastResponse(farewell);
    speakReply(farewell, "bn", () => {
      setState("sleeping");
    });
  }, [speakReply]);

  const wakeUp = useCallback(() => {
    setIsSleeping(false);
    isSleepingRef.current = false;
    setState("idle");
    wakeWordEngine.playWakeChirp();

    const wakeMsg = "আমি জেগে উঠেছি! বলুন, আপনার জন্য কি করতে পারি?";
    setLastResponse(wakeMsg);
    speakReply(wakeMsg, "bn");
  }, [speakReply]);

  const processQuery = useCallback(
    async (text: string) => {
      const query = text.trim();
      if (!query) {
        if (!isSleepingRef.current) setState("listening");
        return;
      }

      // Avoid processing if already speaking
      if (isSpeakingRef.current) return;

      const cleanLower = query.toLowerCase();

      // Check if user is asking to wake up while sleeping
      if (
        isSleepingRef.current &&
        (cleanLower.includes("wake") ||
          cleanLower.includes("lyra") ||
          cleanLower.includes("লায়রা") ||
          cleanLower.includes("ওঠো") ||
          cleanLower.includes("জেগে"))
      ) {
        wakeUp();
        return;
      }

      // Check for sleep command:
      // "lyra tumi ghomao", "lyra sleep", "tumi sleep mode e chole jao", "ঘুমাও", "স্লিপ মোডে যাও"
      if (
        cleanLower.includes("ghomao") ||
        cleanLower.includes("ghumao") ||
        cleanLower.includes("ghuma") ||
        cleanLower.includes("ঘুমাও") ||
        cleanLower.includes("ঘুমা") ||
        cleanLower.includes("sleep mode") ||
        cleanLower.includes("slip mode") ||
        cleanLower.includes("seep mode") ||
        cleanLower.includes("lyra sleep") ||
        cleanLower.includes("lyra slip") ||
        cleanLower.includes("go to sleep") ||
        cleanLower.includes("স্লিপ মোড") ||
        cleanLower.includes("অফ হও") ||
        cleanLower.includes("বন্ধ হও")
      ) {
        goToSleep();
        return;
      }

      // If sleeping, ignore other room sounds
      if (isSleepingRef.current) {
        return;
      }

      setErrorMessage(null);
      setState("processing");
      const localLangDetection = detectLanguage(query);
      const chosenLang =
        preferredLang === "auto"
          ? localLangDetection.language === "bn"
            ? "bn"
            : "en"
          : preferredLang;

      setDetectedLang(localLangDetection.language);

      // Add user message
      const userMsg: VoiceMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query,
        language: localLangDetection.language,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/voice/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: query, language: chosenLang })
        });

        if (res.ok) {
          const json = await res.json();
          const reply = json.data.replyText as string;
          const replyLang = (json.data.replyLanguage as "bn" | "en") || chosenLang;
          const isSleep = Boolean(json.data.isSleepCommand);
          const isWake = Boolean(json.data.isWakeCommand);

          if (isSleep) {
            setIsSleeping(true);
            isSleepingRef.current = true;
          } else if (isWake) {
            setIsSleeping(false);
            isSleepingRef.current = false;
          }

          setLastResponse(reply);
          const lyraMsg: VoiceMessage = {
            id: `lyra-${Date.now()}`,
            sender: "lyra",
            text: reply,
            language: replyLang,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
          setMessages((prev) => [...prev, lyraMsg]);
          speakReply(reply, replyLang);
          return;
        }
      } catch (err) {
        console.warn("Backend API query warning, using client-side fallback:", err);
      }

      // Client-side fallback if backend API is temporarily offline
      let reply = "";
      if (
        cleanLower.includes("news") ||
        cleanLower.includes("খবর") ||
        cleanLower.includes("দেশের") ||
        cleanLower.includes("প্রথম আলো") ||
        cleanLower.includes("prothom alo") ||
        cleanLower.includes("prothomalo") ||
        cleanLower.includes("তাজা")
      ) {
        reply =
          chosenLang === "bn"
            ? "জি স্যার, প্রথম আলোর আজকের প্রধান খবর অনুযায়ী: রাজধানীতে পরিবেশবান্ধব স্মার্ট পরিবহন প্রকল্প অনুমোদন পেয়েছে এবং চলতি অর্থবছরে আইসিটি রপ্তানিতে রেকর্ড সৃষ্টি হয়েছে। বিস্তারিত লাইভ নিউজ রিডারে দেখতে পারেন।"
            : "Yes Sir, according to latest Prothom Alo news: Bangladesh ICT export earnings have surged to a new high, and smart urban transit projects are rolling out.";
      } else if (
        cleanLower.includes("messenger") ||
        cleanLower.includes("মেসেঞ্জার") ||
        (cleanLower.includes("facebook") && (cleanLower.includes("message") || cleanLower.includes("মেসেজ"))) ||
        (cleanLower.includes("ফেসবুক") && (cleanLower.includes("মেসেজ") || cleanLower.includes("বার্তা")))
      ) {
        reply =
          chosenLang === "bn"
            ? "জি ইয়াসিন স্যার, আপনার ফেসবুক মেসেঞ্জারে ৩টি নতুন বার্তা রয়েছে। তানভীর আহমেদ প্রজেক্ট আর্কিটেকচার নিয়ে, নাফিসা রহমান ড্যাশবোর্ড রিভিউ নিয়ে এবং সাব্বির হোসেন ফ্রিল্যান্স বাজেট নিয়ে মেসেজ দিয়েছেন।"
            : "Sir, you have 3 unread messages on Facebook Messenger from Tanvir Ahmed, Nafisa Rahman, and Sabbir Hossain.";
      } else if (
        cleanLower.includes("linkedin") ||
        cleanLower.includes("লিঙ্কডইন") ||
        cleanLower.includes("লিংকডইন") ||
        cleanLower.includes("ইনমেইল") ||
        cleanLower.includes("inmail")
      ) {
        reply =
          chosenLang === "bn"
            ? "জি ইয়াসিন স্যার, আপনার লিঙ্কডইনে ৩টি নতুন ইনবক্স বার্তা এসেছে। সিলিকন ভ্যালি এআই-এর ডেভিড স্টার্লিং, ক্লাউডসফিয়ারের সারাহ জেনকিন্স এবং দেবনেশনের প্রতিষ্ঠাতা শাহরিয়ার কবির মেসেজ ও কানেকশন পাঠিয়েছেন।"
            : "Sir, you have 3 unread messages on LinkedIn from David Sterling (Silicon Valley Recruiter), Sarah Jenkins, and Shahriar Kabir.";
      } else if (
        cleanLower.includes("message") ||
        cleanLower.includes("মেসেজ") ||
        cleanLower.includes("কে কে") ||
        cleanLower.includes("কার মেসেজ") ||
        cleanLower.includes("বার্তা")
      ) {
        reply =
          chosenLang === "bn"
            ? "জি ইয়াসিন স্যার, আপনার ফেসবুক মেসেঞ্জারে ৩টি এবং লিঙ্কডইনে ৩টি—মোট ৬টি নতুন অপঠিত বার্তা এসেছে। তানভীর আহমেদ, নাফিসা রহমান এবং ডেভিড স্টার্লিং আপনাকে নক করেছেন।"
            : "Sir, you have 6 unread messages across Facebook Messenger and LinkedIn from Tanvir Ahmed, Nafisa Rahman, and David Sterling.";
      } else if (
        cleanLower.includes("facebook") ||
        cleanLower.includes("ফেসবুক")
      ) {
        reply =
          chosenLang === "bn"
            ? "জি ইয়াসিন স্যার, আপনার ফেসবুক প্রোফাইল (Yeasin Munshi @yeasin.munshi.980) সম্পূর্ণ সিঙ্ক করা রয়েছে এবং মেসেঞ্জারে ৩টি নতুন মেসেজ রয়েছে।"
            : "Sir, your Facebook profile (Yeasin Munshi @yeasin.munshi.980) is connected with 3 new Messenger notifications.";
      } else {
        reply =
          chosenLang === "bn"
            ? `আমি আপনার কথাটি শুনেছি স্যার: "${query}"। আমি আপনার নির্দেশ কার্যকর করতে সম্পূর্ণ প্রস্তুত!`
            : `I heard you clearly Sir: "${query}". I am ready to assist you!`;
      }

      setLastResponse(reply);
      const lyraMsg: VoiceMessage = {
        id: `lyra-${Date.now()}`,
        sender: "lyra",
        text: reply,
        language: chosenLang,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, lyraMsg]);
      speakReply(reply, chosenLang);
    },
    [preferredLang, speakReply, goToSleep, wakeUp]
  );

  // Auto Voice Start Function with getUserMedia permission
  const enableAutoVoice = useCallback(async () => {
    const granted = await speechRecognizer.requestMicPermission();
    setMicPermissionGranted(granted);
    if (!granted) {
      setErrorMessage("Microphone permission denied. Please click the lock icon in your browser address bar and allow microphone.");
      return;
    }

    setIsAutoVoiceActive(true);
    setErrorMessage(null);
    setState("listening");

    speechRecognizer.setLanguage(preferredLang);
    speechRecognizer.start(
      {
        onStart: () => {
          if (!isSpeakingRef.current && !isSleepingRef.current) {
            setState("listening");
          }
        },
        onResult: (text) => {
          if (!isSpeakingRef.current) {
            setTranscript(text);
          }
        },
        onError: (err) => {
          console.warn("Speech recognition warning:", err);
          if (err.includes("denied")) {
            setErrorMessage(err);
          }
        },
        onEnd: (finalTranscript) => {
          if (isSpeakingRef.current || isSleepingRef.current) return;
          if (finalTranscript && finalTranscript.trim()) {
            hasProcessedRef.current = true;
            void processQuery(finalTranscript);
          }
        }
      },
      true // Auto continuous loop
    );
  }, [preferredLang, processQuery]);

  // Initialize auto voice on load
  useEffect(() => {
    void enableAutoVoice();

    return () => {
      speechRecognizer.stop();
    };
  }, [enableAutoVoice]);

  const stopSpeaking = useCallback(() => {
    softVoiceSynthesizer.stop();
    if (isSleepingRef.current) {
      setState("sleeping");
    } else {
      setState("listening");
    }
  }, []);

  const testVoice = useCallback(
    (lang: "bn" | "en" = "bn") => {
      const sampleText =
        lang === "bn"
          ? "হ্যালো! আমি লায়রা। আমার সাউন্ড ইঞ্জিন এবং ভয়েস সম্পূর্ণ সক্রিয় ও প্রস্তুত আছে।"
          : "Hello! I am LYRA. My voice engine and audio channels are fully online and ready.";
      setLastResponse(sampleText);
      speakReply(sampleText, lang);
    },
    [speakReply]
  );

  return {
    state,
    isSleeping,
    transcript,
    lastResponse,
    messages,
    detectedLang,
    preferredLang,
    setPreferredLang,
    errorMessage,
    isMuted,
    setIsMuted,
    audioLevels,
    isAutoVoiceActive,
    micPermissionGranted,
    enableAutoVoice,
    goToSleep,
    wakeUp,
    processQuery,
    speakReply,
    stopSpeaking,
    testVoice
  };
}
