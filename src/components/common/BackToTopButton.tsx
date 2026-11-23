"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { usePortfolioUI } from "@/components/shell/PortfolioUIProvider";

export default function BackToTopButton() {
  const { scrollToTop } = usePortfolioUI();

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="inline-flex items-center gap-1.5 min-h-[32px] px-3 py-1.5 rounded-lg bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-ink-primary transition-colors cursor-pointer"
    >
      <span>Back to Top</span>
      <ArrowUp className="w-3.5 h-3.5 text-accent-cyan-ink" aria-hidden="true" />
    </button>
  );
}
