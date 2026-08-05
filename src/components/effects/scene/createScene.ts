/**
 * Pure GL factory: builds the renderer, ping-pong sim targets, programs and
 * meshes, and exposes `render()`/`resize()`/`dispose()`. No React, no DOM
 * event listeners — those live in `ParticleHero.tsx`. All GL objects created
 * here are reachable from the returned handle so `dispose()` can tear down
 * everything wholesale (design §8).
 *
 * `ogl` is received as an already-imported namespace (see `OglNamespace`)
 * rather than statically imported here, so this module carries no runtime
 * dependency edge on `ogl` — the caller performs the dynamic
 * `await import("ogl")` (ADR-6), and Vite code-splits it into that async
 * chunk. Only `import type` is used below, which is erased at compile time.
 */
import type * as OGL from 'ogl';
import quadVertSrc from '../shaders/quad.vert.glsl?raw';
import simFragSrc from '../shaders/sim.frag.glsl?raw';
import particlesVertSrc from '../shaders/particles.vert.glsl?raw';
import particlesFragSrc from '../shaders/particles.frag.glsl?raw';
import warpFragSrc from '../shaders/warp.frag.glsl?raw';
import { injectDefines } from '../lib/utils';
import type { ColorBufferSupport, TierConfig } from './capabilities';

export const CAMERA_FOV_DEG = 35;
export const CAMERA_DISTANCE = 3;

export interface OglNamespace {
  Renderer: typeof OGL.Renderer;
  Program: typeof OGL.Program;
  Mesh: typeof OGL.Mesh;
  Geometry: typeof OGL.Geometry;
  RenderTarget: typeof OGL.RenderTarget;
  Triangle: typeof OGL.Triangle;
  Camera: typeof OGL.Camera;
  Texture: typeof OGL.Texture;
}

export interface CreateSceneOptions {
  tier: TierConfig;
  colorBufferSupport: Exclude<ColorBufferSupport, null>;
  dpr: number;
  width: number;
  height: number;
  /** Overrides the default random-ellipse origin (one vec4 per particle, xyz + unused w). */
  originData?: Float32Array;
  /** Partial override of SIM_TUNING — e.g. a figure effect wants near-zero curl + strong home pull. */
  simTuning?: Partial<typeof SIM_TUNING>;
  /** Partial override of POINTER_TUNING. */
  pointerTuning?: Partial<typeof POINTER_TUNING>;
  /** Clear color for the default framebuffer (defaults to the hero's #05060a). */
  clearColor?: [number, number, number, number];
}

export interface PointerFrameInput {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: number;
}

export interface FrameInput {
  time: number;
  /** Already clamped by the caller (min(dt, 1/30)). */
  delta: number;
  pointer: PointerFrameInput;
  warpAmount: number;
  warpThrust: number;
  streakLength: number;
  streakIntensity: number;
  vanishX: number;
  vanishY: number;
}

export interface SceneHandle {
  renderer: InstanceType<OglNamespace['Renderer']>;
  gl: OGL.OGLRenderingContext;
  render(frame: FrameInput): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

const SIM_TUNING = {
  curlScale: 0.9,
  curlStrength: 0.55,
  flowSpeed: 0.12,
  damping: 1.1,
  homePull: 0.35,
  lifeRate: 0.12,
  spawnJitter: 0.12,
};

const POINTER_TUNING = {
  radius: 0.28,
  push: 1.1,
  /** Tangential drag along pointer velocity — set to 0 for a purely radial push (no sideways drift). */
  velScale: 0.35,
};

function buildOriginData(simSize: number): Float32Array {
  const count = simSize * simSize;
  const data = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 1.3;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.62;
    const z = (Math.random() - 0.5) * 0.6;
    data[i * 4 + 0] = x;
    data[i * 4 + 1] = y;
    data[i * 4 + 2] = z;
    data[i * 4 + 3] = 0;
  }
  return data;
}

function buildParticleAttributes(simSize: number): {
  reference: Float32Array;
  random: Float32Array;
} {
  const count = simSize * simSize;
  const reference = new Float32Array(count * 2);
  const random = new Float32Array(count * 4);
  for (let iy = 0; iy < simSize; iy++) {
    for (let ix = 0; ix < simSize; ix++) {
      const i = iy * simSize + ix;
      reference[i * 2 + 0] = (ix + 0.5) / simSize;
      reference[i * 2 + 1] = (iy + 0.5) / simSize;
      random[i * 4 + 0] = Math.random(); // size variance
      random[i * 4 + 1] = Math.random(); // hue mix
      random[i * 4 + 2] = Math.random(); // reserved (speed variance)
      random[i * 4 + 3] = Math.random(); // reserved (free)
    }
  }
  return { reference, random };
}

type AnyRenderTarget = InstanceType<OglNamespace['RenderTarget']>;

