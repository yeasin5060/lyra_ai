"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Music,
  Share2,
  ShieldCheck,
  Twitter,
  Youtube,
  Instagram,
  X,
  Sparkles,
  CheckCircle2
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
    name: "Facebook Profile",
    owner: "Yeasin Munshi",
    username: "yeasin.munshi.980",
    url: "https://www.facebook.com/yeasin.munshi.980/",
    status: "Connected & Synced",
    icon: Facebook,
    color: "#1877F2",
    badge: "Synced"
  },
  {
    id: "linkedin",
    name: "LinkedIn Network",
    owner: "Yeasin Munshi",
    username: "yeasin-munshi-aa7467288",
    url: "https://www.linkedin.com/in/yeasin-munshi-aa7467288/",
    status: "Professional Active",
    icon: Linkedin,
    color: "#0A66C2",
    badge: "Synced"
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

export default function SocialAccountsModal({
  isOpen,
  onClose,
  onAskAccount
}: Props) {
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
                    Yeasin Munshi • Omni-Channel Social Vault
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    2 Accounts Verified
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  All Social Media & World Accounts Monitored by LYRA AI
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

          {/* Accounts Grid */}
          <div className="mt-5 grid gap-3.5 sm:grid-cols-2 max-h-[440px] overflow-y-auto pr-1">
            {ACCOUNTS.map((acc) => {
              const Icon = acc.icon;
              return (
                <div
                  key={acc.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-violet-500/40 hover:bg-white/[0.06]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 shadow-sm"
                        style={{ backgroundColor: `${acc.color}20`, borderColor: `${acc.color}40`, color: acc.color }}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 size={10} />
                        {acc.badge}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-sm font-bold text-white group-hover:text-violet-200 transition">
                        {acc.name}
                      </h4>
                      <p className="text-xs text-gray-300 font-medium">{acc.owner}</p>
                      <p className="text-[11px] text-gray-500 font-mono truncate">{acc.username}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        cyberAudio.playNodeClick();
                        onAskAccount(`${acc.name} এর আপডেট বলো`);
                        onClose();
                      }}
                      className="text-violet-300 hover:text-white font-medium transition"
                    >
                      লায়রাকে জিজ্ঞেস করুন
                    </button>

                    <a
                      href={acc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition"
                    >
                      <span>প্রোফাইল ওপেন</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
