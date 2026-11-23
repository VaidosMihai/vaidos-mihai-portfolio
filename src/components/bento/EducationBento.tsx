import React from "react";
import { EDUCATION_DATA, CERTIFICATIONS } from "@/data/experience";
import TiltCard from "@/components/motion/TiltCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechTag } from "@/components/ui/TechTag";
import { getSafeExternalUrl } from "@/lib/url";
import {
  GraduationCap,
  Award,
  BookOpen,
  Network,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function EducationBento() {
  return (
    <section id="education" className="relative py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={<GraduationCap className="w-3.5 h-3.5" />}
          badge="ACADEMIC FOUNDATION & VERIFIED CERTIFICATIONS"
          title="Engineering Degree & Verified Technical Credentials"
          description="Accredited 4-year Computer Engineering degree backed by official Python Institute, Modern C++, and Java certifications, with formal Cisco Networking Academy university coursework on record."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Degree Card (Spans 2 cols) */}
          <TiltCard
            variant="elevated"
            className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Institution & Degree */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-4">
                <div>
                  <span className="text-xs font-mono text-accent-cyan-ink px-2.5 py-0.5 rounded bg-accent-cobalt/15 border border-accent-cobalt/35 font-semibold">
                    4-Year Engineering Program (CTI)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-ink-primary mt-2">
                    {EDUCATION_DATA.institution}
                  </h3>
                  <p className="text-sm font-mono text-ink-muted">
                    {EDUCATION_DATA.degree} — {EDUCATION_DATA.specialization}
                  </p>
                </div>
                <div className="text-xs font-mono text-ink-muted sm:text-right">
                  <span>{EDUCATION_DATA.period}</span>
                  <p>{EDUCATION_DATA.location}</p>
                </div>
              </div>

              {/* Bachelor's Thesis Box */}
              <div className="bg-surface-recessed border border-line-subtle rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-cyan-ink mb-1.5">
                  <BookOpen
                    className="w-4 h-4 text-accent-cobalt dark:text-accent-cyan"
                    aria-hidden="true"
                  />
                  <span className="uppercase font-semibold tracking-wider">
                    Bachelor&apos;s Thesis Project
                  </span>
                </div>
                <h4 className="text-base font-bold text-ink-primary mb-1">
                  {EDUCATION_DATA.thesis.title}
                </h4>
                <p className="text-xs font-mono text-accent-cyan-ink mb-2">
                  Stack: {EDUCATION_DATA.thesis.technologies}
                </p>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {EDUCATION_DATA.thesis.description}
                </p>
              </div>

              {/* Cisco Networking Academy Coursework on Record */}
              <div className="bg-surface-recessed border border-line-subtle rounded-xl p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent-cyan-ink">
                    <Network
                      className="w-4 h-4 text-accent-cobalt dark:text-accent-cyan"
                      aria-hidden="true"
                    />
                    <span className="uppercase font-semibold tracking-wider">
                      {EDUCATION_DATA.ciscoCoursework.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-line-subtle text-ink-muted">
                    NetAcad ID: {EDUCATION_DATA.ciscoCoursework.netacadId}
                  </span>
                </div>

                <p className="text-xs text-status-emerald-ink font-mono mb-3 font-medium">
                  ✓ {EDUCATION_DATA.ciscoCoursework.statusNote}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EDUCATION_DATA.ciscoCoursework.courses.map((course) => (
                    <div
                      key={course.code}
                      className="p-3 rounded-lg bg-surface border border-line-subtle text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono font-bold text-ink-primary text-[11px]">
                          {course.code}
                        </span>
                        <span className="text-[10px] font-mono text-ink-muted shrink-0">
                          {course.period}
                        </span>
                      </div>
                      <p className="text-ink-secondary text-[11px] leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Coursework */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink-muted block mb-2">
                  Core Engineering Curriculum Coursework:
                </span>
                <div className="flex flex-wrap gap-2">
                  {EDUCATION_DATA.keyCoursework.map((course) => (
                    <TechTag key={course}>{course}</TechTag>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-line-hairline flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-muted">
              <span>Computer and Information Technology Engineering</span>
              <span className="text-status-emerald-ink flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                University Accredited Degree
              </span>
            </div>
          </TiltCard>

          {/* Verified Certifications Column */}
          <div className="space-y-4">
            {CERTIFICATIONS.map((cert) => {
              const safeVerifyUrl = getSafeExternalUrl(cert.verifyUrl);

              return (
                <TiltCard key={cert.id} className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-lg bg-accent-cobalt/15 border border-accent-cobalt/35 shrink-0">
                      <Award
                        className="w-4 h-4 text-accent-cyan-ink"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="text-right flex items-center gap-1.5">
                      {cert.duration && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-recessed border border-line-subtle text-ink-muted">
                          {cert.duration}
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-recessed border border-line-subtle text-ink-primary font-semibold">
                        {cert.year}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-ink-primary mt-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-mono text-accent-cyan-ink mt-0.5">
                    {cert.issuer}
                  </p>

                  {cert.credentialId && (
                    <p className="text-[10px] font-mono text-ink-muted mt-1 break-all">
                      Credential ID: {cert.credentialId}
                    </p>
                  )}

                  <p className="text-ink-secondary mt-2 font-mono text-[11px] leading-relaxed">
                    {cert.topics}
                  </p>

                  {safeVerifyUrl && (
                    <div className="mt-3 pt-2 border-t border-line-hairline">
                      <a
                        href={safeVerifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 min-h-[28px] py-1 text-[11px] font-mono text-accent-cyan-ink hover:underline font-semibold"
                      >
                        <span>Verify Certificate</span>
                        <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </div>
                  )}
                </TiltCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
