"use client";

import React, { useState } from "react";
import {
  Cpu,
  Tv,
  Share2,
  Radio,
  Sparkles,
  MessageCircle,
  Instagram,
  Send,
  Twitter,
  ChevronRight
} from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

interface Props {
  state?: "idle" | "listening" | "processing" | "speaking" | "sleeping";
  isSleeping?: boolean;
  onToggleSleep?: () => void;
  onTestVoice?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onOpenNews?: () => void;
  onOpenSocial?: () => void;
}

interface EventLog {
  id: string;
  time: string;
  text: string;
  type: "msg" | "social" | "sys" | "media";
}

const DEFAULT_EVENTS: EventLog[] = [
  { id: "1", time: "10:14 PM", text: "তানভীর আহমেদকে টেক্সট করা হয়েছে...", type: "msg" },
  { id: "2", time: "10:12 PM", text: "নতুন ফেসবুক ফ্রেন্ড রিকোয়েস্ট গৃহীত", type: "social" },
  { id: "3", time: "10:08 PM", text: "আজ রাত ১১টায় সাক্ষাৎকার অনুষ্ঠিত হবে", type: "media" },
  { id: "4", time: "10:05 PM", text: "সার্ভার ব্যাকআপ সম্পন্ন: database ok", type: "sys" },
  { id: "5", time: "09:50 PM", text: "প্রথম আলো লাইভ নিউজ হেডলাইন সিঙ্কড", type: "media" }
];

export default function LeftCoreHud({
  state = "idle",
  isSleeping = false,
  onOpenNews,
  onOpenSocial
}: Props) {
  const [activeTab, setActiveTab] = useState<"social" | "media" | "tv">("tv");
  const [activeModel, setActiveModel] = useState<"claude" | "gemini">("claude");

  const isSpeaking = state === "speaking";
  const isListening = state === "listening";

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-[#06120b]/90 p-4 shadow-[0_0_40px_rgba(34,197,94,0.15)] text-white backdrop-blur-xl font-sans select-none max-w-[290px] sm:max-w-[310px] w-full">
      {/* Top Header matching TV Screen Photo */}
      <div>
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Cpu size={15} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black tracking-widest text-white uppercase">
                  LYRA CORE
                </h3>
              </div>
              <p className="text-[10px] text-emerald-400/80 font-mono">v4.16.89 • 99%</p>
            </div>
          </div>

          <span className="flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
            LIVE
          </span>
        </div>

        {/* Audio Waveform Horizontal Line */}
        <div className="my-3 flex items-center justify-between gap-1 h-5 px-1 rounded-lg bg-[#040d07] border border-emerald-500/20">
          {Array.from({ length: 24 }).map((_, i) => {
            const factor = isSpeaking ? 0.9 : isListening ? 0.6 : 0.25;
            const h = Math.max(
              15,
              Math.floor(Math.sin(i * 0.5 + Date.now() / 200) * 40 * factor + 50 * factor)
            );
            return (
              <div
                key={i}
                className="w-1 rounded-full transition-all duration-150"
                style={{
                  height: `${h}%`,
                  backgroundColor: isSpeaking ? "#22c55e" : isListening ? "#4ade80" : "#15803d"
                }}
              />
            );
          })}
        </div>

        {/* Tab Pills: Social | Media | TV (Exact TV match with TV highlighted in green) */}
        <div className="flex items-center gap-1.5 mb-3 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("social");
              onOpenSocial?.();
            }}
            className={`flex-1 py-1 rounded-lg text-center transition font-semibold ${
              activeTab === "social"
                ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30"
                : "bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]"
            }`}
          >
            Social
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("media");
              cyberAudio.playNodeClick();
            }}
            className={`flex-1 py-1 rounded-lg text-center transition font-semibold ${
              activeTab === "media"
                ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30"
                : "bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]"
            }`}
          >
            Media
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("tv");
              onOpenNews?.();
            }}
            className={`flex-1 py-1 rounded-lg text-center transition font-semibold ${
              activeTab === "tv"
                ? "bg-lime-500 text-black font-bold shadow-md shadow-lime-500/40"
                : "bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]"
            }`}
          >
            TV Live
          </button>
        </div>

        {/* AI Model Indicator Pill */}
        <div className="flex items-center justify-between rounded-xl bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-1.5 mb-3 font-mono text-[10px]">
          <span className="text-gray-300 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            AI: {activeModel === "claude" ? "Claude 3.5 Sonnet" : "Gemini 2.0 Flash"}
          </span>
          <button
            type="button"
            onClick={() => {
              cyberAudio.playNodeClick();
              setActiveModel(activeModel === "claude" ? "gemini" : "claude");
            }}
            className="text-emerald-300 hover:text-white underline cursor-pointer"
          >
            Switch
          </button>
        </div>

        {/* Live Timeline Event Log List matching Photo */}
        <div className="space-y-1.5 font-mono text-[11px]">
          {DEFAULT_EVENTS.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-1.5 rounded-lg bg-white/[0.02] p-1.5 border border-white/5 hover:border-emerald-500/30 transition"
            >
              <span className="text-emerald-400 font-bold shrink-0 text-[10px]">● {item.time}</span>
              <span className="text-gray-300 truncate text-[10px] leading-tight">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: App Icons (Messenger, Instagram, WhatsApp, Twitter) */}
      <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5 text-gray-400">
          <button
            type="button"
            onClick={onOpenSocial}
            className="h-7 w-7 rounded-lg bg-[#0084ff]/20 hover:bg-[#0084ff]/40 text-[#0084ff] border border-[#0084ff]/30 flex items-center justify-center transition"
            title="Messenger"
          >
            <MessageCircle size={14} />
          </button>

          <button
            type="button"
            onClick={onOpenSocial}
            className="h-7 w-7 rounded-lg bg-[#e1306c]/20 hover:bg-[#e1306c]/40 text-[#e1306c] border border-[#e1306c]/30 flex items-center justify-center transition"
            title="Instagram"
          >
            <Instagram size={14} />
          </button>

          <button
            type="button"
            onClick={onOpenSocial}
            className="h-7 w-7 rounded-lg bg-[#25d366]/20 hover:bg-[#25d366]/40 text-[#25d366] border border-[#25d366]/30 flex items-center justify-center transition"
            title="WhatsApp"
          >
            <Send size={14} />
          </button>

          <button
            type="button"
            onClick={onOpenSocial}
            className="h-7 w-7 rounded-lg bg-[#1da1f2]/20 hover:bg-[#1da1f2]/40 text-[#1da1f2] border border-[#1da1f2]/30 flex items-center justify-center transition"
            title="Twitter / X"
          >
            <Twitter size={14} />
          </button>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          SYNCED
        </span>
      </div>
    </div>
  );
}
