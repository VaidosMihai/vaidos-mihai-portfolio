import { cn } from "./utils";

export type CardSurfaceVariant = "default" | "elevated" | "recessed" | "interactive";

export function cardSurfaceClasses(
  variant: CardSurfaceVariant = "default",
  extra?: string
): string {
  const base: Record<CardSurfaceVariant, string> = {
    default:
      "rounded-2xl border border-line-subtle bg-surface/90 backdrop-blur-xl shadow-card transition-colors duration-300",
    elevated:
      "rounded-2xl border border-line-subtle bg-gradient-to-br from-surface via-surface to-surface-recessed/70 backdrop-blur-xl shadow-elevated transition-colors duration-300",
    recessed:
      "rounded-xl border border-line-subtle bg-surface-recessed/85 transition-colors duration-200",
    interactive:
      "rounded-xl border border-line-subtle bg-surface-recessed/75 hover:bg-surface hover:border-line-strong transition-all duration-200",
  };
  return cn(base[variant], extra);
}
