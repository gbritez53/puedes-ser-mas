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
  float alpha = smoothstep(0.5, 0.1, d);
  if (alpha <= 0.0) {
    discard;
  }

  vec3 color = mix(COLOR_PRIMARY, COLOR_SECONDARY, vHue);
  fragColor = vec4(color, alpha * vFade);
}
