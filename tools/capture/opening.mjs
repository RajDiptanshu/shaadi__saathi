// Hero-gate capture for Mogra & Moti: seeked frames (normal and reduced, phone and desktop), contact sheets,
// real-time recordings with a tap, and performance measurements. Output: qa/iteration-NN/.
// Usage: node tools/capture/opening.mjs --iter 1 [--only frames|video|perf]
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import http from 'node:http';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const iter = String(opt('iter', '1')).padStart(2, '0');
const only = opt('only', 'all');
const root = path.resolve(import.meta.dirname, '..', '..');
const out = path.join(root, 'qa', `iteration-${iter}`);
await fs.mkdir(out, { recursive: true });

// Static server over site/ (no caching, no compression — compression is computed separately for the budget).
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const site = path.join(root, 'site');
const server = http.createServer((req, res) => {
  let file = path.join(site, decodeURIComponent(req.url.split('?')[0]));
  if (fss.existsSync(file) && fss.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file).then((body) => {
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  }, () => { res.writeHead(404); res.end(); });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/invitations/mogra-moti/`;

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844, dpr: 2, mobile: true },
  { name: 'desktop', width: 1440, height: 900, dpr: 1, mobile: false },
];
// Other phone widths: the settled invitation, mid-Draw and the arrived Welcome.
const EXTRA = [
  { name: 'phone393', width: 393, height: 852, dpr: 2, mobile: true },
  { name: 'phone412', width: 412, height: 915, dpr: 2, mobile: true },
  { name: 'inapp', width: 390, height: 664, dpr: 2, mobile: true },
];
const FRAMES = {
  normal: { opening: [0.5, 1.5, 2.5, 3.2, 3.6, 4.0, 4.8, 5.6, 6.5, 7.3], entry: [0.12, 0.6, 1.15, 1.6, 2.2, 3.0] },
  reduced: { opening: [0.5, 1.2, 1.8, 2.3, 2.75], entry: [0.3, 0.9, 1.6] },
};

const browser = await chromium.launch();
const errors = [];

async function openPage(vp, query, extra = {}) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, isMobile: vp.mobile, hasTouch: vp.mobile, ...extra });
  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${vp.name} ${query}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${vp.name} ${query}: ${e.message}`));
  await page.goto(base + query);
  return { context, page };
}

async function frames() {
  const sheets = [];
  for (const vp of VIEWPORTS) {
    for (const mode of ['normal', 'reduced']) {
      const q = `?test&tl=opening&t=0${mode === 'reduced' ? '&rm=1' : ''}`;
      const { context, page } = await openPage(vp, q);
      await page.waitForFunction(() => window.__mm && window.__mm.ready, null, { timeout: 20000 });
      const shots = [];
      for (const tl of ['opening', 'entry']) {
        for (const t of FRAMES[mode][tl]) {
          await page.evaluate(([n, s]) => window.__mm.seek(n, s), [tl, t]);
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          const file = path.join(out, `${vp.name}-${mode}-${tl}-${t.toFixed(2)}.jpg`);
          const png = await page.screenshot();
          await sharp(png).jpeg({ quality: 80, mozjpeg: true }).toFile(file);
          shots.push({ file, label: `${tl === 'entry' ? 'tap +' : 't '}${t.toFixed(2)} s` });
        }
      }
      await context.close();
      sheets.push(await contactSheet(shots, vp, mode));
    }
  }
  for (const vp of EXTRA) {
    const { context, page } = await openPage(vp, '?test&tl=opening&t=0');
    await page.waitForFunction(() => window.__mm && window.__mm.ready, null, { timeout: 20000 });
    const shots = [];
    for (const [tl, t] of [['opening', 7.3], ['entry', 1.15], ['entry', 3.0]]) {
      await page.evaluate(([n, s]) => window.__mm.seek(n, s), [tl, t]);
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const file = path.join(out, `${vp.name}-normal-${tl}-${t.toFixed(2)}.jpg`);
      await sharp(await page.screenshot()).jpeg({ quality: 80, mozjpeg: true }).toFile(file);
      shots.push({ file, label: `${tl === 'entry' ? 'tap +' : 't '}${t.toFixed(2)} s` });
    }
    await context.close();
    sheets.push(await contactSheet(shots, vp, 'normal'));
  }
  return sheets;
}

