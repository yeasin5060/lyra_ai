"use client";

import React, { useState } from "react";
import { MessageSquare, Volume2, X, ChevronRight, CheckCheck, Sparkles, Send } from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

export interface InboundChat {
  id: string;
  sender: string;
  platform: "facebook" | "whatsapp" | "linkedin" | "instagram";
  message: string;
  timeAgo: string;
  isUnread?: boolean;
}

const DEFAULT_CHATS: InboundChat[] = [
  {
    id: "chat-1",
    sender: "Rai Zn",
    platform: "facebook",
    message: "জিহি, আসসালামু আলাইকুম, আমি 'সাবস্ক্রাইবার' বলছি...",
    timeAgo: "১০ মি",
    isUnread: true
  },
  {
    id: "chat-2",
    sender: "MONY KHAN",
    platform: "facebook",
    message: "জিহি, আসসালামু আলাইকুম, আমি 'সাবস্ক্রাইবার' বলছি...",
    timeAgo: "১ঘ মি",
    isUnread: true
  },
  {
    id: "chat-3",
    sender: "Md Yeasin Arafat",
    platform: "facebook",
    message: "জিহি, আসসালামু আলাইকুম ভাইয়া, আপনার প্রজেক্টের আপডেট দেখতে এলাম...",
    timeAgo: "২ঘ মি",
    isUnread: true
  },
  {
    id: "chat-4",
    sender: "Md Maruf Halder",
    platform: "facebook",
    message: "হ্যালো (Hey) ভাইয়া, নতুন কোনো এআই ফিচার কি রিলিজ হয়েছে?",
    timeAgo: "৩ঘ মি",
    isUnread: true
  },
  {
    id: "chat-5",
    sender: "MD Nahid Hasan",
    platform: "facebook",
    message: "জিহি, আসসালামু আলাইকুম, আমি আপনার সাথে কানেক্ট হতে চাই...",
    timeAgo: "৪ঘ মি",
    isUnread: true
  },
  {
    id: "chat-6",
    sender: "Hasanuzzaman Abid (TUF)",
    platform: "facebook",
    message: "জিহি, আসসালামু আলাইকুম, টিমের প্রজেক্ট মিটিং কখন হবে?",
    timeAgo: "৭ঘ মি",
    isUnread: true
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat?: (text: string) => void;
}

export default function CenterMessagesCard({
  isOpen,
  onClose,
  onSelectChat
}: Props) {
  const [chats, setChats] = useState<InboundChat[]>(DEFAULT_CHATS);

  if (!isOpen) return null;

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-emerald-500/30 bg-[#090b14]/95 p-4 shadow-[0_0_50px_rgba(16,185,129,0.25)] text-white backdrop-blur-xl z-20">
      {/* Top Header matching Video 3 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <MessageSquare size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wide text-white uppercase">মেসেজ</h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
            CHATS
          </span>
          <button
            onClick={() => {
              cyberAudio.playNodeClick();
              onClose();
            }}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 hover:text-white transition"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* 4 Stat Boxes (Exact Video 3 Match: ইনবক্স মেসেজ 0, অন-পড়া 455, নতুন মেসেজ 26, নতুন চ্যাট 33) */}
      <div className="grid grid-cols-4 gap-1.5 mb-3 text-center">
        <div className="rounded-xl bg-white/[0.04] p-1.5 border border-white/5">
          <p className="text-[9px] text-gray-400 font-medium truncate">ইনবক্স</p>
          <p className="text-xs font-bold text-gray-200">০</p>
        </div>
        <div className="rounded-xl bg-emerald-950/30 p-1.5 border border-emerald-500/30">
          <p className="text-[9px] text-emerald-400 font-medium truncate">অন-পড়া</p>
          <p className="text-xs font-extrabold text-emerald-300">৪৫৫</p>
        </div>
        <div className="rounded-xl bg-cyan-950/30 p-1.5 border border-cyan-500/30">
          <p className="text-[9px] text-cyan-400 font-medium truncate">নতুন মেসেজ</p>
          <p className="text-xs font-extrabold text-cyan-300">২৬</p>
        </div>
        <div className="rounded-xl bg-violet-950/30 p-1.5 border border-violet-500/30">
          <p className="text-[9px] text-violet-400 font-medium truncate">নতুন চ্যাট</p>
          <p className="text-xs font-extrabold text-violet-300">৩৩</p>
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              cyberAudio.playNodeClick();
              onSelectChat?.(`${chat.sender} এর মেসেজ: "${chat.message}"`);
            }}
            className="group flex items-center justify-between gap-2 rounded-xl bg-white/[0.025] hover:bg-white/[0.08] p-2 border border-white/5 hover:border-emerald-500/30 transition cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 shadow-sm" />
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-white group-hover:text-emerald-300 transition">
                    {chat.sender}
                  </span>
                  <span className="text-[8px] bg-blue-500/20 text-blue-300 px-1 py-0.2 rounded border border-blue-500/30">
                    ফেসবুক
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate max-w-[170px]">
                  {chat.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] font-mono text-gray-500">{chat.timeAgo}</span>
              <Volume2 size={11} className="text-emerald-400 opacity-60 group-hover:opacity-100 transition" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px]">
        <span className="text-gray-400 font-mono">লাইরা ইনবক্স ইঞ্জিন সিঙ্কড</span>
        <button
          onClick={() => {
            cyberAudio.playWakeChime();
            onSelectChat?.("আমাকে সব অপঠিত ফেসবুক মেসেজের সারাংশ বলো");
          }}
          className="flex items-center gap-1 text-emerald-400 font-semibold hover:underline"
        >
          <span>সব শুনুন</span>
          <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}
