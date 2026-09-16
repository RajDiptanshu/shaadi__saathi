---
name: wedding-art-direction
description: The visual constitution for Shaadi Saathi wedding invitations — concept gate, visual decision rules, colour, typography, spacing, composition, cultural coherence and copy, with common failure modes and concrete examples of what not to do. Use before designing or changing the look of any invitation (concepts, scene layouts, palettes, type, spacing, copy tone) and when reviewing whether a design reads as premium or templated.
---

# Wedding art direction

These rules apply to every invitation in this repository. Numbers below are the flagship **Mogra & Moti**
system; a new design may choose its own palette, faces and signatures, but must define the same kinds of rules
with the same rigour before it is built.

**Canonical sources** (if this skill and a doc ever disagree, the doc wins and this skill must be corrected):
`docs/mogra-moti/creative-concept.md` · `visual-dna.md` · `typography-system.md` · `material-library.md` ·
`animation-storyboard.md` · `scene-architecture.md` · `docs/legacy-audit.md`.

---

## 0. Ground rules

1. **Legacy is frozen.** `site/demo/*` and the catalogue design are legacy. Never edit, delete, redesign, or use
   them as a visual reference. Reuse engineering only (`docs/legacy-audit.md` → "Never copy").
2. **New work gets its own namespace:** `site/invitations/<slug>/`, docs in `docs/<slug>/`.
3. **Plan before pixels.** Show a storyboard/layout plan and a numbered question list with defaults before
   building a new design; build after the user answers.
4. **Phase gating.** In the flagship programme, finish the requested phase, report, and stop.
5. **Public repository.** Never commit a real couple's names, phone numbers, addresses or sheet URLs.

## 1. Concept gate

A design may be built only when `docs/<slug>/creative-concept.md` contains:

- a **one-sentence idea** rooted in a real material, ritual or gesture (Mogra & Moti: *moti pirona* — one strand
  being made from dawn to night);
- an **emotional arc** whose peak is at the end, not in the first two seconds;
- the **ten answers**: recognisable by · signature opening · signature material · signature transition ·
  signature type treatment · signature image treatment · Indian without stereotype · premium not template ·
  hierarchy at 390 px · what the guest remembers;
- a **WHY** for every major decision.

Reject the concept if its signatures could be pasted into another studio's invitation unchanged.

---

## 2. Visual decision rules

When a design choice is unclear, apply these in order.

| Situation | Rule |
|---|---|
| Two layouts both "work" | Choose the one with fewer competing elements and a clearer single moment. |
| A viewport needs a fourth type size | Remove an element or move it to the next viewport. Never add a size. |
| A scene feels empty | Increase the scale of the moment or crop tighter. Never add ornament. |
| A scene feels busy | Remove something. Never shrink everything to fit. |
| Text must be read over a photograph | Move the text onto the ground. Only a dark photo with a scrim reaching ≥4.5:1 may carry text. |
| Contrast fails | Change the colour pairing to one in the contrast table. Never add text-shadow, never go below minimum size. |
| Gold looks flat or cheap | Reduce its area. Never add a gradient. |
| Two photos don't feel like one shoot | Regrade both to the scene recipe; if they still clash, replace one. |
| Tempted to add an icon | Write the word in label type. |
| Tempted to centre | Keep left alignment unless this is the design's one sacred centred moment. |
| Placeholder copy is too long | Cut the words to the limits. Never shrink the type. |
| Wanting a signature element somewhere new | Check its budget: the Mogra & Moti thread appears only where it joins something (names, the three Draws, the knot, a reply); the name treatment appears three times. |
| An idea resembles a competitor's opening (curtain, envelope, wax seal, door, scratch card) | Reject it unless the concept doc argues why this design needs it and how it differs. |
| Unsure whether a ritual detail is accurate | Ask the user, or use a detail photograph that doesn't assert ritual specifics. |
| A screenshot of one frame wouldn't stand on its own | Fix the composition first; motion won't rescue it. |

---

## 3. Colour rules

