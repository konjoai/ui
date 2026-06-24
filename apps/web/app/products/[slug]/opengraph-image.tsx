import { ImageResponse } from "next/og";
import { PRODUCT_BY_SLUG } from "@/lib/products";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SEVERITY_COLORS: Record<string, string> = {
  ok:   "#22c55e",
  info: "#7c3aed",
  warn: "#f59e0b",
  high: "#ef4444",
};

/** Per-product OG image — branded card with glyph, name, tagline, and key metric. */
export default function Image({ params }: { params: { slug: string } }) {
  const product = PRODUCT_BY_SLUG[params.slug];
  if (!product) {
    return new ImageResponse(
      <div style={{ background: "#0a0812", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#6b5a90", fontSize: 32 }}>Not found</span>
      </div>,
      { ...size },
    );
  }

  const metricColor = SEVERITY_COLORS[product.metric.severity] ?? "#7c3aed";
  const metricDisplay = Number.isInteger(product.metric.value)
    ? String(product.metric.value)
    : product.metric.value.toFixed(1);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0812",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "monospace",
        }}
      >
        {/* Background dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(124,58,237,0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* Purple glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />

        {/* KonjoAI brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
          <span style={{ fontSize: 14, color: "#7c3aed", letterSpacing: "0.2em" }}>KONJOAI</span>
          <span style={{ color: "rgba(124,58,237,0.3)", fontSize: 14 }}>·</span>
          <span style={{ fontSize: 14, color: "rgba(110,90,150,0.6)", letterSpacing: "0.06em" }}>
            {product.status.toUpperCase()}
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", zIndex: 1 }}>
          <div style={{ fontSize: 80, color: "#a78bfa", marginBottom: 8 }}>
            {product.glyph}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#e2d9f3",
              letterSpacing: "-1.5px",
              lineHeight: 1,
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#6b5a90",
              marginTop: 20,
              maxWidth: 680,
              lineHeight: 1.4,
            }}
          >
            {product.tagline}
          </div>
        </div>

        {/* Bottom metric strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            borderTop: "1px solid rgba(124,58,237,0.2)",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 42, fontWeight: 700, color: metricColor, letterSpacing: "-0.5px" }}>
              {metricDisplay}
              <span style={{ fontSize: 20, color: "rgba(110,90,150,0.7)", marginLeft: 4 }}>
                {product.metric.unit}
              </span>
            </span>
            <span style={{ fontSize: 12, color: "rgba(110,90,150,0.6)", letterSpacing: "0.12em" }}>
              {product.metric.label.toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: 14, color: "rgba(110,90,150,0.5)", letterSpacing: "0.08em" }}>
            konjo.ai/products/{product.slug}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
