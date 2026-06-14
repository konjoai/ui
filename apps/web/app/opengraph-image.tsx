import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KonjoAI — High-performance AI infrastructure";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default OG image for the KonjoAI homepage. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0812",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "monospace",
        }}
      >
        {/* Background grid dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(124,58,237,0.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Top-left glyphs */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            fontSize: 32,
            color: "rgba(167,139,250,0.3)",
            letterSpacing: "24px",
          }}
        >
          ◐ ◇ ✸ ▲ ⬡ ◈
        </div>
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
          <div style={{ fontSize: 18, color: "#7c3aed", letterSpacing: "0.24em", marginBottom: 24 }}>
            KONJOAI
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#a78bfa",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            KonjoAI
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#6b5a90",
              marginTop: 24,
              textAlign: "center",
              maxWidth: 720,
            }}
          >
            High-performance AI infrastructure, built in the Konjo way.
          </div>
        </div>
        {/* Bottom strip */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            display: "flex",
            gap: 40,
            fontSize: 14,
            color: "rgba(110,90,150,0.6)",
            letterSpacing: "0.08em",
          }}
        >
          <span>14 components</span>
          <span style={{ color: "rgba(124,58,237,0.4)" }}>·</span>
          <span>9 products</span>
          <span style={{ color: "rgba(124,58,237,0.4)" }}>·</span>
          <span>79 tests</span>
          <span style={{ color: "rgba(124,58,237,0.4)" }}>·</span>
          <span>v0.2</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
