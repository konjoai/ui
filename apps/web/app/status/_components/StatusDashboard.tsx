"use client";

import { Dial, MetricCard, TimeSeriesChart } from "@konjoai/ui";
import type { TimeSeriesPoint } from "@konjoai/ui";
import { useLiveTimeSeries } from "@/lib/hooks";

/** Deterministic 30-day uptime seed — toki incident on days 20–22. */
const UPTIME_SEED: TimeSeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const incident = i >= 20 && i <= 22;
  const base = incident
    ? 88 + Math.sin(i * 1.3) * 1.5
    : 99.3 + Math.sin(i * 0.7) * 0.5;
  return { t: i, value: base };
});

/** Live portfolio health monitoring — dial, KPI cards, 30-day uptime sparkline. */
export function StatusDashboard() {
  const uptime = useLiveTimeSeries(UPTIME_SEED, 4000, 32, (t) =>
    99.2 + Math.sin(t * 0.0008) * 0.4,
  );

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="glass-konjo rounded-konjo-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">

          <div className="flex flex-col items-center justify-center gap-2">
            <Dial
              value={89}
              min={0}
              max={100}
              size={180}
              label="Portfolio Health"
              unit="%"
              severity="ok"
              sublabel="7 of 9 nominal"
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard
                value={98.7}
                label="30d Uptime"
                unit="%"
                severity="ok"
                delta={0.2}
                deltaLabel="vs prior 30d"
              />
              <MetricCard
                value={8.2}
                label="p99 Latency"
                unit="ms"
                severity="warn"
                delta={-1.1}
                deltaLabel="vs prior"
              />
              <MetricCard
                value={9}
                label="Endpoints"
                severity="info"
              />
              <MetricCard
                value={1}
                label="Incidents"
                unit="/ 30d"
                severity="warn"
                delta={-2}
                deltaLabel="vs prior"
              />
            </div>

            <div>
              <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
                30-day uptime · toki incident d20–22
              </p>
              <TimeSeriesChart
                data={uptime}
                label="Uptime"
                unit="%"
                severity="ok"
                height={120}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
