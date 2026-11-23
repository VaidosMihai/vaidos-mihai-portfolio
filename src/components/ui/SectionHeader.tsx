import React from "react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export function SectionBadge({ icon, label, className }: SectionBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-recessed border border-line-subtle text-accent-cyan-ink text-xs font-mono mb-3 shadow-sm",
        className
      )}
    >
      <span aria-hidden="true" className="shrink-0">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  align?: "left" | "center";
  actions?: React.ReactNode;
}

export function SectionHeader({
  icon,
  badge,
  title,
  description,
  align = "left",
  actions,
}: SectionHeaderProps) {
  if (align === "center") {
    return (
      <div className="max-w-3xl mx-auto text-center mb-8">
        <SectionBadge icon={icon} label={badge} />
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-primary mb-3">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-4">
      <div className="min-w-0">
        <SectionBadge icon={icon} label={badge} />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary">
          {title}
        </h2>
        <p className="text-sm text-ink-muted mt-1 max-w-2xl">{description}</p>
      </div>
      {actions ? <div className="w-full xl:w-auto max-w-full">{actions}</div> : null}
    </div>
  );
}
