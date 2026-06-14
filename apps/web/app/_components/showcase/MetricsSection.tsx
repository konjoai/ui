"use client";

import { useState, useEffect } from "react";
import { MetricCard, Dial } from "@konjoai/ui";
import type { Severity } from "@konjoai/ui";

type MetricDef = {
  key: string;
  label: string;
  unit: string;
  base: number;
  amp: number;
  delta: number;
  deltaLabel: string;
  severity: Severity;
  min?: number;
  max?: number;
  sublabel?: string;
};

const METRICS: MetricDef[] = [
  { key: "euAiAct",     label: "EU AI Act",   unit: "%",     base: 88, amp: 2, delta:  4, deltaLabel: "vs prior audit", severity: "ok",   sublabel: "squash"  },
  { key: "throughput",  label: "Throughput",  unit: "tok/s", base: 42, amp: 5, delta:  3, deltaLabel: "vs baseline",    severity: "info", min: 0, max: 120, sublabel: "kairu"   },
  { key: "ndcg",        label: "NDCG@10",     unit: "%",     base: 91, amp: 1, delta:  7, deltaLabel: "vs fp32",        severity: "ok",   sublabel: "kyro"    },
  { key: "compression", label: "Compression", unit: "×",     base: 32, amp: 3, delta: -1, deltaLabel: "vs fp32",        severity: "info", min: 0, max: 64, sublabel: "vectro"  },
];

type Values = Record<string, number>;

function seedValues(): Values {
  return Object.fromEntries(METRICS.map((m) => [m.key, m.base]));
}

function nudge(base: number, amp: number): number {
  return Math.round(base + (Math.random() - 0.5) * amp * 2);
}

/** Live MetricCard headline KPIs + Dial circular gauges with subtle fluctuation. */
export function MetricsSection() {
  const [values, setValues] = useState<Values>(seedValues);

  useEffect(() => {
    const id = setInterval(() => {
      setValues(Object.fromEntries(METRICS.map((m) => [m.key, nudge(m.base, m.amp)])));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          MetricCard · headline KPIs
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {METRICS.map((m) => (
            <MetricCard
              key={m.key}
              value={values[m.key]}
              label={m.label}
              unit={m.unit}
              delta={m.delta}
              deltaLabel={m.deltaLabel}
              severity={m.severity}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          Dial · circular gauges
        </p>
        <div className="flex flex-wrap items-end justify-around gap-6">
          {METRICS.map((m) => (
            <Dial
              key={m.key}
              value={values[m.key]}
              label={m.label}
              unit={m.unit}
              severity={m.severity}
              size={140}
              sublabel={m.sublabel}
              min={m.min}
              max={m.max}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
