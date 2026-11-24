"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { Activity, Cpu, Layers, Radio } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getThemePalette } from "@/lib/theme";

export type ShowcaseDomainMode = "auto" | "adas" | "pipeline" | "cad";

interface TelemetryPacket {
  lane: number;
  progress: number;
  speed: number;
  kind: "primary" | "secondary" | "success" | "amber";
}

interface TelemetryMetrics {
  throughputKbs: number;
  activeEchoes: string;
  latencyMs: string;
  activeStage: string;
}

const MODE_OPTIONS: { id: ShowcaseDomainMode; label: string }[] = [
  { id: "auto", label: "Auto Blend" },
  { id: "adas", label: "ADAS Radar" },
  { id: "pipeline", label: "CAN / ETL" },
  { id: "cad", label: "3D CAD Revit" },
];

function computeMetrics(
  rawVelocity: number,
  mode: ShowcaseDomainMode
): TelemetryMetrics {
  const absVel = Math.abs(rawVelocity);
  const throughputKbs = Math.min(10 + Math.round(absVel * 0.24), 480);
  const latencyVal = Math.max(0.8, +(3.2 - Math.min(absVel * 0.002, 2.2)).toFixed(1));
  const activeStage =
    absVel < 25
      ? mode === "cad"
        ? "FEM_MESH_SYNC"
        : mode === "pipeline"
          ? "ETL_STANDBY"
          : mode === "adas"
            ? "USS_SCAN_READY"
            : "IDLE_READY"
      : absVel < 250
        ? "REM_STREAMING"
        : "BURST_VALIDATION";

  return {
    throughputKbs,
    activeEchoes: mode === "cad" ? "6 MODULES" : "12/12 USS",
    latencyMs: `${latencyVal} ms`,
    activeStage,
  };
}

function TelemetryPipelineHud({
  smoothVelocity,
  mode,
  reducedMotion,
}: {
  smoothVelocity: MotionValue<number>;
  mode: ShowcaseDomainMode;
  reducedMotion: boolean;
}) {
  const [metrics, setMetrics] = useState<TelemetryMetrics>(() =>
    computeMetrics(0, mode)
  );
  const lastUpdateRef = useRef(0);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMetrics(computeMetrics(smoothVelocity.get(), mode));
  }, [mode, smoothVelocity]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  useMotionValueEvent(smoothVelocity, "change", (latest) => {
    if (reducedMotion) return;

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);

    const next = computeMetrics(latest, mode);
    const now = performance.now();

    if (Math.abs(latest) < 20 || now - lastUpdateRef.current > 70) {
      lastUpdateRef.current = now;
      setMetrics((prev) =>
        prev.throughputKbs === next.throughputKbs &&
        prev.activeEchoes === next.activeEchoes &&
        prev.latencyMs === next.latencyMs &&
        prev.activeStage === next.activeStage
          ? prev
          : next
      );
    }

    settleTimerRef.current = setTimeout(() => {
      setMetrics(computeMetrics(smoothVelocity.get(), mode));
    }, 120);
  });

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-surface/95 border border-line-subtle rounded-xl px-4 py-1.5 shadow-card text-xs font-mono text-ink-muted">
      <div className="flex items-center gap-1.5">
        <Radio
          className="w-3.5 h-3.5 text-accent-cyan-ink"
          aria-hidden="true"
        />
        <span>STREAM:</span>
        <span className="text-ink-primary font-bold w-20 text-right tabular-nums">
          {metrics.throughputKbs}{" "}
          <span className="text-[10px] text-ink-muted">KB/s</span>
        </span>
      </div>
      <span className="text-line-subtle hidden sm:inline" aria-hidden="true">
        |
      </span>
      <div className="flex items-center gap-1.5">
        <Cpu
          className="w-3.5 h-3.5 text-accent-amber-ink"
          aria-hidden="true"
        />
        <span>ARRAY:</span>
        <span className="text-ink-primary font-bold tabular-nums">
          {metrics.activeEchoes}
        </span>
      </div>
      <span className="text-line-subtle hidden sm:inline" aria-hidden="true">
        |
      </span>
      <div className="flex items-center gap-1.5">
        <span>LATENCY:</span>
        <span className="text-status-emerald-ink font-bold px-1.5 py-0.5 bg-status-emerald/10 border border-status-emerald/30 rounded text-[11px] tabular-nums">
          {metrics.latencyMs}
        </span>
      </div>
      <span className="text-line-subtle hidden md:inline" aria-hidden="true">
        |
      </span>
      <div className="hidden md:flex items-center gap-1">
        <span>GATE:</span>
        <span className="text-accent-cyan-ink font-bold px-2 py-0.5 bg-surface-recessed border border-line-subtle rounded text-[11px]">
          {metrics.activeStage}
        </span>
      </div>
    </div>
  );
}