1. **Every colour comes from a material** in the concept, and its source is written next to the token.
2. **No pure white or black.** Mogra & Moti bounds: lightest `#FAF8F2`, darkest `#15110E`.
3. **Only pairs in the contrast table are used for text.** Reading text ≥4.5:1; display ≥24 px ≥3:1.
   Mogra & Moti pairs: `--ink #2A2520` 13.1:1 on paper · `--ink-soft #675E55` 5.5:1 paper / 4.6:1 dusk ·
   `--zari-ink #76603C` 5.2:1 paper (on dusk only ≥24 px) · `--mehendi #7E4128` 6.5:1 (the word "Mehendi" only) ·
   `--err #8E2F24` 7.0:1 · `--pearl #ECE6DF` 14.1:1 night · `--night-soft #A89C8F` 6.5:1 night ·
   `--zari #B89A6A` 6.5:1 night only (2.3:1 on paper = decorative).
4. **Gold is a thread or a hairline, never a fill or gradient**; under 3% of any light viewport; text only at night.
5. **Blush and sage live inside materials** (pearl overtones, photographed calyxes), never as flat backgrounds or
   buttons.
6. **One accent per scene at most.**
7. **Grounds follow the design's clock** and change only at scene transitions. Mogra & Moti: night-deep →
   paper-dawn (01–02) → paper (03) → paper-warm (04) → dusk (05) → night (06–07) → night-deep (08).
8. The page ignores the OS dark theme; its light-to-night arc is the narrative.

---

## 4. Typography rules

### 4.1 System

- **≤3 families**, each with a job. Mogra & Moti: **Imbue** (names, titles, event names, emotional lines,
  display figures) · **Archivo** (labels in expanded capitals, information, body, interface) · **Noto Serif
  Devanagari** (chapter numerals, optional invocation).
- **Choose display faces by rendering them at 390 px** and recording the comparison (Imbue beat Bodoni Moda:
  132 px masthead vs 86 px stationery-card look).

| Token | Setting | Size / line height at 390 px | Use |
|---|---|---|---|
| masthead | Imbue 300, opsz 100, −0.01em | 132 / 108 | first names in the signature treatment only |
| figure | Imbue 200, opsz 100, −0.02em | 220 / 176 | the Wedding's "15" only |
| display | Imbue 300, opsz 90 | 72 / 64 | event names, venue name |
| title | Imbue 300, opsz 60 | 44 / 48 | welcome heading, pull quotes, RSVP and closing titles |
| line | Imbue 300, opsz 32 | 28 / 32 | emotional lines |
| body | Archivo 400 | 16 / 24 | story, venue description, RSVP notes |
| info | Archivo 440 | 16 / 20 | grouped facts, choice words, guest count |
| input | Archivo 400 | 16 / 24 | RSVP inputs (16 px stops iOS zoom) |
| label | Archivo 520, width 118, CAPS, +0.16em | 11 / 16 | labels, surnames, links, captions; Sample mark at 10 |
| mark | Noto Serif Devanagari 450, width 75 | 14 / 16 | chapter numerals, invocation |

### 4.2 Rules

1. **≤3 type sizes per viewport**, counted in pixels. Exempt: the chapter mark's Devanagari numeral, an invocation
   line, the Sample mark and the music control.
2. **The reading tier is one size (16 px).** Body, info and input differ by line height and weight only.
3. **Minimums:** reading text 16 px, labels 11 px, Sample mark 10 px.
4. **Word and line limits:** emotional lines ≤12 words; body ≤45 words per block; titles and pull quotes ≤5 lines
   at 390 px; body 30–38 characters per line at 390 px.
5. **Case:** sentence case everywhere; labels always capitals; names never capitalised.
6. **No "&" between the couple's names** — the design's signature does that job (Mogra & Moti: the thread).
7. **Dates:** "Monday 15 February 2027", "7:30 pm", ranges with an en dash, no ordinals, no "Feb".
8. **No script faces** unless the concept doc justifies one; never for labels, information or body. Banned in
   Mogra & Moti.
