import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas text-ink-secondary flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-2xl border border-line-subtle bg-surface p-8 shadow-elevated text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-accent-cobalt/15 border border-accent-cobalt/35 text-accent-cyan-ink flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-accent-cyan-ink">
            404 // Route Not Found
          </p>
          <h1 className="text-2xl font-bold text-ink-primary">
            Requested endpoint does not exist
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            This portfolio is structured as an interactive single-page engineering cockpit. Return to the main view to explore projects and schematics.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-cobalt hover:bg-accent-cobalt/90 text-white text-xs font-mono font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Return to Portfolio</span>
        </Link>
      </div>
    </div>
  );
}
