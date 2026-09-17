// Filmstrip from a real-time recording (no ffmpeg): plays the .webm in Chromium, seeks, and tiles the frames.
// Usage: node tools/capture/filmstrip.mjs <recording.webm> <out.jpg> [seconds, comma-separated]
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

const [input, output, list] = process.argv.slice(2);
const times = (list || '0.6,1.6,2.6,3.2,3.8,4.6,5.4,6.4,7.4,7.8,8.4,9.0,9.6,10.6').split(',').map(Number);
// Served over http: a page can't load file:// media, and Playwright's recordings need a byte-range server to seek.
const body = fs.readFileSync(path.resolve(input));
const server = http.createServer((req, res) => {
  if (req.url === '/') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end('<body style="margin:0;background:#000"><video id="v" src="/v.webm" muted preload="auto"></video></body>'); }
  const m = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
  const start = m ? +m[1] : 0, end = m && m[2] ? +m[2] : body.length - 1;
  res.writeHead(m ? 206 : 200, { 'Content-Type': 'video/webm', 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, ...(m ? { 'Content-Range': `bytes ${start}-${end}/${body.length}` } : {}) });
  res.end(body.subarray(start, end + 1));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${server.address().port}/`);
const size = await page.evaluate(() => new Promise((resolve) => {
  const v = document.getElementById('v');
  const done = () => resolve({ w: v.videoWidth, h: v.videoHeight, d: v.duration });
  const measure = () => {
    // Recordings are written without a duration; seeking far past the end makes the browser find it.
    if (isFinite(v.duration)) return done();
    v.ondurationchange = () => { if (isFinite(v.duration)) { v.ondurationchange = null; v.currentTime = 0; done(); } };
    v.currentTime = 1e6;
  };
  if (v.readyState >= 1) measure(); else v.onloadedmetadata = measure;
}));
await page.setViewportSize({ width: size.w, height: size.h });
const tiles = [];
for (const t of times) {
  await page.evaluate((s) => new Promise((resolve) => {
    const v = document.getElementById('v');
    v.onseeked = () => requestAnimationFrame(() => resolve());
    v.currentTime = s;
  }), Math.min(t, size.d - 0.05));
  tiles.push({ t, buf: await page.screenshot({ clip: { x: 0, y: 0, width: size.w, height: size.h } }) });
}
await browser.close();
server.close();

const tw = size.w > 800 ? 360 : 180, th = Math.round(tw * size.h / size.w), cols = size.w > 800 ? 4 : 7, pad = 8, label = 18;
const rows = Math.ceil(tiles.length / cols);
const layers = [];
for (let i = 0; i < tiles.length; i++) {
  const x = pad + (i % cols) * (tw + pad), y = pad + Math.floor(i / cols) * (th + label + pad);
  layers.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${label}"><text x="0" y="13" font-family="Arial" font-size="12" fill="#E2CFA6">${tiles[i].t.toFixed(1)} s (real time)</text></svg>`), left: x, top: y });
  layers.push({ input: await sharp(tiles[i].buf).resize(tw, th).toBuffer(), left: x, top: y + label });
}
await sharp({ create: { width: cols * (tw + pad) + pad, height: rows * (th + label + pad) + pad, channels: 3, background: '#1E1915' } })
  .composite(layers).jpeg({ quality: 80 }).toFile(output);
console.log(`${output} (${size.w}×${size.h}, ${size.d.toFixed(1)} s)`);
