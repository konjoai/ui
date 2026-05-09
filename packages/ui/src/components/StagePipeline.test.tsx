import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StagePipeline } from "./StagePipeline";
import type { Stage } from "./StagePipeline";

const STAGES: Stage[] = [
  { id: "a", label: "Intent",   status: "done",    durationMs: 4 },
  { id: "b", label: "Retrieve", status: "active",  durationMs: 22, detail: "12 docs" },
  { id: "c", label: "Generate", status: "pending" },
];

describe("StagePipeline", () => {
  it("renders all stage labels and detail", () => {
    render(<StagePipeline stages={STAGES} />);
    expect(screen.getByText("Intent")).toBeInTheDocument();
    expect(screen.getByText("Retrieve")).toBeInTheDocument();
    expect(screen.getByText("Generate")).toBeInTheDocument();
    expect(screen.getByText("12 docs")).toBeInTheDocument();
  });

  it("formats sub-10ms durations with 1 decimal", () => {
    render(<StagePipeline stages={[{ id: "x", label: "Fast", status: "done", durationMs: 4.2 }]} />);
    expect(screen.getByText("4.2ms")).toBeInTheDocument();
  });

  it("formats >=10ms durations as integers", () => {
    render(<StagePipeline stages={[{ id: "x", label: "Med", status: "done", durationMs: 22 }]} />);
    expect(screen.getByText("22ms")).toBeInTheDocument();
  });

  it("marks the active stage with aria-current=step", () => {
    render(<StagePipeline stages={STAGES} />);
    const active = screen.getByText("Retrieve").closest("button")!;
    expect(active).toHaveAttribute("aria-current", "step");
  });

  it("invokes onStageClick with the stage id", async () => {
    const cb = vi.fn();
    render(<StagePipeline stages={STAGES} onStageClick={cb} />);
    await userEvent.click(screen.getByText("Retrieve"));
    expect(cb).toHaveBeenCalledWith("b");
  });
});
