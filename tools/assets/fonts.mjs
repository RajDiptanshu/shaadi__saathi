// Subsets the approved OFL fonts to the glyphs and axis ranges the design uses, as WOFF2, and updates the manifest.
// Sources: assets-src/<slug>/fonts/ (gitignored). The OFL text is copied next to each shipped file.
// Usage: node tools/assets/fonts.mjs mogra-moti
import subsetFont from 'subset-font';
import fs from 'node:fs/promises';
import path from 'node:path';

const slug = process.argv[2] || 'mogra-moti';
const root = path.resolve(import.meta.dirname, '..', '..');
const src = path.join(root, 'assets-src', slug, 'fonts');
const outDir = path.join(root, 'site', 'invitations', slug, 'assets');
const manifestPath = path.join(outDir, 'manifest.json');

const LATIN = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' +
  ' ·–—‘’“”•…₹×é';
const DEVANAGARI = '०१२३४५६७८९।॥';

// Axis ranges come from typography-system.md §2 (the type tokens), so nothing unused ships.
const FONTS = {
  F01: { file: 'Imbue[opsz,wght].ttf', ofl: 'Imbue-OFL.txt', out: 'imbue', text: LATIN, axes: { wght: 300, opsz: { min: 32, max: 100 } } },
  F02: { file: 'Archivo[wdth,wght].ttf', ofl: 'Archivo-OFL.txt', out: 'archivo', text: LATIN, axes: { wdth: { min: 100, max: 118 }, wght: { min: 400, max: 520 } } },
  F03: { file: 'NotoSerifDevanagari[wdth,wght].ttf', ofl: 'NotoSerifDevanagari-OFL.txt', out: 'noto-serif-devanagari', text: DEVANAGARI, axes: { wdth: 75, wght: 450 } },
};

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
for (const [id, f] of Object.entries(FONTS)) {
  const input = await fs.readFile(path.join(src, f.file));
  const woff2 = await subsetFont(input, f.text, { targetFormat: 'woff2', variationAxes: f.axes });
  const rel = `fonts/${f.out}.woff2`;
  await fs.writeFile(path.join(outDir, rel), woff2);
  await fs.copyFile(path.join(src, f.ofl), path.join(outDir, 'fonts', f.ofl));
  console.log(`${id} ${rel}: ${(woff2.length / 1024).toFixed(1)} KB`);
  const e = manifest.assets.find((a) => a.id === id);
  if (e) {
    const axes = Object.entries(f.axes).map(([k, v]) => `${k} ${typeof v === 'number' ? v : `${v.min}–${v.max}`}`).join(', ');
    Object.assign(e, {
      status: 'built',
      files: { woff2: rel, licence: `fonts/${f.ofl}` },
      bytes: woff2.length,
      edits: [`subset to ${[...new Set(f.text)].length} characters`, `axes limited to ${axes}`, 'WOFF2'],
    });
    if (e.candidate && !e.source) e.source = { ...e.candidate, downloaded: '2026-09-17' };
  }
}
manifest.updated = new Date().toLocaleDateString('en-CA');
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
