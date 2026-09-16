# Repository audit

Phase 0 of the Shaadi Saathi flagship programme. Audited 2026-09-16 at commit `b4996a7` (`main`), on branch
`feature/mogra-moti`. Nothing in the product was changed to write this.

Method: every tracked file was read in full; the four demos were served locally and rendered at 390×844 in
headless Edge (cover and opened first screen, plus two mid-page frames of the legacy Mogra & Moti). Motion
was read from code, not recorded — see "Tooling constraints" for why that matters.

---

## 1. Snapshot

| | |
|---|---|
| Repository | `RajDiptanshu/shaadi__saathi`, public, one commit on `main` |
| Size | 37 files, 5,395 lines, 321 KB. No binaries: no images, no audio, no fonts. |
| Runtime | Static HTML + CSS + vanilla JS (ES5-style IIFEs on `window` globals). No build, no bundler, no modules. |
| Package manager | None. No `package.json`, no lockfile, no dependencies of any kind. |
| Tests | None. One manual iframe harness (`site/_test/phone.html`). |
| Deployment config | None. No `vercel.json`, no `.vercel/`, no `.vercelignore`. |
| Docs | `README.md` (engine contract), `research/launch-brief.html`, `research/reference-teardown.md` |

```
README.md                    engine contract and "new order" workflow
apps-script/Code.gs          RSVP collector for one couple's Google Sheet
research/                    competitor brief + mallikainvitestudio teardown
site/                        the deployable root
  index.html                 catalogue page listing the four demos
  _test/phone.html           390×844 iframe harness (README: delete before deploy)
  engine/                    shared runtime, 10 files, 1,206 lines
  demo/haveli-jharokha/      legacy invitation
  demo/mogra-moti/           legacy invitation  ← same slug and couple first names as the new flagship
  demo/premiere-night/       legacy invitation
  demo/rang-mela/            legacy invitation
```

---

## 2. Architecture

### Runtime model

Each invitation is one static page. Scripts load in a fixed order, all synchronous, at the end of `<body>`
(e.g. `site/demo/mogra-moti/index.html:140-149`):

```
details.js → engine/strings.js → engine/studio.js → engine/core.js → engine/events.js
→ [engine/scratch.js] → [engine/gallery.js] → engine/rsvp.js → engine/sound.js → engine/sales.js
→ <demo>/art.js → <demo>/theme.js
```

- `details.js` sets `window.INVITE` — the only per-couple file.
- `core.js` creates `window.Invite`: data, binding, language, opening, reveals, and a tiny event bus
  (`Invite.on/emit`, `core.js:22-32`).
- Every other engine file is an IIFE that reads `window.Invite` and subscribes to bus events.
- A theme is `art.js` (SVG strings built at runtime) + `theme.js` (wiring) + `theme.css` (all visual design).

Bus events: `render`, `lang`, `ready`, `open`, `opening`, `opened`, `reveal`, `scratching`, `scratched`, `rsvp`.

### Page contract (markup carries no wording)

Documented in `README.md:51-62` and implemented in `core.js:69-130`:
`data-t`, `data-date` + `data-format`, `data-attr`, `data-if`, `<template data-each data-filter>`,
`data-reveal`, `data-rsvp`, `data-countdown`/`data-count`, `data-map`, `data-calendar`, `data-scratch`,
`data-gallery`. Required element ids: `#cover`, `#invite`, `#open-invite`, `#sound-toggle`.

### Data model (`window.INVITE`)

`slug, design, sample, langs, couple{groom,bride,initials}, hosts, hostsLine, brideParents,
blessingsLabel, blessings, place, dates, countdownTo, countdownLabel, events[], rsvp{endpoint,maxGuests},
contacts[], closing, closingFrom, art{cover, gallery[]}, music{src,cue,loopStart,loopLength,delay}`, plus
free-form copy keys each theme invents (`kicker`, `tagline`, `ticketText`, `wardrobeTitle`…).

`events[]`: `id, name, start, end, venue{name,address,mapQuery}, dress, major, rsvp`, plus theme extras
(`billing`, `note`, `colour`, `dressName`). Any text may be `'string'` or `{ en, hi }`.