function disposeRenderTarget(gl: OGL.OGLRenderingContext, rt: AnyRenderTarget): void {
  rt.textures.forEach((tex) => gl.deleteTexture(tex.texture));
  if (rt.depthBuffer) gl.deleteRenderbuffer(rt.depthBuffer);
  if (rt.stencilBuffer) gl.deleteRenderbuffer(rt.stencilBuffer);
  if (rt.depthStencilBuffer) gl.deleteRenderbuffer(rt.depthStencilBuffer);
  if (rt.depthTexture) gl.deleteTexture(rt.depthTexture.texture);
  gl.deleteFramebuffer(rt.buffer);
}

export function createScene(
  ogl: OglNamespace,
  canvas: HTMLCanvasElement,
  options: CreateSceneOptions,
): SceneHandle {
  const { tier, colorBufferSupport, dpr, width, height } = options;
  const simSize = tier.simSize;
  const tuning = { ...SIM_TUNING, ...options.simTuning };
  const pointerTuning = { ...POINTER_TUNING, ...options.pointerTuning };

  const renderer = new ogl.Renderer({
    canvas,
    width,
    height,
    dpr,
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  const gl = renderer.gl as WebGL2RenderingContext & OGL.OGLRenderingContext;
  gl.clearColor(...(options.clearColor ?? [0.0196, 0.0235, 0.0392, 1]));

  const simType = colorBufferSupport === 'float' ? gl.FLOAT : gl.HALF_FLOAT;
  const simInternalFormat = colorBufferSupport === 'float' ? gl.RGBA32F : gl.RGBA16F;

  function createSimTarget(): AnyRenderTarget {
    return new ogl.RenderTarget(gl, {
      width: simSize,
      height: simSize,
      color: 2,
      depth: false,
      stencil: false,
      type: simType,
      format: gl.RGBA,
      internalFormat: simInternalFormat,
      minFilter: gl.NEAREST,
      magFilter: gl.NEAREST,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });
  }

  let simRead = createSimTarget();
  let simWrite = createSimTarget();

  // tOrigin is sampled only, never rendered to — RGBA32F + NEAREST sampling is
  // core WebGL2, no EXT_color_buffer_float required (that extension only
  // gates rendering/attaching, not sampling).
  const originTexture = new ogl.Texture(gl, {
    image: options.originData ?? buildOriginData(simSize),
    width: simSize,
    height: simSize,
    type: gl.FLOAT,
    format: gl.RGBA,
    internalFormat: gl.RGBA32F,
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE,
    generateMipmaps: false,
    flipY: false,
  });
  originTexture.update();

  const quadVert = injectDefines(quadVertSrc, []);
  const simFrag = injectDefines(simFragSrc, tier.curl2D ? ['CURL_2D'] : []);

  const simProgram = new ogl.Program(gl, {
    vertex: quadVert,
    fragment: simFrag,
    depthTest: false,
    depthWrite: false,
    cullFace: false,
    uniforms: {
      tPosition: { value: simRead.textures[0] },
      tVelocity: { value: simRead.textures[1] },
      tOrigin: { value: originTexture },
      uTime: { value: 0 },
      uDelta: { value: 0 },
      uPointer: { value: [0, 0] },
      uPointerVel: { value: [0, 0] },
      uPointerActive: { value: 0 },
      uPointerRadius: { value: pointerTuning.radius },
      uPointerPush: { value: pointerTuning.push },
      uPointerVelScale: { value: pointerTuning.velScale },
      uCurlScale: { value: tuning.curlScale },
      uCurlStrength: { value: tuning.curlStrength },
      uFlowSpeed: { value: tuning.flowSpeed },
      uDamping: { value: tuning.damping },
      uHomePull: { value: tuning.homePull },
      uLifeRate: { value: tuning.lifeRate },
      uSpawnJitter: { value: tuning.spawnJitter },
      uWarp: { value: 0 },
      uWarpThrust: { value: 0 },
    },
  });
  const simGeometry = new ogl.Triangle(gl);
  const simMesh = new ogl.Mesh(gl, { geometry: simGeometry, program: simProgram });

  // --- Layer 1: particle rendering ---
  const { reference, random } = buildParticleAttributes(simSize);
  const particleGeometry = new ogl.Geometry(gl, {
    reference: { size: 2, data: reference },
    random: { size: 4, data: random },
  });

  const particlesVert = injectDefines(particlesVertSrc, []);
  const particlesFrag = injectDefines(particlesFragSrc, []);

  const particlesProgram = new ogl.Program(gl, {
    vertex: particlesVert,
    fragment: particlesFrag,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    cullFace: false,
    uniforms: {
      tPosition: { value: simRead.textures[0] },
      uPointSize: { value: tier.pointSizePx },
      uDpr: { value: dpr },
    },
  });
  particlesProgram.setBlendFunc(gl.SRC_ALPHA, gl.ONE);

  const camera = new ogl.Camera(gl, {
    fov: CAMERA_FOV_DEG,
    aspect: width / height,
    near: 0.1,
    far: 20,
  });
  camera.position.set(0, 0, CAMERA_DISTANCE);
  camera.lookAt([0, 0, 0]);

  const particlesMesh = new ogl.Mesh(gl, {
    geometry: particleGeometry,
    program: particlesProgram,
    mode: gl.POINTS,
  });

  // --- Layer 2: scene RT + warp post pass ---
  function createSceneTarget(pixelWidth: number, pixelHeight: number): AnyRenderTarget {
    return new ogl.RenderTarget(gl, {
      width: Math.max(1, Math.round(pixelWidth * tier.sceneScale)),
      height: Math.max(1, Math.round(pixelHeight * tier.sceneScale)),
      color: 1,
      depth: false,
      stencil: false,
      type: gl.UNSIGNED_BYTE,
      format: gl.RGBA,
      internalFormat: gl.RGBA,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });
  }

  let sceneRT = createSceneTarget(width * dpr, height * dpr);

  const warpFrag = injectDefines(warpFragSrc, [`TAPS ${tier.postTaps}`]);
  const postProgram = new ogl.Program(gl, {
    vertex: quadVert,
    fragment: warpFrag,
    depthTest: false,
    depthWrite: false,
    cullFace: false,
    uniforms: {
      tScene: { value: sceneRT.texture },
      uResolution: { value: [sceneRT.width, sceneRT.height] },
      uVanish: { value: [0.5, 0.5] },
      uWarpAmount: { value: 0 },
      uStreakLength: { value: 0.6 },
      uStreakIntensity: { value: 0 },
    },
  });
  const postGeometry = new ogl.Triangle(gl);
  const postMesh = new ogl.Mesh(gl, { geometry: postGeometry, program: postProgram });

  function render(frame: FrameInput): void {
    // 1. Sim step — reads simRead, writes simWrite.
    simProgram.uniforms.tPosition.value = simRead.textures[0];
    simProgram.uniforms.tVelocity.value = simRead.textures[1];
    simProgram.uniforms.uTime.value = frame.time;
    simProgram.uniforms.uDelta.value = frame.delta;
    simProgram.uniforms.uPointer.value = [frame.pointer.x, frame.pointer.y];
    simProgram.uniforms.uPointerVel.value = [frame.pointer.vx, frame.pointer.vy];
    simProgram.uniforms.uPointerActive.value = frame.pointer.active;
    simProgram.uniforms.uWarp.value = frame.warpAmount;
    simProgram.uniforms.uWarpThrust.value = frame.warpThrust;

    renderer.render({ scene: simMesh, target: simWrite, clear: false });

    // Ping-pong swap: simRead now holds the freshest state.
    const tmp = simRead;
    simRead = simWrite;
    simWrite = tmp;

    // 2. Particle pass, reading the freshest position texture.
    particlesProgram.uniforms.tPosition.value = simRead.textures[0];

    // Cost control (a): skip the post pass entirely when warp is negligible —
    // render particles straight to the default framebuffer (design §5.2).
    const useWarp = frame.warpAmount >= 0.01;

    if (useWarp) {
      renderer.render({ scene: particlesMesh, camera, target: sceneRT, clear: true });

      postProgram.uniforms.tScene.value = sceneRT.texture;
      postProgram.uniforms.uVanish.value = [frame.vanishX, frame.vanishY];
      postProgram.uniforms.uWarpAmount.value = frame.warpAmount;
      postProgram.uniforms.uStreakLength.value = frame.streakLength;
      postProgram.uniforms.uStreakIntensity.value = frame.streakIntensity;

      // `target` omitted -> OGL's Renderer defaults to the default
      // framebuffer (its .d.ts types `target` as non-nullable `RenderTarget`,
      // but the JS implementation's real default is `null`/the screen).
      renderer.render({ scene: postMesh, clear: true });
    } else {
      renderer.render({ scene: particlesMesh, camera, clear: true });
    }
  }

  function resize(newWidth: number, newHeight: number): void {
    renderer.setSize(newWidth, newHeight);
    camera.perspective({ aspect: newWidth / newHeight });

    disposeRenderTarget(gl, sceneRT);
    sceneRT = createSceneTarget(newWidth * renderer.dpr, newHeight * renderer.dpr);
    postProgram.uniforms.tScene.value = sceneRT.texture;
    postProgram.uniforms.uResolution.value = [sceneRT.width, sceneRT.height];
  }

  function dispose(): void {
    [simProgram, particlesProgram, postProgram].forEach((p) => {
      if (typeof (p as { remove?: () => void }).remove === 'function') p.remove();
    });
    [simGeometry, particleGeometry, postGeometry].forEach((g) => {
      if (typeof (g as { remove?: () => void }).remove === 'function') g.remove();
    });
    [simRead, simWrite, sceneRT].forEach((rt) => disposeRenderTarget(gl, rt));
    gl.deleteTexture(originTexture.texture);

    // Backstop: the only guaranteed way to release everything a context holds.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  return { renderer, gl, render, resize, dispose };
}
