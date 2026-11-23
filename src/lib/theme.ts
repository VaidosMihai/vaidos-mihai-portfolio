export type ThemeMode = "dark" | "light";

export const THEME_STORAGE_KEY = "portfolio-theme";
export const DEFAULT_THEME: ThemeMode = "dark";

export interface CanvasThemePalette {
  fluidMesh: {
    baseBg: string;
    radialStops: [string, string, string];
    waveStrokes: [string, string, string];
    particleColors: [string, string];
    canvasOpacityClass: string;
  };
  muscleCar: {
    flameStops: [string, string, string];
    smokeStops: [string, string, string];
    bodyGrad: [string, string, string, string];
    chassisStroke: string;
    wingMountFill: string;
    wingMountStroke: string;
    wingBladeStroke: string;
    endplateFill: string;
    endplateStroke: string;
    canopyGrad: [string, string];
    canopyStroke: string;
    doorCutStroke: string;
    creaseStroke: string;
    splitterFill: string;
    splitterStroke: string;
    exhaustCoreFill: string;
    headlightFill: string;
    taillightFill: string;
    wheelRimFill: string;
    wheelRimStroke: string;
    spokePrimary: string;
    spokeSecondary: string;
    caliperFill: string;
    caliperStroke: string;
    groundGlowStops: [string, string, string];
    dropShadow: string;
  };
}

export const THEME_PALETTES: Record<ThemeMode, CanvasThemePalette> = {
  // 1A: Obsidian & Titanium Slate (Dark Mode)
  dark: {
    fluidMesh: {
      baseBg: "#090D16",
      radialStops: [
        "rgba(37, 99, 235, 0.22)",
        "rgba(56, 189, 248, 0.10)",
        "rgba(9, 13, 22, 0)",
      ],
      waveStrokes: [
        "rgba(56, 189, 248, ALPHA)",
        "rgba(37, 99, 235, ALPHA)",
        "rgba(148, 163, 184, ALPHA)",
      ],
      particleColors: [
        "rgba(56, 189, 248, 0.45)",
        "rgba(37, 99, 235, 0.55)",
      ],
      canvasOpacityClass: "opacity-85",
    },
    muscleCar: {
      flameStops: [
        "rgba(56, 189, 248, ALPHA)",
        "rgba(37, 99, 235, ALPHA)",
        "rgba(9, 13, 22, 0)",
      ],
      smokeStops: [
        "rgba(148, 163, 184, ALPHA)",
        "rgba(22, 32, 51, ALPHA)",
        "rgba(9, 13, 22, 0)",
      ],
      bodyGrad: ["#090D16", "#111827", "#162033", "#2563EB"],
      chassisStroke: "#94A3B8",
      wingMountFill: "#111827",
      wingMountStroke: "#94A3B8",
      wingBladeStroke: "#38BDF8",
      endplateFill: "#2563EB",
      endplateStroke: "#38BDF8",
      canopyGrad: ["#2563EB", "#38BDF8"],
      canopyStroke: "#38BDF8",
      doorCutStroke: "#94A3B8",
      creaseStroke: "#38BDF8",
      splitterFill: "#2563EB",
      splitterStroke: "#38BDF8",
      exhaustCoreFill: "#090D16",
      headlightFill: "#38BDF8",
      taillightFill: "#F43F5E",
      wheelRimFill: "#111827",
      wheelRimStroke: "#94A3B8",
      spokePrimary: "#E2E8F0",
      spokeSecondary: "#94A3B8",
      caliperFill: "#F43F5E",
      caliperStroke: "#F8FAFC",
      groundGlowStops: [
        "rgba(37, 99, 235, 0.70)",
        "rgba(9, 13, 22, 0.35)",
        "rgba(9, 13, 22, 0)",
      ],
      dropShadow: "drop-shadow(0 20px 40px rgba(37, 99, 235, 0.38))",
    },
  },
  // 1B: Automotive Cockpit Light (Warm Amber + Redline Crimson + Cool Cyan on Porcelain Slate)
  light: {
    fluidMesh: {
      baseBg: "#F8FAFC",
      radialStops: [
        "rgba(2, 132, 199, 0.11)",
        "rgba(217, 119, 6, 0.06)",
        "rgba(248, 250, 252, 0)",
      ],
      waveStrokes: [
        "rgba(2, 132, 199, ALPHA)",
        "rgba(217, 119, 6, ALPHA)",
        "rgba(71, 85, 105, ALPHA)",
      ],
      particleColors: [
        "rgba(217, 119, 6, 0.38)",
        "rgba(2, 132, 199, 0.42)",
      ],
      canvasOpacityClass: "opacity-90",
    },
    muscleCar: {
      flameStops: [
        "rgba(245, 158, 11, ALPHA)",
        "rgba(220, 38, 38, ALPHA)",
        "rgba(248, 250, 252, 0)",
      ],
      smokeStops: [
        "rgba(100, 116, 139, ALPHA)",
        "rgba(203, 213, 225, ALPHA)",
        "rgba(248, 250, 252, 0)",
      ],
      bodyGrad: ["#1E293B", "#334155", "#0284C7", "#2563EB"],
      chassisStroke: "#0F172A",
      wingMountFill: "#334155",
      wingMountStroke: "#0F172A",
      wingBladeStroke: "#D97706",
      endplateFill: "#2563EB",
      endplateStroke: "#0F172A",
      canopyGrad: ["#0F172A", "#0284C7"],
      canopyStroke: "#0F172A",
      doorCutStroke: "#CBD5E1",
      creaseStroke: "#D97706",
      splitterFill: "#0F172A",
      splitterStroke: "#D97706",
      exhaustCoreFill: "#0F172A",
      headlightFill: "#D97706",
      taillightFill: "#DC2626",
      wheelRimFill: "#F1F5F9",
      wheelRimStroke: "#0F172A",
      spokePrimary: "#0F172A",
      spokeSecondary: "#475569",
      caliperFill: "#DC2626",
      caliperStroke: "#FFFFFF",
      groundGlowStops: [
        "rgba(15, 23, 42, 0.22)",
        "rgba(203, 213, 225, 0.18)",
        "rgba(248, 250, 252, 0)",
      ],
      dropShadow: "drop-shadow(0 18px 32px rgba(15, 23, 42, 0.18))",
    },
  },
};

export function getThemePalette(mode: ThemeMode): CanvasThemePalette {
  return THEME_PALETTES[mode];
}
