# Mogra & Moti — typography system

Three families, each with a job. All three have a width axis, which is the system's idea: tall, narrow,
vertical letterforms, like strands hanging from a hand.

---

## 1. Families

| Family | Designer, licence | Axes | Role |
|---|---|---|---|
| **Imbue** | Tyler Finck, SIL OFL, Google Fonts | optical size 10–100, weight 100–900 | names, titles, event names, emotional lines, display figures |
| **Archivo** | Omnibus-Type, SIL OFL, Google Fonts | width 62–125, weight 100–900 | labels (expanded capitals), information, body, interface |
| **Noto Serif Devanagari** | Google, SIL OFL, Google Fonts | width 62.5–100, weight 100–900 | chapter numerals ०१–०८, optional invocation line |

Axes verified against the Google Fonts API on 2026-09-16.

### Why Imbue

- **It is a condensed high-contrast serif.** At phone width, condensing is what allows masthead scale: "Anaya"
  at 132 px fits a 390 px screen with room for the thread. A regular-width Didone must drop to about 86 px for
  the same fit and loses its drama.
- **Its optical-size axis** gives one family two voices: sharp hairlines at 100 for names, sturdier strokes at
  24–32 for emotional lines that must read at 28 px.
- **The verticals echo hanging strands**, so the typography belongs to the concept.
- **It is not a wedding default.** Its associations are fashion mastheads and editorial covers.

### Rendered comparison (390 px, 2026-09-16)

| | Imbue 300, opsz 100, 132 px | Bodoni Moda 400, opsz 96, 86 px |
|---|---|---|
| Scale on a phone | names fill the width like a masthead | names look like a stationery card |
| Hairlines | hold at size | the A's thin diagonal nearly vanishes |
| Identity | editorial, fashion | classic wedding invitation |
| Emotional line | condensed, legible at 27 px | italic is lovely but the most familiar wedding look |

Decision: Imbue. Bodoni Moda was the strongest alternative.

**Also rejected:** Cormorant and Playfair Display (wedding and template defaults), Instrument Serif (strong
startup-website association), any script or calligraphic face, and every legacy pairing (Italiana + Jost,
Rozha One + Marcellus, Limelight + Oswald, Caprasimo + Baloo 2).

### Why Archivo

One family covers two voices through its width axis: **expanded capitals** (width 118) for labels — the voice
of a fashion house's garment label — and **normal width** for information that must be read quickly. A
grotesque rather than a geometric sans avoids the Futura-clone look of the legacy Jost. It is not one of the
SaaS-default sans faces (Inter, DM Sans, Manrope, Poppins).

### Why Noto Serif Devanagari

Its width axis can narrow to 75 to sit beside condensed Imbue; its serif stress matches Imbue's contrast better
than a Devanagari sans; and it shapes conjuncts correctly for an invocation line. It is used as typography,
never as decoration.

**Imbue has no italic. Synthetic italics are banned** (`font-synthesis: none`). Emphasis comes from scale,
weight, colour or position.

---

## 2. Roles and tokens

Sizes at 390 px. Line heights are whole multiples of the 4 px baseline (`visual-dna.md` §5.1); the ratio in
brackets keeps them proportional as the clamp grows.

