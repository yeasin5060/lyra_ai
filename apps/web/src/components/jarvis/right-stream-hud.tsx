"use client";

import React, { useState, useEffect } from "react";
import { Network, MessageSquare, ChevronDown, Sparkles } from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

interface Props {
  dbStatus?: string;
  onSelectChat?: (text: string) => void;
}

interface InboundChatMessage {
  id: string;
  sender: string;
  platform: "মেসেঞ্জার" | "WhatsApp" | "FB";
  time: string;
  isUnread?: boolean;
}

// Exact Chat list from TV Photo
const INITIAL_CHATS: InboundChatMessage[] = [
  { id: "1", sender: "Rai Zn", platform: "মেসেঞ্জার", time: "১০:৩২", isUnread: true },
  { id: "2", sender: "Rai Zn", platform: "মেসেঞ্জার", time: "১০:২৫", isUnread: true },
  { id: "3", sender: "Rai Zn", platform: "WhatsApp", time: "১০:২০", isUnread: true },
  { id: "4", sender: "Ashraful ALAM", platform: "FB", time: "০৯:৫২", isUnread: true },
  { id: "5", sender: "Ashraful ALAM", platform: "WhatsApp", time: "০৯:৪৫", isUnread: true },
  { id: "6", sender: "Mony Khan", platform: "FB", time: "০৯:৪০", isUnread: true },
  { id: "7", sender: "Mony Khan", platform: "WhatsApp", time: "০৯:২২", isUnread: true },
  { id: "8", sender: "Md Yeasin Arafat", platform: "FB", time: "০৮:৫২", isUnread: true },
  { id: "9", sender: "Md Yeasin Arafat", platform: "WhatsApp", time: "০৮:৩০", isUnread: true }
];

