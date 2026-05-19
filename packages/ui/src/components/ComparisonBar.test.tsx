import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComparisonBar } from "./ComparisonBar";
import type { ComparisonBarItem } from "./ComparisonBar";

const ITEMS: ComparisonBarItem[] = [
  { label: "Recall@10",  value: 87, baseline: 85 },
  { label: "MRR@10",    value: 74, baseline: 79 },
  { label: "NDCG@10",   value: 91 },
];

describe("ComparisonBar", () => {
  it("renders item labels", () => {
    render(<ComparisonBar items={ITEMS} />);
    expect(screen.getByText("Recall@10")).toBeInTheDocument();
    expect(screen.getByText("MRR@10")).toBeInTheDocument();
    expect(screen.getByText("NDCG@10")).toBeInTheDocument();
  });

  it("renders formatted values with the unit suffix", () => {
    render(<ComparisonBar items={ITEMS} unit="%" />);
    expect(screen.getAllByText("%").length).toBeGreaterThan(0);
  });

  it("renders baseline labels when baseline is provided", () => {
    render(<ComparisonBar items={ITEMS} />);
    expect(screen.getByText(/baseline 85\.0/)).toBeInTheDocument();
    expect(screen.getByText(/baseline 79\.0/)).toBeInTheDocument();
  });

  it("renders sublabel text when provided", () => {
    render(
      <ComparisonBar
        items={[{ label: "Recall@10", value: 87, sublabel: "fp32 reference" }]}
      />,
    );
    expect(screen.getByText("fp32 reference")).toBeInTheDocument();
  });

  it("exposes ARIA meter semantics on each bar", () => {
    render(<ComparisonBar items={ITEMS} max={100} />);
    const meters = screen.getAllByRole("meter");
    expect(meters).toHaveLength(3);
    expect(meters[0]).toHaveAttribute("aria-valuenow", "87");
    expect(meters[0]).toHaveAttribute("aria-valuemin", "0");
    expect(meters[0]).toHaveAttribute("aria-valuemax", "100");
  });

  it("returns null with an empty items array", () => {
    const { container } = render(<ComparisonBar items={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
