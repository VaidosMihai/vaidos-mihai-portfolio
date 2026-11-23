"use client";

import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { WORK_EXPERIENCE, type ProjectDetail } from "@/data/experience";
import TiltCard from "@/components/motion/TiltCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PillTabs } from "@/components/ui/PillTabs";
import { TechTag } from "@/components/ui/TechTag";
import { usePortfolioUI } from "@/components/shell/PortfolioUIProvider";
import { PILL_BAR_FILTERS, matchesProjectFilter } from "@/lib/filters";
import {
  Briefcase,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Tag,
  Filter,
  Layers,
  X,
} from "lucide-react";

type EnrichedProject = ProjectDetail & { company: string; location: string };

const ALL_PROJECTS: EnrichedProject[] = WORK_EXPERIENCE.flatMap((comp) =>
  comp.projects.map((proj) => ({
    ...proj,
    company: comp.company,
    location: comp.location,
  }))
);

export default function ExperienceBento() {
  const { activeTechFilter, setActiveTechFilter } = usePortfolioUI();
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [expandedProjects, setExpandedProjects] = useState<
    Record<string, boolean>
  >({
    "harman-mazda": true,
    cariad: true,
    "bmw-parking": true,
    "graitec-advance": true,
  });

  // Expand all project cards synchronously when printing resume
  useEffect(() => {
    const expandAllForPrint = () => {
      flushSync(() => {
        setExpandedProjects((prev) => {
          const next: Record<string, boolean> = { ...prev };
          for (const p of ALL_PROJECTS) next[p.id] = true;
          return next;
        });
      });
    };
    window.addEventListener("beforeprint", expandAllForPrint);
    return () => window.removeEventListener("beforeprint", expandAllForPrint);
  }, []);

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const currentFilter = activeTechFilter || selectedFilter;
  const filteredProjects = ALL_PROJECTS.filter((proj) =>
    matchesProjectFilter(proj, currentFilter)
  );

  const pillItems = PILL_BAR_FILTERS.map((f) => ({
    value: f.id,
    label: f.label,
  }));

  const isPillValue = PILL_BAR_FILTERS.some((f) => f.id === currentFilter);

  const clearAllFilters = () => {
    setSelectedFilter("ALL");
    setActiveTechFilter(undefined);
  };

  return (
    <section id="experience" className="relative py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={<Briefcase className="w-3.5 h-3.5" />}
          badge="CAREER HISTORY & MISSION-CRITICAL PROJECTS"
          title="Work Experience & Engineering Milestones"
          description="Over 3.5 years of enterprise delivery across automotive telematics, ECU protocol validation, and engineering software."
          actions={
            <PillTabs
              mode="filter"
              ariaLabel="Filter experience by technology"
              prefixIcon={<Filter className="w-3.5 h-3.5" />}
              items={pillItems}
              value={isPillValue ? currentFilter : ""}
              className="print:hidden"
              onChange={(val) => {
                setSelectedFilter(val);
                setActiveTechFilter(undefined);
              }}
            />
          }
        />

        {/* Active Filter Banner & Live Count */}
        {currentFilter !== "ALL" && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-surface-recessed border border-line-subtle text-xs font-mono print:hidden"
          >
            <span className="text-ink-secondary">
              Filtering by{" "}
              <strong className="text-accent-cyan-ink">{currentFilter}</strong>{" "}
              — showing {filteredProjects.length} of {ALL_PROJECTS.length}{" "}
              projects
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 min-h-[28px] px-2.5 py-1 rounded-lg bg-surface border border-line-subtle hover:border-line-strong text-ink-primary transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" aria-hidden="true" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}

        {/* Projects List or Empty State */}
        {filteredProjects.length === 0 ? (
          <TiltCard className="p-8 text-center">
            <p className="text-sm font-mono text-ink-primary mb-2">
              No projects match the filter &quot;{currentFilter}&quot;.
            </p>
            <p className="text-xs text-ink-muted mb-4">
              Reset the active filter to inspect all automotive and CAD
              engineering engagements.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="min-h-[34px] px-4 py-1.5 rounded-xl bg-accent-cobalt hover:bg-accent-cobalt/90 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              Show All Projects
            </button>
          </TiltCard>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => {
              const isExpanded = Boolean(expandedProjects[project.id]);

              return (
                <TiltCard
                  key={project.id}
                  variant="elevated"
                  className="p-6 sm:p-8"
                >
                  {/* Project Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-line-subtle pb-4 mb-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-accent-cobalt/15 border border-accent-cobalt/35 text-accent-cyan-ink font-semibold">
                          {project.client}
                        </span>
                        <span className="text-xs font-mono text-ink-muted">
                          {project.company}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-ink-primary tracking-wide">
                        {project.projectTitle}
                      </h3>

                      <p className="text-sm font-mono text-accent-cyan-ink mt-0.5 font-medium">
                        {project.role}
                      </p>
                    </div>

                    <div className="flex flex-col lg:items-end justify-between gap-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                          {project.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                          {project.location}
                        </span>
                      </div>

                      {project.metrics && (
                        <div className="flex flex-wrap items-center gap-2">
                          {project.metrics.map((m, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-recessed border border-line-subtle text-ink-primary"
                            >
                              <strong>{m.value}</strong> {m.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-ink-secondary leading-relaxed mb-4">
                    {project.summary}
                  </p>

                  {/* Highlights Accordion Content */}
                  {isExpanded && (
                    <div
                      id={`project-details-${project.id}`}
                      className="space-y-4 pt-3 mb-6 border-t border-line-hairline animate-slide-down"
                    >
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-ink-muted block mb-2">
                          Key Engineering Responsibilities &amp; Outcomes:
                        </span>
                        <ul className="space-y-2 text-xs sm:text-sm text-ink-secondary">
                          {project.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <CheckCircle
                                className="w-4 h-4 text-accent-cobalt dark:text-accent-cyan shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Graitec Advance Design Structural Modules Suite */}
                      {project.structuralModules &&
                        project.structuralModules.length > 0 && (
                          <div className="pt-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <span className="text-xs font-mono uppercase tracking-wider text-accent-cyan-ink flex items-center gap-2 font-semibold">
                                <Layers
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                                Advance Design Modules Suite (
                                {project.structuralModules.length} Dedicated
                                Structural Applications):
                              </span>
                              <span className="text-[11px] font-mono text-ink-muted bg-surface-recessed px-2.5 py-0.5 rounded border border-line-subtle">
                                Standalone CAD &amp; Autodesk Revit Add-in
                                Extensions
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {project.structuralModules.map((mod) => (
                                <div
                                  key={mod.name}
                                  className="p-3.5 rounded-xl bg-surface-recessed hover:bg-surface border border-line-subtle hover:border-line-strong transition-all duration-200 group flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                      <span className="font-bold text-ink-primary text-sm group-hover:text-accent-cyan-ink transition-colors font-mono">
                                        {mod.name}
                                      </span>
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-amber/10 text-accent-amber-ink border border-accent-amber/30 dark:bg-accent-cobalt/15 dark:text-accent-cyan-ink dark:border-accent-cobalt/35 font-semibold">
                                        {mod.category}
                                      </span>
                                    </div>
                                    <p className="text-xs text-ink-secondary leading-relaxed mb-2.5">
                                      {mod.description}
                                    </p>
                                  </div>
                                  <div className="text-[10px] font-mono text-ink-muted border-t border-line-hairline pt-2 flex items-start gap-1.5 mt-auto">
                                    <span
                                      aria-hidden="true"
                                      className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0 mt-1"
                                    />
                                    <span className="break-words">
                                      {mod.engineeringDetails}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Complex Engineering Showcase Tasks */}
                      {project.complexTasks &&
                        project.complexTasks.length > 0 && (
                          <div className="pt-2">
                            <span className="text-xs font-mono uppercase tracking-wider text-accent-cyan-ink block mb-3 font-semibold">
                              Featured Complex Engineering Implementations:
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {project.complexTasks.map((task) => (
                                <div
                                  key={task.title}
                                  className="p-4 rounded-xl bg-surface-recessed border border-line-subtle space-y-2 text-xs"
                                >
                                  <h4 className="font-bold text-ink-primary text-sm">
                                    {task.title}
                                  </h4>
                                  <p className="text-ink-muted italic">
                                    &quot;{task.context}&quot;
                                  </p>
                                  <div className="space-y-1 pt-1">
                                    <span className="font-mono text-ink-muted font-semibold uppercase text-[10px] block">
                                      Engineering Actions:
                                    </span>
                                    <ul className="space-y-1 text-ink-secondary pl-2">
                                      {task.actions.map((act, aIdx) => (
                                        <li
                                          key={aIdx}
                                          className="list-disc list-inside"
                                        >
                                          {act}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="pt-1.5 border-t border-line-hairline text-status-emerald-ink font-mono text-[11px]">
                                    <strong>Outcome:</strong> {task.result}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {/* Footer Bar: Tech Stack Badges + Toggle Button */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line-subtle">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Tag
                        className="w-3.5 h-3.5 text-ink-muted mr-1"
                        aria-hidden="true"
                      />
                      {project.stack.map((tech) => (
                        <TechTag key={tech} className="text-[11px] py-0.5 px-2">
                          {tech}
                        </TechTag>
                      ))}
                    </div>

                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`project-details-${project.id}`}
                      aria-label={`${isExpanded ? "Hide Full Details" : "Expand Full Engineering Scope"} for ${project.projectTitle}`}
                      onClick={() => toggleProject(project.id)}
                      className="min-h-[30px] px-2.5 py-1 rounded-lg text-xs font-mono text-accent-cyan-ink hover:bg-surface-recessed flex items-center gap-1 transition-colors ml-auto cursor-pointer print:hidden"
                    >
                      {isExpanded ? (
                        <>
                          <span>Hide Full Details</span>
                          <ChevronUp className="w-4 h-4" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          <span>Expand Full Engineering Scope</span>
                          <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
