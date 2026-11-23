import React from "react";
import { cn } from "@/lib/utils";

interface TechTagProps {
  children: React.ReactNode;
  className?: string;
}

export function TechTag({ children, className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg bg-surface-recessed border border-line-subtle text-xs font-mono text-ink-secondary hover:border-line-strong hover:text-ink-primary transition-colors",
        className
      )}
    >
      {children}
    </span>
  );
}
