import { useEffect, useRef, useState } from 'react';
import { evaluateCapabilities, isCoarsePointer, TIER_CONFIG } from './scene/capabilities';
import {
  CAMERA_DISTANCE,
  CAMERA_FOV_DEG,
  createScene,
  type FrameInput,
  type OglNamespace,
  type SceneHandle,
} from './scene/createScene';
import { clampVec2Length, expLerp, smoothstep, worldHalfHeight } from './lib/utils';

const POINTER_LERP = 12;
const ACTIVE_LERP = 7.5;
const MAX_POINTER_VEL = 6;
const WARP_THRUST = 1.4;
const STREAK_LENGTH = 0.6;
// Continuous "particles converge" effect — the warp never drops to zero, it
// breathes between a floor and a peak so the approach reads as an endless
// motion instead of a repeating burst that cuts out.
const WARP_PULSE_PERIOD = 9;
const WARP_PULSE_FLOOR = 0.45;
const WARP_PULSE_PEAK = 0.9;
const MAX_CONTEXT_LOSSES = 3;

/**
 * Hero background particles: the canvas simulation from ParticleHero used as a
 * pure full-bleed background (no intro/outro text layers, no 250vh scroll
 * spacer). The warp/streak "particles approach" effect is driven by an
 * autonomous time pulse instead of scroll progress, so it always plays.
 *
 * Same capability gate / tier / context-loss recovery as ParticleHero: runs
 * synchronously in the useState lazy initializer, before any canvas exists
 * and before `ogl` is imported.
 */
export default function HeroParticles() {
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

  const pointerUvRef = useRef({ x: 0.5, y: 0.5 });
  const pointerSmoothUvRef = useRef({ x: 0.5, y: 0.5 });
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

    const coarse = isCoarsePointer();
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

    function setPointerUvFromEvent(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointerUvRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }
    function onPointerMove(e: PointerEvent) {
      setPointerUvFromEvent(e);
    }
    function onPointerEnter(e: PointerEvent) {
      setPointerUvFromEvent(e);
      pointerActiveTargetRef.current = 1;
    }
    function onPointerLeave() {
      pointerActiveTargetRef.current = 0;
    }
    function onPointerCancel() {
      pointerActiveTargetRef.current = 0;
    }

    if (!coarse) {
      canvas.addEventListener('pointermove', onPointerMove, { passive: true });
      canvas.addEventListener('pointerenter', onPointerEnter, { passive: true });
      canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
      canvas.addEventListener('pointercancel', onPointerCancel, { passive: true });
    } else {
      // Touch: auto-orbit so mobile always shows motion.
      pointerActiveTargetRef.current = 1;
    }

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

      let targetUvX: number;
      let targetUvY: number;
      if (coarse) {
        const t = timeRef.current;
        targetUvX = 0.5 + 0.25 * Math.sin(t * 0.6);
        targetUvY = 0.5 + 0.22 * Math.sin(t * 0.41 + 1.3);
      } else {
        targetUvX = pointerUvRef.current.x;
        targetUvY = pointerUvRef.current.y;
      }
      pointerSmoothUvRef.current.x = expLerp(
        pointerSmoothUvRef.current.x,
        targetUvX,
        POINTER_LERP,
        dt,
      );
      pointerSmoothUvRef.current.y = expLerp(
        pointerSmoothUvRef.current.y,
        targetUvY,
        POINTER_LERP,
        dt,
      );

      const aspect = canvas!.clientWidth / Math.max(1, canvas!.clientHeight);
      const halfHeight = worldHalfHeight(CAMERA_DISTANCE, CAMERA_FOV_DEG);
      const ndcX = pointerSmoothUvRef.current.x * 2 - 1;
      const ndcY = -(pointerSmoothUvRef.current.y * 2 - 1);
      const worldX = ndcX * aspect * halfHeight;
      const worldY = ndcY * halfHeight;

      const rawVx = dt > 0 ? (worldX - pointerPrevWorldRef.current.x) / dt : 0;
      const rawVy = dt > 0 ? (worldY - pointerPrevWorldRef.current.y) / dt : 0;
      const [vx, vy] = clampVec2Length(rawVx, rawVy, MAX_POINTER_VEL);
      pointerPrevWorldRef.current = { x: worldX, y: worldY };

      pointerActiveRef.current = expLerp(
        pointerActiveRef.current,
        pointerActiveTargetRef.current,
        ACTIVE_LERP,
        dt,
      );
      // Continuous warp pulse: breathes between WARP_PULSE_FLOOR and
      // WARP_PULSE_PEAK (ease-in on the approach, ease-out on release) so the
      // convergence never cuts out — always some warp is active.
      const t = timeRef.current;
      const phase = (t % WARP_PULSE_PERIOD) / WARP_PULSE_PERIOD; // 0..1
      const pulse = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2); // 0..1..0 (smooth cycle)
      const warpAmount =
        WARP_PULSE_FLOOR + smoothstep(0.25, 0.75, pulse) * (WARP_PULSE_PEAK - WARP_PULSE_FLOOR);
      const streakIntensity = smoothstep(0.2, 1, warpAmount);

      // Vanish point converges toward the center as the warp ramps.
      const vanishX =
        pointerSmoothUvRef.current.x +
        (0.5 - pointerSmoothUvRef.current.x) * smoothstep(0.15, 0.85, warpAmount);
      const vanishY =
        pointerSmoothUvRef.current.y +
        (0.5 - pointerSmoothUvRef.current.y) * smoothstep(0.15, 0.85, warpAmount);

      const frame: FrameInput = {
        time: t,
        delta: dt,
        pointer: {
          x: worldX,
          y: worldY,
          vx,
          vy,
          active: pointerActiveRef.current,
        },
        warpAmount,
        warpThrust: WARP_THRUST,
        streakLength: STREAK_LENGTH,
        streakIntensity,
        vanishX,
        vanishY,
      };

      scene.render(frame);
    }

    async function init() {
      const oglModule = (await import('ogl')) as unknown as OglNamespace;
      if (!alive) return;

      const width = container!.clientWidth || window.innerWidth;
      const height = container!.clientHeight || window.innerHeight;
      const scene = createScene(oglModule, canvas!, {
        tier,
        colorBufferSupport: colorBufferSupport as 'float' | 'half-float',
        dpr,
        width,
        height,
        // Blend the canvas into the black hero background.
        clearColor: [0, 0, 0, 1],
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
      if (!coarse) {
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerenter', onPointerEnter);
        canvas.removeEventListener('pointerleave', onPointerLeave);
        canvas.removeEventListener('pointercancel', onPointerCancel);
      }
      if (!sceneDisposedGuard && sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
      // lossCountRef intentionally persists across epoch bumps.
    };
  }, [mode, glEpoch]);

  if (mode === 'static') {
    return (
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-black">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            // Two separate radial blobs (red / blue) instead of one gradient
            // between them — a single mix would produce a pink center.
            backgroundImage:
              'radial-gradient(circle at 32% 42%, rgba(196,23,24,0.30), transparent 45%), radial-gradient(circle at 68% 55%, rgba(31,60,135,0.22), transparent 45%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-25 mix-blend-screen"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-black"
    >
      <canvas key={glEpoch} ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
