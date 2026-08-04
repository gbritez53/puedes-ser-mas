#version 300 es
// Single-pass radial zoom-blur toward a vanishing point (design ADR-5).
// `TAPS` is REQUIRED and always injected via injectDefines() — this file does
// not compile on its own without it (per-tier tap count, design §3.4 table).
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tScene;
uniform vec2 uResolution;
uniform vec2 uVanish;
uniform float uWarpAmount;
uniform float uStreakLength;
uniform float uStreakIntensity;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 dir = vUv - uVanish;
  float amt = clamp(uWarpAmount, 0.0, 1.0);
  float jitter = hash12(vUv * uResolution) / float(TAPS);

  vec3 acc = vec3(0.0);
  float wsum = 0.0;
  for (int i = 0; i < TAPS; i++) {
    float t = float(i) / float(TAPS - 1) + jitter;
    float s = 1.0 - amt * uStreakLength * t;
    float w = 1.0 - t * 0.75;
    acc += texture(tScene, uVanish + dir * s).rgb * w;
    wsum += w;
  }
  vec3 col = acc / max(wsum, 0.0001);

  // Chromatic split, only when the warp is visually significant.
  if (amt > 0.3) {
    float split = (amt - 0.3) * 0.004;
    float sBase = 1.0 - amt * uStreakLength * jitter;
    float r = texture(tScene, uVanish + dir * sBase + dir * split).r;
    float b = texture(tScene, uVanish + dir * sBase - dir * split).b;
    col.r = mix(col.r, r, 0.6);
    col.b = mix(col.b, b, 0.6);
  }

  float vignette = smoothstep(0.9, 0.2, length(vUv - 0.5));
  col *= mix(1.0, vignette, amt * 0.5);
  col *= 1.0 + amt * uStreakIntensity * 0.4;

  fragColor = vec4(col, 1.0);
}