Assessment: a sound, small, genuinely reusable contract. Gaps for the flagship brief — no story chapters,
no per-image alt text or credit (`art.gallery` is an array of bare URLs), no venue imagery, no monogram
asset, no sound-effect cues, no link to an asset manifest, no validation of any kind.

### URL modes (`core.js:8-20`, `README.md:64-67`)

`?open` skips the opening; `?still` shows everything at once; `?lang=hi`; `?card=1..5` and `?og` for share
images. **`?card` and `?og` only add classes (`card-mode`, `og-mode`); no theme styles them**, so share-image
rendering inherited from the family invite is not implemented in any demo.

---

## 3. Engine, file by file

| File | Lines | What it does | Verdict |
|---|---|---|---|
| `core.js` | 250 | binding, i18n, dates in IST, opening state machine, reveals, URL modes, keyboard open | **Reuse** binding/i18n/bus/URL modes. **Replace** opening timing and reveal language for the flagship. |
| `events.js` | 103 | countdown, Google Calendar link / `.ics` data URI on Apple, Maps search link | **Reuse** as is. |
| `rsvp.js` | 226 | builds the form, validates, remembers the reply, posts to Apps Script, simulates on non-https | **Reuse** logic; **refactor** so markup/visual structure can be supplied by a theme. |
| `sound.js` | 189 | fetch before tap, decode after tap, gapless Web Audio loop, fade in, mute memory, pause when hidden, iOS playback session | **Reuse**; **extend** with an SFX bus and a closing fade-out. |
| `gallery.js` | 97 | swipe strip + dots + full-screen viewer | **Replace** visually; keep only the viewer's keyboard handling as reference. |
| `scratch.js` | 150 | canvas foil rubbed away by pointer, reveal button fallback | **Reuse** only if a design calls for it. Not planned for Mogra & Moti. |
| `sales.js` | 41 | "Sample" tag + "Get this design" pill (Instagram or WhatsApp) | **Reuse** the logic; **redesign** the pill for the flagship. |
| `strings.js` | 49 | interface words, en + hi | **Reuse**. |
| `studio.js` | 8 | studio name / Instagram / WhatsApp | **Reuse** (name and WhatsApp still empty). |
| `engine.css` | 93 | shared behaviour styles: reveal fade-up, cover button, controls, RSVP/gallery/scratch mechanics | **Split**: keep mechanics, drop the reveal look from the flagship. |

### `core.js` — details that matter for a cinematic opening

- **The opening is three `setTimeout` class toggles** (`core.js:156-173`): `is-pressing` →
  `is-opening` at `timing.press` → `is-open` at `timing.open` → cover hidden at `timing.done`. Themes animate
  with CSS transitions keyed to those classes. It cannot be sequenced, scrubbed, paused, synced to audio,
  or seeked for a screenshot. A title sequence needs a real timeline.
- **Reveals are one look for everything**: IntersectionObserver adds `is-in`, and `engine.css:13-15`
  fades each block up 24 px. This is precisely the "every section fades upward" pattern the brief bans.
- **Reveals ignore reduced motion by design** (`core.js:176`, `engine.css:15` only drops the rise). This
  follows a standing instruction from the user (their own phone has reduced motion on, and a static invite
  was reported as broken). The flagship brief asks to *respect* reduced motion. See Risks — this needs a
  decision.
- **Re-rendering rebuilds repeated nodes** (`core.js:84` removes `[data-from]` copies, `setLang` re-renders
  the body). Any tween or ScrollTrigger attached to a templated node is orphaned on a language switch.
  Motion code must initialise after `render` and rebind on it.
- **`Escape` opens the invitation** (`core.js:239`), and the key listener lives on `document` for the page's
  lifetime. Odd but harmless; worth fixing when the opening is touched.
- The cover is a full-screen `<button>` with an sr-only label, `#invite` is `inert` until opened, and focus
  goes to the button — a good accessible baseline to keep.

### `rsvp.js` + `apps-script/Code.gs`

