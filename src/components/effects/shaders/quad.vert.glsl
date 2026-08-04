#version 300 es
// Shared fullscreen-triangle vertex shader, reused by the sim pass and the
// post (warp) pass. Consumes OGL's `Triangle` geometry (position + uv attrs,
// 3 verts covering the whole clip-space viewport). No transform matrices —
// both passes render directly in clip space.
in vec2 uv;
in vec2 position;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
