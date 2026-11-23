"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  className?: string;
}

const MAGNETIC_SPRING = { stiffness: 350, damping: 20, mass: 0.4 };

export default function MagneticButton({
  children,
  className,
  type = "button",
  onMouseMove,
  onMouseLeave,
  style,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, MAGNETIC_SPRING);
  const y = useSpring(rawY, MAGNETIC_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!shouldReduceMotion && buttonRef.current) {
      const { left, top, width, height } =
        buttonRef.current.getBoundingClientRect();
      rawX.set((e.clientX - (left + width / 2)) * 0.3);
      rawY.set((e.clientY - (top + height / 2)) * 0.3);
    }
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    rawX.set(0);
    rawY.set(0);
    onMouseLeave?.(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: shouldReduceMotion ? 0 : x,
        y: shouldReduceMotion ? 0 : y,
        ...style,
      }}
      className={cn(
        "relative inline-flex items-center justify-center font-medium transition-colors select-none cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
