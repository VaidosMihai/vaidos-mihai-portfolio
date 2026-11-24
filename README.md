# Vaidos Mihai-Iulian — Personal Portfolio Web Application

A modern, high-precision Next.js 15 engineering portfolio built for **Vaidos Mihai-Iulian** (Software Engineer — Data Automation, Backend & Systems).

This application pairs **Raycast-inspired command ergonomics** (`Cmd/Ctrl+K` command palette, live DLT/CAN diagnostic simulator, bento architecture) with **fluid 2D Canvas visuals** (Lenis smooth inertial scrolling, reactive organic mesh backdrop, and a scroll-driven hypercar showcase).

---

## Palette & Dual-Theme Design System

Implemented via semantic CSS custom properties ([globals.css](src/app/globals.css)) bridged into Tailwind CSS ([tailwind.config.ts](tailwind.config.ts)) and 2D Canvas/SVG palettes ([theme.ts](src/lib/theme.ts)) with persistent switching and zero FOUC:

- **Dark Theme — Obsidian & Titanium Slate:**
  - Canvas `#090D16`, Graphite Surfaces `#111827` / `#162033`, Electric Cobalt `#2563EB`, Luminous Cyan `#38BDF8`, Signal Emerald `#10B981`, WCAG 2.2 AA contrast across all text & badges.
- **Light Theme — Automotive Cockpit Light:**
  - Porcelain Canvas `#F8FAFC`, White Cards `#FFFFFF`, Recessed Bays `#F1F5F9`, Warm Amber `#92400E`/`#D97706`, Redline Crimson `#B91C1C`/`#DC2626`, Precision Cobalt/Cyan `#2563EB`/`#0369A1`, and an anodized dark cockpit bay (`#0F172A`) for telemetry & code streams.
- **Print Resume Stylesheet (`@media print`):**
  - Resets theme tokens to high-contrast dark ink on white paper, expands project accordions synchronously (`beforeprint`), and hides non-printable chrome.

---

## Key Features

1. **Project-Specific Visual Simulations & Fluid Canvas:** Scroll-reactive 2D Canvas carousel presenting four separate engineering animations (`CARIAD REM`, `BMW Parking`, `HARMAN eCall`, `Graitec 3D CAD`), each with its own drawing and telemetry HUD adapted dynamically to Dark/Light themes, offscreen pausing, and `prefers-reduced-motion`.
2. **Interactive System Schematics:** Three clickable architecture pipelines (`CARIAD REM Telemetry`, `Graitec / Revit (C# .NET)`, `Mazda Telematics HIL`) with accessible WAI-ARIA tabs and an inspector dialog (`SchematicModal`).
3. **Live DLT & CANoe Diagnostic Simulator:** Monospace diagnostic terminal with Pause/Resume, eCall Sanity trigger, CAN Frame injector, Clear Console, and Restore Baseline controls.
4. **Raycast Command Palette (`Cmd/Ctrl+K`):** Built with `cmdk` for instant theme switching, section navigation, technology filtering (`C# / .NET`, `WPF / MVVM`, `Autodesk Revit`, `Python & Pandas`, `Modern C++`, `CARIAD REM`, `Vector CANoe`, `Azure DevOps`), clipboard actions, and PDF resume printing.
5. **FormSubmit Contact Relay & Hardened Security:** Direct interactive contact form inside the Contact section wired to [FormSubmit](https://formsubmit.co/) (`POST /ajax/*`) with honeypot spam trap, client validation, and CSP allowlisting (`connect-src 'self' https://formsubmit.co`, `form-action 'self' https://formsubmit.co`), alongside HTTP security headers in [next.config.ts](next.config.ts), strict HTTPS URL validation, `error.tsx`, `global-error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, and `next/font/google`.

---

## Quick Start & Verification

```bash
# Development server
npm run dev

# Type checking, ESLint (with eslint-plugin-security), and production build
npm run typecheck
npm run lint
npm run build

# Start production server (serves HTTP security headers)
npm run start

# Playwright end-to-end suite
npm run test:e2e
```

### Deploy to Vercel (via GitHub)
1. Push this repository to GitHub (`main` branch).
2. Import the repository in [Vercel](https://vercel.com) (Next.js preset auto-detected).
3. Configure Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SITE_URL` -> your live Vercel URL (e.g. `https://vaidos-mihai-portfolio.vercel.app`)
   - `NEXT_PUBLIC_FORMSUBMIT_ENDPOINT` -> `https://formsubmit.co/ajax/vaidos.mihaiiulian@gmail.com` (and optionally replace with FormSubmit's hashed endpoint string after activation + redeploy)
4. Trigger one test submission on your live domain and click the FormSubmit activation link sent to `vaidos.mihaiiulian@gmail.com`.
