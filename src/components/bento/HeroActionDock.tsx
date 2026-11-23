"use client";

import React from "react";
import {
  Command as CommandIcon,
  Github,
  Linkedin,
  Mail,
  Check,
  AlertCircle,
} from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import { usePortfolioUI } from "@/components/shell/PortfolioUIProvider";
import { useClipboardCopy } from "@/lib/clipboard";
import { getSafeExternalUrl } from "@/lib/url";

import { GITHUB_URL as RAW_GITHUB_URL, LINKEDIN_URL as RAW_LINKEDIN_URL } from "@/lib/site";

const GITHUB_URL = getSafeExternalUrl(RAW_GITHUB_URL) ?? "#";
const LINKEDIN_URL = getSafeExternalUrl(RAW_LINKEDIN_URL) ?? "#";

export default function HeroActionDock() {
  const { openCommandMenu } = usePortfolioUI();
  const { copiedKey, failedKey, copy } = useClipboardCopy<"email">({
    timeoutMs: 2200,
  });

  return (
    <div className="pt-6 border-t border-line-subtle print:hidden">
      <div className="flex flex-wrap items-center gap-2.5">
        <MagneticButton
          onClick={openCommandMenu}
          className="min-h-[38px] px-4 py-2 rounded-xl bg-accent-cobalt hover:bg-accent-cobalt/90 text-white text-xs font-mono font-semibold shadow-card flex items-center gap-2 border border-accent-cobalt/40"
        >
          <CommandIcon className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          <span>Command Menu</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/25 border border-white/25 text-[10px] text-white">
            ⌘K
          </kbd>
        </MagneticButton>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-2 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-xs font-mono text-ink-primary transition-colors"
        >
          <Github className="w-3.5 h-3.5" aria-hidden="true" />
          <span>GitHub</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-2 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-xs font-mono text-ink-primary transition-colors"
        >
          <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
          <span>LinkedIn</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>

        <MagneticButton
          onClick={() => void copy("vaidos.mihaiiulian@gmail.com", "email")}
          className="min-h-[38px] px-3.5 py-2 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-xs font-mono text-ink-primary flex items-center gap-1.5"
        >
          {copiedKey === "email" ? (
            <>
              <Check
                className="w-3.5 h-3.5 text-status-emerald-ink"
                aria-hidden="true"
              />
              <span className="text-status-emerald-ink font-semibold">
                Email Copied!
              </span>
            </>
          ) : failedKey === "email" ? (
            <>
              <AlertCircle
                className="w-3.5 h-3.5 text-status-rose"
                aria-hidden="true"
              />
              <span className="text-status-rose">Copy Blocked</span>
            </>
          ) : (
            <>
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Copy Email</span>
            </>
          )}
        </MagneticButton>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {copiedKey === "email"
          ? "Email address vaidos.mihaiiulian@gmail.com copied to clipboard."
          : failedKey === "email"
            ? "Could not copy email automatically. Please copy vaidos.mihaiiulian@gmail.com manually."
            : ""}
      </div>
    </div>
  );
}
