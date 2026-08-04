/**
 * Small math + GLSL-source helpers shared by the particle hero effect.
 * Pure functions only — no DOM, no GL, no React.
 */

/** Clamp `value` into the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** GLSL-style smoothstep: 0 below edge0, 1 above edge1, smooth cubic in between. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Frame-rate-independent exponential lerp.
 * `lambda` is the approach rate (higher = snaps faster); `dt` is delta time in seconds.
 */
export function expLerp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/** Clamp a 2D vector's length to `maxLen`, returned as a new [x, y] tuple. */
export function clampVec2Length(x: number, y: number, maxLen: number): [number, number] {
  const len = Math.hypot(x, y);
  if (len <= maxLen || len === 0) return [x, y];
  const scale = maxLen / len;
  return [x * scale, y * scale];
}

/**
 * Half-height of the camera frustum at the given distance from a perspective camera.
 * Used to aspect-correct pointer NDC -> world-space conversion (ADR: design §3.5).
 */
export function worldHalfHeight(distance: number, fovDegrees: number): number {
  return distance * Math.tan((fovDegrees * Math.PI) / 360);
}

/**
 * Splice `#define` directives into a GLSL source string, immediately AFTER the
 * first line (which MUST be the literal `#version 300 es` pragma — GLSL requires
 * `#version` to be the first non-whitespace content in the file).
 *
 * Also trims any leading whitespace/blank lines that a `?raw` Vite import may
 * preserve from the source file — a leading blank line before `#version` silently
 * breaks compilation (design ADR-2 gotcha). This trim is applied even when
 * `defines` is empty, so ALL shader sources should be routed through this
 * function before being handed to an OGL `Program`.
 */
export function injectDefines(source: string, defines: string[]): string {
  const trimmed = source.trimStart();
  if (defines.length === 0) return trimmed;

  const newlineIndex = trimmed.indexOf('\n');
  if (newlineIndex === -1) return trimmed;

  const firstLine = trimmed.slice(0, newlineIndex);
  const rest = trimmed.slice(newlineIndex + 1);
  const defineBlock = defines.map((d) => `#define ${d}`).join('\n');
  return `${firstLine}\n${defineBlock}\n${rest}`;
}
