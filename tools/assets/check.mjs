// Verifies a design's asset manifest against the files on disk and the budgets.
// Errors (exit 1): missing files, unlisted files, built external assets without licence details,
// identifiable people without a replacement flag, built files over their ceiling, opening over budget.
// Usage: node tools/assets/check.mjs mogra-moti
import fs from 'node:fs/promises';
import path from 'node:path';

const slug = process.argv[2] || 'mogra-moti';
const root = path.resolve(import.meta.dirname, '..', '..');
const dir = path.join(root, 'site', 'invitations', slug, 'assets');
const manifest = JSON.parse(await fs.readFile(path.join(dir, 'manifest.json'), 'utf8'));

const OPENING_BUDGET_KB = 350;
const NON_ASSET_OPENING_KB = { 'GSAP (core + ScrollTrigger + MotionPath, gzipped)': 50, 'HTML, CSS, engine and scene JS (gzipped)': 40 };

const errors = [], warnings = [], pending = [];
const listed = new Set(['manifest.json']);
const flatFiles = (files) => (typeof files === 'string' ? [files] : Array.isArray(files) ? files.flatMap(flatFiles) : Object.values(files || {}).flatMap(flatFiles));

for (const a of manifest.assets) {
  const where = `${a.id} (${a.description.slice(0, 40)}…)`;
  for (const f of ['id', 'status', 'scene', 'kind', 'category', 'description', 'usage', 'ceilingKB']) if (a[f] == null) errors.push(`${where}: missing field ${f}`);
  if (a.status !== 'built') { pending.push(`${a.id} ${a.status} — ${a.description}`); continue; }
  for (const rel of flatFiles(a.files)) {
    listed.add(rel);
    try { await fs.access(path.join(dir, rel)); } catch { errors.push(`${where}: file missing ${rel}`); }
  }
  const src = a.source || {};
  if (src.site !== 'in-house') {
    for (const f of ['site', 'page', 'creator', 'licence']) if (!src[f]) errors.push(`${where}: built external asset lacks source.${f}`);
    if (src.licence && !manifest.licences[src.licence]) errors.push(`${where}: unknown licence ${src.licence}`);
  }
  if (a.identifiablePeople && !a.modelRelease && !a.replaceBeforeLaunch) errors.push(`${where}: identifiable people without a model release must be replaceBeforeLaunch`);
  if (a.kind === 'photo' && !a.alt) errors.push(`${where}: photo without alt text`);
  if (a.bytes != null && a.bytes / 1024 > a.ceilingKB) errors.push(`${where}: ${(a.bytes / 1024).toFixed(1)} KB over ceiling ${a.ceilingKB} KB`);
}

// Unlisted files on disk
async function walk(d) {
  const out = [];
  for (const e of await fs.readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out.push(...await walk(p)); else out.push(path.relative(dir, p).split(path.sep).join('/'));
  }
  return out;
}
for (const rel of await walk(dir)) if (!listed.has(rel) && !rel.endsWith('.gitkeep')) errors.push(`unlisted file on disk: ${rel}`);

// Opening budget: ceilings for everything planned, actual bytes where built
const opening = manifest.assets.filter((a) => a.opening);
const ceilingKB = opening.reduce((s, a) => s + a.ceilingKB, 0) + Object.values(NON_ASSET_OPENING_KB).reduce((s, v) => s + v, 0);
const builtKB = opening.filter((a) => a.status === 'built').reduce((s, a) => s + (a.bytes || 0) / 1024, 0);
if (ceilingKB > OPENING_BUDGET_KB) errors.push(`opening ceilings total ${ceilingKB} KB, over the ${OPENING_BUDGET_KB} KB budget`);

console.log(`Manifest: ${manifest.assets.length} assets · ${manifest.assets.filter((a) => a.status === 'built').length} built · ${pending.length} pending`);
console.log(`Opening budget: ceilings ${ceilingKB} / ${OPENING_BUDGET_KB} KB (includes ${Object.entries(NON_ASSET_OPENING_KB).map(([k, v]) => `${k} ${v} KB`).join(', ')}); built so far ${builtKB.toFixed(1)} KB`);
if (pending.length) console.log('\nPending:\n  ' + pending.join('\n  '));
if (warnings.length) console.log('\nWarnings:\n  ' + warnings.join('\n  '));
if (errors.length) { console.log('\nErrors:\n  ' + errors.join('\n  ')); process.exit(1); }
console.log('\nNo errors.');
