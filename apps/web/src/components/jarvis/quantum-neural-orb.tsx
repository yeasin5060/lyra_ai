"use client";

import React, { useEffect, useRef } from "react";

interface Props {
  state?: "idle" | "listening" | "processing" | "speaking" | "sleeping";
  size?: number;
  themeColor?: "emerald" | "cyan" | "violet";
  onClick?: () => void;
}

/**
 * Organic Electric Green Plasma Energy Orb (Exact Match to TV Screen Photo!)
 * Renders undulating, swirling, organic electric plasma filaments that pulsate
 * with living intelligence in vivid neon emerald/lime green.
 */
export default function QuantumNeuralOrb({
  state = "idle",
  size = 320,
  onClick
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isSpeaking = state === "speaking";
  const isListening = state === "listening";
  const isSleeping = state === "sleeping";
  const isProcessing = state === "processing";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Organic filament lines configuration
    const filamentCount = isSleeping ? 18 : isSpeaking ? 34 : 26;
    const filaments: Array<{
      speed: number;
      phase: number;
      frequency: number;
      amplitude: number;
      layer: number;
    }> = [];

    for (let i = 0; i < filamentCount; i++) {
      filaments.push({
        speed: (Math.random() * 0.008 + 0.004) * (i % 2 === 0 ? 1 : -1),
        phase: Math.random() * Math.PI * 2,
        frequency: Math.floor(Math.random() * 3) + 3,
        amplitude: Math.random() * 8 + 4,
        layer: (i / filamentCount)
      });
    }

    // Particle nodes for ambient dust
    const particles = Array.from({ length: 30 }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: (size * 0.28) + Math.random() * (size * 0.18),
      speed: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.6 + 0.3
    }));

    const render = () => {
      time += isSleeping ? 0.008 : isSpeaking ? 0.035 : isListening ? 0.025 : 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = size * 0.34;
      const intensity = isSpeaking ? 1.35 : isListening ? 1.2 : isSleeping ? 0.5 : 1.0;

      // 1. Deep Atmospheric Emerald Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.2, cx, cy, baseRadius * 1.55);
      glowGrad.addColorStop(0, "rgba(34, 197, 94, 0.45)");
      glowGrad.addColorStop(0.4, "rgba(16, 185, 129, 0.25)");
      glowGrad.addColorStop(0.8, "rgba(5, 46, 22, 0.1)");
      glowGrad.addColorStop(1, "transparent");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.55, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Energy Contour Rings (Pulsing Wobbly Ring)
      const outerRipples = 2;
      for (let r = 0; r < outerRipples; r++) {
        const rPhase = (time * 0.4 + r * Math.PI) % (Math.PI * 2);
        const rRadius = baseRadius * 1.05 + Math.sin(rPhase) * 6;
        const rAlpha = (Math.sin(rPhase) * 0.2 + 0.2) * (isSleeping ? 0.3 : 0.7);

        ctx.strokeStyle = "rgba(74, 222, 128, 0.7)";
        ctx.lineWidth = 1;
        ctx.globalAlpha = rAlpha;
        ctx.beginPath();

        const pts = 48;
        for (let p = 0; p <= pts; p++) {
          const angle = (p / pts) * Math.PI * 2;
          const dist = rRadius + Math.sin(angle * 7 + time * 3) * 4 * intensity;
          const x = cx + Math.cos(angle) * dist;
          const y = cy + Math.sin(angle) * dist * 0.95;
          if (p === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // 3. Central Living Plasma Core (Electric Filament Weave)
      filaments.forEach((fil, idx) => {
        ctx.beginPath();
        const layerAlpha = Math.sin(fil.layer * Math.PI) * 0.7 + 0.25;
        ctx.globalAlpha = layerAlpha * (isSleeping ? 0.35 : 0.9);

        // Gradient from bright lime neon to emerald
        const grad = ctx.createLinearGradient(cx - baseRadius, cy, cx + baseRadius, cy);
        grad.addColorStop(0, "rgba(34, 197, 94, 0.8)");
        grad.addColorStop(0.5, "rgba(163, 230, 53, 0.95)");
        grad.addColorStop(1, "rgba(74, 222, 128, 0.8)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = idx % 3 === 0 ? 1.6 : 1.1;

        const points = 64;
        const radiusScale = (0.75 + Math.sin(fil.layer * Math.PI) * 0.25) * baseRadius;

        for (let i = 0; i <= points; i++) {
          const theta = (i / points) * Math.PI * 2;
          const wave1 = Math.sin(theta * fil.frequency + time * 2.5 + fil.phase) * fil.amplitude * intensity;
          const wave2 = Math.cos(theta * 3 - time * 1.8 + idx) * 5 * intensity;
          const currentR = radiusScale + wave1 + wave2;

          // 3D rotation projection effect
          const rotAngle = time * fil.speed * 20 + fil.phase;
          const x3d = Math.cos(theta) * currentR;
          const y3d = Math.sin(theta) * currentR;

          // Apply slight tilt/undulation
          const x = cx + x3d * Math.cos(rotAngle) - y3d * Math.sin(rotAngle) * 0.3;
          const y = cy + (x3d * Math.sin(rotAngle) * 0.3 + y3d * Math.cos(rotAngle)) * 0.92;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // 4. Ultra-Bright Inner Core Sun
      const innerSun = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.45);
      innerSun.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      innerSun.addColorStop(0.25, "rgba(187, 247, 208, 0.7)");
      innerSun.addColorStop(0.65, "rgba(34, 197, 94, 0.45)");
      innerSun.addColorStop(1, "transparent");

      ctx.fillStyle = innerSun;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.45 * (1 + 0.04 * Math.sin(time * 4)), 0, Math.PI * 2);
      ctx.fill();

      // 5. Orbiting Ambient Green Bio-Luminescent Dust
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius * 0.92;

        ctx.fillStyle = "#86efac";
        ctx.globalAlpha = p.alpha * (isSleeping ? 0.25 : 0.85);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, size, isSpeaking, isListening, isSleeping, isProcessing]);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer select-none group"
      title="LYRA Quantum Core • Click to Speak"
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_50px_rgba(34,197,94,0.35)]"
      />
    </div>
  );
}
