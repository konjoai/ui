import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FeatureCard } from "./FeatureCard";

describe("FeatureCard", () => {
  it("renders title and description", () => {
    render(
      <FeatureCard title="Apple Silicon native" description="MLX-accelerated decode on M-series chips." />,
    );
    expect(screen.getByRole("heading", { name: "Apple Silicon native" })).toBeInTheDocument();
    expect(screen.getByText(/MLX-accelerated/)).toBeInTheDocument();
  });

  it("renders the optional glyph and eyebrow", () => {
    render(
      <FeatureCard
        glyph="◐"
        eyebrow="Inference"
        title="Speculative decoding"
        description="Draft model proposes, target verifies."
      />,
    );
    expect(screen.getByText("◐")).toBeInTheDocument();
    expect(screen.getByText("Inference")).toBeInTheDocument();
  });

  it("omits the eyebrow row when not provided", () => {
    render(<FeatureCard title="Plain" description="No eyebrow." />);
    expect(screen.queryByText(/uppercase tracking-widest/)).toBeNull();
  });
});
