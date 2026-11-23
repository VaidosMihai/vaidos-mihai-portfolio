"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getThemePalette } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function FluidMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const paletteRef = useRef(getThemePalette(theme));
  const triggerStaticRedrawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    paletteRef.current = getThemePalette(theme);
    triggerStaticRedrawRef.current?.();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    let scrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    const handleResize = () => {
      resizeCanvas();
      if (reducedMotionQuery.matches) {
        drawFrame(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollVelocity = Math.abs(currentScroll - lastScrollY);
      lastScrollY = currentScroll;
      scrollY = currentScroll;
    };

    const cols = 45;
    const rows = 28;
    let time = 0;

    const drawFrame = (advanceTime: boolean) => {
      const palette = paletteRef.current.fluidMesh;

      if (advanceTime) {
        time += 0.015 + Math.min(scrollVelocity * 0.0005, 0.05);
        scrollVelocity *= 0.94;
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
      }

      ctx.fillStyle = palette.baseBg;
      ctx.fillRect(0, 0, width, height);

      const radialGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        50,
        mouse.x,
        mouse.y,
        Math.max(width, height) * 0.6
      );
      radialGradient.addColorStop(0, palette.radialStops[0]);
      radialGradient.addColorStop(0.5, palette.radialStops[1]);
      radialGradient.addColorStop(1, palette.radialStops[2]);
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1.2;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        const rowNorm = r / rows;
        const baseY = height * 0.15 + rowNorm * (height * 0.95);

        for (let c = 0; c <= cols; c++) {
          const colNorm = c / cols;
          const x = colNorm * width;

          const distToMouse = Math.hypot(x - mouse.x, baseY - mouse.y);
          const mouseFactor = Math.max(0, 1 - distToMouse / 450);

          const wave1 = Math.sin(colNorm * 8 + time * 1.5 + r * 0.4) * 22;
          const wave2 = Math.cos(rowNorm * 6 - time * 1.2 + colNorm * 4) * 16;
          const wave3 = Math.sin((x + scrollY * 0.4) * 0.005 + time) * 18;
          const mouseDisplacement =
            Math.sin(distToMouse * 0.02 - time * 3) * (mouseFactor * 45);

          const y = baseY + wave1 + wave2 + wave3 + mouseDisplacement;

          if (c === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const alpha =
          0.08 + rowNorm * 0.18 + Math.min(scrollVelocity * 0.01, 0.25);
        const template =
          r % 3 === 0
            ? palette.waveStrokes[0]
            : r % 2 === 0
              ? palette.waveStrokes[1]
              : palette.waveStrokes[2];
        const factor = r % 3 === 0 ? 0.9 : r % 2 === 0 ? 1.15 : 0.7;
        ctx.strokeStyle = template.replace(
          "ALPHA",
          (alpha * factor).toFixed(3)
        );
        ctx.stroke();
      }

      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const px = (((i * 137.5 + time * 30) % width) + width) % width;
        const py =
          (((i * 219.3 + Math.sin(time + i) * 60 + scrollY * 0.2) % height) +
            height) %
          height;
        const pSize = (Math.sin(time * 2 + i) + 1.5) * 1.2;

        ctx.fillStyle =
          i % 2 === 0
            ? palette.particleColors[0]
            : palette.particleColors[1];
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    triggerStaticRedrawRef.current = () => {
      if (reducedMotionQuery.matches || document.hidden) {
        drawFrame(false);
      }
    };

    const tick = () => {
      if (document.hidden || reducedMotionQuery.matches) {
        animationFrameId = 0;
        return;
      }
      drawFrame(true);
      animationFrameId = requestAnimationFrame(tick);
    };

    const startOrStopLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      if (reducedMotionQuery.matches) {
        drawFrame(false);
        return;
      }
      if (!document.hidden) {
        tick();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", startOrStopLoop);
    reducedMotionQuery.addEventListener("change", startOrStopLoop);

    startOrStopLoop();

    return () => {
      triggerStaticRedrawRef.current = null;
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", startOrStopLoop);
      reducedMotionQuery.removeEventListener("change", startOrStopLoop);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const opacityClass = getThemePalette(theme).fluidMesh.canvasOpacityClass;

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "fixed inset-0 pointer-events-none z-0 print:hidden",
        opacityClass
      )}
      aria-hidden="true"
    />
  );
}
