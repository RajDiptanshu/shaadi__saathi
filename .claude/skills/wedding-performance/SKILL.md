---
name: wedding-performance
description: Performance budgets and rules for Shaadi Saathi invitations opened on phones inside WhatsApp and Instagram — byte budgets, loading order, image, font and audio delivery, animation cost, and how to measure. Use when adding assets, scripts, fonts, audio or animation to an invitation, and before declaring any scene or phase finished.
---

# Wedding performance

Guests open invitations from WhatsApp and Instagram, on mid-range Android phones and mobile data, inside
in-app browsers. **A beautiful invitation that stutters or loads slowly is not finished.**

## 1. Budgets (fail the work if exceeded)

| Budget | Limit |
|---|---|
| Opening payload before its first frame animates (HTML, CSS, engine + scene JS, GSAP, fonts, first-frame images) | ≤350 KB transferred |
| GSAP core + ScrollTrigger + MotionPath, gzipped | ≈50 KB (the only third-party code) |
| Images per later scene | ≤400 KB, lazy, loaded one scene ahead |
| Whole page without music | ≤2.8 MB |
| Music | ≤1.2 MB, fetched only after the opening's assets decode |
| All sound effects | ≤150 KB |
| Largest Contentful Paint (mid-range phone, 4G) | ≤2.5 s |
| Cumulative Layout Shift | ≤0.05 |
| Interaction to Next Paint | ≤200 ms |
| Opening frame rate | 60 fps on a recent iPhone and a Pixel 6a-class Android; ≥45 fps on a budget Android |

## 2. Loading order

1. Inline the opening's critical CSS; `defer` all scripts in the documented order.
2. Preload the two fonts the opening needs and the first-frame paper texture and hero object.
3. The opening timeline waits for fonts and first-frame images to decode (max 1.8 s) behind a dark first
   frame, so the wait is invisible and nothing reflows mid-reveal.
4. Later scenes load one scene ahead (scene trigger with ~150% margin, plus a throttled scroll-position
   fallback — IntersectionObserver doesn't always fire).
5. Music is fetched after the opening assets have decoded; sound effects decode on the first tap.

## 3. Images

- AVIF first, WebP fallback, JPEG last for opaque photos; AVIF + WebP with alpha for cut-outs.
- `srcset` widths 480/780/1170/1600 with accurate `sizes`; explicit `width`/`height` (or aspect-ratio) on every
  image; 16 px LQIP placeholders.
- `decode()` images before revealing them in an animation.
- No runtime blur, grain or lighting: pre-render in the pipeline.
- Originals never ship.

## 4. Fonts

- Self-host subsetted variable WOFF2 (Latin set; Devanagari subset to the glyphs actually used). No Google Fonts
  request from guests' phones.
- `font-display: swap` except fonts the opening waits for explicitly.
- Fallback `@font-face` with `size-adjust` and ascent/descent overrides to keep layout shift near zero.
- `font-synthesis: none`.

## 5. Animation cost

- Animate only `transform`, `opacity` and small masks. Never animate `filter`, `backdrop-filter`, `box-shadow`,
  width/height/top/left, or large `clip-path`/`mask-position` areas (use a translating wrapper with
  `overflow: hidden` instead).
- `will-change` only while a tween runs.
- **No fixed full-screen blended overlays** (grain, vignettes with `mix-blend-mode`) — they repaint on every
  scroll frame.
- Pause timelines outside the viewport and when the tab is hidden; ScrollTrigger `fastScrollEnd`.
- ≤8 animated layers in the opening; ≤3 moving at once.
- Canvas only when necessary; cap device pixel ratio at 2; no infinite full-viewport canvas loops (the legacy
  Mogra & Moti did this — don't repeat it).
- No smooth-scroll libraries; native scrolling.

## 6. In-app browsers and devices

- Use `svh` for full-screen moments (the WhatsApp/Instagram toolbar resizes the viewport).
- Audio unlocks only inside a tap; iPhone playback needs `navigator.audioSession.type = 'playback'` (already in
  `site/engine/sound.js`).
- `.ics` downloads and `backdrop-filter` behave differently in in-app browsers — test calendar links there.
- The final check is always a real phone opened from a WhatsApp message.

## 7. How to measure

Status: measurement tooling is created in Phase 3 (Playwright under `tests/` and `tools/capture/`). Until then,
don't claim a budget passes — say it is unmeasured.

When tooling exists:
- Transfer sizes: Playwright network log of a cold load at 390×844, grouped by "before first opening frame" and
  per scene.
- Web Vitals: `PerformanceObserver` for LCP/CLS/INP injected in a Playwright run with 4G throttling and 4× CPU
  slowdown.
- Frame rate: Playwright trace (or `requestAnimationFrame` sampling) across the opening and each Draw.
- Record the numbers in the scene's evaluation entry; compare against §1.

## 8. Environment notes (this machine)

- Reload PATH from the registry before any `node`/`npm` command in a fresh shell.
- No ffmpeg installed.
- The Browser preview pane never fires `requestAnimationFrame`/IntersectionObserver and freezes CSS transitions,
  so it cannot measure motion; headless Edge screenshots are unreliable for rAF-driven states. Use Playwright's
  Chromium for anything timing-related.