Flow: form → validation → `fetch(endpoint, { method: 'POST', body: JSON })` as `text/plain` (no CORS
preflight) → Apps Script `doPost` → row upsert by reply id under a script lock → `{ ok: true }`. The same
pattern has been proven end to end on the user's own live wedding site (outside this repo).

Strengths: replies are upserted (a guest can change their answer), `clean_` defuses formula injection
(`Code.gs:96-100`), guests are clamped server-side, sends are simulated on non-https and on claude hosts
(`rsvp.js:17`), the last reply is remembered and restored (`rsvp.js:215-225`), errors are announced with
`role="alert"`.

Problems:

1. **Silent data loss on name mismatch.** The client sends English event *names* (`rsvp.js:178`); the
   server keeps only names that exactly match its hard-coded `EVENTS` list (`Code.gs:14`, `:71-73`). Against
   the default list, four of the legacy Mogra & Moti's five names ("Mehendi lunch", "Sangeet", "Haldi by the
   pool", "The wedding") would be dropped — only "Reception" matches — while the guest still sees "saved".
   Match on `id`, not display name.
2. The markup is a fixed string inside the engine (`rsvp.js:24-67`), so a theme can restyle but not
   recompose it. An RSVP that "feels like part of the invitation" needs theme-supplied structure.
3. Header comment points to `engine/apps-script/Code.gs`; the file is at `apps-script/Code.gs` (`rsvp.js:5`).
4. No `doGet`, no rate limiting, no honeypot. Acceptable for invite-sized traffic; note for production.
5. Every demo ships `endpoint: ''`, so nothing in this repo has ever posted to a real sheet.

### `sound.js`

The strongest engineering in the repo, ported from the family invite: bytes fetched while the cover shows
(`:44-51`), context created inside the tap (`:135-154`), gapless loop via `loopStart/loopLength`, 3 s gain
ramp in (`:120`), 0.4 s ramp out on mute (`:124-132`), suspend when hidden (`:183-188`),
`navigator.audioSession.type = 'playback'` for iPhones on silent (`:53`), element fallback. It never
autoplays before interaction — compliant with the brief. Missing for the brief: separate interaction-sound
channel (pearl, silk), a scored ending fade at the closing scene, and an accessible label that states the
current state (it relies on `aria-pressed` + "Music").

### `gallery.js`

`<img alt="">` for every photo (`:27`, `:66`) — no alt text is possible with the current data model. The
viewer is `role="dialog"` but has no focus trap, and "Previous"/"Next" are English-only (`:65-67`).

### `events.js`

Reusable as is. The Apple branch uses a `data:text/calendar` link with `download` (`:85-88`), which works on
iOS Safari but should be checked inside the WhatsApp and Instagram in-app browsers, where most guests open
invitations.

---

## 4. Styling system

- No shared tokens. Each theme defines its own `:root` custom properties; `engine.css` holds behaviour only.
- Fonts come from Google Fonts CSS (`display=swap`), one request per page, not preloaded, not self-hosted.
- Layout is single-column and centred at every width; desktop gets a two-column list at ≥900 px at most.
- No texture system: paper, grain and material are absent except a data-URI noise tile in Premiere Night.

---

## 5. Animation utilities

There are none as a system. What exists is per-theme:

| Mechanism | Where | Notes |
|---|---|---|
| CSS transitions on state classes | all themes | the whole opening vocabulary |
| CSS keyframe loops | all themes | sways, twinkles, bulb chases, hint pulses |
| Canvas particles on `requestAnimationFrame` | legacy Mogra & Moti `theme.js:99-153` | an ambient loop that runs for the page's whole life at up to 30 fps |
| Scroll-position progress, throttled with timers | Mogra rail `theme.js:39-59`, Haveli night `theme.js:114-135` | written this way because rAF/IO don't run in the preview pane |
| Transient DOM particles | Haveli sparkle, Rang Mela confetti | |

No GSAP, no timeline, no scroll-linked scene system, no parallax, no masking, no depth layers, no easing
tokens beyond one `--ease`.

---

## 6. Assets

