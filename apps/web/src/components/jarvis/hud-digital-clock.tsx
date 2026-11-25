"use client";

import React, { useEffect, useState } from "react";
import { CloudSun } from "lucide-react";

interface Props {
  assistantName?: string;
  isSleeping?: boolean;
}

export default function HudDigitalClock({
  assistantName = "LYRA",
  isSleeping = false
}: Props) {
  const [timeStr, setTimeStr] = useState({
    hours: "22",
    minutes: "41",
    seconds: "58"
  });
  const [greeting, setGreeting] = useState("Good evening,");
  const [dateStr, setDateStr] = useState("Sunday, 23 November 2026");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTimeStr({ hours: h, minutes: m, seconds: s });

      const hourNum = now.getHours();
      if (hourNum >= 5 && hourNum < 12) {
        setGreeting("Good morning,");
      } else if (hourNum >= 12 && hourNum < 17) {
        setGreeting("Good afternoon,");
      } else if (hourNum >= 17 && hourNum < 22) {
        setGreeting("Good evening,");
      } else {
        setGreeting("Good night,");
      }

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
    <div
      suppressHydrationWarning
      className="flex flex-col items-center justify-center text-center select-none pt-1"
    >
      {/* 1. Large Digital Clock: 22:41:58 (Exact TV Photo Match) */}
      <div
        suppressHydrationWarning
        className="flex items-baseline justify-center font-mono font-black tracking-tight text-white drop-shadow-[0_0_40px_rgba(34,197,94,0.35)]"
      >
        <span suppressHydrationWarning className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-none text-white font-extrabold tracking-tight">
          {timeStr.hours}:{timeStr.minutes}
        </span>
        <span suppressHydrationWarning className="ml-1 text-2xl sm:text-3xl lg:text-[2.2rem] leading-none text-emerald-400 font-black">
          :{timeStr.seconds}
        </span>
      </div>

      {/* 2. Subtitle: Good evening, Sir. LYRA at your service. (Sir highlighted in green) */}
      <div suppressHydrationWarning className="mt-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-gray-200">
        <span suppressHydrationWarning>{greeting}</span>
        <span className="text-emerald-400 font-bold">Sir.</span>
        <span>{assistantName} at your service.</span>
      </div>

      {/* 3. Sub-subtitle: Sunday, 23 November 2026 • Rangpur 21°C ⛅ */}
      <div suppressHydrationWarning className="mt-0.5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-mono">
        <span suppressHydrationWarning>{dateStr}</span>
        <span>•</span>
        <div className="flex items-center gap-1 text-gray-300">
          <span>Rangpur 21°C</span>
          <span className="text-amber-300 text-xs">⛅</span>
        </div>
      </div>
    </div>
  );
}
