"use client";

import React, { useEffect, useState } from "react";
import { CloudSun, Sparkles } from "lucide-react";

interface Props {
  assistantName?: string;
  isSleeping?: boolean;
}

export default function HudDigitalClock({
  assistantName = "LYRA",
  isSleeping = false
}: Props) {
  const [timeStr, setTimeStr] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00"
  });
  const [greeting, setGreeting] = useState("Good day, Sir.");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTimeStr({ hours: h, minutes: m, seconds: s });

      // Dynamic time greeting
      const hourNum = now.getHours();
      if (hourNum >= 5 && hourNum < 12) {
        setGreeting("Good morning, Sir.");
      } else if (hourNum >= 12 && hourNum < 17) {
        setGreeting("Good afternoon, Sir.");
      } else if (hourNum >= 17 && hourNum < 22) {
        setGreeting("Good evening, Sir.");
      } else {
        setGreeting("Good night, Sir.");
      }

      // Date string formatted
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      };
      setDateStr(now.toLocaleDateString("en-US", options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center select-none pt-2 pb-4">
      {/* Top Cyber Accent Lines */}
      <div className="flex items-center gap-3 opacity-60">
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <span className="flex items-center gap-1 text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-300">
          <Sparkles size={11} className="text-cyan-400 animate-pulse" />
          QUANTUM NEURAL INTERFACE
        </span>
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>

      {/* Main Large Sci-Fi Clock */}
      <div className="mt-1 flex items-baseline justify-center font-mono font-black tracking-tight text-white drop-shadow-[0_0_35px_rgba(6,182,212,0.5)]">
        <span className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-widest">
          {timeStr.hours}:{timeStr.minutes}
        </span>
        <span className="ml-1 text-2xl sm:text-3xl lg:text-4xl text-cyan-400 font-extrabold animate-pulse">
          :{timeStr.seconds}
        </span>
      </div>

      {/* Greeting Subtitle (Exact Video match!) */}
      <div className="mt-1 flex items-center gap-2">
        <h2 className="text-sm sm:text-base font-semibold text-gray-200 tracking-wide">
          {isSleeping ? "Shh... LYRA is currently sleeping" : `${greeting} ${assistantName} at your service`}
        </h2>
        {!isSleeping && (
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        )}
      </div>

      {/* Date & Weather Ribbon */}
      <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400 font-mono">
        <span>{dateStr || "Today"}</span>
        <span>•</span>
        <div className="flex items-center gap-1 text-emerald-400">
          <CloudSun size={13} />
          <span>Dhaka 28°C • Optimal</span>
        </div>
      </div>
    </div>
  );
}
