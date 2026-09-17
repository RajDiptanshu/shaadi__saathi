// Builds external assets from approved originals using a design's recipe file, then updates the manifest.
// Originals live in assets-src/<slug>/originals/ (gitignored). Recipes live in tools/assets/<slug>.recipes.json.
// Usage: node tools/assets/build.mjs mogra-moti [--recipes path] [--out dir] [--only ID,ID]
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--')) || 'mogra-moti';
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
const root = path.resolve(import.meta.dirname, '..', '..');
const recipesPath = opt('recipes') || path.join(root, 'tools', 'assets', `${slug}.recipes.json`);
const outDir = opt('out') || path.join(root, 'site', 'invitations', slug, 'assets');
const originals = path.join(root, 'assets-src', slug, 'originals');
const manifestPath = path.join(outDir, 'manifest.json');
const only = opt('only') ? opt('only').split(',') : null;

// Grade recipes: scripted approximations of visual-dna.md §2.3 (white balance, contrast, saturation,
// black and white points). Checked visually on the contact sheet; hand grading may replace them per image.
const GRADES = {
  dawn:      { warm: -0.02, contrast: -0.15, saturation: 0.75, black: 18, white: 250 },
  // Dawn for photographs shot in warm market light: cooler and quieter, black lifted less so skin keeps its depth.
  'dawn-warm-source': { warm: -0.06, contrast: -0.1, saturation: 0.62, black: 14, white: 246 },
  midday:    { warm: 0.00,  contrast: -0.10, saturation: 0.80, black: 18, white: 250 },
  afternoon: { warm: 0.035, contrast: -0.10, saturation: 0.85, black: 18, white: 250 },
  godhuli:   { warm: 0.07,  contrast: -0.08, saturation: 0.85, black: 18, white: 248 },
  lamp:      { warm: 0.10,  contrast: 0.05,  saturation: 0.85, black: 25, white: 245 },
};

async function grade(img, name) {
  const g = GRADES[name];
  if (!g) throw new Error(`unknown grade ${name}`);
  const a = 1 + g.contrast;
  img = img.linear(a, 128 * (1 - a));
  img = img.recomb([[1 + g.warm, 0, 0], [0, 1 + g.warm * 0.35, 0], [0, 0, 1 - g.warm]]);
  img = img.modulate({ saturation: g.saturation });
  const span = (g.white - g.black) / 255;
  return img.linear(span, g.black);
}

// Deterministic fine grain (~amount of the value range), overlaid on RGB.
function grainBuffer(width, height, amount) {
  const buf = Buffer.alloc(width * height);
  let s = 1234567;
  for (let i = 0; i < buf.length; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    buf[i] = 128 + Math.round(((s / 0x7fffffff) - 0.5) * 255 * amount * 2);
  }
  return buf;
}
async function addGrain(buffer, amount) {
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const noise = grainBuffer(info.width, info.height, amount);
  for (let p = 0, n = 0; p < data.length; p += info.channels, n++) {
    const d = noise[n] - 128;
    for (let c = 0; c < Math.min(3, info.channels); c++) data[p + c] = Math.max(0, Math.min(255, data[p + c] + d));
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

// Seamless tile by offset crossfade: the half-shifted copy covers the original's edges.
async function seamless(buffer, size) {
  const { data, info } = await sharp(buffer).resize(size, size, { fit: 'cover' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels;
  const out = Buffer.alloc(data.length);
  const band = Math.round(size * 0.18);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const edge = Math.min(x, y, w - 1 - x, h - 1 - y);
      const m = edge >= band ? 0 : 0.5 * (1 + Math.cos(Math.PI * edge / band));
      const sx = (x + (w >> 1)) % w, sy = (y + (h >> 1)) % h;
      const i = (y * w + x) * ch, j = (sy * w + sx) * ch;
      for (let c = 0; c < ch; c++) out[i + c] = Math.round(data[i + c] * (1 - m) + data[j + c] * m);
    }
  }
  return sharp(out, { raw: info }).png().toBuffer();
}

// Alpha from luminance: below `black` transparent, above `white` opaque, smooth between.
async function lumaKey(buffer, { black = 20, white = 90, gamma = 1, invert = false }) {
  const rgb = await sharp(buffer).removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
  const { data, info } = rgb;
  const alpha = Buffer.alloc(info.width * info.height);
  for (let p = 0, n = 0; p < data.length; p += 3, n++) {
    let l = 0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2];
    if (invert) l = 255 - l;
    let t = (l - black) / (white - black);
    t = Math.max(0, Math.min(1, t));
    alpha[n] = Math.round(255 * Math.pow(t, gamma));
  }
  return sharp(data, { raw: info }).joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
}

// Matte for pale petals on a dark ground with green leaves: keep bright AND unsaturated pixels, then
// blur and re-threshold the matte so sensor noise and small creases don't eat into the silhouette.
const smooth = (x, a, b) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
async function matteKey(buffer, { vLow = 35, vHigh = 80, sLow = 0.3, sHigh = 0.52, blur = 2.5, edge = 0.14, despill = 0.9, brightness = 1, saturation = 1 }) {
  const { data, info } = await sharp(buffer).removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const matte = Buffer.alloc(W * H);
  for (let p = 0, n = 0; p < data.length; p += 3, n++) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const v = Math.max(r, g, b), s = v ? (v - Math.min(r, g, b)) / v : 0;
    matte[n] = Math.round(255 * smooth(v, vLow, vHigh) * (1 - smooth(s, sLow, sHigh)));
    const limit = (r + b) / 2 + 6;
    if (g > limit) data[p + 1] = Math.round(g - (g - limit) * despill);
  }
  const soft = await sharp(matte, { raw: { width: W, height: H, channels: 1 } }).blur(blur).extractChannel(0).raw().toBuffer();
  const alpha = Buffer.alloc(W * H);
  for (let n = 0; n < alpha.length; n++) alpha[n] = Math.round(255 * smooth(soft[n] / 255, 0.5 - edge, 0.5 + edge));
  let rgb = { data, info };
  if (brightness !== 1 || saturation !== 1) rgb = await sharp(data, { raw: info }).modulate({ brightness, saturation }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return sharp(rgb.data, { raw: rgb.info }).joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
}

// Hull for a keyed subject: solid inside the core ellipse (shaded areas the key would eat), key-decided in the
// ring between core and edge (so the real outline survives), nothing outside the ellipse.
async function ellipseHull(buffer, { cx, cy, rx, ry, core = 0.8, feather = 4 }) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const m = Math.min(rx, ry);
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const d = Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry);
    const outer = Math.max(0, Math.min(1, (1 - d) * m / feather + 0.5));
    const inner = Math.max(0, Math.min(1, (core - d) * m / feather + 0.5));
    const i = (y * info.width + x) * 4 + 3;
    data[i] = Math.round(Math.max(data[i], 255 * inner) * outer);
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

