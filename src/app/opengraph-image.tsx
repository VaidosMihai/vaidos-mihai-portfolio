import { ImageResponse } from "next/og";

export const alt =
  "Vaidos Mihai-Iulian — Software Engineer (Data Automation, Backend & Systems)";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#090D16",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #2563EB 0%, #162033 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
              color: "#FFFFFF",
              border: "2px solid #38BDF8",
            }}
          >
            VM
          </div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontFamily: "monospace" }}>
            ENGINEERING AT BERTRANDT GROUP • BUCHAREST
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.02em" }}>
            VAIDOS MIHAI-IULIAN
          </div>
          <div style={{ fontSize: 30, color: "#94A3B8" }}>
            Software Engineer — Data Automation, Backend &amp; Embedded Systems
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", fontSize: 20, fontFamily: "monospace" }}>
          <div style={{ padding: "10px 18px", borderRadius: 10, background: "#111827", border: "1px solid #38BDF8", color: "#38BDF8" }}>
            C# / .NET &amp; WPF MVVM
          </div>
          <div style={{ padding: "10px 18px", borderRadius: 10, background: "#111827", border: "1px solid #38BDF8", color: "#38BDF8" }}>
            Python / Pandas ETL
          </div>
          <div style={{ padding: "10px 18px", borderRadius: 10, background: "#111827", border: "1px solid #38BDF8", color: "#38BDF8" }}>
            Modern C++ &amp; CANoe
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
