"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portfolio application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-canvas text-ink-secondary flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full rounded-2xl border border-line-subtle bg-surface p-8 shadow-elevated text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-accent-crimson/10 border border-accent-crimson/35 text-status-rose flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-status-rose">
            Diagnostic Fault // Runtime Boundary
          </p>
          <h1 className="text-2xl font-bold text-ink-primary">
            Something interrupted this view
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            An unexpected client exception was safely isolated. You can retry initializing the view or return to the portfolio overview.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-ink-muted pt-1">
              Reference ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-cobalt hover:bg-accent-cobalt/90 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Retry View</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle text-xs font-mono text-ink-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
