"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useLenis } from "@/components/motion/SmoothScrollProvider";
import type { SectionId } from "@/lib/filters";

interface PortfolioUIContextValue {
  isCommandMenuOpen: boolean;
  openCommandMenu: () => void;
  closeCommandMenu: () => void;
  toggleCommandMenu: () => void;
  activeTechFilter: string | undefined;
  setActiveTechFilter: (filter: string | undefined) => void;
  navigateTo: (sectionId: SectionId) => void;
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
  const [activeTechFilter, setActiveTechFilter] = useState<string | undefined>(
    undefined
  );
  const lenis = useLenis();

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
        scrollToTop,
      }}
    >
      {children}
    </PortfolioUIContext.Provider>
  );
}
