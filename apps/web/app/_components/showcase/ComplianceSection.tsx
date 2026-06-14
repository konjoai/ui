"use client";

import { useState, useEffect } from "react";
import { RiskRing, StatusMatrix, ComparisonBar } from "@konjoai/ui";
import type { StatusMatrixRow, ComparisonBarItem, RiskRingItem } from "@konjoai/ui";

const MATRIX_ROWS: StatusMatrixRow[] = [
  {
    label: "Article 10 — Data",
    cells: [
      { status: "pass",    detail: "Training data catalogue complete" },
      { status: "warn",    detail: "Bias audit scheduled Aug 2026"    },
      { status: "pending", detail: "Validation set under review"      },
    ],
  },
  {
    label: "Article 11 — Tech Docs",
    cells: [
      { status: "pass",    detail: "Architecture diagram v2 approved" },
      { status: "pass",    detail: "Capability statement signed off"  },
      { status: "fail",    detail: "Change log gap: Apr–May 2026"     },
    ],
  },
  {
    label: "Article 14 — Oversight",
    cells: [
      { status: "pass",    detail: "Human-in-loop gate deployed"      },
      { status: "warn",    detail: "Override audit trail incomplete"  },
      { status: "pass",    detail: "Stop mechanism tested"            },
    ],
  },
  {
    label: "Article 15 — Accuracy",
    cells: [
      { status: "pass",    detail: "Benchmark suite locked"           },
      { status: "pass",    detail: "Robustness tests green"           },
      { status: "pending", detail: "Adversarial eval in progress"     },
    ],
  },
];

const BENCHMARKS: ComparisonBarItem[] = [
  { label: "EU AI Act",         value: 88, baseline: 80 },
  { label: "NIST AI RMF",       value: 74, baseline: 85 },
  { label: "OWASP LLM Top-10",  value: 91, baseline: 75 },
  { label: "ISO 42001",         value: 67, baseline: 70 },
];

/** Rotating audit scenarios — simulates periodic re-assessment scans. */
const RING_SCENARIOS: RiskRingItem[][] = [
  [
    { label: "EU AI Act",        value: 0.88, severity: "ok"   },
    { label: "NIST AI RMF",      value: 0.74, severity: "warn" },
    { label: "OWASP LLM Top-10", value: 0.91, severity: "info" },
  ],
  [
    { label: "EU AI Act",        value: 0.92, severity: "ok"   },
    { label: "NIST AI RMF",      value: 0.76, severity: "warn" },
    { label: "OWASP LLM Top-10", value: 0.89, severity: "info" },
  ],
  [
    { label: "EU AI Act",        value: 0.85, severity: "ok"   },
    { label: "NIST AI RMF",      value: 0.79, severity: "warn" },
    { label: "OWASP LLM Top-10", value: 0.94, severity: "ok"   },
  ],
];

/** Compliance Monitor: live-cycling RiskRing, StatusMatrix, ComparisonBar — squash palette. */
export function ComplianceSection() {
  const [scenario, setScenario] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setScenario((s) => (s + 1) % RING_SCENARIOS.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="shrink-0">
          <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
            RiskRing · periodic re-assessment
          </p>
          <RiskRing
            size={256}
            title="Compliance"
            subtitle={`Scan ${scenario + 1} of ${RING_SCENARIOS.length}`}
            rings={RING_SCENARIOS[scenario]}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
            StatusMatrix · article compliance grid
          </p>
          <StatusMatrix
            rows={MATRIX_ROWS}
            columns={["Requirements", "Evidence", "Timeline"]}
          />
        </div>
      </div>
      <div>
        <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          ComparisonBar · score vs. threshold
        </p>
        <ComparisonBar items={BENCHMARKS} unit="%" max={100} />
      </div>
    </div>
  );
}
