import { useEffect, useRef, useState } from 'react';
import { evaluateCapabilities, TIER_CONFIG } from './scene/capabilities';
import {
  CAMERA_DISTANCE,
  CAMERA_FOV_DEG,
  createScene,
  type FrameInput,
  type OglNamespace,
  type SceneHandle,
} from './scene/createScene';
import { clampVec2Length, expLerp, worldHalfHeight } from './lib/utils';
import { buildTextOriginData } from './lib/textOrigin';

// Text the particles assemble into. Rendered directly to an offscreen canvas
// via buildTextOriginData (no external SVG) so we inherit the page's webfonts
// (Bebas Neue loaded via Google Fonts) and never hit CORS/font issues.
const FIGURE_TEXT = 'PUEDES SER MÁS';
const FIGURE_FONT = "'Bebas Neue', Impact, 'Arial Narrow', sans-serif";
const FIGURE_FONT_PX = 180;

// High on purpose: the pointer "active" amount is what ramps the push force
// in on hover / out on leave. At the old 7.5 it took ~0.4s to reach full
// strength, reading as a laggy/slow deform — 30 engages in ~1-2 frames.
const ACTIVE_LERP = 30;
const MAX_POINTER_VEL = 6;
const MAX_CONTEXT_LOSSES = 3;

// Near-zero curl + strong home pull: particles sit still holding the figure
// and only move when pushed by the pointer, snapping back once released.
const FIGURE_TUNING = {
  curlScale: 1.0,
  curlStrength: 0.04,
  flowSpeed: 0.2,
  // Overdamped on purpose (damping > 2*sqrt(homePull)): an underdamped
  // spring-back left a lingering swirl where the pointer had been circling.
  // homePull raised alongside pointerTuning.push below — for a damped spring,
  // the equilibrium displacement is ~push/homePull, so push alone (without
  // raising homePull too) blew the hole out huge and, worse, spread the fixed
  // particle count over that much bigger area, reading as sparse scattered
  // dots during a fast sweep instead of a cohesive mass.
  damping: 10.0,
  homePull: 10.0,
  lifeRate: 0.15,
  spawnJitter: 0.03,
};

// velScale: 0 kills the tangential drag-along-pointer-velocity term so the
// figure only bulges radially away from the cursor, never slides sideways.
// Small radius keeps the affected zone (and therefore the "hole") tight and
// dense — a wide radius was catching too many particles across a fast sweep
// and scattering them thin. push stays high for a fast rise (see FIGURE_TUNING
// note above for why homePull moved in lockstep).
const FIGURE_POINTER_TUNING = {
  velScale: 0,
  push: 10.0,
  radius: 0.1,
};

export interface ParticleFigureProps {
  /** Optional overrides for the assembled text. Defaults to FIGURE_TEXT. */
  text?: string;
}

/**
 * Standalone "particles form a text figure, deform on hover, reassemble"
 * prototype. Reuses the same GPU sim (createScene) as ParticleHero, swapping
 * only the origin data (text-shaped instead of a random ellipse) and sim
 * tuning (near-zero curl + strong home pull instead of ambient drift).
 */
