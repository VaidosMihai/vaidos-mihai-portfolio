import React from "react";
import TiltCard from "@/components/motion/TiltCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { TechTag } from "@/components/ui/TechTag";
import HeroActionDock from "./HeroActionDock";
import HeroTimelineLink from "./HeroTimelineLink";
import { Terminal, Cpu, ShieldCheck, Sparkles } from "lucide-react";

const CORE_DOMAINS = [
  "C# / .NET & WPF MVVM",
  "Autodesk Revit Extensions",
  "Python & Pandas (Data Automation)",
  "CARIAD REM Telemetry Validation",
  "Modern C++ (11/14/17)",
  "Google Test (>90% Code Coverage)",
  "Vector CANoe Protocol Analysis",
  "CMake & Bazel Build Systems",
  "Azure DevOps & GitLab CI",
  "4-Eyes Quality Gate",
  "Local Team Coordination",
  "SOLID, KISS & YAGNI Architecture",
] as const;

export default function HeroBento() {
  return (
    <section
      id="hero"
      className="relative pt-24 sm:pt-32 pb-12 print:pt-4 print:pb-6 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Main Identity & Bio */}
          <TiltCard
            variant="elevated"
            className="md:col-span-2 lg:col-span-3 p-6 sm:p-10 flex flex-col justify-between"
          >
            <div>
              {/* Status pill & location */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <StatusPill
                  tone="emerald"
                  pulse
                  label="ENGINEERING AT BERTRANDT GROUP"
                />

                <span className="text-xs font-mono text-ink-muted flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-accent-cobalt"
                  />
                  Bucharest, Romania
                </span>
              </div>

              {/* Name & Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink-primary mb-3">
                VAIDOS{" "}
                <span className="text-accent-cyan-ink">MIHAI-IULIAN</span>
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-lg font-mono text-ink-secondary mb-6">
                <span className="font-semibold text-accent-cyan-ink">
                  Software Engineer
                </span>
                <span className="text-line-subtle" aria-hidden="true">
                  •
                </span>
                <span>Data Automation, Backend &amp; Systems</span>
                <span className="text-line-subtle" aria-hidden="true">
                  •
                </span>
                <span className="text-ink-muted">Python, C#/.NET &amp; C++</span>
              </div>

              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-2xl mb-8">
                Software Engineer with over{" "}
                <strong className="text-ink-primary font-semibold">
                  3.5 years of experience
                </strong>{" "}
                across safety-critical automotive systems (
                <span className="text-accent-cyan-ink font-medium">
                  CARIAD, BMW
                </span>
                ) and structural engineering CAD software (
                <span className="text-accent-cyan-ink font-medium">
                  Graitec
                </span>
                ). Proven track record in decoupled{" "}
                <strong className="text-ink-primary font-semibold">
                  C#/.NET (WPF MVVM)
                </strong>{" "}
                desktop engines integrated into{" "}
                <span className="text-accent-cyan-ink font-medium">
                  Autodesk Revit
                </span>
                , automated{" "}
                <strong className="text-ink-primary font-semibold">
                  Python/Pandas
                </strong>{" "}
                telemetry validation pipelines (CARIAD REM), and deterministic{" "}
                <strong className="text-ink-primary font-semibold">
                  Modern C++ (11/14/17)
                </strong>{" "}
                with &gt;90% Google Test coverage.
              </p>

              {/* Print-only direct contact strip */}
              <p className="hidden print:block text-xs font-mono text-ink-secondary pt-2 border-t border-line-subtle">
                Email: vaidos.mihaiiulian@gmail.com • Phone: +40 768 194 193 •
                GitHub: github.com/VaidosMihai • LinkedIn:
                linkedin.com/in/mihai-vaidos-092900207
              </p>
            </div>

            <HeroActionDock />
          </TiltCard>

          {/* Card 2: Key Metric - 95% Coverage */}
          <TiltCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-3">
                <span className="uppercase">BMW Parking Assistant</span>
                <ShieldCheck
                  className="w-4 h-4 text-status-emerald-ink"
                  aria-hidden="true"
                />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-ink-primary font-mono tracking-tight tabular-nums">
                95<span className="text-status-emerald-ink text-2xl">%</span>
              </div>
              <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                Unit &amp; component test coverage elevated from 50% to 95% with
                Modern C++, Google Test, and Google Mock.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line-hairline flex items-center justify-between text-[11px] font-mono text-status-emerald-ink font-semibold">
              <span>Strict Automotive Gate</span>
              <span>PASSED</span>
            </div>
          </TiltCard>

          {/* Card 3: Key Metric - 30% Workload Cut */}
          <TiltCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-3">
                <span className="uppercase">Pandas Telemetry</span>
                <Cpu
                  className="w-4 h-4 text-accent-cyan-ink"
                  aria-hidden="true"
                />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-ink-primary font-mono tracking-tight tabular-nums">
                -30<span className="text-accent-cyan-ink text-2xl">%</span>
              </div>
              <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                Manual telemetry verification workload slashed across millions of
                vehicle signal samples via automated Python/Pandas ETL.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line-hairline flex items-center justify-between text-[11px] font-mono text-accent-cyan-ink font-semibold">
              <span>CARIAD Systems</span>
              <span>OPTIMIZED</span>
            </div>
          </TiltCard>

          {/* Card 4: Revit Ecosystem Integration */}
          <TiltCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-3">
                <span className="uppercase">Autodesk Revit</span>
                <Sparkles
                  className="w-4 h-4 text-accent-amber-ink"
                  aria-hidden="true"
                />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-ink-primary font-mono tracking-tight">
                3D CAD
                <span className="text-accent-amber-ink text-xl">.NET</span>
              </div>
              <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                Structural engineering calculation modules (Beam, Column,
                Footing, Wall) built in C# WPF/MVVM and embedded into Autodesk
                Revit.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line-hairline flex items-center justify-between text-[11px] font-mono text-accent-amber-ink font-semibold">
              <span>Advance Design</span>
              <span>INTEGRATED</span>
            </div>
          </TiltCard>

          {/* Card 5: Core Domain Badges & Quick Jump */}
          <TiltCard className="md:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-3">
                <span className="uppercase">
                  Core Engineering Competencies
                </span>
                <Terminal
                  className="w-4 h-4 text-accent-cobalt dark:text-accent-cyan"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CORE_DOMAINS.map((domain) => (
                  <TechTag key={domain}>{domain}</TechTag>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-line-hairline flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-muted">
              <span>
                Mission-critical engineering &amp; desktop software architecture
              </span>
              <HeroTimelineLink />
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
