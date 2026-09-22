// The couple's own photographs for the Baidyanath Dham invitation.
//
// These are the emotional centre of the page, so they are graded, not painted: a warm lift that sets them
// on the same ivory stock as the written sections, and nothing more. The heavy gouache treatment in
// baidyanath-paint.mjs exists to rescue cluttered stock photography; it would only damage these.
//
// Usage: node tools/assets/baidyanath-photos.mjs [--only ID,ID]
// Originals: assets-src/baidyanath/couple/ (gitignored)  ·  Output: site/invitations/baidyanath/assets/photography/

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
const root = path.resolve(import.meta.dirname, '..', '..');
const originals = path.join(root, 'assets-src', 'baidyanath', 'couple');
const outDir = path.join(root, 'site', 'invitations', 'baidyanath', 'assets', 'photography');
const only = opt('only') ? opt('only').split(',') : null;

const WIDTHS = [1080, 1440, 1920];

// `focal` is where the faces are, as a fraction of the original. A phone crops a landscape frame hard,
// and without this the couple slides out of shot.
const PHOTOS = {
  P01: {
    original: 'c01-reception-portrait.jpg',
    name: 'reception',
    note: 'Reception portrait under the flower arch. Portrait frame, used full-bleed.',
    focal: { x: 0.5, y: 0.34 },
    warmth: 0.05,
    brightness: 1.03,
    saturation: 1.02,
    contrast: [1.04, -3],
  },
  P02: {
    original: 'c02-corridor.jpg',
    name: 'corridor',
    note: 'Laughing in the corridor. Low light, so it is lifted more than the others and its blacks kept.',
    focal: { x: 0.63, y: 0.34 },
    warmth: 0.06,
    brightness: 1.12,
    saturation: 1.06,
    contrast: [1.02, 4],
  },
  P03: {
    original: 'c03-sindoor-box.jpg',
    name: 'sindoor-box',
    note: 'The sindoor dani held in both hands. The one detail shot; high key already.',
    focal: { x: 0.5, y: 0.5 },
    warmth: 0.03,
    brightness: 0.99,
    saturation: 1.0,
    contrast: [1.05, -6],
  },
  P04: {
    original: 'c04-red-lehenga.jpg',
    name: 'red-lehenga',
    note: 'Red lehenga and cream sherwani. The most saturated frame on the page, so it is held back a little.',
    focal: { x: 0.55, y: 0.42 },
    warmth: 0.03,
    brightness: 1.04,
    saturation: 0.97,
    contrast: [1.05, -4],
  },
  P05: {
    original: 'c05-engagement-glimpse.jpg',
    name: 'engagement-glimpse',
    note: 'Close-up, lying down laughing together, shot through blurred foreground fingers. Already warm and low-key, so it is lifted rather than warmed.',
    focal: { x: 0.5, y: 0.42 },
    warmth: 0.01,
    brightness: 1.05,
    saturation: 1.0,
    contrast: [1.03, -2],
  },
};

await fs.mkdir(outDir, { recursive: true });
const written = [];

for (const [id, spec] of Object.entries(PHOTOS)) {
  if (only && !only.includes(id)) continue;
  const src = path.join(originals, spec.original);
  try {
    await fs.access(src);
  } catch {
    console.warn(`${id}  skipped — original missing: ${spec.original}`);
    continue;
  }

  const meta = await sharp(src).metadata();
  const w = spec.warmth || 0;

  for (const width of WIDTHS) {
    if (meta.width < width * 0.6) continue; // never upscale a small original into a big file
    let img = sharp(src)
      .resize(Math.min(width, meta.width), null, { withoutEnlargement: true })
      .modulate({ brightness: spec.brightness, saturation: spec.saturation })
      .linear(spec.contrast[0], spec.contrast[1]);
    // Same channel weighting as the shared grades: lift red, hold green, drop blue.
    if (w) img = img.recomb([[1 + w, 0, 0], [0, 1 + w * 0.35, 0], [0, 0, 1 - w]]);

    const base = `${id.toLowerCase()}-${spec.name}-${width}`;
    const buf = await img.png().toBuffer();
    await sharp(buf).avif({ quality: 52 }).toFile(path.join(outDir, `${base}.avif`));
    await sharp(buf).webp({ quality: 74 }).toFile(path.join(outDir, `${base}.webp`));
    await sharp(buf).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(outDir, `${base}.jpg`));
    written.push(base);
  }
  console.log(`${id}  ${spec.name}  focal ${spec.focal.x}/${spec.focal.y}`);
}

// The focal points travel with the images so the page can set object-position from one place.
await fs.writeFile(
  path.join(outDir, 'focal.json'),
  JSON.stringify(
    Object.fromEntries(Object.entries(PHOTOS).map(([id, s]) => [id, { name: s.name, focal: s.focal }])),
    null,
    2,
  ) + '\n',
);

console.log(`\n${written.length * 3} files into ${path.relative(root, outDir)}`);
