"use client";

import React, { useState } from "react";
import {
  Gamepad2,
  MessageSquare,
  Maximize,
  Minimize,
  Radio,
  Share2,
  Newspaper,
  Camera,
  Phone,
  Sparkles
} from "lucide-react";
import QuantumNeuralOrb from "./quantum-neural-orb";
import SatelliteConstellation from "./satellite-constellation";
import HudDigitalClock from "./hud-digital-clock";
import LeftCoreHud from "./left-core-hud";
import RightStreamHud from "./right-stream-hud";
import BottomSubtitleDock from "./bottom-subtitle-dock";
import LiveNewsReaderModal, { type NewsItem } from "./live-news-reader-modal";
import SocialAccountsModal from "./social-accounts-modal";
import LyraVisionHud from "./lyra-vision-hud";
import LyraSecureLinkCall from "./lyra-secure-link-call";
import { cyberAudio } from "./cyber-audio-engine";

interface Props {
  state?: "idle" | "listening" | "processing" | "speaking" | "sleeping";
  isSleeping?: boolean;
  transcript?: string;
  lastResponse?: string | null;
  onMicClick?: () => void;
  onSubmitQuery?: (query: string) => void;
  onToggleSleep?: () => void;
  onTestVoice?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onReturnToBoot?: () => void;
  dbStatus?: string;
}

