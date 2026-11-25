"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Globe, Newspaper, Volume2, X, Sparkles } from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

export interface NewsItem {
  id: string;
  title: string;
  snippet: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  articles?: NewsItem[];
  onReadAloud?: (text: string) => void;
}

export default function LiveNewsReaderModal({
  isOpen,
  onClose,
  articles = [],
  onReadAloud
}: Props) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl select-none">
        {/* Hologram Card (Signature match to video at 00:25!) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0c0a1a] via-[#0b131e] to-[#06050e] p-6 shadow-[0_0_60px_rgba(6,182,212,0.3)] text-white"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-md">
                <Newspaper size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Live News & World Intelligence
                  </h3>
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  Prothom Alo & Global News Feed
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                cyberAudio.playNodeClick();
                onClose();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* News Feed List */}
          <div className="mt-5 space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
            {articles.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                সংবাদ লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।
              </div>
            ) : (
              articles.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="group relative flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4.5 transition hover:border-cyan-500/40 hover:bg-white/[0.06]"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pb-2">
                      <span className="font-bold text-cyan-400 flex items-center gap-1">
                        <Globe size={12} />
                        {item.source}
                      </span>
                      <span className="font-mono text-gray-500">{item.publishedAt}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition leading-snug">
                      {item.title}
                    </h4>

                    {item.snippet && item.snippet !== item.title && (
                      <p className="mt-2 text-xs text-gray-300 leading-relaxed font-light">
                        {item.snippet}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                    <button
                      onClick={() => {
                        cyberAudio.playNodeClick();
                        onReadAloud?.(item.title);
                      }}
                      className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition"
                    >
                      <Volume2 size={13} />
                      <span>পড়ে শোনাও</span>
                    </button>

                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition"
                    >
                      <span>ওয়েবসাইট দেখুন</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
