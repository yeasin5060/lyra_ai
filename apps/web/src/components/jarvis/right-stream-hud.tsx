"use client";

import React, { useEffect, useState } from "react";
import { Activity, Database, Network, Radio, Shield, Sparkles } from "lucide-react";

interface ServiceStreamItem {
  id: string;
  name: string;
  type: string;
  pingMs: number;
  status: "live" | "syncing" | "ready";
  color: string;
}

const INITIAL_SERVICES: ServiceStreamItem[] = [
  { id: "fb", name: "Facebook Webhook", type: "Messenger Protocol", pingMs: 34, status: "live", color: "#1877F2" },
  { id: "vis", name: "LYRA Optical Eye", type: "Multimodal Vision", pingMs: 16, status: "live", color: "#00F0FF" },
  { id: "wa", name: "WhatsApp Bridge", type: "Real-time Daemon", pingMs: 12, status: "live", color: "#25D366" },
  { id: "ig", name: "Instagram API", type: "DM Synchronization", pingMs: 48, status: "live", color: "#E4405F" },
  { id: "gm", name: "Gmail Priority", type: "Cloud Auth Hook", pingMs: 22, status: "live", color: "#EA4335" },
  { id: "tg", name: "Telegram Daemon", type: "Bot Gateway", pingMs: 18, status: "live", color: "#0088CC" },
  { id: "yt", name: "YouTube Studio", type: "Analytics Stream", pingMs: 41, status: "live", color: "#FF0000" },
  { id: "tw", name: "X (Twitter) Stream", type: "Event Listener", pingMs: 38, status: "live", color: "#1DA1F2" }
];

interface Props {
  dbStatus?: string;
}

export default function RightStreamHud({ dbStatus = "Connected" }: Props) {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [neuralLoad, setNeuralLoad] = useState(74);

  // Subtle real-time latency updates for live futuristic feel
  useEffect(() => {
    const interval = setInterval(() => {
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          pingMs: Math.max(8, s.pingMs + Math.floor(Math.random() * 7) - 3)
        }))
      );
      setNeuralLoad((prev) => Math.min(88, Math.max(68, prev + Math.floor(Math.random() * 5) - 2)));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e0c1f]/90 via-[#0a0817]/90 to-[#05040d]/95 p-5 shadow-2xl backdrop-blur-2xl">
      {/* Corner Sci-Fi cyber accents */}
      <div className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-emerald-400" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              <Network size={16} />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-widest text-white uppercase">
                AI BRAIN • STREAM
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">REAL-TIME TELEMETRY</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
            LIVE
          </span>
        </div>

        {/* Live Service Feed Stream (Exact Video Match!) */}
        <div className="mt-3.5 space-y-1.5 font-mono text-[11px]">
          {services.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-white/[0.025] px-3 py-2 border border-white/5 transition hover:bg-white/[0.06] hover:border-cyan-500/30"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
                />
                <span className="font-semibold text-gray-200 truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-gray-500">{item.type}</span>
                <span className="font-bold text-emerald-400 text-[10px] bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {item.pingMs}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Circular Gauge & Database HUD */}
      <div className="mt-5 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] p-3.5 border border-white/5">
          {/* Circular SVG Gauge */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              {/* Background ring */}
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress ring */}
              <path
                className="text-cyan-400 transition-all duration-700"
                strokeDasharray={`${neuralLoad}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-black text-white">{neuralLoad}%</span>
              <span className="text-[8px] text-gray-400 font-mono">LOAD</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 font-mono text-xs">
            <div className="flex items-center justify-between text-gray-300">
              <span className="text-[11px] text-gray-400">Neural Matrix</span>
              <span className="text-cyan-300 font-bold">Optimal</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-gray-300">
              <span className="text-[11px] text-gray-400">MongoDB Atlas</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Database size={11} />
                {dbStatus}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-gray-300">
              <span className="text-[11px] text-gray-400">Bandwidth</span>
              <span className="text-violet-300 font-bold">1.2 Gbps</span>
            </div>
          </div>
        </div>

        {/* Model Latency & Inference Meters (Exact Video 3 Match!) */}
        <div className="mt-3 space-y-2 pt-2 border-t border-white/5 font-mono text-[11px]">
          <div>
            <div className="flex items-center justify-between text-gray-300 mb-1">
              <span className="text-[10px] text-gray-400">Claude 3.5 Sonnet</span>
              <span className="text-emerald-400 font-bold text-[10px]">37% • 1.1s</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full w-[37%]" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-gray-300 mb-1">
              <span className="text-[10px] text-gray-400">ElevenLabs Neural Voice</span>
              <span className="text-cyan-400 font-bold text-[10px]">29% • 0.3s</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full w-[29%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
