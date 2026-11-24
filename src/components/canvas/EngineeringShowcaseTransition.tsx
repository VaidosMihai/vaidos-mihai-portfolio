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
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Scissors,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getThemePalette } from "@/lib/theme";
import {
  PROJECT_SCENES,
  renderProjectScene,
  type ProjectSceneId,
  type ProjectSceneMeta,
} from "./projectScenes";
import {
  GRAITEC_MODULES,
  GRAITEC_NODE_SPECS,
  computeAutoShowcaseState,
  type GraitecCadRenderState,
  type GraitecModuleId,
  type GraitecTreeNodeId,
} from "./graitecCadScene";
import GraitecMvvmInspector from "./GraitecMvvmInspector";

const EMPTY_GRAITEC_MODULES: Record<GraitecModuleId, boolean> = {
  footing: false,
  column: false,
  beam: false,
  slab: false,
  wall: false,
  masonry: false,
};

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
  const [isAnimating, setIsAnimating] = useState(true);
  const { theme } = useTheme();
  const palette = getThemePalette(theme);

  const paletteRef = useRef(palette);
  const sceneIdRef = useRef<ProjectSceneId>(currentScene?.id ?? "cariad");
  const velocityRef = useRef(0);
  const progressRef = useRef(0);
  const phaseRef = useRef(0);
  const isVisibleRef = useRef(true);
  const drawOnceRef = useRef<(() => void) | null>(null);

  // Interactive Scene 04 (Graitec 3D CAD + Pure MVVM) state
  const [graitecMode, setGraitecMode] = useState<"auto" | "manual">("auto");
  const [graitecSelection, setGraitecSelection] =
    useState<GraitecTreeNodeId>("wall");
  const [builtModules, setBuiltModules] = useState<
    Record<GraitecModuleId, boolean>
  >(EMPTY_GRAITEC_MODULES);
  const [perforationActive, setPerforationActive] = useState(false);

  const graitecAnimRef = useRef<{
    mode: "auto" | "manual";
    activeSelection: GraitecTreeNodeId;
    builtModules: Record<GraitecModuleId, boolean>;
    moduleStartMs: Record<GraitecModuleId, number>;
    perforationActive: boolean;
    perfStartMs: number;
    autoPhaseOffset: number;
  }>({
    mode: "auto",
    activeSelection: "wall",
    builtModules: { ...EMPTY_GRAITEC_MODULES },
    moduleStartMs: {
      footing: 0,
      column: 0,
      beam: 0,
      slab: 0,
      wall: 0,
      masonry: 0,
    },
    perforationActive: false,
    perfStartMs: 0,
    autoPhaseOffset: 0,
  });

  useEffect(() => {
    paletteRef.current = palette;
    drawOnceRef.current?.();
  }, [palette]);

  useEffect(() => {
    if (currentScene) {
      sceneIdRef.current = currentScene.id;
      if (currentScene.id === "graitec-advance") {
        // 2A: start fresh auto Build Full Frame demo when switching onto Graitec tab
        graitecAnimRef.current.mode = "auto";
        graitecAnimRef.current.autoPhaseOffset = phaseRef.current;
        setGraitecMode("auto");
        setGraitecSelection("footing");
        setBuiltModules({ ...EMPTY_GRAITEC_MODULES });
        setPerforationActive(false);
      }
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

    const drawFrame = (dtFactor: number) => {
      const absVel = Math.abs(velocityRef.current);
      const velocityBoost = Math.min(absVel / 320, 3.2);
      if (dtFactor > 0) {
        phaseRef.current += (0.025 + velocityBoost * 0.04) * dtFactor;
      }

      let graitecState: GraitecCadRenderState | undefined;
      if (sceneIdRef.current === "graitec-advance") {
        const gRef = graitecAnimRef.current;
        if (gRef.mode === "auto") {
          const demoPhase = shouldReduceMotion
            ? 0
            : Math.max(0.01, phaseRef.current - gRef.autoPhaseOffset);
          graitecState = computeAutoShowcaseState(demoPhase, velocityBoost);
        } else {
          const now = performance.now();
          const instant = !isAnimating || shouldReduceMotion;
          const moduleProgress = {
            footing: gRef.builtModules.footing
              ? instant
                ? 1
                : Math.min((now - gRef.moduleStartMs.footing) / 850, 1)
              : 0,
            column: gRef.builtModules.column
              ? instant
                ? 1
                : Math.min((now - gRef.moduleStartMs.column) / 850, 1)
              : 0,
            beam: gRef.builtModules.beam
              ? instant
                ? 1
                : Math.min((now - gRef.moduleStartMs.beam) / 850, 1)
              : 0,
            slab: gRef.builtModules.slab
              ? instant
                ? 1
                : Math.min((now - gRef.moduleStartMs.slab) / 850, 1)
              : 0,
            wall: gRef.builtModules.wall
              ? instant
                ? 1
                : Math.min((now - gRef.moduleStartMs.wall) / 850, 1)
              : 0,
            masonry: gRef.builtModules.masonry
              ? instant
                ? 1
                : Math.min((now - gRef.moduleStartMs.masonry) / 850, 1)
              : 0,
          };
          const perfProg = gRef.perforationActive
            ? instant
              ? 1
              : Math.min((now - gRef.perfStartMs) / 1400, 1)
            : 0;
          const elapsedSinceSync = now - gRef.perfStartMs - 1000;
          const notifyPulse =
            gRef.perforationActive &&
            elapsedSinceSync >= 0 &&
            elapsedSinceSync < 700
              ? 1 - elapsedSinceSync / 700
              : 0;

          graitecState = {
            mode: "manual",
            activeSelection: gRef.activeSelection,
            moduleProgress,
            perforationProgress: perfProg,
            notifyPulse,
          };
        }
      }

      renderProjectScene(sceneIdRef.current, {
        ctx,
        width,
        height,
        phase: phaseRef.current,
        scrollNorm: progressRef.current,
        velocityBoost,
        colors: paletteRef.current.engineeringShowcase,
        graitecState,
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
      if (!isAnimating || document.hidden || !isVisibleRef.current) {
        drawFrame(0);
      }
    });
    resizeObserver.observe(canvas);

    drawOnceRef.current = () => {
      drawFrame(0);
    };

    const renderLoop = () => {
      animId = 0;
      if (!isAnimating || document.hidden || !isVisibleRef.current) {
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
      if (!isAnimating) {
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
  }, [isAnimating, shouldReduceMotion]);

  if (!currentScene) return null;

  const isGraitecScene = currentScene.id === "graitec-advance";

  const handleToggleGraitecModule = (modId: GraitecModuleId) => {
    const now = performance.now();
    const prevRef = graitecAnimRef.current;
    const baseBuilt =
      prevRef.mode === "auto"
        ? { ...EMPTY_GRAITEC_MODULES }
        : { ...prevRef.builtModules };
    const nextVal = !baseBuilt[modId];
    baseBuilt[modId] = nextVal;

    const nextStarts = { ...prevRef.moduleStartMs };
    if (nextVal) {
      nextStarts[modId] = now;
    }

    const nextPerf =
      modId === "wall" && !nextVal ? false : prevRef.mode === "auto" ? false : prevRef.perforationActive;

    graitecAnimRef.current = {
      ...prevRef,
      mode: "manual",
      activeSelection: modId,
      builtModules: baseBuilt,
      moduleStartMs: nextStarts,
      perforationActive: nextPerf,
    };

    setGraitecMode("manual");
    setGraitecSelection(modId);
    setBuiltModules(baseBuilt);
    setPerforationActive(nextPerf);
    drawOnceRef.current?.();
  };

  const handleTriggerPerforation = () => {
    const now = performance.now();
    const prevRef = graitecAnimRef.current;
    const baseBuilt =
      prevRef.mode === "auto"
        ? { ...EMPTY_GRAITEC_MODULES }
        : { ...prevRef.builtModules };

    // Ensure a wall panel exists to perforate
    if (!baseBuilt.wall && !baseBuilt.masonry) {
      baseBuilt.wall = true;
      prevRef.moduleStartMs.wall = now - 650;
    }

    graitecAnimRef.current = {
      ...prevRef,
      mode: "manual",
      activeSelection: "perforation",
      builtModules: baseBuilt,
      moduleStartMs: { ...prevRef.moduleStartMs },
      perforationActive: true,
      perfStartMs: now,
    };

    setGraitecMode("manual");
    setGraitecSelection("perforation");
    setBuiltModules(baseBuilt);
    setPerforationActive(true);
    drawOnceRef.current?.();
  };

  const handleBuildFullFrame = () => {
    graitecAnimRef.current.mode = "auto";
    graitecAnimRef.current.autoPhaseOffset = phaseRef.current;
    setIsAnimating(true);
    setGraitecMode("auto");
    setGraitecSelection("footing");
    setBuiltModules({ ...EMPTY_GRAITEC_MODULES });
    setPerforationActive(false);
    drawOnceRef.current?.();
  };

  const handleResetGraitec = () => {
    graitecAnimRef.current = {
      mode: "manual",
      activeSelection: "footing",
      builtModules: { ...EMPTY_GRAITEC_MODULES },
      moduleStartMs: {
        footing: 0,
        column: 0,
        beam: 0,
        slab: 0,
        wall: 0,
        masonry: 0,
      },
      perforationActive: false,
      perfStartMs: 0,
      autoPhaseOffset: phaseRef.current,
    };

    setGraitecMode("manual");
    setGraitecSelection("footing");
    setBuiltModules({ ...EMPTY_GRAITEC_MODULES });
    setPerforationActive(false);
    drawOnceRef.current?.();
  };

  const handleSelectTreeNode = (id: GraitecTreeNodeId) => {
    if (id === "perforation") {
      handleTriggerPerforation();
    } else {
      handleToggleGraitecModule(id);
    }
  };

  const graitecStatusAnnouncement = isGraitecScene
    ? graitecMode === "auto"
      ? "Graitec 3D CAD: Automatic sequential assembly demo running across Footing, Column, Beam, Slab, Wall, Masonry, and 3D Wall Perforation."
      : `Graitec 3D CAD: ${GRAITEC_NODE_SPECS[graitecSelection].label} active (${GRAITEC_NODE_SPECS[graitecSelection].specValue}).`
    : "";

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
      id="showcase"
      ref={sectionRef}
      aria-label="Project-specific interactive engineering simulations"
      className="relative w-full py-12 sm:py-16 overflow-hidden border-y border-line-subtle bg-gradient-to-b from-canvas/85 via-surface-recessed/70 to-canvas/90 backdrop-blur-md print:hidden scroll-mt-20"
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
                aria-label={isAnimating ? "Pause animation" : "Play animation"}
                onClick={() => setIsAnimating((prev) => !prev)}
                className="inline-flex items-center gap-1 min-h-[28px] px-2 rounded-lg bg-surface border border-line-subtle hover:border-line-strong text-[11px] font-mono text-ink-muted hover:text-ink-primary transition-colors cursor-pointer"
              >
                {isAnimating ? (
                  <>
                    <Pause className="w-3 h-3" aria-hidden="true" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-status-emerald-ink" aria-hidden="true" />
                    <span>Play</span>
                  </>
                )}
              </button>
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

          {/* Scene 04 Interactive Structural Module Toolbar */}
          {isGraitecScene && (
            <div
              role="toolbar"
              aria-label="Build Graitec 3D CAD structural modules"
              className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-2.5 border-b border-line-hairline bg-surface/75"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {GRAITEC_MODULES.map((modId) => {
                  const meta = GRAITEC_NODE_SPECS[modId];
                  const isBuilt = builtModules[modId];
                  const isFocused =
                    graitecMode === "manual" && graitecSelection === modId;

                  return (
                    <button
                      key={modId}
                      type="button"
                      aria-pressed={isBuilt}
                      onClick={() => handleToggleGraitecModule(modId)}
                      className={`min-h-[28px] px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors border cursor-pointer ${
                        isFocused && isBuilt
                          ? "bg-accent-cobalt border-accent-cobalt text-white font-semibold"
                          : isBuilt
                            ? "bg-status-emerald/15 border-status-emerald/40 text-status-emerald-ink font-semibold hover:bg-status-emerald/25"
                            : "bg-surface-recessed border-line-subtle text-ink-secondary hover:text-ink-primary hover:border-line-strong"
                      }`}
                    >
                      {meta.label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  aria-pressed={perforationActive}
                  onClick={handleTriggerPerforation}
                  className={`inline-flex items-center gap-1 min-h-[28px] px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors border cursor-pointer ${
                    perforationActive
                      ? "bg-accent-amber border-accent-amber text-white font-semibold"
                      : "bg-accent-amber/10 border-accent-amber/40 text-accent-amber-ink hover:bg-accent-amber/20 font-semibold"
                  }`}
                >
                  <Scissors className="w-3 h-3" aria-hidden="true" />
                  <span>Perforate Wall</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-pressed={graitecMode === "auto"}
                  onClick={handleBuildFullFrame}
                  className={`inline-flex items-center gap-1 min-h-[28px] px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors border cursor-pointer ${
                    graitecMode === "auto"
                      ? "bg-accent-cobalt/15 border-accent-cobalt/45 text-accent-cyan-ink font-semibold"
                      : "bg-surface border-line-subtle text-ink-secondary hover:text-ink-primary hover:border-line-strong"
                  }`}
                >
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  <span>Build Full Frame</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetGraitec}
                  className="inline-flex items-center gap-1 min-h-[28px] px-2.5 py-1 rounded-lg text-[11px] font-mono bg-surface border border-line-subtle text-ink-muted hover:text-ink-primary hover:border-line-strong transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          )}

          {/* Stage: Split-View (3D Canvas + WPF MVVM Inspector) for Graitec, Full Canvas for Scenes 01-03 */}
          <div
            className={
              isGraitecScene
                ? "grid grid-cols-1 md:grid-cols-[1fr_336px] lg:grid-cols-[1fr_372px]"
                : "w-full"
            }
          >
            <div
              className={`relative w-full ${
                isGraitecScene ? "h-64 sm:h-[316px]" : "h-64 sm:h-[290px]"
              }`}
            >
              <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="w-full h-full block pointer-events-none"
              />
            </div>

            {isGraitecScene && (
              <GraitecMvvmInspector
                mode={graitecMode}
                activeSelection={graitecSelection}
                builtModules={builtModules}
                perforationActive={perforationActive}
                onSelectNode={handleSelectTreeNode}
              />
            )}
          </div>

          <div role="status" aria-live="polite" className="sr-only">
            {graitecStatusAnnouncement}
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
