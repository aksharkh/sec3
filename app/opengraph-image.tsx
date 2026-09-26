import { ImageResponse } from "next/og";

export const alt = "SecureKnots — Many frameworks. One secure knot.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0b2a5b", color: "#f3f0e8", padding: 72 }}>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#7fb2ff" }}>SECUREKNOTS</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, lineHeight: 0.95, letterSpacing: -4 }}>
          <span>Many frameworks.</span>
          <span style={{ color: "#7fb2ff" }}>One secure knot.</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "rgba(243,240,232,0.6)" }}>SOC 2 · ISO 27001 · FedRAMP · CMMC · PCI DSS · ISO 42001</div>
      </div>
    ),
    size,
  );
}
