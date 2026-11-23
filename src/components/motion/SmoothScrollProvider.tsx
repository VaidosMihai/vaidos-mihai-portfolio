"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let rafId = 0;
    let isDisposed = false;

    const cleanupLenis = () => {
      isDisposed = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      setLenisInstance(null);
    };

    const startLenis = () => {
      if (mediaQuery.matches) {
        cleanupLenis();
        return;
      }

      isDisposed = false;
      const instance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
      });

      lenis = instance;
      setLenisInstance(instance);

      const raf = (time: number) => {
        if (isDisposed || !lenis) return;
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    };

    startLenis();

    const handleMotionChange = () => {
      cleanupLenis();
      startLenis();
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      cleanupLenis();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
