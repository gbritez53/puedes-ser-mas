/**
 * Builds particle origin data (one vec4 per particle: xyz + unused w) shaped
 * like rendered text or an SVG mark, for reuse with createScene's
 * `originData` override.
 *
 * DOM-dependent (draws to an offscreen <canvas> to rasterize the source) —
 * unlike lib/utils.ts, this must only run client-side, after mount.
 */

const ALPHA_THRESHOLD = 128;
const SAMPLE_STEP = 2;
const WORLD_WIDTH = 2.4;
const Z_JITTER = 0.12;

type Point = [number, number];

/**
 * Samples alpha>threshold pixels from `canvas` and maps them into world-space
 * origin data, fit to `WORLD_WIDTH` and centered on the sampled ink's own
 * bounding box (not the canvas's) — so callers don't need to know how much
 * empty margin surrounds the shape in the source canvas.
 */
function canvasToOriginData(canvas: HTMLCanvasElement, simSize: number): Float32Array {
  const count = simSize * simSize;
  const data = new Float32Array(count * 4);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  let points: Point[] = [];
  if (ctx) {
    const { width, height } = canvas;
    const { data: img } = ctx.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y += SAMPLE_STEP) {
      for (let x = 0; x < width; x += SAMPLE_STEP) {
        const alpha = img[(y * width + x) * 4 + 3];
        if (alpha > ALPHA_THRESHOLD) points.push([x, y]);
      }
    }
  }
  if (points.length === 0) points = [[canvas.width / 2, canvas.height / 2]];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const boxWidth = Math.max(1, maxX - minX);
  const scale = WORLD_WIDTH / boxWidth;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  for (let i = 0; i < count; i++) {
    const [px, py] = points[Math.floor(Math.random() * points.length)];
    const x = (px - midX) * scale;
    // Canvas y grows downward; world y grows upward.
    const y = -(py - midY) * scale;
    const z = (Math.random() - 0.5) * Z_JITTER;
    data[i * 4 + 0] = x;
    data[i * 4 + 1] = y;
    data[i * 4 + 2] = z;
    data[i * 4 + 3] = 0;
  }

  return data;
}

export interface TextOriginOptions {
  /** Font size in canvas px (before the world-space fit scale is applied). */
  fontPx?: number;
  /** Font family string for ctx.font. Falls back to system-ui when omitted. */
  fontFamily?: string;
}

export function buildTextOriginData(
  simSize: number,
  text: string,
  options: TextOriginOptions = {},
): Float32Array {
  const { fontPx = 180, fontFamily } = options;
  const CANVAS_WIDTH = 1024;
  const CANVAS_HEIGHT = 320;

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (ctx) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const family = fontFamily || 'system-ui, -apple-system, sans-serif';

    // Auto-fit: measure at the requested size, then shrink so arbitrary
    // strings never clip past the sampling canvas width.
    ctx.font = `700 ${fontPx}px ${family}`;
    const maxWidth = CANVAS_WIDTH * 0.9;
    const measuredWidth = ctx.measureText(text).width;
    const fitSize = measuredWidth > maxWidth ? fontPx * (maxWidth / measuredWidth) : fontPx;
    ctx.font = `700 ${fitSize}px ${family}`;

    ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }

  return canvasToOriginData(canvas, simSize);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Same as buildTextOriginData but rasterizes an SVG (or any raster image) URL
 * instead of a text string. Async — image decoding can't happen synchronously.
 */
export async function buildSvgOriginData(simSize: number, svgUrl: string): Promise<Float32Array> {
  const img = await loadImage(svgUrl);

  const MAX_DIM = 960;
  const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
  const canvas = document.createElement('canvas');
  canvas.width = aspect >= 1 ? MAX_DIM : Math.round(MAX_DIM * aspect);
  canvas.height = aspect >= 1 ? Math.round(MAX_DIM / aspect) : MAX_DIM;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvasToOriginData(canvas, simSize);
}
