"use client";

import React from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Linkedin,
  Twitter,
  Volume2,
  ShieldCheck,
  BellRing,
  Inbox
} from "lucide-react";

export interface MessageItem {
  id: string;
  platform: string;
  platformName: string;
  senderName: string;
  messageText: string;
  timeAgo: string;
  priority: "high" | "normal";
}

// Clean state: all dummy messages deleted.
const sampleMessages: MessageItem[] = [];

interface Props {
  onReadMessage: (textToSpeak: string) => void;
}

export default function LiveMessagesVault({ onReadMessage }: Props) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook size={16} className="text-[#1877F2]" />;
      case "whatsapp":
        return <MessageCircle size={16} className="text-[#25D366]" />;
      case "instagram":
        return <Instagram size={16} className="text-[#E4405F]" />;
      case "gmail":
        return <Mail size={16} className="text-[#EA4335]" />;
      case "linkedin":
        return <Linkedin size={16} className="text-[#0A66C2]" />;
      default:
        return <Twitter size={16} className="text-[#1DA1F2]" />;
    }
  };

  const handleReadAll = () => {
    if (sampleMessages.length === 0) {
      onReadMessage(
        "আপনার এখনো কোনো সোশ্যাল মিডিয়া বা মেসেজিং অ্যাকাউন্ট সংযুক্ত করা নেই, তাই এই মুহূর্তে কোনো নতুন মেসেজ আসেনি।"
      );
    } else {
      onReadMessage(
        `আপনার ইনবক্সে মোট ${sampleMessages.length}টি নতুন মেসেজ রয়েছে।`
      );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-b from-[#100d23] to-[#080612] p-6 shadow-2xl backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-400/30 text-violet-300">
            <BellRing size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">Live Inbound Messages Vault</h4>
              <span className="rounded-full bg-gray-500/20 px-2 py-0.5 text-[10px] font-bold text-gray-400 border border-gray-500/30">
                {sampleMessages.length} Unread
              </span>
            </div>
            <p className="text-xs text-gray-400">
              LYRA reads all messages in natural soft voice upon request
            </p>
          </div>
        </div>

        <button
          onClick={handleReadAll}
          className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-600/20 px-3.5 py-1.5 text-xs font-semibold text-violet-200 transition hover:bg-violet-600 hover:text-white"
        >
          <Volume2 size={14} />
          <span>মেসেজ চেক করুন</span>
        </button>
      </div>

      {/* Messages List or Clean Empty State */}
      <div className="mt-4">
        {sampleMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 mb-3">
              <Inbox size={24} />
            </div>
            <h5 className="text-sm font-semibold text-white">কোনো নতুন ইনবাউন্ড মেসেজ নেই</h5>
            <p className="mt-1.5 max-w-md text-xs text-gray-400 leading-relaxed">
              আপনার সোশ্যাল মিডিয়া বা মেসেজিং অ্যাকাউন্ট (Facebook, WhatsApp, Instagram, Gmail ইত্যাদি) এখনো কানেক্ট করা হয়নি। অ্যাকাউন্ট যুক্ত করলে নতুন মেসেজ এলে লায়রা আপনাকে স্বয়ংক্রিয়ভাবে জানিয়ে দেবে।
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-violet-300 font-mono">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Dummy data removed • Ready for live authorization</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {sampleMessages.map((msg) => (
              <div
                key={msg.id}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-violet-500/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40">
                    {getPlatformIcon(msg.platform)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{msg.senderName}</span>
                      <span className="text-[10px] font-semibold text-gray-500">via {msg.platformName}</span>
                      {msg.priority === "high" && (
                        <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-bold text-rose-400">
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-300 leading-relaxed font-light">
                      "{msg.messageText}"
                    </p>
                    <span className="mt-1 block text-[10px] text-gray-500">{msg.timeAgo}</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onReadMessage(
                      `${msg.platformName}-এ ${msg.senderName} লিখেছেন: "${msg.messageText}"`
                    )
                  }
                  title="এই মেসেজটি মুখে পড়ে শোনাও"
                  className="self-start sm:self-center shrink-0 flex items-center gap-1.5 rounded-xl border border-violet-500/20 bg-violet-600/10 px-3 py-1.5 text-[11px] font-medium text-violet-300 transition hover:bg-violet-600 hover:text-white"
                >
                  <Volume2 size={13} />
                  <span>শুনুন</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
