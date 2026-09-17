// Interaction checks for the Mogra & Moti opening: fallback without animation (?still), deep link (?open),
// keyboard activation, tap during the opening (fast-forward) and scroll unlocking after the Draw.
// Usage: node tools/capture/interaction.mjs [--out qa/iteration-05]
import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const outArg = args.indexOf('--out') >= 0 ? args[args.indexOf('--out') + 1] : null;
const root = path.resolve(import.meta.dirname, '..', '..');
const site = path.join(root, 'site');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  let f = path.join(site, decodeURIComponent(req.url.split('?')[0]));
  if (fss.existsSync(f) && fss.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  fs.readFile(f).then((b) => { res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); res.end(b); }, () => { res.writeHead(404); res.end(); });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/invitations/mogra-moti/`;
const browser = await chromium.launch();
const results = [];
const errors = [];

async function page(query, vp = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: true });
  const p = await context.newPage();
  p.on('pageerror', (e) => errors.push(`${query}: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(`${query}: ${m.text()}`); });
  await p.goto(base + query);
  return { context, p };
}
const state = (p) => p.evaluate(() => ({
  covered: document.documentElement.classList.contains('is-covered'),
  motion: document.documentElement.classList.contains('motion-ok'),
  inert: document.getElementById('invitation').inert,
  focus: document.activeElement && (document.activeElement.id || document.activeElement.tagName),
  scrollable: document.documentElement.scrollHeight > innerHeight && getComputedStyle(document.body).overflow !== 'hidden',
}));
function check(name, ok, detail) { results.push({ name, ok, detail }); }

// 1. No animation frames (?still stands in for webviews that never run rAF): the settled invitation shows, a tap
//    opens Welcome at once.
{
  const { context, p } = await page('?still');
  await p.waitForTimeout(2500);
  const before = await state(p);
  const shot = await p.screenshot();
  await p.mouse.click(195, 600);
  await p.waitForTimeout(200);
  const after = await state(p);
  check('still: invitation visible without motion', before.covered && !before.motion, before);
  check('still: tap opens Welcome instantly', !after.covered && !after.inert && after.focus === 'welcome-title', after);
  if (outArg) await sharp(shot).jpeg({ quality: 80 }).toFile(path.join(root, outArg, 'fallback-still-phone.jpg'));
  await context.close();
}
// 2. Deep link: ?open skips the opening.
{
  const { context, p } = await page('?open');
  await p.waitForTimeout(1500);
  const s = await state(p);
  check('open: Welcome shown, opening skipped', !s.covered && !s.inert, s);
  await context.close();
}
// 3. Keyboard: Tab reaches the cover button; Enter plays the Draw and hands focus to the heading.
{
  const { context, p } = await page('?test');
  await p.waitForFunction(() => window.__mm && window.__mm.ready);
  await p.waitForTimeout(7200);
  await p.keyboard.press('Tab');
  const focused = await p.evaluate(() => document.activeElement.id);
  const t0 = Date.now();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(3200);
  const s = await state(p);
  check('keyboard: Tab focuses the cover button', focused === 'open-invitation', { focused });
  check('keyboard: Enter enters; focus on the heading; scroll unlocked', !s.covered && !s.inert && s.focus === 'welcome-title' && s.scrollable, { ...s, ms: Date.now() - t0 });
  await context.close();
}
// 4. Escape does not open.
{
  const { context, p } = await page('?test');
  await p.waitForFunction(() => window.__mm && window.__mm.ready);
  await p.waitForTimeout(7200);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(600);
  const s = await state(p);
  check('keyboard: Escape does not open', s.covered, s);
  await context.close();
}
// 5. Impatience: a tap at 2 s fast-forwards the opening (4×) and then plays the Draw.
{
  const { context, p } = await page('?test');
  await p.waitForFunction(() => window.__mm && window.__mm.ready);
  await p.waitForTimeout(2000);
  await p.mouse.click(195, 600);
  const speed = await p.evaluate(() => window.__mm.timelines.opening.speed);
  await p.waitForTimeout(1600 + 3200);
  const s = await state(p);
  check('tap at 2 s: opening fast-forwards at 4×', speed === 4, { speed });
  check('tap at 2 s: Draw completes, Welcome active', !s.covered && s.focus === 'welcome-title', s);
  await context.close();
}
// 6. An early tap (before 1.2 s) is queued, not lost.
{
  const { context, p } = await page('?test');
  await p.waitForFunction(() => window.__mm && window.__mm.ready);
  await p.mouse.click(195, 600);
  await p.waitForTimeout(8000);
  const s = await state(p);
  check('tap at 0 s: queued, then enters', !s.covered, s);
  await context.close();
}

await browser.close();
server.close();
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  ${JSON.stringify(r.detail)}`);
if (errors.length) { console.log('PAGE ERRORS'); errors.forEach((e) => console.log('  ' + e)); }
if (outArg) await fs.writeFile(path.join(root, outArg, 'interaction.json'), JSON.stringify({ results, errors }, null, 2) + '\n');
process.exitCode = results.every((r) => r.ok) && !errors.length ? 0 : 1;
