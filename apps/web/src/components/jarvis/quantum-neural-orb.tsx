"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  state?: "idle" | "listening" | "processing" | "speaking" | "sleeping";
  size?: number;
  themeColor?: "emerald" | "cyan" | "violet";
  onClick?: () => void;
}

export default function QuantumNeuralOrb({
  state = "idle",
  size = 280,
  themeColor = "emerald",
  onClick
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isSpeaking = state === "speaking";
  const isListening = state === "listening";
  const isSleeping = state === "sleeping";
  const isProcessing = state === "processing";

  // Color profiles
  const colors = {
    emerald: {
      primary: "rgb(16, 185, 129)",
      secondary: "rgb(52, 211, 153)",
      glow: "rgba(16, 185, 129, 0.4)",
      core: "rgba(6, 78, 59, 0.8)",
      pulse: "#10b981"
    },
    cyan: {
      primary: "rgb(6, 182, 212)",
      secondary: "rgb(103, 232, 249)",
      glow: "rgba(6, 182, 212, 0.4)",
      core: "rgba(22, 78, 99, 0.8)",
      pulse: "#06b6d4"
    },
    violet: {
      primary: "rgb(139, 92, 246)",
      secondary: "rgb(192, 132, 252)",
      glow: "rgba(139, 92, 246, 0.4)",
      core: "rgba(76, 29, 149, 0.8)",
      pulse: "#8b5cf6"
    }
  }[isSleeping ? "cyan" : themeColor];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Particle nodes for orbital swarm
    const particleCount = 42;
    const particles: { angle: number; radius: number; speed: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: (size * 0.35) + Math.random() * (size * 0.22),
        speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    const render = () => {
      time += isSleeping ? 0.01 : isSpeaking ? 0.045 : isListening ? 0.035 : 0.02;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = (size * 0.36);

      // Dynamic energy intensity factor
      const intensity = isSpeaking ? 1.4 : isListening ? 1.25 : isSleeping ? 0.6 : 1.0;

      // 1. Outer Diffuse Aura Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.2, cx, cy, baseRadius * 1.6);
      glowGrad.addColorStop(0, colors.glow);
      glowGrad.addColorStop(0.6, isSleeping ? "rgba(30, 27, 75, 0.2)" : colors.glow);
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Concentric Radar Ripples
      const rippleCount = 3;
      for (let r = 0; r < rippleCount; r++) {
        const ripplePhase = (time * 0.5 + r * (Math.PI * 2 / rippleCount)) % (Math.PI * 2);
        const rippleRadius = baseRadius * 0.7 + (ripplePhase / (Math.PI * 2)) * (baseRadius * 0.85);
        const rippleAlpha = Math.max(0, 1 - (ripplePhase / (Math.PI * 2))) * (isSleeping ? 0.1 : 0.25);

        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = rippleAlpha;
        ctx.beginPath();
        ctx.arc(cx, cy, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // 3. 3D Rotating Contour / Brain Lattice Waveform (Video Signature!)
      const rings = isSleeping ? 5 : 9;
      for (let i = 0; i < rings; i++) {
        const ringProgress = (i / rings) * Math.PI;
        const currentRadius = Math.sin(ringProgress) * baseRadius * (1 + 0.05 * Math.sin(time * 3 + i));

        ctx.beginPath();
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = (Math.sin(ringProgress) * 0.55 + 0.2) * (isSleeping ? 0.4 : 0.85);

        // Undulating organic waveform
        const points = 36;
        for (let p = 0; p <= points; p++) {
          const theta = (p / points) * Math.PI * 2;
          const wobble = Math.sin(theta * 4 + time * 2 + i) * (isSpeaking ? 7 : isListening ? 5 : 2.5) * intensity;
          const rWobbled = currentRadius + wobble;
          const x = cx + Math.cos(theta) * rWobbled;
          const y = cy + Math.sin(theta) * rWobbled * 0.75 + Math.cos(ringProgress) * (baseRadius * 0.5);

          if (p === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // 4. Inner Luminous Core Plasma
      const coreGrad = ctx.createRadialGradient(
        cx - baseRadius * 0.2,
        cy - baseRadius * 0.2,
        baseRadius * 0.05,
        cx,
        cy,
        baseRadius * 0.8
      );
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.3, colors.secondary);
      coreGrad.addColorStop(0.7, colors.primary);
      coreGrad.addColorStop(1, colors.core);

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.55 * (1 + 0.03 * Math.sin(time * 4)), 0, Math.PI * 2);
      ctx.fill();

      // 5. Orbiting Quantum Dust Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius * 0.85;

        ctx.fillStyle = colors.secondary;
        ctx.globalAlpha = p.alpha * (isSleeping ? 0.3 : 0.8);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 6. Laser Flare Tendrils when speaking or listening
      if (isSpeaking || isListening) {
        const flares = isSpeaking ? 6 : 4;
        for (let f = 0; f < flares; f++) {
          const fAngle = time * 1.5 + f * ((Math.PI * 2) / flares);
          const fLen = baseRadius * (1.1 + 0.25 * Math.sin(time * 5 + f));
          const fx = cx + Math.cos(fAngle) * fLen;
          const fy = cy + Math.sin(fAngle) * fLen;

          const flareGrad = ctx.createLinearGradient(cx, cy, fx, fy);
          flareGrad.addColorStop(0, colors.secondary);
          flareGrad.addColorStop(1, "transparent");

          ctx.strokeStyle = flareGrad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(fx, fy);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, isSpeaking, isListening, isSleeping, isProcessing, colors, themeColor]);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer select-none group"
      style={{ width: size + 40, height: size + 40 }}
      title="LYRA Quantum Neural Core • Click to activate or interact"
    >
      {/* Outer Gyroscope Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: isSleeping ? 40 : 18, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full border border-dashed pointer-events-none transition-colors duration-1000"
        style={{
          width: size * 1.15,
          height: size * 1.15,
          borderColor: isSleeping ? "rgba(6, 182, 212, 0.15)" : colors.pulse,
          opacity: 0.35
        }}
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: isSleeping ? 55 : 24, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full border border-dotted pointer-events-none transition-colors duration-1000"
        style={{
          width: size * 1.28,
          height: size * 1.28,
          borderColor: isSleeping ? "rgba(99, 102, 241, 0.1)" : colors.secondary,
          opacity: 0.25
        }}
      />

      {/* Main High-Performance Canvas */}
      <canvas
        ref={canvasRef}
        width={size + 40}
        height={size + 40}
        className="relative z-10 transition-transform duration-300 group-hover:scale-105"
      />

      {/* Center Status Glow Dot */}
      <div className="absolute z-20 flex flex-col items-center pointer-events-none">
        <span
          className="h-2 w-2 rounded-full animate-ping"
          style={{ backgroundColor: colors.primary }}
        />
      </div>
    </div>
  );
}
