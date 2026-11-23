"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export async function copyTextWithFallback(text: string): Promise<boolean> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand fallback if Clipboard API permission is rejected
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

interface UseClipboardCopyOptions {
  timeoutMs?: number;
  onAfterCopy?: () => void;
}

export function useClipboardCopy<T extends string = string>(
  options: UseClipboardCopyOptions = {}
) {
  const { timeoutMs = 2200, onAfterCopy } = options;
  const [copiedKey, setCopiedKey] = useState<T | null>(null);
  const [failedKey, setFailedKey] = useState<T | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const onAfterCopyRef = useRef(onAfterCopy);

  useEffect(() => {
    onAfterCopyRef.current = onAfterCopy;
  }, [onAfterCopy]);

  const clearState = useCallback(() => {
    requestIdRef.current += 1;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCopiedKey(null);
    setFailedKey(null);
  }, []);

  useEffect(() => clearState, [clearState]);

  const copy = useCallback(
    async (text: string, key: T): Promise<boolean> => {
      requestIdRef.current += 1;
      const currentRequestId = requestIdRef.current;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const ok = await copyTextWithFallback(text);
      if (requestIdRef.current !== currentRequestId) {
        return false;
      }

      if (ok) {
        setFailedKey(null);
        setCopiedKey(key);
        timerRef.current = setTimeout(() => {
          if (requestIdRef.current !== currentRequestId) return;
          setCopiedKey(null);
          timerRef.current = null;
          onAfterCopyRef.current?.();
        }, timeoutMs);
      } else {
        setCopiedKey(null);
        setFailedKey(key);
        timerRef.current = setTimeout(() => {
          if (requestIdRef.current !== currentRequestId) return;
          setFailedKey(null);
          timerRef.current = null;
        }, timeoutMs);
      }
      return ok;
    },
    [timeoutMs]
  );

  return { copiedKey, failedKey, copy, clearState };
}
