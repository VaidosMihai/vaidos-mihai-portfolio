"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { cardSurfaceClasses, type CardSurfaceVariant } from "@/lib/ui";

interface TiltCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  variant?: CardSurfaceVariant;
}

const SPRING_CONFIG = { stiffness: 280, damping: 24, mass: 0.6 };

export default function TiltCard({
  children,
  className,
  glowColor = "var(--spotlight-glow)",
  maxTilt = 7,
  variant = "default",
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  style,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawScale = useMotionValue(1);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowOpacity = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, SPRING_CONFIG);
  const rotateY = useSpring(rawRotateY, SPRING_CONFIG);
  const scale = useSpring(rawScale, SPRING_CONFIG);

  const spotlightBg = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 60%)`;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shouldReduceMotion) {
      rawScale.set(1.01);
      glowOpacity.set(1);
    }
    onMouseEnter?.(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shouldReduceMotion && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        rawRotateX.set(((y - centerY) / centerY) * -maxTilt);
        rawRotateY.set(((x - centerX) / centerX) * maxTilt);
        mouseX.set(x);
        mouseY.set(y);
      }
    }
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawScale.set(1);
    glowOpacity.set(0);
    onMouseLeave?.(e);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: shouldReduceMotion ? undefined : "preserve-3d",
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        scale: shouldReduceMotion ? 1 : scale,
        ...style,
      }}
      className={cn(
        cardSurfaceClasses(variant),
        "tilt-card-root relative overflow-hidden p-6 hover:border-line-strong",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Radial Specular Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 print:hidden"
        style={{
          opacity: glowOpacity,
          background: spotlightBg,
        }}
        aria-hidden="true"
      />

      {/* Card Content */}
      <div
        style={shouldReduceMotion ? undefined : { transform: "translateZ(18px)" }}
        className="tilt-card-content relative z-10 w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}
