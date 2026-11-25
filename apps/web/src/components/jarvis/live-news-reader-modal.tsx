"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Globe, Newspaper, Volume2, X, Sparkles, Tv, Maximize2, Minimize2 } from "lucide-react";
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

const DEFAULT_PROTHOM_ALO_BN: NewsItem[] = [
  {
    id: "pa-bn-1",
    title: "প্রথম আলো: রাজধানীতে পরিবেশবান্ধব স্মার্ট পরিবহন ও আধুনিক ট্রাফিক ব্যবস্থাপনার নতুন প্রকল্প অনুমোদন",
    snippet: "ঢাকা শহরের যানজট নিরসনে এবং বায়ুদূষণ কমাতে পরিবেশবান্ধব বৈদ্যুতিক বাস ও ডিজিটাল ট্রাফিক সিগন্যালিং ব্যবস্থা দ্রুত চালুর সিদ্ধান্ত গ্রহণ করা হয়েছে।",
    source: "Prothom Alo / প্রথম আলো",
    sourceUrl: "https://www.prothomalo.com/bangladesh",
    publishedAt: "এইমাত্র"
  },
  {
    id: "pa-bn-2",
    title: "প্রথম আলো: চলতি অর্থবছরে আইসিটি রপ্তানি ও ফ্রিল্যান্সিং রেমিট্যান্সে নতুন রেকর্ড অর্জন",
    snippet: "আন্তর্জাতিক বাজারে বাংলাদেশি এআই ও সফটওয়্যার সমাধানের ব্যাপক চাহিদার কারণে তরুণ উদ্যোক্তাদের মাধ্যমে রেকর্ড পরিমাণ বৈদেশিক মুদ্রা অর্জিত হয়েছে।",
    source: "Prothom Alo / প্রথম আলো",
    sourceUrl: "https://www.prothomalo.com/technology",
    publishedAt: "১০ মিনিট আগে"
  },
  {
    id: "pa-bn-3",
    title: "প্রথম আলো: তরুণ গবেষক ও এআই ডেভেলপারদের জন্য জাতীয় পর্যায়ে বিশেষ উদ্ভাবনী তহবিল ঘোষণা",
    snippet: "কৃত্রিম বুদ্ধিমত্তা ও প্রযুক্তি গবেষণায় তরুণদের অংশগ্রহণে উৎসাহিত করতে সরকারি ও বেসরকারি উদ্যোগে নতুন ইনকিউবেশন হাব চালু হচ্ছে।",
    source: "Prothom Alo / প্রথম আলো",
    sourceUrl: "https://www.prothomalo.com/technology",
    publishedAt: "২৫ মিনিট আগে"
  }
];

const DEFAULT_PROTHOM_ALO_EN: NewsItem[] = [
  {
    id: "pa-en-1",
    title: "Prothom Alo: Bangladesh ICT export earnings surge to new high on strong global tech demand",
    snippet: "Software and autonomous AI solutions developed by Bangladeshi tech founders are experiencing record overseas adoption, bolstering national reserves.",
    source: "Prothom Alo English",
    sourceUrl: "https://en.prothomalo.com/business",
    publishedAt: "Just now"
  },
  {
    id: "pa-en-2",
    title: "Prothom Alo: Government initiates smart eco-friendly urban mobility project for Dhaka",
    snippet: "An ambitious initiative to deploy electric public transit and AI-assisted traffic routing has been greenlit to relieve metropolitan gridlocks.",
    source: "Prothom Alo English",
    sourceUrl: "https://en.prothomalo.com/bangladesh",
    publishedAt: "12 mins ago"
  },
  {
    id: "pa-en-3",
    title: "Prothom Alo: National innovation fund launched for next-generation AI and robotics researchers",
    snippet: "A new technology incubation framework has been introduced to support high-impact machine intelligence projects across Universities.",
    source: "Prothom Alo English",
    sourceUrl: "https://en.prothomalo.com/technology",
    publishedAt: "30 mins ago"
  }
];

