import type { SectionId } from "./filters";

interface WrappedTextRecord {
  wrapper: HTMLSpanElement;
  originalNode: Text;
}

let activeRecords: WrappedTextRecord[] = [];
let activeHeadingEl: HTMLElement | null = null;
let fadeTimer: ReturnType<typeof setTimeout> | null = null;
let cleanupTimer: ReturnType<typeof setTimeout> | null = null;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

function buildSearchRegex(terms: string[]): RegExp | null {
  const unique = Array.from(
    new Set(
      terms
        .map((t) => t.trim())
        .filter((t) => t.length >= 2)
    )
  ).sort((a, b) => b.length - a.length);

  if (unique.length === 0) return null;
  return new RegExp(`(${unique.map(escapeRegExp).join("|")})`, "gi");
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
  const queryTokens = trimmedQuery.split(/\s+/).filter((t) => t.length >= 2);
  const terms: string[] = [];
  if (trimmedQuery.length >= 2) terms.push(trimmedQuery);
  terms.push(...queryTokens);

  // Add fallback title prefix if raw query wasn't literal inside section DOM
  const regex = buildSearchRegex(terms);

  const collectedNodes: Text[] = [];
  if (regex) {
    const walker = document.createTreeWalker(
      sectionEl,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const textNode = node as Text;
          if (!textNode.nodeValue || isSkippableNode(textNode)) {
            return NodeFilter.FILTER_REJECT;
          }
          regex.lastIndex = 0;
          return regex.test(textNode.nodeValue)
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

  if (regex && collectedNodes.length > 0) {
    for (const textNode of collectedNodes) {
      const value = textNode.nodeValue;
      const parent = textNode.parentNode;
      if (!value || !parent) continue;

      regex.lastIndex = 0;
      const parts = value.split(regex);
      if (parts.length <= 1) continue;

      const wrapper = document.createElement("span");
      wrapper.dataset.searchWrapper = "true";

      for (const part of parts) {
        if (!part) continue;
        regex.lastIndex = 0;
        if (regex.test(part)) {
          const mark = document.createElement("mark");
          mark.className = "search-hit-mark";
          mark.dataset.searchHighlight = "true";
          mark.textContent = part;
          wrapper.appendChild(mark);
          if (!firstMark) firstMark = mark;
        } else {
          wrapper.appendChild(document.createTextNode(part));
        }
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