| Token | Family and settings | Size / line height / tracking | Clamp | Used for |
|---|---|---|---|---|
| `type-masthead` | Imbue, opsz 100, wght 300 | 132 / 108 (0.82) / −0.01em | `clamp(112px, 34vw, 240px)` | the couple's first names in the signature treatment; nothing else |
| `type-figure` | Imbue, opsz 100, wght 200 | 220 / 176 (0.8) / −0.02em | `clamp(180px, 56vw, 360px)` | the Wedding's "15"; nothing else |
| `type-display` | Imbue, opsz 90, wght 300 | 72 / 64 (0.89) / −0.005em | `clamp(60px, 18.5vw, 150px)` | event names, venue name |
| `type-title` | Imbue, opsz 60, wght 300 | 44 / 48 (1.09) / 0 | `clamp(38px, 11.3vw, 84px)` | the welcome heading, story pull quotes, RSVP and closing titles |
| `type-line` | Imbue, opsz 32, wght 300 | 28 / 32 (1.14) / +0.005em | `clamp(26px, 7.2vw, 44px)` | emotional lines, at most 12 words |
| `type-body` | Archivo, wdth 100, wght 400 | 16 / 24 (1.5) / 0 | `clamp(16px, 4.1vw, 19px)` | story text, venue description, RSVP notes; at most 45 words per block |
| `type-info` | Archivo, wdth 100, wght 440 | 16 / 20 (1.25) / 0 | `clamp(16px, 4.1vw, 19px)` | tightly grouped facts: times, venues, dates, choice words, the RSVP guest count |
| `type-label` | Archivo, wdth 118, wght 520, UPPERCASE | 11 / 16 (1.45) / +0.16em | `clamp(11px, 2.8vw, 13px)` | labels, surnames, links, captions, the Sample mark (10 px) |
| `type-mark` | Noto Serif Devanagari, wdth 75, wght 450 | 14 / 16 (1.14) / 0 | `clamp(14px, 3.6vw, 17px)` | chapter numerals ०१–०८; an optional invocation line |
| `type-input` | Archivo, wdth 100, wght 400 | 16 / 24 (1.5) / 0 | fixed 16 px | RSVP inputs (16 px is the smallest size that stops iOS zooming on focus) |

`type-body`, `type-info` and `type-input` share one size on purpose: the **reading tier** is a single size,
told apart by line height and weight. *Why:* 15 and 16 px side by side is exactly the near-identical sizing that
makes pages look templated.

**Scale logic.** The steps jump rather than creep (11 → 16 → 28 → 44 → 72 → 132). *Why:* editorial pages get
their energy from big gaps between sizes; templates use many near-identical sizes.

---

## 3. Rules

1. **Three type sizes per viewport, maximum.** Counted in pixels at 390 px. Not counted: the chapter mark's
   Devanagari numeral, an invocation line, and the two fixed controls (Sample mark, music). Typical sets:
   masthead + reading + label (opening); title + line + label (welcome); display + reading + label (a
   celebration). *Why the exemptions:* the numeral and the chrome are fixed wayfinding, not part of a scene's
   hierarchy.
2. **Case.** Sentence case everywhere except `type-label`, which is always capitals. Names are never capitalised.
3. **No "&" between the couple's names.** The thread does that job (§4). "and" is used in running text.
4. **No letter-spacing on Devanagari.** Tracking breaks conjunct shaping; `type-mark` and any Hindi line keep
   tracking at 0.
5. **Dates in Indian English order:** "Monday 15 February 2027", "7:30 pm", ranges with an en dash
   ("14–16 February 2027"). No ordinals, no "Feb".
6. **Figures.** Imbue's lining figures for display dates; Archivo proportional figures in sentences.
7. **Line length.** Body 30–38 characters per line at 390 px, at most 62 at desktop. Emotional lines ≤12 words.
   Titles and pull quotes ≤5 lines at 390 px.
8. **Wrapping.** `text-wrap: balance` on titles and lines; `text-wrap: pretty` on body; `hyphens: none`.
   Never leave a single word on the last line of a title.
9. **Colour.** `--ink` on light grounds, `--pearl` at night; labels in `--ink-soft` (or `--night-soft`);
   `--zari-ink` only for chapter marks and the Wedding figure; `--zari` text only at night.
10. **Motion.** Type is never animated letter by letter and is never parallaxed. Lines are revealed whole, by
    light (`animation-storyboard.md` §3, T4).
11. **No shadows, glows, outlines, gradients or textures on text.** The one exception is the nacre light that
    passes once across "Reception" at night.
12. **Minimum sizes.** 16 px for any reading text, 11 px for labels, 10 px for the Sample mark only.
13. **The Wedding is the one scene without a display-size event name.** Its `type-figure` "15" is the display
    size, so "The Wedding" is set in `type-label` directly above the figure (still the `<h3>`). *Why:* a 220 px
    figure plus a 44 px title plus reading text plus labels would be four sizes; the date carries the moment.

---

## 4. Signature treatment — names held apart by the thread

