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
import { Activity, ChevronLeft, ChevronRight, Radio } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getThemePalette } from "@/lib/theme";
import {
  PROJECT_SCENES,
  renderProjectScene,
  type ProjectSceneId,
  type ProjectSceneMeta,
} from "./projectScenes";

function ProjectTelemetryHud({
  scene,
  smoothVelocity,
  reducedMotion,
}: {
  scene: ProjectSceneMeta;
  smoothVelocity: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const [rate, setRate] = useState(scene.baseRate);
  const lastUpdateRef = useRef(0);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setRate(scene.baseRate);
  }, [scene]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  useMotionValueEvent(smoothVelocity, "change", (latest) => {
    if (reducedMotion) return;

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);

    const absVel = Math.abs(latest);
    const boost = Math.round(Math.min(absVel * 0.14, scene.baseRate * 3.5));
    const nextRate = absVel < 20 ? scene.baseRate : scene.baseRate + boost;
    const now = performance.now();

    if (absVel < 20 || now - lastUpdateRef.current > 70) {
      lastUpdateRef.current = now;
      setRate((prev) => (prev === nextRate ? prev : nextRate));
    }

    settleTimerRef.current = setTimeout(() => {
      const settledVel = Math.abs(smoothVelocity.get());
      setRate(
        settledVel < 20
          ? scene.baseRate
          : scene.baseRate +
              Math.round(Math.min(settledVel * 0.14, scene.baseRate * 3.5))
      );
    }, 120);
  });

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-surface/95 border border-line-subtle rounded-xl px-4 py-1.5 shadow-card text-xs font-mono text-ink-muted">
      <div className="flex items-center gap-1.5">
        <Radio className="w-3.5 h-3.5 text-accent-cyan-ink" aria-hidden="true" />
        <span>{scene.scrollBoostLabel}:</span>
        <span className="text-ink-primary font-bold tabular-nums">
          {rate} <span className="text-[10px] text-ink-muted">{scene.unit}</span>
        </span>
      </div>

      {scene.staticHud.map((item) => (
        <React.Fragment key={item.label}>
          <span className="text-line-subtle hidden sm:inline" aria-hidden="true">
            |
          </span>
          <div className="flex items-center gap-1.5">
            <span>{item.label}:</span>
            <span
              className={
                item.tone === "emerald"
                  ? "text-status-emerald-ink font-bold px-1.5 py-0.5 bg-status-emerald/10 border border-status-emerald/30 rounded text-[11px]"
                  : item.tone === "cyan"
                    ? "text-accent-cyan-ink font-bold text-[11px]"
                    : "text-ink-primary font-bold text-[11px]"
              }
            >
              {item.value}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function EngineeringShowcaseTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tabButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentScene = PROJECT_SCENES[activeIndex] ?? PROJECT_SCENES[0];
  const shouldReduceMotion = Boolean(useReducedMotion());
  const { theme } = useTheme();
  const palette = getThemePalette(theme);

  const paletteRef = useRef(palette);
  const sceneIdRef = useRef<ProjectSceneId>(currentScene?.id ?? "cariad");
  const velocityRef = useRef(0);
  const progressRef = useRef(0);
  const isVisibleRef = useRef(true);
  const drawOnceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    paletteRef.current = palette;
    drawOnceRef.current?.();
  }, [palette]);

  useEffect(() => {
    if (currentScene) {
      sceneIdRef.current = currentScene.id;
      drawOnceRef.current?.();
    }
  }, [currentScene]);

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

    let phase = 0;

    const drawFrame = (dtFactor: number) => {
      const absVel = Math.abs(velocityRef.current);
      const velocityBoost = Math.min(absVel / 320, 3.2);
      if (dtFactor > 0) {
        phase += (0.025 + velocityBoost * 0.04) * dtFactor;
      }

      renderProjectScene(sceneIdRef.current, {
        ctx,
        width,
        height,
        phase,
        scrollNorm: progressRef.current,
        velocityBoost,
        colors: paletteRef.current.engineeringShowcase,
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
      if (shouldReduceMotion || document.hidden || !isVisibleRef.current) {
        drawFrame(0);
      }
    });
    resizeObserver.observe(canvas);

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

  if (!currentScene) return null;

  const handleTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % PROJECT_SCENES.length;
    else if (e.key === "ArrowLeft")
      nextIdx = (idx - 1 + PROJECT_SCENES.length) % PROJECT_SCENES.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = PROJECT_SCENES.length - 1;

    if (nextIdx !== null) {
      e.preventDefault();
      setActiveIndex(nextIdx);
      tabButtonsRef.current[nextIdx]?.focus();
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Project-specific interactive engineering simulations"
      className="relative w-full py-12 sm:py-16 overflow-hidden border-y border-line-subtle bg-gradient-to-b from-canvas/85 via-surface-recessed/70 to-canvas/90 backdrop-blur-md print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Top Bar: Separate Project Scene Tabs & Dedicated Telemetry HUD */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-surface/95 border border-line-subtle rounded-full px-3.5 py-1.5 shadow-card text-xs font-mono">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-status-emerald opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-emerald" />
              </span>
              <span className="text-ink-primary font-semibold flex items-center gap-1.5">
                <Activity
                  className="w-3.5 h-3.5 text-accent-cyan-ink"
                  aria-hidden="true"
                />
                PROJECT VISUALS
              </span>
            </div>

            <div
              role="tablist"
              aria-label="Select individual project simulation"
              className="flex flex-wrap items-center gap-1 bg-surface-recessed p-1 rounded-xl border border-line-subtle"
            >
              {PROJECT_SCENES.map((scene, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={scene.id}
                    ref={(el) => {
                      tabButtonsRef.current[idx] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`showcase-tab-${scene.id}`}
                    aria-selected={isActive}
                    aria-controls={
                      isActive ? `showcase-panel-${scene.id}` : undefined
                    }
                    tabIndex={isActive ? 0 : -1}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`min-h-[30px] px-3 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      isActive
                        ? "bg-accent-cobalt text-white font-semibold shadow-sm"
                        : "text-ink-muted hover:text-ink-primary hover:bg-surface"
                    }`}
                  >
                    {scene.tabLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <ProjectTelemetryHud
            scene={currentScene}
            smoothVelocity={smoothVelocity}
            reducedMotion={shouldReduceMotion}
          />
        </div>

        {/* Dedicated Single-Project Stage */}
        <div
          role="tabpanel"
          id={`showcase-panel-${currentScene.id}`}
          aria-labelledby={`showcase-tab-${currentScene.id}`}
          tabIndex={0}
          className="relative rounded-2xl border border-line-subtle bg-surface/85 shadow-card overflow-hidden focus:outline-none"
        >
          {/* Scene Title Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-2.5 border-b border-line-hairline bg-surface-recessed/70">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-[11px] font-mono font-semibold text-accent-cyan-ink">
                {currentScene.badge}
              </span>
              <span className="text-line-subtle hidden sm:inline" aria-hidden="true">
                •
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-ink-primary truncate">
                {currentScene.title}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous project simulation"
                onClick={() =>
                  setActiveIndex(
                    (prev) =>
                      (prev - 1 + PROJECT_SCENES.length) % PROJECT_SCENES.length
                  )
                }
                className="inline-flex items-center justify-center min-h-[28px] min-w-[28px] rounded-lg bg-surface border border-line-subtle hover:border-line-strong text-ink-muted hover:text-ink-primary transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="text-[11px] font-mono text-ink-muted px-1 tabular-nums">
                {activeIndex + 1}/{PROJECT_SCENES.length}
              </span>
              <button
                type="button"
                aria-label="Next project simulation"
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % PROJECT_SCENES.length)
                }
                className="inline-flex items-center justify-center min-h-[28px] min-w-[28px] rounded-lg bg-surface border border-line-subtle hover:border-line-strong text-ink-muted hover:text-ink-primary transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* 2D Canvas Stage */}
          <div className="relative h-56 sm:h-64 w-full">
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="w-full h-full block pointer-events-none"
            />
          </div>

          {/* Bottom Technical Caption */}
          <div className="px-4 sm:px-5 py-2.5 border-t border-line-hairline bg-surface-recessed/50 text-center">
            <p className="text-[11px] font-mono text-ink-muted">
              {currentScene.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
