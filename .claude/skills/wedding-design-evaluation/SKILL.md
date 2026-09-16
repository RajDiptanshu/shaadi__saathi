---
name: wedding-design-evaluation
description: The autonomous visual evaluation loop for Shaadi Saathi invitations — how to capture renders, score against the 100-point rubric with concrete anchors, apply critical gates and P0/P1/P2 severity, enforce the opening hero gate, and document each iteration in docs/<slug>/design-evaluation.md. Use after building or changing any scene, whenever asked to score, critique or iterate on a design, and before calling a design finished.
---

# Wedding design evaluation

**The rendered experience is the source of truth.** Code that "should" look right is unscored. Never score from
reading source files.

## 1. The loop

**BUILD → RUN → RENDER → SCREENSHOT → RECORD → INSPECT → SCORE → IDENTIFY → FIX → RENDER AGAIN**

- Maximum **5 major iterations** per design. Don't stop because it works; stop at the target or at iteration 5,
  and report honestly what remains.
- **Hero gate:** build the opening first and iterate on it until Opening ≥18/20 (9/10) before spending major
  effort on other scenes.
- Fix composition before animation: if a still frame is weak, better motion won't save it.

## 2. Capture protocol

Status: Playwright capture tooling arrives in Phase 3 (`tools/capture/`). Until then, captures cannot be
trusted from the Browser preview pane (rAF and observers don't run) or from headless Edge for animated states.

For every iteration:
1. Serve over http; open with `?test`.
2. **Seek, don't guess:** use `?test&tl=<timeline>&t=<s>` for time-based frames and
   `?test&scene=<id>&p=<0–1>` for scroll-linked frames.
3. **Opening frames** (Mogra & Moti; other designs take theirs from their storyboard):
   normal t = 0.5, 1.5, 2.5, 3.2, 4.0, 4.8, 5.6, 6.5 and after the tap +0.12, +0.6, +1.15, +1.6, +2.2 s;
   reduced (`?rm=1`) t = 0.5, 1.2, 1.8, 2.3 and after the tap +0.3, +0.9 s.
4. **Scenes:** each scene's first viewport, its mid state, and every transition at 0 / 0.5 / 1.
5. **Viewports:** 390×844, 393×852, 412×915, 1440×900.
6. **Video:** one recording of the full opening + entry, and one scroll-through, normal mode, 390×844.
7. Save compressed stills (JPEG/WebP) and contact sheets under `docs/<slug>/evaluation/iteration-<n>/`; keep raw
   video out of git.
8. **Look at every image before scoring it.**

## 3. Rubric (100 points)

Score each category with a written reason. Anchors define what a score means; interpolate between them.

### Art Direction — 20
- **18–20:** an unmistakable identity; every scene composed for its purpose; restraint; one light; the
  concept's signatures visible; nothing could come from a template.
- **14–17:** strong identity with 1–2 scenes that fall back to generic layouts or a weak signature.
- **10–13:** coherent palette and type but template structure (repeated section recipe, centred stacks, boxes).
- **<10:** generic wedding website or legacy design language.

### Image Quality — 15
- **14–15:** authentic, well-lit, graded to one light; crops and focal points deliberate; no AI artefacts; images
  feel like one shoot.
- **11–13:** good images with 1–2 weak crops, mismatched grades or a stock-feeling frame.
- **7–10:** placeholders, obvious stock, inconsistent light.
- **<7:** missing images, low resolution, AI faces, text in images.

### Opening Experience — 20
- **18–20:** a title sequence, not a hero: causal choreography from first frame to tap; curiosity in the first
  2 s; names readable by ~5 s; tap feedback ≤100 ms; the entry is a genuine transition; a frame worth
  screenshotting; the reduced cut still tells the story.
- **14–17:** choreographed but one weak link (independent motion, dead time >1.2 s, generic reveal, weak entry).
- **10–13:** an animated hero; elements fade in; entry is a cross-fade.
- **<10:** static, broken, slow to start, or a curtain/envelope template.

### Motion Design — 15
- **14–15:** every motion has a visible cause; tokens used; ≤3 movers; stillness while reading; transitions from
  the design's vocabulary; smooth at 60 fps; reduced cut per policy.
- **11–13:** mostly purposeful; 1–2 generic reveals or timing issues.
- **7–10:** fade-ups and simultaneous independent animations.
- **<7:** jank, bounce/elastic, particles, motion over text.

### Typography — 10
- **9–10:** editorial scale contrast; signature treatment executed precisely; ≤3 families, ≤3 sizes per viewport;
  perfect rags, no widows; Devanagari set correctly.
- **7–8:** good system with small spacing, rag or hierarchy slips.
- **5–6:** generic sizes, weak hierarchy, cramped or over-tracked labels.
- **<5:** unreadable, script overuse, fallback fonts showing.

### Composition — 10
- **9–10:** each viewport has one moment, one fact, one action; asymmetry and bleed used deliberately; spacing on
  scale; nothing collides.
- **7–8:** strong with a couple of crowded or empty viewports.
- **5–6:** stacked blocks, centred defaults, dead space.
- **<5:** overlapping, clipped or confusing layouts.

### Cultural Coherence — 5
- **5:** meaning through materials and rituals; accurate ceremonies and text; no stereotype decoration.
- **3–4:** mostly right with one cliché or inaccuracy.
- **<3:** costume-party Indian styling or ritual errors.

### Mobile Experience — 5
- **5:** perfect at all three phone sizes; thumb-zone actions; ≥44 px targets; in-app browser safe; budgets met.
- **3–4:** minor overflow or reach issues.
- **<3:** broken layout, tiny targets, janky scrolling.

**Target:** 90+/100.

**Critical gates (all required to pass):** Opening ≥18/20 · Art Direction ≥17/20 · Image Quality ≥13/15 ·
Motion ≥13/15 · **zero P0 issues.** A design scoring 90+ that fails a gate is not finished.

**Calibration:** the legacy Mogra & Moti scored an indicative **38/100** (Opening 9/20, Art Direction 7/20,
Image 1/15) — see `docs/legacy-audit.md`.

## 4. Severity

| Level | Meaning | Examples | Action |
|---|---|---|---|
| **P0** | Critical | broken or stuck opening; unusable phone layout; obviously broken animation; broken RSVP; missing major assets; AI-looking faces; unreadable text; generic/template identity; major interaction failure | fix immediately, before any other work |
| **P1** | Major quality problem | weak crop; generic transition; bad pacing; weak layering; poor spacing; inconsistent composition; weak gallery; poor hierarchy | fix before final |
| **P2** | Polish | minor spacing, timing, type refinement, small alignment | fix where useful |

## 5. Writing the evaluation

Append to `docs/<slug>/design-evaluation.md` for every iteration:

```markdown
## Iteration <n> — <date>

**Captures:** docs/<slug>/evaluation/iteration-<n>/ (list the files)

| Category | Score | Reason |
|---|---|---|
| Art Direction | /20 | … |
| Image Quality | /15 | … |
| Opening Experience | /20 | … |
| Motion Design | /15 | … |
| Typography | /10 | … |
| Composition | /10 | … |
| Cultural Coherence | /5 | … |
| Mobile Experience | /5 | … |
| **Total** | **/100** | Gates: pass/fail per gate |

**P0:** … **P1:** … **P2:** …

**Top 3 problems** (each with the frame and viewport where it shows)
1. …

**Changes made**
- …

**New score:** /100 (after re-render)

**Remaining issues:** …
```

Final summary goes in `docs/<slug>/final-design-evaluation.md`.

## 6. How to write a finding

Be specific enough that someone else could fix it without seeing the screen. Name the frame, the viewport, the
elements, and the cause.

- ✗ "Looks beautiful." ✗ "Opening could be better." ✗ "Improve spacing."
- ✓ "Opening at t=2.5 s, 390×844: feels like a website hero rather than a title sequence because the pearl, silk
  and typography enter independently without spatial cause-and-effect — the silk starts 200 ms before the pearl
  stops, so nothing appears to move it."
- ✓ "Celebrations/Sangeet, 393×852: the vertical 'Sangeet' collides with the photo's left edge by 6 px and the
  info block starts at the same height as the photo, so the eye has no entry point."

Scores must match findings: a P0 cannot coexist with a category score in its top band.
