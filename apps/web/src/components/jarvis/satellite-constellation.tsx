"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Globe,
  MessageSquare,
  Share2,
  Users,
  Mail,
  CreditCard,
  DollarSign,
  TrendingUp,
  Package,
  Sparkles
} from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

export interface SatelliteNode {
  id: string;
  name: string;
  labelBangla: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
  angleDeg: number;
  radiusOffset?: number;
  badgeCount?: number;
  isSpecialHalo?: boolean; // For Inbox node with double glowing halo
  queryPrompt: string;
  statusText: string;
}

// 10 Exact Nodes from TV Photo:
// Today, Website, Inbox, Social, People, Mail, Subs, Money, Stock, Orders
const NODES_DATA: SatelliteNode[] = [
  {
    id: "today",
    name: "Today",
    labelBangla: "আজকের শিডিউল",
    icon: Calendar,
    angleDeg: -115, // Top-Left (~11 o'clock)
    radiusOffset: -5,
    queryPrompt: "আজকের মিটিং ও ক্যালেন্ডার শিডিউল কি?",
    statusText: "৩টি শিডিউল ইভেন্ট সক্রিয়"
  },
  {
    id: "website",
    name: "Website",
    labelBangla: "ওয়েবসাইট ও ওয়েব",
    icon: Globe,
    angleDeg: -50, // Top-Right (~1 o'clock)
    radiusOffset: 0,
    queryPrompt: "ওয়েব ব্রাউজার এবং রিয়েল-টাইম সার্চ স্ট্যাটাস কি?",
    statusText: "গুগল ও ওয়েব রিয়েল-টাইম সিঙ্ক"
  },
  {
    id: "inbox",
    name: "Inbox",
    labelBangla: "ইনবক্স চ্যাট",
    icon: MessageSquare,
    angleDeg: 0, // Far Right (~3 o'clock)
    radiusOffset: 15,
    isSpecialHalo: true, // Special glowing green ring matching photo!
    queryPrompt: "আমার ইনবক্সের সমস্ত নতুন মেসেজ পড়ে শোনাও",
    statusText: "ফেসবুক, হোয়াটসঅ্যাপ ও লিঙ্কডইন চ্যাট"
  },
  {
    id: "social",
    name: "Social",
    labelBangla: "সোশ্যাল মিডিয়া",
    icon: Share2,
    angleDeg: 35, // Bottom-Right (~4 o'clock)
    radiusOffset: 10,
    queryPrompt: "আমার সোশ্যাল মিডিয়ার আপডেট কি?",
    statusText: "ফেসবুক ও লিঙ্কডইন প্রোফাইল যুক্ত"
  },
  {
    id: "people",
    name: "People",
    labelBangla: "পরিচিত ব্যক্তিবর্গ",
    icon: Users,
    angleDeg: 68, // Bottom-Far-Right (~5 o'clock)
    radiusOffset: 5,
    badgeCount: 2,
    queryPrompt: "আমার ফ্রেন্ড লিস্ট ও পরিচিতদের কি খবর?",
    statusText: "২ জন ফ্রেন্ডের রিকোয়েস্ট পেন্ডিং"
  },
  {
    id: "mail",
    name: "Mail",
    labelBangla: "ইমেইল ও ইনমেইল",
    icon: Mail,
    angleDeg: 105, // Bottom-Center-Right (~6 o'clock)
    radiusOffset: -5,
    badgeCount: 4,
    queryPrompt: "আমার জিমেইল ও লিঙ্কডইন ইনমেইলে কি মেসেজ আছে?",
    statusText: "৪টি নতুন প্রায়োরিটি ইনমেইল"
  },
  {
    id: "subs",
    name: "Subs",
    labelBangla: "সাবস্ক্রিপশন",
    icon: CreditCard,
    angleDeg: 140, // Bottom-Center-Left (~7 o'clock)
    radiusOffset: -8,
    badgeCount: 1,
    queryPrompt: "আমার সার্ভিস সাবস্ক্রিপশন স্ট্যাটাস কি?",
    statusText: "১টি বিলিং সাইকেল আপডেট প্রয়োজন"
  },
  {
    id: "money",
    name: "Money",
    labelBangla: "ফাইন্যান্স ও আয়",
    icon: DollarSign,
    angleDeg: 170, // Bottom-Left (~8 o'clock)
    radiusOffset: 0,
    queryPrompt: "বর্তমান ফাইন্যান্স ও রেভিনিউ ব্যালেন্স কত?",
    statusText: "ব্যালেন্স ও পেপ্যাল স্ট্যাটাস স্বাভাবিক"
  },
  {
    id: "stock",
    name: "Stock",
    labelBangla: "স্টক ও ট্রেড",
    icon: TrendingUp,
    angleDeg: 198, // Far Left (~9 o'clock)
    radiusOffset: 10,
    badgeCount: 1,
    queryPrompt: "মার্কেট ও স্টক ইনডেক্সের হালনাগাদ কি?",
    statusText: "১টি ইনডেক্স অ্যালার্ট পাওয়া গেছে"
  },
  {
    id: "orders",
    name: "Orders",
    labelBangla: "অর্ডার ও পার্সেল",
    icon: Package,
    angleDeg: 240, // Top-Left (~10 o'clock)
    radiusOffset: 5,
    badgeCount: 1,
    queryPrompt: "আমার অনলাইন অর্ডার ও পার্সেলের কি খবর?",
    statusText: "১টি পার্সেল ডেলিভারির পথে আছে"
  }
];

interface Props {
  orbitRadius?: number;
  onSelectNode?: (prompt: string, nodeId: string) => void;
  themeColor?: "emerald" | "cyan" | "violet";
}

