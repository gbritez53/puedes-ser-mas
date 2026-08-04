#version 300 es
// GPU curl-noise particle simulation — MRT advection step.
// out0 (tPosition) = vec4(position.xyz, life)
// out1 (tVelocity) = vec4(velocity.xyz, seed)
//
// `CURL_2D` may be injected via injectDefines() (design ADR-2) on the `low`
// tier: reduces the curl potential to a single scalar snoise (4 evals vs 18).
precision highp float;

layout(location = 0) out vec4 outPosition;
layout(location = 1) out vec4 outVelocity;

in vec2 vUv;

uniform sampler2D tPosition;
uniform sampler2D tVelocity;
uniform sampler2D tOrigin;

uniform float uTime;
uniform float uDelta;

uniform vec2 uPointer;
uniform vec2 uPointerVel;
uniform float uPointerActive;
uniform float uPointerRadius;
uniform float uPointerPush;
uniform float uPointerVelScale;

uniform float uCurlScale;
uniform float uCurlStrength;
uniform float uFlowSpeed;
uniform float uDamping;
uniform float uHomePull;
uniform float uLifeRate;
uniform float uSpawnJitter;

uniform float uWarp;
uniform float uWarpThrust;

// ---------------------------------------------------------------------------
// Vendored Ashima Arts / Stefan Gustavson `webgl-noise` (MIT / public domain).
// https://github.com/ashima/webgl-noise
// ---------------------------------------------------------------------------

vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

// Classic Perlin-style 2D simplex noise — 4 evals per curlNoise2D() call.
float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
    0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Classic 3D simplex noise — 1 eval; curlNoise() below calls it 18x.
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(
    permute(
      permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)
    ) + i.x + vec4(0.0, i1.x, i2.x, 1.0)
  );

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(
    vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3))
  );
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(
    0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)),
    0.0
  );
  m = m * m;
  return 42.0 *
    dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// --- curl of a 3-component noise potential: 6 snoiseVec3 calls = 18 snoise evals.
vec3 snoiseVec3(vec3 x) {
  return vec3(
    snoise(x),
    snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
    snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
  );
}

vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = snoiseVec3(p - dx);
  vec3 p_x1 = snoiseVec3(p + dx);
  vec3 p_y0 = snoiseVec3(p - dy);
  vec3 p_y1 = snoiseVec3(p + dy);
  vec3 p_z0 = snoiseVec3(p - dz);
  vec3 p_z1 = snoiseVec3(p + dz);

  float x = (p_y1.z - p_y0.z) - (p_z1.y - p_z0.y);
  float y = (p_z1.x - p_z0.x) - (p_x1.z - p_x0.z);
  float z = (p_x1.y - p_x0.y) - (p_y1.x - p_y0.x);

  return normalize(vec3(x, y, z) / (2.0 * e));
}

// --- 2D curl (perf escape hatch): curl of a scalar potential = (dP/dy, -dP/dx).
// 4 snoise evals instead of 18 (~4.5x cheaper).
vec2 curlNoise2D(vec2 p) {
  const float e = 0.1;
  float n1 = snoise(vec2(p.x, p.y + e));
  float n2 = snoise(vec2(p.x, p.y - e));
  float n3 = snoise(vec2(p.x + e, p.y));
  float n4 = snoise(vec2(p.x - e, p.y));
  float dPdy = (n1 - n2) / (2.0 * e);
  float dPdx = (n3 - n4) / (2.0 * e);
  return vec2(dPdy, -dPdx);
}

// ---------------------------------------------------------------------------

vec3 hash3(vec2 p) {
  vec3 q = vec3(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3)),
    dot(p, vec2(419.2, 371.9))
  );
  return fract(sin(q) * 43758.5453123) * 2.0 - 1.0;
}

vec2 pointerForce(vec2 pos, vec2 pointer, vec2 pointerVel, float activeAmt) {
  vec2 delta = pos - pointer;
  float dist = length(delta);
  float falloff = smoothstep(uPointerRadius, 0.0, dist);
  vec2 push = normalize(delta + 1e-4) * falloff;
  return (push * uPointerPush + pointerVel * uPointerVelScale) * activeAmt;
}

void main() {
  vec4 posData = texture(tPosition, vUv);
  vec4 velData = texture(tVelocity, vUv);
  vec4 originData = texture(tOrigin, vUv);

  vec3 pos = posData.xyz;
  float life = posData.w;
  vec3 vel = velData.xyz;
  float seed = velData.w;

  float dt = uDelta;

#ifdef CURL_2D
  vec2 curl2 = curlNoise2D(pos.xy * uCurlScale + vec2(0.0, uTime * uFlowSpeed));
  vec3 curl = vec3(curl2, sin(uTime * uFlowSpeed * 2.0 + seed * 6.2831853) * 0.3);
#else
  vec3 curl = curlNoise(pos * uCurlScale + vec3(0.0, 0.0, uTime * uFlowSpeed));
#endif

  vel += curl * uCurlStrength * dt;
  vel.xy += pointerForce(pos.xy, uPointer, uPointerVel, uPointerActive) * dt;
  vel += (originData.xyz - pos) * uHomePull * dt;
  vel += vec3(0.0, 0.0, 1.0) * uWarp * uWarpThrust * dt;
  vel *= exp(-uDamping * dt);

  pos += vel * dt;
  life -= dt * uLifeRate;

  // Respawn: also covers the very first frame — WebGL zero-initializes
  // RenderTarget textures with no image data, so life starts at 0.0 and every
  // particle naturally respawns from tOrigin on frame 1. No separate seed pass.
  if (life <= 0.0) {
    vec3 jitter = hash3(vUv + uTime) * uSpawnJitter;
    vec3 phase = hash3(vUv - uTime * 0.37);
    pos = originData.xyz + jitter;
    vel = vec3(0.0);
    // Randomize the respawned lifetime per-particle (keyed off vUv, which is
    // unique per texel) instead of a fixed 1.0 — otherwise every particle is
    // zero-initialized on frame 1, dies at the same uLifeRate, and the whole
    // field respawns in lockstep, reading as a global on/off pulse.
    life = mix(0.6, 1.0, phase.x * 0.5 + 0.5);
    seed = phase.y;
  }

  outPosition = vec4(pos, life);
  outVelocity = vec4(vel, seed);
}
