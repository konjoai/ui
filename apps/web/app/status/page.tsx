import type { Metadata } from "next";
import { severity as sevColor } from "@konjoai/ui";
import { Footer } from "@/app/_components/Footer";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
import { StatusDashboard } from "@/app/status/_components/StatusDashboard";
import { RecentEvents } from "@/app/status/_components/RecentEvents";
import { LastUpdated } from "@/app/status/_components/LastUpdated";
import { ProductStatusList } from "@/app/status/_components/ProductStatusList";
import { UptimeCalendar } from "@/app/status/_components/UptimeCalendar";
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

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <UptimeCalendar />
      </section>

      <RecentEvents />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="text-konjo-mono mb-4 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          Product endpoints
        </p>
        <ProductStatusList />
        <LastUpdated buildTime={BUILD_TIME} />
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
