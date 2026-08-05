#version 300 es
// Soft round sprite + brand color mix, additive-blended.
precision highp float;

in float vFade;
in float vHue;

out vec4 fragColor;

// --color-cta (energy red) #c41718 -> vec3(0.769, 0.090, 0.094)
// --color-accent (progress blue) #1f3c87 -> vec3(0.122, 0.235, 0.529)
// (src/styles/global.css @theme tokens, hardcoded here — read-only reference,
// never coupled at runtime per design §4.)
const vec3 COLOR_PRIMARY = vec3(0.769, 0.090, 0.094);
const vec3 COLOR_SECONDARY = vec3(0.122, 0.235, 0.529);

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.08, d);
  if (alpha <= 0.0) {
    discard;
  }

  // Strictly binary brand palette — no linear mix between the two colors,
  // which would produce purple/pink intermediate tones. Each particle is
  // either energy red or progress blue, split on the per-particle random hue.
  vec3 color = vHue < 0.5 ? COLOR_PRIMARY : COLOR_SECONDARY;
  // Boost brightness: additive blending over a near-black clear makes small
  // points invisible at unit intensity, so scale the color up.
  fragColor = vec4(color * 2.4, alpha * vFade);
}
