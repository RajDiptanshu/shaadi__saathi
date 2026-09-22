/* Turns a supplied audio file into an invitation loop for site/shared/audio/.

   What it does, and why each step is there:

     · strips the ID3 tag, because phone recordings and WhatsApp exports carry embedded album art that
       is often 60-200 KB of an image nobody will ever see;
     · finds and removes leading and trailing silence, because a loop with a second of nothing at the
       end audibly gaps every time it wraps;
     · fades the last half second into the restart;
     · encodes to MP3 under the 650 KB budget an invitation allows for audio.

   Usage:  node tools/audio-loop.mjs <input> <output-name> [maxSeconds]
   Example: node tools/audio-loop.mjs ~/Downloads/track.mp3 sai-pallavi-intro-amaran 90

   Remember to add the track to site/shared/audio/manifest.json, and be honest in
   `clearedForClientWork` — that field is the only thing standing between a favour for one couple and
   an unlicensed recording shipped to a paying client. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ffmpeg = (await import('ffmpeg-static')).default;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'site', 'shared', 'audio');

const [input, name, maxSeconds = '90'] = process.argv.slice(2);
if (!input || !name) {
  console.error('usage: node tools/audio-loop.mjs <input> <output-name> [maxSeconds]');
  process.exit(1);
}

const BUDGET_BYTES = 650 * 1024;
const tmp = path.join(outDir, `.${name}.tmp.mp3`);
const out = path.join(outDir, `${name}.mp3`);
fs.mkdirSync(outDir, { recursive: true });

/* ---- 1 · strip the ID3 tag (album art lives here) ------------------------------------------------ */
const raw = fs.readFileSync(input);
let start = 0;
if (raw.toString('latin1', 0, 3) === 'ID3') {
  const size = ((raw[6] & 0x7f) << 21) | ((raw[7] & 0x7f) << 14) | ((raw[8] & 0x7f) << 7) | (raw[9] & 0x7f);
  start = 10 + size + (raw[5] & 0x10 ? 10 : 0);
}
let end = raw.length;
if (raw.toString('latin1', end - 128, end - 125) === 'TAG') end -= 128;
fs.writeFileSync(tmp, raw.subarray(start, end));
console.log(`stripped tags: ${(raw.length / 1024).toFixed(0)} KB -> ${((end - start) / 1024).toFixed(0)} KB`);

/* ---- 2 · find the silence at each end ------------------------------------------------------------ */
const probe = execFileSync(ffmpeg,
  ['-hide_banner', '-nostats', '-i', tmp, '-af', 'silencedetect=noise=-45dB:d=0.25', '-f', 'null', '-'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).toString() +
  execFileSync(ffmpeg,
    ['-hide_banner', '-nostats', '-i', tmp, '-af', 'silencedetect=noise=-45dB:d=0.25', '-f', 'null', '-'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], }).toString();

const duration = Number(/Duration: (\d+):(\d+):([\d.]+)/.exec(probe)?.slice(1)
  .reduce((a, v, i) => a + Number(v) * [3600, 60, 1][i], 0) ?? 0);

/* Leading silence only counts when it starts at the very beginning. */
const firstStart = Number(/silence_start: ([\d.]+)/.exec(probe)?.[1] ?? NaN);
const firstEnd = Number(/silence_end: ([\d.]+)/.exec(probe)?.[1] ?? NaN);
const head = Number.isFinite(firstStart) && firstStart < 0.3 && Number.isFinite(firstEnd) ? firstEnd : 0;

/* Trailing silence is the last silence_start with no silence_end after it inside the file. */
const starts = [...probe.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
const lastStart = starts.length ? starts[starts.length - 1] : NaN;
const tail = Number.isFinite(lastStart) && duration - lastStart > 0.3 ? lastStart : duration;

const cap = Math.min(tail, head + Number(maxSeconds));
const length = Math.max(1, cap - head);
console.log(`duration ${duration.toFixed(1)}s -> keeping ${head.toFixed(2)}s to ${cap.toFixed(2)}s (${length.toFixed(1)}s)`);

/* ---- 3 · encode down until it fits the budget ---------------------------------------------------- */
let bitrate = 96;
for (;;) {
  execFileSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', tmp,
    '-ss', String(head), '-t', String(length),
    '-af', `afade=t=out:st=${Math.max(0, length - 0.5).toFixed(2)}:d=0.5`,
    '-codec:a', 'libmp3lame', '-b:a', `${bitrate}k`, '-joint_stereo', '1',
    '-write_xing', '1', '-id3v2_version', '0', out
  ], { stdio: ['ignore', 'ignore', 'inherit'] });

  const bytes = fs.statSync(out).size;
  console.log(`  ${bitrate} kbps -> ${(bytes / 1024).toFixed(0)} KB`);
  if (bytes <= BUDGET_BYTES || bitrate <= 64) {
    if (bytes > BUDGET_BYTES) console.warn(`  ! still over the ${BUDGET_BYTES / 1024} KB budget — shorten it`);
    break;
  }
  bitrate -= 8;
}

fs.rmSync(tmp, { force: true });
console.log(`wrote ${path.relative(root, out)}`);
console.log('now add it to site/shared/audio/manifest.json — and be honest about clearedForClientWork');
