"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  INITIAL_TELEMETRY_LOGS,
  STREAM_POOL,
  type TelemetryLogEntry,
} from "@/data/telemetryMock";
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import TiltCard from "@/components/motion/TiltCard";

const MAX_LOG_HISTORY = 31;

function formatLogTimestamp(offsetMs = 0): string {
  const now = new Date(Date.now() + offsetMs);
  const hms = now.toTimeString().split(" ")[0] ?? "00:00:00";
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${hms}.${ms}`;
}

export default function TelemetrySimulator() {
  const [logs, setLogs] = useState<TelemetryLogEntry[]>(INITIAL_TELEMETRY_LOGS);
  const [isStreaming, setIsStreaming] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);
  const nextIdRef = useRef(1);
  const isVisibleRef = useRef(true);

  const allocateId = (prefix: string) => {
    const id = `${prefix}-${nextIdRef.current}`;
    nextIdRef.current += 1;
    return id;
  };

  // Auto-scroll ONLY internally after initial mount
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const container = terminalContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [logs]);

  // Track viewport visibility so offscreen polling pauses cleanly
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Periodic simulated log stream
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      if (document.hidden || !isVisibleRef.current) return;
      const randomEntry =
        STREAM_POOL[Math.floor(Math.random() * STREAM_POOL.length)];
      if (!randomEntry) return;

      const entry: TelemetryLogEntry = {
        id: allocateId("stream"),
        timestamp: formatLogTimestamp(),
        source: randomEntry.source,
        level: randomEntry.level,
        message: randomEntry.message,
      };

      setLogs((prev) => [...prev, entry].slice(-MAX_LOG_HISTORY));
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const triggerEcallSanity = () => {
    const sequence: TelemetryLogEntry[] = [
      {
        id: allocateId("ecall"),
        timestamp: formatLogTimestamp(0),
        source: "UART",
        level: "DEBUG",
        message: "HIL_Trigger: SOS emergency button latched on hardware pin.",
      },
      {
        id: allocateId("ecall"),
        timestamp: formatLogTimestamp(140),
        source: "DLT",
        level: "INFO",
        message:
          "[ECALL] Fallback triggered: Attempting 2G circuit-switched emergency audio route.",
      },
      {
        id: allocateId("ecall"),
        timestamp: formatLogTimestamp(380),
        source: "PYTEST",
        level: "PASS",
        message:
          "test_ecall_pipeline.py::test_hardware_sos_latch PASSED in 0.38s",
      },
    ];

    setLogs((prev) => [...prev, ...sequence].slice(-MAX_LOG_HISTORY));
  };

  const injectCanFrame = () => {
    const entry: TelemetryLogEntry = {
      id: allocateId("can"),
      timestamp: formatLogTimestamp(),
      source: "CAN",
      level: "INFO",
      message:
        "[ID 0x3A2] Injected CAN Frame: DLC=8 DATA=[4F 2A 00 C1 12 05 99 DF] CRC=VALID",
    };

    setLogs((prev) => [...prev, entry].slice(-MAX_LOG_HISTORY));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const resetLogs = () => {
    setLogs(INITIAL_TELEMETRY_LOGS);
  };

  return (
    <section
      ref={sectionRef}
      id="telemetry"
      className="relative py-12 scroll-mt-20 print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">
          Live DLT, UART, and Vector CANoe Diagnostic Telemetry Simulator
        </h2>

        <TiltCard variant="elevated" className="p-0 overflow-hidden">
          {/* Terminal Window Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-surface-recessed border-b border-line-subtle">
            <div className="flex items-center gap-3">
              {/* Traffic light terminal dots */}
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/40 inline-block" />
              </div>
              <span className="text-xs font-mono text-ink-primary font-semibold flex items-center gap-1.5 ml-1">
                <Terminal
                  className="w-3.5 h-3.5 text-accent-cobalt dark:text-accent-cyan"
                  aria-hidden="true"
                />
                telematics-diagnostic-console — vaidos-qa-hil-bench
              </span>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-status-emerald-ink font-semibold">
                <span
                  aria-hidden="true"
                  className={`w-2 h-2 rounded-full bg-status-emerald ${
                    isStreaming ? "animate-ping motion-reduce:animate-none" : ""
                  }`}
                />
                {isStreaming ? "LOG STREAM ACTIVE" : "STREAM PAUSED"}
              </span>
              <span className="text-line-subtle hidden sm:inline" aria-hidden="true">
                |
              </span>
              <span className="text-ink-muted hidden sm:inline">
                PROTOCOL: CANoe / DLT / UART
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 bg-surface border-b border-line-subtle text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={!isStreaming}
                onClick={() => setIsStreaming((prev) => !prev)}
                className="inline-flex items-center gap-1.5 min-h-[30px] px-3 py-1 rounded-lg bg-surface-recessed border border-line-subtle hover:border-line-strong text-ink-primary transition-colors cursor-pointer"
              >
                {isStreaming ? (
                  <>
                    <Pause
                      className="w-3 h-3 text-accent-amber-ink"
                      aria-hidden="true"
                    />
                    <span>Pause Stream</span>
                  </>
                ) : (
                  <>
                    <Play
                      className="w-3 h-3 text-status-emerald-ink"
                      aria-hidden="true"
                    />
                    <span>Resume Stream</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={triggerEcallSanity}
                className="inline-flex items-center gap-1.5 min-h-[30px] px-3 py-1 rounded-lg bg-accent-cobalt hover:bg-accent-cobalt/90 border border-accent-cobalt/50 text-white font-semibold transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3" aria-hidden="true" />
                <span>Trigger eCall Sanity</span>
              </button>

              <button
                type="button"
                onClick={injectCanFrame}
                className="inline-flex items-center gap-1.5 min-h-[30px] px-3 py-1 rounded-lg bg-surface-recessed border border-line-subtle hover:border-line-strong text-ink-primary transition-colors cursor-pointer"
              >
                <AlertTriangle
                  className="w-3 h-3 text-accent-amber-ink"
                  aria-hidden="true"
                />
                <span>Inject CAN Frame</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {logs.length === 0 && (
                <button
                  type="button"
                  onClick={resetLogs}
                  className="inline-flex items-center gap-1 min-h-[30px] px-2.5 py-1 rounded-lg text-accent-cyan-ink hover:bg-surface-recessed transition-colors cursor-pointer"
                >
                  Restore Baseline
                </button>
              )}
              <button
                type="button"
                onClick={clearLogs}
                className="inline-flex items-center gap-1 min-h-[30px] px-2.5 py-1 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-surface-recessed transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Clear Console</span>
              </button>
            </div>
          </div>

          {/* Anodized Dark Cockpit Instrument Output Body */}
          <div
            ref={terminalContainerRef}
            role="region"
            aria-label="Diagnostic telemetry log output"
            tabIndex={0}
            data-lenis-prevent="true"
            className="p-4 sm:p-6 font-mono text-xs max-h-72 sm:max-h-80 overflow-y-auto space-y-1.5 bg-surface-terminal text-ink-terminal scrollbar-cockpit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cyan"
          >
            {logs.length === 0 ? (
              <div className="text-slate-400 py-8 text-center italic">
                {isStreaming
                  ? 'Terminal cleared. Waiting for next live stream frame, or click "Trigger eCall Sanity" / "Inject CAN Frame".'
                  : 'Terminal cleared. Click "Trigger eCall Sanity", "Inject CAN Frame", or "Resume Stream" to inspect live log frames.'}
              </div>
            ) : (
              logs.map((log) => {
                let badgeColor =
                  "bg-slate-800 text-slate-200 border-slate-600/60";
                if (log.source === "CAN")
                  badgeColor =
                    "bg-blue-950/90 text-sky-200 border-sky-500/40";
                if (log.source === "DLT")
                  badgeColor =
                    "bg-purple-950/90 text-purple-200 border-purple-500/40";
                if (log.source === "PYTEST")
                  badgeColor =
                    "bg-emerald-950/90 text-emerald-200 border-emerald-500/40";
                if (log.source === "UART")
                  badgeColor =
                    "bg-amber-950/90 text-amber-200 border-amber-500/40";

                let levelColor = "text-sky-300";
                if (log.level === "DEBUG") levelColor = "text-slate-400";
                if (log.level === "PASS")
                  levelColor = "text-emerald-400 font-semibold";
                if (log.level === "WARN") levelColor = "text-amber-300";
                if (log.level === "ERROR")
                  levelColor = "text-rose-400 font-bold";

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-2 hover:bg-white/5 py-0.5 px-1.5 rounded transition-colors"
                  >
                    <span className="text-slate-400 select-none shrink-0 w-24 tabular-nums">
                      [{log.timestamp}]
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold shrink-0 ${badgeColor}`}
                    >
                      {log.source}
                    </span>
                    <span
                      className={`text-[10px] font-bold shrink-0 w-12 ${levelColor}`}
                    >
                      [{log.level}]
                    </span>
                    <span className="text-slate-100 min-w-0 flex-1 break-all sm:break-words">
                      {log.message}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Terminal Footer Status */}
          <div className="px-4 sm:px-6 py-2.5 bg-surface-recessed border-t border-line-subtle flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-ink-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck
                className="w-3.5 h-3.5 text-status-emerald-ink shrink-0"
                aria-hidden="true"
              />
              Automotive Safety Gate: eCall (E-Call Ready), Parking Assistant
              (ISO 26262 compliant workflow)
            </span>
            <span className="text-ink-primary font-semibold tabular-nums">
              Frames in Buffer: {logs.length}
            </span>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
