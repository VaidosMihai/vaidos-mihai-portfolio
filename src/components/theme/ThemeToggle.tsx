"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();

  const ariaLabel = mounted
    ? theme === "dark"
      ? "Switch to Light Automotive Cockpit theme"
      : "Switch to Dark Obsidian Slate theme"
    : "Switch color theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      aria-pressed={mounted ? theme === "light" : undefined}
      title={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 min-h-[34px] px-2.5 py-1.5 rounded-lg bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-xs font-mono text-ink-primary transition-colors cursor-pointer",
        className
      )}
    >
      <Sun
        className="hidden dark:block w-4 h-4 text-accent-amber"
        aria-hidden="true"
      />
      <Moon
        className="block dark:hidden w-4 h-4 text-accent-cobalt"
        aria-hidden="true"
      />
      {showLabel && (
        <>
          <span className="hidden dark:inline text-[11px] font-mono text-ink-secondary">
            Light
          </span>
          <span className="inline dark:hidden text-[11px] font-mono text-ink-secondary">
            Dark
          </span>
        </>
      )}
    </button>
  );
}
