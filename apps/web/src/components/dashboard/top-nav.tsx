"use client";

import { Bell, Command, Globe, Radio, Sparkles, Volume2 } from "lucide-react";
import { softVoiceSynthesizer } from "@/lib/voice/speech-synthesizer";

interface Props {
  apiStatus: string;
}

export default function TopNav({ apiStatus }: Props) {
  const handleQuickTest = () => {
    softVoiceSynthesizer.speak("হ্যালো ইয়াসিন স্যার! আমি লায়রা। গুগল জেমিনাই এবং ক্লড এআই মডেলের সাথে আমার বাংলা ভয়েস ইঞ্জিন সম্পূর্ণ সচল আছে।", {
      language: "bn",
      pitch: 1.15,
      rate: 0.94
    });
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-violet-500/20 bg-[#07060e]/85 px-6 backdrop-blur-2xl lg:px-10">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-wide text-white">LYRA Command Matrix</h2>
            <span className="flex items-center gap-1 rounded-full bg-violet-600/25 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/40">
              <Sparkles size={11} className="text-violet-400" />
              v2.0 Media AI
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Soft Female Voice Engine • 9 Media Integrations Active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Speaker Audio Test */}
        <button
          onClick={handleQuickTest}
          title="Play Test Voice"
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-600/15 px-3 py-1.5 text-xs font-semibold text-violet-200 transition hover:bg-violet-600 hover:text-white"
        >
          <Volume2 size={14} className="text-violet-400" />
          <span>Sound Check</span>
        </button>

        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
          <Globe size={14} className="text-violet-400" />
          <span>API:</span>
          <span className={`font-semibold ${apiStatus === "Connected" ? "text-emerald-400" : "text-amber-400"}`}>
            ● {apiStatus}
          </span>
        </div>

        {/* Notification bell */}
        <button
          title="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
        </button>

        {/* User profile avatar pill */}
        <div className="flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-white/5 py-1.5 pl-1.5 pr-4 shadow-lg shadow-violet-950/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-xs font-bold text-white shadow-md">
            L
          </div>
          <span className="text-xs font-semibold text-gray-100">User Profile</span>
        </div>
      </div>
    </header>
  );
}