- **There are no raster assets in the repository.** All artwork is SVG markup built at runtime in `art.js`.
- `art.cover` and `art.gallery` exist in the data model but are empty in every demo.
- **All four pages reference `og.jpg`, which does not exist**, and as a relative URL
  (`<meta property="og:image" content="og.jpg">`, line 12 of each `index.html`). WhatsApp and Instagram need
  an absolute URL, so every share preview is currently broken.
- No image pipeline (resizing, AVIF/WebP, blur placeholders), no licence records, no manifest.
- `music: null` everywhere; no audio has been chosen.

---

## 7. Tests and QA

- No automated tests, no lint, no type checks, no CI.
- `site/_test/phone.html` scrolls a 390×844 iframe to `?y=`; it lives inside the deploy root.
- `README.md:74` runs `node serve.js`, which is not in the repository.

---

## 8. Deployment

- The plan (README and project notes) is a static Vercel project with `site/` as the root.
- Nothing here configures it, and live state could not be verified: the Vercel connector in this session is
  not linked to the owner's account (`list_teams` returns none). Treat as **not deployed**.
- If deployed as is: `_test/` ships publicly, share previews are broken, there are no cache headers, and URLs
  keep the trailing `index.html` structure (fine).

---

## 9. Dependencies

None at runtime or build time. External services at runtime: Google Fonts, Google Maps (links, and one
`<iframe>` embed in Rang Mela), Google Apps Script (RSVP), Instagram/WhatsApp deep links.

---

## 10. Accessibility baseline

Good: semantic sections with labelled headings, full-screen cover button with sr-only name, `inert` main
until opened, `lang` attribute switching, `aria-pressed` language and music toggles, RSVP errors tied with
`aria-describedby`, `role="alert"` send errors, 44 px+ targets, visible `:focus-visible` rings.

Gaps: gallery images without alt text; viewer without focus trap; decorative low-contrast hint text (legacy
Mogra & Moti "tap to open your invitation" is `#9A7C46` on `#F8F6F1`, about 3.6:1 at 13.5 px, below AA);
reduced motion not honoured (by instruction — see Risks).

---

## 11. Performance baseline

Good: tiny payloads, no framework, no images, no blocking third-party JS.

Weak: font CSS is render-blocking; SVG art is generated by JS after load, so the first paint of the cover
waits for scripts; legacy Mogra & Moti keeps a full-viewport canvas animating forever; no lazy-loading
strategy exists because there are no images yet. None of this was measured — there is no Lighthouse or
Web Vitals tooling in the repo.

---

## 12. Security and privacy

- Guest input only ever reaches the DOM through `textContent`; `data-html` and gallery `innerHTML` only
  interpolate studio-authored `details.js` values. No XSS path from guests found.
- Formula injection in Sheets is handled (`Code.gs:96-100`).
- Every demo is fictional; contact numbers are masked (`+91 98200 •••••`). No personal data in the repo.
- The repository is public: never commit a real couple's `details.js`, sheet URLs or phone numbers here.

---

## 13. Tooling constraints on this machine

These shape Phases 3 and 6 more than any code does.

| Constraint | Effect |
|---|---|
| Node 24 and Git 2.55 installed; no `node`/`npm` on PATH in fresh shells until PATH is reloaded from the registry | every Node command must reload PATH first |
| **No ffmpeg** | no video transcoding or frame extraction from recordings |
| **Playwright browsers not installed**; the Playwright MCP server failed to connect this session | no recorded evaluation loop exists yet |
| Headless Edge and Chrome present | static screenshots work (used for this audit) |
| The Browser pane never fires `requestAnimationFrame` or IntersectionObserver, and freezes CSS transitions at t=0 (verified in earlier sessions) | GSAP-driven motion will look frozen there; it cannot be the evaluation surface |
| Headless Edge screenshots can't be trusted for rAF/observer-driven states | same |
| No text-to-image generation reachable (Higgsfield connector exposes no generation tools; Adobe tools only edit) | environment artwork for the demo is blocked unless that changes |
| Vercel connector not linked to the account | deployment must be checked by the user or through their browser |

---

## 14. Reuse, isolate, replace

