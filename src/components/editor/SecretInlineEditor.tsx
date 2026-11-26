"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Eye,
  ListChecks,
  Pencil,
  RotateCcw,
  Undo2,
  X,
} from "lucide-react";
import { useClipboardCopy } from "@/lib/clipboard";
import {
  applyEditRecordsToDom,
  buildStableSelector,
  findEditableTextTarget,
  inferSectionLabel,
  loadStoredEdits,
  revertDomElementEdit,
  saveStoredEdits,
  type InlineTextEditRecord,
} from "@/lib/inlineEdits";

export default function SecretInlineEditor() {
  const [isSecretUrl, setIsSecretUrl] = useState(false);
  const [isBrushActive, setIsBrushActive] = useState(true);
  const [showChangesDrawer, setShowChangesDrawer] = useState(false);
  const [records, setRecords] = useState<InlineTextEditRecord[]>([]);
  const [activeEditLabel, setActiveEditLabel] = useState<string | null>(null);

  const activeElRef = useRef<HTMLElement | null>(null);
  const preFocusTextRef = useRef<string>("");
  const recordsRef = useRef<InlineTextEditRecord[]>([]);

  const { copiedKey, copy } = useClipboardCopy({ timeoutMs: 1800 });

  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  // Activate on ?edit=1 and always apply any locally saved text adjustments
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editEnabled = params.get("edit") === "1";
    setIsSecretUrl(editEnabled);

    const saved = loadStoredEdits();
    if (saved.length > 0) {
      recordsRef.current = saved;
      setRecords(saved);
      const timer = setTimeout(() => {
        applyEditRecordsToDom(saved);
      }, 60);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  // Mark document root only while secret edit brush is enabled & prevent indexing
  useEffect(() => {
    if (!isSecretUrl) {
      delete document.documentElement.dataset.secretEditMode;
      return;
    }

    if (isBrushActive) {
      document.documentElement.dataset.secretEditMode = "true";
    } else {
      delete document.documentElement.dataset.secretEditMode;
    }

    let meta = document.querySelector<HTMLMetaElement>("meta[data-secret-noindex]");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, nofollow";
      meta.dataset.secretNoindex = "true";
      document.head.appendChild(meta);
    }

    return () => {
      delete document.documentElement.dataset.secretEditMode;
      meta?.remove();
    };
  }, [isSecretUrl, isBrushActive]);

  const commitActiveElement = useCallback((el: HTMLElement) => {
    el.removeAttribute("contenteditable");
    delete el.dataset.inlineEditing;
    setActiveEditLabel(null);
    activeElRef.current = null;

    const newText = (el.textContent ?? "").trim();
    const originalText =
      el.dataset.originalPortfolioText ?? preFocusTextRef.current;

    if (!newText) {
      // Never allow blanking an entire element accidentally — restore previous text
      el.textContent = preFocusTextRef.current;
      return;
    }

    const selector = buildStableSelector(el);
    const nextRecords = [...recordsRef.current];
    const existingIdx = nextRecords.findIndex((r) => r.selector === selector);

    if (newText === originalText) {
      delete el.dataset.inlineEdited;
      if (existingIdx !== -1) {
        nextRecords.splice(existingIdx, 1);
        recordsRef.current = nextRecords;
        setRecords(nextRecords);
        saveStoredEdits(nextRecords);
      }
      return;
    }

    el.dataset.originalPortfolioText = originalText;
    el.dataset.inlineEdited = "true";

    const updatedRecord: InlineTextEditRecord = {
      id: existingIdx !== -1 ? nextRecords[existingIdx]!.id : `edit-${Date.now()}`,
      selector,
      sectionLabel: inferSectionLabel(el),
      originalText,
      updatedText: newText,
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      nextRecords[existingIdx] = updatedRecord;
    } else {
      nextRecords.push(updatedRecord);
    }

    recordsRef.current = nextRecords;
    setRecords(nextRecords);
    saveStoredEdits(nextRecords);
  }, []);

  // Attach global click-to-edit + blur/Enter/Escape listeners when ?edit=1 & brush active
  useEffect(() => {
    if (!isSecretUrl || !isBrushActive) return;

    const handleClick = (e: MouseEvent) => {
      // If user clicked inside an element currently being edited, let cursor move freely
      if (
        activeElRef.current &&
        e.target instanceof Node &&
        activeElRef.current.contains(e.target)
      ) {
        return;
      }

      const target = findEditableTextTarget(e.target);
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();

      if (activeElRef.current && activeElRef.current !== target) {
        commitActiveElement(activeElRef.current);
      }

      if (!target.dataset.originalPortfolioText) {
        target.dataset.originalPortfolioText = (target.textContent ?? "").trim();
      }
      preFocusTextRef.current = (target.textContent ?? "").trim();
      activeElRef.current = target;
      setActiveEditLabel(inferSectionLabel(target));

      target.setAttribute("contenteditable", "plaintext-only");
      // Fallback for engines that ignore plaintext-only
      if (target.contentEditable !== "plaintext-only" && target.contentEditable !== "true") {
        target.contentEditable = "true";
      }
      target.dataset.inlineEditing = "true";
      target.focus();
    };

    const handleFocusOut = (e: FocusEvent) => {
      const el = activeElRef.current;
      if (!el || e.target !== el) return;
      commitActiveElement(el);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const el = activeElRef.current;
      if (!el) return;

      if (e.key === "Escape") {
        e.preventDefault();
        el.textContent = preFocusTextRef.current;
        commitActiveElement(el);
        el.blur();
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        commitActiveElement(el);
        el.blur();
      }
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("focusout", handleFocusOut, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("focusout", handleFocusOut, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      if (activeElRef.current) {
        commitActiveElement(activeElRef.current);
      }
    };
  }, [isSecretUrl, isBrushActive, commitActiveElement]);

  const handleRevertOne = (record: InlineTextEditRecord) => {
    revertDomElementEdit(record);
    const next = recordsRef.current.filter((r) => r.id !== record.id);
    recordsRef.current = next;
    setRecords(next);
    saveStoredEdits(next);
  };

  const handleResetAll = () => {
    if (activeElRef.current) {
      commitActiveElement(activeElRef.current);
    }
    for (const record of recordsRef.current) {
      revertDomElementEdit(record);
    }
    recordsRef.current = [];
    setRecords([]);
    saveStoredEdits([]);
  };

  const handleExportJson = () => {
    const payload = JSON.stringify(recordsRef.current, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-text-edits.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPatchSummary = () => {
    const summary = recordsRef.current
      .map(
        (r, idx) =>
          `${idx + 1}. [${r.sectionLabel}] "${r.originalText}" -> "${r.updatedText}"`
      )
      .join("\n");
    void copy(summary || "No changes recorded.", "Patch Summary");
  };

  const handleExitSecretMode = () => {
    if (activeElRef.current) {
      commitActiveElement(activeElRef.current);
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    setIsSecretUrl(false);
  };

  if (!isSecretUrl) return null;

  return (
    <div
      data-secret-editor="true"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(96vw,780px)] print:hidden"
    >
      {/* Changes Review Drawer */}
      {showChangesDrawer && (
        <div
          role="region"
          aria-label="Edited texts list"
          className="mb-2 rounded-2xl border border-line-strong bg-elevated/95 backdrop-blur-xl shadow-elevated overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-line-subtle bg-surface-recessed text-xs font-mono">
            <span className="font-bold text-ink-primary">
              SAVED TEXT ADJUSTMENTS ({records.length}) — STORED IN BROWSER
            </span>
            <button
              type="button"
              onClick={() => setShowChangesDrawer(false)}
              className="p-1 rounded text-ink-muted hover:text-ink-primary cursor-pointer"
              aria-label="Close edits drawer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto p-3 space-y-2 text-xs font-mono scrollbar-cockpit">
            {records.length === 0 ? (
              <p className="text-ink-muted text-center py-4">
                No text changes yet. Click any heading, paragraph, skill, or bullet on the page to edit it.
              </p>
            ) : (
              records.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-surface border border-line-subtle"
                >
                  <div className="min-w-0 space-y-1">
                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-accent-cobalt/15 text-accent-cyan-ink font-semibold">
                      {rec.sectionLabel}
                    </span>
                    <p className="text-[11px] text-ink-muted line-through line-clamp-1">
                      {rec.originalText}
                    </p>
                    <p className="text-[11px] text-ink-primary font-semibold line-clamp-2">
                      {rec.updatedText}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRevertOne(rec)}
                    className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-recessed border border-line-subtle hover:border-accent-crimson text-ink-muted hover:text-status-rose transition-colors cursor-pointer"
                    aria-label={`Revert edit in ${rec.sectionLabel}`}
                  >
                    <Undo2 className="w-3 h-3" aria-hidden="true" />
                    <span>Revert</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Compact Secret Editor Dock */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl border border-accent-amber/50 bg-elevated/95 backdrop-blur-xl shadow-elevated text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent-amber/15 border border-accent-amber/40 text-accent-amber-ink font-bold">
            <Pencil className="w-3 h-3" aria-hidden="true" />
            <span>SECRET EDIT MODE</span>
          </span>

          <span className="text-[11px] text-ink-muted hidden sm:inline">
            {activeEditLabel
              ? `Editing ${activeEditLabel} (Enter = save, Esc = cancel)`
              : isBrushActive
                ? "Click any text to edit inline"
                : "Browse mode active"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            aria-pressed={isBrushActive}
            onClick={() => setIsBrushActive((prev) => !prev)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              isBrushActive
                ? "bg-accent-cobalt text-white border-accent-cobalt font-semibold"
                : "bg-surface border-line-subtle text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {isBrushActive ? (
              <>
                <Pencil className="w-3 h-3" aria-hidden="true" />
                <span>Edit Text</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" aria-hidden="true" />
                <span>Browse</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowChangesDrawer((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface border border-line-subtle hover:border-line-strong text-ink-primary transition-colors cursor-pointer"
          >
            <ListChecks className="w-3.5 h-3.5 text-accent-cyan-ink" aria-hidden="true" />
            <span>Changes ({records.length})</span>
          </button>

          <button
            type="button"
            disabled={records.length === 0}
            onClick={handleCopyPatchSummary}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface border border-line-subtle hover:border-line-strong disabled:opacity-45 text-ink-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {copiedKey ? (
              <>
                <Check className="w-3.5 h-3.5 text-status-emerald-ink" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Copy Diff</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={records.length === 0}
            onClick={handleExportJson}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-surface border border-line-subtle hover:border-line-strong disabled:opacity-45 text-ink-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
            aria-label="Export edits as JSON"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            disabled={records.length === 0}
            onClick={handleResetAll}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-surface border border-line-subtle hover:border-accent-crimson disabled:opacity-45 text-ink-muted hover:text-status-rose transition-colors cursor-pointer disabled:cursor-not-allowed"
            aria-label="Reset all text edits"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleExitSecretMode}
            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-surface border border-line-subtle hover:border-line-strong text-ink-muted hover:text-ink-primary transition-colors cursor-pointer"
            aria-label="Exit secret edit mode"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
