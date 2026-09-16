// Renders in-house assets for a design: pressed-paper monogram layers (Playwright + Chromium SVG filters),
// the chikankari shadow sprite and the thread SVG (sharp). Updates the manifest's files and byte sizes.
// Usage: node tools/assets/render.mjs mogra-moti
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const slug = process.argv[2] || 'mogra-moti';
const root = path.resolve(import.meta.dirname, '..', '..');
const src = path.join(root, 'tools', 'assets', 'sources', slug);
const out = path.join(root, 'site', 'invitations', slug, 'assets');
const manifestPath = path.join(out, 'manifest.json');
const previewDir = path.join(root, 'tools', 'capture', 'out');
await fs.mkdir(previewDir, { recursive: true });

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const entry = (id) => manifest.assets.find((a) => a.id === id);
const size = async (rel) => (await fs.stat(path.join(out, rel))).size;

async function writeAlphaVariants(buffer, base) {
  const files = {};
  const avif = `${base}.avif`;
  const webp = `${base}.webp`;
  await sharp(buffer).avif({ quality: 55, effort: 6 }).toFile(path.join(out, avif));
  await sharp(buffer).webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(path.join(out, webp));
  files.avif = avif; files.webp = webp;
  return files;
}

// V02 — monogram layers
{
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 448, height: 448 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(src, 'monogram.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const layers = ['occlusion', 'shadow', 'highlight', 'foil'];
  const files = {};
  let bytes = 0;
  for (const layer of layers) {
    await page.evaluate((keep) => {
      document.querySelectorAll('[data-layer]').forEach((g) => { g.style.display = g.dataset.layer === keep ? '' : 'none'; });
    }, layer);
    const png = await page.locator('#art').screenshot({ omitBackground: true });
    const v = await writeAlphaVariants(png, `ornaments/monogram-${layer}`);
    files[layer] = v;
    bytes += await size(v.avif);
  }
  // Preview: all layers composited on flat paper, for inspection only (not shipped).
  await page.evaluate(() => {
    document.querySelectorAll('[data-layer]').forEach((g) => { g.style.display = ''; });
    document.body.style.background = '#ECEAE4';
  });
  await page.locator('#art').screenshot({ path: path.join(previewDir, `${slug}-monogram-preview.png`) });
  await browser.close();
  Object.assign(entry('V02'), { status: 'built', files, bytes, width: 448, height: 448 });
}

// V03 — chikankari shadow sprite: motifs → blur → ink at ~9% opacity
{
  const svg = await fs.readFile(path.join(src, 'chikan-motifs.svg'));
  const mask = await sharp(svg, { density: 144 }).resize(360, 160).extractChannel('alpha').blur(4).toBuffer();
  const { width, height } = await sharp(mask).metadata();
  const alpha = await sharp(mask).linear(0.09, 0).toBuffer();
  const rgba = await sharp({ create: { width, height, channels: 3, background: '#2A2520' } }).joinChannel(alpha).png().toBuffer();
  const files = await writeAlphaVariants(rgba, 'ornaments/chikan-shadow');
  Object.assign(entry('V03'), { status: 'built', files, bytes: await size(files.avif), width, height });
}

// V01 — thread SVG, comments stripped
{
  const text = await fs.readFile(path.join(src, 'thread-opening.svg'), 'utf8');
  const clean = text.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n/g, '\n');
  await fs.writeFile(path.join(out, 'ornaments', 'thread-opening.svg'), clean);
  Object.assign(entry('V01'), { status: 'built', files: { svg: 'ornaments/thread-opening.svg' }, bytes: await size('ornaments/thread-opening.svg') });
}

manifest.updated = new Date().toLocaleDateString('en-CA');
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('rendered V01, V02, V03');
for (const id of ['V01', 'V02', 'V03']) console.log(`  ${id}: ${(entry(id).bytes / 1024).toFixed(1)} KB (ceiling ${entry(id).ceilingKB} KB)`);
