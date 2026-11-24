"use client";

import React from "react";
import { ChevronDown, FolderTree, Layers, Sparkles } from "lucide-react";
import {
  GRAITEC_MODULES,
  GRAITEC_NODE_SPECS,
  type GraitecModuleId,
  type GraitecTreeNodeId,
} from "./graitecCadScene";

interface GraitecMvvmInspectorProps {
  mode: "auto" | "manual";
  activeSelection: GraitecTreeNodeId;
  builtModules: Record<GraitecModuleId, boolean>;
  perforationActive: boolean;
  onSelectNode: (id: GraitecTreeNodeId) => void;
}

export default function GraitecMvvmInspector({
  mode,
  activeSelection,
  builtModules,
  perforationActive,
  onSelectNode,
}: GraitecMvvmInspectorProps) {
  const activeSpec = GRAITEC_NODE_SPECS[activeSelection];

  return (
    <aside
      aria-label="Pure MVVM WPF Hierarchical TreeView and Properties Inspector"
      className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-line-subtle bg-surface-recessed/80 text-xs font-mono h-full"
    >
      {/* Top Bar: WPF Tool Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-line-hairline bg-surface/60">
        <span className="flex items-center gap-1.5 font-bold text-[11px] text-ink-primary">
          <FolderTree
            className="w-3.5 h-3.5 text-accent-cyan-ink"
            aria-hidden="true"
          />
          WPF PURE MVVM
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded border ${
            perforationActive || mode === "auto"
              ? "bg-status-emerald/15 border-status-emerald/35 text-status-emerald-ink font-semibold"
              : "bg-surface border-line-subtle text-ink-muted"
          }`}
        >
          {mode === "auto" ? "AUTO DEMO" : "INotify SYNC"}
        </span>
      </div>

      {/* HierarchicalDataTemplate TreeView */}
      <div className="px-3 py-1.5 space-y-0.5 overflow-y-auto md:overflow-visible">
        <div className="flex items-center gap-1.5 text-[10px] text-ink-muted uppercase tracking-wider mb-0.5">
          <ChevronDown className="w-3 h-3" aria-hidden="true" />
          <span>AdvanceDesignModelVM</span>
        </div>

        <div className="pl-2 border-l border-line-subtle space-y-0.5">
          {GRAITEC_MODULES.map((modId) => {
            const spec = GRAITEC_NODE_SPECS[modId];
            const isSelected = activeSelection === modId;
            const isBuilt = builtModules[modId];

            return (
              <React.Fragment key={modId}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectNode(modId)}
                  className={`w-full flex items-center justify-between gap-2 px-2 py-[3px] rounded text-left text-[11px] transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-accent-cobalt text-white font-semibold"
                      : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Layers className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{spec.label}</span>
                  </span>
                  <span
                    className={`text-[9px] px-1 rounded shrink-0 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : isBuilt
                          ? "text-status-emerald-ink bg-status-emerald/10"
                          : "text-ink-muted"
                    }`}
                  >
                    {isBuilt ? "BUILT" : "IDLE"}
                  </span>
                </button>

                {modId === "wall" && (
                  <div className="pl-3 border-l border-line-hairline ml-1.5">
                    <button
                      type="button"
                      aria-pressed={activeSelection === "perforation"}
                      onClick={() => onSelectNode("perforation")}
                      className={`w-full flex items-center justify-between gap-2 px-2 py-[3px] rounded text-left text-[10.5px] transition-colors cursor-pointer ${
                        activeSelection === "perforation"
                          ? "bg-accent-amber text-white font-semibold"
                          : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
                      }`}
                    >
                      <span className="flex items-center gap-1 truncate">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">OpeningBoolean3D</span>
                      </span>
                      <span
                        className={`text-[9px] px-1 rounded shrink-0 ${
                          activeSelection === "perforation"
                            ? "bg-white/20 text-white"
                            : perforationActive
                              ? "text-accent-amber-ink bg-accent-amber/15"
                              : "text-ink-muted"
                        }`}
                      >
                        {perforationActive ? "CSG OK" : "WAIT"}
                      </span>
                    </button>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ContentControl Bound ViewModel Properties */}
      <div className="px-3 py-2 border-t border-line-hairline bg-surface/75 space-y-1">
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <span className="text-ink-muted shrink-0">DataContext:</span>
          <span className="font-bold text-accent-cyan-ink truncate">
            {activeSpec.viewModel}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <span className="text-ink-muted shrink-0">Standard:</span>
          <span className="text-ink-primary font-semibold truncate">
            {activeSpec.codeStandard}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <span className="text-ink-muted shrink-0">{activeSpec.specLabel}:</span>
          <span className="text-status-emerald-ink font-bold text-right">
            {activeSpec.specValue}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <span className="text-ink-muted shrink-0">Detail:</span>
          <span className="text-ink-secondary truncate">
            {activeSpec.rebarOrMesh}
          </span>
        </div>
      </div>
    </aside>
  );
}
