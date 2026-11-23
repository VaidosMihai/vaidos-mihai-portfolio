import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import ThemeProvider from "@/components/theme/ThemeProvider";
import PortfolioUIProvider from "@/components/shell/PortfolioUIProvider";
import { SITE_URL } from "@/lib/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const THEME_INIT_SCRIPT = `(function(){try{var k="portfolio-theme";var s=localStorage.getItem(k);var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.dataset.theme=t;r.style.colorScheme=t;}catch(e){var d=document.documentElement;d.classList.add("dark");d.dataset.theme="dark";d.style.colorScheme="dark";}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default:
      "Vaidos Mihai-Iulian | Software Engineer (Data Automation, Backend & Systems)",
    template: "%s | Vaidos Mihai-Iulian",
  },
  description:
    "Portfolio of Vaidos Mihai-Iulian — Software Engineer with 3.5+ years of experience across automotive (CARIAD, BMW) and engineering software (Graitec / Autodesk Revit). C#/.NET (WPF MVVM), Python (Pandas ETL), Modern C++ (GTest >90%), and Azure DevOps.",
  keywords: [
    "Vaidos Mihai-Iulian",
    "Software Engineer",
    "Data Automation",
    "Backend Engineer",
    "C# .NET WPF MVVM",
    "Autodesk Revit Extensions",
    "CARIAD REM",
    "Python Pandas",
    "Modern C++",
    "Google Test",
    "Bucharest Romania",
  ],
  authors: [{ name: "Vaidos Mihai-Iulian" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Vaidos Mihai-Iulian — Engineering Portfolio",
    title:
      "Vaidos Mihai-Iulian — Software Engineer (Data Automation, Backend & Systems)",
    description:
      "Full-stack, automotive telematics, and desktop CAD engineering systems.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Vaidos Mihai-Iulian — Software Engineer (Data Automation, Backend & Systems)",
    description:
      "Automotive telemetry, CARIAD REM validation, Modern C++, and C#/.NET WPF MVVM CAD systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#090D16" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-canvas text-ink-secondary min-h-screen relative selection:bg-accent-cobalt selection:text-white">
        <ThemeProvider>
          <SmoothScrollProvider>
            <PortfolioUIProvider>{children}</PortfolioUIProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
