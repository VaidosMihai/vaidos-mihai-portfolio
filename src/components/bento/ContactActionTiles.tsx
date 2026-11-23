"use client";

import React from "react";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Copy,
  Check,
  AlertCircle,
  FileDown,
} from "lucide-react";
import { useClipboardCopy } from "@/lib/clipboard";
import { getSafeExternalUrl } from "@/lib/url";

import { GITHUB_URL as RAW_GITHUB_URL, LINKEDIN_URL as RAW_LINKEDIN_URL } from "@/lib/site";

const GITHUB_URL = getSafeExternalUrl(RAW_GITHUB_URL) ?? "#";
const LINKEDIN_URL = getSafeExternalUrl(RAW_LINKEDIN_URL) ?? "#";

export default function ContactActionTiles() {
  const { copiedKey, failedKey, copy } = useClipboardCopy<"email" | "phone">({
    timeoutMs: 2200,
  });

  return (
    <>
      {/* Contact Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
        {/* Email Tile */}
        <button
          type="button"
          onClick={() => void copy("vaidos.mihaiiulian@gmail.com", "email")}
          className="w-full text-left p-4 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong transition-all cursor-pointer group flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-lg bg-accent-cobalt/15 border border-accent-cobalt/35 text-accent-cyan-ink shrink-0">
              <Mail className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-ink-muted block">
                Direct Email (Click to copy)
              </span>
              <span className="text-sm font-mono font-medium text-ink-primary group-hover:text-accent-cyan-ink break-all">
                vaidos.mihaiiulian@gmail.com
              </span>
            </div>
          </div>

          <div className="text-ink-muted group-hover:text-accent-cyan-ink p-1 shrink-0">
            {copiedKey === "email" ? (
              <span className="text-xs font-mono text-status-emerald-ink flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" aria-hidden="true" /> Copied!
              </span>
            ) : failedKey === "email" ? (
              <span className="text-xs font-mono text-status-rose flex items-center gap-1">
                <AlertCircle className="w-4 h-4" aria-hidden="true" /> Blocked
              </span>
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
          </div>
        </button>

        {/* Phone Tile */}
        <button
          type="button"
          onClick={() => void copy("+40 768 194 193", "phone")}
          className="w-full text-left p-4 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong transition-all cursor-pointer group flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-lg bg-accent-cobalt/15 border border-accent-cobalt/35 text-accent-cyan-ink shrink-0">
              <Phone className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-ink-muted block">
                Phone / WhatsApp (Click to copy)
              </span>
              <span className="text-sm font-mono font-medium text-ink-primary group-hover:text-accent-cyan-ink">
                +40 768 194 193
              </span>
            </div>
          </div>

          <div className="text-ink-muted group-hover:text-accent-cyan-ink p-1 shrink-0">
            {copiedKey === "phone" ? (
              <span className="text-xs font-mono text-status-emerald-ink flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" aria-hidden="true" /> Copied!
              </span>
            ) : failedKey === "phone" ? (
              <span className="text-xs font-mono text-status-rose flex items-center gap-1">
                <AlertCircle className="w-4 h-4" aria-hidden="true" /> Blocked
              </span>
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
          </div>
        </button>
      </div>

      {/* Live region for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {copiedKey === "email"
          ? "Email address copied to clipboard."
          : copiedKey === "phone"
            ? "Phone number copied to clipboard."
            : failedKey
              ? "Clipboard copy was blocked by the browser."
              : ""}
      </div>

      {/* External Links Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-xs font-mono text-ink-primary transition-colors"
        >
          <Github className="w-4 h-4" aria-hidden="true" />
          <span>github.com/VaidosMihai</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-xs font-mono text-ink-primary transition-colors"
        >
          <Linkedin className="w-4 h-4" aria-hidden="true" />
          <span>linkedin.com/in/mihai-vaidos</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-accent-cobalt hover:bg-blue-700 border border-accent-cobalt/40 text-xs font-mono font-semibold text-white shadow-card transition-colors cursor-pointer"
        >
          <FileDown className="w-4 h-4" aria-hidden="true" />
          <span>Print / Save Resume</span>
        </button>
      </div>
    </>
  );
}
