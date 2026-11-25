"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MessageSquare, Send, X, Sparkles } from "lucide-react";
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
  const [showTextInput, setShowTextInput] = useState(false);

  const isSpeaking = state === "speaking";
  const isListening = state === "listening";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    cyberAudio.playNodeClick();
    onSubmitText?.(inputText.trim());
    setInputText("");
    setShowTextInput(false);
  };

  // User's spoken query (or default context matching photo)
  const userQueryText =
    transcript ||
    "আপনিও আপনার সরকারি সফরে যুক্ত না থাকলে তুমি আমার আজকের সারাদিনের সবগুলি ম্যাসেজ আমাকে পড়ে শোনাও যাতে কোনো জরুরি নোটিশ মিস না হয়";

  // LYRA's spoken response text (or default response matching photo)
  const lyraSpeechText =
    lastResponse ||
    "আচ্ছা স্যার! আজ কোনো নতুন জরুরি আপডেট আসেনি। তবে ফেসবুক মেসেঞ্জারে কাল সন্ধ্যায় আড্ডা দেওয়ার কথা জানতে চেয়েছেন আপনার ফ্রেন্ড তানভীর আহমেদ। এছাড়া লিঙ্কডইনে ডেভিড স্টার্লিং একটি মেসেজ দিয়েছেন। স্যার, এই মেসেজগুলোর কি কোনো উত্তর পাঠিয়ে দেব?";

  return (
    <div className="relative mx-auto w-full max-w-4xl select-none px-4 flex flex-col items-center gap-3">
      {/* 1. Large Bengali Subtitle & Speech Block (Exact TV Photo Match!) */}
      <div className="text-center max-w-3xl px-2">
        {/* User Query text in small subtle gray */}
        <p className="text-[11px] sm:text-xs text-gray-400 font-sans tracking-wide leading-relaxed">
          {userQueryText}
        </p>

        {/* LYRA Response in prominent bold white text */}
        <p className="mt-1.5 text-sm sm:text-[15px] font-semibold text-white/95 leading-relaxed tracking-normal font-sans drop-shadow-sm">
          {isListening ? (
            <span className="text-emerald-400 font-bold animate-pulse">
              ● শুনছি ইয়াসিন স্যার... আপনার কথা বলুন...
            </span>
          ) : (
            lyraSpeechText
          )}
        </p>
      </div>

      {/* 2. Floating Mic Control Capsule Pill (Exact TV Screen Match!) */}
      <div className="relative flex items-center justify-between gap-3 rounded-full border border-emerald-500/30 bg-[#06120b]/90 px-3.5 py-1.5 shadow-[0_0_30px_rgba(34,197,94,0.2)] backdrop-blur-xl max-w-md w-full">
        {/* Left: Keyboard/Text icon button */}
        <button
          type="button"
          onClick={() => {
            cyberAudio.playNodeClick();
            setShowTextInput(!showTextInput);
          }}
          className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition"
          title="Type command"
        >
          <MessageSquare size={14} />
        </button>

        {/* Center: Status indicator with pulsating green dot */}
        <div className="flex-1 text-center font-sans text-xs text-gray-300 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="truncate">
            {isListening
              ? "লায়রা শুনছে..."
              : isSpeaking
              ? "লায়রা কথা বলছে..."
              : "আপনি... বলতে কথা শুনতে প্রস্তুত"}
          </span>
        </div>

        {/* Right: Glowing Neon Green Circular Microphone Button */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            cyberAudio.playWakeChime();
            onMicClick?.();
          }}
          className="relative flex h-8 w-8 items-center justify-center rounded-full bg-lime-500 hover:bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.7)] transition cursor-pointer"
          title="Click to speak with LYRA"
        >
          {isListening && (
            <span className="absolute inset-0 rounded-full animate-ping bg-lime-400/50" />
          )}
          <Mic size={16} className="font-extrabold stroke-[2.5]" />
        </motion.button>
      </div>

      {/* Optional Pop-up Text Input Form */}
      <AnimatePresence>
        {showTextInput && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-[#06120b] p-2 shadow-2xl backdrop-blur-xl w-full max-w-md mt-1"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="লায়রাকে নির্দেশ দিন (যেমন: 'আজকের খবর বলো')..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none font-sans"
              autoFocus
            />

            <button
              type="submit"
              className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition"
            >
              <Send size={13} />
            </button>

            <button
              type="button"
              onClick={() => setShowTextInput(false)}
              className="text-gray-400 hover:text-white px-1"
            >
              <X size={14} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
