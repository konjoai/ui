import type { Metadata } from "next";
import { StatusBadge, severity as sevColor } from "@konjoai/ui";
import { Footer } from "@/app/_components/Footer";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
import { StatusDashboard } from "@/app/status/_components/StatusDashboard";
import { RecentEvents } from "@/app/status/_components/RecentEvents";
import { MiniSparkline } from "@/app/status/_components/MiniSparkline";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Status — KonjoAI",
  description: "Live health of the KonjoAI portfolio.",
};

const BUILD_TIME = new Date().toISOString();

function overallLevel(): "operational" | "degraded" | "outage" {
  const has = (l: typeof PRODUCTS[number]["status"]) => PRODUCTS.some((p) => p.status === l);
  if (has("outage")) return "outage";
  if (has("degraded")) return "degraded";
  return "operational";
}

const OVERALL_COPY = {
  operational: "All systems normal",
  degraded: "Partial degradation",
  outage: "Service disruption",
} as const;

export default function StatusPage() {
  const overall = overallLevel();
  const operational = PRODUCTS.filter((p) => p.status === "operational").length;
  const degraded = PRODUCTS.filter((p) => p.status === "degraded").length;
  const research = PRODUCTS.filter((p) => p.status === "research").length;

  return (
    <main className="aurora-konjo relative min-h-screen overflow-x-clip">
      <div className="aurora-konjo-bg" aria-hidden />

      <div className="mx-auto max-w-6xl px-6 pt-6">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Status" }]} />
      </div>

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-8 sm:pt-16">
        <div className="mb-4 flex items-center gap-2">
          <span
            className="inline-block size-2.5 animate-pulse rounded-full"
            style={{ background: overall === "operational" ? sevColor.ok : sevColor.warn }}
            aria-hidden
          />
          <p className="text-konjo-mono text-xs uppercase tracking-widest text-konjo-fg-faint">
            Portfolio health
          </p>
        </div>
        <h1 className="text-konjo-display text-konjo-gradient text-5xl font-semibold tracking-tight sm:text-6xl">
          {OVERALL_COPY[overall]}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-konjo-fg-muted sm:text-lg">
          Live indicators for every KonjoAI product subdomain. Each entry links
          to the upstream repo for incident reports and changelog.
        </p>

        <dl className="text-konjo-mono mt-8 grid grid-cols-3 gap-3 text-xs sm:max-w-md">
          <Stat label="Operational" value={operational} tone="good" />
          <Stat label="Degraded" value={degraded} tone="warm" />
          <Stat label="Research" value={research} tone="violet" />
        </dl>
      </section>

      <StatusDashboard />

      <RecentEvents />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="text-konjo-mono mb-4 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          Product endpoints
        </p>
        <ul role="list" className="grid grid-cols-1 gap-3">
          {PRODUCTS.map((p) => (
            <li key={p.slug}>
              <article className="glass-konjo rounded-konjo-lg flex items-center justify-between gap-4 p-5 transition-colors hover:bg-konjo-surface/60">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="text-konjo-mono text-2xl leading-none text-konjo-violet"
                  >
                    {p.glyph}
                  </span>
                  <div>
                    <a
                      href={`/products/${p.slug}`}
                      className="text-konjo-display text-lg font-semibold tracking-tight text-konjo-fg transition-colors hover:text-konjo-violet"
                    >
                      {p.name}
                    </a>
                    <p className="text-xs text-konjo-fg-muted">{p.tagline}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  {/* 7-day uptime mini-sparkline */}
                  <MiniSparkline slug={p.slug} />

                  {/* Live headline metric */}
                  <div
                    className="text-konjo-mono hidden flex-col items-end sm:flex"
                    aria-label={`${p.metric.label}: ${p.metric.value}${p.metric.unit}`}
                  >
                    <span
                      className="text-lg font-semibold tabular-nums leading-none"
                      style={{ color: sevColor[p.metric.severity] }}
                    >
                      {p.metric.value}
                      <span className="ml-0.5 text-xs text-konjo-fg-muted">
                        {p.metric.unit}
                      </span>
                    </span>
                    <span className="mt-0.5 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
                      {p.metric.label}
                    </span>
                  </div>

                  <StatusBadge level={p.status} lastCheckedAt={BUILD_TIME} />

                  <a
                    href={`https://${p.slug}.konjo.ai`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-konjo-mono hidden rounded-konjo border border-konjo-line/60 px-2.5 py-1 text-[11px] text-konjo-fg-muted transition-colors hover:border-konjo-line hover:text-konjo-fg lg:inline-block"
                  >
                    {p.slug}.konjo.ai ↗
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="text-konjo-mono mt-6 text-xs text-konjo-fg-faint">
          Last regenerated · {BUILD_TIME}
        </p>
      </section>

      <Footer />
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "good" | "warm" | "violet";
}) {
  const toneCls =
    tone === "good"
      ? "text-konjo-good"
      : tone === "warm"
        ? "text-konjo-warm"
        : "text-konjo-violet";
  return (
    <div className="glass-konjo rounded-konjo p-3">
      <p className="text-[10px] uppercase tracking-widest text-konjo-fg-faint">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-semibold ${toneCls}`}>{value}</p>
    </div>
  );
}
