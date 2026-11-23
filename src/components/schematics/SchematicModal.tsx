"use client";

import React from "react";
import type { SchematicNode } from "@/data/schematicsData";
import ModalShell from "@/components/ui/ModalShell";
import { X, CheckCircle2, Cpu, FileCode, ArrowRight } from "lucide-react";

interface SchematicModalProps {
  node: SchematicNode | null;
  onClose: () => void;
}

export default function SchematicModal({ node, onClose }: SchematicModalProps) {
  return (
    <ModalShell
      isOpen={Boolean(node)}
      onClose={onClose}
      ariaLabelledBy="schematic-modal-title"
      panelClassName="max-w-2xl p-6"
    >
      {node && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between border-b border-line-subtle pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent-cobalt/15 border border-accent-cobalt/35 text-accent-cyan-ink uppercase font-semibold">
                  {node.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-status-emerald-ink">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  {node.status}
                </span>
              </div>
              <h2
                id="schematic-modal-title"
                className="text-xl font-bold text-ink-primary tracking-wide"
              >
                {node.label}
              </h2>
              <p className="text-xs font-mono text-ink-muted">{node.subtitle}</p>
            </div>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              className="inline-flex items-center justify-center min-h-[32px] min-w-[32px] text-ink-muted hover:text-ink-primary p-1.5 rounded-lg hover:bg-surface-recessed transition-colors cursor-pointer"
              aria-label="Close schematic details"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Protocol & Description */}
          <div className="space-y-4">
            <div className="bg-surface-recessed border border-line-subtle rounded-xl p-3.5">
              <span className="text-[11px] font-mono uppercase text-ink-muted block mb-1">
                Architecture Role &amp; Protocol
              </span>
              <p className="text-sm font-semibold text-accent-cyan-ink mb-1">
                {node.details.protocol}
              </p>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {node.details.description}
              </p>
            </div>

            {/* Technical Specifications */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-2 flex items-center gap-1.5">
                <Cpu
                  className="w-3.5 h-3.5 text-accent-cyan-ink"
                  aria-hidden="true"
                />
                Engineered Specifications
              </span>
              <ul className="space-y-1.5 text-xs text-ink-secondary">
                {node.details.technicalSpecs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight
                      className="w-3.5 h-3.5 text-accent-cobalt dark:text-accent-cyan shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Live Code / Packet Frame Preview (Anodized Cockpit Terminal Bay) */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-2 flex items-center gap-1.5">
                <FileCode
                  className="w-3.5 h-3.5 text-accent-cyan-ink"
                  aria-hidden="true"
                />
                Test Automation Script / Signal Payload
              </span>
              <div className="bg-surface-terminal border border-line-subtle rounded-xl p-3.5 overflow-x-auto scrollbar-cockpit">
                <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
                  <code>{node.details.sampleCodeOrPayload}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-3 border-t border-line-subtle flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[34px] px-4 py-1.5 rounded-lg bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong text-xs font-mono font-medium text-ink-primary transition-colors cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}
