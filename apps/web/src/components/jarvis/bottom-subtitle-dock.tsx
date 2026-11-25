"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Send, Sparkles, Volume2 } from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

interface Props {
  state?: "idle" | "listening" | "processing" | "speaking" | "sleeping";
  transcript?: string;
  lastResponse?: string | null;
  onMicClick?: () => void;
  onSubmitText?: (text: string) => void;
  isSleeping?: boolean;
}

export default function BottomSubtitleDock({
  state = "idle",
  transcript = "",
  lastResponse = null,
  onMicClick,
  onSubmitText,
  isSleeping = false
}: Props) {
  const [inputText, setInputText] = useState("");

  const isSpeaking = state === "speaking";
  const isListening = state === "listening";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    cyberAudio.playNodeClick();
    onSubmitText?.(inputText.trim());
    setInputText("");
  };

  // Subtitle text to display (Exact match to video UX!)
  const displayText = isListening
    ? transcript || "শুনছি... আপনার নির্দেশ বলুন..."
    : lastResponse || "হ্যাঁ স্যার, বলুন, কি করতে পারি আপনার জন্য?";

  return (
    <div className="relative mx-auto w-full max-w-4xl select-none px-4">
      {/* Floating Cyberpunk Glass Capsule */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#0c0a1a]/95 via-[#0d1520]/95 to-[#0c0a1a]/95 p-4 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-2xl">
        {/* Top subtle neon light line */}
        <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Subtitle Dialogue Text (Center or Left aligned) */}
          <div className="flex-1 flex items-center gap-3 w-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 shadow-md">
              <Sparkles size={18} className={isSpeaking ? "animate-spin" : ""} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-cyan-400">
                <span>{isListening ? "AUDIO STREAM INPUT" : "LYRA SYNTHESIS OUTPUT"}</span>
                {isSpeaking && (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    SPEAKING
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm sm:text-base font-semibold text-white tracking-wide truncate">
                "{displayText}"
              </p>
            </div>
          </div>

          {/* Sound wave equalizer animation bars */}
          <div className="hidden md:flex items-center gap-1 h-8 px-2">
            {Array.from({ length: 8 }).map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  height: isSpeaking ? [6, 26, 10, 30, 8] : isListening ? [4, 18, 6] : 4
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: idx * 0.08
                }}
                className="w-1 rounded-full bg-cyan-400/80"
              />
            ))}
          </div>

          {/* Center Glowing Microphone Button */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                cyberAudio.playWakeChime();
                onMicClick?.();
              }}
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 shadow-xl ${
                isListening
                  ? "border-rose-400 bg-rose-500 text-white shadow-rose-600/50"
                  : isSpeaking
                  ? "border-emerald-400 bg-emerald-600 text-white shadow-emerald-600/50"
                  : isSleeping
                  ? "border-indigo-400 bg-indigo-950 text-indigo-300"
                  : "border-cyan-400/50 bg-gradient-to-tr from-cyan-600 to-emerald-600 text-white shadow-cyan-600/40"
              }`}
              title="Click or say 'Hey LYRA'"
            >
              {isListening && (
                <span className="absolute inset-0 rounded-2xl animate-ping bg-rose-500/40" />
              )}
              <Mic size={22} className={isListening ? "animate-pulse" : ""} />
            </motion.button>
          </div>
        </div>

        {/* Text Input Row for silent / text commands */}
        <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="লায়রাকে মুখে বলুন অথবা এখানে লিখুন (e.g. আজকের শিডিউল কি?)..."
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
          />
          <button
            type="submit"
            className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500 px-4 text-xs font-bold text-white transition shadow-md shadow-cyan-900/30"
          >
            <Send size={13} />
            <span className="hidden sm:inline">পাঠান</span>
          </button>
        </form>
      </div>
    </div>
  );
}
