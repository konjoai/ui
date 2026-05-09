import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TokenStream } from "./TokenStream";
import type { StreamToken } from "./TokenStream";

const TOKENS: StreamToken[] = [
  { text: "hello ", id: "a" },
  { text: "world",  id: "b", color: "#ff0000", weight: 0.8 },
];

describe("TokenStream", () => {
  it("renders all token text", () => {
    render(<TokenStream tokens={TOKENS} cursor={false} />);
    expect(screen.getByText(/hello/)).toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();
  });

  it("calls onTokenAppear once per new token", () => {
    const cb = vi.fn();
    const { rerender } = render(
      <TokenStream tokens={TOKENS.slice(0, 1)} onTokenAppear={cb} cursor={false} />,
    );
    expect(cb).toHaveBeenCalledTimes(1);
    rerender(<TokenStream tokens={TOKENS} onTokenAppear={cb} cursor={false} />);
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("renders no caret when cursor=false", () => {
    const { container } = render(<TokenStream tokens={TOKENS} cursor={false} />);
    expect(container.querySelectorAll("[aria-hidden='true']").length).toBe(0);
  });

  it("renders a caret when cursor=true (default)", () => {
    const { container } = render(<TokenStream tokens={TOKENS} />);
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });
});