export default function ParticleFigure({ text = FIGURE_TEXT }: ParticleFigureProps) {
  const [gate] = useState(() => evaluateCapabilities());
  const [mode, setMode] = useState<'webgl' | 'static'>(gate.mode);
  const [glEpoch, setGlEpoch] = useState(0);

  const capsRef = useRef(gate);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sceneRef = useRef<SceneHandle | null>(null);
  const rafIdRef = useRef(0);
  const lastTimeRef = useRef(0);
  const timeRef = useRef(0);

  const pointerWorldRef = useRef({ x: 0, y: 0 });
  const pointerPrevWorldRef = useRef({ x: 0, y: 0 });
  const pointerActiveTargetRef = useRef(0);
  const pointerActiveRef = useRef(0);

  const visibleRef = useRef(true);
  const hiddenRef = useRef(false);
  const lossCountRef = useRef(0);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => {
      const next = evaluateCapabilities();
      capsRef.current = next;
      setMode(next.mode);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (mode !== 'webgl') return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let alive = true;
    let sceneDisposedGuard = false;

    const tier = TIER_CONFIG[capsRef.current.tier];
    const colorBufferSupport = capsRef.current.colorBufferSupport;

    if (!colorBufferSupport) {
      setMode('static');
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, tier.dprCap);

    function onResize() {
      const width = container!.clientWidth;
      const height = container!.clientHeight;
      sceneRef.current?.resize(width, height);
    }
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    function setPointerFromEvent(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const uvX = (e.clientX - rect.left) / rect.width;
      const uvY = (e.clientY - rect.top) / rect.height;

      const aspect = rect.width / Math.max(1, rect.height);
      const halfHeight = worldHalfHeight(CAMERA_DISTANCE, CAMERA_FOV_DEG);
      const ndcX = uvX * 2 - 1;
      const ndcY = -(uvY * 2 - 1);
      pointerWorldRef.current = {
        x: ndcX * aspect * halfHeight,
        y: ndcY * halfHeight,
      };
    }
    function onPointerMove(e: PointerEvent) {
      setPointerFromEvent(e);
      pointerActiveTargetRef.current = 1;
    }
    function onPointerLeave() {
      pointerActiveTargetRef.current = 0;
    }
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerdown', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    canvas.addEventListener('pointercancel', onPointerLeave, { passive: true });

    function onContextLost(e: Event) {
      e.preventDefault();
      cancelAnimationFrame(rafIdRef.current);
      lossCountRef.current += 1;
      if (lossCountRef.current > MAX_CONTEXT_LOSSES) {
        setMode('static');
      } else {
        setGlEpoch((n) => n + 1);
      }
    }
    canvas.addEventListener('webglcontextlost', onContextLost, false);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        visibleRef.current = entry ? entry.isIntersecting : true;
        if (visibleRef.current) lastTimeRef.current = 0;
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    function onVisibilityChange() {
      hiddenRef.current = document.hidden;
      if (!document.hidden) lastTimeRef.current = 0;
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    function loop(now: number) {
      if (!alive) return;
      rafIdRef.current = requestAnimationFrame(loop);
      if (!visibleRef.current || hiddenRef.current) return;

      const last = lastTimeRef.current || now;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      lastTimeRef.current = now;
      timeRef.current += dt;

      const scene = sceneRef.current;
      if (!scene) return;

      const rawVx = dt > 0 ? (pointerWorldRef.current.x - pointerPrevWorldRef.current.x) / dt : 0;
      const rawVy = dt > 0 ? (pointerWorldRef.current.y - pointerPrevWorldRef.current.y) / dt : 0;
      const [vx, vy] = clampVec2Length(rawVx, rawVy, MAX_POINTER_VEL);
      pointerPrevWorldRef.current = { ...pointerWorldRef.current };

      pointerActiveRef.current = expLerp(
        pointerActiveRef.current,
        pointerActiveTargetRef.current,
        ACTIVE_LERP,
        dt,
      );

      const frame: FrameInput = {
        time: timeRef.current,
        delta: dt,
        pointer: {
          x: pointerWorldRef.current.x,
          y: pointerWorldRef.current.y,
          vx,
          vy,
          active: pointerActiveRef.current,
        },
        warpAmount: 0,
        warpThrust: 0,
        streakLength: 0,
        streakIntensity: 0,
        vanishX: 0.5,
        vanishY: 0.5,
      };

      scene.render(frame);
    }

    async function init() {
      const oglModule = (await import('ogl')) as unknown as OglNamespace;
      if (!alive) return;

      const width = container!.clientWidth;
      const height = container!.clientHeight;
      const originData = buildTextOriginData(tier.simSize, text, {
        fontPx: FIGURE_FONT_PX,
        fontFamily: FIGURE_FONT,
      });
      if (!alive) return;

      const scene = createScene(oglModule, canvas!, {
        tier,
        colorBufferSupport: colorBufferSupport as 'float' | 'half-float',
        dpr,
        width,
        height,
        originData,
        simTuning: FIGURE_TUNING,
        pointerTuning: FIGURE_POINTER_TUNING,
      });

      if (!alive) {
        scene.dispose();
        sceneDisposedGuard = true;
        return;
      }
      sceneRef.current = scene;
      lastTimeRef.current = 0;
      rafIdRef.current = requestAnimationFrame(loop);
    }
    init();

    return () => {
      alive = false;
      cancelAnimationFrame(rafIdRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost, false);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointercancel', onPointerLeave);
      if (!sceneDisposedGuard && sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
    };
  }, [mode, glEpoch, text]);

  if (mode === 'static') {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center bg-black px-6">
        <span className="font-heading text-center text-3xl tracking-wider text-white sm:text-5xl">
          {text}
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[50vh] w-full bg-black">
      <canvas key={glEpoch} ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
