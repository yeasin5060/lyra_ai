"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  Globe,
  LayoutDashboard,
  Mail,
  Mic,
  Music,
  Radio,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  BellRing
} from "lucide-react";
import TopNav from "@/components/dashboard/top-nav";
import QuickStatsStrip from "@/components/dashboard/quick-stats-strip";
import VoiceInteractionHub from "@/components/voice/voice-interaction-hub";
import MediaCommandCenter from "@/components/media/media-command-center";
import LiveMessagesVault from "@/components/media/live-messages-vault";
import VoiceStatusCard from "@/components/dashboard/voice-status-card";
import IntegrationHubCard from "@/components/dashboard/integration-hub-card";
import { softVoiceSynthesizer } from "@/lib/voice/speech-synthesizer";

const navItems = [
  { name: "Voice & Wake Word", icon: Mic, active: true },
  { name: "Live Inbound Messages", icon: BellRing },
  { name: "Media Command Hub", icon: Share2 },
  { name: "Dashboard Overview", icon: LayoutDashboard },
  { name: "Gmail & Communications", icon: Mail },
  { name: "Smart Calendar", icon: CalendarDays },
  { name: "Audio & Spotify Vibe", icon: Music },
  { name: "Speech & Persona Config", icon: Radio },
  { name: "Analytics & Memory", icon: Activity },
  { name: "Security Vault", icon: ShieldCheck }
];

export default function Home() {
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [activeVoicePrompt, setActiveVoicePrompt] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/health`, {
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Offline");
        const data = await response.json();
        setApiStatus(data.database === "connected" ? "Connected" : "Degraded");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setApiStatus("Offline");
        }
      });

    return () => controller.abort();
  }, []);

  const handleSpeakSpeech = (textToSpeak: string) => {
    softVoiceSynthesizer.speak(textToSpeak, {
      language: "bn",
      pitch: 1.15,
      rate: 0.94
    });
  };

  const handleAskPlatform = (query: string) => {
    setActiveVoicePrompt(query);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/voice/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: query, language: "bn" })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.replyText) {
          handleSpeakSpeech(data.data.replyText);
        }
      })
      .catch(() => {
        handleSpeakSpeech(
          `আপনার এখনো কোনো সোশ্যাল মিডিয়া বা মেসেজিং অ্যাকাউন্ট সংযুক্ত করা নেই।`
        );
      });
  };

  return (
    <div className="flex min-h-screen bg-[#05040a] text-white selection:bg-violet-600/40 selection:text-white font-sans">
      {/* Aggressive Cyberpunk Background Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 h-[25rem] w-[25rem] rounded-full bg-fuchsia-600/10 blur-[140px]" />
        <div className="absolute top-1/2 right-10 h-[20rem] w-[20rem] rounded-full bg-cyan-600/5 blur-[120px]" />
      </div>

      {/* Aggressive Luxury Cyber Glass Sidebar */}
      <aside className="relative z-10 hidden w-72 shrink-0 border-r border-violet-500/20 bg-[#080612]/95 p-6 md:flex md:flex-col justify-between backdrop-blur-3xl shadow-2xl">
        <div>
          {/* Logo Brand Header with neon pulse */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 shadow-xl shadow-violet-600/50 border border-violet-400/40">
              <span className="text-2xl font-light tracking-wider text-white">L</span>
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-[0.2em] text-white">LYRA AI</h1>
                <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-violet-300 border border-violet-500/40">
                  M3 Live
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-violet-300/80 uppercase">
                HANDS-FREE WAKE WORD MATRIX
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-[11px] text-emerald-300">
            <Zap size={14} className="text-emerald-400 shrink-0 animate-bounce" />
            <span>'Hey LYRA' Wake Word & Messages Access</span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-to-r from-violet-600/30 via-purple-600/15 to-transparent text-white border border-violet-500/40 shadow-lg shadow-violet-950/40"
                      : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    size={17}
                    className={item.active ? "text-violet-400" : "text-gray-500"}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom System HUD Diagnostic Widget */}
        <div className="mt-6 rounded-2xl border border-violet-500/25 bg-gradient-to-b from-white/[0.04] to-black/40 p-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Wake Word Radar</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              ALWAYS-ON
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Activation Word</span>
            <span className="text-violet-300 font-semibold">'Hey LYRA' / 'লায়রা'</span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Messages Vault</span>
            <span className="text-cyan-400 font-semibold">Live Access (FB/WA/IG/GM)</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span>Voice Response</span>
            <span className="text-emerald-400">100% Spoken Out Loud</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto">
        <TopNav apiStatus={apiStatus} />

        <main className="flex-1 p-5 md:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* Quick Metrics Bar */}
          <QuickStatsStrip />

          {/* Core Voice Hub & Sidebar Status */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left 2 Cols: Main Interactive Voice Hub */}
            <div className="lg:col-span-2">
              <VoiceInteractionHub externalQuery={activeVoicePrompt || undefined} />
            </div>

            {/* Right 1 Col: Engine Status & Quick Integration Preview */}
            <div className="space-y-6">
              <VoiceStatusCard />
              <IntegrationHubCard />
            </div>
          </div>

          {/* LIVE INBOUND MESSAGES VAULT (WHO MESSAGED ME) */}
          <LiveMessagesVault onReadMessage={handleSpeakSpeech} />

          {/* ALL MEDIA PLATFORMS COMMAND CENTER */}
          <MediaCommandCenter onAskPlatform={handleAskPlatform} />

          {/* Aggressive Cyber Footer Notice */}
          <footer className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 text-xs text-gray-500">
            <p>
              LYRA AI · Hands-Free Wake Word Engine • Full Messages & Social Platform Access
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Wake Word 'Hey LYRA' Active
              </span>
              <span>·</span>
              <span className="text-violet-400">Milestone 3 Certified</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
