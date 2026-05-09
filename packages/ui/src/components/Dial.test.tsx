import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dial } from "./Dial";

describe("Dial", () => {
  it("renders the formatted value and unit", () => {
    render(<Dial value={42} unit="%" label="Coverage" />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("Coverage")).toBeInTheDocument();
  });

  it("clamps below min and above max", () => {
    const { rerender } = render(<Dial value={-5} min={0} max={10} />);
    expect(screen.getByText("0")).toBeInTheDocument();
    rerender(<Dial value={1000} min={0} max={10} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("exposes ARIA meter semantics", () => {
    render(<Dial value={3} min={0} max={10} label="Errors" />);
    const meter = screen.getByRole("meter", { name: "Errors" });
    expect(meter).toHaveAttribute("aria-valuenow", "3");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "10");
  });

  it("hides the readout when hideValue is set", () => {
    render(<Dial value={42} unit="%" hideValue />);
    expect(screen.queryByText("42")).not.toBeInTheDocument();
  });

  it("applies a custom formatter", () => {
    render(<Dial value={3.14159} format={(v) => v.toFixed(2)} />);
    expect(screen.getByText("3.14")).toBeInTheDocument();
  });
});
