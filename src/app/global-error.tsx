"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#090D16] text-[#E2E8F0] flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full rounded-2xl border border-slate-700/60 bg-[#111827] p-8 text-center space-y-4">
          <p className="text-xs font-mono uppercase tracking-wider text-rose-400">
            System Recovery
          </p>
          <h1 className="text-2xl font-bold text-white">
            Application recovery required
          </h1>
          <p className="text-sm text-slate-300">
            The portfolio encountered a root layout error. Reloading restores normal operation.
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
