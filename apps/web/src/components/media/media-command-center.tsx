"use client";

import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Calendar,
  MessageCircle,
  Linkedin,
  Twitter,
  Music,
  ExternalLink,
  Mic,
  Sparkles,
  Radio,
  Link2Off,
  PlusCircle
} from "lucide-react";

interface Props {
  onAskPlatform: (query: string) => void;
}

const platformsData = [
  {
    id: "facebook",
    name: "Facebook",
    category: "Social Network",
    username: "Yeasin Munshi (@yeasin.munshi.980)",
    icon: Facebook,
    color: "#1877F2",
    badge: "Connected",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    stats: [
      { label: "Status", value: "Verified Profile" },
      { label: "Profile ID", value: "yeasin.munshi.980" },
      { label: "Sync", value: "Active" }
    ],
    queryBangla: "ফেসবুকের আপডেট বলো",
    queryEnglish: "What's the status of Facebook?"
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "Video & Studio",
    username: "Not Connected",
    icon: Youtube,
    color: "#FF0000",
    badge: "Disconnected",
    badgeColor: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    stats: [
      { label: "Status", value: "Not Linked" },
      { label: "Subscribers", value: "0" },
      { label: "Revenue", value: "$0.00" }
    ],
    queryBangla: "আমার ইউটিউব চ্যানেলের আপডেট কি?",
    queryEnglish: "How is my YouTube channel doing?"
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "Visual & Reels",
    username: "Not Connected",
    icon: Instagram,
    color: "#E4405F",
    badge: "Disconnected",
    badgeColor: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    stats: [
      { label: "Status", value: "Not Linked" },
      { label: "DMs", value: "0 Unread" },
      { label: "Stories", value: "None" }
    ],
    queryBangla: "ইনস্টাগ্রামের ডিএম ও স্টোরি আপডেট বলো",
    queryEnglish: "Check my Instagram messages"
  },
  {
    id: "gmail",
    name: "Gmail Inbox",
    category: "Priority Mail",
    username: "Not Connected",
    icon: Mail,
    color: "#EA4335",
    badge: "Disconnected",
    badgeColor: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    stats: [
      { label: "Status", value: "Not Linked" },
      { label: "Priority Mails", value: "0" },
      { label: "Sync", value: "Offline" }
    ],
    queryBangla: "আমার জিমেইল চেক করো, কি মেইল এসেছে?",
    queryEnglish: "Check my Gmail for priority messages"
  },
  {
    id: "calendar",
    name: "Google Calendar",
    category: "Events & Meetings",
    username: "Not Connected",
    icon: Calendar,
    color: "#4285F4",
    badge: "Disconnected",
    badgeColor: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    stats: [
      { label: "Status", value: "Not Linked" },
      { label: "Events Today", value: "None" },
      { label: "Sync", value: "Offline" }
    ],
    queryBangla: "আজকের মিটিং ও ক্যালেন্ডার শিডিউল কি?",
    queryEnglish: "What is on my calendar today?"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "Instant Messaging",
    username: "Not Connected",
    icon: MessageCircle,
    color: "#25D366",
    badge: "Disconnected",
    badgeColor: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    stats: [
      { label: "Status", value: "Not Linked" },
      { label: "Unread Chats", value: "0" },
      { label: "Pairing", value: "Waiting" }
    ],
    queryBangla: "হোয়াটসঅ্যাপে কি নতুন মেসেজ এসেছে?",
    queryEnglish: "Check my unread WhatsApp chats"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "Professional Network",
    username: "Yeasin Munshi (@yeasin-munshi-aa7467288)",
    icon: Linkedin,
    color: "#0A66C2",
    badge: "Connected",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    stats: [
      { label: "Status", value: "Verified Network" },
      { label: "Profile ID", value: "yeasin-munshi-aa7467288" },
      { label: "Sync", value: "Active" }
    ],
    queryBangla: "লিংকডইনে কোন নতুন আপডেট আছে?",
    queryEnglish: "How is my LinkedIn engagement?"
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    category: "Discussions & News",
    username: "Not Connected",
    icon: Twitter,
    color: "#1DA1F2",
    badge: "Disconnected",
    badgeColor: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    stats: [
      { label: "Status", value: "Not Linked" },
      { label: "Mentions", value: "0" },
      { label: "Trending", value: "Offline" }
    ],
    queryBangla: "টুইটার বা এক্স-এর আপডেট কি?",
    queryEnglish: "What's trending on Twitter/X?"
  }
];

export default function MediaCommandCenter({ onAskPlatform }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-b from-[#110e24] via-[#0d0a1c] to-[#070611] p-6 lg:p-8 shadow-2xl backdrop-blur-2xl">
      {/* Aggressive Cyber glow effects */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-3xl" />

      {/* Header bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/40 border border-violet-400/40">
              <Radio size={20} className="text-violet-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-wide text-white">
                  Media & Social Command Center
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/40">
                  2/9 Verified • Yeasin Munshi Core
                </span>
              </div>
              <p className="text-xs text-gray-400">
                LYRA provides real-time voice updates as soon as accounts are authorized
              </p>
            </div>
          </div>
        </div>

        {/* Global Overview Voice Trigger */}
        <button
          onClick={() => onAskPlatform("আমার সোশ্যাল মিডিয়া প্ল্যাটফর্মগুলোর স্ট্যাটাস কি?")}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:scale-105 hover:shadow-violet-600/50"
        >
          <Sparkles size={15} />
          <span>কানেকশন স্ট্যাটাস শুনুন</span>
        </button>
      </div>

      {/* Spotify Live Streaming Bar - Clean Disconnected State */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 shadow-md">
            <Music size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Spotify • Audio Stream
              </span>
              <span className="rounded bg-gray-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-gray-400 border border-gray-500/30">
                Not Connected
              </span>
            </div>
            <p className="text-sm font-semibold text-white/80">
              No Music Playing • Connect Spotify Account
            </p>
            <p className="text-[11px] text-gray-400">Connect to enable ambient lo-fi voice control</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onAskPlatform("স্পটিফাই অ্যাকাউন্টের আপডেট বলো")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10"
          >
            <Mic size={14} />
            <span>স্ট্যাটাস চেক</span>
          </button>
        </div>
      </div>

      {/* 8 Connected Media Cards Grid - Clean State */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformsData.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-violet-950/30"
            >
              {/* Top Card Bar */}
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white shadow-md opacity-80 group-hover:opacity-100 transition"
                    style={{ backgroundColor: `${p.color}15`, borderColor: `${p.color}30`, color: p.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-200 transition">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-mono truncate">{p.username}</p>
                </div>

                {/* 3 Metrics */}
                <div className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
                  {p.stats.map((st, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">{st.label}</span>
                      <span className="font-semibold text-gray-300">{st.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Voice Trigger */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => onAskPlatform(p.queryBangla)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-violet-500/25 bg-violet-600/10 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-600 hover:text-white"
                >
                  <Mic size={13} />
                  <span>লায়রাকে জিজ্ঞেস করুন</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
