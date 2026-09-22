/* Stages the Lal & Sona invitation (slug: baidyanath) as a flat site for Vercel: the design at the root, the shared engine
   beside it at engine/, and the ../../engine/ references rewritten to match. Nothing is edited in
   site/ — this only ever writes into the staging folder. Usage: node tools/deploy-baidyanath.mjs */
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const design = path.join(root, 'site', 'invitations', 'baidyanath');
const engine = path.join(root, 'site', 'engine');
const shared = path.join(root, 'site', 'shared');
const out = path.join(root, 'vercel-baidyanath');

// The staging folder is rebuilt every time, but .vercel (the project link) is kept.
const keep = new Set(['.vercel', '.env.local']);
await fs.mkdir(out, { recursive: true });
for (const entry of await fs.readdir(out)) {
  if (!keep.has(entry)) await fs.rm(path.join(out, entry), { recursive: true, force: true });
}

await fs.cp(design, out, { recursive: true });
await fs.cp(engine, path.join(out, 'engine'), { recursive: true });
// The shared audio library, so a track is encoded once and every invitation reads the same file.
await fs.cp(shared, path.join(out, 'shared'), { recursive: true });

// The design sits two levels down in the repo and at the root here, so both the engine path and the
// shared-library path change. details.js is rewritten too, because that is where the music loop's
// path lives.
for (const file of ['index.html', 'details.js']) {
  const p = path.join(out, file);
  const text = await fs.readFile(p, 'utf8');
  const fixed = text
    .replace(/\.\.\/\.\.\/engine\//g, 'engine/')
    .replace(/\.\.\/\.\.\/shared\//g, 'shared/');
  if (/\.\.\//.test(fixed)) throw new Error(`${file} still points outside the site root`);
  await fs.writeFile(p, fixed);
}

await fs.writeFile(path.join(out, 'vercel.json'), JSON.stringify({
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/engine/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] }
  ]
}, null, 2) + '\n');

await fs.writeFile(path.join(out, '.gitignore'), '.vercel\n.env*.local\n');

let files = 0, bytes = 0;
async function walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!keep.has(e.name)) await walk(p); }
    else { files++; bytes += (await fs.stat(p)).size; }
  }
}
await walk(out);
console.log(`staged ${files} files, ${(bytes / 1024 / 1024).toFixed(2)} MB → ${path.relative(root, out)}`);
