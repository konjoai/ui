import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductHero } from "./ProductHero";

describe("ProductHero", () => {
  it("renders the name as an h1 and the tagline as a paragraph", () => {
    render(<ProductHero name="squish" tagline="Local LLM inference, MLX-accelerated." />);
    expect(screen.getByRole("heading", { level: 1, name: "squish" })).toBeInTheDocument();
    expect(screen.getByText(/Local LLM inference/)).toBeInTheDocument();
  });

  it("renders the eyebrow, glyph, and version pill when provided", () => {
    render(
      <ProductHero
        name="vectro"
        tagline="Embedding compression."
        eyebrow="Sprint 6 · Quantization Forge"
        glyph="◇"
        version="v5.0.2"
      />,
    );
    expect(screen.getByText(/Sprint 6/)).toBeInTheDocument();
    expect(screen.getByText("◇")).toBeInTheDocument();
    expect(screen.getByText("v5.0.2")).toBeInTheDocument();
  });

  it("renders status + actions slots as ReactNode children", () => {
    render(
      <ProductHero
        name="kyro"
        tagline="Production RAG."
        status={<span data-testid="status">live</span>}
        actions={<button data-testid="cta">Try it</button>}
      />,
    );
    expect(screen.getByTestId("status")).toBeInTheDocument();
    expect(screen.getByTestId("cta")).toBeInTheDocument();
  });
});
