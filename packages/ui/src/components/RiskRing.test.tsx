import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RiskRing } from "./RiskRing";

describe("RiskRing", () => {
  it("renders the headline label and percent", () => {
    render(
      <RiskRing
        rings={[
          { label: "EU AI Act",   value: 0.88, severity: "ok" },
          { label: "NIST RMF",    value: 0.74, severity: "warn" },
          { label: "OWASP LLM",   value: 0.91, severity: "info" },
        ]}
      />,
    );
    expect(screen.getByText("EU AI Act")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
  });

  it("renders inner-ring legend entries with their percents", () => {
    render(
      <RiskRing
        rings={[
          { label: "Outer", value: 0.5 },
          { label: "Inner", value: 0.42 },
        ]}
      />,
    );
    expect(screen.getByText("Inner")).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("returns null with no rings", () => {
    const { container } = render(<RiskRing rings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("respects an explicit title and subtitle", () => {
    render(
      <RiskRing
        title="Compliance"
        subtitle="GPT-7 Mini"
        rings={[{ label: "ignored-when-title-set", value: 0.5 }]}
      />,
    );
    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(screen.getByText("GPT-7 Mini")).toBeInTheDocument();
  });
});
