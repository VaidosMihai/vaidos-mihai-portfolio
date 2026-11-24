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
  engineeringShowcase: {
    gridMinor: string;
    gridMajor: string;
    chassisFill: string;
    chassisStroke: string;
    chassisAccent: string;
    canopyFill: string;
    sonarArc: string;
    visionConeStart: string;
    visionConeEnd: string;
    trajectoryStroke: string;
    busTrace: string;
    packetPrimary: string;
    packetSecondary: string;
    packetSuccess: string;
    packetAmber: string;
    packetCrimson: string;
    cadBeamStroke: string;
    cadSlabGrid: string;
    cadNodeFill: string;
    nodeCardFill: string;
    nodeCardStroke: string;
    nodeLabelText: string;
    nodeSubText: string;
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
    engineeringShowcase: {
      gridMinor: "rgba(56, 189, 248, 0.04)",
      gridMajor: "rgba(56, 189, 248, 0.11)",
      chassisFill: "rgba(17, 24, 39, 0.92)",
      chassisStroke: "#94A3B8",
      chassisAccent: "#38BDF8",
      canopyFill: "rgba(37, 99, 235, 0.28)",
      sonarArc: "rgba(56, 189, 248, ALPHA)",
      visionConeStart: "rgba(56, 189, 248, 0.24)",
      visionConeEnd: "rgba(37, 99, 235, 0)",
      trajectoryStroke: "#10B981",
      busTrace: "rgba(148, 163, 184, 0.25)",
      packetPrimary: "#38BDF8",
      packetSecondary: "#2563EB",
      packetSuccess: "#34D399",
      packetAmber: "#F59E0B",
      packetCrimson: "#F43F5E",
      cadBeamStroke: "rgba(56, 189, 248, ALPHA)",
      cadSlabGrid: "rgba(148, 163, 184, ALPHA)",
      cadNodeFill: "#F59E0B",
      nodeCardFill: "rgba(17, 24, 39, 0.92)",
      nodeCardStroke: "rgba(148, 163, 184, 0.35)",
      nodeLabelText: "#F8FAFC",
      nodeSubText: "#94A3B8",
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
    engineeringShowcase: {
      gridMinor: "rgba(15, 23, 42, 0.035)",
      gridMajor: "rgba(2, 132, 199, 0.11)",
      chassisFill: "rgba(255, 255, 255, 0.96)",
      chassisStroke: "#0F172A",
      chassisAccent: "#0284C7",
      canopyFill: "rgba(2, 132, 199, 0.16)",
      sonarArc: "rgba(2, 132, 199, ALPHA)",
      visionConeStart: "rgba(217, 119, 6, 0.22)",
      visionConeEnd: "rgba(217, 119, 6, 0)",
      trajectoryStroke: "#059669",
      busTrace: "rgba(71, 85, 105, 0.26)",
      packetPrimary: "#0284C7",
      packetSecondary: "#2563EB",
      packetSuccess: "#059669",
      packetAmber: "#D97706",
      packetCrimson: "#DC2626",
      cadBeamStroke: "rgba(37, 99, 235, ALPHA)",
      cadSlabGrid: "rgba(71, 85, 105, ALPHA)",
      cadNodeFill: "#DC2626",
      nodeCardFill: "rgba(255, 255, 255, 0.95)",
      nodeCardStroke: "#CBD5E1",
      nodeLabelText: "#0F172A",
      nodeSubText: "#475569",
    },
  },
};

export function getThemePalette(mode: ThemeMode): CanvasThemePalette {
  return THEME_PALETTES[mode];
}
