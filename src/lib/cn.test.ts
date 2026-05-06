import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy strings with a space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, undefined, null, "", 0 as unknown as string, "b")).toBe("a 0 b");
  });

  it("flattens nested arrays", () => {
    expect(cn("a", ["b", ["c", false, "d"]])).toBe("a b c d");
  });

  it("returns empty string for nothing", () => {
    expect(cn()).toBe("");
    expect(cn(false, null, undefined)).toBe("");
  });
});