### Reuse (shared engineering)

- `core.js` binding, i18n, IST date formatting, event bus, URL modes, `inert` cover handling
- `events.js` countdown, calendar, maps
- `rsvp.js` validation, persistence, submission, upsert id, simulated preview mode
- `apps-script/Code.gs` sheet setup, upsert, lock, formula guard, Excel link
- `sound.js` tap-unlock, gapless loop, fades, visibility and iOS handling
- `strings.js`, `studio.js`, `sales.js` logic (Sample tag is required — the flagship is a demo)
- `details.js` single-file-per-couple principle

### Refactor before the flagship depends on it

- RSVP: match events by `id` on both ends; let a theme supply the form structure.
- Data model: additive fields — story chapters, image objects `{ src, alt, credit, focal }`, venue image,
  monogram, SFX cues, manifest path — keeping string-array `gallery` working for legacy demos.
- `core.js` opening: an opt-in hook so a theme can own the opening sequence (a timeline) while the default
  class-timeout path stays byte-for-byte the same for legacy demos.
- `sound.js`: SFX channel and a closing fade.

### Isolate

- `site/demo/*` — frozen legacy. No edits.
- `site/index.html` — legacy catalogue design.
- `site/_test/` — move out of the deploy root with the new test tooling.
- `research/` — reference material, not product.

### Replace for the flagship (do not extend)

- Reveal language (`engine.css:12-15`) and the three-timeout opening as the motion model
- Every theme's layout, typography, palette, art and copy
- `gallery.js` presentation
- Sales pill styling
- The runtime-generated-SVG-only asset approach (the flagship needs real photography and texture)

---

## 15. Recommended integration architecture

Keep the static, no-framework runtime. It is fast, easy to copy per order, and nothing in the brief needs
React: an invitation is one linear, art-directed page, not an app. Add tooling around it, not a framework
inside it.

```
package.json                      dev tooling only — nothing it installs ships to guests
tools/
  serve.js                        local static server
  capture/                        Playwright: screenshots, videos, frame seeking at 4 viewports
  images/                         sharp: AVIF/WebP/JPEG sizes, blur placeholders, manifest checks
tests/                            Playwright specs: opening, RSVP, music, a11y, legacy regression
docs/                             audits, creative direction, evaluations
.claude/skills/wedding-*/         project skills (Phase 2)
site/                             Vercel root
  vendor/gsap/<pinned version>/   gsap.min.js + ScrollTrigger (+ SplitText if typography needs it)
  engine/                         existing files, additive and backwards-compatible changes only
    motion/                       new primitives: timeline registry + seek hook, scene, parallax layer,
                                  mask reveal, material layer, image frame, editorial type, motion policy
  demo/<slug>/                    legacy, frozen
  invitations/mogra-moti/         the flagship
    index.html  details.js  scenes/  styles/
    assets/  assets/manifest.json
```

Principles:

1. **A new namespace, not a new version of the old folder.** `site/demo/mogra-moti/` stays untouched; the
   flagship lives at `site/invitations/mogra-moti/`. The brief's `site/assets/mogra-moti/assets/manifest.json`
   becomes `site/invitations/mogra-moti/assets/manifest.json`, next to the files it describes.
2. **Engine changes are opt-in.** Legacy demos must render identically after any engine change, proven by a
   Playwright regression capture of all four demos taken before the first engine edit.
3. **Every timeline is seekable.** Scenes register their timelines; a test-only hook (`?t=` / `window.__motion`)
   seeks to any moment. That makes the evaluation loop deterministic: frame N of the opening can be
   screenshotted exactly, without relying on video or ffmpeg.
4. **One motion policy object** decides reduced-motion behaviour, pauses on hidden tabs, and handles `?still`
   — no motion logic scattered through themes.
5. **Plain scripts, GSAP as a pinned vendored UMD file.** Consistent with the existing engine, no bundler, no
   CDN dependency at runtime. Types via JSDoc + `tsc --checkJs --noEmit` in tooling if wanted, rather than
   a TypeScript build.
