import React from "react";
import BackToTopButton from "./BackToTopButton";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line-subtle bg-surface/90 backdrop-blur-md py-10 text-ink-muted text-xs font-mono print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Monospace status */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 text-status-emerald-ink">
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-status-emerald animate-pulse motion-reduce:animate-none"
            />
            <span>SYSTEM_STATUS: HEALTHY</span>
          </div>
          <span className="text-line-subtle" aria-hidden="true">
            |
          </span>
          <span>RENDER: 2D CANVAS + FRAMER MOTION</span>
        </div>

        {/* Center note */}
        <div className="text-center text-ink-muted">
          © 2026 Vaidos Mihai-Iulian. Engineered with Next.js 15, Tailwind CSS, Lenis &amp; Motion.
        </div>

        <BackToTopButton />
      </div>
    </footer>
  );
}
