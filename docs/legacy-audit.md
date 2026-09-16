# Legacy audit

Phase 0. Audited 2026-09-16 at commit `b4996a7`.

Everything in `site/demo/` and the catalogue at `site/index.html` is **legacy work**: made before the
flagship's art-direction, motion and quality standards. None of it is deleted, redesigned or used as a
visual benchmark. This document separates what is worth keeping as engineering from what must not travel
into new work as design.

**Method.** Every file read in full. Each demo served locally and rendered in headless Edge inside a
390×844 frame: the cover before the tap, the first screen after opening (`?open`), and for the legacy Mogra
& Moti two mid-page frames (`?open&still`). Motion was assessed from code only — no recording tool works on
this machine yet (see `repository-audit.md` §13), so no motion claim below is "observed".

To reproduce the frames: serve `site/` on port 8123, then screenshot
`/_test/phone.html?src=/demo/<slug>/%3Fopen&y=<scroll>&wait=2500` with
`msedge --headless=new --window-size=500,860 --virtual-time-budget=7000 --screenshot=<file>`.

**Out of scope.** The two personal invitations (the friends' RSVP site and the family invite) are not in
this repository and must never be added to it — they carry real names, phone numbers and addresses. Their
proven techniques (gapless music loop, Apps Script POST from a static site, motion kept on reduced-motion
phones) already live in `site/engine/`.

---

## Summary

| | Haveli Jharokha | Mogra & Moti (legacy) | Premiere Night | Rang Mela | Catalogue |
|---|---|---|---|---|---|
| Visual quality | Legacy | Legacy | Legacy | Legacy | Legacy |
| Animation | Legacy | Legacy | Legacy | Legacy | — |
| Components | Refactor | Replace | Replace | Refactor | Replace |
| Data model | Reusable | Reusable | Reusable | Reusable | — |
| RSVP | Refactor | Refactor | Refactor | Refactor | — |
| Music | Reusable (unused) | Reusable (unused) | Reusable (unused) | Reusable (unused) | — |
| Performance | Needs review | Needs review | Needs review | Needs review | Needs review |
| Assets | Replace | Replace | Replace | Replace | — |
| Overall | Legacy reference | Legacy reference | Legacy reference | Legacy reference | Legacy reference |

The shared pattern across all four — and the reason none can be the benchmark:

> Every first screen after opening is the couple's names stacked and centred (`Name / & / Name`) over a
> date row, with one piece of flat vector art behind them and a saturated Instagram-gradient "Get this
> design" pill floating on top. Every section after that is a centred title, a centred lede and a bordered
> box, revealed by the same 24 px fade-up. The designs differ in palette and ornament; the page is the same
> template four times.

---

## 1. Mogra & Moti (legacy) — `site/demo/mogra-moti/`

The direct predecessor of the flagship, so it gets the closest look.

**Identity.** Rohan & Anaya (no surnames), Alibaug, 12–14 March 2027, Mehra and Bhatia families, five events.
English only. Italiana + Jost. Ivory `#F8F6F1`, pearl `#EFE7DE`, sage `#8CA38A`, blush `#E9C9C3`, gold `#C2A26B`.

| Area | Assessment |
|---|---|
| Visual quality | **Legacy.** Palette is calm and correctly restrained, but every element is flat vector clip-art. No photography, no material, no depth. |
| Animation | **Legacy.** Class-toggled CSS transitions, canvas petal shower, generic section fade-ups. |
| Components | **Replace.** Pearl curtain, bow, sprig and mandap SVG builders; bordered event cards on a rail. |
| Data model | **Reusable.** Standard `details.js`; fictional content must not be reused (different couple identity). |
| RSVP | **Refactor.** Engine form, restyled; event names would be dropped by the default `Code.gs` list. |
| Music | **Reusable.** Engine `sound.js`; `music: null`. |
| Performance | **Needs review.** Ambient canvas animates for the page's lifetime. |
| Assets | **Replace.** No raster assets; `og.jpg` referenced but missing. |
| Overall | **Legacy reference.** |

### What the frames show

- **Cover.** Twelve pearl strings render as evenly spaced vertical columns of identical dots running the full
  height of the screen. With no size variation, catenary, overlap or highlight, they read as a beaded door
  curtain or an abacus, not as pearls. The bow is an outlined flat shape laid over the strings; the strings
  don't interact with it. Names sit in a soft ivory pool at mid-height; the hint "tap to open your
  invitation" is `#9A7C46` on ivory, about 3.6:1 at 13.5 px, and pulses.
- **First screen after opening.** The top third is empty gradient. A flower arch built from roughly a hundred
  identical five-petal discs is cropped by both screen edges. The names are stacked and centred low, and the
  gradient "Get this design" pill covers the lower part of the arch — the loudest colour on the page.
- **Invitation card and countdown.** A white bordered box of centred text. Italiana's numerals make the
  countdown read as letters: `00` looks like `OO`, `177` is spindly.
- **Events.** Five identical white boxes, each ending in the same two outlined buttons, on a hairline with
  pearl nodes. This is the "collection of cards" the flagship brief rules out.

### Motion, from code

- Tap → `is-pressing` shrinks the bow 3% → 420 ms later `is-opening` starts everything at once: the bow's
  loops, tails and knot translate, rotate and fade over 1.5 s (0.25 s delay) while both curtains slide off
  over 2.2 s (0.45 s delay) (`theme.css:31-47`, `theme.js:9`). The pieces start within
  half a second of each other and move independently; nothing causes anything else.
- A canvas drops 45–90 five-ellipse "buds" for 5.4 s (`theme.js:99-123`), then 8 buds drift **forever**
  (`theme.js:124-153`), paused only when the tab is hidden.
- Names fade up with 0.3/0.5/0.9 s delays; every later block fades up 24 px.

### Indicative score on the flagship rubric

Static frames plus code reading; motion not recorded. For calibration only.

| Category | Score | Why |
|---|---|---|
| Art Direction | 7 / 20 | Right palette and restraint, wrong execution: clip-art flowers and dot-column pearls. |
| Image Quality | 1 / 15 | No images at all. |
| Opening Experience | 9 / 20 | There is a tap and a sequence, but no camera, no depth, no cause and effect. |
| Motion Design | 6 / 15 | Independent CSS transitions, a particle shower, generic fade-ups. |
| Typography | 5 / 10 | Italiana names are elegant; numerals fail; letter-spaced lowercase hints feel templated. |
| Composition | 3 / 10 | Everything centred; empty top third on the hero; stacked identical boxes. |
| Cultural Coherence | 3 / 5 | Mogra and pearls fit; the flower arch is generic. |
| Mobile Experience | 4 / 5 | Works and reads well; the sales pill covers art. |
| **Total** | **38 / 100** | Opening ≈ 4.5/10, Art Direction ≈ 3.5/10 against gates of 9 and 8.5. |

### Engineering worth keeping

- Scroll-position progress with a timer throttle instead of rAF (`theme.js:39-59`) — keeps working on
  battery-saver phones. The pattern is reusable; the rail is not.
- DPR capped at 2 for canvases, and loops paused while the tab is hidden (`theme.js:102`, `:138`).

---

## 2. Haveli Jharokha — `site/demo/haveli-jharokha/`

**Identity.** Vikram & Rajnandini, Udaipur, 5–7 February 2027, English + Hindi. Rozha One + Marcellus.
Dusk indigo, sandstone, peacock teal, antique gold.

| Area | Assessment |
|---|---|
| Visual quality | **Legacy.** The most accomplished illustration of the four (parametric cusped arch, jaali, mirror-work) but flat vector throughout. |
| Animation | **Legacy.** 3D-rotating shutters, window zoom, kites on CSS keyframes, tap sparkles, sky-to-night at the closing. |
| Components | **Refactor.** The arch-capped card is theme-specific; the day-marker logic is reusable. |
| Data model | **Reusable.** Best example of bilingual `{ en, hi }` content and honorifics. |
| RSVP | **Refactor.** Same engine issue; of its five RSVP events only "Reception" matches the default `Code.gs` list. |
| Music | **Reusable** (unused). |
| Performance | **Needs review.** Large inline SVG built at runtime; infinite keyframe loops on kites and windows. |
| Assets | **Replace.** Drawn palace placeholder for a painting that never arrived; `og.jpg` missing. |
| Overall | **Legacy reference.** |

Frames: on the cover, "Tap to open your invitation" sits directly on the jaali pattern beside the seal and
competes with it; the upper third above the eave is flat orange. The opened first screen is a silhouette
palace with lit windows under a dusk gradient — pleasant, and exactly the "royal palace" trope the flagship
must avoid. The sales pill sits on the lake.

Engineering worth keeping:
- Day markers derived from event dates (`theme.js:69-85`) — a data-driven "Day 1 / 2 / 3" grouping.
- Scroll watcher for scene state (`theme.js:114-135`), written without rAF/IO on purpose.
- Tap effects that ignore form controls and links (`theme.js:103-108`).
- Hindi typography handling (`theme.css:33`, font fallbacks per language button).

---

## 3. Premiere Night — `site/demo/premiere-night/`

**Identity.** Aditya & Kiara, Mumbai, 12–14 February 2027, English + Hindi. Limelight + Oswald. Black,
bulb gold, crimson velvet. Hosts are the Malhotra family — the same surname the flagship groom now has.

| Area | Assessment |
|---|---|
| Visual quality | **Legacy.** Theme-park cinema: striped-gradient curtain, bulb marquee, ticket. |
| Animation | **Legacy.** Bulb chase and flash, curtain lift, ticket tear, sweeping spotlights. |
| Components | **Replace.** Marquee, ticket, film strip are novelty pieces. |
| Data model | **Reusable.** `billing` per event is a good example of a theme-specific field. |
| RSVP | **Refactor.** Same engine issue. |
| Music | **Reusable** (unused). |
| Performance | **Needs review.** Blurred, continuously animated spotlight layers. |
| Assets | **Replace.** Film strip hidden because there are no stills; `og.jpg` missing. |
| Overall | **Legacy reference.** |

Frames: the cover works as a gag and is the most legible of the four. The opened first screen is almost
entirely black with a faint beam and centred gold names; the bottom 40% is empty apart from the sales pill.

Engineering worth keeping:
- Photos placed into SVG frames with `<image preserveAspectRatio="xMidYMid slice">` (`theme.js:34-50`).
- Hiding a section entirely when its data is empty rather than showing a broken frame (`theme.js:13-17`).

---

## 4. Rang Mela — `site/demo/rang-mela/`

**Identity.** Dev & Tara, Jaipur, 5–7 November 2027, Hinglish + Hindi. Caprasimo + Baloo 2. Marigold, pink,
green, sky on cream.

| Area | Assessment |
|---|---|
| Visual quality | **Legacy.** Playful sticker style; gulal drawn as large translucent ellipses; doodled couple. |
| Animation | **Legacy.** Scratch foil, confetti bursts, fluttering bunting. |
| Components | **Refactor.** Wardrobe rack and venue block are good content structures with the wrong look. |
| Data model | **Reusable.** Adds `note`, `colour`, `dressName` per event and a top-level `venue` object. |
| RSVP | **Refactor.** Same engine issue. |
| Music | **Reusable** (unused). |
| Performance | **Needs review.** Google Maps `<iframe>` embed (lazy) is the heaviest third-party load in the repo. |
| Assets | **Replace.** Gallery empty; `og.jpg` missing. |
| Overall | **Legacy reference.** |

Frames: on the cover the scratch card is clear and the mechanic reads instantly, but the "gulal" is a set of
pale overlapping ovals that look like a rendering fault. On the opened hero the bunting collides with the
"Sample" tag and the language switch at the top edge.

Engineering worth keeping:
- **Gating the opening behind an interaction** with capture-phase click and key blocking
  (`theme.js:50-75`) — a clean way to make "tap to enter" require a specific gesture.
- One `venue` object feeding both a map embed and an "Open live location" link (`theme.js:39-47`).
- `data-filter="dress"` to build a section from the subset of events that have a field.

---

## 5. Catalogue — `site/index.html`

Dusk-blue page, Rozha One + Marcellus, a list of bordered cards with colour swatches. Written for four demos
and "seven more". Legacy design; it will need a redesign once the flagship exists, and it currently lists the
legacy Mogra & Moti under the flagship's name.

| Area | Assessment |
|---|---|
| Visual quality | Legacy |
| Components | Replace |
| Performance | Needs review (render-blocking font CSS only) |
| Overall | Legacy reference |

---

## Never copy from legacy designs

Into the flagship, none of these — even where the flagship shares a word with them (ivory, pearl, sage, gold):

**Composition**
- The centred stacked `Name / & / Name` hero with a date row underneath.
- Centred title → centred lede → bordered box, repeated section after section.
- Identical event cards, each ending in the same pair of outlined buttons.
- Hairline timelines with nodes; hairline four-cell countdowns.
- A fixed saturated sales pill floating over artwork.

**Motion**
- The 24 px fade-up on every block (`engine.css:12-15`).
- Three-timeout class toggles as the opening model; parts that start together and move independently.
- Particle showers (canvas buds, confetti, sparkles) and infinite ambient loops.
- Pulsing "tap to open" hint text.

**Art**
- Dot-column pearl strings, the outlined silk bow, five-ellipse clip-art flowers, the flower-disc mandap arch.
- Flat silhouette scenes (palace, kites), marquee bulbs, ticket, doodled couple, ellipse "gulal".
- Any runtime-generated SVG as the primary imagery.

**Type and colour**
- Italiana + Jost (and Italiana numerals anywhere), Rozha One + Marcellus, Limelight + Oswald,
  Caprasimo + Baloo 2.
- Letter-spaced lowercase or uppercase hint lines as a default label style.
- Legacy hex tokens. The flagship's colours must be derived from its own photographed materials.

**Copy and identity**
- Legacy Mogra & Moti copy ("Come stand with us under the mogra", "The weekend", "Save us a seat?",
  "We'll see you by the water") and its Alibaug families and dates.

## Freeze policy for legacy work

1. No edits under `site/demo/`. Bugs found there (missing `og.jpg`, contrast, bunting collision) are recorded
   here and left alone unless you ask for a fix.
2. Before the first change to any file in `site/engine/`, capture all four demos (cover, opened, mid-page)
   with Playwright at 390×844. After every engine change, re-capture and compare; any visual difference in a
   legacy demo is a regression.
3. Engine changes are additive and opt-in, with legacy defaults unchanged.
4. The catalogue's handling of the two Mogra & Motis is your decision (hide the legacy card, relabel it, or
   leave it until the catalogue is redesigned).
