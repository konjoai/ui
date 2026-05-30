import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { StatusMatrix } from "./StatusMatrix";
import type { StatusMatrixRow } from "./StatusMatrix";

const ROWS: StatusMatrixRow[] = [
  {
    label: "Article 9",
    cells: [
      { status: "pass", detail: "Documented" },
      { status: "warn", detail: "Review needed" },
    ],
  },
  {
    label: "Article 13",
    cells: [
      { status: "fail", detail: "Missing disclosure" },
      { status: "pass" },
    ],
  },
];

describe("StatusMatrix", () => {
  it("renders row header labels", () => {
    render(<StatusMatrix rows={ROWS} />);
    expect(screen.getByText("Article 9")).toBeInTheDocument();
    expect(screen.getByText("Article 13")).toBeInTheDocument();
  });

  it("renders column headers when provided", () => {
    render(<StatusMatrix rows={ROWS} columns={["Requirements", "Evidence"]} />);
    expect(screen.getByText("Requirements")).toBeInTheDocument();
    expect(screen.getByText("Evidence")).toBeInTheDocument();
  });

  it("exposes ARIA table semantics", () => {
    render(<StatusMatrix rows={ROWS} />);
    expect(screen.getByRole("table", { name: "Status matrix" })).toBeInTheDocument();
  });

  it("renders cells with descriptive aria-labels", () => {
    render(<StatusMatrix rows={ROWS} columns={["Req", "Evi"]} />);
    expect(screen.getAllByRole("cell", { name: /pass/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("cell", { name: /fail/i }).length).toBeGreaterThan(0);
  });

  it("shows a summary with correct counts", () => {
    render(<StatusMatrix rows={ROWS} />);
    const summary = screen.getByRole("row", { name: "Summary" });
    // 2 pass, 1 fail, 1 warn — status labels are present
    expect(within(summary).getByText("pass")).toBeInTheDocument();
    expect(within(summary).getByText("fail")).toBeInTheDocument();
    expect(within(summary).getByText("warn")).toBeInTheDocument();
    // "2" appears exactly once (the pass count)
    expect(within(summary).getByText("2")).toBeInTheDocument();
  });

  it("hides the summary when showSummary is false", () => {
    render(<StatusMatrix rows={ROWS} showSummary={false} />);
    expect(screen.queryByRole("row", { name: "Summary" })).not.toBeInTheDocument();
  });

  it("returns null with no rows", () => {
    const { container } = render(<StatusMatrix rows={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