export default function JarvisCockpit({
  state = "idle",
  isSleeping = false,
  transcript = "",
  lastResponse = null,
  onMicClick,
  onSubmitQuery,
  onToggleSleep,
  onTestVoice,
  isMuted = false,
  onToggleMute,
  onReturnToBoot,
  dbStatus = "Connected"
}: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [visionInitialMode, setVisionInitialMode] = useState<"auto" | "brother" | "face">("auto");
  const [isSecureCallOpen, setIsSecureCallOpen] = useState(false);

  const [newsArticles, setNewsArticles] = useState<NewsItem[]>([
    {
      id: "prothomalo-1",
      title: "বাংলাদেশ টেক ও এআই সেক্টরে তরুণ ডেভেলপারদের উদ্ভাবনী উদ্যোগ বৃদ্ধি",
      snippet: "আন্তর্জাতিক বাজারে বাংলাদেশি এআই সফটওয়্যার ও অটোমেশন সলিউশনের গ্রহণযোগ্যতা বাড়ছে। তরুণ উদ্যোক্তারা নতুন স্টার্টআপ গড়ে তুলছেন।",
      source: "Prothom Alo / প্রথম আলো",
      sourceUrl: "https://www.prothomalo.com",
      publishedAt: "আজকের তাজা খবর"
    },
    {
      id: "tech-2",
      title: "গ্লোবাল এআই ও ক্লাউড অটোমেশনে ওপেন সোর্স প্রযুক্তির নতুন বিপ্লব",
      snippet: "নেক্সট-জেন লার্জ ল্যাঙ্গুয়েজ মডেল ও ভয়েস অ্যাসিস্ট্যান্ট প্ল্যাটফর্মগুলো দৈনন্দিন কর্মজীবনকে আরও দ্রুত এবং স্বয়ংক্রিয় করে তুলছে।",
      source: "Tech News BD",
      sourceUrl: "https://www.thedailystar.net",
      publishedAt: "আজকের প্রধান খবর"
    }
  ]);

  const toggleFullscreen = () => {
    cyberAudio.playNodeClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleOrbClick = () => {
    cyberAudio.playWakeChime();
    onMicClick?.();
  };

  const fetchLiveNews = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/world/news?lang=bn`);
      if (res.ok) {
        const json = await res.json();
        if (json.data?.articles) {
          setNewsArticles(json.data.articles);
        }
      }
    } catch {}
    setIsNewsModalOpen(true);
  };

  const handleSelectNode = (prompt: string, nodeId: string) => {
    if (nodeId === "website") {
      void fetchLiveNews();
    } else if (nodeId === "social") {
      setIsSocialModalOpen(true);
    } else if (nodeId === "today") {
      void fetchLiveNews();
    }
    onSubmitQuery?.(prompt);
  };

  const handleUserQuery = (prompt: string) => {
    const clean = prompt.toLowerCase();
    if (
      clean.includes("camera") ||
      clean.includes("ক্যামেরা") ||
      clean.includes("vision") ||
      clean.includes("ভিশন") ||
      clean.includes("সামনে কে") ||
      clean.includes("ছোট ভাই")
    ) {
      setVisionInitialMode(clean.includes("ছোট ভাই") ? "brother" : "auto");
      setIsVisionModalOpen(true);
    } else if (
      clean.includes("call") ||
      clean.includes("কল দাও") ||
      clean.includes("ভাবি") ||
      clean.includes("secure link")
    ) {
      setIsSecureCallOpen(true);
    } else if (clean.includes("social") || clean.includes("ফেসবুক") || clean.includes("লিঙ্কডইন")) {
      setIsSocialModalOpen(true);
    }
    onSubmitQuery?.(prompt);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020604] text-white flex flex-col justify-between p-3 sm:p-5 lg:p-6 select-none font-sans">
      {/* 1. Deep Cybernetic Energy Field & Ambient Aura */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Central Radial Emerald Plasma Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[45rem] w-[45rem] rounded-full blur-[160px] bg-emerald-500/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[22rem] w-[22rem] rounded-full blur-[100px] bg-lime-400/20" />

        {/* Top & Bottom Ambient Vignette Flares */}
        <div className="absolute top-0 left-1/4 h-[20rem] w-[20rem] rounded-full bg-emerald-700/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-[20rem] w-[20rem] rounded-full bg-lime-600/10 blur-[140px]" />

        {/* Subtle Cyber Target HUD Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[32rem] w-[48rem] rounded-full border border-emerald-500/[0.04] pointer-events-none" />
      </div>

      {/* 2. Top Bar matching TV Screen: Center Clock & Right Control Icons */}
      <header className="relative z-30 flex items-start justify-between gap-4">
        {/* Left Brand Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-500 font-black text-black shadow-lg shadow-emerald-500/20">
            L
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-black tracking-widest text-white uppercase font-mono">
                LYRA AI
              </h1>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                YEASIN MUNSHI
              </span>
            </div>
            <p className="text-[9px] text-emerald-400/80 font-mono">NEURAL COCKPIT V4.16</p>
          </div>
        </div>

        {/* Center Digital Clock (22:41:58 • Good evening, Sir • Rangpur 21°C) */}
        <div className="flex-1 max-w-xl">
          <HudDigitalClock assistantName="LYRA" isSleeping={isSleeping} />
        </div>

        {/* Right HUD Control Icons matching TV Photo: Gamepad, Chat, Fullscreen, Avatar */}
        <div className="flex items-center gap-2">
          {/* Gamepad / Matrix Button */}
          <button
            type="button"
            onClick={() => {
              cyberAudio.playNodeClick();
              setIsVisionModalOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/30 bg-[#06180e]/80 text-emerald-300 hover:bg-emerald-500/20 transition shadow-sm"
            title="LYRA Optical Vision"
          >
            <Gamepad2 size={15} />
          </button>

          {/* Chat / News Button */}
          <button
            type="button"
            onClick={() => {
              cyberAudio.playNodeClick();
              void fetchLiveNews();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/30 bg-[#06180e]/80 text-emerald-300 hover:bg-emerald-500/20 transition shadow-sm"
            title="Live News Reader"
          >
            <MessageSquare size={15} />
          </button>

          {/* Fullscreen Expand Button [ ] */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/30 bg-[#06180e]/80 text-emerald-300 hover:bg-emerald-500/20 transition shadow-sm"
            title="Toggle TV Fullscreen"
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>

          {/* User Status Avatar Pill */}
          <button
            type="button"
            onClick={() => {
              cyberAudio.playNodeClick();
              setIsSocialModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 py-1 pl-1 pr-2.5 text-xs text-white shadow-sm hover:border-emerald-400 transition"
            title="Yeasin Munshi Profile"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-lime-400 font-bold text-[10px] text-black">
              Y
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>
      </header>

      {/* 3. Central Cockpit Matrix: Left Card, Center Plasma Orb with 10 Nodes, Right Card */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between gap-4 my-auto w-full max-w-[1500px] mx-auto py-2">
        {/* Left Side Card: LYRA CORE */}
        <div className="w-full lg:w-[300px] shrink-0 order-2 lg:order-1 flex justify-center lg:justify-start">
          <LeftCoreHud
            state={state}
            isSleeping={isSleeping}
            onToggleSleep={onToggleSleep}
            onTestVoice={onTestVoice}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onOpenNews={fetchLiveNews}
            onOpenSocial={() => setIsSocialModalOpen(true)}
          />
        </div>

        {/* Center Arena: 10 Orbiting Satellite Nodes & Electric Green Plasma Orb */}
        <div className="relative flex-1 flex items-center justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] w-full order-1 lg:order-2">
          {/* 10 Orbiting Nodes with Laser Circuit Connectors */}
          <SatelliteConstellation
            orbitRadius={190}
            onSelectNode={handleSelectNode}
          />

          {/* Central Organic Electric Green Plasma Energy Orb */}
          <div className="relative z-20">
            <QuantumNeuralOrb
              state={state}
              size={290}
              onClick={handleOrbClick}
            />
          </div>
        </div>

        {/* Right Side Card: AI BRAIN & Model Latency Gauges */}
        <div className="w-full lg:w-[300px] shrink-0 order-3 flex justify-center lg:justify-end">
          <RightStreamHud
            dbStatus={dbStatus}
            onSelectChat={(text) => handleUserQuery(text)}
          />
        </div>
      </main>

      {/* 4. Bottom Area: Subtitle Speech Text & Floating Mic Console Pill */}
      <footer className="relative z-30 pt-1 pb-2">
        <BottomSubtitleDock
          state={state}
          transcript={transcript}
          lastResponse={lastResponse}
          onMicClick={onMicClick}
          onSubmitText={handleUserQuery}
          isSleeping={isSleeping}
        />
      </footer>

      {/* Modals for Live News, Social Accounts, Vision & Secure Call */}
      <LiveNewsReaderModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
        articles={newsArticles}
        onReadAloud={(text) => onSubmitQuery?.(text)}
      />

      <SocialAccountsModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        onAskAccount={(q) => onSubmitQuery?.(q)}
      />

      <LyraVisionHud
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
        onSpeakFeedback={(text) => onSubmitQuery?.(text)}
        initialMode={visionInitialMode}
      />

      <LyraSecureLinkCall
        isOpen={isSecureCallOpen}
        onClose={() => setIsSecureCallOpen(false)}
        callerName="স্যার"
        receiverName="ভাবি"
      />
    </div>
  );
}
