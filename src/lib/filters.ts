import type { ProjectDetail } from "@/data/experience";

export type SectionId =
  | "hero"
  | "showcase"
  | "schematics"
  | "telemetry"
  | "experience"
  | "skills"
  | "education"
  | "contact";

export interface TechFilterDefinition {
  id: string;
  label: string;
  tokens: string[];
  matchMode: "any" | "all";
  showInPillBar?: boolean;
}

export const TECH_FILTERS: TechFilterDefinition[] = [
  { id: "ALL", label: "ALL", tokens: [], matchMode: "any", showInPillBar: true },
  {
    id: "C# / .NET",
    label: "C# / .NET",
    tokens: ["c#", ".net"],
    matchMode: "any",
    showInPillBar: true,
  },
  {
    id: "WPF / MVVM",
    label: "WPF / MVVM",
    tokens: ["wpf", "mvvm"],
    matchMode: "any",
    showInPillBar: true,
  },
  {
    id: "Python",
    label: "Python",
    tokens: ["python"],
    matchMode: "any",
    showInPillBar: true,
  },
  {
    id: "Python & Pandas",
    label: "Python & Pandas",
    tokens: ["python", "pandas"],
    matchMode: "all",
    showInPillBar: false,
  },
  {
    id: "Modern C++",
    label: "Modern C++",
    tokens: ["c++", "gtest", "gmock"],
    matchMode: "any",
    showInPillBar: true,
  },
  {
    id: "CARIAD",
    label: "CARIAD",
    tokens: ["cariad"],
    matchMode: "any",
    showInPillBar: true,
  },
  {
    id: "CARIAD REM",
    label: "CARIAD REM",
    tokens: ["cariad", "rem"],
    matchMode: "all",
    showInPillBar: false,
  },
  {
    id: "Revit",
    label: "Revit",
    tokens: ["revit"],
    matchMode: "any",
    showInPillBar: true,
  },
  {
    id: "Autodesk Revit",
    label: "Autodesk Revit",
    tokens: ["revit"],
    matchMode: "any",
    showInPillBar: false,
  },
  {
    id: "CANoe",
    label: "CANoe",
    tokens: ["canoe"],
    matchMode: "any",
    showInPillBar: true,
  },
  {
    id: "Vector CANoe",
    label: "Vector CANoe",
    tokens: ["canoe"],
    matchMode: "any",
    showInPillBar: false,
  },
  {
    id: "Azure DevOps",
    label: "Azure DevOps",
    tokens: ["azure devops"],
    matchMode: "any",
    showInPillBar: false,
  },
];

export const PILL_BAR_FILTERS = TECH_FILTERS.filter((f) => f.showInPillBar);

export const COMMAND_MENU_FILTERS = [
  "C# / .NET",
  "WPF / MVVM",
  "Autodesk Revit",
  "Python & Pandas",
  "Modern C++",
  "CARIAD REM",
  "Vector CANoe",
  "Azure DevOps",
] as const;

export function matchesProjectFilter(
  project: ProjectDetail & { company?: string },
  filterKey: string
): boolean {
  if (!filterKey || filterKey === "ALL") return true;

  const haystack = [
    project.client,
    project.company ?? "",
    project.projectTitle,
    project.role,
    project.summary,
    ...project.stack,
    ...project.highlights,
  ]
    .join(" ")
    .toLowerCase();

  const normalizedKey = filterKey.trim().toLowerCase();
  const def = TECH_FILTERS.find(
    (f) => f.id.toLowerCase() === normalizedKey || f.label.toLowerCase() === normalizedKey
  );

  if (!def) {
    return haystack.includes(normalizedKey);
  }
  if (def.tokens.length === 0) return true;

  return def.matchMode === "all"
    ? def.tokens.every((token) => haystack.includes(token))
    : def.tokens.some((token) => haystack.includes(token));
}
