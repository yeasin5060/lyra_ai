"use client";

import { motion } from "framer-motion";

interface Props {
  active?: boolean;
  size?: number;
}

export default function LyraAvatar({ active = false, size = 190 }: Props) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{
          scale: active ? [1, 1.12, 1] : [1, 1.04, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full bg-violet-500/30 blur-3xl"
        style={{ width: size + 70, height: size + 70 }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full border border-violet-400/30 border-dashed"
        style={{ width: size + 28, height: size + 28 }}
      />
      <div
        className="relative flex items-center justify-center rounded-full border border-violet-300/40 bg-gradient-to-br from-violet-500 via-purple-700 to-indigo-950 shadow-[0_0_65px_rgba(139,92,246,0.4)]"
        style={{ width: size, height: size }}
      >
        <span className="text-4xl font-light tracking-[0.25em] text-white">
          L
        </span>
      </div>
    </div>
  );
}
