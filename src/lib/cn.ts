/**
 * cn — tiny className joiner. No deps.
 *
 *   cn("a", false && "b", undefined, "c") → "a c"
 */
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue): void => {
    if (!v && v !== 0) return;
    if (typeof v === "string" || typeof v === "number") {
      out.push(String(v));
      return;
    }
    if (Array.isArray(v)) {
      for (const item of v) walk(item);
    }
  };
  for (const i of inputs) walk(i);
  return out.join(" ");
}
