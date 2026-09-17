# Mogra & Moti — design evaluation

Phase 3.5 hero gate: Scene 01 Opening and the Draw into Scene 02 Welcome only. Scored with
`wedding-design-evaluation` (100 points; gates Opening ≥18/20, Art ≥17/20, Image ≥13/15, Motion ≥13/15, zero P0).
Every score comes from rendered frames that were opened and looked at.

**How the evidence is made:** `node tools/capture/opening.mjs --iter <n>` serves `site/`, opens the page in
Playwright Chromium with `?test`, seeks the `opening` and `entry` timelines to exact times, and saves stills,
contact sheets, real-time recordings with a tap, and `performance.json`. Evidence lives in `qa/iteration-NN/`
(recordings are kept locally and out of git).

**Opening order under test (Phase 3.5 brief):** near-darkness → morning light finds the paper → the blind deboss
appears → a pearl rolls in → the champagne silk thread responds → the thread draws the pearl and strand across →
the names are set by light → mogra becomes visible → the guest's touch → the thread draws the Welcome sheet up
(The Draw).

---

## Iteration 1 — 2026-09-17

**Captures:** `qa/iteration-01/` — `sheet-phone-normal.jpg`, `sheet-phone-reduced.jpg`, `sheet-desktop-normal.jpg`,
`sheet-desktop-reduced.jpg`, 48 stills (`<viewport>-<mode>-<timeline>-<t>.jpg`), `performance.json`; recordings
`recording-phone-normal.webm`, `recording-phone-reduced.webm`, `recording-desktop-normal.webm` (local only).

**Build:** in-house seekable timeline (no GSAP — not approved for download), engine `core.js` unchanged for binding,
new primitives in `site/engine/motion/` (policy, timeline, media, paper, thread, reveal), scenes in
`site/invitations/mogra-moti/scenes/`. Assets: T01 paper tile, T03 marble, O01 hero pearl, O02 strand pearls,
O03 buds (rebuilt twice, see the image gate below), V02 monogram, P01 hands, fonts subset to WOFF2.

| Category | Score | Reason (with frame and viewport) |
|---|---|---|
| Art Direction | 14/20 | Phone t=6.5 s: an unmistakable still life — deckled cotton card on marble, blind R·A with a foil knot, masthead names held apart by a champagne thread with a real pearl. Desktop t=6.5 s is a generic hero: 220 px names float in a full-bleed paper field, the monogram is a speck, and the thread sags into a hockey-stick curve. |
| Image Quality | 11/15 | Pearls are real nacre with orient and read beautifully at 20 px (phone t=6.5 s, zoom). Paper fibre is subtle and believable. The marble strip at the top reads blue-grey and busy. The buds at the strand's tail read as grey pebbles, not mogra (phone t=5.6 s). P01 is authentic but its orange market light sits outside the dawn palette (tap +2.2 s). |
| Opening Experience | 12/20 | The order is right and every beat has a cause, but: a stray letter "A" is visible from t=1.5 s long before any name (P0); t=2.5–3.6 s is dead time — the pearl rolls about 40 px at the far lower left on a slack thread that barely registers; and at tap +1.15 s the entry reads as a flat panel sliding up with a faint line above it, not a thread drawing a sheet (P0). |
| Motion Design | 10/15 | Tokens and ≤3 movers are respected; names are lit, never faded up; the reduced cut keeps the story (phone reduced 0.5–2.75 s). Marked down for the premature glyph, the tiny roll, and an entry whose motion curve and silhouette match a UI sheet. |
| Typography | 8/10 | Imbue masthead with Archivo surnames is precise on the phone; KAPOOR now clears the y's descender. Desktop names are undersized for the frame; the Welcome title works at 44 px. |
| Composition | 7/10 | Phone frames are composed on the diagonal with the facts low left in the thumb zone. Desktop is an empty field; the phone's lower card (y 75–82%) is slightly empty. |
| Cultural Coherence | 4/5 | *Moti pirona* is shown, not decorated: pearls and mogra strung on silk, hands stringing jasmine, a Devanagari chapter numeral. The buds don't yet read as mogra at their size. |
| Mobile Experience | 4/5 | Everything important sits above the fold at 390×844; the whole cover is the button; tap feedback measured at 59 ms; 393/412 widths not yet captured. |
| **Total** | **70/100** | Gates: Opening ✗ (12) · Art ✗ (14) · Image ✗ (11) · Motion ✗ (10) · P0 count 2 |

