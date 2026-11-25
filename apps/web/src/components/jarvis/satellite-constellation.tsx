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
    angleDeg: -120, // Top-Left
    radiusOffset: 0,
    queryPrompt: "আজকের মিটিং ও ক্যালেন্ডার শিডিউল কি?",
    statusText: "৩টি শিডিউল ইভেন্ট সক্রিয়"
  },
  {
    id: "website",
    name: "Website",
    labelBangla: "ওয়েবসাইট ও ওয়েব",
    icon: Globe,
    angleDeg: -45, // Top-Right
    radiusOffset: 5,
    queryPrompt: "ওয়েব ব্রাউজার এবং রিয়েল-টাইম সার্চ স্ট্যাটাস কি?",
    statusText: "গুগল ও ওয়েব রিয়েল-টাইম সিঙ্ক"
  },
  {
    id: "inbox",
    name: "Inbox",
    labelBangla: "ইনবক্স চ্যাট",
    icon: MessageSquare,
    angleDeg: 0, // Far Right
    radiusOffset: 25,
    isSpecialHalo: true, // Special glowing green ring matching photo!
    queryPrompt: "আমার ইনবক্সের সমস্ত নতুন মেসেজ পড়ে শোনাও",
    statusText: "ফেসবুক, হোয়াটসঅ্যাপ ও লিঙ্কডইন চ্যাট"
  },
  {
    id: "social",
    name: "Social",
    labelBangla: "সোশ্যাল মিডিয়া",
    icon: Share2,
    angleDeg: 35, // Bottom-Right
    radiusOffset: 15,
    queryPrompt: "আমার সোশ্যাল মিডিয়ার আপডেট কি?",
    statusText: "ফেসবুক ও লিঙ্কডইন প্রোফাইল যুক্ত"
  },
  {
    id: "people",
    name: "People",
    labelBangla: "পরিচিত ব্যক্তিবর্গ",
    icon: Users,
    angleDeg: 65, // Bottom-Far-Right
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
    angleDeg: 105, // Bottom-Center-Right
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
    angleDeg: 140, // Bottom-Center-Left
    radiusOffset: -10,
    badgeCount: 1,
    queryPrompt: "আমার সার্ভিস সাবস্ক্রিপশন স্ট্যাটাস কি?",
    statusText: "১টি বিলিং সাইকেল আপডেট প্রয়োজন"
  },
  {
    id: "money",
    name: "Money",
    labelBangla: "ফাইন্যান্স ও আয়",
    icon: DollarSign,
    angleDeg: 170, // Bottom-Left
    radiusOffset: 0,
    queryPrompt: "বর্তমান ফাইন্যান্স ও রেভিনিউ ব্যালেন্স কত?",
    statusText: "ব্যালেন্স ও পেপ্যাল স্ট্যাটাস স্বাভাবিক"
  },
  {
    id: "stock",
    name: "Stock",
    labelBangla: "স্টক ও ট্রেড",
    icon: TrendingUp,
    angleDeg: 200, // Far Left
    radiusOffset: 15,
    badgeCount: 1,
    queryPrompt: "মার্কেট ও স্টক ইনডেক্সের হালনাগাদ কি?",
    statusText: "১টি ইনডেক্স অ্যালার্ট পাওয়া গেছে"
  },
  {
    id: "orders",
    name: "Orders",
    labelBangla: "অর্ডার ও পার্সেল",
    icon: Package,
    angleDeg: 240, // Top-Left
    radiusOffset: 10,
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
  orbitRadius = 220,
  onSelectNode
}: Props) {
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);

  // Elliptical radii to match wide TV aspect ratio
  const rx = orbitRadius * 1.35;
  const ry = orbitRadius * 0.95;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
      {/* SVG Circuit Lines & Organic Circuit Field */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.35))" }}
      >
        <defs>
          <radialGradient id="circuitGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#16a34a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.5)" />
            <stop offset="100%" stopColor="rgba(74, 222, 128, 0.15)" />
          </linearGradient>
        </defs>

        {/* Organic Orbiting Ring Path */}
        <g transform="translate(50%, 50%)">
          <ellipse
            cx="0"
            cy="0"
            rx={rx}
            ry={ry}
            fill="none"
            stroke="rgba(34, 197, 94, 0.15)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <ellipse
            cx="0"
            cy="0"
            rx={rx * 0.65}
            ry={ry * 0.65}
            fill="none"
            stroke="rgba(34, 197, 94, 0.08)"
            strokeWidth="1"
          />
        </g>

        {/* Connecting Laser Lines from Center to each Node */}
        {NODES_DATA.map((node) => {
          const rad = (node.angleDeg * Math.PI) / 180;
          const nodeRx = rx + (node.radiusOffset || 0);
          const nodeRy = ry + (node.radiusOffset || 0);
          const nx = Math.cos(rad) * nodeRx;
          const ny = Math.sin(rad) * nodeRy;

          // Inner attachment point on central orb
          const innerR = 75;
          const ix = Math.cos(rad) * innerR;
          const iy = Math.sin(rad) * innerR;

          const isHovered = activeHoverNode === node.id;

          return (
            <g key={`circuit-line-${node.id}`} transform="translate(50%, 50%)">
              <line
                x1={ix}
                y1={iy}
                x2={nx}
                y2={ny}
                stroke={isHovered ? "rgba(74, 222, 128, 0.85)" : "rgba(34, 197, 94, 0.28)"}
                strokeWidth={isHovered ? 1.8 : 1}
                strokeDasharray={isHovered ? "none" : "3 5"}
                className="transition-all duration-300"
              />

              {/* Energy pulse bead on line */}
              <circle
                r={isHovered ? 2.5 : 1.5}
                fill="#86efac"
                opacity={isHovered ? 0.9 : 0.6}
              >
                <animateMotion
                  path={`M ${ix} ${iy} L ${nx} ${ny}`}
                  dur={`${3 + (node.angleDeg % 3)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Orbiting Interactive Node Pills */}
      <div className="relative w-full h-full flex items-center justify-center">
        {NODES_DATA.map((node) => {
          const rad = (node.angleDeg * Math.PI) / 180;
          const nodeRx = rx + (node.radiusOffset || 0);
          const nodeRy = ry + (node.radiusOffset || 0);
          const x = Math.cos(rad) * nodeRx;
          const y = Math.sin(rad) * nodeRy;

          const IconComponent = node.icon;
          const isHovered = activeHoverNode === node.id;

          return (
            <div
              key={node.id}
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              className="absolute pointer-events-auto flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
            >
              {/* Special Halo for Inbox Node matching Photo */}
              {node.isSpecialHalo && (
                <div className="absolute -inset-2.5 rounded-full border border-emerald-400/60 shadow-[0_0_20px_rgba(34,197,94,0.45)] pointer-events-none animate-pulse" />
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
                className={`relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full border transition-all duration-300 ${
                  node.isSpecialHalo
                    ? "bg-[#092213] border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                    : isHovered
                    ? "bg-[#0c2e1a] border-emerald-300 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    : "bg-[#07170e]/90 border-emerald-500/40 text-emerald-400/90 hover:border-emerald-400 shadow-md"
                }`}
              >
                <IconComponent size={18} className="sm:text-xl" />

                {/* Coral/Pink Notification Count Badge matching Photo */}
                {node.badgeCount !== undefined && node.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-1 ring-[#04030a]">
                    {node.badgeCount}
                  </span>
                )}
              </motion.button>

              {/* Node Title Label under icon */}
              <span
                className={`mt-1.5 text-[10px] sm:text-[11px] font-mono tracking-wider font-semibold transition-colors duration-200 ${
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
