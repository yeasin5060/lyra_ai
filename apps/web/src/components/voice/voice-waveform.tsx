"use client";

import { motion } from "framer-motion";

interface Props {
  levels: number[];
  state: "idle" | "listening" | "processing" | "speaking" | "sleeping";
}

export default function VoiceWaveform({ levels, state }: Props) {
  const isListening = state === "listening";
  const isSpeaking = state === "speaking";
  const isSleeping = state === "sleeping";

  return (
    <div
      className={`flex items-center justify-center gap-1.5 h-12 px-4 py-2 rounded-2xl border backdrop-blur-md transition-colors ${
        isSleeping ? "bg-black/60 border-indigo-500/15" : "bg-black/40 border-white/5"
      }`}
    >
      {levels.map((level, i) => (
        <motion.div
          key={i}
          animate={{
            height: isSleeping
              ? `${Math.max(4, level * 0.2)}px`
              : isListening || isSpeaking
              ? `${Math.max(12, level * 0.45)}px`
              : "8px",
            opacity: isSleeping ? 0.25 : isListening || isSpeaking ? 1 : 0.4
          }}
          transition={{ duration: isSleeping ? 0.6 : 0.12, ease: "easeOut" }}
          className={`w-1 rounded-full transition-colors ${
            isSleeping
              ? "bg-indigo-400/40"
              : isListening
              ? "bg-gradient-to-t from-rose-500 to-violet-400"
              : isSpeaking
              ? "bg-gradient-to-t from-cyan-400 via-violet-400 to-fuchsia-400"
              : "bg-violet-400/40"
          }`}
          style={{ minHeight: "4px" }}
        />
      ))}
    </div>
  );
}
