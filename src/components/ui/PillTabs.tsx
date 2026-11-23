"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export interface PillTabItem {
  value: string;
  label: string;
}

interface PillTabsProps {
  items: PillTabItem[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  mode?: "tabs" | "filter";
  prefixIcon?: React.ReactNode;
  idPrefix?: string;
  className?: string;
}

export function PillTabs({
  items,
  value,
  onChange,
  ariaLabel,
  mode = "filter",
  prefixIcon,
  idPrefix = "tab",
  className,
}: PillTabsProps) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (mode !== "tabs") return;
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    else if (e.key === "ArrowLeft")
      nextIndex = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = items.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      const target = items[nextIndex];
      if (target) {
        onChange(target.value);
        buttonsRef.current[nextIndex]?.focus();
      }
    }
  };

  return (
    <div
      role={mode === "tabs" ? "tablist" : "group"}
      aria-label={ariaLabel}
      className={cn(
        "flex flex-wrap items-center gap-1.5 bg-surface-recessed/90 p-1.5 rounded-xl border border-line-subtle backdrop-blur-md",
        className
      )}
    >
      {prefixIcon ? (
        <span aria-hidden="true" className="text-ink-muted ml-1 mr-0.5 shrink-0">
          {prefixIcon}
        </span>
      ) : null}

      {items.map((item, index) => {
        const isActive = value === item.value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              buttonsRef.current[index] = el;
            }}
            type="button"
            id={mode === "tabs" ? `${idPrefix}-tab-${item.value}` : undefined}
            role={mode === "tabs" ? "tab" : undefined}
            aria-selected={mode === "tabs" ? isActive : undefined}
            aria-controls={
              mode === "tabs" ? `${idPrefix}-panel-${item.value}` : undefined
            }
            aria-pressed={mode === "filter" ? isActive : undefined}
            tabIndex={mode === "tabs" ? (isActive ? 0 : -1) : undefined}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => onChange(item.value)}
            className={cn(
              "min-h-[30px] px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer",
              isActive
                ? "bg-accent-cobalt text-white shadow-sm font-semibold"
                : "text-ink-muted hover:text-ink-primary hover:bg-surface"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
