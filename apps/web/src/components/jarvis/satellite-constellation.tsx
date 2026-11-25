"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Globe,
  Mail,
  Users,
  Share2,
  Activity,
  DollarSign,
  FileText,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { cyberAudio } from "./cyber-audio-engine";

export interface SatelliteNode {
  id: string;
  name: string;
  labelBangla: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
  angleDeg: number; // Position in circular orbit (0 = East, 90 = South, etc.)
  color: string;
  badge: string;
  statusText: string;
  queryPrompt: string;
}

const NODES_DATA: SatelliteNode[] = [
  {
    id: "today",
    name: "Today",
    labelBangla: "আজকের শিডিউল",
    category: "Schedule & Agenda",
    icon: Calendar,
    angleDeg: -90, // Top
    color: "#4285F4",
    badge: "3 Events",
    statusText: "11:30 AM Sync, 3:30 PM AI Rev",
    queryPrompt: "আজকের মিটিং ও ক্যালেন্ডার শিডিউল কি?"
  },
  {
    id: "website",
    name: "Website",
    labelBangla: "ওয়েব ব্রাউজার",
    category: "Web & Intelligence",
    icon: Globe,
    angleDeg: -45, // Top-Right
    color: "#06B6D4",
    badge: "Active",
    statusText: "Google Search & Docs online",
    queryPrompt: "ওয়েব ব্রাউজার এবং রিয়েল-টাইম সার্চ স্ট্যাটাস কি?"
  },
  {
    id: "inbox",
    name: "Inbox",
    labelBangla: "ইনবক্স মেসেজ",
    category: "Unified Messaging",
    icon: Mail,
    angleDeg: 0, // Right
    color: "#EA4335",
    badge: "0 New",
    statusText: "Inbox clean • Ready for auth",
    queryPrompt: "আমার ইনবক্সে কি কোন নতুন মেসেজ বা ইমেইল আছে?"
  },
  {
    id: "people",
    name: "People",
    labelBangla: "টিম ও কন্টাক্টস",
    category: "Network & Relations",
    icon: Users,
    angleDeg: 45, // Bottom-Right
    color: "#A855F7",
    badge: "Synced",
    statusText: "AI Architecture Team connected",
    queryPrompt: "আমার টিম ও কন্টাক্টস লিস্টের আপডেট কি?"
  },
  {
    id: "social",
    name: "Social",
    labelBangla: "সোশ্যাল মিডিয়া",
    category: "Social Platforms",
    icon: Share2,
    angleDeg: 90, // Bottom
    color: "#10B981",
    badge: "Yeasin Core",
    statusText: "Facebook & LinkedIn Synced",
    queryPrompt: "আমার সোশ্যাল মিডিয়ার আপডেট কি?"
  },
  {
    id: "health",
    name: "Health",
    labelBangla: "সিস্টেম ডায়াগনস্টিক",
    category: "System Core & DB",
    icon: Activity,
    angleDeg: 135, // Bottom-Left
    color: "#F59E0B",
    badge: "Normal",
    statusText: "Database: Standby • Latency: 14ms",
    queryPrompt: "সিস্টেম ডায়াগনস্টিক ও ডেটাবেস হেলথ চেক করো"
  },
  {
    id: "finance",
    name: "Finance",
    labelBangla: "ফাইন্যান্স ও আয়",
    category: "Analytics & Budget",
    icon: DollarSign,
    angleDeg: 180, // Left
    color: "#10B981",
    badge: "$0.00",
    statusText: "Revenue & billing monitoring",
    queryPrompt: "ফাইন্যান্স ও বর্তমান রেভিনিউ স্ট্যাটাস বলো"
  },
  {
    id: "notes",
    name: "Notes",
    labelBangla: "ব্রেন মেমোরি",
    category: "Knowledge & Notes",
    icon: FileText,
    angleDeg: 225, // Top-Left
    color: "#EC4899",
    badge: "12 Items",
    statusText: "Long-term AI memory active",
    queryPrompt: "লায়রা তোমার মেমোরিতে কি কি নোট সংরক্ষিত আছে?"
  }
];

interface Props {
  orbitRadius?: number;
  onSelectNode: (queryPrompt: string) => void;
  themeColor?: "emerald" | "cyan" | "violet";
}

