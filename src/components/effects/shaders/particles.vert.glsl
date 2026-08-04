#version 300 es
// Vertex texture fetch from the simulation's position/life output.
// `reference` is a UV coordinate into the sim texture (one texel per particle),
// `random` carries per-particle size/hue/speed variance, baked once on the CPU.
precision highp float;

in vec2 reference;
in vec4 random;

uniform sampler2D tPosition;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPointSize;
uniform float uDpr;

out float vFade;
out float vHue;

void main() {
  vec4 posData = texture(tPosition, reference);
  float life = posData.w;

  // Smoothstep-faded at both life edges (fade in just after spawn, fade out
  // just before death) so recycling never pops.
  vFade = smoothstep(1.0, 0.85, life) * smoothstep(0.0, 0.15, life);
  vHue = random.y;

  vec4 mvPosition = modelViewMatrix * vec4(posData.xyz, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float sizeVariance = 0.6 + random.x * 0.8;
  gl_PointSize = clamp(
    uPointSize * sizeVariance * uDpr * vFade / gl_Position.w,
    1.0,
    64.0
  );
}
