"use client";

import React, { useEffect, useState } from "react";
import { Command as CommandIcon, Github, Linkedin, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { usePortfolioUI } from "@/components/shell/PortfolioUIProvider";
import type { SectionId } from "@/lib/filters";
import { getSafeExternalUrl } from "@/lib/url";

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "schematics", label: "Schematics" },
  { id: "experience", label: "Experience" },
  { id: "telemetry", label: "Simulator" },
  { id: "skills", label: "Skills Matrix" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

import { GITHUB_URL as RAW_GITHUB_URL, LINKEDIN_URL as RAW_LINKEDIN_URL } from "@/lib/site";

const GITHUB_URL = getSafeExternalUrl(RAW_GITHUB_URL) ?? "#";
const LINKEDIN_URL = getSafeExternalUrl(RAW_LINKEDIN_URL) ?? "#";

export default function Header() {
  const { openCommandMenu, navigateTo, scrollToTop } = usePortfolioUI();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (id: SectionId) => {
    setMobileMenuOpen(false);
    navigateTo(id);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[var(--header-bg)] backdrop-blur-xl border-b border-line-subtle transition-colors print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Monogram / Brand Identity */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            scrollToTop();
          }}
          className="flex items-center gap-3 cursor-pointer group text-left rounded-xl py-1 pr-2"
        >
          <span
            aria-hidden="true"
            className="w-9 h-9 rounded-xl bg-accent-cobalt border border-line-strong flex items-center justify-center font-mono font-bold text-white shadow-sm group-hover:scale-105 transition-transform"
          >
            VM
          </span>
          <span className="sr-only sm:hidden">Vaidos Mihai — Scroll to top</span>
          <span className="hidden sm:block">
            <span className="text-sm font-bold text-ink-primary tracking-wide block leading-none">
              VAIDOS MIHAI
            </span>
            <span className="text-[10px] font-mono text-ink-muted tracking-wider block mt-1">
              SOFTWARE ENGINEER (DATA, BACKEND &amp; SYSTEMS)
            </span>
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-1 text-xs font-mono text-ink-muted"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="min-h-[32px] px-2.5 py-1.5 rounded-lg hover:text-ink-primary hover:bg-surface-recessed transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle, Command Menu Launcher, Socials & Mobile Menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openCommandMenu();
            }}
            className="flex items-center gap-2 min-h-[34px] px-3 py-1.5 rounded-lg bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-xs font-mono text-ink-primary transition-colors shadow-sm cursor-pointer"
          >
            <CommandIcon
              className="w-3.5 h-3.5 text-accent-cobalt dark:text-accent-cyan"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line-subtle text-[10px] text-ink-muted">
              ⌘K
            </kbd>
          </button>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in a new tab)"
            className="hidden sm:inline-flex items-center justify-center min-h-[34px] min-w-[34px] p-2 rounded-lg bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-ink-muted hover:text-ink-primary transition-colors"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
          </a>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in a new tab)"
            className="hidden sm:inline-flex items-center justify-center min-h-[34px] min-w-[34px] p-2 rounded-lg bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-ink-muted hover:text-ink-primary transition-colors"
          >
            <Linkedin className="w-4 h-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden inline-flex items-center justify-center min-h-[34px] min-w-[34px] p-2 rounded-lg bg-surface-recessed hover:bg-surface border border-line-subtle text-ink-primary transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile Primary"
          className="lg:hidden border-t border-line-subtle bg-surface/95 backdrop-blur-xl px-4 py-3 animate-slide-down"
        >
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="min-h-[38px] px-3 py-2 rounded-lg bg-surface-recessed border border-line-subtle text-left text-ink-primary hover:border-line-strong transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-line-hairline sm:hidden">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[36px] px-3 py-1.5 rounded-lg bg-surface-recessed border border-line-subtle text-xs font-mono text-ink-primary"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GitHub</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[36px] px-3 py-1.5 rounded-lg bg-surface-recessed border border-line-subtle text-xs font-mono text-ink-primary"
            >
              <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>LinkedIn</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
