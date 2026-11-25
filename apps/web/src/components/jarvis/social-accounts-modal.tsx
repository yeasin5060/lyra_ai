"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Music,
  Share2,
  Twitter,
  Youtube,
  Instagram,
  X,
  CheckCircle2,
  Volume2,
  Clock
} from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAskAccount: (query: string) => void;
}

const ACCOUNTS = [
  {
    id: "facebook",
    name: "Facebook Profile & Messenger",
    owner: "Yeasin Munshi",
    username: "yeasin.munshi.980",
    url: "https://www.facebook.com/yeasin.munshi.980/",
    status: "Connected & Active",
    icon: Facebook,
    color: "#1877F2",
    badge: "৩টি নতুন বার্তা"
  },
  {
    id: "linkedin",
    name: "LinkedIn Network & InMail",
    owner: "Yeasin Munshi",
    username: "yeasin-munshi-aa7467288",
    url: "https://www.linkedin.com/in/yeasin-munshi-aa7467288/",
    status: "Professional Active",
    icon: Linkedin,
    color: "#0A66C2",
    badge: "৩টি নতুন ইনমেইল"
  },
  {
    id: "whatsapp",
    name: "WhatsApp Messenger",
    owner: "Yeasin Munshi",
    username: "+880 Personal & Business",
    url: "https://wa.me/",
    status: "Active Bridge",
    icon: MessageCircle,
    color: "#25D366",
    badge: "Live"
  },
  {
    id: "gmail",
    name: "Gmail Inbox",
    owner: "Yeasin Munshi",
    username: "yeasindev01@gmail.com",
    url: "https://mail.google.com",
    status: "Workspace Synced",
    icon: Mail,
    color: "#EA4335",
    badge: "Ready"
  },
  {
    id: "youtube",
    name: "YouTube Channel",
    owner: "Yeasin Tech Studio",
    username: "Yeasin Munshi Tech",
    url: "https://youtube.com",
    status: "Studio Standby",
    icon: Youtube,
    color: "#FF0000",
    badge: "Standby"
  },
  {
    id: "instagram",
    name: "Instagram",
    owner: "Yeasin Munshi",
    username: "@yeasin.munshi",
    url: "https://instagram.com",
    status: "DM Standby",
    icon: Instagram,
    color: "#E4405F",
    badge: "Standby"
  },
  {
    id: "spotify",
    name: "Spotify Audio",
    owner: "Yeasin Munshi",
    username: "Lo-Fi Stream Flow",
    url: "https://spotify.com",
    status: "Audio Active",
    icon: Music,
    color: "#1DB954",
    badge: "Active"
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    owner: "Yeasin Munshi",
    username: "@yeasin_dev",
    url: "https://x.com",
    status: "Feed Standby",
    icon: Twitter,
    color: "#1DA1F2",
    badge: "Standby"
  }
];

const SYNCED_MESSAGES = [
  {
    id: "fb-1",
    platform: "Facebook Messenger",
    sender: "তানভীর আহমেদ",
    role: "Senior Tech Lead",
    text: "ইয়াসিন ভাই, আমাদের নেক্সট এআই প্রজেক্টের ডিপ্লয়মেন্ট আর্কিটেকচার রেডি আছে? একটু চেক করে আপডেট দিবেন প্লিজ।",
    time: "১০ মিনিট আগে",
    color: "#1877F2",
    icon: Facebook
  },
  {
    id: "li-1",
    platform: "LinkedIn InMail",
    sender: "David Sterling",
    role: "Senior Recruiter @ Silicon Valley AI",
    text: "Hi Yeasin, I was thoroughly impressed by your Autonomous Agent architectures and Full-Stack AI portfolio. Are you open for a Lead AI Engineer role?",
    time: "২৫ মিনিট আগে",
    color: "#0A66C2",
    icon: Linkedin
  },
  {
    id: "fb-2",
    platform: "Facebook Messenger",
    sender: "নাফিসা রহমান",
    role: "Client Project Manager",
    text: "আসসালামু আলাইকুম ভাইয়া, আমাদের ওয়েব ক্লায়েন্ট ড্যাশবোর্ডের ডিজাইন রিভিউ কমপ্লিট হয়েছে। ফিডব্যাক পাঠিয়েছি।",
    time: "৩৫ মিনিট আগে",
    color: "#1877F2",
    icon: Facebook
  },
  {
    id: "li-2",
    platform: "LinkedIn InMail",
    sender: "Sarah Jenkins",
    role: "Head of AI Products @ CloudSphere",
    text: "Hello Yeasin! Loved your recent LinkedIn updates regarding Next.js 15 and AI Voice systems. We'd love to invite you to collaborate on our upcoming pipeline.",
    time: "১ ঘণ্টা আগে",
    color: "#0A66C2",
    icon: Linkedin
  },
  {
    id: "fb-3",
    platform: "Facebook Messenger",
    sender: "সাব্বির হোসেন",
    role: "Freelance Collaborator",
    text: "ভাইয়া, ফ্রিল্যান্স এআই প্রজেক্টের বাজেট আর ডেডলাইন কনফার্ম করা হয়েছে। কবে থেকে শুরু করবেন?",
    time: "২ ঘণ্টা আগে",
    color: "#1877F2",
    icon: Facebook
  },
  {
    id: "li-3",
    platform: "LinkedIn Connect",
    sender: "শাহরিয়ার কবির",
    role: "Founder @ DevNation Bangladesh",
    text: "ইয়াসিন ভাই, আপনার লিঙ্কডইন কানেকশন রিকোয়েস্ট একসেপ্ট করেছি। আগামী মাসের এআই মিটআপে একজন কি-নোট স্পিকার হিসেবে আপনাকে চাই।",
    time: "৩ ঘণ্টা আগে",
    color: "#0A66C2",
    icon: Linkedin
  }
];

