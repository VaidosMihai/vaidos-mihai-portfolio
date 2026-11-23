"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: React.ReactNode;
  panelClassName?: string;
  containerClassName?: string;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export default function ModalShell({
  isOpen,
  onClose,
  ariaLabel,
  ariaLabelledBy,
  children,
  panelClassName,
  containerClassName,
}: ModalShellProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusInitial = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const autoTarget = panel.querySelector<HTMLElement>("[data-autofocus]");
      if (autoTarget) {
        autoTarget.focus();
        return;
      }
      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length > 0 && focusables[0]) {
        focusables[0].focus();
      } else {
        panel.focus();
      }
    };

    const rafId = requestAnimationFrame(focusInitial);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const panel = panelRef.current;
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;

        const active = document.activeElement;
        if (!panel.contains(active) || active === panel) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
          return;
        }

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--backdrop-scrim)] backdrop-blur-md animate-fade-in print:hidden",
        containerClassName
      )}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-h-[90vh] overflow-y-auto scrollbar-cockpit bg-surface-elevated border border-line-subtle rounded-2xl shadow-elevated text-ink-secondary animate-modal-in focus:outline-none",
          panelClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
