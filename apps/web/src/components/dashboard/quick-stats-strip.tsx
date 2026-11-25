"use client";

import { Cpu, HeartHandshake, Mic2, Radio, Share2, Sparkles } from "lucide-react";

export default function QuickStatsStrip() {
  const stats = [
    {
      label: "Media & Social Integration",
      value: "Yeasin Munshi Synced",
      sub: "Facebook & LinkedIn Connected",
      icon: Share2,
      color: "from-blue-500/25 to-indigo-500/10 text-blue-400 border-blue-500/30"
    },
    {
      label: "Bilingual Neural Voice",
      value: "বাংলা + English Active",
      sub: "Pitch 1.15x • Soft Sweet Female Tone",
      icon: HeartHandshake,
      color: "from-pink-500/25 to-rose-500/10 text-pink-400 border-pink-500/30"
    },
    {
      label: "Instant Speech Recognition",
      value: "Dual Mode STT",
      sub: "Auto-detecting Bengali & English",
      icon: Mic2,
      color: "from-violet-500/25 to-purple-500/10 text-violet-400 border-violet-500/30"
    },
    {
      label: "Audio Stream Status",
      value: "Spotify Ready",
      sub: "Connect account to stream",
      icon: Radio,
      color: "from-emerald-500/25 to-cyan-500/10 text-emerald-400 border-emerald-500/30"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.07] hover:shadow-violet-950/40 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {s.label}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-gradient-to-br ${s.color} shadow-md`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="mt-3 text-xl font-bold text-white tracking-tight group-hover:text-violet-200 transition">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-gray-400">{s.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
