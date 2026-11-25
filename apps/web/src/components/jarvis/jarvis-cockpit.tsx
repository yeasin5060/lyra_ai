"use client";

import React, { useState } from "react";
import {
  Maximize,
  Minimize,
  Moon,
  Radio,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  LayoutGrid
} from "lucide-react";
import QuantumNeuralOrb from "./quantum-neural-orb";
import SatelliteConstellation from "./satellite-constellation";
import HudDigitalClock from "./hud-digital-clock";
import LeftCoreHud from "./left-core-hud";
import RightStreamHud from "./right-stream-hud";
import BottomSubtitleDock from "./bottom-subtitle-dock";
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
  const [themeColor, setThemeColor] = useState<"emerald" | "cyan" | "violet">("emerald");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    cyberAudio.playNodeClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    cyberAudio.setSoundEnabled(next);
    if (next) cyberAudio.playWakeChime();
  };

  const handleOrbClick = () => {
    cyberAudio.playWakeChime();
    onMicClick?.();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#04030a] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      {/* Sci-Fi Quantum Hologram Background Grid & Energy Field */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Central Radial Atmospheric Glows */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[50rem] w-[50rem] rounded-full blur-[160px] opacity-25 transition-colors duration-1000"
          style={{
            backgroundColor:
              themeColor === "emerald"
                ? "#10b981"
                : themeColor === "cyan"
                ? "#06b6d4"
                : "#8b5cf6"
          }}
        />

        {/* Ambient Top & Bottom Flares */}
        <div className="absolute top-0 left-1/3 h-[25rem] w-[25rem] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/3 h-[25rem] w-[25rem] rounded-full bg-emerald-600/10 blur-[140px]" />

        {/* Cyberpunk Concentric Target HUD Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[34rem] w-[34rem] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[48rem] w-[48rem] rounded-full border border-dashed border-white/[0.03] pointer-events-none" />
      </div>

      {/* Top Cockpit Header Bar */}
      <header className="relative z-30 flex items-center justify-between gap-4 border-b border-white/10 pb-3">
        {/* Left Brand Badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-600 font-black text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/30">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-widest text-white uppercase">
                LYRA AI
              </h1>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                M3 LIVE
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">AUTONOMOUS PERSONAL INTELLIGENCE</p>
          </div>
        </div>

        {/* Top Digital Sci-Fi Clock */}
        <div className="hidden md:block flex-1 max-w-xl">
          <HudDigitalClock assistantName="LYRA" isSleeping={isSleeping} />
        </div>

        {/* Right HUD Controls: Theme, Sound, Fullscreen, Standby */}
        <div className="flex items-center gap-2">
          {/* Theme Palette Switcher */}
          <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setThemeColor("emerald")}
              className={`h-6 w-6 rounded-lg transition-all ${
                themeColor === "emerald"
                  ? "bg-emerald-500 shadow-md shadow-emerald-500/40 scale-105"
                  : "bg-emerald-950/60 opacity-60 hover:opacity-100"
              }`}
              title="Emerald Theme (Video Match)"
            />
            <button
              onClick={() => setThemeColor("cyan")}
              className={`h-6 w-6 rounded-lg transition-all ${
                themeColor === "cyan"
                  ? "bg-cyan-500 shadow-md shadow-cyan-500/40 scale-105"
                  : "bg-cyan-950/60 opacity-60 hover:opacity-100"
              }`}
              title="Cyan Theme"
            />
            <button
              onClick={() => setThemeColor("violet")}
              className={`h-6 w-6 rounded-lg transition-all ${
                themeColor === "violet"
                  ? "bg-violet-500 shadow-md shadow-violet-500/40 scale-105"
                  : "bg-violet-950/60 opacity-60 hover:opacity-100"
              }`}
              title="Violet Theme"
            />
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10"
            title={soundEnabled ? "Disable UI Sound Effects" : "Enable UI Sound Effects"}
          >
            {soundEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} />}
          </button>

          {/* Fullscreen Toggle (Exact Video match) */}
          <button
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10"
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>

          {/* Standby / Boot Screen Trigger */}
          {onReturnToBoot && (
            <button
              onClick={() => {
                cyberAudio.playNodeClick();
                onReturnToBoot();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
              title="Return to Standby Screen"
            >
              <Radio size={13} />
              <span className="hidden sm:inline">Standby</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Clock (shows on small screens only) */}
      <div className="md:hidden mt-2">
        <HudDigitalClock assistantName="LYRA" isSleeping={isSleeping} />
      </div>

      {/* Central Interactive Battle Station / Matrix Area */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 my-auto w-full max-w-7xl mx-auto py-4">
        {/* Left HUD Panel: LIVE CORE */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 order-2 lg:order-1">
          <LeftCoreHud
            state={state}
            isSleeping={isSleeping}
            onToggleSleep={onToggleSleep}
            onTestVoice={onTestVoice}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
          />
        </div>

        {/* Center Arena: Quantum Neural Orb & 8 Orbiting Satellite Nodes */}
        <div className="relative flex-1 flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] w-full order-1 lg:order-2">
          {/* Satellite Constellation with 8 Orbiting Nodes & Laser Circuit Connectors */}
          <SatelliteConstellation
            orbitRadius={190}
            onSelectNode={(prompt) => {
              onSubmitQuery?.(prompt);
            }}
            themeColor={themeColor}
          />

          {/* Central Quantum Neural Orb (Canvas Matrix) */}
          <div className="relative z-20">
            <QuantumNeuralOrb
              state={state}
              size={210}
              themeColor={themeColor}
              onClick={handleOrbClick}
            />
          </div>
        </div>

        {/* Right HUD Panel: AI BRAIN - System Stream */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 order-3">
          <RightStreamHud dbStatus={dbStatus} />
        </div>
      </main>

      {/* Bottom Subtitle & Interactive Voice Console Dock */}
      <footer className="relative z-30 pt-2 pb-2">
        <BottomSubtitleDock
          state={state}
          transcript={transcript}
          lastResponse={lastResponse}
          onMicClick={onMicClick}
          onSubmitText={onSubmitQuery}
          isSleeping={isSleeping}
        />
      </footer>
    </div>
  );
}
