"use client";

import React, { useCallback, useEffect } from "react";
import { flushSync } from "react-dom";
import { Command } from "cmdk";
import {
  Search,
  Briefcase,
  Terminal,
  Cpu,
  GraduationCap,
  Mail,
  Phone,
  Github,
  Linkedin,
  FileDown,
  Layers,
  Code2,
  Copy,
  Check,
  AlertCircle,
  X,
  SunMoon,
  Moon,
  Sun,
} from "lucide-react";
import ModalShell from "@/components/ui/ModalShell";
import { useTheme } from "@/components/theme/ThemeProvider";
import { usePortfolioUI } from "@/components/shell/PortfolioUIProvider";
import { useClipboardCopy } from "@/lib/clipboard";
import { COMMAND_MENU_FILTERS, type SectionId } from "@/lib/filters";
import { getSafeExternalUrl } from "@/lib/url";

import { GITHUB_URL as RAW_GITHUB_URL, LINKEDIN_URL as RAW_LINKEDIN_URL } from "@/lib/site";

const GITHUB_URL = getSafeExternalUrl(RAW_GITHUB_URL) ?? "#";
const LINKEDIN_URL = getSafeExternalUrl(RAW_LINKEDIN_URL) ?? "#";

export default function CommandMenu() {
  const {
    isCommandMenuOpen,
    closeCommandMenu,
    toggleCommandMenu,
    navigateTo,
    setActiveTechFilter,
  } = usePortfolioUI();
  const { theme, setTheme, toggleTheme } = useTheme();

  const {
    copiedKey,
    failedKey,
    copy,
    clearState: clearCopyState,
  } = useClipboardCopy({
    timeoutMs: 1200,
    onAfterCopy: closeCommandMenu,
  });

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        // Prevent stacking CommandMenu on top of an already open modal dialog (e.g. SchematicModal)
        if (!isCommandMenuOpen && document.querySelector('[role="dialog"]')) {
          return;
        }
        e.preventDefault();
        toggleCommandMenu();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isCommandMenuOpen, toggleCommandMenu]);

  useEffect(() => {
    clearCopyState();
  }, [isCommandMenuOpen, clearCopyState]);

  const handleClose = useCallback(() => {
    clearCopyState();
    closeCommandMenu();
  }, [clearCopyState, closeCommandMenu]);

  const handleSelectAction = (callback: () => void) => {
    callback();
    handleClose();
  };

  const openExternal = (url: string) => {
    const safeUrl = getSafeExternalUrl(url);
    if (!safeUrl) return;
    const anchor = document.createElement("a");
    anchor.href = safeUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();
    handleClose();
  };

  const navigateSection = (id: SectionId) => {
    handleSelectAction(() => navigateTo(id));
  };

  return (
    <ModalShell
      isOpen={isCommandMenuOpen}
      onClose={handleClose}
      ariaLabel="Command menu"
      containerClassName="items-start pt-16 sm:pt-24"
      panelClassName="max-w-2xl p-0 overflow-hidden"
    >
      <Command className="w-full text-ink-secondary">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-line-subtle bg-surface-recessed/70 focus-within:ring-2 focus-within:ring-inset focus-within:ring-accent-cobalt">
          <Search
            className="w-5 h-5 text-ink-muted mr-3 shrink-0"
            aria-hidden="true"
          />
          <Command.Input
            data-autofocus
            placeholder="Type a command or search sections, tech, theme, or actions..."
            className="w-full bg-transparent text-sm sm:text-base text-ink-primary placeholder:text-ink-muted focus:outline-none"
          />
          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-line-subtle text-ink-muted">
              ESC to close
            </span>
            <button
              type="button"
              onClick={handleClose}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                }
              }}
              className="inline-flex items-center justify-center min-h-[28px] min-w-[28px] text-ink-muted hover:text-ink-primary p-1 rounded-lg hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close command menu"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Clipboard Feedback Live Region */}
        <div role="status" aria-live="polite">
          {copiedKey && (
            <div className="px-4 py-2 bg-status-emerald/15 border-b border-status-emerald/30 flex items-center gap-1.5 text-xs text-status-emerald-ink font-mono">
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{copiedKey} copied to clipboard!</span>
            </div>
          )}
          {failedKey && (
            <div className="px-4 py-2 bg-accent-crimson/15 border-b border-accent-crimson/30 flex items-center gap-1.5 text-xs text-status-rose font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Clipboard permission blocked — select and copy manually.</span>
            </div>
          )}
        </div>

        {/* Command List Container */}
        <Command.List
          data-lenis-prevent="true"
          className="max-h-80 overflow-y-auto p-2 scrollbar-cockpit"
        >
          <Command.Empty className="p-6 text-center text-sm text-ink-muted">
            No matching commands found.
          </Command.Empty>

          {/* Appearance & Theme */}
          <Command.Group
            heading="Appearance & Theme"
            className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted"
          >
            <Command.Item
              value="Toggle Color Theme Dark Light Obsidian Automotive"
              onSelect={() => handleSelectAction(toggleTheme)}
              className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <SunMoon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Switch Theme (Current:{" "}
                  {theme === "dark" ? "Obsidian Slate" : "Automotive Light"})
                </span>
              </div>
              <span className="text-xs font-mono text-ink-muted group-data-[selected=true]:text-white">
                Toggle
              </span>
            </Command.Item>

            <Command.Item
              value="Dark Theme Obsidian Titanium Slate"
              onSelect={() => handleSelectAction(() => setTheme("dark"))}
              className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Obsidian &amp; Titanium Slate (Dark Mode)</span>
              </div>
              {theme === "dark" && (
                <span className="text-[11px] font-mono">Active</span>
              )}
            </Command.Item>

            <Command.Item
              value="Light Theme Automotive Cockpit White"
              onSelect={() => handleSelectAction(() => setTheme("light"))}
              className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Automotive Cockpit (Light Mode)</span>
              </div>
              {theme === "light" && (
                <span className="text-[11px] font-mono">Active</span>
              )}
            </Command.Item>
          </Command.Group>

          {/* Quick Actions */}
          <Command.Group
            heading="Quick Actions"
            className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted"
          >
            <Command.Item
              value="Copy Email Address vaidos.mihaiiulian@gmail.com"
              onSelect={() => void copy("vaidos.mihaiiulian@gmail.com", "Email")}
              className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Copy Email Address</span>
                <span className="hidden sm:inline text-xs font-mono text-ink-muted group-data-[selected=true]:text-white">
                  vaidos.mihaiiulian@gmail.com
                </span>
              </div>
              <Copy
                className="w-3.5 h-3.5 text-ink-muted group-data-[selected=true]:text-white"
                aria-hidden="true"
              />
            </Command.Item>

            <Command.Item
              value="Copy Phone Number +40 768 194 193"
              onSelect={() => void copy("+40 768 194 193", "Phone Number")}
              className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Copy Phone Number</span>
                <span className="hidden sm:inline text-xs font-mono text-ink-muted group-data-[selected=true]:text-white">
                  +40 768 194 193
                </span>
              </div>
              <Copy
                className="w-3.5 h-3.5 text-ink-muted group-data-[selected=true]:text-white"
                aria-hidden="true"
              />
            </Command.Item>

            <Command.Item
              value="Print Save Resume PDF"
              onSelect={() => {
                flushSync(handleClose);
                window.print();
              }}
              className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileDown className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Print / Save Resume as PDF</span>
              </div>
              <span className="text-xs font-mono text-ink-muted group-data-[selected=true]:text-white">
                Print
              </span>
            </Command.Item>

            <Command.Item
              value="Open GitHub Repository Projects"
              onSelect={() => openExternal(GITHUB_URL)}
              className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Open GitHub Repository &amp; Projects</span>
              </div>
              <span className="hidden sm:inline text-xs font-mono text-ink-muted group-data-[selected=true]:text-white">
                github.com/VaidosMihai
              </span>
            </Command.Item>

            <Command.Item
              value="Open LinkedIn Profile"
              onSelect={() => openExternal(LINKEDIN_URL)}
              className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Linkedin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Open LinkedIn Profile</span>
              </div>
              <span className="hidden sm:inline text-xs font-mono text-ink-muted group-data-[selected=true]:text-white">
                linkedin.com/in/mihai-vaidos
              </span>
            </Command.Item>
          </Command.Group>

          {/* Navigation Group */}
          <Command.Group
            heading="Jump to Section"
            className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted"
          >
            <Command.Item
              value="Interactive Automotive Schematics HIL CANoe"
              onSelect={() => navigateSection("schematics")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Interactive Automotive Schematics (HIL &amp; CANoe)</span>
            </Command.Item>

            <Command.Item
              value="Work Experience Projects CARIAD BMW Mazda Graitec"
              onSelect={() => navigateSection("experience")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <Briefcase className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Work Experience &amp; Projects (CARIAD, BMW, Graitec)</span>
            </Command.Item>

            <Command.Item
              value="Live DLT CANoe Diagnostic Simulator"
              onSelect={() => navigateSection("telemetry")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <Terminal className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Live DLT &amp; CANoe Diagnostic Simulator</span>
            </Command.Item>

            <Command.Item
              value="Technical Skills Matrix"
              onSelect={() => navigateSection("skills")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <Cpu className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Technical Skills Matrix</span>
            </Command.Item>

            <Command.Item
              value="Education CCNAv7 Certifications"
              onSelect={() => navigateSection("education")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <GraduationCap className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Education, CCNAv7 &amp; Certifications</span>
            </Command.Item>

            <Command.Item
              value="Contact Collaboration Email Phone"
              onSelect={() => navigateSection("contact")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
            >
              <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Contact &amp; Collaboration</span>
            </Command.Item>
          </Command.Group>

          {/* Tech Stack Filters */}
          <Command.Group
            heading="Filter Experience by Technology"
            className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted"
          >
            {COMMAND_MENU_FILTERS.map((tech) => (
              <Command.Item
                key={tech}
                value={`Filter Experience by ${tech}`}
                onSelect={() =>
                  handleSelectAction(() => {
                    setActiveTechFilter(tech);
                    navigateTo("experience");
                  })
                }
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
              >
                <Code2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Filter Experience by: {tech}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Footer Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-line-subtle bg-surface-recessed text-[11px] font-mono text-ink-muted">
          <span>VAIDOS MIHAI-IULIAN — PORTFOLIO</span>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </Command>
    </ModalShell>
  );
}
