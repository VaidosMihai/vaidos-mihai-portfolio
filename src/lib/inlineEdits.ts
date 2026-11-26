export const INLINE_EDITS_STORAGE_KEY = "portfolio-inline-edits-v1";

export interface InlineTextEditRecord {
  id: string;
  selector: string;
  sectionLabel: string;
  originalText: string;
  updatedText: string;
  updatedAt: string;
}

const IGNORED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CANVAS",
  "SVG",
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "OPTION",
  "BUTTON",
  "A",
]);

/**
 * Builds a stable DOM selector anchored at the nearest ancestor with an `id`,
 * falling back to `body`, using tag + nth-of-type indices.
 */
export function buildStableSelector(el: HTMLElement): string {
  const segments: string[] = [];
  let current: HTMLElement | null = el;

  while (current && current !== document.body) {
    if (current.id) {
      segments.unshift(`#${CSS.escape(current.id)}`);
      return segments.join(" > ");
    }

    const parent: HTMLElement | null = current.parentElement;
    if (!parent) break;

    const tag = current.tagName.toLowerCase();
    const sameTagSiblings = Array.from(parent.children).filter(
      (child) => child.tagName.toLowerCase() === tag
    );
    const index = sameTagSiblings.indexOf(current) + 1;
    segments.unshift(
      sameTagSiblings.length > 1 ? `${tag}:nth-of-type(${index})` : tag
    );
    current = parent;
  }

  segments.unshift("body");
  return segments.join(" > ");
}

export function inferSectionLabel(el: HTMLElement): string {
  const section = el.closest("section[id], footer, header");
  if (!section) return "Page";
  if (section.tagName === "FOOTER") return "Footer";
  if (section.tagName === "HEADER") return "Header";
  const id = section.id;
  if (!id) return "Overview";
  return id.charAt(0).toUpperCase() + id.slice(1);
}

/**
 * Determines whether a clicked target is a safe leaf text block suitable for inline editing
 * without disrupting navigation links, tabs, form fields, or canvas diagrams.
 */
export function findEditableTextTarget(
  rawTarget: EventTarget | null
): HTMLElement | null {
  if (!(rawTarget instanceof HTMLElement)) return null;
  if (rawTarget.closest("[data-secret-editor='true']")) return null;
  if (rawTarget.closest("[role='dialog']")) return null;
  if (rawTarget.closest("[aria-hidden='true']")) return null;

  // Keep interactive navigation, tabs, Showcase/Schematics buttons, and Contact form functional
  if (
    rawTarget.closest(
      "button, a, input, textarea, select, label, [role='tab'], canvas, svg"
    )
  ) {
    return null;
  }

  let candidate: HTMLElement | null = rawTarget;
  while (candidate && candidate !== document.body) {
    if (!candidate.closest("main, footer")) return null;
    if (IGNORED_TAGS.has(candidate.tagName)) return null;

    // Prefer semantic text elements or leaf containers without nested block children
    const hasBlockChildren = Array.from(candidate.children).some((child) => {
      const display = window.getComputedStyle(child).display;
      return (
        display === "block" ||
        display === "flex" ||
        display === "grid" ||
        display === "list-item"
      );
    });

    const text = (candidate.innerText ?? candidate.textContent ?? "").trim();
    if (!hasBlockChildren && text.length > 0 && text.length <= 2500) {
      return candidate;
    }

    candidate = candidate.parentElement;
  }

  return null;
}

export function loadStoredEdits(): InlineTextEditRecord[] {
  try {
    const raw = window.localStorage.getItem(INLINE_EDITS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is InlineTextEditRecord =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as InlineTextEditRecord).id === "string" &&
        typeof (item as InlineTextEditRecord).selector === "string" &&
        typeof (item as InlineTextEditRecord).originalText === "string" &&
        typeof (item as InlineTextEditRecord).updatedText === "string"
    );
  } catch {
    return [];
  }
}

export function saveStoredEdits(records: InlineTextEditRecord[]): void {
  try {
    if (records.length === 0) {
      window.localStorage.removeItem(INLINE_EDITS_STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        INLINE_EDITS_STORAGE_KEY,
        JSON.stringify(records)
      );
    }
  } catch {
    // Ignore storage quota/privacy mode failures
  }
}

export function applyEditRecordsToDom(records: InlineTextEditRecord[]): void {
  for (const record of records) {
    try {
      const el = document.querySelector<HTMLElement>(record.selector);
      if (!el) continue;
      if (el.closest("[data-secret-editor='true']")) continue;
      if (!el.dataset.originalPortfolioText) {
        el.dataset.originalPortfolioText = el.textContent ?? record.originalText;
      }
      el.textContent = record.updatedText;
      el.dataset.inlineEdited = "true";
    } catch {
      // Skip malformed selectors safely
    }
  }
}

export function revertDomElementEdit(record: InlineTextEditRecord): void {
  try {
    const el = document.querySelector<HTMLElement>(record.selector);
    if (!el) return;
    el.textContent = el.dataset.originalPortfolioText ?? record.originalText;
    delete el.dataset.originalPortfolioText;
    delete el.dataset.inlineEdited;
  } catch {
    // Skip safely
  }
}