Used exactly three times: Scene 01 (masthead), Scene 02 (title scale, as the page's `<h1>`), Scene 08
(masthead, in pearl on night).

### Geometry at 390 × 844 (masthead version)

| Element | Position | Notes |
|---|---|---|
| "Rohan" | `type-masthead`, flush left at 18 px (optically −2 px for the R's serif), baseline at 39% of viewport height | high and left: the first name the eye meets |
| "MALHOTRA" | `type-label`, left 22 px, 12 px below Rohan's baseline | surnames whisper so first names can speak |
| "Anaya" | `type-masthead`, flush right at 372 px, baseline at 61% | low and right: the diagonal that the thread follows |
| "KAPOOR" | `type-label`, right-aligned at 368 px, 12 px below Anaya's baseline | |
| The thread | enters the left edge at 74%, passes through the gap between Rohan's baseline and Anaya's cap height, leaves the right edge at 28% | a gentle cubic curve, never a straight rule |
| The weave | the thread passes *behind* the left diagonal of Anaya's "A" and in front of everything else | one touch of craft; a small mask, nothing more |
| One pearl | 16 px (20 px in Scene 01, where it is the hero object), on the thread in the gap at about x 40%, left of centre | the full stop of the composition |

Scene 08 uses the same geometry raised by about 10% of the viewport (baselines at 30% and 48%) so the knotted
strand can lie beneath. At 1440 × 900 the same diagonal is used with names at 220 px and the thread crossing
the full width.

### Title-scale version (Scene 02, the `<h1>`)

"Rohan Malhotra" on line one and "Anaya Kapoor" on line three in `type-title`, flush left; line two is the
thread with its pearl. The visually hidden text reads "Rohan Malhotra and Anaya Kapoor", followed by the visible
line "are getting married" in `type-line`.

*Why the treatment exists:* see `creative-concept.md` §4.5. *Why only three times:* repetition would reduce the
signature to a logo lock-up.

---

## 5. Chapter marks

`०४` in `type-mark` + a 12 px gap + "Celebrations" in `type-label`. Placed at the top left of each scene's first
viewport, 32 px below the top safe area. Colour `--zari-ink` on light grounds, `--zari` at night.

*Why:* a numbered chapter makes the page read like a book or magazine; Devanagari numerals say where this
invitation comes from without a single ornament. The English word keeps it clear for every guest.

The time of day is **not** labelled. It is carried by light.

---

## 6. Loading

| Rule | Why |
|---|---|
| Self-host WOFF2 variable files from the OFL sources, subsetted: Imbue and Archivo to Latin (A–Z, a–z, 0–9, punctuation, ₹, •, –, ’, “ ”); Noto Serif Devanagari to ० – ९, the danda, and the characters of any invocation line in the data | fewer requests, no third-party font CSS blocking render, no Google Fonts request on guests' phones |
| Preload Imbue and Archivo; load Devanagari with `font-display: swap` | only the first two are needed for the opening |
| The opening timeline starts only after `document.fonts.load()` resolves for Imbue 300 and Archivo 520, or after 1.8 s, whichever comes first | names revealed by light must not reflow mid-reveal; the dark first frame hides the wait |
| Fallback `@font-face` rules with `size-adjust` and ascent/descent overrides for Georgia (Imbue) and Arial (Archivo) | keeps layout shift near zero if fonts are late |
| `font-synthesis: none` globally | no fake italics or bolds |
| Licences recorded in the asset manifest (`asset-plan.md` §5) | every shipped file has a source |

---

## 7. Accessibility

- Reading text 16 px minimum (body at 24 px line height); nothing smaller except labels (11 px) and the Sample
  mark (10 px).
- Every text colour pair is listed with its contrast in `visual-dna.md` §1.2; all reading text is ≥4.5:1.
- Visual line breaks inside names use separate elements with a single accessible string; the thread and pearl
  are `aria-hidden`.
- Chapter numerals have an accessible label ("Chapter 4, Celebrations").
- Rotated text (Sangeet) is a single word and is read normally by screen readers.
- Text resizes with browser zoom up to 200% without horizontal scroll; masthead names use `clamp`, so they
  shrink before they overflow.
