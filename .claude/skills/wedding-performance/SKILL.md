---
name: wedding-performance
description: The performance constitution for Shaadi Saathi invitations opened on phones inside WhatsApp and Instagram — byte budgets with a per-file opening breakdown, loading order, image, font and audio delivery, animation cost rules, in-app browser constraints and how to measure, with common failure modes and concrete examples of what not to do. Use when adding assets, scripts, fonts, audio or animation to an invitation, and before calling any scene or phase finished.
---

# Wedding performance

Guests open invitations from a WhatsApp message on mid-range Android phones and mobile data, inside in-app
browsers. **A beautiful invitation that stutters or loads slowly is not finished.**

**Canonical sources:** `docs/mogra-moti/asset-plan.md` §6 (budgets and the opening breakdown),
`docs/mogra-moti/material-library.md` (per-file ceilings), `docs/mogra-moti/scene-architecture.md` §9.

---

## 1. Budgets (exceeding one is a failure)

| Budget | Limit |
|---|---|
| Opening payload before its first frame animates | **≤350 KB** transferred |
| GSAP core + ScrollTrigger + MotionPath, gzipped | ≈50 KB (the only third-party code) |
| Images per later scene | ≤400 KB, loaded one scene ahead |
| Whole page without music | ≤2.8 MB |
| Music | ≤1.2 MB, fetched only after the opening's assets decode |
| All sound effects | ≤150 KB |
| Largest Contentful Paint (mid-range phone, 4G) | ≤2.5 s |
| Cumulative Layout Shift | ≤0.05 |
| Interaction to Next Paint | ≤200 ms |
| Opening frame rate | 60 fps on a recent iPhone and a Pixel 6a-class Android; ≥45 fps on a budget Android |

**Opening breakdown (ceilings, total 348 KB):** paper texture 30 · deckled edge 12 · marble strip 20 · sheer fabric
40 · hero pearl 8 · strand pearls 3×4 · closed buds 4×8 · bloom-pass bud 20 · deboss layers + shadow-work sprite 24 ·
Imbue + Archivo subsets 60 · GSAP 50 · HTML/CSS/engine/scene JS 40. A new asset in the opening must displace
something from this list.

## 2. Loading rules

1. Inline the opening's critical CSS; `defer` every script in the documented order.
2. Preload the two fonts the opening needs, the paper texture and the hero pearl.
3. The opening waits (max 1.8 s, behind a dark first frame) for fonts and **every image it shows before or during
   the entry** — T01–T04, O01–O03, O06 — so nothing decodes mid-sequence.
