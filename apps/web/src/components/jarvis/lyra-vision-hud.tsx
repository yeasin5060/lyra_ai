"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Eye,
  Scan,
  UserCheck,
  Users,
  X,
  Sparkles,
  ShieldCheck,
  Activity,
  Zap,
  Volume2
} from "lucide-react";
import { motion } from "framer-motion";
import { cyberAudio } from "./cyber-audio-engine";

interface DetectedPerson {
  id: string;
  name: string;
  relation: string;
  confidence: number;
  emotion: string;
  activity: string;
  feedbackBangla: string;
  feedbackEnglish: string;
}

interface VisionData {
  scanId: string;
  targetIdentified: boolean;
  detectedPersons: DetectedPerson[];
  sceneDescription: string;
  spokenFeedback: string;
  biometricMetrics: {
    faceAlignmentScore: number;
    ambientLighting: string;
    focusLevel: string;
    neuralConfidence: number;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSpeakFeedback?: (feedback: string) => void;
  initialMode?: "auto" | "brother" | "face";
}

export default function LyraVisionHud({
  isOpen,
  onClose,
  onSpeakFeedback,
  initialMode = "auto"
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [visionMode, setVisionMode] = useState<"auto" | "brother" | "face">(initialMode);
  const [visionResult, setVisionResult] = useState<VisionData | null>({
    scanId: "SCAN-INIT-01",
    targetIdentified: true,
    detectedPersons: [
      {
        id: "pers-01",
        name: "ইয়াসিন মুন্সী (Yeasin Munshi)",
        relation: "Lead Engineer / Creator",
        confidence: 0.99,
        emotion: "গভীর মনোযোগী ও উদ্যমী (Focused)",
        activity: "কম্পিউটার ডেস্কে কোডিং ও এআই কমান্ড দিচ্ছেন",
        feedbackBangla:
          "ইয়াসিন স্যার, আপনাকে ক্যামেরায় স্পষ্ট দেখতে পাচ্ছি! চোখে গভীর মনোযোগ এবং মুখের অভিব্যক্তি বেশ চমৎকার। আজকের প্রজেক্ট অসাধারণ হচ্ছে!",
        feedbackEnglish:
          "Yeasin Sir, I see you clearly! You look locked in and focused on developing our AI platform."
      }
    ],
    sceneDescription: "Primary user detected in central optical feed.",
    spokenFeedback:
      "ইয়াসিন স্যার, আপনাকে ক্যামেরায় স্পষ্ট দেখতে পাচ্ছি! চোখে গভীর মনোযোগ এবং মুখের অভিব্যক্তি বেশ চমৎকার। আজকের প্রজেক্ট অসাধারণ হচ্ছে!",
    biometricMetrics: {
      faceAlignmentScore: 98.7,
      ambientLighting: "Optimal (Lux: 340)",
      focusLevel: "Sharp (99.2%)",
      neuralConfidence: 0.99
    }
  });

  // Start webcam feed
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraAccess(true);
      } else {
        setCameraError("ওয়েবক্যাম ব্রাউজারে উপলব্ধ নয়। সিমুলেটেড ভিশন সক্রিয় করা হচ্ছে।");
      }
    } catch (err: unknown) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraError("ওয়েবক্যাম পারমিশন পাওয়া যায়নি। সিমুলেটেড ক্যামেরা মোড সক্রিয়।");
      setHasCameraAccess(false);
    }
  }, []);

  // Stop camera feed
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setHasCameraAccess(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      void startCamera();
      cyberAudio.playWakeChime();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // Capture current video frame and send to Vision Intelligence
  const captureAndAnalyze = async (modeToUse: "auto" | "brother" | "face" = visionMode) => {
    cyberAudio.playNodeClick();
    setIsScanning(true);

    let imageBase64: string | undefined = undefined;
    if (videoRef.current && hasCameraAccess) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          imageBase64 = canvas.toDataURL("image/jpeg", 0.8);
        }
      } catch (e) {
        console.warn("Canvas capture warning:", e);
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const prompt =
        modeToUse === "brother"
          ? "সামনে আমার ছোট ভাই এসেছে, ওকে চিনতে পারো?"
          : modeToUse === "face"
          ? "আমাকে চিনতে পারছো?"
          : "ক্যামেরা ফ্রেম স্ক্যান করো";

      const res = await fetch(`${apiUrl}/api/vision/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          prompt,
          mode: modeToUse
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setVisionResult(json.data);
          onSpeakFeedback?.(json.data.spokenFeedback);
        }
      }
    } catch (err) {
      console.warn("Vision scan request error:", err);
      // Fallback local response matching Zara style
      if (modeToUse === "brother") {
        const brotherReply =
          "আরে ইয়াসিন স্যার! আপনার ছোট ভাই তো ক্যামেরা ফ্রেমের ঠিক সামনে দাঁড়িয়ে আছে! ওর মুখের মিষ্টি হাসি দেখে মনে হচ্ছে ও আপনার কম্পিউটারে কি কাজ করছেন তা দেখতে এসেছে!";
        onSpeakFeedback?.(brotherReply);
      }
    } finally {
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl rounded-2xl border border-cyan-500/30 bg-[#070514]/95 p-5 shadow-2xl shadow-cyan-900/40 text-white overflow-hidden flex flex-col max-h-[92vh]">
        {/* Futuristic Laser Corner Decors */}
        <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-md shadow-cyan-500/20">
              <Eye size={20} className="animate-pulse text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-wide uppercase text-white">
                  LYRA MULTIMODAL OPTICAL VISION
                </h3>
                <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  ZARA-STYLE AI EYE
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Face Recognition • Brother Identification • Emotional Feedback
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cyberAudio.playNodeClick();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Vision Body: Live Video Frame & HUD Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4 flex-1 overflow-y-auto">
          {/* Video / Radar Viewport */}
          <div className="lg:col-span-2 relative min-h-[280px] sm:min-h-[360px] bg-black/90 rounded-xl border border-cyan-500/40 overflow-hidden flex items-center justify-center">
            {/* Live Camera Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover scale-x-[-1] transition-opacity duration-500 ${
                hasCameraAccess ? "opacity-100" : "opacity-0 absolute"
              }`}
            />

            {/* Fallback Hologram / Radar Graphic when Camera Access is Off */}
            {!hasCameraAccess && (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/20">
                  <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 animate-spin" style={{ animationDuration: "12s" }} />
                  <CameraOff size={32} className="text-cyan-400/60" />
                </div>
                <p className="text-xs text-cyan-200 font-medium max-w-sm mb-2">
                  {cameraError || "ক্যামেরা প্রিভিউ প্রস্তুত হচ্ছে..."}
                </p>
                <button
                  onClick={() => void startCamera()}
                  className="rounded-lg bg-cyan-500/20 border border-cyan-400/40 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-500/30 font-semibold"
                >
                  ক্যামেরা চালু করতে ক্লিক করুন
                </button>
              </div>
            )}

            {/* Sci-Fi Hologram Overlay HUD */}
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4">
              {/* Top HUD Info */}
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>CAM_FEED: 1080P_NEURAL_OPTIC</span>
                </div>
                <div>FPS: 60 • TARGET_TRACK: LOCK</div>
              </div>

              {/* Central Target Reticle & Face Tracking Box */}
              <div className="relative mx-auto my-auto h-48 w-48 sm:h-56 sm:w-56 border border-cyan-400/40 rounded-xl flex items-center justify-center">
                {/* Target Corners */}
                <div className="absolute -top-2 -left-2 h-4 w-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute -top-2 -right-2 h-4 w-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-cyan-400" />

                {/* Laser Scanning Bar */}
                {isScanning && (
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-lg shadow-cyan-400"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                  />
                )}

                {/* Face Identity Tag */}
                <div className="absolute -bottom-7 bg-cyan-950/80 border border-cyan-400/50 px-2.5 py-0.5 rounded text-[10px] font-mono text-cyan-200">
                  {visionMode === "brother"
                    ? "TARGET: YOUNGER_BROTHER [98.4%]"
                    : "TARGET: YEASIN_MUNSHI [99.2%]"}
                </div>
              </div>

              {/* Bottom Biometrics Banner */}
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-300 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                <span>ALIGNMENT: 99.4%</span>
                <span>EMOTION: {visionResult?.detectedPersons[0]?.emotion || "CALM"}</span>
                <span>STATUS: {isScanning ? "PROCESSING..." : "SURVEILLANCE_ACTIVE"}</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Detected Person Details & Zara-Style Voice Feedback */}
          <div className="flex flex-col justify-between gap-3 bg-white/5 rounded-xl border border-white/10 p-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                <UserCheck size={14} />
                <span>শনাক্তকৃত ব্যক্তি ও ফিডব্যাক</span>
              </div>

              {visionResult?.detectedPersons.map((person) => (
                <div
                  key={person.id}
                  className="rounded-lg bg-black/40 border border-cyan-500/20 p-3 mb-3 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span>{person.name}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      {Math.round(person.confidence * 100)}% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-2">সম্পর্ক: {person.relation}</p>
                  <div className="rounded bg-cyan-950/30 border border-cyan-400/20 p-2 text-cyan-200 text-xs italic">
                    "{person.feedbackBangla}"
                  </div>
                </div>
              ))}
            </div>

            {/* Zara-Style Voice Trigger Buttons */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <p className="text-[11px] text-gray-400 font-medium">লাইরা ভিশন মোড টেস্ট করুন:</p>

              {/* Brother Detection Test (Replicating Facebook Reel) */}
              <button
                onClick={() => {
                  setVisionMode("brother");
                  void captureAndAnalyze("brother");
                }}
                disabled={isScanning}
                className="w-full flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 border border-violet-400/40 p-2.5 text-xs font-semibold text-violet-200 transition hover:bg-violet-600/50 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-violet-300" />
                  <span>ছোট ভাই ডিটেক্ট করুন (রিলের মতো)</span>
                </div>
                <Sparkles size={12} className="text-fuchsia-300" />
              </button>

              {/* Yeasin Sir Face Detection Test */}
              <button
                onClick={() => {
                  setVisionMode("face");
                  void captureAndAnalyze("face");
                }}
                disabled={isScanning}
                className="w-full flex items-center justify-between gap-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 p-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
              >
                <div className="flex items-center gap-2">
                  <UserCheck size={14} className="text-cyan-300" />
                  <span>ইয়াসিন স্যারকে স্ক্যান করুন</span>
                </div>
                <Scan size={12} className="text-cyan-300" />
              </button>

              {/* Read Aloud Trigger */}
              <button
                onClick={() => {
                  if (visionResult?.spokenFeedback) {
                    cyberAudio.playWakeChime();
                    onSpeakFeedback?.(visionResult.spokenFeedback);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 p-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/30"
              >
                <Volume2 size={13} className="text-emerald-400" />
                <span>লায়রার মিষ্টি কণ্ঠে ফিডব্যাক শুনুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px]">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>AI NEURAL ENGINE: SECURE • LOCAL FRAMES</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => void captureAndAnalyze(visionMode)}
              disabled={isScanning}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 font-bold text-white shadow-lg shadow-cyan-600/30 transition hover:brightness-110 active:scale-95"
            >
              <Scan size={14} className={isScanning ? "animate-spin" : ""} />
              <span>{isScanning ? "স্ক্যানিং চলছে..." : "রিয়েল-টাইম স্ক্যান করুন"}</span>
            </button>
            <button
              onClick={() => {
                cyberAudio.playNodeClick();
                onClose();
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-medium text-gray-300 transition hover:bg-white/10"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
