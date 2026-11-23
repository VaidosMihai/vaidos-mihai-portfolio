export interface StructuralModule {
  name: string;
  category: string;
  description: string;
  engineeringDetails: string;
}

export interface ProjectDetail {
  id: string;
  client: string;
  projectTitle: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  structuralModules?: StructuralModule[];
  complexTasks?: {
    title: string;
    context: string;
    actions: string[];
    result: string;
  }[];
  stack: string[];
  metrics?: { label: string; value: string }[];
}

export interface CompanyExperience {
  company: string;
  role: string;
  location: string;
  period: string;
  summaryNote?: string;
  projects: ProjectDetail[];
}

export const WORK_EXPERIENCE: CompanyExperience[] = [
  {
    company: "Bertrandt Group",
    role: "Software Engineer (Data Automation, Telemetry & Systems)",
    location: "Bucharest, Romania",
    period: "May 2023 – Present",
    summaryNote:
      "2+ years of continuous delivery across mission-critical automotive software, automated vehicle parking systems, and high-volume telemetry data pipelines.",
    projects: [
      {
        id: "cariad",
        client: "CARIAD (Volkswagen Group)",
        projectTitle: "REM Download (Road Experience Management) & Swarm Data Validation",
        role: "Data Validation Engineer / Python Automation & Team Coordinator",
        period: "March 2024 – Present",
        summary:
          "Automated telemetry validation and ECU protocol analysis for CARIAD's Road Experience Management (REM) platform powered by Mobileye, validating crowd-sourced swarm data (~10KB/km vision metadata from front dashcams) powering Travel Assist with centimeter-accurate lane localization.",
        highlights: [
          "Developed automated Python and Pandas pipelines to parse, filter, and validate massive telemetry datasets (CSV, Excel, signal traces) against strict business logic rules.",
          "Cut repetitive manual verification workload by over 30% through automated range checks, signal loss detection, and telemetry anomaly scripts.",
          "Analyzed real-time tile request/response frames on vehicle bus networks using Vector CANoe, verifying 100% protocol integrity between ECUs and cloud backend.",
          "Validated Mobileye Roadbook tile delivery to onboard vehicle storage, ensuring high-definition localization for autonomous driving features.",
          "Applied strict 4-eyes review discipline on all production validation scripts prior to test execution on customer deliverables.",
          "Coordinated the local Romanian engineering team: planned sprints, onboarded new developers through environment setup, and authored executive PASS/FAIL reports.",
          "Maintained CI/CD pipeline stability across Azure DevOps and GitLab, executing builds and troubleshooting test runners in Linux environments."
        ],
        stack: [
          "Python 3",
          "Pandas (ETL)",
          "Vector CANoe",
          "Mobileye REM Swarm Data",
          "ECU Protocols (CAN / CAN-FD)",
          "Azure DevOps",
          "GitLab CI",
          "Linux Shell",
          "Jira & Codebeamer",
          "4-Eyes Principle"
        ],
        metrics: [
          { label: "Workload Cut", value: "30%" },
          { label: "Protocol Compliance", value: "100%" },
          { label: "Swarm Fleet", value: "Mobileye Roadbook" }
        ]
      },
      {
        id: "bmw-parking",
        client: "BMW Group",
        projectTitle: "Parking Assistant Professional (Maneuver Assistant & C++ Core)",
        role: "Junior C++ Software Developer & Unit Testing Specialist",
        period: "May 2023 – February 2024",
        summary:
          "Cross-platform C++ development, build system determinism, and high-coverage unit testing for BMW Parking Assistant Professional (Maneuver Assistant 200m autonomous trajectory replay and sensor fusion of 12 ultrasonic sensors + 4 surround cameras).",
        highlights: [
          "Developed core software modules and bug fixes in Modern C++ (C++11/14/17) for automated vehicle parking algorithms across Windows and Linux targets.",
          "Implemented sensor fusion routines integrating ultrasonic distance clusters and surround camera obstacle detections for tight space maneuvering.",
          "Engineered deterministic cross-platform build pipelines utilizing CMake on Windows and Bazel for isolated, containerized Linux environments.",
          "Authored exhaustive unit and mock test suites using Google Test (GTest) and Google Mock (GMock), raising and maintaining code coverage over 90%.",
          "Conducted static analysis via SonarQube and treemap inspections to eliminate memory corruption vulnerabilities and critical code smells.",
          "Managed functional requirements and traceability from specification to source code using Jira and Codebeamer within an international Agile framework."
        ],
        stack: [
          "Modern C++ (11/14/17)",
          "Google Test (GTest)",
          "Google Mock (GMock)",
          "CMake & Bazel",
          "SonarQube Treemap",
          "Sensor Fusion (USS & Cam)",
          "Linux & Windows",
          "JFrog Artifactory",
          "Codebeamer ALM"
        ],
        metrics: [
          { label: "Unit Test Coverage", value: ">90%" },
          { label: "Maneuver Replay", value: "200m Trajectory" },
          { label: "Safety Gate", value: "PASSED" }
        ]
      },
      {
        id: "harman-mazda",
        client: "HARMAN / Mazda",
        projectTitle: "Automotive Telematics & eCall Connectivity",
        role: "Test Automation & QA Engineer",
        period: "2024 – 2025",
        summary:
          "Automated HIL testing for embedded telematics and Emergency Call (eCall) using Python/Pytest, Jenkins CI/CD, and Arduino hardware simulation.",
        highlights: [
          "Designed object-oriented Python, Pytest, and Robot Framework test suites for telematics modules under 2G, 3G, and degraded network conditions.",
          "Fully automated Weekly Sanity Test Plans into Jenkins CI/CD pipelines, accelerating regression feedback cycles.",
          "Engineered an Arduino-based HIL test bench with serial/UART control for hardware fault injection and antenna signal attenuation.",
          "Executed ADB shell commands and diagnostic log tracing via DLT (Diagnostic Log & Trace) on embedded Linux automotive targets."
        ],
        stack: [
          "Python 3",
          "Pytest & Robot Fw",
          "Jenkins CI/CD",
          "Arduino (Serial/UART)",
          "Linux Shell / ADB",
          "DLT Log Tracing",
          "2G/3G eCall"
        ],
        metrics: [
          { label: "Sanity Automation", value: "100%" },
          { label: "Feedback Loop", value: "4x Faster" }
        ]
      }
    ]
  },
  {
    company: "Graitec",
    role: "Middle Software Developer (C#/.NET & WPF MVVM)",
    location: "Bucharest, Romania",
    period: "July 2021 – February 2023",
    summaryNote:
      "1 year and 8 months developing Advance Design Modules — the structural engineering suite composed of Column, Beam, Footing, Slab, Wall, and Masonry modules, functioning both as standalone 3D CAD modeling applications and integrated directly as extensions inside Autodesk Revit.",
    projects: [
      {
        id: "graitec-advance",
        client: "Graitec Group / Autodesk Revit Ecosystem",
        projectTitle: "Advance Design Modules (Column, Beam, Footing, Slab, Wall, Masonry)",
        role: "Middle Software Developer C#/.NET",
        period: "July 2021 – February 2023",
        summary:
          "Engineered calculation engines and complex 3D CAD modeling features for the Advance Design Modules suite (Column, Beam, Footing, Slab, Wall, Masonry) using C#/.NET, WPF (MVVM), and Entity Framework Core, integrated as BIM extensions within Autodesk Revit.",
        highlights: [
          "Developed core structural modeling features across the full Advance Design Modules suite: Column, Beam, Footing, Slab, Wall, and Masonry.",
          "Implemented decoupled MVVM architecture in WPF (XAML) with bidirectional Data Binding to synchronize real-time 3D canvas interactions with backend calculation engines.",
          "Engineered Eurocode 6 (EN 1996-1/3) and Romanian CR6 structural code compliance checking, incorporating FEM planar shell strip methods for load-bearing and shear verification.",
          "Engineered geometric coordinate computation and boolean mesh operations to model structural elements with sub-millimeter precision.",
          "Managed local persistence and project state via Entity Framework Core and SQL Server with custom Data Transfer Objects (DTOs), getters/setters, and asynchronous operations (async/await, Task).",
          "Eliminated UI lag and thread-locking bottlenecks by optimizing layout rendering and isolating INotifyPropertyChanged event cascades.",
          "Worked in a distributed international Scrum team using Git and Azure DevOps for version control, code reviews, and defect management."
        ],
        structuralModules: [
          {
            name: "Column",
            category: "Stâlpi din Beton Armat",
            description: "Reinforced concrete column sizing, biaxial bending and axial compression interaction diagrams, and automated 3D rebar cage generation.",
            engineeringDetails: "Biaxial M-N interaction curves & stirrup confinement"
          },
          {
            name: "Beam",
            category: "Grinzi Structurale",
            description: "Single-span and continuous reinforced concrete beams, bending moments, shear stress envelope verification, and longitudinal rebar anchorage.",
            engineeringDetails: "Moment redistribution & shear crack verification"
          },
          {
            name: "Footing",
            category: "Fundații Izolate & Continue",
            description: "Pad and strip foundations design, soil bearing pressure distribution under eccentric/seismic actions, and punching shear calculations.",
            engineeringDetails: "Soil-structure interaction & punching perimeter"
          },
          {
            name: "Slab",
            category: "Plăci & Diafragme Orizontale",
            description: "2D/3D FEM strip method integration, deflection contour mapping, opening reinforcements, and bidirectional top/bottom mesh detailing.",
            engineeringDetails: "FEM strip method & long-term cracked deflection"
          },
          {
            name: "Wall",
            category: "Pereți Structurali din Beton",
            description: "Parametric reinforced concrete shear wall modeling, custom 3D window/door perforation boolean subtraction, and dynamic edge-offset dimensioning.",
            engineeringDetails: "3D boolean solid subtraction & boundary rebar"
          },
          {
            name: "Masonry",
            category: "Zidărie Structurală (CR6 / Eurocode 6)",
            description: "Confined and unreinforced masonry wall engineering per Eurocode 6 (EN 1996-1/3) and Romanian CR6 standard, vertical load capacity, and in-plane shear verification.",
            engineeringDetails: "Eurocode 6 & CR6 seismic shear verification"
          }
        ],
        complexTasks: [
          {
            title: "3D Wall Perforations & Automatic Structural Re-Dimensioning",
            context:
              "Engineers needed a feature to create structural openings (holes) directly inside a 3D wall mesh and immediately generate all dimension annotations without manual drafting.",
            actions: [
              "Implemented a custom WPF input-handling command to track cursor coordinates and capture two distinct click points on the 3D canvas.",
              "Wrote the backend 3D calculation logic for geometric coordinates and boolean mesh subtraction to perforate the wall model.",
              "Triggered dynamic updates via INotifyPropertyChanged to instantly generate new size annotations (opening width/height, plus 4-edge offset distances to outer wall edges)."
            ],
            result:
              "Drastically accelerated engineering workflows from minutes of manual drafting to instantaneous automated 3D modeling and dimensioning."
          },
          {
            title: "Modal Dialog Settings Panel with Hierarchical TreeView (Pure MVVM)",
            context:
              "Requirement for a centralized settings window featuring a nested TreeView on the left and dynamic content on the right, fully decoupled via MVVM.",
            actions: [
              "Handled window instantiation via a WPF ICommand, binding the window DataContext cleanly to its ViewModel.",
              "Designed a composite data structure rendered via HierarchicalDataTemplate for nested TreeView navigation.",
              "Used a ContentControl bound to CurrentSelectedPageViewModel with implicit DataTemplates to resolve and render UserControls dynamically without UI coupling."
            ],
            result:
              "Provided an isolated, extensible settings workspace where adding a new configuration page only requires creating a new ViewModel and UserControl."
          }
        ],
        stack: [
          "C# (.NET Core/Framework)",
          "WPF (XAML, MVVM)",
          "Autodesk Revit Integration",
          "Entity Framework Core",
          "SQL Server",
          "Data Binding & ICommand",
          "INotifyPropertyChanged",
          "SOLID Principles",
          "Azure DevOps & Git"
        ],
        metrics: [
          { label: "Product", value: "Autodesk Revit Extension" },
          { label: "Architecture", value: "Decoupled MVVM" },
          { label: "Performance", value: "Zero UI Freeze" }
        ]
      }
    ]
  }
];

