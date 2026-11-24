import {
  WORK_EXPERIENCE,
  EDUCATION_DATA,
  CERTIFICATIONS,
} from "@/data/experience";
import { SKILL_CATEGORIES } from "@/data/skills";
import { SCHEMATICS_DATA } from "@/data/schematicsData";
import {
  INITIAL_TELEMETRY_LOGS,
  STREAM_POOL,
} from "@/data/telemetryMock";
import type { SectionId } from "./filters";

export type SearchResultKind =
  | "hero"
  | "showcase"
  | "schematics"
  | "telemetry"
  | "experience"
  | "skills"
  | "education"
  | "contact";

export interface SiteSearchEntry {
  id: string;
  title: string;
  subtitle: string;
  sectionLabel: string;
  sectionId: SectionId;
  kind: SearchResultKind;
  haystack: string;
  titleNormalized: string;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function buildEntry(
  partial: Omit<SiteSearchEntry, "haystack" | "titleNormalized">,
  extraKeywords: string[] = []
): SiteSearchEntry {
  const haystack = normalize(
    [
      partial.title,
      partial.subtitle,
      partial.sectionLabel,
      ...extraKeywords,
    ].join(" ")
  );
  return {
    ...partial,
    titleNormalized: normalize(partial.title),
    haystack,
  };
}

export function buildSiteSearchIndex(): SiteSearchEntry[] {
  const entries: SiteSearchEntry[] = [];

  // 1. Hero & Core Profile Metrics
  entries.push(
    buildEntry(
      {
        id: "hero-profile",
        title: "Vaidos Mihai-Iulian — Software Engineer Overview",
        subtitle:
          "3.5+ years across Data Automation, Backend, Systems, CARIAD REM, BMW & Graitec",
        sectionLabel: "Overview",
        sectionId: "hero",
        kind: "hero",
      },
      [
        "Bucharest Romania Bertrandt Group Python C# .NET Modern C++ WPF MVVM Autodesk Revit Travel Assist 95% -30% Workload Cut",
      ]
    ),
    buildEntry(
      {
        id: "hero-metric-bmw",
        title: "BMW Parking Assistant — 95% Unit & Component Coverage",
        subtitle: "Elevated from 50% to 95% with Modern C++, GTest & GMock",
        sectionLabel: "Overview Metric",
        sectionId: "hero",
        kind: "hero",
      },
      ["Strict Automotive Gate PASSED C++ Google Test Google Mock"]
    ),
    buildEntry(
      {
        id: "hero-metric-pandas",
        title: "Pandas Telemetry — -30% Manual Workload Reduction",
        subtitle:
          "Slashed manual verification across millions of CARIAD signal samples via Python ETL",
        sectionLabel: "Overview Metric",
        sectionId: "hero",
        kind: "hero",
      },
      ["CARIAD Systems OPTIMIZED CSV Excel ETL"]
    )
  );

  // 2. Project Visual Simulations
  const showcaseSimulations = [
    {
      id: "showcase-cariad",
      title: "Simulation 01 — CARIAD REM Quadkey Z16 Tile Streaming",
      subtitle:
        "2-lane road at 60 km/h, +2 square prefetch, HTTP 200 / HTTP 400 & route localization trace",
      extra: ["Volkswagen Group CANoe 100% Zoom 16 Dashcam Server Localized"],
    },
    {
      id: "showcase-bmw",
      title: "Simulation 02 — BMW Parking Assistant Professional (200m)",
      subtitle:
        "12 ultrasonic sensors (USS) + 4 surround cameras, reverse S-curve bay maneuver & GTest 95%",
      extra: ["CMake Bazel Parking Bay Sonar Surround View Trajectory"],
    },
    {
      id: "showcase-harman",
      title: "Simulation 03 — HARMAN / Mazda Telematics HIL Bench & eCall",
      subtitle:
        "Arduino UART 115200 8N1 trigger bridge, 2G/3G RF attenuation & Pytest / DLT traces",
      extra: ["Jenkins CI Weekly Sanity SOS Latch"],
    },
    {
      id: "showcase-graitec",
      title: "Simulation 04 — Graitec Advance Design 3D CAD Modules",
      subtitle:
        "Parametric 3D walls, FEM slabs & Eurocode 6 / CR6 across 6 structural modules in Revit",
      extra: ["Column Beam Footing Slab Wall Masonry C# WPF MVVM"],
    },
  ];
  for (const sim of showcaseSimulations) {
    entries.push(
      buildEntry(
        {
          id: sim.id,
          title: sim.title,
          subtitle: sim.subtitle,
          sectionLabel: "Project Visuals",
          sectionId: "showcase",
          kind: "showcase",
        },
        sim.extra
      )
    );
  }

  // 3. Interactive Architecture Schematics & Nodes
  for (const flow of SCHEMATICS_DATA) {
    entries.push(
      buildEntry(
        {
          id: `flow-${flow.id}`,
          title: flow.title,
          subtitle: flow.subtitle,
          sectionLabel: `Schematics • ${flow.tabLabel}`,
          sectionId: "schematics",
          kind: "schematics",
        },
        [flow.projectBadge, flow.tabLabel]
      )
    );
    for (const node of flow.nodes) {
      entries.push(
        buildEntry(
          {
            id: `node-${flow.id}-${node.id}`,
            title: `${node.label} — ${node.subtitle}`,
            subtitle: `${node.details.protocol}: ${node.details.description}`,
            sectionLabel: `Schematics • ${flow.tabLabel}`,
            sectionId: "schematics",
            kind: "schematics",
          },
          [
            flow.projectBadge,
            node.category,
            node.status,
            ...node.details.technicalSpecs,
            node.details.sampleCodeOrPayload,
          ]
        )
      );
    }
  }

  // 4. Live Diagnostic & DLT Telemetry Simulator
  entries.push(
    buildEntry(
      {
        id: "telemetry-console",
        title: "Live DLT, CANoe & Arduino UART Diagnostic Simulator",
        subtitle:
          "Real-time CAN frames (0x3A2, 0x1B4), DLT telecom logs, 115200 8N1 UART & Pytest sanity",
        sectionLabel: "Telemetry",
        sectionId: "telemetry",
        kind: "telemetry",
      },
      [
        ...INITIAL_TELEMETRY_LOGS.map((l) => `${l.source} ${l.message}`),
        ...STREAM_POOL.map((l) => `${l.source} ${l.message}`),
      ]
    )
  );

  // 5. Work Experience, Projects, Complex Tasks & Structural Modules
  for (const company of WORK_EXPERIENCE) {
    entries.push(
      buildEntry(
        {
          id: `company-${company.company}`,
          title: `${company.company} — ${company.role}`,
          subtitle: `${company.period} • ${company.location}`,
          sectionLabel: "Experience",
          sectionId: "experience",
          kind: "experience",
        },
        [company.summaryNote ?? ""]
      )
    );

    for (const project of company.projects) {
      entries.push(
        buildEntry(
          {
            id: `proj-${project.id}`,
            title: `${project.client} — ${project.projectTitle}`,
            subtitle: `${project.role} (${project.period}) • ${project.summary}`,
            sectionLabel: `Experience • ${company.company}`,
            sectionId: "experience",
            kind: "experience",
          },
          [
            ...project.stack,
            ...project.highlights,
            ...(project.metrics?.map((m) => `${m.label} ${m.value}`) ?? []),
          ]
        )
      );

      project.structuralModules?.forEach((mod) => {
        entries.push(
          buildEntry(
            {
              id: `mod-${project.id}-${mod.name}`,
              title: `${mod.name} Module (${mod.category})`,
              subtitle: `${mod.description} — ${mod.engineeringDetails}`,
              sectionLabel: `Graitec 3D CAD • ${project.client}`,
              sectionId: "experience",
              kind: "experience",
            },
            [...project.stack, "Advance Design Autodesk Revit Eurocode 6 CR6"]
          )
        );
      });

      project.complexTasks?.forEach((task, idx) => {
        entries.push(
          buildEntry(
            {
              id: `task-${project.id}-${idx}`,
              title: task.title,
              subtitle: `${task.context} -> ${task.result}`,
              sectionLabel: `Engineering Task • ${project.client}`,
              sectionId: "experience",
              kind: "experience",
            },
            task.actions
          )
        );
      });
    }
  }

  // 6. Technical Skills Matrix (Categories & Individual Skills)
  for (const cat of SKILL_CATEGORIES) {
    entries.push(
      buildEntry(
        {
          id: `skill-cat-${cat.shortLabel}`,
          title: cat.category,
          subtitle: cat.description,
          sectionLabel: "Skills Matrix",
          sectionId: "skills",
          kind: "skills",
        },
        cat.skills.map((s) => `${s.name} ${s.level ?? ""} ${s.tag ?? ""}`)
      )
    );

    for (const skill of cat.skills) {
      entries.push(
        buildEntry(
          {
            id: `skill-${cat.shortLabel}-${skill.name}`,
            title: skill.name,
            subtitle: `${cat.category}${skill.level ? ` • ${skill.level}` : ""}${skill.tag ? ` (${skill.tag})` : ""}`,
            sectionLabel: `Skills • ${cat.shortLabel}`,
            sectionId: "skills",
            kind: "skills",
          },
          [cat.description]
        )
      );
    }
  }

  // 7. Education, Thesis, Cisco NetAcad & Certifications
  entries.push(
    buildEntry(
      {
        id: "edu-degree",
        title: `${EDUCATION_DATA.degree} — ${EDUCATION_DATA.specialization}`,
        subtitle: `${EDUCATION_DATA.institution} (${EDUCATION_DATA.period})`,
        sectionLabel: "Education",
        sectionId: "education",
        kind: "education",
      },
      [EDUCATION_DATA.location, ...EDUCATION_DATA.keyCoursework]
    ),
    buildEntry(
      {
        id: "edu-thesis",
        title: `Bachelor's Thesis: ${EDUCATION_DATA.thesis.title}`,
        subtitle: `${EDUCATION_DATA.thesis.technologies} — ${EDUCATION_DATA.thesis.description}`,
        sectionLabel: "Education • Thesis",
        sectionId: "education",
        kind: "education",
      },
      ["University of Bucharest Medical TCP HTTP Socket Azure CI/CD"]
    ),
    buildEntry(
      {
        id: "edu-cisco",
        title: `${EDUCATION_DATA.ciscoCoursework.title} (NetAcad ID ${EDUCATION_DATA.ciscoCoursework.netacadId})`,
        subtitle: EDUCATION_DATA.ciscoCoursework.statusNote,
        sectionLabel: "Education • Cisco",
        sectionId: "education",
        kind: "education",
      },
      EDUCATION_DATA.ciscoCoursework.courses.map(
        (c) => `${c.code} ${c.period} ${c.description}`
      )
    )
  );

  for (const cert of CERTIFICATIONS) {
    entries.push(
      buildEntry(
        {
          id: `cert-${cert.id}`,
          title: `${cert.title} (${cert.year})`,
          subtitle: `${cert.issuer} — ${cert.topics}`,
          sectionLabel: "Certification",
          sectionId: "education",
          kind: "education",
        },
        [cert.credentialId ?? "", cert.duration ?? ""]
      )
    );
  }

  // 8. Contact Section
  entries.push(
    buildEntry(
      {
        id: "contact-direct",
        title: "Contact & Collaboration Form (FormSubmit HTTPS Relay)",
        subtitle:
          "Send a direct message to vaidos.mihaiiulian@gmail.com or reach via +40 768 194 193 / LinkedIn / GitHub",
        sectionLabel: "Contact",
        sectionId: "contact",
        kind: "contact",
      },
      ["Email Phone GitHub LinkedIn Collaboration Inquiry Resume Print PDF"]
    )
  );

  return entries;
}

export function searchSiteEntries(
  entries: SiteSearchEntry[],
  rawQuery: string
): SiteSearchEntry[] {
  const normalizedQuery = normalize(rawQuery);
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery
    .split(" ")
    .filter((token) => token.length > 0);
  if (tokens.length === 0) return [];

  const scored: { entry: SiteSearchEntry; score: number }[] = [];

  for (const entry of entries) {
    const matchesAllTokens = tokens.every((token) =>
      entry.haystack.includes(token)
    );
    if (!matchesAllTokens) continue;

    let score = 0;
    if (entry.titleNormalized.includes(normalizedQuery)) score += 100;
    for (const token of tokens) {
      if (entry.titleNormalized.includes(token)) score += 20;
    }
    scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((item) => item.entry);
}
