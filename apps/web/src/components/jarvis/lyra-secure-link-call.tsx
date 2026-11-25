"use client";

import React, { useEffect, useState, useRef } from "react";
import { Mic, MicOff, PhoneOff, Volume2, ShieldCheck, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cyberAudio } from "./cyber-audio-engine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callerName?: string;
  receiverName?: string;
}

export default function LyraSecureLinkCall({
  isOpen,
  onClose,
  callerName = "স্যার",
  receiverName = "ভাবি"
}: Props) {
  const [seconds, setSeconds] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [waveSeed, setWaveSeed] = useState(0);

  // Call timer: increments each second
  useEffect(() => {
    if (!isOpen) {
      setSeconds(1);
      return;
    }
    cyberAudio.playWakeChime();

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Audio wave oscillation animation
    const waveTimer = setInterval(() => {
      setWaveSeed((prev) => prev + 1);
    }, 120);

    return () => {
      clearInterval(timer);
      clearInterval(waveTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Format seconds into Bengali numerals MM:SS (e.g. ০০:২০)
  const toBanglaNum = (num: number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num)
      .split("")
      .map((d) => banglaDigits[Number(d)] ?? d)
      .join("");
  };

  const minutesPart = Math.floor(seconds / 60);
  const secondsPart = seconds % 60;
  const formattedTimer = `${toBanglaNum(minutesPart).padStart(2, "০")}:${toBanglaNum(
    secondsPart
  ).padStart(2, "০")}`;

  const handleEndCall = () => {
    cyberAudio.playNodeClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none">
      {/* Container matching Video 4 */}
      <div className="relative w-full max-w-4xl h-[85vh] max-h-[640px] rounded-3xl border border-emerald-500/30 bg-[#06040e]/95 p-6 shadow-[0_0_80px_rgba(16,185,129,0.25)] flex flex-col justify-between overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-emerald-500/10 blur-[100px] pointer-events-none" />

        {/* Top Header: LYRA - SECURE LINK */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
              END-TO-END QUANTUM ENCRYPTION
            </span>
          </div>

          <div className="text-center font-mono text-sm tracking-[0.25em] text-emerald-300 font-extrabold uppercase">
            — LYRA • SECURE LINK —
          </div>

          <button
            onClick={handleEndCall}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Center: The Two Profile Circles & Glowing Waveform Audio Bridge */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl flex items-center justify-between px-4 sm:px-12 relative">
            {/* Left Profile: স্যার (Sir) */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {/* Glowing Green Neon Outer Ring */}
                <div className="absolute -inset-2 rounded-full bg-emerald-500/30 blur-md animate-pulse" />
                <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full border-2 border-emerald-400 p-1 bg-black flex items-center justify-center overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                  {/* Photo / Avatar */}
                  <div className="h-full w-full rounded-full bg-gradient-to-tr from-emerald-800 to-cyan-700 flex items-center justify-center font-black text-2xl sm:text-3xl text-white">
                    {callerName.slice(0, 1)}
                  </div>
                </div>
              </div>
              <span className="text-base sm:text-lg font-bold tracking-wide text-emerald-300">
                {callerName}
              </span>
            </div>

            {/* Glowing Undulating Audio Waveform Bridge (Between Sir & Bhabi) */}
            <div className="flex-1 mx-4 sm:mx-8 h-20 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Ambient baseline glow */}
                <line
                  x1="0"
                  y1="40"
                  x2="300"
                  y2="40"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                />

                {/* Animated Audio Frequency Line 1 */}
                <path
                  d={`M 0 40 Q 50 ${40 + Math.sin(waveSeed * 0.4) * 22}, 100 ${
                    40 - Math.cos(waveSeed * 0.5) * 18
                  } T 200 ${40 + Math.sin(waveSeed * 0.6) * 20} T 300 40`}
                  fill="none"
                  stroke="url(#waveGlow)"
                  strokeWidth="2.5"
                  className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />

                {/* Animated Audio Frequency Line 2 */}
                <path
                  d={`M 0 40 Q 75 ${40 - Math.sin(waveSeed * 0.5) * 16}, 150 ${
                    40 + Math.cos(waveSeed * 0.4) * 14
                  } T 300 40`}
                  fill="none"
                  stroke="#6ee7b7"
                  strokeWidth="1.5"
                  strokeOpacity="0.7"
                />
              </svg>
            </div>

            {/* Right Profile: ভাবি (Bhabi) */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {/* Glowing Green Neon Outer Ring */}
                <div className="absolute -inset-2 rounded-full bg-emerald-500/30 blur-md animate-pulse" />
                <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full border-2 border-emerald-400 p-1 bg-black flex items-center justify-center overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                  {/* Photo / Avatar */}
                  <div className="h-full w-full rounded-full bg-gradient-to-tr from-cyan-700 to-emerald-800 flex items-center justify-center font-black text-2xl sm:text-3xl text-white">
                    {receiverName.slice(0, 1)}
                  </div>
                </div>
              </div>
              <span className="text-base sm:text-lg font-bold tracking-wide text-emerald-300">
                {receiverName}
              </span>
            </div>
          </div>

          {/* Call Status & Live Timer (Exact Video 4 Match: কথা চলছে / ০০:২০) */}
          <div className="mt-8 flex flex-col items-center gap-1.5">
            <span className="text-sm font-semibold tracking-wide text-emerald-200">
              কথা চলছে
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-wider">
              {formattedTimer}
            </span>
          </div>
        </div>

        {/* Bottom Call Action Controls: Mute & End Call (কাটুন) */}
        <div className="relative z-10 flex items-center justify-center gap-8 pb-4">
          {/* Mute Toggle */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => {
                cyberAudio.playNodeClick();
                setIsMuted(!isMuted);
              }}
              className={`flex h-14 w-14 items-center justify-center rounded-full border transition shadow-lg ${
                isMuted
                  ? "border-rose-500/50 bg-rose-600/30 text-rose-300 shadow-rose-900/40"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <span className="text-xs text-gray-300 font-medium">
              {isMuted ? "আনমিউট" : "মিউট"}
            </span>
          </div>

          {/* End Call Button (কাটুন) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handleEndCall}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/50 active:scale-95"
            >
              <PhoneOff size={22} />
            </button>
            <span className="text-xs text-rose-300 font-semibold">কাটুন</span>
          </div>
        </div>
      </div>
    </div>
  );
}
