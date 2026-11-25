"use client";

import { CheckCircle2, Mic, Radio, Volume2, Waves } from "lucide-react";

export default function VoiceStatusCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#121124] to-[#0d0b17] p-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Waves size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Neural Voice Engine</h4>
            <p className="text-[11px] text-gray-400">Milestone 2 Active</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ready
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <Mic size={16} className="text-violet-400" />
            <span className="text-xs text-gray-300">Speech Recognition</span>
          </div>
          <span className="text-xs font-medium text-violet-300">বাংলা + English</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <Volume2 size={16} className="text-pink-400" />
            <span className="text-xs text-gray-300">Voice Synthesis</span>
          </div>
          <span className="text-xs font-medium text-pink-300">Soft Female (মিষ্টভাষী)</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <Radio size={16} className="text-cyan-400" />
            <span className="text-xs text-gray-300">Language Detection</span>
          </div>
          <span className="text-xs font-medium text-cyan-300">Dynamic 99.4%</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-600/10 p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={15} className="text-violet-400" />
          <span className="text-xs font-medium text-violet-200">Next: Wake Word Engine</span>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">
          Milestone 3 will enable hands-free "LYRA" & "Hey LYRA" activation.
        </p>
      </div>
    </div>
  );
}
