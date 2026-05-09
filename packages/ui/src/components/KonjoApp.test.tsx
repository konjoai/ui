import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KonjoApp } from "./KonjoApp";

describe("KonjoApp", () => {
  it("renders the product name and children", () => {
    render(
      <KonjoApp product="miru" tagline="The mind of the machine">
        <div>hello</div>
      </KonjoApp>,
    );
    expect(screen.getByText("miru")).toBeInTheDocument();
    expect(screen.getByText("The mind of the machine")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders the wordmark", () => {
    render(<KonjoApp product="x" />);
    expect(screen.getByText("konjo")).toBeInTheDocument();
  });

  it("renders a status pill when provided", () => {
    render(<KonjoApp product="x" status={{ label: "live" }} />);
    const pill = screen.getByRole("status");
    expect(pill).toHaveTextContent(/live/i);
  });
});