async function contactSheet(shots, vp, mode) {
  const cols = vp.mobile ? 8 : 4;
  const tw = vp.mobile ? 234 : 450;
  const th = Math.round(tw * vp.height / vp.width);
  const pad = 12, labelH = 22;
  const rows = Math.ceil(shots.length / cols);
  const W = cols * (tw + pad) + pad, H = rows * (th + labelH + pad) + pad + 30;
  const layers = [];
  for (let i = 0; i < shots.length; i++) {
    const x = pad + (i % cols) * (tw + pad), y = 30 + pad + Math.floor(i / cols) * (th + labelH + pad);
    layers.push({ input: await sharp(shots[i].file).resize(tw, th).toBuffer(), left: x, top: y + labelH });
    layers.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${labelH}"><text x="0" y="15" font-family="Arial" font-size="13" fill="#E2CFA6">${shots[i].label}</text></svg>`), left: x, top: y });
  }
  layers.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="30"><text x="${pad}" y="22" font-family="Arial" font-size="16" fill="#ECE6DF">Mogra &amp; Moti · iteration ${iter} · ${vp.name} ${vp.width}×${vp.height} · ${mode}</text></svg>`), left: 0, top: 0 });
  const file = path.join(out, `sheet-${vp.name}-${mode}.jpg`);
  await sharp({ create: { width: W, height: H, channels: 3, background: '#1E1915' } }).composite(layers).jpeg({ quality: 82 }).toFile(file);
  return file;
}

// Real-time runs: the full opening, a tap after it settles, the Draw. Videos stay out of git (see .gitignore).
async function videos() {
  const runs = [
    { vp: VIEWPORTS[0], q: '', name: 'recording-phone-normal', wait: 7600 },
    { vp: VIEWPORTS[0], q: '?rm=1', name: 'recording-phone-reduced', wait: 2900 },
    { vp: VIEWPORTS[1], q: '', name: 'recording-desktop-normal', wait: 7600 },
  ];
  const files = [];
  for (const r of runs) {
    const dir = path.join(out, 'video-tmp');
    const { context, page } = await openPage(r.vp, r.q, { recordVideo: { dir, size: { width: r.vp.width, height: r.vp.height } } });
    await page.waitForTimeout(r.wait);
    await page.mouse.click(r.vp.width * 0.5, r.vp.height * 0.6);
    await page.waitForTimeout(3600);
    const video = page.video();
    await context.close();
    const target = path.join(out, `${r.name}.webm`);
    await fs.rename(await video.path(), target);
    files.push(target);
  }
  await fs.rm(path.join(out, 'video-tmp'), { recursive: true, force: true });
  return files;
}

async function perf() {
  const vp = VIEWPORTS[0];
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const requests = [];
  page.on('requestfinished', async (req) => {
    const res = await req.response();
    const sizes = await req.sizes();
    requests.push({ url: req.url().replace(base, ''), type: req.resourceType(), status: res && res.status(), bytes: sizes.responseBodySize, at: Date.now() });
  });
  await page.addInitScript(() => {
    window.__perf = { frames: [], cls: 0, lcp: 0, longTasks: 0, tap: null };
    let last = null;
    const loop = (now) => { if (last != null) window.__perf.frames.push(now - last); last = now; requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__perf.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { window.__perf.lcp = e.startTime; })).observe({ type: 'largest-contentful-paint', buffered: true });
    try { new PerformanceObserver((l) => { window.__perf.longTasks += l.getEntries().length; }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
  });
  const t0 = Date.now();
  await page.goto(base);
  await page.waitForTimeout(8000);
  const tapAt = Date.now();
  const openingRequests = requests.filter((r) => r.at <= tapAt);
  // Tap latency: time from the click to the first frame in which the hero pearl is pressed.
  await page.evaluate(() => {
    const hero = document.querySelector('.bead--hero');
    const start = performance.now();
    window.__perf.tapStart = start;
    const watch = () => {
      if (/scale\(/.test(hero.style.transform)) { window.__perf.tap = performance.now() - start; return; }
      if (performance.now() - start < 1000) requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
  });
  await page.mouse.click(195, 500);
  await page.waitForTimeout(3500);
  const p = await page.evaluate(() => window.__perf);
  const afterRequests = requests.filter((r) => r.at > tapAt);
  await context.close();

  const sum = (list) => list.reduce((a, r) => a + (r.bytes || 0), 0);
  // Compressed sizes of text resources, as a gzip-serving host would send them.
  let gz = 0;
  for (const r of openingRequests.filter((r) => ['document', 'script', 'stylesheet'].includes(r.type))) {
    const file = path.join(site, 'invitations', 'mogra-moti', r.url.split('?')[0] || 'index.html');
    try { gz += zlib.gzipSync(await fs.readFile(file.endsWith(path.sep) || r.url === '' ? path.join(file, 'index.html') : file), { level: 9 }).length; } catch (e) { /* engine paths resolve below */
      try { gz += zlib.gzipSync(await fs.readFile(path.join(site, r.url.replace(/^\.\.\/\.\.\//, '').replace(/^http:\/\/127\.0\.0\.1:\d+\//, ''))), { level: 9 }).length; } catch (e2) { /* ignore */ }
    }
  }
  const frames = p.frames.slice(5);
  const sorted = [...frames].sort((a, b) => a - b);
  const report = {
    measuredOn: new Date().toISOString(),
    setup: 'Playwright Chromium headless, 390×844 at DPR 3, CPU throttled 4×, local server without compression',
    opening: {
      requests: openingRequests.length,
      rawKB: +(sum(openingRequests) / 1024).toFixed(1),
      textGzipKB: +(gz / 1024).toFixed(1),
      imagesKB: +(sum(openingRequests.filter((r) => r.type === 'image')) / 1024).toFixed(1),
      fontsKB: +(sum(openingRequests.filter((r) => r.type === 'font')) / 1024).toFixed(1),
      byFile: openingRequests.map((r) => ({ url: r.url, type: r.type, KB: +(r.bytes / 1024).toFixed(1) })),
    },
    afterTap: afterRequests.map((r) => ({ url: r.url, KB: +(r.bytes / 1024).toFixed(1) })),
    lcpMs: Math.round(p.lcp),
    cls: +p.cls.toFixed(4),
    longTasks: p.longTasks,
    frames: { count: frames.length, medianMs: +sorted[Math.floor(sorted.length / 2)].toFixed(1), p95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1), maxMs: +sorted[sorted.length - 1].toFixed(1), over34ms: frames.filter((f) => f > 34).length },
    tapFeedbackMs: p.tap == null ? null : Math.round(p.tap),
  };
  report.opening.estimatedTransferKB = +(report.opening.imagesKB + report.opening.fontsKB + report.opening.textGzipKB).toFixed(1);
  await fs.writeFile(path.join(out, 'performance.json'), JSON.stringify(report, null, 2) + '\n');
  return report;
}

try {
  if (only === 'all' || only === 'frames') console.log('sheets', await frames());
  if (only === 'all' || only === 'video') console.log('videos', await videos());
  if (only === 'all' || only === 'perf') console.log('perf', JSON.stringify(await perf(), null, 2));
} finally {
  await browser.close();
  server.close();
  if (errors.length) { console.log('PAGE ERRORS'); errors.forEach((e) => console.log(' ', e)); }
}
