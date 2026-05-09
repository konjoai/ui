/**
 * Konjo design tokens — programmatic mirror of the CSS @theme block.
 *
 * Most components style via Tailwind utilities (`bg-konjo-accent`, etc.).
 * This module exists for the rare case a value is needed in JS — e.g. a Three.js
 * uniform, a regl color attribute, or an SVG `stroke` set imperatively.
 *
 * Keep in sync with src/index.css @theme. Single source of truth lives in CSS;
 * this is a typed shadow.
 */

export const color = {
  bg:        "#0a0c12",
  surface:   "#11141c",
  surface2:  "#181c27",
  line:      "#232838",
  lineSoft:  "#1a1e2a",

  fg:        "#e7ecf4",
  fgMuted:   "#8a93a8",
  fgFaint:   "#4a5063",

  accent:    "#7ad7ff",
  violet:    "#b794ff",
  warm:      "#f6c177",
  hot:       "#ff4d6d",
  good:      "#6ee7a3",
  cool:      "#5fb3ff",
} as const;

export type ColorToken = keyof typeof color;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
} as const;

export const font = {
  sans:    'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  display: 'Inter, ui-sans-serif, system-ui, sans-serif',
  mono:    '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
} as const;

/**
 * Severity → token color. Used by RiskRing, FightCard, severity badges.
 */
export const severity = {
  ok:       color.good,
  info:     color.cool,
  warn:     color.warm,
  high:     color.hot,
  critical: color.hot,
} as const;

export type Severity = keyof typeof severity;
