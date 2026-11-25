"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Cpu,
  Mic,
  MicOff,
  Moon,
  Radio,
  Sun,
  Volume2,
  Zap,
  ShieldCheck
} from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

interface Props {
  state?: "idle" | "listening" | "processing" | "speaking" | "sleeping";
  isSleeping?: boolean;
  onToggleSleep?: () => void;
  onTestVoice?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export default function LeftCoreHud({
  state = "idle",
  isSleeping = false,
  onToggleSleep,
  onTestVoice,
  isMuted = false,
  onToggleMute
}: Props) {
  const [latency, setLatency] = useState(14);
  const [memoryUsage, setMemoryUsage] = useState(412);

  // Subtle real-time fluctuation to look like a living AI system
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(12 + Math.random() * 6));
      setMemoryUsage(Math.floor(408 + Math.random() * 12));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e0c1f]/90 via-[#0a0817]/90 to-[#05040d]/95 p-5 shadow-2xl backdrop-blur-2xl">
      {/* Corner Sci-Fi cyber accents */}
      <div className="pointer-events-none absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-emerald-400" />
      <div className="pointer-events-none absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-cyan-400" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Cpu size={16} />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-widest text-white uppercase">
                LIVE CORE MONITOR
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">NEURAL SUBSYSTEM V4.2</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            ONLINE
          </span>
        </div>

        {/* Oscilloscope Frequency Visualizer */}
        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3">
          <div className="flex items-center justify-between text-[10px] text-emerald-300 font-mono mb-2">
            <span>FREQUENCY SPECTRUM</span>
            <span>{state.toUpperCase()}</span>
          </div>

          <div className="flex items-end justify-between gap-1 h-12 px-1">
            {Array.from({ length: 18 }).map((_, i) => {
              // Dynamic height based on state
              const isSpeaking = state === "speaking";
              const isListening = state === "listening";
              const factor = isSpeaking ? 0.85 : isListening ? 0.5 : isSleeping ? 0.15 : 0.25;
              const heightPct = Math.max(
                12,
                Math.floor(
                  Math.sin(i * 0.4 + (isSpeaking ? Date.now() / 150 : 1)) * 40 * factor + 50 * factor
                )
              );

              return (
                <div
                  key={i}
                  className="w-full rounded-t transition-all duration-150"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: isSleeping
                      ? "#38bdf8"
                      : isSpeaking
                      ? "#10b981"
                      : isListening
                      ? "#ec4899"
                      : "#6366f1",
                    opacity: 0.85
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-4 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-2.5 border border-white/5">
            <span className="text-gray-400 text-[11px]">System Latency</span>
            <span className="font-bold text-emerald-400">{latency} ms</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-2.5 border border-white/5">
            <span className="text-gray-400 text-[11px]">Memory Allocation</span>
            <span className="font-bold text-cyan-400">{memoryUsage} MB / 8 GB</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-2.5 border border-white/5">
            <span className="text-gray-400 text-[11px]">Wake Word Engine</span>
            <span className="font-bold text-violet-300">'Hey LYRA'</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-2.5 border border-white/5">
            <span className="text-gray-400 text-[11px]">Voice Persona</span>
            <span className="font-bold text-pink-300">Soft Female (1.15x)</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-2.5 border border-white/5">
            <span className="text-gray-400 text-[11px]">Optical Vision</span>
            <span className="font-bold text-emerald-400">Zara-Style Eye (Active)</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
        <button
          onClick={() => {
            cyberAudio.playNodeClick();
            onToggleSleep?.();
          }}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition shadow-lg ${
            isSleeping
              ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-emerald-900/40"
              : "bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50"
          }`}
        >
          {isSleeping ? <Sun size={15} /> : <Moon size={15} />}
          <span>{isSleeping ? "জেগে ওঠো (Wake LYRA)" : "লায়রা তুমি ঘুমাও (Sleep Mode)"}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              cyberAudio.playNodeClick();
              onTestVoice?.();
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-semibold text-gray-300 transition hover:bg-white/10"
          >
            <Volume2 size={13} className="text-cyan-400" />
            <span>ভয়েস টেস্ট</span>
          </button>

          <button
            onClick={() => {
              cyberAudio.playNodeClick();
              onToggleMute?.();
            }}
            className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] font-semibold transition ${
              isMuted
                ? "border-rose-500/40 bg-rose-500/20 text-rose-300"
                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {isMuted ? <MicOff size={13} /> : <Mic size={13} className="text-emerald-400" />}
            <span>{isMuted ? "Unmute" : "Mute Mic"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
