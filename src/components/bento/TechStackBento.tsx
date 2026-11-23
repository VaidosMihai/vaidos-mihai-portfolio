"use client";

import React, { useState } from "react";
import { SKILL_CATEGORIES, type SkillIconName } from "@/data/skills";
import TiltCard from "@/components/motion/TiltCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PillTabs } from "@/components/ui/PillTabs";
import {
  Cpu,
  Binary,
  Network,
  GitBranch,
  Layout,
  ShieldCheck,
  Check,
} from "lucide-react";

const ICON_MAP: Record<SkillIconName, React.ReactNode> = {
  Layout: (
    <Layout className="w-4 h-4 text-accent-cyan-ink" aria-hidden="true" />
  ),
  Binary: (
    <Binary className="w-4 h-4 text-accent-cyan-ink" aria-hidden="true" />
  ),
  Cpu: <Cpu className="w-4 h-4 text-accent-cyan-ink" aria-hidden="true" />,
  Network: (
    <Network className="w-4 h-4 text-accent-cyan-ink" aria-hidden="true" />
  ),
  GitBranch: (
    <GitBranch className="w-4 h-4 text-accent-cyan-ink" aria-hidden="true" />
  ),
  ShieldCheck: (
    <ShieldCheck className="w-4 h-4 text-accent-cyan-ink" aria-hidden="true" />
  ),
};

export default function TechStackBento() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filterItems = [
    { value: "ALL", label: "All Categories" },
    ...SKILL_CATEGORIES.map((cat) => ({
      value: cat.category,
      label: cat.shortLabel,
    })),
  ];

  const filteredCategories =
    activeCategory === "ALL"
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((c) => c.category === activeCategory);

  return (
    <section id="skills" className="relative py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={<Cpu className="w-3.5 h-3.5" />}
          badge="TECHNICAL COMPETENCIES & PROTOCOLS"
          title="Technical Skills Matrix"
          description="Categorized breakdown of low-level embedded software, test automation frameworks, networking protocols, and CI/CD tools."
          actions={
            <PillTabs
              mode="filter"
              ariaLabel="Filter technical skill categories"
              items={filterItems}
              value={activeCategory}
              onChange={setActiveCategory}
              className="print:hidden"
            />
          }
        />

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <TiltCard
              key={category.category}
              variant="elevated"
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent-cobalt/15 border border-accent-cobalt/35 shrink-0">
                    {ICON_MAP[category.icon]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink-primary tracking-wide">
                      {category.category}
                    </h3>
                    <p className="text-[11px] text-ink-muted font-mono mt-0.5 leading-snug">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-recessed border border-line-subtle text-xs font-mono text-ink-secondary hover:border-line-strong hover:text-ink-primary transition-colors group"
                    >
                      <Check
                        className="w-3 h-3 text-accent-cobalt dark:text-accent-cyan shrink-0"
                        aria-hidden="true"
                      />
                      <span>{skill.name}</span>
                      {skill.level && (
                        <span className="text-[10px] text-ink-muted">
                          ({skill.level})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-line-hairline flex items-center justify-between text-[11px] font-mono text-ink-muted">
                <span>Domain Verified</span>
                <span className="text-accent-cyan-ink font-semibold">
                  {category.skills.length} competencies
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