4. Later scenes load one scene ahead (scene trigger with ~150% margin plus a throttled scroll-position fallback,
   because IntersectionObserver doesn't always fire).
5. Music is fetched after the opening assets decode; effects decode on the first tap.
6. No third-party requests from guests' phones except Google Maps and Calendar links they tap and the RSVP post.

## 3. Image rules

- AVIF first, WebP fallback, JPEG last for opaque photos; AVIF + WebP with alpha for cut-outs.
- `srcset` widths 480 / 780 / 1170 / 1600 with accurate `sizes`; explicit `width` and `height` on every image;
  16 px LQIP.
- `decode()` before revealing an image in an animation.
- Blur, grain, lighting and shadows are **pre-rendered**, never computed at runtime.
- No map `<iframe>` embeds; a link does the job.

## 4. Font rules

- Self-host subsetted variable WOFF2 (Latin; Devanagari subset to the glyphs actually used). **No Google Fonts
  request** from the invitation.
- Preload only the opening's fonts; `font-display: swap` for the rest.
- Fallback `@font-face` with `size-adjust` and ascent/descent overrides (Georgia for Imbue, Arial for Archivo).
- `font-synthesis: none`.

## 5. Animation cost rules

- Animate only `transform`, `opacity` and small masks.
- **Never animate** `filter`, `backdrop-filter`, `box-shadow`, width/height/top/left, or large `clip-path` /
  `mask-position` areas — use a translating wrapper with `overflow: hidden` for big wipes (the Draw is a translating
  sheet for this reason).
- `will-change` only while a tween runs.
- **No fixed full-screen blended overlays** (grain, vignettes with `mix-blend-mode`): they repaint on every scroll frame.
- Pause timelines outside the viewport and when the tab is hidden; ScrollTrigger `fastScrollEnd`.
- ≤8 animated layers in the opening; ≤3 moving at once (`wedding-motion`).
- Canvas only when essential; device-pixel ratio capped at 2; **no infinite full-viewport canvas loops** (the legacy
  Mogra & Moti ran one for the page's whole life).
- No smooth-scroll libraries; native scrolling.
- Build SVG paths once (or ship them as files); don't regenerate geometry on scroll or resize.

## 6. In-app browser and device rules

- `svh` for full-screen moments; ScrollTrigger `ignoreMobileResize` so the toolbar doesn't make pins jump.
- Audio unlocks only inside a tap; iPhone playback needs `navigator.audioSession.type = 'playback'` (already in
  `site/engine/sound.js`).
- `.ics` downloads, `backdrop-filter` and `100vh` behave differently in WhatsApp and Instagram — test there.
- The final check is a real phone opening the link from a WhatsApp message.

## 7. How to measure

Status: Playwright 1.63 with Chromium and sharp are installed (2026-09-17); `npm run assets:check` enforces per-file
ceilings and the opening's planned total. Page-level measurement (transfer sizes, Web Vitals, frame rate) is built
with the first scene in Phase 4. Until then, report page budgets as **unmeasured**, never as passing.

When it exists:
- **Transfer sizes:** Playwright network log of a cold load at 390×844, split into "before the first opening frame"
  and per scene.
- **Web Vitals:** `PerformanceObserver` for LCP, CLS and INP in a Playwright run with 4G throttling and 4× CPU slowdown.
- **Frame rate:** Playwright trace or `requestAnimationFrame` sampling across the opening, the entry and each Draw.
- Record numbers in the iteration's evaluation entry against §1.

## 8. Environment notes (this machine)

- Reload PATH from the registry before `node`/`npm` in a fresh shell.
- ffmpeg is not installed.
- The Browser preview pane never fires `requestAnimationFrame` or IntersectionObserver and freezes CSS transitions:
  it cannot measure motion or frame rate. Headless Edge screenshots are unreliable for rAF-driven states. Use
  Playwright's Chromium for timing work.

---

## 9. Common failure modes

| Failure | Symptom | Cause | Fix |
|---|---|---|---|
| Slow first frame | dark screen for 3+ s on 4G | full-size images or all fonts preloaded | hold to the opening breakdown; subset fonts |
| Mid-sequence stutter | the opening hitches when the fabric or bud appears | image decoding during the animation | include every entry image in the pre-decode set |
| Scroll jank | stutter on every scroll in dark scenes | a fixed blended grain or vignette | bake grain into files; remove the overlay |
| Layout shift | text jumps when fonts load | no fallback metrics | `size-adjust` fallbacks; wait for fonts in the opening |
| Pin jump | pinned scene jerks when the toolbar hides | `vh` units and resize refreshes | `svh`, `ignoreMobileResize` |
| Battery drain | phone warms while the page sits open | infinite canvas or ambient loops | pause off-screen and when hidden; no infinite canvases |
| Music competing with the opening | the first frame waits for a 1 MB MP3 | eager music fetch | `fetchAfter: 'opening'` |
| Heavy third party | long main-thread tasks on the venue | a Google Maps embed | a link instead |

## 10. What NOT to do (examples)

```html
<!-- ✗ Third-party font CSS in the invitation -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Imbue&display=swap">
<!-- ✗ An unprocessed original, no dimensions, eager -->
<img src="assets/p06-original.jpg">
<!-- ✗ A map embed -->
<iframe src="https://www.google.com/maps?q=Gandipet&output=embed"></iframe>
<!-- ✗ Every gallery photo loaded up front -->
<img src="g01-1600.jpg"><img src="g02-1600.jpg"> … <img src="g08-1600.jpg">
```

```css
/* ✗ A full-screen grain overlay */
.grain { position: fixed; inset: 0; background: url(grain.png); mix-blend-mode: multiply; pointer-events: none; }
/* ✗ Permanent will-change on everything */
* { will-change: transform; }
/* ✗ Animated filter and shadow */
.bud { transition: filter 1s, box-shadow 1s; }
/* ✗ Blur behind the fixed chrome */
.sample-mark { backdrop-filter: blur(8px); }
```

```js
// ✗ Canvas at full device-pixel ratio, running forever
canvas.width = innerWidth * devicePixelRatio;
(function loop() { draw(); requestAnimationFrame(loop); })();
// ✗ Music fetched with the page
fetch(details.music.src);
// ✗ Rebuilding SVG path strings on every scroll event
addEventListener('scroll', () => { thread.setAttribute('d', buildPath(scrollY)); });
```
