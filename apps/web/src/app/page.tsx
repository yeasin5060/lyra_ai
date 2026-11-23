"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Mic,
  Settings,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import LyraAvatar from "@/components/assistant/lyra-avatar";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "AI Assistant", icon: MessageCircle },
  { name: "Social Accounts", icon: Users },
  { name: "Analytics", icon: Activity },
  { name: "Messages", icon: Mail },
  { name: "Calendar", icon: CalendarDays },
  { name: "Security", icon: ShieldCheck },
  { name: "Settings", icon: Settings }
];

export default function Home() {
  const [apiStatus, setApiStatus] = useState("Checking...");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, {
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Offline");
        const data = await response.json();
        setApiStatus(
          data.database === "connected" ? "Connected" : "Degraded"
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setApiStatus("Offline");
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#080811] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0c0b18] p-6 md:flex md:flex-col">
          <h1 className="text-3xl font-bold tracking-[0.25em] text-violet-300">
            LYRA
          </h1>
          <p className="mt-2 mb-12 text-xs text-gray-500">
            PERSONAL AI ASSISTANT
          </p>

          <nav className="flex-1 space-y-2">
            {menu.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    index === 0
                      ? "bg-violet-600/20 text-violet-300"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-gray-400">API Status</p>
            <p className="mt-2 text-sm text-emerald-400">● {apiStatus}</p>
          </div>
        </aside>

        <section className="flex-1 p-5 md:p-10">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Personal workspace</p>
              <h2 className="mt-1 text-2xl font-semibold">Welcome to LYRA</h2>
            </div>
            <Settings size={21} />
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#17132c] to-[#0e0d19] p-8 lg:col-span-2">
              <div className="flex flex-col items-center justify-center text-center">
                <LyraAvatar />

                <div className="mt-8 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-sm text-violet-300">
                    Foundation Ready
                  </span>
                </div>

                <h3 className="mt-4 text-3xl font-semibold">
                  Hello, I'm LYRA
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-gray-400">
                  Your personal AI assistant. I'm getting ready to manage your
                  digital world.
                </p>

                <button
                  disabled
                  title="Voice engine coming in Milestone 2"
                  className="mt-8 flex items-center gap-3 rounded-full bg-violet-600 px-8 py-4 font-medium opacity-70 cursor-not-allowed"
                >
                  <Mic size={20} />
                  Voice Coming Soon
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-[#12111e] p-6">
                <Sparkles className="text-violet-400" />
                <h4 className="mt-4 font-semibold">AI Intelligence</h4>
                <p className="mt-2 text-sm text-gray-400">
                  AI brain integration planned.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#12111e] p-6">
                <Users className="text-violet-400" />
                <h4 className="mt-4 font-semibold">Connected Accounts</h4>
                <p className="mt-2 text-sm text-gray-400">
                  No accounts connected yet.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#12111e] p-6">
                <ShieldCheck className="text-emerald-400" />
                <h4 className="mt-4 font-semibold">Security Center</h4>
                <p className="mt-2 text-sm text-gray-400">
                  Authentication foundation configured.
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-10 text-center text-xs text-gray-600">
            LYRA AI · Your Personal Intelligent Assistant
          </footer>
        </section>
      </div>
    </main>
  );
}
