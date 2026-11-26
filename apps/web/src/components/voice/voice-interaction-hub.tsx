"use client";

import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Languages,
  RotateCcw,
  Bot,
  AlertTriangle,
  PlayCircle,
  Radio,
  Moon,
  SunMedium,
  Mic,
  MicOff
} from "lucide-react";
import LyraAvatar from "@/components/assistant/lyra-avatar";
import VoiceWaveform from "@/components/voice/voice-waveform";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";

interface Props {
  externalQuery?: string;
}

export default function VoiceInteractionHub({ externalQuery }: Props) {
  const {
    state,
    isSleeping,
    transcript,
    lastResponse,
    detectedLang,
    preferredLang,
    setPreferredLang,
    errorMessage,
    isMuted,
    setIsMuted,
    audioLevels,
    isAutoVoiceActive,
    micPermissionGranted,
    enableAutoVoice,
    goToSleep,
    wakeUp,
    processQuery,
    stopSpeaking,
    speakReply,
    testVoice
  } = useVoiceAssistant();

  const [inputVal, setInputVal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      void processQuery(inputVal.trim());
      setInputVal("");
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-700 p-6 lg:p-8 shadow-2xl backdrop-blur-2xl ${
        isSleeping
          ? "border-indigo-500/20 bg-gradient-to-b from-[#0a0817]/95 via-[#060510]/98 to-[#030208]"
          : "border-violet-500/30 bg-gradient-to-b from-[#141029]/95 via-[#0d0a1b]/98 to-[#07060e]"
      }`}
    >
      {/* Top ambient color spot */}
      <div
        className={`pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-56 w-[28rem] rounded-full blur-3xl transition-colors duration-1000 ${
          isSleeping ? "bg-indigo-900/15" : "bg-violet-600/25"
        }`}
      />

      {/* Header bar of Voice Assistant */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-500 ${
              isSleeping
                ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-300 shadow-md shadow-indigo-950/40"
                : "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-700/40 border-violet-400/40"
            }`}
          >
            {isSleeping ? <Moon size={22} className="text-indigo-400 animate-pulse" /> : <Bot size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                LYRA Neural Voice Matrix
              </h3>
              <span
                className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition-colors ${
                  isSleeping
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSleeping ? "bg-indigo-400 animate-pulse" : "bg-emerald-400 animate-ping"
                  }`}
                />
                {isSleeping ? "🌙 Sleep Mode" : "Auto Voice Active"}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {isSleeping
                ? "লায়রা শান্ত স্লিপ মোডে আছে • শুধু 'Hey LYRA' বলুন"
                : "Continuous Listening • মুখে যেকোনো কথা বলুন"}
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sleep / Wake toggle button */}
          {isSleeping ? (
            <button
              onClick={() => wakeUp()}
              title="লায়রাকে জাগিয়ে তুলুন"
              className="flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-200 transition hover:bg-amber-500 hover:text-black shadow-lg shadow-amber-950/40"
            >
              <SunMedium size={15} />
              <span>☀️ Wake Up</span>
            </button>
          ) : (
            <button
              onClick={goToSleep}
              title="লায়রাকে স্লিপ মোডে পাঠান"
              className="flex items-center gap-1.5 rounded-xl border border-indigo-400/30 bg-indigo-950/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-600 hover:text-white"
            >
              <Moon size={14} />
              <span>🌙 Sleep Mode</span>
            </button>
          )}

          {/* Sound Test Diagnostics Button */}
          <button
            onClick={() => testVoice("bn")}
            title="LYRA-র ভয়েস ও স্পিকার পরীক্ষা করুন"
            className="flex items-center gap-1.5 rounded-xl border border-violet-400/40 bg-gradient-to-r from-violet-600/30 to-purple-600/20 px-3 py-1.5 text-xs font-semibold text-violet-200 transition hover:bg-violet-600 hover:text-white shadow-md shadow-violet-950/40"
          >
            <PlayCircle size={15} className="text-violet-400" />
            <span>🔊 Sound Test</span>
          </button>

          {/* Language selector pills */}
          <div className="flex items-center rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setPreferredLang("auto")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition ${
                preferredLang === "auto"
                  ? "bg-violet-600 text-white shadow-sm font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Languages size={13} />
              Auto
            </button>
            <button
              onClick={() => setPreferredLang("bn")}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                preferredLang === "bn"
                  ? "bg-violet-600 text-white shadow-sm font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setPreferredLang("en")}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                preferredLang === "en"
                  ? "bg-violet-600 text-white shadow-sm font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              English
            </button>
          </div>

          {/* Mute button */}
          <button
            onClick={() => {
              if (!isMuted && state === "speaking") {
                stopSpeaking();
              }
              setIsMuted(!isMuted);
            }}
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
              isMuted
                ? "border-red-500/40 bg-red-500/15 text-red-400"
                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </div>

      {/* Mic permission prompt if needed */}
      {!micPermissionGranted && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-500/40 bg-violet-950/40 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/40">
              <Mic size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">অটো ভয়েস মাইক্রোফোন অ্যাক্টিভেশন</p>
              <p className="text-[11px] text-gray-300">
                ব্রাউজারে সরাসরি অটোমেটিক ভয়েস ইনপুট চালু করতে বাটনে ক্লিক করুন
              </p>
            </div>
          </div>
          <button
            onClick={() => void enableAutoVoice()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/40 transition hover:scale-105"
          >
            <Mic size={14} />
            <span>অটো ভয়েস চালু করুন</span>
          </button>
        </div>
      )}

      {/* Mic error if any */}
      {errorMessage && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">মাইক্রোফোন নোটিশ:</p>
            <p className="text-amber-300/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Center Interactive Avatar & Waveform Area */}
      <div className="relative mt-8 flex flex-col items-center justify-center text-center">
        <LyraAvatar state={state} size={190} />

        {/* State Pill Indicator */}
        <div
          className={`mt-6 flex items-center gap-2 rounded-full border px-5 py-2 backdrop-blur-md shadow-lg transition-colors ${
            isSleeping
              ? "border-indigo-500/30 bg-indigo-950/40 text-indigo-200 shadow-indigo-950/40"
              : "border-violet-500/30 bg-violet-950/50 text-violet-200 shadow-violet-950/50"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isSleeping
                ? "bg-indigo-400 animate-pulse"
                : state === "listening"
                ? "bg-emerald-400 animate-ping"
                : state === "speaking"
                ? "bg-cyan-400 animate-pulse"
                : state === "processing"
                ? "bg-amber-400 animate-spin"
                : "bg-emerald-400"
            }`}
          />
          <span className="text-xs font-semibold tracking-wide">
            {isSleeping
              ? "🌙 Sleeping (স্লিপ মোড)"
              : state === "listening"
              ? "Listening... আমি অটোমেটিক শুনছি, বলুন"
              : state === "speaking"
              ? "LYRA Speaking (নরম ও মিষ্টি কণ্ঠে উত্তর দিচ্ছে)..."
              : state === "processing"
              ? "Analyzing & Processing..."
              : "Auto Voice Active • মুখে কথা বলুন"}
          </span>
        </div>

        {/* Real-time audio waveform */}
        <div className="mt-5 w-full max-w-xs flex justify-center">
          <VoiceWaveform levels={audioLevels} state={state} />
        </div>

        {/* Dynamic Live Transcript or Response Speech Bubble */}
        <div className="mt-6 w-full max-w-xl">
          <div
            className={`relative rounded-2xl border p-5 text-left shadow-xl backdrop-blur-2xl transition-colors ${
              isSleeping ? "border-indigo-500/20 bg-black/70" : "border-white/10 bg-black/60"
            }`}
          >
            {transcript && state === "listening" && (
              <div className="mb-3 border-b border-white/10 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Radio size={12} className="animate-pulse" />
                  Live Voice Input:
                </span>
                <p className="mt-1 text-sm text-gray-100 font-medium">
                  "{transcript}"
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isSleeping ? "text-indigo-400" : "text-violet-400"
                  }`}
                >
                  <Sparkles size={14} />
                  {isSleeping ? "LYRA (Sleeping Tranquil Mode):" : "LYRA (Soft Female Voice):"}
                </span>
                <button
                  onClick={() => speakReply(lastResponse, detectedLang === "bn" ? "bn" : "en")}
                  title="Replay Voice (পুনরায় শুনুন)"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-violet-300 transition"
                >
                  <RotateCcw size={13} />
                  <span>Replay</span>
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-100 font-light">
                {lastResponse}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Text Input Alternative */}
      <div className="relative mt-8 border-t border-white/10 pt-5">
        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              isSleeping
                ? "লায়রা এখন স্লিপ মোডে আছে। জাগাতে লিখুন 'Hey LYRA'..."
                : "যেকোনো প্ল্যাটফর্মের মেসেজ বা প্রশ্ন এখানেও টাইপ করতে পারেন..."
            }
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-violet-500 focus:bg-white/10"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || state === "processing"}
            className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-white transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-600/30"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
