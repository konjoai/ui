"use client";

import { RiskRing, StatusMatrix, ComparisonBar } from "@konjoai/ui";
import type { StatusMatrixRow, ComparisonBarItem } from "@konjoai/ui";

const MATRIX_ROWS: StatusMatrixRow[] = [
  {
    label: "Article 9 — Risk",
    cells: [
      { status: "pass",    detail: "Risk classification documented" },
      { status: "pass",    detail: "Mitigation measures in place"   },
      { status: "warn",    detail: "Review pending Q3"              },
    ],
  },
  {
    label: "Article 13 — Trans.",
    cells: [
      { status: "pass" },
      { status: "fail",    detail: "Missing user disclosure"        },
      { status: "pass" },
    ],
  },
  {
    label: "Article 17 — QMS",
    cells: [
      { status: "warn",    detail: "Partial implementation"         },
      { status: "pass" },
      { status: "pending"                                            },
    ],
  },
  {
    label: "Annex IV — Docs",
    cells: [
      { status: "pass" },
      { status: "pass" },
      { status: "pass" },
    ],
  },
];

const BENCHMARKS: ComparisonBarItem[] = [
  { label: "EU AI Act",         value: 88, baseline: 80 },
  { label: "NIST AI RMF",       value: 74, baseline: 85 },
  { label: "OWASP LLM Top-10",  value: 91, baseline: 75 },
  { label: "ISO 42001",         value: 67, baseline: 70 },
];

/** Compliance Monitor: RiskRing, StatusMatrix, ComparisonBar — squash palette. */
export function ComplianceSection() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="shrink-0">
          <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
            RiskRing · concentric arcs
          </p>
          <RiskRing
            size={256}
            title="Compliance"
            subtitle="GPT-4 · ATT-7af3"
            rings={[
              { label: "EU AI Act",         value: 0.88, severity: "ok"   },
              { label: "NIST AI RMF",       value: 0.74, severity: "warn" },
              { label: "OWASP LLM Top-10",  value: 0.91, severity: "info" },
            ]}
          />
        </div>
        <div className="flex-1 min-w-0">
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
