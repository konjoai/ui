import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders label and integer value", () => {
    render(<MetricCard value={87} label="Compliance Score" />);
    expect(screen.getByText("Compliance Score")).toBeInTheDocument();
    expect(screen.getByText("87")).toBeInTheDocument();
  });

  it("renders unit suffix", () => {
    render(<MetricCard value={87} label="Score" unit="%" />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("renders a pre-formatted string value", () => {
    render(<MetricCard value="0.942" label="NDCG@10" />);
    expect(screen.getByText("0.942")).toBeInTheDocument();
  });

  it("formats decimal numbers with one decimal place by default", () => {
    render(<MetricCard value={9.4} label="Latency" unit="ms" />);
    expect(screen.getByText("9.4")).toBeInTheDocument();
  });

  it("renders positive delta with ↑ arrow and + prefix", () => {
    render(<MetricCard value={87} label="Score" delta={3} deltaLabel="vs last run" />);
    expect(screen.getByText("↑")).toBeInTheDocument();
    expect(screen.getByText("+3")).toBeInTheDocument();
    expect(screen.getByText("vs last run")).toBeInTheDocument();
  });

  it("renders negative delta with ↓ arrow and − prefix", () => {
    render(<MetricCard value={74} label="MRR" delta={-5} />);
    expect(screen.getByText("↓")).toBeInTheDocument();
    expect(screen.getByText("−5")).toBeInTheDocument();
  });

  it("renders zero delta as em dash with no directional arrow", () => {
    render(<MetricCard value={62} label="Docs" delta={0} />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByText("↑")).toBeNull();
    expect(screen.queryByText("↓")).toBeNull();
  });

  it("applies a custom format function to numeric values", () => {
    render(<MetricCard value={0.942} label="Score" format={(v) => v.toFixed(3)} />);
    expect(screen.getByText("0.942")).toBeInTheDocument();
  });

  it("omits the delta row when delta is not provided", () => {
    render(<MetricCard value={87} label="Score" />);
    expect(screen.queryByText("↑")).toBeNull();
    expect(screen.queryByText("↓")).toBeNull();
    expect(screen.queryByText("—")).toBeNull();
  });

  it("exposes role=status with aria-label containing label and value", () => {
    render(<MetricCard value={87} label="Compliance Score" unit="%" />);
    const card = screen.getByRole("status");
    const label = card.getAttribute("aria-label") ?? "";
    expect(label).toContain("Compliance Score");
    expect(label).toContain("87 %");
  });

  it("includes delta in the aria-label when provided", () => {
    render(<MetricCard value={88} label="EU AI Act" unit="%" delta={4} deltaLabel="vs prior audit" />);
    const card = screen.getByRole("status");
    const label = card.getAttribute("aria-label") ?? "";
    expect(label).toContain("delta");
    expect(label).toContain("vs prior audit");
  });
});
