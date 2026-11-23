import React from "react";
import { cn } from "@/lib/utils";

type StatusTone = "emerald" | "amber" | "crimson" | "cobalt";

interface StatusPillProps {
  tone?: StatusTone;
  pulse?: boolean;
  label: React.ReactNode;
  className?: string;
}

const TONE_CLASSES: Record<StatusTone, { wrapper: string; dot: string }> = {
  emerald: {
    wrapper:
      "bg-status-emerald/10 border-status-emerald/35 text-status-emerald-ink",
    dot: "bg-status-emerald",
  },
  amber: {
    wrapper:
      "bg-accent-amber/10 border-accent-amber/35 text-accent-amber-ink",
    dot: "bg-accent-amber",
  },
  crimson: {
    wrapper:
      "bg-accent-crimson/10 border-accent-crimson/35 text-status-rose",
    dot: "bg-accent-crimson",
  },
  cobalt: {
    wrapper:
      "bg-accent-cobalt/15 border-accent-cobalt/35 text-accent-cyan-ink",
    dot: "bg-accent-cobalt",
  },
};

export function StatusPill({
  tone = "emerald",
  pulse = false,
  label,
  className,
}: StatusPillProps) {
  const styles = TONE_CLASSES[tone];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono backdrop-blur-md",
        styles.wrapper,
        className
      )}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {pulse && (
          <span
            className={cn(
              "animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full opacity-75",
              styles.dot
            )}
          />
        )}
        <span
          className={cn("relative inline-flex rounded-full h-2 w-2", styles.dot)}
        />
      </span>
      <span>{label}</span>
    </div>
  );
}
