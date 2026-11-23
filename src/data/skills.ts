export type SkillIconName =
  | "Layout"
  | "Binary"
  | "Cpu"
  | "Network"
  | "GitBranch"
  | "ShieldCheck";

export interface SkillCategory {
  category: string;
  shortLabel: string;
  icon: SkillIconName;
  description: string;
  skills: { name: string; level?: string; tag?: string }[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "C# / .NET & Desktop Architecture",
    shortLabel: "C# / .NET",
    icon: "Layout",
    description:
      "Core software engineering, decoupled MVVM architecture, 3D calculation engines, and Autodesk Revit extensions.",
    skills: [
      { name: "C# (.NET Core & Framework)", level: "Advanced", tag: "Core" },
      { name: "WPF (XAML & MVVM)", level: "Advanced", tag: "Architecture" },
      { name: "Data Binding & ICommand", level: "Advanced", tag: "UI" },
      { name: "INotifyPropertyChanged", level: "Expert", tag: "Optimization" },
      { name: "Autodesk Revit Extension APIs", level: "Advanced", tag: "3D CAD" },
      { name: "Entity Framework Core", level: "Advanced", tag: "ORM" },
      { name: "Async / Await & Tasks", level: "Advanced", tag: "Threading" },
      { name: "SOLID, KISS & YAGNI", level: "Expert", tag: "Principles" },
    ],
  },
  {
    category: "Data Automation & Python",
    shortLabel: "Python",
    icon: "Binary",
    description:
      "Automated telemetry processing, massive CSV/Excel datasets, and business logic verification.",
    skills: [
      { name: "Python 3 (OOP)", level: "Advanced", tag: "Core" },
      { name: "Pandas (ETL & Telemetry)", level: "Advanced", tag: "Data" },
      { name: "Automated Validation Pipelines", level: "Advanced", tag: "Automation" },
      { name: "4-Eyes Review Principle", level: "Standard", tag: "Quality" },
      { name: "Pytest & Robot Framework", level: "Advanced", tag: "Testing" },
      { name: "Data Grouping & Anomaly Detection", level: "Advanced", tag: "Data" },
      { name: "Automated Report Generation", level: "Proficient", tag: "BI" },
    ],
  },
  {
    category: "Modern C++ & Low-Level Systems",
    shortLabel: "Modern C++",
    icon: "Cpu",
    description:
      "High-performance modules, deterministic build systems, and strict unit test coverage.",
    skills: [
      { name: "Modern C++ (11/14/17)", level: "Intermediate", tag: "Core" },
      { name: "Google Test (GTest)", level: "Advanced (>90%)", tag: "Testing" },
      { name: "Google Mock (GMock)", level: "Advanced", tag: "Testing" },
      { name: "CMake (Windows Builds)", level: "Advanced", tag: "Build" },
      { name: "Bazel (Containerized Linux)", level: "Intermediate", tag: "Build" },
      { name: "SonarQube & Treemap Analysis", level: "Advanced", tag: "Quality" },
      { name: "Smart Pointers & Memory Safety", level: "Intermediate", tag: "Systems" },
    ],
  },
  {
    category: "Automotive Protocols & Telemetry",
    shortLabel: "Protocols",
    icon: "Network",
    description:
      "Vehicle bus communication, ECU signal decoding, and real-time cloud-to-car requests.",
    skills: [
      { name: "Vector CANoe", level: "Intermediate", tag: "Automotive" },
      { name: "CAN & CAN-FD Bus Analysis", level: "Intermediate", tag: "Protocols" },
      { name: "CARIAD REM Download (Dashcam)", level: "Specialist", tag: "Automotive" },
      { name: "Serial / UART Hardware Links", level: "Advanced", tag: "Embedded" },
      { name: "DLT (Diagnostic Log & Trace)", level: "Advanced", tag: "Diagnostics" },
      { name: "2G/3G eCall Telematics", level: "Intermediate", tag: "Automotive" },
      { name: "Cisco CCNAv7 (L2/L3 Routing)", level: "Certified", tag: "Networking" },
    ],
  },
  {
    category: "DevOps, Cloud & Database",
    shortLabel: "DevOps",
    icon: "GitBranch",
    description:
      "CI/CD integration, Microsoft Azure cloud infrastructure, and relational SQL persistence.",
    skills: [
      { name: "Azure DevOps & Pipelines", level: "Advanced", tag: "CI/CD" },
      { name: "Git (GitHub / GitLab CI)", level: "Advanced", tag: "VCS" },
      { name: "Microsoft Azure Cloud Services", level: "Intermediate", tag: "Cloud" },
      { name: "SQL Server (SSMS)", level: "Intermediate", tag: "Database" },
      { name: "Linux Terminal & Shell", level: "Intermediate", tag: "OS" },
      { name: "Docker & Containerization", level: "Applied", tag: "DevOps" },
      { name: "Angular & Node.js REST APIs", level: "Full-Stack", tag: "Web" },
    ],
  },
  {
    category: "Leadership, Agile & ALM",
    shortLabel: "Leadership",
    icon: "ShieldCheck",
    description:
      "Local team coordination, onboarding guidance, and international collaboration.",
    skills: [
      { name: "Local Team Coordination", level: "Proven", tag: "Leadership" },
      { name: "Engineer Onboarding & Mentoring", level: "Proven", tag: "People" },
      { name: "Sprint Task Breakdown", level: "Advanced", tag: "Agile" },
      { name: "Cross-Border Teams (Germany / Poland)", level: "Fluent English", tag: "Communication" },
      { name: "Codebeamer & Jira ALM", level: "Advanced", tag: "Traceability" },
      { name: "Scrum & Agile Ceremonies", level: "Advanced", tag: "Process" },
    ],
  },
];
