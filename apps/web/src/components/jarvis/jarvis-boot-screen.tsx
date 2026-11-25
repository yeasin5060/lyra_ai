"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Volume2, Zap } from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

interface Props {
  onLaunch: () => void;
  assistantName?: string;
}

export default function JarvisBootScreen({
  onLaunch,
  assistantName = "LYRA"
}: Props) {
  const [glitchText, setGlitchText] = useState("L Y R 4");
  const [bootLogIndex, setBootLogIndex] = useState(0);

  const bootLogs = [
    "init: personal intelligence - v4.2",
    "system status: ready",
    "neural core: synchronized (1024 tensor nodes)",
    "audio matrix: calibrated (soft & sweet female 1.15x)",
    "database: cluster0.qlsti2s connected",
    "network stream: active (7 bridges synced)",
    "all systems ready. sir."
  ];

  // Letter decryptor animation (Z A R 4 -> Z A R A / L Y R 4 -> L Y R A)
  useEffect(() => {
    const letters = ["L Y R 4", "L Y R @", "L Y R A"];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < letters.length) {
        setGlitchText(letters[i]!);
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Progressive terminal log feed
  useEffect(() => {
    if (bootLogIndex < bootLogs.length) {
      const timer = setTimeout(() => {
        setBootLogIndex((prev) => prev + 1);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [bootLogIndex, bootLogs.length]);

  const handleLaunchClick = () => {
    cyberAudio.playBootSound();
    onLaunch();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#04030a] text-white overflow-hidden p-6 sm:p-10 select-none">
      {/* Background Cyber Grid & Energy Flare */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[35rem] w-[35rem] rounded-full bg-cyan-600/15 blur-[140px]" />
        <div className="absolute top-1/3 left-1/3 h-[25rem] w-[25rem] rounded-full bg-emerald-600/10 blur-[130px]" />
        {/* Subtle SVG Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Status Bar */}
      <div className="relative z-10 flex w-full items-center justify-between border-b border-white/10 pb-4 text-xs font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-widest text-emerald-300">SYSTEM BOOT ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span>SECURE KERNEL</span>
          <span>•</span>
          <span className="text-cyan-400 font-bold">MONOREPO M3</span>
        </div>
      </div>

      {/* Centerpiece: Cinematic Brand & Launch Action */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-xl">
        {/* Glowing Decorative Crest */}
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-400/40 bg-gradient-to-tr from-cyan-950/60 via-emerald-950/40 to-black/80 shadow-[0_0_60px_rgba(6,182,212,0.35)] backdrop-blur-2xl">
          <div className="absolute inset-0 rounded-3xl animate-pulse bg-cyan-400/10" />
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-white">
            {assistantName[0]}
          </span>
        </div>

        {/* Big Decrypting Logo Title (Exact Video Signature!) */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-[0.35em] text-white drop-shadow-[0_0_40px_rgba(6,182,212,0.6)]">
          {glitchText}
        </h1>

        <p className="mt-4 text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-gray-300">
          YOUR PERSONAL INTELLIGENCE • SYSTEM READY
        </p>

        {/* Launch / Touch Button (Exact Video Match!) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLaunchClick}
          className="group relative mt-10 flex items-center justify-center gap-3 overflow-hidden rounded-2xl border border-cyan-400/50 bg-gradient-to-r from-cyan-600/30 via-emerald-600/20 to-cyan-600/30 px-8 py-4 shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_55px_rgba(6,182,212,0.6)] backdrop-blur-xl"
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <Zap size={18} className="text-cyan-300 animate-bounce" />
          <span className="text-sm sm:text-base font-bold tracking-wide text-white">
            উদ্বোধন করতে স্পর্শ করুন বা বলুন: "Hey LYRA"
          </span>
        </motion.button>

        {/* Subtext Voice Guidance */}
        <p className="mt-3 text-xs text-gray-400 font-medium">
          বলুন: <span className="text-cyan-300 font-semibold">'হ্যালো লায়রা'</span> অথবা{" "}
          <span className="text-emerald-300 font-semibold">'Hey LYRA'</span>
        </p>
      </div>

      {/* Bottom Terminal Boot Logs (Exact Video Match!) */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-t border-white/10 pt-4 font-mono text-[11px]">
        {/* Terminal Text lines */}
        <div className="space-y-1 text-emerald-400/90 bg-black/40 p-3 rounded-xl border border-emerald-500/20 max-w-md w-full">
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] pb-1 border-b border-white/5">
            <Terminal size={12} className="text-emerald-400" />
            <span>BOOT TERMINAL CONSOLE</span>
          </div>
          {bootLogs.slice(0, bootLogIndex).map((log, idx) => (
            <p key={idx} className="leading-tight">
              &gt; {log}
            </p>
          ))}
          {bootLogIndex < bootLogs.length && (
            <span className="inline-block h-3 w-1.5 bg-emerald-400 animate-pulse" />
          )}
        </div>

        {/* Audio Prompt Guidance */}
        <div className="text-right text-gray-400 text-xs">
          <p className="text-white font-semibold">Touch Screen or Speak to Activate</p>
          <p className="text-[11px] text-gray-500">Autonomous Dual Language Matrix Active</p>
        </div>
      </div>
    </div>
  );
}
