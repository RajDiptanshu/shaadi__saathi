---
name: wedding-art-direction
description: Art-direction standards for Shaadi Saathi wedding invitations — concept, composition, colour, typography, cultural coherence and anti-patterns. Use before designing or changing the look of any invitation (new design concepts, scene layouts, palettes, type, copy tone), and when reviewing whether a design reads as premium or templated.
---

# Wedding art direction

Standards for every invitation built in this repository. The flagship reference is **Mogra & Moti**
(`docs/mogra-moti/`); read its `creative-concept.md` and `visual-dna.md` before designing anything new so the
quality bar is calibrated.

## 0. Before anything

1. **Legacy is frozen.** `site/demo/*` (haveli-jharokha, mogra-moti, premiere-night, rang-mela) and the old
   catalogue design are legacy. Never edit, delete, redesign, or use them as a visual reference. Their
   engineering may be reused; their design may not (`docs/legacy-audit.md` → "Never copy").
2. **New work lives in its own namespace:** `site/invitations/<slug>/`, docs in `docs/<slug>/`.
3. **Plan before pixels.** The user wants a layout plan / storyboard and a numbered question list with defaults
   *before* a design is built. Don't jump to building a new design.
4. **Phase gating.** The flagship programme runs in phases; finish the requested phase, report, then stop and
   wait for the next instruction.

## 1. A design needs a concept, not a theme

A design is ready to build only when all of these exist in `docs/<slug>/creative-concept.md`:

- **One-sentence idea** rooted in a real material, ritual or gesture (Mogra & Moti: "one strand being made,
  from dawn to night").
- **Emotional arc** across the scroll with the peak at the end, not in the first two seconds.
- **The ten answers:** recognisable by · signature opening · signature material · signature transition ·
  signature type treatment · signature image treatment · Indian without stereotype · premium not template ·
  hierarchy at 390 px · what the guest remembers.
- **A WHY for every major decision.** If a choice has no reason beyond "it looks nice", it isn't decided.

Reject a concept if its signatures could be swapped into any other wedding site unchanged.

## 2. Composition rules

| Rule | Detail |
|---|---|
| Scenes, not sections | Each scene has its own composition, rhythm, entrance and purpose. No repeated "title → lede → box" recipe. |
| Hierarchy per viewport | moment (image or names, 45–70%) → fact (one large type) → action (lower 40%) → details. One of each. |
| Limits | ≤3 competing elements and ≤3 type sizes per viewport. |
| Alignment | Left by default. Centring is reserved for one deliberate moment (Mogra & Moti: the Wedding). |
| Photographs | Bleed off exactly one screen edge; no equal-margin floating photos; no borders, radii or drop shadows on flat photos. |
| Text on photos | Only on dark images with a scrim guaranteeing ≥4.5:1. |
| No UI furniture | No cards, pills, badges, icons, gradient buttons, glassmorphism. Links are words (label type) with an underline treatment. |
| Fixed chrome | Only a small Sample mark and the music control. Never a floating sales pill over art; the studio call to action sits at the end. |
| Grid at 390 | 20 px margins, 6 columns, 10 px gutters, 4 px baseline, spacing scale 4·8·12·20·32·52·84·136, `svh` units. |

## 3. Colour rules

1. **Every colour comes from a material in the concept** — write the source next to each token.
2. **No pure white or black** (Mogra & Moti bounds: `#FAF8F2` … `#15110E`).
3. **Contrast table required** for every text colour on every ground it may appear on; reading text ≥4.5:1,
   large display ≥3:1. Decorative colours are marked "never text".
4. **Accent scarcity:** one accent per scene at most; gold as a thread or rule, never as a gradient fill.
5. Grounds change only at scene transitions, never mid-reading.

## 4. Typography rules

- **≤3 families**, each with a defined job. Prefer families with optical-size or width axes so one family
  covers two voices.
- **Names read like an editorial title**, not a stationery card. Render candidates at 390 px before choosing
  and record the comparison (Mogra & Moti chose Imbue over Bodoni Moda this way).
- **Script faces:** not by default. Allowed only with a written reason in the concept doc and never for
  labels, information or body. Banned in Mogra & Moti.
- No fake italics (`font-synthesis: none`), no tracking on Devanagari, no letter-by-letter animation, no
  shadows/glows/outlines on type, no more than 3 sizes per viewport.
- Dates in Indian English order ("Monday 15 February 2027", "7:30 pm", en dash ranges).
- Legacy pairings are banned: Italiana + Jost, Rozha One + Marcellus, Limelight + Oswald, Caprasimo + Baloo 2.
  Also avoid wedding/template defaults: Cormorant, Playfair Display, Great Vibes-style scripts, Inter/DM Sans/
  Poppins/Montserrat as the "safe" sans.

## 5. Cultural coherence

- Carry meaning through **materials, rituals of the hand, and language** (e.g. mogra strung as buds, the
  gathbandhan knot, chikankari shadow work, real henna colour, Devanagari numerals, instrument choice).
- **Stereotype list (do not use as decoration):** mandalas, paisleys, elephants, Ganesha clip-art,
  red-and-gold by default, marigold swags, diya icons, palace silhouettes, dhol graphics, "Bollywood" kitsch.
- **Ritual text is content, not decoration:** invocation lines (e.g. "॥ श्री गणेशाय नमः ॥"), honorifics and
  family order are supported as optional data fields and set correctly.
- Check ritual accuracy: event names and order for the tradition, what happens at each ceremony, photographs
  that actually show that tradition.

## 6. Data and copy

- **No wedding detail inside components.** Everything a guest reads comes from `details.js` (`window.INVITE`),
  bound with `data-t`, `data-date`, `data-attr`, `data-if`, `data-each`.
- **Invented demo details are registered** in `placeholders` with a path and note. Never present them as a
  real wedding; keep `sample: true` and the Sample mark.
- **The repository is public.** Never add a real couple's names, phone numbers, addresses or sheet URLs.
- Copy is written, short and specific: a line of meaning per scene, emotional lines ≤12 words, body ≤45 words.
  No filler headings, exclamation marks, emoji or "❤️".

## 7. Anti-patterns (defects, not taste)

- Openings that are barriers parting — curtains, envelopes, wax seals, doors, shutters, scratch foil — used
  as the default (they are every competitor's opening; justify in writing if a concept truly needs one).
- A centred hero with stacked names, "&", date and a scroll cue.
- Identical event cards; timelines with dots; countdown tiles; dress-code swatch racks.
- Stock couples smiling at camera; AI faces; drawn flowers; text inside images.
- Everything pale from top to bottom (nothing builds).
- A floating saturated "Get this design" pill.

## 8. Decision checklist before committing a visual change

- [ ] Does it serve the concept's one-sentence idea?
- [ ] Is there a WHY written down (doc or commit message)?
- [ ] Does every viewport still obey moment → fact → action → detail and the 3/3 limits?
- [ ] Are all text colours from the contrast table?
- [ ] Is any legacy design language creeping back in?
- [ ] Would this frame survive being screenshotted and forwarded on its own?
- [ ] Was it rendered at 390×844 and looked at (not just reasoned about)?

## References

- `docs/mogra-moti/creative-concept.md` — idea, ten answers, principles, anti-patterns
- `docs/mogra-moti/visual-dna.md` — colour tokens and contrast, photography, composition, interface elements
- `docs/mogra-moti/typography-system.md` — type roles, scale, signature treatment
- `docs/legacy-audit.md` — what must never be copied