**P0**
1. Stray glyph: the weave's copy of "A" is visible from t≈1.5 s in every viewport and mode (both sheets), before
   the names are lit.
2. Entry reads as a conventional section change: tap +1.15 s (phone and desktop), the sheet's top edge is a straight
   horizontal line and the pulling thread is a faint separate diagonal, so the cause of the movement isn't legible.

**P1:** dead time and a weak pearl entrance (t 2.5–3.6 s); desktop composition; buds read grey; marble reads cold.
**P2:** a gold focus frame drew around the whole screen because the cover button was focused programmatically on
load (the frame was replaced by an underline on the hint during capture review; in iteration 2 the programmatic
focus was removed, so the underline appears only for keyboard users).

**Performance (phone, DPR 3, CPU ×4):** opening transfer ≈135 KB (images 60, fonts 48, gzipped text 27) against
350 KB; LCP 708 ms; CLS 0; 685 frames, median 16.7 ms, p95 16.7 ms, none over 34 ms; tap feedback 59 ms; P01
(15 KB) fetched during the opening so it is decoded before the Draw; no video.

**Top 3 problems**
1. All viewports, t 1.5–4.0 s — a black "A" diagonal floats on the empty card because the weave overlay (a clipped
   copy of Anaya's first letter drawn above the thread) was never given the set-by-light mask its word uses.
2. Phone and desktop, tap +0.6–1.6 s — the Draw looks like a panel sliding up because the sheet's edge stays
   straight and level, the thread's attachment to it is invisible, and nothing about the edge says paper being
   pulled from one corner.
3. Phone, t 2.5–3.6 s — nothing holds attention: the pearl enters 1 cm from the left edge and stops almost
   immediately on a slack thread lying in the card's darkest corner, so "a pearl rolls in" isn't seen.

**Changes made** (for iteration 2)
- Weave overlay joins the set-by-light system (masked with its word's geometry).
- The Draw is re-shaped around the thread: the sheet's held corner leads (its top edge rises toward the pull), the
  attachment carries a knot at the corner, the edge gets a lit deckle rim and contact shade, and the thread stays
  visibly continuous from the corner to the pull.
- The pearl's entrance becomes a real roll: it enters from the right edge, crosses the lit card along the slack
  thread and settles; its stop tightens the thread; the pull then draws it and the strand to the gap.

**New score after re-render:** see iteration 2.

---

## Iteration 2 — 2026-09-17

**Captures:** `qa/iteration-02/` — four contact sheets, 48 stills, `performance.json`, three recordings (local only).

**Changes rendered:** weave overlay masked with its word (the stray "A" is gone); the pearl now rolls in from the
right edge across the lit card and settles before the thread tightens; the Draw rebuilt around the thread — the
sheet's held left corner leads the free side by up to 9% of the height, a zari knot ties the thread to that
corner, the deckled edge has a lit rim and contact shade, and after the sheet lands the thread slips its knot and
leaves toward the pull. Found while reviewing: CSS `fill` rules were overriding the SVG paper pattern, so the card
and the sheet's edge band had no paper texture; removed, and the paper tile re-graded lighter and lower in contrast
(it had read as grey recycled board).

| Category | Score | Reason (with frame and viewport) |
|---|---|---|
| Art Direction | 15/20 | Phone: the still life now has real cotton paper under the type (t=7.3 s), and the entry is recognisably this design — a champagne thread tied at a paper corner hauling the next sheet over the card (tap +1.15 s). Desktop t=6.5 s is still a full-bleed field with small names; it could be any minimal hero. |
| Image Quality | 12/15 | Paper now reads as fibre, not flat colour; pearls remain the strongest images. Marble strip still cool blue-grey against warm paper. Buds at 17 px are indistinguishable from pearls at thumbnail scale (t=5.6 s). |
| Opening Experience | 15/20 | No stray glyph; the pearl's roll is seen (t=2.5–3.2 s) and its stop causes the tension (3.6 s); names readable by ~5.3 s; the entry now shows its cause. Held back by the light beat — t=1.5 s is a grey gradient wash, not morning light finding paper — and by desktop, where the same beats play in an empty frame. |
| Motion Design | 12/15 | Lead → follow → settle holds through the roll, tension, draw and names; the Draw's corner-lead gives the sheet a physical motion curve instead of a UI slide. The light rise is an opacity fade without a moving front. |
| Typography | 8/10 | Unchanged strengths; desktop masthead still under-scaled for its frame. |
| Composition | 7/10 | Phone composed; desktop empty (t=6.5 s: 60% of the frame is blank paper). |
| Cultural Coherence | 4/5 | Mogra not yet legible as mogra in the opening. |
| Mobile Experience | 4/5 | As iteration 1; 393/412 still to capture. |
| **Total** | **77/100** | Gates: Opening ✗ (15) · Art ✗ (15) · Image ✗ (12) · Motion ✗ (12) · P0 count 0 |

**P0:** none. **P1:** desktop composition; light beat reads as a grey wipe; mogra illegible at strand size; marble
cold. **P2:** hint and facts sit far from the pearl on desktop.

**Performance (phone, DPR 3, CPU ×4):** opening ≈128 KB (images 52, fonts 48, gzipped text 28); LCP 880 ms;
CLS 0; 678 frames, median 16.7 ms, p95 16.8 ms, none over 34 ms; tap feedback 46 ms.

**Top 3 problems**
1. Desktop 1440×900, every opening frame — the phone composition stretched to a landscape: 220 px names occupy a
   small part of a full-bleed paper field, so there is no object, no scale and no depth; it reads as a website hero.
2. All viewports, t 0.3–2.2 s — "morning light reveals the paper" is a uniform darkness fading plus a grey
   gradient, because the light has no moving front and no warmth; paper looks dirty grey at t=1.5 s.
3. All viewports, t 4.7–6.0 s — mogra doesn't become visible: the three buds at the strand's tail are drawn at
   17 px, the size of the pearls, and their grey shading makes them read as more pearls.

**Changes made** (for iteration 3)
- Desktop art-directed as an object: a portrait card with deckled top, left and right edges standing on marble,
  names at masthead scale on the card, the thread crossing card and marble, facts and hint on the card.
- A real light front: a soft diagonal band of warm morning light travels from the top-left corner across the
  still life, uncovering it, with the cool shade side clearing last.
- Mogra made legible: buds drawn larger than the pearls and set on the strand where they read as buds.

**New score after re-render:** see iteration 3.

---

## Iteration 3 — 2026-09-17

**Captures:** `qa/iteration-03/` — four contact sheets, 48 stills, `performance.json`, three recordings (local only).

**Changes rendered:** desktop art-directed as an object (portrait card with deckled top, left and right edges on
warm-neutral marble; monogram high right, first name left, second name low right, facts and hint low left; the
thread crosses marble, card and marble); a travelling light front replaces the uniform fade (a 100 px gradient
scaled up and moved by transform, with a warm leading edge); buds enlarged (phone 23 px, desktop 30 px) so mogra
reads at the strand's tail; marble re-graded without the blue cast and given a 1920 px size for wide screens.

| Category | Score | Reason (with frame and viewport) |
|---|---|---|
| Art Direction | 17/20 | Desktop t=6.5 s is now a still life, not a hero: a deckled card standing on marble, the thread crossing both materials, the strand lying on paper. Phone unchanged and strong. Held from the top band by the Welcome's desktop first viewport (tap +3.0 s: the upper-left half is empty paper) and a faint monogram on the phone. |
| Image Quality | 13/15 | Pearls remain the anchor; paper and marble now read as the same morning light; buds at 23–30 px read as closed white buds, though soft. P01's warm market light is still the one image outside the dawn grade. |
| Opening Experience | 17/20 | The light front at t=1.5 s (both viewports) finally reads as morning light crossing a table; roll → tension → draw → names → mogra is legible; the Draw is caused by the thread. Weak links: once the invitation settles (t≥6.4 s) the frame is completely still, so nothing but small caps invites the touch; on desktop the pearl rolls along the card's bottom edge (t=2.5–3.2 s), outside the composition. |
| Motion Design | 13/15 | Every move has a cause and a token; the light is a transform, not a fade. At tap +1.15 s the edge's contact shade reads as a grey stripe on the card beneath rather than soft shade. |
| Typography | 9/10 | Desktop masthead now in proportion to its card; surnames, facts and hint on one label style; Welcome title and line correct. |
| Composition | 8/10 | Both opening compositions hold a diagonal with one moment, one fact, one action. Welcome desktop first viewport leaves its upper left empty. |
| Cultural Coherence | 4/5 | Mogra and moti both present and strung; still no invocation in the demo (open question to the user). |
| Mobile Experience | 4/5 | 390×844 verified; 393×852 and 412×915 not yet captured. |
| **Total** | **85/100** | Gates: Opening ✗ (17) · Art ✓ (17) · Image ✓ (13) · Motion ✓ (13) · P0 count 0 |

**P0:** none. **P1:** still invitation state; desktop roll at the frame's edge; contact-shade stripe in the Draw.
**P2:** Welcome desktop upper-left emptiness; phone monogram faint.

**Performance (phone, DPR 3, CPU ×4):** opening ≈129 KB; LCP 912 ms; CLS 0; 675 frames, median 16.7 ms, p95
16.8 ms, none over 34 ms; tap feedback 50 ms.

**Top 3 problems**
1. All viewports, t ≥ 6.4 s — the invitation to touch is text only: the frame freezes, and the storyboard's single
   slow lustre on the pearl (the object to touch) was never built.
2. Phone and desktop, tap +0.6–1.6 s — the sheet's contact shade is drawn as three stacked strokes that read as a
   grey stripe on the card, not as shade under a lifted edge.
3. Desktop, t 2.1–3.4 s — the slack thread lies at 88–93% of the height, so the pearl rolls along the card's bottom
   edge and mostly over marble, away from where the eye is.

**Changes made** (for iteration 4)
- The hero pearl's lustre drifts slowly once the invitation is ready (normal cut only; static in reduced).
- The contact shade is softened to a single faint falloff.
- Desktop slack thread raised into the card's lower third.
- Capture set extended to 393×852 and 412×915.

**New score after re-render:** see iteration 4.

---

## Iteration 4 — 2026-09-17

**Captures:** `qa/iteration-04/` — six contact sheets (adds `sheet-phone393-normal.jpg`, `sheet-phone412-normal.jpg`),
54 stills, `performance.json`, three recordings (local only).

**Changes rendered:** the hero pearl's lustre drifts once the invitation is ready (CSS keyframes on transform and
opacity, 3 s alternate, normal cut only; verified across three captures 1.5 s apart); the Draw's contact shade
reduced to a faint falloff; desktop slack thread raised to 78–84% so the roll crosses the card's lower third;
393×852 and 412×915 added to the capture set.

| Category | Score | Reason (with frame and viewport) |
|---|---|---|
| Art Direction | 17/20 | Both openings are composed still lifes with the signatures intact. Welcome desktop (tap +3.0 s) is still a sparse page: a small words block mid-left and an empty upper left. |
| Image Quality | 13/15 | As iteration 3. P01's orange market light remains the one grade outside dawn; buds soft at 23–30 px. |
| Opening Experience | 18/20 | A title sequence from first frame to touch: light front (1.5 s) → relief → the roll across the card (2.5–3.2 s, desktop now mid-card) → tension → draw → names (lit by ~5.3 s) → mogra → an object that invites the touch (the pearl's lustre). The Draw's cause is visible and the shade no longer reads as a stripe (tap +1.15 s crop). Reduced cut tells the same story in 2.2 s. |
| Motion Design | 14/15 | Every move has a visible cause and a token; ≤3 movers per beat; the one ambient element is the vocabulary's lustre; exits leave toward the pull. |
| Typography | 9/10 | Unchanged. |
| Composition | 8/10 | Openings composed at 390, 393, 412 and 1440; the Welcome desktop viewport is the weak frame. |
| Cultural Coherence | 4/5 | Unchanged. |
| Mobile Experience | 4/5 | 390×844, 393×852 and 412×915 hold the composition with facts and hint in the thumb zone; short in-app-browser heights not yet checked. |
| **Total** | **87/100** | Gates: Opening ✓ (18) · Art ✓ (17) · Image ✓ (13) · Motion ✓ (14) · P0 count 0 |

**P0:** none. **P1:** Welcome desktop first viewport; P01 grade. **P2:** short-viewport check; buds' softness.

**Performance (phone, DPR 3, CPU ×4):** opening ≈129 KB; LCP 844 ms; CLS 0; 678 frames, median 16.7 ms, p95 16.8 ms,
none over 34 ms; tap feedback 50 ms.

**Top 3 problems**
1. Welcome, 1440×900, tap +3.0 s — the arrival frame after the Draw is the weakest composition in the sequence:
   the phone layout's words block floats at 38% with the upper-left empty, and the families and welcome line sit a
   whole viewport below, although wide screens should read as two-page spreads (visual-dna §5.1).
2. Welcome, all viewports — P01's orange market light and saturated green floor pull the dawn page warm and loud.
3. Phones inside in-app browsers (visible height ~660 px) are unverified: the opening and Welcome are placed by
   fractions of the height, so the monogram, names and facts could crowd.

**Changes made** (for iteration 5)
- Welcome desktop recomposed as a spread: names, lead and dates on the left page's upper half, families and the
  welcome line on its lower half, the photograph as the right page.
- P01 re-graded cooler and quieter.
- A 390×664 capture added for in-app browsers; layout corrected if it crowds.

**New score after re-render:** see iteration 5.

---

## Iteration 5 — 2026-09-17 (final iteration for the hero gate)

**Captures:** `qa/iteration-05/` — seven contact sheets (adds `sheet-inapp-normal.jpg`, 390×664), 57 stills,
three filmstrips pulled from the real-time recordings (`filmstrip-phone-normal.jpg`, `filmstrip-desktop-normal.jpg`,
`filmstrip-phone-reduced.jpg`), `fallback-still-phone.jpg`, `interaction.json`, `performance.json`; recordings
local only.

**Changes rendered:** Welcome on wide screens recomposed as a two-page spread (names, lead and dates on the left
page's upper half; families and the welcome line on its lower half; the photograph as the right page); P01
re-graded with a cooler, quieter dawn for warm-light sources; short phones (in-app browsers) keep the monogram a
scale step clear of the first name; lead and welcome lines balanced.

**Verified by real-time recording, not only seeks:** the filmstrips show the same beats at the same moments on the
phone and desktop, including the tap at 7.6 s and the Draw (phone 8.4–9.6 s).

**Interaction (`tools/capture/interaction.mjs`, all pass):** without animation frames (`?still`) the settled invitation
shows and a tap opens Welcome at once; `?open` skips the opening; Tab reaches the cover button and Enter plays the
Draw, hands focus to the `<h1>` and unlocks scrolling; Escape does not open; a tap at 2 s fast-forwards the rest at
4× then plays the Draw; a tap before 1.2 s is queued. No page errors.

| Category | Score | Reason (with frame and viewport) |
|---|---|---|
| Art Direction | 18/20 | Every frame of the sequence is this design and no other: dawn light crossing a cotton card on marble (1.5 s), a real pearl strung on champagne silk between masthead names (6.5 s, phone and desktop), a thread tied at a paper corner hauling the next sheet over the card (tap +1.15 s), and a Welcome spread on wide screens (tap +3.0 s). Short of the top: the phone monogram is faint at 112 px and the buds are the least crafted objects. |
| Image Quality | 13/15 | Pearls, paper, marble and the re-graded P01 now read as one morning. The buds remain a processed cut-out from a green-lit, noisy source — acceptable at 23–30 px, soft on close inspection (desktop 6.5 s crop). |
| Opening Experience | 18/20 | A title sequence with a cause at every step (verified in real time); curiosity inside 2 s; names readable by ~5.3 s; tap feedback 69 ms; the entry is a physical transition, not a section change; the reduced cut tells the same story in ~2.2 s. Not 19–20: the reduced cross-fade briefly double-exposes the opening's masthead names under the Welcome heading (reduced tap +0.3–0.7 s, real-time filmstrip 3.8 s), and names land a little after 5 s. |
| Motion Design | 14/15 | Lead → follow → settle throughout; ≤3 movers per beat; tokens only; light as a moving front; one ambient lustre; exits toward the pull; transform/opacity/small masks only; zero frames over 34 ms at 4× CPU throttle. |
| Typography | 8/10 | Openings and the phone Welcome are precise. The new desktop Welcome spread shows four sizes in one viewport — title 84, line 44, info 19, label 13 — against the three-size rule. |
| Composition | 9/10 | One moment, one fact, one action at 390×844, 393×852, 412×915, 390×664 and 1440×900; the Welcome spread composes the wide arrival. |
| Cultural Coherence | 4/5 | *Moti pirona* told with the objects themselves and hands stringing mogra; mogra at the tail reads as buds only up close. |
| Mobile Experience | 5/5 | Verified at 390×844, 393×852, 412×915 and an in-app-browser height of 664; whole cover is the button; hint and facts in the thumb zone; opening ≈129 KB; CLS 0. (In-app browsers emulated by height, not tested on devices.) |
| **Total** | **89/100** | Gates: Opening ✓ (18) · Art ✓ (18) · Image ✓ (13) · Motion ✓ (14) · P0 count 0 |

**P0:** none.
**P1:** desktop Welcome shows four type sizes in one viewport.
**P2:** reduced-cut cross-fade double-exposes the masthead names for ~0.4 s; buds soft above 23–30 px; phone
monogram faint; no sound yet (A02 needs the user's ear).

**Performance (phone, DPR 3, CPU ×4, `performance.json`):** 31 requests before the tap; ≈129 KB transferred with
gzip (images 51, fonts 48, HTML/CSS/JS 30) against the 350 KB opening budget, with the Welcome photograph (14 KB at
720 w) already inside that and no GSAP; LCP 864 ms; CLS 0; 678 frames, median 16.7 ms, p95 16.8 ms, max 33.4 ms,
none over 34 ms; 3 long tasks during load; tap feedback 69 ms; no video; no originals shipped.

---

## Phase 3.5 decision — **FAIL (narrowly)**, 89/100 after the maximum 5 iterations

Every critical gate passes — Opening 18/20, Art Direction 18/20, Image Quality 13/15, Motion Design 14/15, zero P0 —
but the total is one point under the 90 target, so by the brief's rule the opening is not yet a pass. The loop has
reached its five-iteration limit, so the remaining issues are reported rather than fixed in a sixth pass.

| Iteration | Total | Opening | Art | Image | Motion | P0 |
|---|---|---|---|---|---|---|
| 1 | 70 | 12 | 14 | 11 | 10 | 2 |
| 2 | 77 | 15 | 15 | 12 | 12 | 0 |
| 3 | 85 | 17 | 17 | 13 | 13 | 0 |
| 4 | 87 | 18 | 17 | 13 | 14 | 0 |
| 5 | 89 | 18 | 18 | 13 | 14 | 0 |

**What stands between 89 and a pass**
1. **Typography (P1):** the desktop Welcome spread carries four sizes. Fix: set the families as the lead's `type-line`
   continuation or move the families back below the fold on wide screens; +1 expected.
2. **Image Quality:** the buds need a better photograph — evenly lit, sharp, closed *Jasminum sambac* buds on a
   plain ground. This needs a new download, which needs your approval; +1 expected.
3. **Opening / reduced cut (P2):** fade the opening's words out before the reduced cross-fade so the two headings never
   overlap.
