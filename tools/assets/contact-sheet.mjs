// Renders every built asset of a design as one contact sheet, on the grounds it will actually sit on,
// so the collection can be inspected together (weak or mismatched assets stand out side by side).
// Output: tools/capture/out/<slug>-assets.png (not committed). Usage: node tools/assets/contact-sheet.mjs mogra-moti
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const slug = process.argv[2] || 'mogra-moti';
const root = path.resolve(import.meta.dirname, '..', '..');
const dir = path.join(root, 'site', 'invitations', slug, 'assets');
const outDir = path.join(root, 'tools', 'capture', 'out');
await fs.mkdir(outDir, { recursive: true });
const manifest = JSON.parse(await fs.readFile(path.join(dir, 'manifest.json'), 'utf8'));

const pick = (files) => {
  if (typeof files === 'string') return files;
  if (Array.isArray(files)) return files[files.length - 1];
  if (files.webp) return pick(files.webp);
  if (files.svg) return files.svg;
  return null;
};
const tiles = [];
for (const a of manifest.assets.filter((x) => x.status === 'built')) {
  const groups = a.files.webp || a.files.svg ? { [a.id]: a.files } : a.files;
  for (const [name, files] of Object.entries(groups)) {
    const rel = pick(files);
    if (!rel) continue;
    const bytes = (await fs.stat(path.join(dir, rel))).size;
    tiles.push({ id: a.id, name, rel, kind: a.kind, kb: (bytes / 1024).toFixed(1), texture: a.kind === 'texture' });
  }
}

const base = pathToFileURL(dir + path.sep).href;
const html = `<!doctype html><meta charset="utf-8"><style>
  body { margin: 0; font: 12px/1.3 Arial, sans-serif; background: #2a2622; color: #eee; }
  h1 { font-size: 14px; margin: 12px; }
  .grid { display: grid; grid-template-columns: repeat(4, 300px); gap: 12px; padding: 0 12px 12px; }
  .cell { display: grid; grid-template-columns: 1fr 1fr; background: #111; }
  .cell div { height: 200px; display: grid; place-items: center; overflow: hidden; }
  .paper { background: #ECEAE4; } .night { background: #1E1915; }
  .cell img { max-width: 92%; max-height: 92%; }
  .cell .tex { width: 100%; height: 100%; background-size: 256px; }
  .cap { grid-column: 1 / -1; height: auto !important; display: block !important; padding: 5px 7px; background: #1b1815; }
</style><h1>${slug} — built assets on paper-dawn (left) and night (right)</h1><div class="grid">
${tiles.map((t) => `<div class="cell">
  <div class="paper">${t.texture ? `<div class="tex" style="background-image:url('${base}${t.rel}')"></div>` : `<img src="${base}${t.rel}">`}</div>
  <div class="night">${t.texture ? `<div class="tex" style="background-image:url('${base}${t.rel}')"></div>` : `<img src="${base}${t.rel}">`}</div>
  <div class="cap">${t.id} · ${t.name} · ${t.kb} KB<br>${t.rel}</div></div>`).join('')}
</div>`;
const sheet = path.join(outDir, `${slug}-assets.html`);
await fs.writeFile(sheet, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1260, height: 400 } });
await page.goto(pathToFileURL(sheet).href);
await page.waitForLoadState('networkidle');
const out = path.join(outDir, `${slug}-assets.png`);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`contact sheet: ${out} (${tiles.length} images)`);