export default function SatelliteConstellation({
  orbitRadius = 190,
  onSelectNode
}: Props) {
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);

  // Exact elliptical radii to comfortably surround the orb without colliding with top clock or bottom dock
  const rx = orbitRadius * 1.25; // ~237px
  const ry = orbitRadius * 0.82; // ~155px

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 overflow-visible">
      {/* 
        SVG Circuit Lines & Laser Pulse Animations:
        Uses viewBox="-400 -260 800 520" so (0,0) is GUARANTEED to be the DEAD CENTER of the plasma orb.
        Zero translate(50%, 50%) bug, ensuring laser animations NEVER drift to the top of the screen!
      */}
      <svg
        viewBox="-400 -260 800 520"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.35))" }}
      >
        <defs>
          <radialGradient id="circuitGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#16a34a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Orbit Ellipse centered at (0,0) */}
        <ellipse
          cx="0"
          cy="0"
          rx={rx}
          ry={ry}
          fill="none"
          stroke="rgba(34, 197, 94, 0.16)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />

        {/* Inner subtle orbit contour */}
        <ellipse
          cx="0"
          cy="0"
          rx={rx * 0.7}
          ry={ry * 0.7}
          fill="none"
          stroke="rgba(34, 197, 94, 0.08)"
          strokeWidth="1"
        />

        {/* 10 Connecting Laser Lines & Animated Energy Beads */}
        {NODES_DATA.map((node) => {
          const rad = (node.angleDeg * Math.PI) / 180;
          const nodeRx = rx + (node.radiusOffset || 0);
          const nodeRy = ry + (node.radiusOffset || 0);
          const nx = Math.cos(rad) * nodeRx;
          const ny = Math.sin(rad) * nodeRy;

          // Inner attachment point on central plasma orb
          const innerR = 60;
          const ix = Math.cos(rad) * innerR;
          const iy = Math.sin(rad) * innerR;

          const isHovered = activeHoverNode === node.id;

          return (
            <g key={`circuit-line-${node.id}`}>
              {/* Connecting laser trace */}
              <line
                x1={ix}
                y1={iy}
                x2={nx}
                y2={ny}
                stroke={isHovered ? "rgba(74, 222, 128, 0.9)" : "rgba(34, 197, 94, 0.32)"}
                strokeWidth={isHovered ? 2 : 1.1}
                strokeDasharray={isHovered ? "none" : "3 5"}
                className="transition-all duration-300"
              />

              {/* Pulsing energy bead traveling along line */}
              <circle
                r={isHovered ? 2.8 : 1.8}
                fill="#86efac"
                opacity={isHovered ? 0.95 : 0.65}
              >
                <animateMotion
                  path={`M ${ix} ${iy} L ${nx} ${ny}`}
                  dur={`${2.8 + ((node.angleDeg + 360) % 5) * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Orbiting Interactive Node Pills: Anchor at 50% / 50% with exact offset */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {NODES_DATA.map((node) => {
          const rad = (node.angleDeg * Math.PI) / 180;
          const nodeRx = rx + (node.radiusOffset || 0);
          const nodeRy = ry + (node.radiusOffset || 0);
          const nx = Math.cos(rad) * nodeRx;
          const ny = Math.sin(rad) * nodeRy;

          const IconComponent = node.icon;
          const isHovered = activeHoverNode === node.id;

          return (
            <div
              key={node.id}
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`
              }}
              className="absolute pointer-events-auto flex flex-col items-center justify-center"
            >
              {/* Special Double Halo for Inbox Node matching TV Screen Photo */}
              {node.isSpecialHalo && (
                <div className="absolute -inset-2 rounded-full border border-emerald-400/60 shadow-[0_0_20px_rgba(34,197,94,0.45)] pointer-events-none animate-pulse" />
              )}

              {/* Circular Node Button */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  cyberAudio.playNodeClick();
                  onSelectNode?.(node.queryPrompt, node.id);
                }}
                onMouseEnter={() => {
                  setActiveHoverNode(node.id);
                  cyberAudio.playNodeHover();
                }}
                onMouseLeave={() => setActiveHoverNode(null)}
                className={`relative flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border transition-all duration-300 ${
                  node.isSpecialHalo
                    ? "bg-[#092213] border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                    : isHovered
                    ? "bg-[#0c2e1a] border-emerald-300 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    : "bg-[#07170e]/95 border-emerald-500/40 text-emerald-400/90 hover:border-emerald-400 shadow-md"
                }`}
              >
                <IconComponent size={17} className="sm:text-lg" />

                {/* Coral/Pink Notification Count Badge matching Photo */}
                {node.badgeCount !== undefined && node.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-1 ring-[#020604]">
                    {node.badgeCount}
                  </span>
                )}
              </motion.button>

              {/* Node Title Label under icon */}
              <span
                className={`mt-1 text-[10px] sm:text-[11px] font-mono tracking-wider font-semibold transition-colors duration-200 ${
                  node.isSpecialHalo
                    ? "text-emerald-300 font-bold"
                    : isHovered
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {node.name}
              </span>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    key={`tooltip-${node.id}`}
                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-14 z-50 whitespace-nowrap rounded-xl border border-emerald-500/30 bg-[#06180e]/95 px-3 py-1.5 shadow-[0_0_20px_rgba(34,197,94,0.3)] backdrop-blur-md"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={11} className="text-emerald-400" />
                      <span className="text-xs font-bold text-white">{node.labelBangla}</span>
                    </div>
                    <p className="text-[10px] text-gray-300 font-mono mt-0.5">{node.statusText}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
