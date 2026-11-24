import type { SectionId } from "./filters";

interface WrappedTextRecord {
  wrapper: HTMLSpanElement;
  originalNode: Text;
}

let activeRecords: WrappedTextRecord[] = [];
let activeHeadingEl: HTMLElement | null = null;
let fadeTimer: ReturnType<typeof setTimeout> | null = null;
let cleanupTimer: ReturnType<typeof setTimeout> | null = null;

function getNormalizedTerms(rawTerms: string[]): string[] {
  return Array.from(
    new Set(
      rawTerms
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length >= 2)
    )
  ).sort((a, b) => b.length - a.length);
}

function findMatchRanges(
  text: string,
  terms: string[]
): { start: number; end: number }[] {
  if (terms.length === 0) return [];
  const lower = text.toLowerCase();
  const candidates: { start: number; end: number }[] = [];

  for (const term of terms) {
    let from = 0;
    while (from < lower.length) {
      const idx = lower.indexOf(term, from);
      if (idx === -1) break;
      candidates.push({ start: idx, end: idx + term.length });
      from = idx + term.length;
    }
  }

  candidates.sort((a, b) => a.start - b.start || b.end - a.end);

  const merged: { start: number; end: number }[] = [];
  for (const range of candidates) {
    const prev = merged[merged.length - 1];
    if (!prev || range.start >= prev.end) {
      merged.push(range);
    }
  }
  return merged;
}

export function clearSearchHighlights(): void {
  if (fadeTimer) {
    clearTimeout(fadeTimer);
    fadeTimer = null;
  }
  if (cleanupTimer) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }

  for (const record of activeRecords) {
    const parent = record.wrapper.parentNode;
    if (parent) {
      parent.replaceChild(record.originalNode, record.wrapper);
    }
  }
  activeRecords = [];

  if (activeHeadingEl) {
    activeHeadingEl.classList.remove("search-hit-heading");
    delete activeHeadingEl.dataset.fading;
    activeHeadingEl = null;
  }
}

function isSkippableNode(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return true;
  const tag = parent.tagName;
  if (
    tag === "SCRIPT" ||
    tag === "STYLE" ||
    tag === "NOSCRIPT" ||
    tag === "CANVAS" ||
    tag === "SVG"
  ) {
    return true;
  }
  if (parent.closest("[aria-hidden='true'], .sr-only")) {
    return true;
  }
  return false;
}

export function applySectionSearchHighlight(
  sectionId: SectionId,
  rawQuery: string,
  fallbackLabel?: string
): HTMLElement | null {
  clearSearchHighlights();

  const sectionEl = document.getElementById(sectionId);
  if (!sectionEl) return null;

  const trimmedQuery = rawQuery.trim();
  const queryTokens = trimmedQuery.split(/\s+/);
  const terms = getNormalizedTerms([trimmedQuery, ...queryTokens]);

  const collectedNodes: Text[] = [];
  if (terms.length > 0) {
    const walker = document.createTreeWalker(
      sectionEl,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const textNode = node as Text;
          if (!textNode.nodeValue || isSkippableNode(textNode)) {
            return NodeFilter.FILTER_REJECT;
          }
          return findMatchRanges(textNode.nodeValue, terms).length > 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      }
    );

    let current = walker.nextNode();
    while (current && collectedNodes.length < 30) {
      collectedNodes.push(current as Text);
      current = walker.nextNode();
    }
  }

  let firstMark: HTMLElement | null = null;

  if (terms.length > 0 && collectedNodes.length > 0) {
    for (const textNode of collectedNodes) {
      const value = textNode.nodeValue;
      const parent = textNode.parentNode;
      if (!value || !parent) continue;

      const ranges = findMatchRanges(value, terms);
      if (ranges.length === 0) continue;

      const wrapper = document.createElement("span");
      wrapper.dataset.searchWrapper = "true";
      let cursor = 0;

      for (const range of ranges) {
        if (range.start > cursor) {
          wrapper.appendChild(
            document.createTextNode(value.slice(cursor, range.start))
          );
        }
        const mark = document.createElement("mark");
        mark.className = "search-hit-mark";
        mark.dataset.searchHighlight = "true";
        mark.textContent = value.slice(range.start, range.end);
        wrapper.appendChild(mark);
        if (!firstMark) firstMark = mark;
        cursor = range.end;
      }

      if (cursor < value.length) {
        wrapper.appendChild(document.createTextNode(value.slice(cursor)));
      }

      parent.replaceChild(wrapper, textNode);
      activeRecords.push({ wrapper, originalNode: textNode });
    }
  }

  // Fallback: when match lives inside a canvas or non-visible tab, pulse section heading
  if (!firstMark) {
    const heading =
      sectionEl.querySelector<HTMLElement>("h2, h1, h3") ?? sectionEl;
    heading.classList.add("search-hit-heading");
    activeHeadingEl = heading;
    if (fallbackLabel) {
      heading.dataset.highlightLabel = fallbackLabel;
    }
    firstMark = heading;
  }

  // Keep highlight visible for ~3.6s, fade out over 400ms, then restore exact DOM text
  fadeTimer = setTimeout(() => {
    for (const record of activeRecords) {
      record.wrapper
        .querySelectorAll<HTMLElement>("[data-search-highlight='true']")
        .forEach((mark) => {
          mark.dataset.fading = "true";
        });
    }
    if (activeHeadingEl) {
      activeHeadingEl.dataset.fading = "true";
    }
  }, 3600);

  cleanupTimer = setTimeout(() => {
    clearSearchHighlights();
  }, 4050);

  return firstMark;
}
