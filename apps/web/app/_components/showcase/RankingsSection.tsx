"use client";

import { RankList, TimeSeriesChart } from "@konjoai/ui";
import type { RankListItem, TimeSeriesPoint } from "@konjoai/ui";
import { useLiveTimeSeries } from "@/lib/hooks";

const RANK_ITEMS: RankListItem[] = [
  { label: "Constitutional AI",         score: 0.942, sublabel: "Anthropic · 2022"       },
  { label: "Scalable Oversight",        score: 0.881, sublabel: "Bowman et al. · 2022"   },
  { label: "Chain-of-Thought",          score: 0.834, sublabel: "Wei et al. · 2022"      },
  { label: "Self-Consistency Decoding", score: 0.776, sublabel: "Wang et al. · 2022"     },
  { label: "Least-to-Most Prompting",   score: 0.714, sublabel: "Zhou et al. · 2022"     },
];

const SEED_THROUGHPUT: TimeSeriesPoint[] = Array.from({ length: 40 }, (_, i) => ({
  t: i * 500,
  value: 42 + Math.sin(i * 0.38) * 14 + (i % 6) * 1.8,
}));

const SEED_LATENCY: TimeSeriesPoint[] = Array.from({ length: 40 }, (_, i) => ({
  t: i * 500,
  value: 26 + Math.cos(i * 0.42) * 9 + (i % 5) * 1.2,
}));

/** Live sparklines (kairu throughput + latency) and scored RankList (kyro NDCG). */
export function RankingsSection() {
  const throughput = useLiveTimeSeries(SEED_THROUGHPUT, 800, 60,
    (t) => 42 + Math.sin(t * 0.001) * 14 + Math.random() * 6,
  );
  const latency = useLiveTimeSeries(SEED_LATENCY, 800, 60,
    (t) => 26 + Math.cos(t * 0.0008) * 9 + Math.random() * 4,
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          TimeSeriesChart · kairu live inference telemetry
        </p>
        <div className="flex flex-wrap gap-4">
          <TimeSeriesChart
            data={throughput}
            label="Throughput"
            unit="tok/s"
            severity="ok"
            width={360}
            height={130}
          />
          <TimeSeriesChart
            data={latency}
            label="p99 Latency"
            unit="ms"
            severity="warn"
            width={360}
            height={130}
          />
        </div>
      </div>
      <div>
        <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          RankList · kyro retrieval NDCG ranking
        </p>
        <RankList items={RANK_ITEMS} maxScore={1} scoreDecimals={3} />
      </div>
    </div>
  );
}
