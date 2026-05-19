import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RankList } from "./RankList";
import type { RankListItem } from "./RankList";

const ITEMS: RankListItem[] = [
  { label: "Constitutional AI",   score: 0.942, sublabel: "Anthropic · 2022" },
  { label: "Chain-of-Thought",    score: 0.834, sublabel: "Wei et al. · 2022" },
  { label: "Self-Consistency",    score: 0.776 },
];

describe("RankList", () => {
  it("renders item labels", () => {
    render(<RankList items={ITEMS} />);
    expect(screen.getByText("Constitutional AI")).toBeInTheDocument();
    expect(screen.getByText("Chain-of-Thought")).toBeInTheDocument();
    expect(screen.getByText("Self-Consistency")).toBeInTheDocument();
  });

  it("renders sublabels when provided", () => {
    render(<RankList items={ITEMS} />);
    expect(screen.getByText("Anthropic · 2022")).toBeInTheDocument();
  });

  it("uses 1-based rank when no explicit rank is provided", () => {
    render(<RankList items={ITEMS} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveAttribute("aria-label", expect.stringContaining("#1:"));
    expect(listItems[1]).toHaveAttribute("aria-label", expect.stringContaining("#2:"));
    expect(listItems[2]).toHaveAttribute("aria-label", expect.stringContaining("#3:"));
  });

  it("uses the explicit rank when provided", () => {
    render(<RankList items={[{ label: "Doc A", score: 0.9, rank: 7 }]} />);
    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("aria-label", expect.stringContaining("#7:"));
  });

  it("includes the score and scoreUnit in aria-label", () => {
    render(<RankList items={ITEMS} scoreUnit="BM25" />);
    const first = screen.getAllByRole("listitem")[0];
    expect(first).toHaveAttribute("aria-label", expect.stringContaining("0.942"));
    expect(first).toHaveAttribute("aria-label", expect.stringContaining("BM25"));
  });

  it("exposes an ordered list role", () => {
    render(<RankList items={ITEMS} />);
    expect(screen.getByRole("list", { name: "Ranked list" })).toBeInTheDocument();
  });

  it("returns null with an empty items array", () => {
    const { container } = render(<RankList items={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