export default function EngineeringShowcaseTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<ShowcaseDomainMode>("auto");

  const shouldReduceMotion = Boolean(useReducedMotion());
  const { theme } = useTheme();
  const palette = getThemePalette(theme);

  const paletteRef = useRef(palette);
  const modeRef = useRef<ShowcaseDomainMode>(mode);
  const velocityRef = useRef(0);
  const progressRef = useRef(0);
  const isVisibleRef = useRef(true);
  const drawOnceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    paletteRef.current = palette;
    drawOnceRef.current?.();
  }, [palette]);

  useEffect(() => {
    modeRef.current = mode;
    drawOnceRef.current?.();
  }, [mode]);

  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 20,
    stiffness: 200,
  });

  useMotionValueEvent(smoothVelocity, "change", (latest) => {
    velocityRef.current = latest;
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    progressRef.current = latest;
    if (shouldReduceMotion) {
      drawOnceRef.current?.();
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
    const resizeObserver = new ResizeObserver(() => {
      syncSize();
      if (shouldReduceMotion) drawFrame(0);
    });
    resizeObserver.observe(canvas);

    const packets: TelemetryPacket[] = [
      { lane: 0, progress: 0.08, speed: 0.0042, kind: "primary" },
      { lane: 0, progress: 0.56, speed: 0.0042, kind: "success" },
      { lane: 1, progress: 0.25, speed: 0.0054, kind: "amber" },
      { lane: 1, progress: 0.78, speed: 0.0054, kind: "primary" },
      { lane: 2, progress: 0.15, speed: 0.0038, kind: "secondary" },
      { lane: 2, progress: 0.64, speed: 0.0038, kind: "success" },
    ];

    let phase = 0;

    const drawRoundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    const drawFrame = (dtFactor: number) => {
      const colors = paletteRef.current.engineeringShowcase;
      const activeMode = modeRef.current;
      const absVel = Math.abs(velocityRef.current);
      const velocityBoost = Math.min(absVel / 320, 3.2);
      const scrollNorm = progressRef.current;

      if (dtFactor > 0) {
        phase += (0.025 + velocityBoost * 0.04) * dtFactor;
      }

      ctx.clearRect(0, 0, width, height);

      // Compute blend weights per domain (1 = full emphasis, 0.32 = contextual layer)
      let adasAlpha = 1;
      let pipeAlpha = 1;
      let cadAlpha = 1;

      if (activeMode === "adas") {
        adasAlpha = 1;
        pipeAlpha = 0.28;
        cadAlpha = 0.25;
      } else if (activeMode === "pipeline") {
        adasAlpha = 0.32;
        pipeAlpha = 1;
        cadAlpha = 0.28;
      } else if (activeMode === "cad") {
        adasAlpha = 0.26;
        pipeAlpha = 0.35;
        cadAlpha = 1;
      } else {
        // Auto Blend responds subtly to scroll progress while keeping all 3 visible
        adasAlpha = 0.85 + Math.sin(scrollNorm * Math.PI * 2) * 0.15;
        pipeAlpha = 0.88 + Math.cos(scrollNorm * Math.PI * 2) * 0.12;
        cadAlpha = 0.72 + Math.sin(scrollNorm * Math.PI * 2 + 1.2) * 0.28;
      }

      const isCompact = width < 720;

      // -----------------------------------------------------------
      // Background Precision CAD / Coordinate Grid
      // -----------------------------------------------------------
      const minorStep = 24;
      const majorStep = 96;
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.gridMinor;
      ctx.beginPath();
      for (let gx = 0; gx < width; gx += minorStep) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = 0; gy < height; gy += minorStep) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      ctx.strokeStyle = colors.gridMajor;
      ctx.beginPath();
      for (let gx = 0; gx < width; gx += majorStep) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = 0; gy < height; gy += majorStep) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      // -----------------------------------------------------------
      // 3) Dual-Domain 3D CAD Structural Wireframe (Graitec / Revit)
      // -----------------------------------------------------------
      ctx.save();
      ctx.globalAlpha = cadAlpha;
      const cadCenterX = isCompact ? width * 0.73 : width * 0.83;
      const cadCenterY = height * 0.52;
      const boxW = isCompact ? 78 : 116;
      const boxH = isCompact ? 54 : 74;
      const depthX = isCompact ? 28 : 42;
      const depthY = (isCompact ? -16 : -24) + Math.sin(phase * 0.45) * 4;

      // Isometric Slab FEM mesh grid
      ctx.strokeStyle = colors.cadSlabGrid.replace("ALPHA", "0.35");
      ctx.lineWidth = 1;
      const cols = 4;
      const rows = 3;
      for (let r = 0; r <= rows; r++) {
        const t = r / rows;
        const x1 = cadCenterX - boxW / 2 + depthX * t;
        const y1 = cadCenterY - boxH / 2 + depthY * t;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + boxW, y1);
        ctx.stroke();
      }
      for (let c = 0; c <= cols; c++) {
        const t = c / cols;
        const x1 = cadCenterX - boxW / 2 + boxW * t;
        const y1 = cadCenterY - boxH / 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + depthX, y1 + depthY);
        ctx.stroke();
      }

      // Structural Columns & Beams wireframe cube
      const xL = cadCenterX - boxW / 2;
      const xR = cadCenterX + boxW / 2;
      const yT = cadCenterY - boxH / 2;
      const yB = cadCenterY + boxH / 2;

      ctx.strokeStyle = colors.cadBeamStroke.replace("ALPHA", "0.75");
      ctx.lineWidth = 1.6;
      ctx.strokeRect(xL, yT, boxW, boxH);
      ctx.strokeRect(xL + depthX, yT + depthY, boxW, boxH);

      const corners = [
        [xL, yT],
        [xR, yT],
        [xL, yB],
        [xR, yB],
      ] as const;
      ctx.beginPath();
      for (const [cx, cy] of corners) {
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + depthX, cy + depthY);
      }
      ctx.stroke();

      // Structural Beam/Column stress nodes
      ctx.fillStyle = colors.cadNodeFill;
      for (const [cx, cy] of corners) {
        ctx.beginPath();
        ctx.arc(cx, cy, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // CAD Label badge
      ctx.fillStyle = colors.nodeSubText;
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        isCompact ? "3D CAD REVIT" : "ADVANCE DESIGN 3D CAD",
        cadCenterX + depthX * 0.4,
        yB + 22
      );
      ctx.restore();

      // -----------------------------------------------------------
      // 1) ADAS Radar & REM Sensor-Fusion Blueprint (Top-Down)
      // -----------------------------------------------------------
      ctx.save();
      ctx.globalAlpha = adasAlpha;
      const carCx = isCompact ? width * 0.25 : width * 0.19;
      const carCy = height * 0.52;
      const carLen = isCompact ? 104 : 138;
      const carWid = isCompact ? 50 : 62;
      const carLeft = carCx - carLen / 2;
      const carTop = carCy - carWid / 2;

      // Dashed 200m Trajectory & Centimeter Lane Boundaries (Mobileye REM / BMW Maneuver)
      const curveOffset = Math.sin(phase * 0.35 + scrollNorm * 6) * 14;
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = colors.trajectoryStroke;
      ctx.beginPath();
      ctx.moveTo(carLeft + carLen, carCy);
      ctx.bezierCurveTo(
        carLeft + carLen + 65,
        carCy,
        carLeft + carLen + 110,
        carCy + curveOffset,
        carLeft + carLen + (isCompact ? 115 : 175),
        carCy + curveOffset
      );
      ctx.stroke();
      ctx.restore();

      // Mobileye REM Forward Vision Cone
      const coneLen = isCompact ? 95 : 150;
      const coneSpread = isCompact ? 34 : 46;
      const coneGrad = ctx.createLinearGradient(
        carLeft + carLen - 12,
        carCy,
        carLeft + carLen + coneLen,
        carCy
      );
      coneGrad.addColorStop(0, colors.visionConeStart);
      coneGrad.addColorStop(1, colors.visionConeEnd);
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(carLeft + carLen - 10, carCy);
      ctx.lineTo(carLeft + carLen + coneLen, carCy - coneSpread);
      ctx.lineTo(carLeft + carLen + coneLen, carCy + coneSpread);
      ctx.closePath();
      ctx.fill();

      // 12 Ultrasonic Sensor (USS) Pulsing Sonar Arcs around Chassis
      for (let ring = 0; ring < 3; ring++) {
        const ringPhase = (phase * 0.55 + ring * 0.33) % 1;
        const arcAlpha = (1 - ringPhase) * 0.55;
        const arcRadius = 18 + ringPhase * 34;
        ctx.strokeStyle = colors.sonarArc.replace("ALPHA", arcAlpha.toFixed(3));
        ctx.lineWidth = 1.3;

        // Front & Rear USS cones
        ctx.beginPath();
        ctx.arc(carLeft + carLen, carCy, arcRadius, -0.55, 0.55);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(carLeft, carCy, arcRadius * 0.85, Math.PI - 0.55, Math.PI + 0.55);
        ctx.stroke();

        // Top & Bottom Lateral Parking Ultrasonic pulses
        ctx.beginPath();
        ctx.arc(carCx, carTop, arcRadius * 0.72, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(carCx, carTop + carWid, arcRadius * 0.72, Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();
      }

      // Top-Down Engineering Vehicle Chassis Wireframe
      drawRoundRect(carLeft, carTop, carLen, carWid, 14);
      ctx.fillStyle = colors.chassisFill;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = colors.chassisStroke;
      ctx.stroke();

      // Windshield / Roof Glass Silhouette
      drawRoundRect(
        carLeft + carLen * 0.28,
        carTop + 8,
        carLen * 0.44,
        carWid - 16,
        7
      );
      ctx.fillStyle = colors.canopyFill;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = colors.chassisAccent;
      ctx.stroke();

      // Sensor Anchor Dots (USS / Surround Cameras)
      const sensorAnchors = [
        [carLeft + carLen, carCy - 14],
        [carLeft + carLen, carCy],
        [carLeft + carLen, carCy + 14],
        [carLeft, carCy - 12],
        [carLeft, carCy + 12],
        [carCx, carTop],
        [carCx, carTop + carWid],
      ] as const;
      ctx.fillStyle = colors.chassisAccent;
      for (const [sx, sy] of sensorAnchors) {
        ctx.beginPath();
        ctx.arc(sx, sy, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = colors.nodeSubText;
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("BMW USS + CARIAD REM", carCx, carTop + carWid + 24);
      ctx.restore();

      // -----------------------------------------------------------
      // 2) CAN-Bus & Python/Pandas ETL Signal Stream
      // -----------------------------------------------------------
      ctx.save();
      ctx.globalAlpha = pipeAlpha;
      const pipeStartX = carLeft + carLen + 26;
      const pipeEndX = isCompact
        ? width - 22
        : cadCenterX - boxW / 2 - 22;
      const laneOffsets = [-34, 0, 34];

      if (pipeEndX > pipeStartX + 40) {
        for (const offsetY of laneOffsets) {
          const ly = carCy + offsetY;
          ctx.strokeStyle = colors.busTrace;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(pipeStartX, ly);
          ctx.lineTo(pipeEndX, ly);
          ctx.stroke();
        }

        // Update and draw flowing telemetry packets
        for (const pkt of packets) {
          if (dtFactor > 0) {
            pkt.progress =
              (pkt.progress + pkt.speed * (1 + velocityBoost * 2.4) * dtFactor) %
              1;
          }
          const ly = carCy + (laneOffsets[pkt.lane] ?? 0);
          const px = pipeStartX + pkt.progress * (pipeEndX - pipeStartX);

          const pktColor =
            pkt.kind === "primary"
              ? colors.packetPrimary
              : pkt.kind === "success"
                ? colors.packetSuccess
                : pkt.kind === "amber"
                  ? colors.packetAmber
                  : colors.packetSecondary;

          // Signal trail
          ctx.strokeStyle = pktColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(Math.max(pipeStartX, px - 18), ly);
          ctx.lineTo(px, ly);
          ctx.stroke();

          // Signal head node
          ctx.fillStyle = pktColor;
          ctx.beginPath();
          ctx.arc(px, ly, 3.6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mid-pipeline Processing Gate Badges (Desktop / Tablet)
        if (!isCompact) {
          const midX = (pipeStartX + pipeEndX) / 2;
          const gates = [
            { yOffset: -34, title: "CANoe 0x3A2", sub: "100% Protocol" },
            { yOffset: 0, title: "Pandas ETL", sub: "-30% Workload" },
            { yOffset: 34, title: "C++ / GTest", sub: ">90% Coverage" },
          ];

          for (const g of gates) {
            const bw = 112;
            const bh = 24;
            const bx = midX - bw / 2;
            const by = carCy + g.yOffset - bh / 2;
            drawRoundRect(bx, by, bw, bh, 6);
            ctx.fillStyle = colors.nodeCardFill;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = colors.nodeCardStroke;
            ctx.stroke();

            ctx.fillStyle = colors.nodeLabelText;
            ctx.font = "700 10px monospace";
            ctx.textAlign = "center";
            ctx.fillText(g.title, midX, carCy + g.yOffset + 3.5);
          }
        }
      }
      ctx.restore();
    };

    drawOnceRef.current = () => {
      drawFrame(0);
    };

    const renderLoop = () => {
      animId = 0;
      if (shouldReduceMotion || document.hidden || !isVisibleRef.current) {
        drawFrame(0);
        return;
      }
      drawFrame(1);
      animId = requestAnimationFrame(renderLoop);
    };

    const startOrStop = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
      if (shouldReduceMotion) {
        drawFrame(0);
        return;
      }
      if (!document.hidden && isVisibleRef.current) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = Boolean(entries[0]?.isIntersecting);
        startOrStop();
      },
      { threshold: 0.05 }
    );
    observer.observe(section);

    document.addEventListener("visibilitychange", startOrStop);
    startOrStop();

    return () => {
      drawOnceRef.current = null;
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", startOrStop);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [shouldReduceMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Multi-domain automotive telemetry and 3D CAD simulation showcase"
      className="relative w-full py-12 sm:py-16 overflow-hidden border-y border-line-subtle bg-gradient-to-b from-canvas/85 via-surface-recessed/70 to-canvas/90 backdrop-blur-md print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Top Bar: Identity Pill, Domain Mode Switcher & Live Telemetry */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2.5 bg-surface/95 border border-line-subtle rounded-full px-3.5 py-1.5 shadow-card text-xs font-mono">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-status-emerald opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-emerald" />
              </span>
              <span className="text-ink-primary font-semibold flex items-center gap-1.5">
                <Activity
                  className="w-3.5 h-3.5 text-accent-cyan-ink"
                  aria-hidden="true"
                />
                MULTI-DOMAIN SIMULATION
              </span>
            </div>

            <div
              role="group"
              aria-label="Simulation layer focus"
              className="flex flex-wrap items-center gap-1 bg-surface-recessed p-1 rounded-xl border border-line-subtle"
            >
              {MODE_OPTIONS.map((opt) => {
                const isActive = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setMode(opt.id)}
                    className={`min-h-[28px] px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      isActive
                        ? "bg-accent-cobalt text-white font-semibold shadow-sm"
                        : "text-ink-muted hover:text-ink-primary hover:bg-surface"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <TelemetryPipelineHud
            smoothVelocity={smoothVelocity}
            mode={mode}
            reducedMotion={shouldReduceMotion}
          />
        </div>

        {/* Unified Multi-Domain Interactive Blueprint Canvas */}
        <div className="relative h-56 sm:h-64 w-full rounded-2xl border border-line-subtle bg-surface/80 shadow-card overflow-hidden">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="w-full h-full block pointer-events-none"
          />

          {/* Compact Corner Domain Callouts */}
          <div
            aria-hidden="true"
            className="hidden sm:flex items-center justify-between px-4 py-2 absolute top-0 inset-x-0 pointer-events-none text-[10px] font-mono text-ink-muted"
          >
            <span>01 // ADAS SENSOR FUSION &amp; REM ROADBOOK</span>
            <span>02 // CANOE + PYTHON ETL STREAM</span>
            <span>03 // REVIT / ADVANCE DESIGN 3D FEM</span>
          </div>
        </div>

        {/* Bottom Caption */}
        <div className="text-center mt-4">
          <p className="text-[11px] font-mono text-ink-muted uppercase tracking-wider flex items-center justify-center gap-2">
            <Layers
              className="w-3.5 h-3.5 text-accent-cyan-ink shrink-0"
              aria-hidden="true"
            />
            Scroll to accelerate CAN-Bus telemetry, sweep ADAS ultrasonic arcs &amp; sync 3D CAD structural nodes
          </p>
        </div>
      </div>
    </section>
  );
}
