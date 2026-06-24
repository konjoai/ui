/** Converts a slug string into a stable integer seed. */
function seed(slug: string): number {
  return slug.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
}

interface MiniSparklineProps {
  slug: string;
  width?: number;
  height?: number;
}

/**
 * Deterministic 8-point uptime sparkline for a product — pure SVG,
 * fully server-renderable, no JavaScript required.
 */
export function MiniSparkline({ slug, width = 72, height = 28 }: MiniSparklineProps) {
  const s = seed(slug);
  const pts = Array.from({ length: 8 }, (_, i) => {
    const v = 97.5 + Math.sin((s + i * 2.7) * 0.6) * 2.1 + Math.cos((s * 0.3 + i) * 0.9) * 1.1;
    return Math.max(92, Math.min(100, v));
  });
  const lo = Math.min(...pts);
  const hi = Math.max(...pts);
  const range = hi - lo || 1;
  const pad = 3;
  const coords = pts.map((v, i) => [
    (i / (pts.length - 1)) * width,
    height - pad - ((v - lo) / range) * (height - pad * 2),
  ] as const);
  const d = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className="hidden sm:block"
    >
      <path
        d={d}
        fill="none"
        stroke="var(--color-konjo-good)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}
