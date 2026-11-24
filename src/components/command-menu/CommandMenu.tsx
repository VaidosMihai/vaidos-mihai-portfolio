"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Sparkles,
  Activity,
} from "lucide-react";
import ModalShell from "@/components/ui/ModalShell";
import { useTheme } from "@/components/theme/ThemeProvider";
import { usePortfolioUI } from "@/components/shell/PortfolioUIProvider";
import { useClipboardCopy } from "@/lib/clipboard";
import { COMMAND_MENU_FILTERS, type SectionId } from "@/lib/filters";
import {
  buildSiteSearchIndex,
  searchSiteEntries,
  type SearchResultKind,
  type SiteSearchEntry,
} from "@/lib/siteSearch";
import { getSafeExternalUrl } from "@/lib/url";

import { GITHUB_URL as RAW_GITHUB_URL, LINKEDIN_URL as RAW_LINKEDIN_URL } from "@/lib/site";

const GITHUB_URL = getSafeExternalUrl(RAW_GITHUB_URL) ?? "#";
const LINKEDIN_URL = getSafeExternalUrl(RAW_LINKEDIN_URL) ?? "#";

function renderKindIcon(kind: SearchResultKind) {
  const cls = "w-4 h-4 shrink-0";
  switch (kind) {
    case "hero":
      return <Sparkles className={cls} aria-hidden="true" />;
    case "showcase":
      return <Activity className={cls} aria-hidden="true" />;
    case "schematics":
      return <Layers className={cls} aria-hidden="true" />;
    case "telemetry":
      return <Terminal className={cls} aria-hidden="true" />;
    case "experience":
      return <Briefcase className={cls} aria-hidden="true" />;
    case "skills":
      return <Cpu className={cls} aria-hidden="true" />;
    case "education":
      return <GraduationCap className={cls} aria-hidden="true" />;
    case "contact":
      return <Mail className={cls} aria-hidden="true" />;
  }
}

function matchesSearchTokens(haystack: string, rawQuery: string): boolean {
  const normalized = rawQuery.toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalized) return true;
  const hay = haystack.toLowerCase();
  return normalized.split(" ").every((token) => hay.includes(token));
}