export default function RightStreamHud({
  dbStatus = "Connected",
  onSelectChat
}: Props) {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [stats, setStats] = useState({
    inboxCount: 26,
    unreadCount: 72,
    newChatsCount: 34,
    claude: {
      status: "Active",
      latency: "১.১s",
      memory: "২২%",
      rps: "১২ রিক/মি",
      percentage: 37
    },
    voice: {
      status: "Active",
      latency: "০.৩s",
      charsUsed: "১,৫০২",
      charsLimit: "১৫,০০০",
      delivery: "৯৯.৭%",
      percentage: 81
    }
  });
  const [activeModel, setActiveModel] = useState<"claude" | "gemini">("claude");
  const [extraLoaded, setExtraLoaded] = useState(false);

  useEffect(() => {
    // 1. Fetch real synced messages
    fetch("/api/media/messages")
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && Array.isArray(resData.data)) {
          const mapped: InboundChatMessage[] = resData.data.map((m: any) => ({
            id: m.id,
            sender: m.senderName,
            platform:
              m.platform === "whatsapp"
                ? "WhatsApp"
                : m.platform === "facebook" && m.platformName === "মেসেঞ্জার"
                ? "মেসেঞ্জার"
                : "FB",
            time: m.timeShort || "১০:০০",
            isUnread: !m.read
          }));
          setChats(mapped);
        }
      })
      .catch(() => {});

    // 2. Fetch real server dashboard stats
    fetch("/api/media/stats")
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && resData.data) {
          setStats(resData.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleLoadMore = () => {
    cyberAudio.playNodeClick();
    if (!extraLoaded) {
      setChats((prev) => [
        ...prev,
        { id: "10", sender: "Tanvir Ahmed", platform: "FB", time: "০৮:১৫", isUnread: true },
        { id: "11", sender: "Nafisa Rahman", platform: "WhatsApp", time: "০৮:০০", isUnread: true },
        { id: "12", sender: "David Sterling", platform: "মেসেঞ্জার", time: "০৭:৪৫", isUnread: true }
      ]);
      setExtraLoaded(true);
    }
  };

  return (
    <div className="relative flex flex-col gap-3 font-sans select-none max-w-[290px] sm:max-w-[310px] w-full">
      {/* 1. TOP CARD: AI BRAIN • সব মেসেঞ্জার ইনবক্স ফিল্ড */}
      <div className="rounded-2xl border border-emerald-500/20 bg-[#06120b]/90 p-4 shadow-[0_0_40px_rgba(34,197,94,0.15)] backdrop-blur-xl text-white">
        {/* Header matching TV Photo */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Network size={15} />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-widest text-white uppercase">
                AI BRAIN
              </h3>
              <p className="text-[10px] text-emerald-400 font-mono">সব মেসেঞ্জার ইনবক্স ফিল্ড</p>
            </div>
          </div>

          <span className="flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
            LIVE
          </span>
        </div>

        {/* 3 Stat Boxes matching TV Screen: ইনবক্স ২৬ | অন-পড়া ৭২ | নতুন চ্যাট ৩৪ */}
        <div className="grid grid-cols-3 gap-1.5 my-3 font-mono text-center">
          <div className="rounded-xl bg-white/[0.03] p-1.5 border border-white/5">
            <div className="text-[9px] text-gray-400">ইনবক্স</div>
            <div className="text-sm font-bold text-emerald-400">{stats.inboxCount}</div>
          </div>

          <div className="rounded-xl bg-white/[0.03] p-1.5 border border-white/5">
            <div className="text-[9px] text-gray-400">অন-পড়া</div>
            <div className="text-sm font-bold text-cyan-400">{stats.unreadCount}</div>
          </div>

          <div className="rounded-xl bg-white/[0.03] p-1.5 border border-white/5">
            <div className="text-[9px] text-gray-400">নতুন চ্যাট</div>
            <div className="text-sm font-bold text-lime-400">{stats.newChatsCount}</div>
          </div>
        </div>

        {/* Real-time Inbound Message List matching TV Screen */}
        <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1 font-mono text-[11px] scrollbar-thin scrollbar-thumb-emerald-800">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => {
                cyberAudio.playNodeClick();
                onSelectChat?.(`${chat.sender} এর ${chat.platform} মেসেজটি পড়ে শোনাও`);
              }}
              className="w-full flex items-center justify-between rounded-lg bg-white/[0.02] p-1.5 border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.05] transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    chat.platform === "WhatsApp"
                      ? "bg-emerald-400 shadow-[0_0_6px_#22c55e]"
                      : chat.platform === "মেসেঞ্জার"
                      ? "bg-cyan-400 shadow-[0_0_6px_#06b6d4]"
                      : "bg-blue-400 shadow-[0_0_6px_#3b82f6]"
                  }`}
                />
                <span className="font-semibold text-gray-200 text-[11px] truncate">{chat.sender}</span>
                <span className="text-[9px] text-emerald-400/80 bg-emerald-950/60 px-1 rounded border border-emerald-500/20">
                  {chat.platform}
                </span>
              </div>

              <span className="text-[10px] text-gray-400 shrink-0">{chat.time}</span>
            </button>
          ))}
        </div>

        {/* Load More Button */}
        <button
          type="button"
          onClick={handleLoadMore}
          className="w-full mt-2.5 py-1.5 rounded-lg border border-emerald-500/25 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 text-[10px] font-mono font-semibold flex items-center justify-center gap-1 transition"
        >
          <ChevronDown size={12} />
          <span>{extraLoaded ? "সব মেসেজ সিঙ্ক হয়েছে" : "আরো ২০টি মেসেজ লোড করুন"}</span>
        </button>
      </div>

      {/* 2. BOTTOM CARD: Model Latency & Performance Gauges (Exact TV Photo Match) */}
      <div className="rounded-2xl border border-emerald-500/20 bg-[#06120b]/90 p-3.5 shadow-[0_0_40px_rgba(34,197,94,0.15)] backdrop-blur-xl text-white font-mono text-[11px] space-y-3">
        {/* Claude 3.5 Sonnet Gauge */}
        <div>
          <div className="flex items-center justify-between text-gray-300 mb-1">
            <span className="text-[10px] text-gray-300 font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Claude 3.5 Sonnet
            </span>
            <span className="text-emerald-400 font-extrabold text-[11px]">
              {stats.claude.percentage}% • {stats.claude.latency}
            </span>
          </div>

          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-300"
              style={{ width: `${stats.claude.percentage}%` }}
            />
          </div>

          <div className="mt-1 flex items-center justify-between text-[9px] text-gray-400">
            <span>রেসপন্স টাইম: {stats.claude.latency}</span>
            <span>মেমোরি: {stats.claude.memory}</span>
            <span>{stats.claude.rps}</span>
          </div>
        </div>

        {/* ElevenLabs / Bengali Neural Voice Gauge */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-gray-300 mb-1">
            <span className="text-[10px] text-gray-300 font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
              ElevenLabs Neural Voice
            </span>
            <span className="text-lime-400 font-extrabold text-[11px]">
              {stats.voice.percentage}% • {stats.voice.latency}
            </span>
          </div>

          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${stats.voice.percentage}%` }}
            />
          </div>

          <div className="mt-1 flex items-center justify-between text-[9px] text-gray-400">
            <span>{stats.voice.charsUsed} / {stats.voice.charsLimit} ক্যারেক্টার</span>
            <span>ডেলিভারি: {stats.voice.delivery}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