export default function SatelliteConstellation({
  orbitRadius = 240,
  onSelectNode,
  themeColor = "emerald"
}: Props) {
  const [hoveredNode, setHoveredNode] = useState<SatelliteNode | null>(null);

  const primaryGlow =
    themeColor === "emerald"
      ? "rgba(16, 185, 129, 0.5)"
      : themeColor === "cyan"
      ? "rgba(6, 182, 212, 0.5)"
      : "rgba(139, 92, 246, 0.5)";

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* SVG Circuit Lines connecting center to each satellite node */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ zIndex: 5 }}
      >
        <defs>
          <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor={primaryGlow} stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0.1" />
          </linearGradient>

          <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {NODES_DATA.map((node) => {
          const rad = (node.angleDeg * Math.PI) / 180;
          // Calculate center and target points based on 50% coordinate
          // In SVG percentage space: cx = 50%, cy = 50%
          const isHovered = hoveredNode?.id === node.id;

          return (
            <g key={`circuit-${node.id}`}>
              {/* Pulsing Base Laser Circuit Path */}
              <motion.line
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${Math.cos(rad) * orbitRadius}px)`}
                y2={`calc(50% + ${Math.sin(rad) * orbitRadius}px)`}
                stroke={isHovered ? node.color : primaryGlow}
                strokeWidth={isHovered ? 2 : 1.2}
                strokeDasharray="4 4"
                strokeOpacity={isHovered ? 0.9 : 0.4}
                filter="url(#glowFilter)"
                animate={{
                  strokeDashoffset: [0, -24]
                }}
                transition={{
                  duration: isHovered ? 0.8 : 2.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* Traveling Energy Packet Dot on Circuit Line */}
              <circle
                r={isHovered ? 3.5 : 2}
                fill={isHovered ? "#ffffff" : node.color}
                filter="url(#glowFilter)"
              >
                <animateMotion
                  path={`M calc(50% + ${Math.cos(rad) * 60}px) calc(50% + ${Math.sin(rad) * 60}px) L calc(50% + ${Math.cos(rad) * orbitRadius}px) calc(50% + ${Math.sin(rad) * orbitRadius}px)`}
                  dur={isHovered ? "1.2s" : "2.4s"}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* 8 Satellite Interactive Nodes */}
      {NODES_DATA.map((node) => {
        const rad = (node.angleDeg * Math.PI) / 180;
        const x = Math.cos(rad) * orbitRadius;
        const y = Math.sin(rad) * orbitRadius;
        const Icon = node.icon;
        const isHovered = hoveredNode?.id === node.id;

        return (
          <div
            key={node.id}
            className="absolute pointer-events-auto flex flex-col items-center justify-center select-none"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              zIndex: 20
            }}
          >
            {/* Holographic Tooltip on Hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: node.angleDeg > 0 ? 15 : -15 }}
                  animate={{ opacity: 1, scale: 1, y: node.angleDeg > 0 ? 25 : -25 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  className="absolute pointer-events-none z-50 w-52 rounded-2xl border border-white/20 bg-[#0c0a1a]/95 p-3.5 shadow-2xl backdrop-blur-2xl"
                  style={{
                    [node.angleDeg > 0 ? "top" : "bottom"]: "100%",
                    boxShadow: `0 0 25px ${node.color}35`
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: node.color }} />
                      <span className="text-xs font-bold text-white tracking-wide">{node.name}</span>
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${node.color}25`, color: node.color }}
                    >
                      {node.badge}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] font-medium text-gray-300 leading-snug">
                    {node.statusText}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-500 font-mono">{node.labelBangla}</p>

                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-emerald-400 font-semibold">
                    <span>ক্লিক করে কথা বলুন</span>
                    <ArrowUpRight size={12} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Satellite Circular Pod Button */}
            <motion.button
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.94 }}
              onMouseEnter={() => {
                setHoveredNode(node);
                cyberAudio.playNodeHover();
              }}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => {
                cyberAudio.playNodeClick();
                onSelectNode(node.queryPrompt);
              }}
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-lg group"
              style={{
                backgroundColor: isHovered ? `${node.color}30` : "rgba(10, 9, 20, 0.8)",
                borderColor: isHovered ? node.color : "rgba(255, 255, 255, 0.15)",
                boxShadow: isHovered
                  ? `0 0 30px ${node.color}70, inset 0 0 15px ${node.color}40`
                  : `0 0 15px rgba(0, 0, 0, 0.5)`
              }}
            >
              {/* Outer Pulse Beacon */}
              <div
                className="absolute inset-0 rounded-2xl animate-ping opacity-20 pointer-events-none"
                style={{ backgroundColor: node.color }}
              />

              <span style={{ color: isHovered ? "#ffffff" : node.color }} className="transition-colors duration-200 flex items-center justify-center">
                <Icon size={22} />
              </span>

              {/* Corner Sci-Fi Tech Notches */}
              <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-white/40" />
              <span className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-white/40" />
            </motion.button>

            {/* Label Underneath (Signature Video Feature!) */}
            <div className="mt-2 flex flex-col items-center">
              <span
                className="text-xs font-bold tracking-wider transition-colors duration-200"
                style={{ color: isHovered ? "#ffffff" : "rgba(226, 232, 240, 0.85)" }}
              >
                {node.name}
              </span>
              <span className="text-[10px] font-mono text-gray-500">{node.badge}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
