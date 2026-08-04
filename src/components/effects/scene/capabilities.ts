/**
 * Pure capability/tier detection for the particle hero effect.
 *
 * IMPORTANT: `evaluateCapabilities()` is the reduced-motion + WebGL2 +
 * float-render-target gate. It MUST run — and its result MUST be applied —
 * BEFORE any lasting `<canvas>`/WebGL context is created and BEFORE `ogl`
 * is imported (design §7). It creates a throwaway probe canvas/context to
 * test capability, then immediately releases it via `WEBGL_lose_context`,
 * so it never leaves a lasting GL object behind.
 */

export type Tier = 'high' | 'mid' | 'low';

export interface TierConfig {
  /** Simulation texture is square; particle count = simSize². */
  simSize: number;
  /** Capped devicePixelRatio for this tier. */
  dprCap: number;
  /** Resolution multiplier for the scene render target the warp pass samples. */
  sceneScale: number;
  /** Multi-tap count for the radial zoom-blur post pass. */
  postTaps: number;
  /** Use the cheaper single-scalar 2D curl-noise potential (4 evals vs 18). */
  curl2D: boolean;
  /** Base point size in CSS px before per-particle random size variance. */
  pointSizePx: number;
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  high: {
    simSize: 256,
    dprCap: 2.0,
    sceneScale: 1.0,
    postTaps: 12,
    curl2D: false,
    pointSizePx: 3.4,
  },
  mid: {
    simSize: 192,
    dprCap: 1.5,
    sceneScale: 0.75,
    postTaps: 8,
    curl2D: false,
    pointSizePx: 3.0,
  },
  low: { simSize: 128, dprCap: 1.5, sceneScale: 0.6, postTaps: 6, curl2D: true, pointSizePx: 2.6 },
};

/** Evaluated once at mount — deliberately simple heuristic (design §3.4). */
export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'low';
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (coarse || window.innerWidth < 768) return 'low';
  if (cores <= 4) return 'mid';
  return 'high';
}

export function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(pointer: coarse)').matches;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type ColorBufferSupport = 'float' | 'half-float' | null;

function probeColorBufferSupport(gl: WebGL2RenderingContext): ColorBufferSupport {
  if (gl.getExtension('EXT_color_buffer_float')) return 'float';
  if (gl.getExtension('EXT_color_buffer_half_float')) return 'half-float';
  return null;
}

export interface CapabilityResult {
  mode: 'webgl' | 'static';
  tier: Tier;
  colorBufferSupport: ColorBufferSupport;
}

/**
 * Synchronous capability gate. Safe to call from a `useState(() => ...)`
 * lazy initializer so it runs on first render, before any canvas exists.
 */
export function evaluateCapabilities(): CapabilityResult {
  const tier = detectTier();

  if (prefersReducedMotion()) {
    return { mode: 'static', tier, colorBufferSupport: null };
  }

  if (typeof document === 'undefined') {
    return { mode: 'static', tier, colorBufferSupport: null };
  }

  const probeCanvas = document.createElement('canvas');
  const gl = probeCanvas.getContext('webgl2') as WebGL2RenderingContext | null;

  if (!gl) {
    return { mode: 'static', tier, colorBufferSupport: null };
  }

  const colorBufferSupport = probeColorBufferSupport(gl);

  // Release the probe context immediately — the real Renderer creates its own
  // fresh context on the actual <canvas> element later, inside createScene().
  gl.getExtension('WEBGL_lose_context')?.loseContext();

  if (!colorBufferSupport) {
    return { mode: 'static', tier, colorBufferSupport: null };
  }

  return { mode: 'webgl', tier, colorBufferSupport };
}
