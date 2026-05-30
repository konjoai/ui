import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimeSeriesChart } from "./TimeSeriesChart";
import type { TimeSeriesPoint } from "./TimeSeriesChart";

const DATA: TimeSeriesPoint[] = Array.from({ length: 10 }, (_, i) => ({
  t: i * 1000,
  value: 40 + i * 2,
}));

describe("TimeSeriesChart", () => {
  it("renders a no-data placeholder when data is empty", () => {
    render(<TimeSeriesChart data={[]} />);
    expect(screen.getByRole("img", { name: /no data/i })).toBeInTheDocument();
  });

  it("renders a single-point dataset as no-data", () => {
    render(<TimeSeriesChart data={[{ t: 0, value: 42 }]} />);
    expect(screen.getByRole("img", { name: /no data/i })).toBeInTheDocument();
  });

  it("uses the label as aria-label in the no-data state", () => {
    render(<TimeSeriesChart data={[]} label="Throughput" />);
    expect(screen.getByRole("img", { name: "Throughput" })).toBeInTheDocument();
  });

  it("exposes an img role with aria-label including the label and latest value", () => {
    render(<TimeSeriesChart data={DATA} label="tok/s" unit="t/s" />);
    const el = screen.getByRole("img");
    expect(el).toHaveAttribute("aria-label", expect.stringContaining("tok/s"));
    expect(el).toHaveAttribute("aria-label", expect.stringContaining("58"));
  });

  it("includes the latest value in the aria-label when no label prop is given", () => {
    render(<TimeSeriesChart data={DATA} />);
    const el = screen.getByRole("img");
    expect(el).toHaveAttribute("aria-label", expect.stringContaining("58"));
  });

  it("renders the label overlay text when label is provided", () => {
    render(<TimeSeriesChart data={DATA} label="Throughput" unit="tok/s" />);
    expect(screen.getByText("Throughput")).toBeInTheDocument();
    expect(screen.getByText("tok/s")).toBeInTheDocument();
  });
});
