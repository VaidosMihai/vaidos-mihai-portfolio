"use client";

import React, { useState } from "react";
import { SCHEMATICS_DATA, type SchematicNode } from "@/data/schematicsData";
import SchematicModal from "./SchematicModal";
import TiltCard from "../motion/TiltCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PillTabs } from "@/components/ui/PillTabs";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  Layers,
  ArrowRight,
  Zap,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";

export default function InteractiveSchematicsSection() {
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<SchematicNode | null>(null);

  const currentFlow = SCHEMATICS_DATA[activeFlowIndex] ?? SCHEMATICS_DATA[0];
  if (!currentFlow) return null;

  const tabItems = SCHEMATICS_DATA.map((flow) => ({
    value: flow.id,
    label: flow.tabLabel,
  }));

  return (
    <section id="schematics" className="relative py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={<Layers className="w-3.5 h-3.5" />}
          badge="INTERACTIVE SYSTEM ARCHITECTURES"
          title="Embedded Automotive & Protocol Workflows"
          description="Click any node below to inspect real test scripts, serial protocols, CAN payloads, and validation criteria."
          actions={
            <PillTabs
              mode="tabs"
              idPrefix="schematic-flow"
              ariaLabel="Architecture workflow diagrams"
              items={tabItems}
              value={currentFlow.id}
              onChange={(val) => {
                const idx = SCHEMATICS_DATA.findIndex((f) => f.id === val);
                if (idx >= 0) setActiveFlowIndex(idx);
              }}
            />
          }
        />

        {/* Active & Preserved Tab Panels so PillTabs aria-controls always resolves in the DOM */}
        {SCHEMATICS_DATA.map((flow) => {
          const isActive = flow.id === currentFlow.id;
          return (
            <TiltCard
              key={flow.id}
              hidden={!isActive}
              variant="elevated"
              role="tabpanel"
              id={`schematic-flow-panel-${flow.id}`}
              aria-labelledby={`schematic-flow-tab-${flow.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`p-6 sm:p-8 ${!isActive ? "hidden" : ""}`}
            >
              {/* Flow Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-4 mb-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-accent-cyan-ink bg-accent-cobalt/10 border border-accent-cobalt/30 px-2.5 py-0.5 rounded font-semibold">
                    {flow.projectBadge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-ink-primary mt-2">
                    {flow.title}
                  </h3>
                  <p className="text-xs text-ink-muted font-mono mt-0.5">
                    {flow.subtitle}
                  </p>
                </div>

                <StatusPill
                  tone="emerald"
                  pulse
                  label="LIVE TEST BENCH COMPLIANT"
                />
              </div>

              {/* Flow Nodes Pipeline */}
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {flow.nodes.map((node, i) => (
                    <div key={node.id} className="relative group">
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => setSelectedNode(node)}
                        className="w-full text-left p-4 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong transition-all duration-200 hover:shadow-card flex flex-col justify-between min-h-[10rem] cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-line-subtle text-ink-muted uppercase">
                              Step 0{i + 1}
                            </span>
                            <span className="text-[10px] font-mono text-status-emerald-ink flex items-center gap-1 font-semibold">
                              <CheckCircle2
                                className="w-3 h-3"
                                aria-hidden="true"
                              />
                              {node.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-ink-primary group-hover:text-accent-cyan-ink transition-colors">
                            {node.label}
                          </h4>
                          <p className="text-xs text-ink-muted mt-1 line-clamp-2">
                            {node.subtitle}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted pt-2 border-t border-line-hairline group-hover:text-accent-cyan-ink">
                          <span className="flex items-center gap-1">
                            <Info
                              className="w-3 h-3 text-accent-cobalt dark:text-accent-cyan"
                              aria-hidden="true"
                            />
                            Inspect Spec
                          </span>
                          <ChevronRight
                            className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
                            aria-hidden="true"
                          />
                        </div>
                      </button>

                      {i < flow.nodes.length - 1 && (
                        <div
                          aria-hidden="true"
                          className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-20 pointer-events-none"
                        >
                          <ArrowRight className="w-4 h-4 text-accent-cyan-ink/80 animate-pulse motion-reduce:animate-none" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Hint Ticker */}
                <div className="mt-6 pt-4 border-t border-line-subtle flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <Zap
                      className="w-3.5 h-3.5 text-accent-amber-ink"
                      aria-hidden="true"
                    />
                    Data flow moves left to right through automated testing gates
                  </span>
                  <span className="text-accent-cyan-ink font-medium">
                    Click any step for technical payloads
                  </span>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Detail Inspector Modal */}
      <SchematicModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </section>
  );
}
