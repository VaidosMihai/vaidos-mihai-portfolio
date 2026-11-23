"use client";

import React from "react";
import { usePortfolioUI } from "@/components/shell/PortfolioUIProvider";

export default function HeroTimelineLink() {
  const { navigateTo } = usePortfolioUI();

  return (
    <button
      type="button"
      onClick={() => navigateTo("experience")}
      className="min-h-[28px] px-2 py-1 rounded-lg text-accent-cyan-ink hover:underline font-medium flex items-center gap-1 cursor-pointer print:hidden"
    >
      View Experience Timeline →
    </button>
  );
}