export default function CommandMenu() {
  const {
    isCommandMenuOpen,
    closeCommandMenu,
    toggleCommandMenu,
    navigateTo,
    setActiveTechFilter,
  } = usePortfolioUI();
  const { theme, setTheme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const siteSearchIndex = useMemo(() => buildSiteSearchIndex(), []);
  const hasQuery = query.trim().length > 0;
  const pageSearchResults = useMemo(
    () => (hasQuery ? searchSiteEntries(siteSearchIndex, query) : []),
    [hasQuery, siteSearchIndex, query]
  );

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
    if (!isCommandMenuOpen) {
      setQuery("");
    }
  }, [isCommandMenuOpen, clearCopyState]);

  const handleClose = useCallback(() => {
    clearCopyState();
    setQuery("");
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

  const handleSelectPageResult = (entry: SiteSearchEntry) => {
    handleSelectAction(() => {
      if (entry.kind === "experience") {
        setActiveTechFilter(undefined);
      }
      navigateTo(entry.sectionId);
    });
  };

  const appearanceItems = [
    {
      id: "theme-toggle",
      keywords: "Toggle Color Theme Dark Light Obsidian Automotive Switch",
      label: `Switch Theme (Current: ${theme === "dark" ? "Obsidian Slate" : "Automotive Light"})`,
      badge: "Toggle",
      icon: <SunMoon className="w-4 h-4 shrink-0" aria-hidden="true" />,
      onSelect: () => handleSelectAction(toggleTheme),
    },
    {
      id: "theme-dark",
      keywords: "Dark Theme Obsidian Titanium Slate Mode",
      label: "Obsidian & Titanium Slate (Dark Mode)",
      badge: theme === "dark" ? "Active" : undefined,
      icon: <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />,
      onSelect: () => handleSelectAction(() => setTheme("dark")),
    },
    {
      id: "theme-light",
      keywords: "Light Theme Automotive Cockpit White Mode",
      label: "Automotive Cockpit (Light Mode)",
      badge: theme === "light" ? "Active" : undefined,
      icon: <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />,
      onSelect: () => handleSelectAction(() => setTheme("light")),
    },
  ].filter((item) => matchesSearchTokens(`${item.label} ${item.keywords}`, query));

  const quickActionItems = [
    {
      id: "action-email",
      keywords: "Copy Email Address vaidos.mihaiiulian@gmail.com",
      label: "Copy Email Address",
      hint: "vaidos.mihaiiulian@gmail.com",
      icon: <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />,
      trailing: (
        <Copy
          className="w-3.5 h-3.5 text-ink-muted group-data-[selected=true]:text-white"
          aria-hidden="true"
        />
      ),
      onSelect: () => void copy("vaidos.mihaiiulian@gmail.com", "Email"),
    },
    {
      id: "action-phone",
      keywords: "Copy Phone Number +40 768 194 193",
      label: "Copy Phone Number",
      hint: "+40 768 194 193",
      icon: <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />,
      trailing: (
        <Copy
          className="w-3.5 h-3.5 text-ink-muted group-data-[selected=true]:text-white"
          aria-hidden="true"
        />
      ),
      onSelect: () => void copy("+40 768 194 193", "Phone Number"),
    },
    {
      id: "action-print",
      keywords: "Print Save Resume PDF",
      label: "Print / Save Resume as PDF",
      hint: undefined,
      icon: <FileDown className="w-4 h-4 shrink-0" aria-hidden="true" />,
      trailing: (
        <span className="text-xs font-mono text-ink-muted group-data-[selected=true]:text-white">
          Print
        </span>
      ),
      onSelect: () => {
        flushSync(handleClose);
        window.print();
      },
    },
    {
      id: "action-github",
      keywords: "Open GitHub Repository Projects github.com/VaidosMihai",
      label: "Open GitHub Repository & Projects",
      hint: "github.com/VaidosMihai",
      icon: <Github className="w-4 h-4 shrink-0" aria-hidden="true" />,
      trailing: undefined,
      onSelect: () => openExternal(GITHUB_URL),
    },
    {
      id: "action-linkedin",
      keywords: "Open LinkedIn Profile linkedin.com/in/mihai-vaidos",
      label: "Open LinkedIn Profile",
      hint: "linkedin.com/in/mihai-vaidos",
      icon: <Linkedin className="w-4 h-4 shrink-0" aria-hidden="true" />,
      trailing: undefined,
      onSelect: () => openExternal(LINKEDIN_URL),
    },
  ].filter((item) => matchesSearchTokens(`${item.label} ${item.keywords}`, query));

  const sectionItems: {
    id: SectionId;
    label: string;
    keywords: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "hero" as SectionId,
      label: "Overview & Key Engineering Metrics",
      keywords: "Hero Overview Bio Summary 95% -30%",
      icon: <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "showcase" as SectionId,
      label: "Project Simulations (CARIAD, BMW, HARMAN, Graitec)",
      keywords: "Project Visuals Animation Quadkey Parking eCall CAD",
      icon: <Activity className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "schematics" as SectionId,
      label: "Interactive Automotive Schematics (HIL & CANoe)",
      keywords: "Interactive Automotive Schematics HIL CANoe Revit Architecture",
      icon: <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "experience" as SectionId,
      label: "Work Experience & Projects (CARIAD, BMW, Graitec)",
      keywords: "Work Experience Projects CARIAD BMW Mazda Graitec Bertrandt",
      icon: <Briefcase className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "telemetry" as SectionId,
      label: "Live DLT & CANoe Diagnostic Simulator",
      keywords: "Live DLT CANoe Diagnostic Simulator UART Logs",
      icon: <Terminal className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "skills" as SectionId,
      label: "Technical Skills Matrix",
      keywords: "Technical Skills Matrix Languages DevOps Protocols",
      icon: <Cpu className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "education" as SectionId,
      label: "Education, CCNAv7 & Certifications",
      keywords: "Education CCNAv7 Certifications University Degree Thesis",
      icon: <GraduationCap className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "contact" as SectionId,
      label: "Contact & Collaboration",
      keywords: "Contact Collaboration Email Phone FormSubmit",
      icon: <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
  ].filter((item) => matchesSearchTokens(`${item.label} ${item.keywords}`, query));

  const filterItems = COMMAND_MENU_FILTERS.filter((tech) =>
    matchesSearchTokens(`Filter Experience by: ${tech} ${tech}`, query)
  );

  return (
    <ModalShell
      isOpen={isCommandMenuOpen}
      onClose={handleClose}
      ariaLabel="Command menu"
      containerClassName="items-start pt-16 sm:pt-24"
      panelClassName="max-w-2xl p-0 overflow-hidden"
    >
      <Command shouldFilter={false} className="w-full text-ink-secondary">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-line-subtle bg-surface-recessed/70 focus-within:ring-2 focus-within:ring-inset focus-within:ring-accent-cobalt">
          <Search
            className="w-5 h-5 text-ink-muted mr-3 shrink-0"
            aria-hidden="true"
          />
          <Command.Input
            data-autofocus
            value={query}
            onValueChange={setQuery}
            placeholder="Type a command or search anywhere on the page (projects, skills, schematics, certs)..."
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

        {/* Command & Full-Page Search List */}
        <Command.List
          data-lenis-prevent="true"
          className="max-h-[26rem] overflow-y-auto p-2 scrollbar-cockpit"
        >
          <Command.Empty className="p-6 text-center text-sm text-ink-muted">
            No matching results found on this page.
          </Command.Empty>

          {/* All Page Search Results (shown across the whole page when typing) */}
          {hasQuery && pageSearchResults.length > 0 && (
            <Command.Group
              heading={`Page Results (${pageSearchResults.length})`}
              className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted"
            >
              {pageSearchResults.map((entry) => (
                <Command.Item
                  key={entry.id}
                  value={entry.id}
                  onSelect={() => handleSelectPageResult(entry)}
                  className="group flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="mt-0.5 text-accent-cyan-ink group-data-[selected=true]:text-white">
                      {renderKindIcon(entry.kind)}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{entry.title}</div>
                      <div className="text-xs text-ink-muted group-data-[selected=true]:text-white/85 line-clamp-1">
                        {entry.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-recessed border border-line-subtle text-ink-muted group-data-[selected=true]:bg-white/15 group-data-[selected=true]:border-white/30 group-data-[selected=true]:text-white">
                    {entry.sectionLabel}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Tech Stack Filters */}
          {filterItems.length > 0 && (
            <Command.Group
              heading="Filter Experience by Technology"
              className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted"
            >
              {filterItems.map((tech) => (
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
          )}

          {/* Jump to Section */}
          {sectionItems.length > 0 && (
            <Command.Group
              heading="Jump to Section"
              className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted"
            >
              {sectionItems.map((sec) => (
                <Command.Item
                  key={sec.id}
                  value={`section-${sec.id}`}
                  onSelect={() => navigateSection(sec.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Appearance & Theme */}
          {appearanceItems.length > 0 && (
            <Command.Group
              heading="Appearance & Theme"
              className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted"
            >
              {appearanceItems.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  onSelect={item.onSelect}
                  className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[11px] font-mono text-ink-muted group-data-[selected=true]:text-white">
                      {item.badge}
                    </span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Quick Actions */}
          {quickActionItems.length > 0 && (
            <Command.Group
              heading="Quick Actions"
              className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted"
            >
              {quickActionItems.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  onSelect={item.onSelect}
                  className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-primary data-[selected=true]:bg-accent-cobalt data-[selected=true]:text-white hover:bg-surface-recessed cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                    {item.hint && (
                      <span className="hidden sm:inline text-xs font-mono text-ink-muted group-data-[selected=true]:text-white">
                        {item.hint}
                      </span>
                    )}
                  </div>
                  {item.trailing}
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>

        {/* Footer Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-line-subtle bg-surface-recessed text-[11px] font-mono text-ink-muted">
          <span>
            {hasQuery
              ? `${pageSearchResults.length} page match${pageSearchResults.length === 1 ? "" : "es"}`
              : "GLOBAL SITE SEARCH • PORTFOLIO"}
          </span>
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
