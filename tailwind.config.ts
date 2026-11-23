import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--rgb-canvas) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--rgb-surface) / <alpha-value>)",
          elevated: "rgb(var(--rgb-elevated) / <alpha-value>)",
          recessed: "rgb(var(--rgb-recessed) / <alpha-value>)",
          terminal: "rgb(var(--rgb-terminal-bg) / <alpha-value>)",
        },
        ink: {
          primary: "rgb(var(--rgb-ink-primary) / <alpha-value>)",
          secondary: "rgb(var(--rgb-ink-secondary) / <alpha-value>)",
          muted: "rgb(var(--rgb-ink-muted) / <alpha-value>)",
          terminal: "rgb(var(--rgb-terminal-ink) / <alpha-value>)",
        },
        accent: {
          cobalt: "rgb(var(--rgb-accent-cobalt) / <alpha-value>)",
          cyan: "rgb(var(--rgb-accent-cyan) / <alpha-value>)",
          "cyan-ink": "rgb(var(--rgb-accent-cyan-ink) / <alpha-value>)",
          amber: "rgb(var(--rgb-accent-amber) / <alpha-value>)",
          "amber-ink": "rgb(var(--rgb-accent-amber-ink) / <alpha-value>)",
          crimson: "rgb(var(--rgb-accent-crimson) / <alpha-value>)",
        },
        status: {
          emerald: "rgb(var(--rgb-status-emerald) / <alpha-value>)",
          "emerald-ink": "rgb(var(--rgb-status-emerald-ink) / <alpha-value>)",
          amber: "rgb(var(--rgb-status-amber) / <alpha-value>)",
          rose: "rgb(var(--rgb-status-rose) / <alpha-value>)",
        },
        line: {
          subtle: "var(--border-subtle)",
          hairline: "var(--border-hairline)",
          strong: "var(--border-strong)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "car-glow": "carGlow 2s ease-in-out infinite alternate",
        "fade-in": "fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "modal-in": "modalIn 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 180ms ease-out",
      },
      keyframes: {
        carGlow: {
          "0%": {
            filter: "drop-shadow(0 0 8px rgb(var(--rgb-accent-cobalt) / 0.45))",
          },
          "100%": {
            filter: "drop-shadow(0 0 20px rgb(var(--rgb-accent-cyan) / 0.75))",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        modalIn: {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