// Keeps only the pixels inside an ellipse (feathered), for isolating one subject from its neighbours.
async function ellipseMask(buffer, { cx, cy, rx, ry, feather = 6 }) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const d = Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry);
    const k = Math.max(0, Math.min(1, (1 - d) * Math.min(rx, ry) / feather + 0.5));
    const i = (y * info.width + x) * 4 + 3;
    data[i] = Math.round(data[i] * k);
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

// Circular cut-out with a 1.5 px feather (pearls).
async function circleCutout(buffer, { cx, cy, r }) {
  const size = Math.ceil(r * 2) + 4;
  const left = Math.round(cx - size / 2), top = Math.round(cy - size / 2);
  const crop = await sharp(buffer).extract({ left, top, width: size, height: size }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const alpha = Buffer.alloc(size * size);
  const c = size / 2;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const d = Math.hypot(x + 0.5 - c, y + 0.5 - c);
    alpha[y * size + x] = Math.round(255 * Math.max(0, Math.min(1, (r - d) / 1.5 + 0.5)));
  }
  return sharp(crop.data, { raw: crop.info }).joinChannel(alpha, { raw: { width: size, height: size, channels: 1 } }).png().toBuffer();
}

async function lqip(buffer) {
  const b = await sharp(buffer).resize(16).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${b.toString('base64')}`;
}

async function writeOutputs(buffer, base, outputs, hasAlpha) {
  const files = {};
  let primaryBytes = 0;
  for (const o of outputs) {
    const width = o.width;
    const resized = sharp(buffer).resize({ width, withoutEnlargement: true });
    for (const format of o.formats || (hasAlpha ? ['avif', 'webp'] : ['avif', 'webp', 'jpg'])) {
      const rel = `${base}-${width}.${format}`;
      const target = path.join(outDir, rel);
      let pipe = resized.clone();
      if (format === 'avif') pipe = pipe.avif({ quality: o.avif ?? (hasAlpha ? 55 : 50), effort: 6 });
      if (format === 'webp') pipe = pipe.webp({ quality: o.webp ?? 72, alphaQuality: 90, effort: 6 });
      if (format === 'jpg') pipe = pipe.flatten({ background: '#F3EEE5' }).jpeg({ quality: o.jpg ?? 78, mozjpeg: true });
      await pipe.toFile(target);
      (files[format] ||= []).push(rel);
      if (format === 'avif' && o.primary) primaryBytes = (await fs.stat(target)).size;
    }
  }
  return { files, primaryBytes };
}

async function buildOne(id, recipe) {
  const results = [];
  const originalPath = path.join(originals, recipe.original);
  try { await fs.access(originalPath); } catch { return { id, skipped: `original not downloaded: ${recipe.original}` }; }
  let buffer = await fs.readFile(originalPath);
  const edits = [];
  const stage = async (fn, label) => { buffer = await fn(sharp(buffer).rotate()); edits.push(label); };

  if (recipe.crop) await stage((s) => s.extract(recipe.crop).png().toBuffer(), `crop ${recipe.crop.width}x${recipe.crop.height}`);
  if (recipe.scale) await stage(async (s) => s.resize({ width: Math.round((await s.metadata()).width * recipe.scale) }).png().toBuffer(), `scaled ×${recipe.scale} before keying`);
  if (recipe.flop) await stage((s) => s.flop().png().toBuffer(), 'mirrored horizontally to match the top-left key light');
  if (recipe.desaturate != null) await stage((s) => s.modulate({ saturation: recipe.desaturate }).png().toBuffer(), `saturation ×${recipe.desaturate}`);
  if (recipe.linear) await stage((s) => s.linear(recipe.linear[0], recipe.linear[1]).png().toBuffer(), `levels ×${recipe.linear[0]} ${recipe.linear[1] >= 0 ? '+' : ''}${recipe.linear[1]}`);
  if (recipe.grade) { buffer = await (await grade(sharp(buffer), recipe.grade)).png().toBuffer(); edits.push(`grade ${recipe.grade}`); }
  if (recipe.tint) await stage((s) => s.tint(recipe.tint).png().toBuffer(), `tint ${recipe.tint}`);
  if (recipe.tile) { buffer = await seamless(buffer, recipe.tile); edits.push(`seamless ${recipe.tile}px tile`); }
  if (recipe.grain) { buffer = await addGrain(buffer, recipe.grain); edits.push(`grain ${Math.round(recipe.grain * 100)}%`); }

  let variants = [{ name: recipe.name, buffer }];
  if (recipe.lumaKey) { variants[0].buffer = await lumaKey(buffer, recipe.lumaKey); edits.push('luminance key to alpha'); }
  if (recipe.matteKey) { variants[0].buffer = await matteKey(buffer, recipe.matteKey); edits.push('value/saturation matte, smoothed (drops dark ground and green sepals)'); }
  if (recipe.circles) {
    variants = await Promise.all(recipe.circles.map(async (c, i) => ({ name: c.name || `${recipe.name}-${i + 1}`, buffer: await circleCutout(buffer, c) })));
    edits.push(`${recipe.circles.length} circular cut-out(s)`);
  }
  if (recipe.crops) {
    variants = await Promise.all(recipe.crops.map(async (c) => {
      let b = await sharp(variants[0].buffer).extract({ left: c.left, top: c.top, width: c.width, height: c.height }).png().toBuffer();
      if (c.ellipse) b = await ellipseMask(b, c.ellipse);
      if (c.hull) b = await ellipseHull(b, c.hull);
      if (c.tone) {
        // Tone the colour only; the alpha channel is kept exactly as keyed.
        const a = await sharp(b).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
        let rgb = sharp(b).removeAlpha();
        if (c.tone.saturation != null) rgb = sharp(await rgb.modulate({ saturation: c.tone.saturation }).png().toBuffer());
        if (c.tone.linear) rgb = sharp(await rgb.linear(c.tone.linear[0], c.tone.linear[1]).png().toBuffer());
        if (c.tone.tint) rgb = sharp(await rgb.tint(c.tone.tint).png().toBuffer());
        // Join from raw pixels: joinChannel on a tinted pipeline silently drops the extra band.
        const raw = await rgb.removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
        b = await sharp(raw.data, { raw: raw.info }).joinChannel(a.data, { raw: { width: a.info.width, height: a.info.height, channels: 1 } }).png().toBuffer();
      }
      if (c.rotate) b = await sharp(b).rotate(c.rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
      if (c.trim) b = await sharp(b).trim({ threshold: 1 }).png().toBuffer();
      return { name: c.name, buffer: b };
    }));
    edits.push(`${recipe.crops.length} extracted cut-out(s)`);
  }

  const alpha = !!(recipe.lumaKey || recipe.matteKey || recipe.circles || recipe.alpha);
  const files = {};
  let bytes = 0;
  for (const v of variants) {
    const base = `${recipe.category}/${id.toLowerCase()}-${v.name}`;
    const res = await writeOutputs(v.buffer, base, recipe.outputs, alpha);
    files[v.name] = res.files;
    bytes += res.primaryBytes;
  }
  const meta = await sharp(variants[0].buffer).metadata();
  results.push({ id, files, bytes, edits, width: meta.width, height: meta.height, lqip: alpha ? null : await lqip(variants[0].buffer), focal: recipe.focal || null });
  return results[0];
}

const recipes = JSON.parse(await fs.readFile(recipesPath, 'utf8'));
let manifest = null;
try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch { /* test runs may have no manifest */ }

for (const [id, recipe] of Object.entries(recipes.assets)) {
  if (only && !only.includes(id)) continue;
  const r = await buildOne(id, recipe);
  if (r.skipped) { console.log(`skip  ${id}: ${r.skipped}`); continue; }
  console.log(`built ${id}: ${(r.bytes / 1024).toFixed(1)} KB primary · ${r.edits.join(' · ')}`);
  const e = manifest && manifest.assets.find((a) => a.id === id);
  if (e) {
    Object.assign(e, { status: 'built', files: r.files, bytes: r.bytes, width: r.width, height: r.height, edits: r.edits });
    if (r.lqip) e.lqip = r.lqip;
    if (r.focal) e.focal = r.focal;
    if (e.candidate && !e.source) e.source = { ...e.candidate, downloaded: recipe.downloaded || null };
  }
}
if (manifest) {
  manifest.updated = new Date().toLocaleDateString('en-CA');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}