export interface EducationCourse {
  code: string;
  period: string;
  description: string;
}

export interface EducationData {
  degree: string;
  specialization: string;
  institution: string;
  period: string;
  location: string;
  thesis: {
    title: string;
    technologies: string;
    description: string;
  };
  ciscoCoursework: {
    title: string;
    institution: string;
    netacadId: string;
    statusNote: string;
    courses: EducationCourse[];
  };
  keyCoursework: string[];
}

export const EDUCATION_DATA: EducationData = {
  degree: "Bachelor of Science in Engineering",
  specialization: "Computer and Information Technology Engineering (CTI)",
  institution: "University of Bucharest — Faculty of Mathematics and Informatics",
  period: "2019 – 2023",
  location: "Bucharest, Romania",
  thesis: {
    title: "Full-Stack Distributed Medical Platform",
    technologies: "C# (.NET MVC), Node.js RESTful APIs, Angular, SQL Server (SSMS), Azure CI/CD",
    description:
      "Designed a secure multi-tier medical platform with role-based access control, TCP/HTTP socket telemetry, and automated cloud deployments via GitHub Actions to Microsoft Azure."
  },
  ciscoCoursework: {
    title: "Cisco Networking Academy (NetAcad)",
    institution: "FMI — University of Bucharest",
    netacadId: "1016092930",
    statusNote: "Official University Coursework & Academic Examinations Passed (Learning Transcript on Record)",
    courses: [
      {
        code: "CCNAv7: Introduction to Networks (RCF)",
        period: "2020 – 2021",
        description: "OSI & TCP/IP models, Ethernet, IPv4/IPv6 addressing & subnetting, transport layer protocols (TCP/UDP), Cisco IOS CLI configuration."
      },
      {
        code: "CCNAv7: Switching, Routing, and Wireless Essentials (FRRC)",
        period: "2020 – 2021",
        description: "Layer 2/Layer 3 switching, VLANs, Inter-VLAN routing, STP, EtherChannel, DHCPv4/v6, FHRP, and network troubleshooting."
      }
    ]
  },
  keyCoursework: [
    "Computer Networks (Cisco CCNA Curriculum)",
    "Operating Systems & Linux Internals",
    "Microprocessor Architecture & Embedded Systems",
    "Algorithms & Data Structures",
    "Relational Databases (SQL)",
    "Software Engineering & QA"
  ]
};

