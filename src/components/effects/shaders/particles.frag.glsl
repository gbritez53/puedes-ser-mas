#version 300 es
// Soft round sprite + brand color mix, additive-blended.
precision highp float;

in float vFade;
in float vHue;

out vec4 fragColor;

// --color-primary #d32f2f -> vec3(0.827, 0.184, 0.184)
// --color-secondary #7bd1f8 -> vec3(0.482, 0.820, 0.973)
// (src/styles/global.css @theme tokens, hardcoded here — read-only reference,
// never coupled at runtime per design §4.)
const vec3 COLOR_PRIMARY = vec3(0.827, 0.184, 0.184);
const vec3 COLOR_SECONDARY = vec3(0.482, 0.820, 0.973);

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.1, d);
  if (alpha <= 0.0) {
    discard;
  }

  vec3 color = mix(COLOR_PRIMARY, COLOR_SECONDARY, vHue);
  fragColor = vec4(color, alpha * vFade);
}
