"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLenis } from "@/components/motion/SmoothScrollProvider";
import type { SectionId } from "@/lib/filters";
import {
  applySectionSearchHighlight,
  clearSearchHighlights,
} from "@/lib/searchHighlight";

interface PortfolioUIContextValue {
  isCommandMenuOpen: boolean;
  openCommandMenu: () => void;
  closeCommandMenu: () => void;
  toggleCommandMenu: () => void;
  activeTechFilter: string | undefined;
  setActiveTechFilter: (filter: string | undefined) => void;
  navigateTo: (sectionId: SectionId) => void;
  navigateAndHighlight: (
    sectionId: SectionId,
    query: string,
    fallbackLabel?: string
  ) => void;
  scrollToTop: () => void;
}

const PortfolioUIContext = createContext<PortfolioUIContextValue>({
  isCommandMenuOpen: false,
  openCommandMenu: () => {},
  closeCommandMenu: () => {},
  toggleCommandMenu: () => {},
  activeTechFilter: undefined,
  setActiveTechFilter: () => {},
  navigateTo: () => {},
  navigateAndHighlight: () => {},
  scrollToTop: () => {},
});

export function usePortfolioUI() {
  return useContext(PortfolioUIContext);
}

export default function PortfolioUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [activeTechFilter, setActiveTechFilterState] = useState<
    string | undefined
  >(undefined);
  const lenis = useLenis();
  const pendingScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const setActiveTechFilter = useCallback((filter: string | undefined) => {
    clearSearchHighlights();
    setActiveTechFilterState(filter);
  }, []);

  useEffect(() => {
    return () => {
      if (pendingScrollTimerRef.current) {
        clearTimeout(pendingScrollTimerRef.current);
      }
      clearSearchHighlights();
    };
  }, []);

  const openCommandMenu = useCallback(() => setIsCommandMenuOpen(true), []);
  const closeCommandMenu = useCallback(() => setIsCommandMenuOpen(false), []);
  const toggleCommandMenu = useCallback(
    () => setIsCommandMenuOpen((prev) => !prev),
    []
  );

  const navigateTo = useCallback(
    (sectionId: SectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (lenis && !reducedMotion) {
        // Lenis honors scroll-mt-20 / scroll-padding-top automatically; avoid double-offsetting
        lenis.scrollTo(el, { offset: 0 });
      } else {
        el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      }
    },
    [lenis]
  );

  const navigateAndHighlight = useCallback(
    (sectionId: SectionId, query: string, fallbackLabel?: string) => {
      if (pendingScrollTimerRef.current) {
        clearTimeout(pendingScrollTimerRef.current);
      }

      // Wait 1 frame/tick so Experience filter reset and modal close settle cleanly
      pendingScrollTimerRef.current = setTimeout(() => {
        const targetMark = applySectionSearchHighlight(
          sectionId,
          query,
          fallbackLabel
        );
        const scrollTarget = targetMark ?? document.getElementById(sectionId);
        if (!scrollTarget) return;

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (lenis && !reducedMotion) {
          lenis.scrollTo(scrollTarget, {
            offset: targetMark ? -140 : 0,
          });
        } else {
          scrollTarget.scrollIntoView({
            block: targetMark ? "center" : "start",
            behavior: reducedMotion ? "auto" : "smooth",
          });
        }
      }, 65);
    },
    [lenis]
  );

  const scrollToTop = useCallback(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (lenis && !reducedMotion) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }, [lenis]);

  return (
    <PortfolioUIContext.Provider
      value={{
        isCommandMenuOpen,
        openCommandMenu,
        closeCommandMenu,
        toggleCommandMenu,
        activeTechFilter,
        setActiveTechFilter,
        navigateTo,
        navigateAndHighlight,
        scrollToTop,
      }}
    >
      {children}
    </PortfolioUIContext.Provider>
  );
}
