"use client";

import { motion } from "framer-motion";
import { Moon } from "lucide-react";

interface Props {
  state?: "idle" | "listening" | "processing" | "speaking" | "sleeping";
  size?: number;
}

export default function LyraAvatar({ state = "idle", size = 190 }: Props) {
  const isListening = state === "listening";
  const isSpeaking = state === "speaking";
  const isProcessing = state === "processing";
  const isSleeping = state === "sleeping";

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Outer ambient glow */}
      <motion.div
        animate={{
          scale: isSleeping
            ? [0.95, 1.02, 0.95]
            : isSpeaking
            ? [1, 1.25, 1.05, 1.2, 1]
            : isListening
            ? [1, 1.3, 1]
            : isProcessing
            ? [1, 1.15, 1]
            : [1, 1.05, 1],
          opacity: isSleeping
            ? [0.15, 0.35, 0.15]
            : isSpeaking
            ? [0.5, 0.9, 0.5]
            : isListening
            ? [0.6, 1, 0.6]
            : [0.3, 0.55, 0.3]
        }}
        transition={{
          duration: isSleeping ? 5 : isSpeaking ? 1.4 : isListening ? 1.2 : 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute rounded-full blur-3xl transition-colors duration-1000 ${
          isSleeping
            ? "bg-gradient-to-r from-indigo-950/40 via-blue-900/30 to-purple-950/40"
            : isListening
            ? "bg-gradient-to-r from-rose-500/40 via-purple-500/50 to-violet-500/40"
            : isSpeaking
            ? "bg-gradient-to-r from-cyan-500/40 via-violet-500/60 to-fuchsia-500/50"
            : isProcessing
            ? "bg-gradient-to-r from-amber-500/40 via-violet-500/50 to-purple-500/40"
            : "bg-violet-600/30"
        }`}
        style={{ width: size + 80, height: size + 80 }}
      />

      {/* Orbiting particles ring 1 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: isSleeping ? 50 : isProcessing ? 6 : isListening ? 10 : 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`absolute rounded-full border border-dashed transition-colors duration-1000 ${
          isSleeping ? "border-indigo-500/10" : "border-violet-400/25"
        }`}
        style={{ width: size + 36, height: size + 36 }}
      />

      {/* Counter-rotating subtle ring 2 */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: isSleeping ? 65 : 35, repeat: Infinity, ease: "linear" }}
        className={`absolute rounded-full border border-dotted transition-colors duration-1000 ${
          isSleeping ? "border-blue-500/10" : "border-cyan-400/15"
        }`}
        style={{ width: size + 56, height: size + 56 }}
      />

      {/* Core sphere with metallic glass gradient */}
      <motion.div
        animate={{
          scale: isSleeping
            ? [1, 0.98, 1]
            : isListening
            ? [1, 1.06, 1]
            : isSpeaking
            ? [1, 1.04, 0.98, 1.02, 1]
            : 1
        }}
        transition={{ duration: isSleeping ? 4 : 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`relative flex items-center justify-center rounded-full border backdrop-blur-xl overflow-hidden transition-all duration-1000 ${
          isSleeping
            ? "border-indigo-500/20 bg-gradient-to-br from-[#0c0a1a] via-[#090814] to-[#040308] shadow-[0_0_40px_rgba(30,27,75,0.4)]"
            : "border-violet-300/40 bg-gradient-to-br from-violet-600 via-purple-800 to-indigo-950 shadow-[0_0_80px_rgba(139,92,246,0.45)]"
        }`}
        style={{ width: size, height: size }}
      >
        {/* Shimmer light sweep */}
        {!isSleeping && (
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12"
          />
        )}

        {/* Sleeping Moon Ambient particle */}
        {isSleeping && (
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1 right-8 text-indigo-400/60"
          >
            <Moon size={18} />
          </motion.div>
        )}

        {/* Brand identity initial & female energy icon */}
        <div className="relative flex flex-col items-center justify-center text-center">
          <span
            className={`text-5xl font-extralight tracking-[0.3em] transition-colors duration-1000 ml-1 ${
              isSleeping
                ? "text-indigo-300/50 drop-shadow-[0_2px_10px_rgba(99,102,241,0.2)]"
                : "text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.7)]"
            }`}
          >
            L
          </span>
          <span
            className={`text-[10px] uppercase tracking-[0.35em] font-medium mt-1 transition-colors duration-1000 ${
              isSleeping ? "text-indigo-400/50" : "text-violet-200/80"
            }`}
          >
            {isSleeping ? "SLEEP MODE" : "LYRA AI"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
