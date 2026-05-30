import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the canonical label for each level", () => {
    const { rerender } = render(<StatusBadge level="operational" />);
    expect(screen.getByText("Operational")).toBeInTheDocument();
    rerender(<StatusBadge level="degraded" />);
    expect(screen.getByText("Degraded")).toBeInTheDocument();
    rerender(<StatusBadge level="outage" />);
    expect(screen.getByText("Outage")).toBeInTheDocument();
    rerender(<StatusBadge level="research" />);
    expect(screen.getByText("Research")).toBeInTheDocument();
  });

  it("allows custom label override and exposes aria-label", () => {
    render(<StatusBadge level="degraded" label="High p99 latency" />);
    const node = screen.getByRole("status");
    expect(node).toHaveAttribute("aria-label", "Degraded — High p99 latency");
    expect(node).toHaveTextContent("High p99 latency");
  });

  it("formats a last-checked timestamp in UTC HH:MM:SS", () => {
    render(
      <StatusBadge
        level="operational"
        lastCheckedAt="2026-05-30T09:07:42.000Z"
      />,
    );
    expect(screen.getByText(/· 09:07:42 UTC/)).toBeInTheDocument();
  });

  it("pulses operational by default and not when explicitly disabled", () => {
    const { container, rerender } = render(<StatusBadge level="operational" />);
    expect(container.querySelector(".konjo-pulse")).not.toBeNull();
    rerender(<StatusBadge level="operational" pulse={false} />);
    expect(container.querySelector(".konjo-pulse")).toBeNull();
  });

  it("does not pulse non-operational levels by default", () => {
    const { container } = render(<StatusBadge level="degraded" />);
    expect(container.querySelector(".konjo-pulse")).toBeNull();
  });

  it("falls back to the raw timestamp if it is unparseable", () => {
    render(<StatusBadge level="checking" lastCheckedAt="not-a-date" />);
    expect(screen.getByText(/· not-a-date/)).toBeInTheDocument();
  });
});