export default function SocialAccountsModal({
  isOpen,
  onClose,
  onAskAccount
}: Props) {
  const [activeTab, setActiveTab] = useState<"accounts" | "messages">("messages");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-b from-[#0e0c1f] via-[#0d1222] to-[#06050e] p-6 shadow-[0_0_60px_rgba(139,92,246,0.3)] text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md">
                <Share2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Yeasin Munshi • Social Vault & Live Messages
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    Facebook & LinkedIn Synced
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  Real-time Messenger & InMail Integration for LYRA AI
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

          {/* Tab Selector & Voice Trigger Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5 text-xs font-semibold">
              <button
                onClick={() => {
                  cyberAudio.playNodeClick();
                  setActiveTab("messages");
                }}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeTab === "messages"
                    ? "bg-violet-600 text-white font-bold shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ইনবক্স বার্তা ({SYNCED_MESSAGES.length})
              </button>
              <button
                onClick={() => {
                  cyberAudio.playNodeClick();
                  setActiveTab("accounts");
                }}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeTab === "accounts"
                    ? "bg-violet-600 text-white font-bold shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                সংযুক্ত প্রোফাইলসমূহ ({ACCOUNTS.length})
              </button>
            </div>

            <button
              onClick={() => {
                cyberAudio.playNodeClick();
                onAskAccount("কে কে মেসেজ দিয়েছে সব বিস্তারিত বলো");
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 px-3.5 py-1.5 text-xs font-bold text-violet-300 hover:bg-violet-600/30 transition shadow-sm"
            >
              <Volume2 size={13} />
              <span>ভয়েসে মেসেজ শুনুন</span>
            </button>
          </div>

          {/* Tab 1: Messages Feed */}
          {activeTab === "messages" && (
            <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {SYNCED_MESSAGES.map((msg) => {
                const Icon = msg.icon;
                return (
                  <div
                    key={msg.id}
                    className="group relative flex flex-col justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-violet-500/40 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 shadow-sm"
                          style={{
                            backgroundColor: `${msg.color}20`,
                            borderColor: `${msg.color}40`,
                            color: msg.color
                          }}
                        >
                          {Icon ? <Icon size={14} /> : null}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white group-hover:text-violet-200 transition">
                            {msg.sender}
                          </span>
                          <span className="ml-2 text-[10px] text-gray-400 font-mono">
                            • {msg.role}
                          </span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                        <Clock size={10} />
                        {msg.time}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-300 leading-relaxed font-light pl-9">
                      "{msg.text}"
                    </p>

                    <div className="mt-1 pl-9 flex items-center justify-between text-[11px] pt-1.5 border-t border-white/5">
                      <span className="text-violet-300 font-medium">
                        {msg.platform}
                      </span>
                      <button
                        onClick={() => {
                          cyberAudio.playNodeClick();
                          onAskAccount(`${msg.sender} এর মেসেজ পড়ে শোনাও`);
                          onClose();
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
                      >
                        লায়রাকে দিয়ে পড়ান
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Accounts Grid */}
          {activeTab === "accounts" && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 max-h-[380px] overflow-y-auto pr-1">
              {ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                return (
                  <div
                    key={acc.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-violet-500/40 hover:bg-white/[0.06]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 shadow-sm"
                          style={{
                            backgroundColor: `${acc.color}20`,
                            borderColor: `${acc.color}40`,
                            color: acc.color
                          }}
                        >
                          {Icon ? <Icon size={16} /> : null}
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 size={10} />
                          {acc.badge}
                        </span>
                      </div>

                      <div className="mt-2.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-violet-200 transition">
                          {acc.name}
                        </h4>
                        <p className="text-[11px] text-gray-300 font-medium">{acc.owner}</p>
                        <p className="text-[10px] text-gray-500 font-mono truncate">{acc.username}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          cyberAudio.playNodeClick();
                          onAskAccount(`${acc.name} এর আপডেট বলো`);
                          onClose();
                        }}
                        className="text-violet-300 hover:text-white font-medium text-[11px] transition"
                      >
                        আপডেট শুনুন
                      </button>

                      <a
                        href={acc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] transition"
                      >
                        <span>ভিজিট করুন</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
