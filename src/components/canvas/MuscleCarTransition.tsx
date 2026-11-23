"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { Flame, Gauge, Wind, Zap } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getThemePalette } from "@/lib/theme";

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
  type: "smoke" | "flame";
}

interface HudData {
  speed: number;
  rpm: number;
  gear: string;
  gForce: number;
}

const IDLE_HUD: HudData = { speed: 0, rpm: 900, gear: "P", gForce: 0.1 };

function computeHudData(rawVelocity: number): HudData {
  const absVel = Math.abs(rawVelocity);
  if (absVel < 4) return IDLE_HUD;
  const speed = Math.min(Math.round(absVel * 0.32), 340);
  const rpm = Math.min(900 + Math.round(absVel * 8.5), 9500);
  const gForce = +Math.min(0.1 + absVel * 0.0028, 3.4).toFixed(1);
  const gear =
    speed === 0
      ? "P"
      : speed < 45
        ? "1"
        : speed < 90
          ? "2"
          : speed < 140
            ? "3"
            : speed < 200
              ? "4"
              : speed < 270
                ? "5"
                : speed < 320
                  ? "6"
                  : "RCKT";
  return { speed, rpm, gear, gForce };
}

function TelemetryHud({
  smoothVelocity,
  reducedMotion,
}: {
  smoothVelocity: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const [hudData, setHudData] = useState<HudData>(IDLE_HUD);
  const lastUpdateRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  useMotionValueEvent(smoothVelocity, "change", (latest) => {
    if (reducedMotion) return;

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    const next = computeHudData(latest);
    const now = performance.now();

    if (next.speed === 0 || now - lastUpdateRef.current > 65) {
      lastUpdateRef.current = now;
      setHudData((prev) =>
        prev.speed === next.speed &&
        prev.rpm === next.rpm &&
        prev.gear === next.gear &&
        prev.gForce === next.gForce
          ? prev
          : next
      );
    }

    // Ensure trailing settle resets telemetry cleanly to idle
    resetTimerRef.current = setTimeout(() => {
      const settled = computeHudData(smoothVelocity.get());
      setHudData(settled);
    }, 120);
  });

  const isRedline = hudData.rpm > 7000;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs font-mono text-ink-muted">
      <div className="flex items-center gap-3 bg-surface/95 border border-line-subtle rounded-full px-4 py-1.5 shadow-card backdrop-blur-md">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cobalt" />
        </span>
        <span className="text-ink-primary font-semibold tracking-wider flex items-center gap-1.5">
          <Wind
            className="w-3.5 h-3.5 text-accent-cyan-ink animate-pulse motion-reduce:animate-none"
            aria-hidden="true"
          />
          HYPER-KINETIC ROCKET PROPULSION
        </span>
        <span className="text-line-subtle" aria-hidden="true">
          |
        </span>
        <span className="text-status-emerald-ink font-semibold">
          NITROUS THRUST: READY
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-surface/95 border border-line-subtle rounded-xl px-4 py-1.5 shadow-card">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-accent-cyan-ink" aria-hidden="true" />
          <span>SPEED:</span>
          <span className="text-ink-primary font-bold w-16 text-right text-sm tabular-nums">
            {hudData.speed} <span className="text-[10px] text-ink-muted">km/h</span>
          </span>
        </div>
        <span className="text-line-subtle hidden sm:inline" aria-hidden="true">
          |
        </span>
        <div className="flex items-center gap-1.5">
          <Zap
            className={`w-3.5 h-3.5 ${
              isRedline
                ? "text-status-rose animate-ping motion-reduce:animate-none"
                : "text-accent-amber-ink"
            }`}
            aria-hidden="true"
          />
          <span>RPM:</span>
          <span
            className={`font-bold w-14 text-right tabular-nums ${
              isRedline ? "text-status-rose" : "text-ink-primary"
            }`}
          >
            {hudData.rpm}
          </span>
        </div>
        <span className="text-line-subtle hidden sm:inline" aria-hidden="true">
          |
        </span>
        <div className="flex items-center gap-1">
          <span>G-FORCE:</span>
          <span className="text-status-emerald-ink font-bold px-1.5 py-0.5 bg-status-emerald/10 border border-status-emerald/30 rounded text-[11px] tabular-nums">
            {hudData.gForce}G
          </span>
        </div>
        <span className="text-line-subtle hidden sm:inline" aria-hidden="true">
          |
        </span>
        <div className="flex items-center gap-1">
          <span>GEAR:</span>
          <span className="text-ink-primary font-bold px-2 py-0.5 bg-surface-recessed border border-line-subtle rounded text-xs">
            {hudData.gear}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MuscleCarTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const { theme } = useTheme();
  const palette = getThemePalette(theme);
  const paletteRef = useRef(palette);
  const velocityValueRef = useRef(0);
  const startLoopRef = useRef<(() => void) | null>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    paletteRef.current = palette;
  }, [palette]);

  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 18,
    stiffness: 220,
  });

  const carX = useTransform(scrollYProgress, [0, 0.45], ["-18%", "42%"]);
  const carPitch = useTransform(smoothVelocity, (v) =>
    Math.min(Math.max(-v * 0.003, -4), 4)
  );
  const wheelRotate = useTransform(scrollY, (v) => v * 3.5);
  const headLightOpacity = useTransform(scrollY, [10, 120], [0.35, 1]);
  const thrusterFlameScale = useTransform(smoothVelocity, (v) =>
    Math.min(Math.abs(v) / 350, 2.5)
  );

  useMotionValueEvent(smoothVelocity, "change", (latest) => {
    velocityValueRef.current = latest;
    if (
      !shouldReduceMotion &&
      isVisibleRef.current &&
      !document.hidden &&
      Math.abs(latest) > 30
    ) {
      startLoopRef.current?.();
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const syncSize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncSize();
    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);

    const particles: SmokeParticle[] = [];

    const render = () => {
      animId = 0;
      if (shouldReduceMotion || document.hidden || !isVisibleRef.current) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const activePalette = paletteRef.current.muscleCar;
      const absVel = Math.abs(velocityValueRef.current);
      const isAccelerating = absVel > 30;

      if (isAccelerating) {
        const spawnCount = Math.min(Math.floor(absVel / 80) + 2, 7);

        for (let i = 0; i < spawnCount; i++) {
          const originX = width * 0.32;
          const originY = height * 0.68 + (Math.random() - 0.5) * 12;

          particles.push({
            x: originX,
            y: originY,
            vx: -Math.random() * 7 - 4 - absVel * 0.015,
            vy: (Math.random() - 0.5) * 3 - 0.6,
            radius: Math.random() * 10 + 6,
            maxRadius: Math.random() * 45 + 35,
            alpha: 0.65,
            decay: 0.016 + Math.random() * 0.01,
            type: "smoke",
          });

          if (absVel > 120) {
            particles.push({
              x: originX + (Math.random() - 0.5) * 8,
              y: originY + (Math.random() - 0.5) * 6,
              vx: -Math.random() * 14 - 10,
              vy: (Math.random() - 0.5) * 2,
              radius: Math.random() * 8 + 4,
              maxRadius: Math.random() * 18 + 12,
              alpha: 0.95,
              decay: 0.045,
              type: "flame",
            });
          }
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.radius += (p.maxRadius - p.radius) * 0.05;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.x < -100) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.type === "flame") {
          const flameGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius
          );
          flameGrad.addColorStop(
            0,
            activePalette.flameStops[0].replace("ALPHA", p.alpha.toFixed(3))
          );
          flameGrad.addColorStop(
            0.5,
            activePalette.flameStops[1].replace(
              "ALPHA",
              (p.alpha * 0.8).toFixed(3)
            )
          );
          flameGrad.addColorStop(1, activePalette.flameStops[2]);
          ctx.fillStyle = flameGrad;
        } else {
          const smokeGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius
          );
          smokeGrad.addColorStop(
            0,
            activePalette.smokeStops[0].replace(
              "ALPHA",
              (p.alpha * 0.5).toFixed(3)
            )
          );
          smokeGrad.addColorStop(
            0.6,
            activePalette.smokeStops[1].replace(
              "ALPHA",
              (p.alpha * 0.3).toFixed(3)
            )
          );
          smokeGrad.addColorStop(1, activePalette.smokeStops[2]);
          ctx.fillStyle = smokeGrad;
        }

        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0 || isAccelerating) {
        animId = requestAnimationFrame(render);
      }
    };

    const startLoop = () => {
      if (!animId && !shouldReduceMotion && !document.hidden && isVisibleRef.current) {
        animId = requestAnimationFrame(render);
      }
    };

    startLoopRef.current = startLoop;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = Boolean(entry?.isIntersecting);
        if (isVisibleRef.current && (particles.length > 0 || Math.abs(velocityValueRef.current) > 30)) {
          startLoop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(section);

    const handleVisibility = () => {
      if (!document.hidden && isVisibleRef.current && particles.length > 0) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      startLoopRef.current = null;
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [shouldReduceMotion]);

  const carColors = palette.muscleCar;

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll-reactive automotive telemetry showcase"
      className="relative w-full py-16 overflow-hidden border-y border-line-subtle bg-gradient-to-b from-canvas/80 via-surface-recessed/70 to-canvas/90 backdrop-blur-md print:hidden"
    >
      {/* Background Cyber Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:3.5rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      {/* Billowing Particle Smoke Canvas Layer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <TelemetryHud
          smoothVelocity={smoothVelocity}
          reducedMotion={shouldReduceMotion}
        />

        {/* Futuristic Cyber GT Racecar Viewport */}
        <div className="relative h-48 sm:h-56 w-full flex items-center justify-center">
          <motion.div
            style={
              shouldReduceMotion
                ? { x: "0%", rotate: 0 }
                : { x: carX, rotate: carPitch }
            }
            className="relative w-full max-w-3xl flex items-center justify-center"
          >
            {/* Front Headlight Beams */}
            <motion.div
              style={{ opacity: shouldReduceMotion ? 0.5 : headLightOpacity }}
              aria-hidden="true"
              className="absolute right-[-60px] sm:right-[-120px] top-[46px] sm:top-[58px] w-56 sm:w-96 h-20 sm:h-28 pointer-events-none"
            >
              <div className="w-full h-full bg-gradient-to-r from-accent-cyan/50 via-accent-cobalt/25 to-transparent blur-md transform -skew-y-2" />
            </motion.div>

            {/* Rear Nitrous Afterburner Jet Flames */}
            <motion.div
              style={{
                scaleX: shouldReduceMotion ? 0 : thrusterFlameScale,
              }}
              aria-hidden="true"
              className="absolute left-[-45px] sm:left-[-70px] top-[125px] sm:top-[145px] w-24 sm:w-36 h-6 sm:h-8 pointer-events-none origin-right"
            >
              <div className="w-full h-full bg-gradient-to-l from-accent-amber via-accent-crimson to-transparent dark:from-accent-cyan dark:via-accent-cobalt blur-sm rounded-l-full" />
            </motion.div>

            {/* Precision Futuristic Cyber-Racecar SVG */}
            <svg
              viewBox="0 0 840 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ filter: carColors.dropShadow }}
              className="w-full h-full"
            >
              {/* Ground Shadow & Aero Ground Effect Glow */}
              <ellipse
                cx="420"
                cy="225"
                rx="370"
                ry="14"
                fill="url(#groundEffectGlow)"
              />

              {/* HIGH-DOWNFORCE GT RACING REAR WING / SPOILER */}
              <path
                d="M 130 135 L 115 75 L 128 75 L 140 135 Z M 160 135 L 150 75 L 163 75 L 170 135 Z"
                fill={carColors.wingMountFill}
                stroke={carColors.wingMountStroke}
                strokeWidth="1.5"
              />
              <path
                d="M 80 72 C 100 68, 170 65, 210 72 L 205 78 C 165 74, 105 76, 85 80 Z"
                fill="url(#racecarBodyGrad)"
                stroke={carColors.wingBladeStroke}
                strokeWidth="2.5"
                filter="url(#neonGlow)"
              />
              <polygon
                points="75,55 95,55 88,95 68,95"
                fill={carColors.endplateFill}
                stroke={carColors.endplateStroke}
                strokeWidth="2"
              />
              <polygon
                points="200,58 220,58 214,92 194,92"
                fill={carColors.endplateFill}
                stroke={carColors.endplateStroke}
                strokeWidth="2"
              />

              {/* MAIN HYPERCAR CHASSIS BODY */}
              <path
                d="M 70 178 C 75 160, 95 145, 125 136 C 165 125, 215 130, 255 126 C 290 120, 320 85, 385 64 C 455 42, 535 48, 615 65 C 655 74, 690 110, 725 132 L 775 142 C 805 148, 825 165, 825 178 L 828 198 L 760 198 C 750 158, 665 158, 650 198 L 295 198 C 285 158, 200 158, 185 198 L 70 198 Z"
                fill="url(#racecarBodyGrad)"
                stroke={carColors.chassisStroke}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Low-Drag Cockpit Canopy */}
              <path
                d="M 390 70 C 445 50, 520 48, 595 56 C 630 60, 665 86, 685 110 L 395 110 Z"
                fill="url(#cockpitCanopyGrad)"
                stroke={carColors.canopyStroke}
                strokeWidth="2"
              />

              {/* Door Cuts & Side Air Scoops */}
              <path
                d="M 425 112 L 410 188 M 590 112 C 580 145, 585 175, 592 188 M 410 150 C 470 152, 530 145, 585 148 M 260 142 L 290 170"
                stroke={carColors.doorCutStroke}
                strokeWidth="2"
                strokeDasharray="5 3"
                opacity="0.85"
              />

              {/* Widebody Haunch Character Creases */}
              <path
                d="M 125 138 C 190 130, 245 138, 305 122 M 640 128 C 700 134, 760 142, 805 154"
                stroke={carColors.creaseStroke}
                strokeWidth="2.5"
                opacity="0.95"
              />

              {/* Front Ground-Effect Aerodynamic Splitter */}
              <polygon
                points="755,200 835,200 830,192 760,192"
                fill={carColors.splitterFill}
                stroke={carColors.splitterStroke}
                strokeWidth="2"
              />

              {/* Rear Aerodynamic Racing Diffuser */}
              <polygon
                points="70,198 110,198 105,188 65,188"
                fill={carColors.splitterFill}
                stroke={carColors.splitterStroke}
                strokeWidth="2"
              />
              <circle
                cx="85"
                cy="190"
                r="6"
                fill={carColors.exhaustCoreFill}
                stroke={carColors.splitterStroke}
                strokeWidth="2"
              />
              <circle
                cx="102"
                cy="190"
                r="6"
                fill={carColors.exhaustCoreFill}
                stroke={carColors.splitterStroke}
                strokeWidth="2"
              />

              {/* Piercing Laser LED Headlights */}
              <polygon
                points="785,152 822,164 810,172 778,160"
                fill={carColors.headlightFill}
                filter="url(#neonGlow)"
              />

              {/* Laser Red Taillight Strip */}
              <polygon
                points="75,160 108,154 104,166 72,170"
                fill={carColors.taillightFill}
                filter="url(#neonGlow)"
              />

              {/* REAR RACING WHEEL ASSEMBLY */}
              <g transform="translate(240, 198)">
                <circle
                  cx="0"
                  cy="0"
                  r="38"
                  fill={carColors.wheelRimFill}
                  stroke={carColors.wheelRimStroke}
                  strokeWidth="2"
                />
                <rect
                  x="-10"
                  y="-36"
                  width="20"
                  height="15"
                  rx="3"
                  fill={carColors.caliperFill}
                  stroke={carColors.caliperStroke}
                  strokeWidth="1"
                />
                <motion.g
                  style={{ rotate: shouldReduceMotion ? 0 : wheelRotate }}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="44"
                    stroke={carColors.spokePrimary}
                    strokeWidth="4.5"
                    fill="none"
                  />
                  <line
                    x1="-39"
                    y1="0"
                    x2="39"
                    y2="0"
                    stroke={carColors.spokePrimary}
                    strokeWidth="3.5"
                  />
                  <line
                    x1="0"
                    y1="-39"
                    x2="0"
                    y2="39"
                    stroke={carColors.spokePrimary}
                    strokeWidth="3.5"
                  />
                  <line
                    x1="-28"
                    y1="-28"
                    x2="28"
                    y2="28"
                    stroke={carColors.spokeSecondary}
                    strokeWidth="3"
                  />
                  <line
                    x1="28"
                    y1="-28"
                    x2="-28"
                    y2="28"
                    stroke={carColors.spokeSecondary}
                    strokeWidth="3"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill={carColors.exhaustCoreFill}
                    stroke={carColors.spokePrimary}
                    strokeWidth="2.5"
                  />
                </motion.g>
              </g>

              {/* FRONT RACING WHEEL ASSEMBLY */}
              <g transform="translate(705, 198)">
                <circle
                  cx="0"
                  cy="0"
                  r="38"
                  fill={carColors.wheelRimFill}
                  stroke={carColors.wheelRimStroke}
                  strokeWidth="2"
                />
                <rect
                  x="-10"
                  y="-36"
                  width="20"
                  height="15"
                  rx="3"
                  fill={carColors.caliperFill}
                  stroke={carColors.caliperStroke}
                  strokeWidth="1"
                />
                <motion.g
                  style={{ rotate: shouldReduceMotion ? 0 : wheelRotate }}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="44"
                    stroke={carColors.spokePrimary}
                    strokeWidth="4.5"
                    fill="none"
                  />
                  <line
                    x1="-39"
                    y1="0"
                    x2="39"
                    y2="0"
                    stroke={carColors.spokePrimary}
                    strokeWidth="3.5"
                  />
                  <line
                    x1="0"
                    y1="-39"
                    x2="0"
                    y2="39"
                    stroke={carColors.spokePrimary}
                    strokeWidth="3.5"
                  />
                  <line
                    x1="-28"
                    y1="-28"
                    x2="28"
                    y2="28"
                    stroke={carColors.spokeSecondary}
                    strokeWidth="3"
                  />
                  <line
                    x1="28"
                    y1="-28"
                    x2="-28"
                    y2="28"
                    stroke={carColors.spokeSecondary}
                    strokeWidth="3"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill={carColors.exhaustCoreFill}
                    stroke={carColors.spokePrimary}
                    strokeWidth="2.5"
                  />
                </motion.g>
              </g>

              {/* SVG Gradient & Filter Definitions */}
              <defs>
                <linearGradient
                  id="racecarBodyGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="50%"
                >
                  <stop offset="0%" stopColor={carColors.bodyGrad[0]} />
                  <stop offset="40%" stopColor={carColors.bodyGrad[1]} />
                  <stop offset="85%" stopColor={carColors.bodyGrad[2]} />
                  <stop offset="100%" stopColor={carColors.bodyGrad[3]} />
                </linearGradient>
                <linearGradient
                  id="cockpitCanopyGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={carColors.canopyGrad[0]}
                    stopOpacity="0.88"
                  />
                  <stop
                    offset="100%"
                    stopColor={carColors.canopyGrad[1]}
                    stopOpacity="0.38"
                  />
                </linearGradient>
                <radialGradient
                  id="groundEffectGlow"
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop offset="0%" stopColor={carColors.groundGlowStops[0]} />
                  <stop offset="60%" stopColor={carColors.groundGlowStops[1]} />
                  <stop offset="100%" stopColor={carColors.groundGlowStops[2]} />
                </radialGradient>
                <filter
                  id="neonGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* Dynamic Launch Guidance */}
        <div className="text-center mt-3">
          <p className="text-[11px] font-mono text-ink-muted uppercase tracking-widest flex items-center justify-center gap-2">
            <Flame
              className="w-3.5 h-3.5 text-accent-amber-ink animate-bounce motion-reduce:animate-none"
              aria-hidden="true"
            />
            Scroll down to ignite rocket thrusters &amp; blast through mission-critical engineering systems
          </p>
        </div>
      </div>
    </section>
  );
}
