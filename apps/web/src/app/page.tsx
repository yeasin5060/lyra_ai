"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Layers,
  LayoutGrid,
  Radio,
  Share2,
  ShieldCheck,
  Sparkles,
  Zap,
  BellRing
} from "lucide-react";
import JarvisCockpit from "@/components/jarvis/jarvis-cockpit";
import JarvisBootScreen from "@/components/jarvis/jarvis-boot-screen";
import MediaCommandCenter from "@/components/media/media-command-center";
import LiveMessagesVault from "@/components/media/live-messages-vault";
import QuickStatsStrip from "@/components/dashboard/quick-stats-strip";
import VoiceStatusCard from "@/components/dashboard/voice-status-card";
import IntegrationHubCard from "@/components/dashboard/integration-hub-card";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import { cyberAudio } from "@/components/jarvis/cyber-audio-engine";

export default function Home() {
  const [hasLaunched, setHasLaunched] = useState(false);
  const [activeView, setActiveView] = useState<"cockpit" | "grid">("cockpit");
  const [apiStatus, setApiStatus] = useState("Checking...");

  const {
    state,
    isSleeping,
    transcript,
    lastResponse,
    isMuted,
    setIsMuted,
    goToSleep,
    wakeUp,
    processQuery,
    testVoice,
    enableAutoVoice
  } = useVoiceAssistant();

  // Check health and database status
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/health`, {
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Offline");
        const data = await response.json();
        setApiStatus(data.database === "connected" ? "Connected" : "Standby");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setApiStatus("Standby");
        }
      });

    return () => controller.abort();
  }, []);

  const handleLaunchFromBoot = () => {
    enableAutoVoice();
    setHasLaunched(true);
    cyberAudio.playBootSound();
  };

  const handleMicClick = () => {
    if (isSleeping) {
      wakeUp();
    } else {
      enableAutoVoice();
      cyberAudio.playWakeChime();
    }
  };

  const handleToggleSleep = () => {
    if (isSleeping) {
      wakeUp();
    } else {
      goToSleep();
    }
  };

  const handleQuery = (query: string) => {
    processQuery(query);
  };

  return (
    <div className="min-h-screen bg-[#04030a] text-white font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* 1. CINEMATIC BOOT SCREEN (Video Signature opening) */}
      {!hasLaunched ? (
        <JarvisBootScreen onLaunch={handleLaunchFromBoot} assistantName="LYRA" />
      ) : (
        <div className="relative flex flex-col min-h-screen">
          {/* Top Floating View Switcher Bar */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1 rounded-2xl border border-white/10 bg-[#090814]/80 p-1 backdrop-blur-xl shadow-lg">
            <button
              onClick={() => {
                cyberAudio.playNodeClick();
                setActiveView("cockpit");
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeView === "cockpit"
                  ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-md shadow-cyan-900/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles size={13} />
              <span>Cockpit HUD (Video Mode)</span>
            </button>

            <button
              onClick={() => {
                cyberAudio.playNodeClick();
                setActiveView("grid");
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeView === "grid"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-900/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <LayoutGrid size={13} />
              <span>Full Command Hub View</span>
            </button>
          </div>

          {/* 2. MAIN COCKPIT VIEW (Exact Video match with 8 Orbiting Nodes, Center Orb & Dual HUDs) */}
          <div className={activeView === "cockpit" ? "block" : "hidden"}>
            <JarvisCockpit
              state={state}
              isSleeping={isSleeping}
              transcript={transcript}
              lastResponse={lastResponse}
              onMicClick={handleMicClick}
              onSubmitQuery={handleQuery}
              onToggleSleep={handleToggleSleep}
              onTestVoice={testVoice}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              onReturnToBoot={() => setHasLaunched(false)}
              dbStatus={apiStatus}
            />
          </div>

          {/* 3. EXTENDED COMMAND HUB VIEW (Access to Media Command Center & Messages Vault) */}
          <div className={activeView === "grid" ? "block" : "hidden"}>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pt-16">
              {/* Back to Cockpit shortcut button */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-wide text-white">
                    LYRA AI • Extended Command Center
                  </h2>
                  <p className="text-xs text-gray-400">
                    Detailed media monitoring, inbound message vault, and integration overview
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("cockpit")}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-600/20 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-600 hover:text-white"
                >
                  <Sparkles size={14} />
                  <span>Return to Cockpit HUD</span>
                </button>
              </div>

              {/* Quick Metrics */}
              <QuickStatsStrip />

              {/* Status and Hub Cards */}
              <div className="grid gap-6 md:grid-cols-2">
                <VoiceStatusCard />
                <IntegrationHubCard />
              </div>

              {/* Live Inbound Messages Vault */}
              <LiveMessagesVault onReadMessage={(text) => processQuery(text)} />

              {/* Media & Social Command Center */}
              <MediaCommandCenter onAskPlatform={(query) => processQuery(query)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