export interface VerifiedCertification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialId?: string;
  verifyUrl?: string;
  duration?: string;
  topics: string;
}

export const CERTIFICATIONS: VerifiedCertification[] = [
  {
    id: "python-essentials-2",
    title: "Python Essentials 2",
    issuer: "Cisco Networking Academy & OpenEDG Python Institute",
    year: "2026",
    credentialId: "f60354d5-a78c-4bcc-8d8a-20dbcfbd8362",
    topics: "Advanced OOP, modules, packages, exceptions, string processing, closures, generators, and file streams."
  },
  {
    id: "python-essentials-1",
    title: "Python Essentials 1",
    issuer: "Cisco Networking Academy & OpenEDG Python Institute",
    year: "2026",
    credentialId: "2ff7bac2-e92c-4587-8ecc-5df8e2cccefa",
    topics: "Python fundamental syntax, primitive data types, conditionals, loops, functions, and scoping."
  },
  {
    id: "cpp-testing-gtest",
    title: "C++ Unit Testing: Google Test and Google Mock",
    issuer: "Udemy (Instructor: Serban Stoenescu)",
    year: "2023",
    duration: "3.5 total hours",
    credentialId: "UC-a132f7e4-e757-428c-8c0d-672cb05f00c9",
    verifyUrl: "https://www.udemy.com/certificate/UC-a132f7e4-e757-428c-8c0d-672cb05f00c9/",
    topics: "Google Test assertions, test fixtures, Google Mock frameworks, mocking hardware/software interfaces."
  },
  {
    id: "complete-modern-cpp",
    title: "Complete Modern C++ (C++11/14/17)",
    issuer: "Udemy (Instructor: Umar Lone)",
    year: "2023",
    duration: "20 total hours",
    credentialId: "UC-7bdd6da2-a73b-444b-9b16-1913770c1d78",
    verifyUrl: "https://www.udemy.com/certificate/UC-7bdd6da2-a73b-444b-9b16-1913770c1d78/",
    topics: "Advanced OOP, smart pointers, lambda expressions, move semantics, multithreading, and STL algorithms."
  },
  {
    id: "beginning-cpp",
    title: "Beginning C++ Programming - From Beginner to Beyond",
    issuer: "Udemy (Instructors: Dr. Frank Mitropoulos & Tim Buchalka)",
    year: "2023",
    duration: "46 total hours",
    credentialId: "UC-bddb5886-c0c4-4559-ba95-1ee0d7a4d020",
    verifyUrl: "https://www.udemy.com/certificate/UC-bddb5886-c0c4-4559-ba95-1ee0d7a4d020/",
    topics: "Core C++ language structure, pointers, memory management, OOP classes, polymorphism, and exception safety."
  },
  {
    id: "java-programming",
    title: "Java Programming: Complete Beginner to Advanced",
    issuer: "Udemy (CodeIn Academy)",
    year: "2021",
    duration: "3.5 total hours",
    credentialId: "UC-46754209-00b7-4d2e-a831-e6e9a6680f3d",
    verifyUrl: "https://www.udemy.com/certificate/UC-46754209-00b7-4d2e-a831-e6e9a6680f3d/",
    topics: "Java OOP, class hierarchies, interfaces, collections framework, and JVM execution principles."
  }
];
