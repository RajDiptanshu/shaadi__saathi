// Bakes the red-oxide floor's grain into one seamless tile. Rendering the same noise live with feTurbulence
// cost about three seconds of first paint on a throttled phone; this tile costs about 1.6 KB.
// Usage: node tools/assets/kolam-floor.mjs
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const SIZE = 384;
const out = path.resolve(import.meta.dirname, '..', '..', 'site', 'invitations', 'kolam', 'assets', 'textures');

// Value noise on a lattice of `cells` across the tile. The lattice wraps at `cells`, which is what makes the
// tile seamless: the right edge samples exactly what the left edge does.
function makeNoise(cells, seed) {
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const g = new Float64Array(cells * cells);
  for (let i = 0; i < g.length; i++) g[i] = rnd();
  const at = (x, y) => g[(((y % cells) + cells) % cells) * cells + (((x % cells) + cells) % cells)];
  const smooth = (t) => t * t * (3 - 2 * t);
  const step = SIZE / cells;
  return (x, y) => {
    const fx = x / step, fy = y / step;
    const x0 = Math.floor(fx), y0 = Math.floor(fy), tx = smooth(fx - x0), ty = smooth(fy - y0);
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
    const bot = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
    return top + (bot - top) * ty;
  };
}

// Three scales: the wash of the floor, the polish marks, and the grit in the oxide itself.
const wash = makeNoise(3, 7), marks = makeNoise(12, 19), grit = makeNoise(96, 31);
const data = Buffer.alloc(SIZE * SIZE * 3);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const v = (wash(x, y) - 0.5) * 0.52 + (marks(x, y) - 0.5) * 0.3 + (grit(x, y) - 0.5) * 0.24;
    const k = 1 + v * 0.34;
    const i = (y * SIZE + x) * 3;
    data[i] = Math.max(0, Math.min(255, Math.round(96 * k)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(35 * k)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(26 * k)));
  }
}
const png = await sharp(data, { raw: { width: SIZE, height: SIZE, channels: 3 } }).png().toBuffer();
for (const [ext, opts] of [['avif', { quality: 46, effort: 6 }], ['webp', { quality: 70, effort: 6 }]]) {
  const file = path.join(out, `t01-oxide-${SIZE}.${ext}`);
  await sharp(png)[ext](opts).toFile(file);
  console.log(`t01-oxide-${SIZE}.${ext}: ${((await fs.stat(file)).size / 1024).toFixed(1)} KB`);
}
