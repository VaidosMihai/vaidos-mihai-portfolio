import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 15,
          background: "linear-gradient(135deg, #090D16 0%, #2563EB 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F8FAFC",
          fontWeight: 800,
          borderRadius: 7,
          fontFamily: "monospace",
        }}
      >
        VM
      </div>
    ),
    { ...size }
  );
}