6. **Images through a pipeline, recorded in a manifest**: every asset gets source, creator, licence, usage
   and a replace-before-launch flag, and CI-style checks fail on unlisted files.

---

## 16. Risks and open decisions

| # | Risk | Severity | Recommendation |
|---|---|---|---|
| 1 | **Slug and identity collision.** Legacy `demo/mogra-moti` already shows "Rohan & Anaya · Mogra & Moti" (12–14 March 2027, Alibaug, Mehra and Bhatia families); the flagship is Rohan Malhotra & Anaya Kapoor, 15 Feb 2027. Two different invitations with the same name and couple will confuse the catalogue and buyers. | High | New path `site/invitations/mogra-moti/`. Decide whether the catalogue hides the legacy one or labels it; editing `site/index.html` touches legacy, so it needs your call. |
| 2 | **Reduced motion.** Your standing instruction is to keep invitation motion running on phones with reduced motion on; the brief says respect it. | High | Proposed policy: with reduced motion, keep the opening choreography, material shimmer and scene transitions, but shorten them and remove camera push, parallax, drift and scroll-linked movement. Needs your confirmation. |
| 3 | **Photography of people.** Free stock (Pexels, Unsplash, Pixabay) comes without model releases, and a sales demo that presents strangers as "Rohan & Anaya" implies they endorse the service. A consistent couple across 10+ editorial shots rarely exists on free sites. | High | Default to a faces-light editorial story (hands, mehendi, fabric, jewellery, flowers, venues, figures from behind or out of focus), mark any identifiable person "replace before commercial launch", or buy one released stock series. |
| 4 | **No image generation available** for environment art (silk, florals, venue). | High | Photograph-led art direction plus CSS/SVG material layers; revisit if a generation tool becomes reachable. |
| 5 | **Evaluation loop has no working recorder.** Playwright not installed, its MCP server not connecting, no ffmpeg, preview pane freezes rAF. | High | Phase 3 installs `@playwright/test` + Chromium (~150 MB download) and builds seekable-timeline captures. Needs your OK for the download. |
| 6 | **RSVP names vs ids** — silent loss of celebration choices. | Medium | Fix in Phase 4 before the flagship form exists; keep Code.gs backwards compatible. |
| 7 | **Engine changes regressing legacy demos.** | Medium | Regression captures first; opt-in hooks only. |
| 8 | **GSAP licence.** GSAP is free to use, but its no-charge licence restricts use in products that compete with Webflow's visual builder. Fine for studio-made invitations; read it before ever building a self-serve editor. | Medium | Record the licence in the asset/dependency manifest. |
| 9 | **In-app browsers.** Guests open links inside WhatsApp and Instagram, where audio unlock, `100svh`, `backdrop-filter` and `.ics` downloads behave differently. | Medium | Add in-app browser checks to QA; test on a real phone before any "done". |
| 10 | **Music licensing.** No track chosen; Pixabay downloads need your approval in your own browser. | Medium | Pick in Phase 3 with a manifest entry. |
| 11 | **Premium type.** The best editorial serifs are paid web licences; Google Fonts options are safe but common. | Low | Decide in Phase 1 with specimens; self-host whichever is chosen. |
| 12 | **Binary growth in a public repo** from evaluation screenshots and videos over five iterations. | Low | Commit compressed stills and contact sheets to `docs/`; keep raw video out of git. |
| 13 | **Public repo** — a real couple's details must never land here. | Low now | Keep real orders in a private repo or private deployment. |
| 14 | Share previews broken on all legacy pages (`og.jpg` missing, relative URL). | Low (legacy) | Not fixed under the freeze; the flagship gets absolute OG images from day one. |
| 15 | Missing content for the flagship: city and venues, dates of Mehendi/Sangeet/Reception, families' names, story copy. | — | Phase 1 question list with defaults. |

---

## 17. Next phase

Phase 1 — creative direction, which produces `creative-concept.md`, `visual-dna.md`, `animation-storyboard.md`,
`typography-system.md`, `material-library.md`, `asset-plan.md` and `scene-architecture.md`, with a question
list for the content gaps and decisions 1–3 above before anything is built.
