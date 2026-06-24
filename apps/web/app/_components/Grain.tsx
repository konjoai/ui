/**
 * Full-page noise grain overlay — adds subtle analog film texture.
 * Pure CSS/SVG, no JavaScript. pointer-events-none so nothing is blocked.
 * Animation respects prefers-reduced-motion via CSS.
 */
export function Grain() {
  return (
    <div
      aria-hidden
      className="konjo-grain pointer-events-none fixed inset-0 z-[5] select-none"
    />
  );
}