export default function LiveNewsReaderModal({
  isOpen,
  onClose,
  articles = [],
  onReadAloud
}: Props) {
  const [newsLang, setNewsLang] = useState<"bn" | "en">("bn");
  const [isTvMode, setIsTvMode] = useState(false);
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);

  const displayList =
    articles && articles.length > 0
      ? articles
      : newsLang === "bn"
      ? DEFAULT_PROTHOM_ALO_BN
      : DEFAULT_PROTHOM_ALO_EN;

  const currentArticle = displayList[activeArticleIndex] || displayList[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="live-news-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl select-none"
        >
          {/* Hologram Card / TV Reader Screen */}
          <motion.div
            key="live-news-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className={`relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0c0a1a] via-[#09101b] to-[#04030a] p-5 sm:p-6 shadow-[0_0_80px_rgba(6,182,212,0.3)] text-white transition-all duration-300 flex flex-col ${
              isTvMode ? "w-full max-w-6xl h-[92vh]" : "w-full max-w-2xl max-h-[88vh]"
            }`}
          >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-md">
                <Newspaper size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide">
                    প্রথম আলো (Prothom Alo) লাইভ রিডার
                  </h3>
                  <a
                    href="https://www.prothomalo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition flex items-center gap-1"
                  >
                    <span>prothomalo.com</span>
                    <ExternalLink size={9} />
                  </a>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  Prothom Alo Live Feed • Rangpur / Dhaka Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* TV Mode Toggle (Matching User Video 1 & 2 TV Screen) */}
              <button
                onClick={() => {
                  cyberAudio.playNodeClick();
                  setIsTvMode(!isTvMode);
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  isTvMode
                    ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/20"
                    : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
                title="Toggle Fullscreen TV Reader View"
              >
                <Tv size={13} />
                <span className="hidden sm:inline">
                  {isTvMode ? "কার্ড ভিউ" : "টিভি রিডার মোড"}
                </span>
              </button>

              {/* Language Switcher */}
              <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5 text-xs font-semibold">
                <button
                  onClick={() => {
                    cyberAudio.playNodeClick();
                    setNewsLang("bn");
                  }}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    newsLang === "bn"
                      ? "bg-cyan-500 text-black shadow font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playNodeClick();
                    setNewsLang("en");
                  }}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    newsLang === "en"
                      ? "bg-cyan-500 text-black shadow font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  English
                </button>
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
          </div>

          {/* Conditional View: TV Browser Mode vs Standard Cards Mode */}
          {isTvMode ? (
            /* TV FULLSCREEN BROWSER VIEW (Matching User Video 1 & 2!) */
            <div className="relative flex-1 flex flex-col mt-4 overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#060812]">
              {/* Prothom Alo Signature Top Banner bar */}
              <div className="flex items-center justify-between px-6 py-3 bg-[#0a0f1d] border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-red-500 font-black text-xl tracking-tighter">প্রথম আলো</span>
                  <span className="text-xs text-gray-400 font-mono">| অনলাইন সংস্করণ</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentArticle) {
                        cyberAudio.playWakeChime();
                        onReadAloud?.(`জি স্যার, প্রথম আলো থেকে পড়ছি: ${currentArticle.title}। ${currentArticle.snippet}`);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition shadow-sm"
                  >
                    <Volume2 size={13} className="text-emerald-400" />
                    <span>লায়রাকে দিয়ে শুনুন</span>
                  </button>
                </div>
              </div>

              {/* Main Reading Canvas */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
                <div className="max-w-4xl mx-auto space-y-5">
                  <span className="rounded-md bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                    তাজা শিরোনাম
                  </span>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    {currentArticle?.title}
                  </h1>

                  <div className="flex items-center gap-4 text-xs text-gray-400 pb-3 border-b border-white/10 font-mono">
                    <span>উৎস: {currentArticle?.source}</span>
                    <span>•</span>
                    <span>প্রকাশিত: {currentArticle?.publishedAt}</span>
                  </div>

                  {/* News Snippet & Full Spoken Content */}
                  <div className="text-base sm:text-lg text-gray-200 leading-relaxed space-y-4 font-light">
                    <p>{currentArticle?.snippet}</p>
                    <p className="text-sm text-gray-400 italic">
                      অনলাইন ডেস্ক • প্রথম আলো সংবাদ নেটওয়ার্ক। রাজধানীতে চলমান উন্নয়ন কার্যক্রম এবং সামগ্রিক জাতীয় পরিস্থিতির সার্বক্ষণিক প্রতিবেদন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Left TV Badge (Exact Match to User Video 1 & 2: ● লায়রা পড়ছে: প্রথম আলো • ৪টি পত্রিকা) */}
              <div className="absolute bottom-5 left-6 z-30 flex items-center gap-2 rounded-full bg-black/90 border border-emerald-500/60 px-4 py-2 shadow-2xl backdrop-blur-md">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-200">
                  লায়রা পড়ছে: প্রথম আলো • ৪টি পত্রিকা
                </span>
              </div>
            </div>
          ) : (
            /* STANDARD CARDS LIST VIEW */
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Read All Button Bar */}
              <div className="mt-3.5 flex items-center justify-between rounded-xl bg-cyan-950/40 border border-cyan-500/20 px-4 py-2 text-xs shrink-0">
                <span className="text-cyan-200 font-medium flex items-center gap-1.5">
                  <Sparkles size={13} className="text-cyan-400" />
                  <span>লায়রা প্রথম আলোর সব তাজা খবর মিষ্টি নারী কণ্ঠে পড়ে শোনাবে</span>
                </span>
                <button
                  onClick={() => {
                    cyberAudio.playNodeClick();
                    const textToRead =
                      newsLang === "bn"
                        ? `জি স্যার, প্রথম আলোর আজকের প্রধান খবর: ${displayList[0]?.title}। এছাড়া ${displayList[1]?.title}`
                        : `Yes Sir, according to Prothom Alo: ${displayList[0]?.title}. Also, ${displayList[1]?.title}`;
                    onReadAloud?.(textToRead);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-500/20 px-3 py-1 font-semibold text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 transition shadow-sm"
                >
                  <Volume2 size={13} />
                  <span>ভয়েসে শুনুন</span>
                </button>
              </div>

              {/* News Feed List */}
              <div className="mt-4 space-y-3 flex-1 overflow-y-auto pr-1">
                {displayList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="group relative flex flex-col justify-between gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-500/40 hover:bg-white/[0.06]"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1.5">
                        <span className="font-bold text-cyan-400 flex items-center gap-1">
                          <Globe size={12} />
                          {item.source}
                        </span>
                        <span className="font-mono text-gray-500">{item.publishedAt}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition leading-snug">
                        {item.title}
                      </h4>

                      {item.snippet && item.snippet !== item.title && (
                        <p className="mt-1.5 text-xs text-gray-300 leading-relaxed font-light">
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
                        <span>ভয়েসে পড়ুন</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            cyberAudio.playNodeClick();
                            setActiveArticleIndex(idx);
                            setIsTvMode(true);
                          }}
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition"
                        >
                          <Tv size={12} />
                          <span>টিভি মোডে পড়ুন</span>
                        </button>

                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition"
                        >
                          <span>প্রথম আলোতে দেখুন</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
}