9. **No fake styles:** `font-synthesis: none`; no shadows, glows, outlines, gradients or textures on text (the
   single exception is Reception's one nacre light pass).
10. **Devanagari:** never letter-spaced; used as typography, never as ornament.
11. **Wrapping:** `text-wrap: balance` for titles and lines, `pretty` for body, `hyphens: none`, no one-word last
    line in a title.
12. **Banned faces:** legacy pairings (Italiana + Jost, Rozha One + Marcellus, Limelight + Oswald, Caprasimo +
    Baloo 2) and template defaults (Cormorant, Playfair Display, Great Vibes-style scripts; Inter, DM Sans,
    Poppins or Montserrat as the "safe" sans).

### 4.3 Signature treatment (Mogra & Moti)

Names held apart by the thread, three appearances only (opening masthead, welcome `<h1>` at title scale, closing
masthead). Masthead geometry at 390×844: "Rohan" flush left 18 px, baseline 39%; "Anaya" flush right 372 px,
baseline 61%; surnames in label type 12 px below each baseline; the thread enters the left edge at 74% and
leaves the right at 28%, weaving once behind Anaya's "A"; one pearl in the gap at x ≈40%. Closing raises the
geometry ~10% (baselines 30%/48%).

**The Wedding exception:** the only celebration without a display-size name. "THE WEDDING" sits in label type
above the 220 px "15", which is the scene's one display size.

---

## 5. Spacing rules

**Grid at 390 px:** 20 px side margins (+ safe areas) · 6 columns · 10 px gutters (grid value, not spacing) ·
4 px baseline (every line height is a multiple of 4) · `svh` for full-screen moments.
Other widths: 393/412 keep the 390 composition; 768 → 8 columns, 32 px margins; ≥1024 → 12 columns, 64 px
margins, 1280 px max, names cap at 240 px.

**Spacing scale: 4 · 8 · 12 · 20 · 32 · 52 · 84 · 136.** Each step has a job:

| Step | Use |
|---|---|
| 4 | label → the value beneath it; hairline → text it underlines |
| 8 | lines inside one grouped fact (time → venue → area) |
| 12 | Devanagari numeral → chapter label; name baseline → surname; caption → its photo |
| 20 | side margins; between separate fact groups (when → where → wear); between two links |
| 32 | chapter mark → top safe area; heading → the content it introduces |
| 52 | photograph → its text block; blocks inside one composition |
| 84 | compositions inside a scene (story spreads, celebrations) |
| 136 | the start and end of a scene, around a transition |

Any other spacing value is a defect. Sizes are not spacing: touch targets 44 px, the button 52 px.

---

## 6. Composition rules

1. **Scenes, not sections.** Each scene has its own composition, rhythm, entrance and purpose. The recipe
   "title → lede → bordered box" is banned.
2. **Hierarchy per viewport, one of each, in order:** moment (image or names, 45–70% of the viewport) → fact (the
   one large piece of type) → action (in the lower 40%) → details.
3. **≤3 competing elements per viewport.**
4. **Alignment:** left by default. Right alignment only for (a) the second name in the signature treatment and
   (b) one display-size word on the side opposite a photo's bleed, to balance it (e.g. "Mehendi"). Centring only
   for the design's one sacred moment (Mogra & Moti: the Wedding).
5. **Bleed:** an inline photograph touches exactly one screen edge; never equal margins. Declared exceptions only
   (Mogra & Moti): the Wedding photo centred; full screen for Story spread C, Reception, the Venue after its
   letterbox opens, and the gallery's full view; the gallery strip starts at the margin and runs off the right edge.
6. **Photographs have no borders, radii or drop shadows.** One photo may overlap another (~18%); the upper one casts
   the lift shadow.
7. **Text on photographs:** only Reception (dark image + bottom scrim ≥4.5:1). A display figure may sit *behind* a
   photo's edge (the Wedding "15"); nothing sits on top of a light photo.
8. **Event compositions come from a vocabulary assigned in data:** `bleed-left`, `bleed-right`, `vertical-name`,
   `centred-knot` (at most one per invitation), `full-bleed-night`. Every event shows the same facts in the same
   order: name · weekday and date · time · venue and area · "Wear" · Directions and Add to calendar.
9. **Fixed chrome is two small things:** the Sample mark (top left) and the music control (bottom right). No other
   fixed or floating UI. The studio call to action appears only after the closing.
10. **No UI furniture:** no cards, pills, badges, icons, gradient buttons, glassmorphism. Links are words in label
    type with the design's underline; one filled button per page ("Send reply").

---

## 7. Cultural coherence

- Carry meaning through **materials, rituals of the hand and language**: mogra strung as buds that open at night,
  the mangalsutra's thread, the gathbandhan knot, chikankari shadow work, real henna colour, Devanagari numerals,
  santoor.
- **Never as decoration:** mandalas, paisleys, elephants, Ganesha clip-art, red-and-gold by default, marigold
  swags, diya icons, palace silhouettes, dhol graphics, Bollywood kitsch.
- **Ritual text is content:** invocation lines, honorifics and family order are optional data fields, set correctly.
- Check ceremony names, order and photographs against the tradition being shown.

## 8. Data and copy

- **No wedding detail in markup or scene code.** Everything a guest reads binds to `details.js` (`window.INVITE`)
  via `data-t`, `data-date`, `data-attr`, `data-if`, `data-each`.
- **Invented demo values are registered** in `placeholders`; keep `sample: true` and the Sample mark.
- **Copy is written, specific and short.** One line of meaning per scene; no filler headings; no exclamation marks,
  emoji or "❤️".

---

## 9. Common failure modes

| Failure | How it shows | Cause | Fix |
|---|---|---|---|
| Template drift | scenes start to look alike: centred title, lede, box | copying the previous scene's structure | give the scene its own composition from the vocabulary |
| Size creep | 15, 16, 18 px all on one screen | adding "just one" size for a new element | collapse into the reading tier; remove the element |
| Ornament as filler | sprigs, dividers, flourishes between sections | a scene felt empty | enlarge or recrop the moment; delete the ornament |
| Gold overuse | gold rules, gold labels, gold everything on paper | trying to signal luxury | gold only as thread/hairline; text in gold only at night |
| Pale sameness | every scene on the same ivory | ignoring the clock | apply the ground and grade for the scene's hour |
| Floating photos | photo centred with margins | "it looks tidy" | bleed one edge |
| Fixed-UI clutter | sales pill, share button, back-to-top floating | business asks leaking into design | studio call to action only after the closing |
| Legacy creep | Italiana-like thin names, hairline countdown, pearl-dot rails | the old demo in memory | re-read `docs/legacy-audit.md` → "Never copy" |
| Costume-party Indian | paisley borders, red-gold, drawn diyas | shortcutting cultural signals | a material, ritual or word instead |
| Hard-coded wording | names or dates inside HTML or JS | quick prototyping | bind to `details.js`; register placeholders |

## 10. What NOT to do (examples)

```html
<!-- ✗ The centred template hero with an ampersand -->
<header class="hero" style="text-align:center">
  <h1>Rohan <span class="amp">&amp;</span> Anaya</h1><p>15.02.2027</p><p>scroll ↓</p>
</header>
<!-- ✓ Names bound to data, held apart by the signature, left and right -->
<h1 class="sig"><span data-t="couple.groomFull"></span><span class="sr-only"> and </span><svg aria-hidden="true">…thread…</svg><span data-t="couple.brideFull"></span></h1>
```

```css
/* ✗ Four identical event cards */
.event { border: 1px solid #e5d9c5; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,.08); text-align: center; }
/* ✗ Gold as a gradient fill */
.title { background: linear-gradient(135deg, #d4af37, #f6e27a); -webkit-background-clip: text; color: transparent; }
/* ✗ Off-scale spacing and near-duplicate sizes */
.venue { margin-top: 37px; font-size: 15px; } .venue-time { font-size: 17px; }
/* ✗ A script face and fake italic */
.names { font-family: "Great Vibes", cursive; font-style: italic; }
/* ✗ Text on a light photograph rescued with a shadow */
.caption-on-photo { color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.6); }
```

```text
✗ "Save the Date!! ❤️ Join us as we tie the knot 💍"
✗ "Our Events"  (a filler heading)
✗ "Three days in February, and a strand of mogra for every single one of them."  (14 words for a 12-word line)
✓ "Four celebrations. We'd love you at every one."
```

## 11. Checklist before committing a visual change

- [ ] It serves the one-sentence idea, and its WHY is written down.
- [ ] Every viewport: moment → fact → action → detail; ≤3 elements; ≤3 type sizes (with exemptions).
- [ ] All spacing on the scale; all text colours from the contrast table.
- [ ] Bleed, alignment and text-on-photo rules hold, or the case is a declared exception.
- [ ] No legacy language, no stereotype decoration, no hard-coded wording.
- [ ] Rendered at 390×844 and looked at; a single frame would survive being forwarded as a screenshot.
