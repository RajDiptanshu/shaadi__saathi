---
name: wedding-design-evaluation
description: The evaluation constitution for Shaadi Saathi invitations — the render-score-fix loop, the capture protocol, the 100-point rubric with concrete score anchors, critical gates, P0/P1/P2 severity, the opening hero gate, how to write findings and document iterations in docs/<slug>/design-evaluation.md, with common evaluation failure modes and examples of what not to do. Use after building or changing any scene, whenever asked to score, critique or iterate on a design, and before calling a design finished.
---

# Wedding design evaluation

**The rendered experience is the source of truth.** Anything not rendered and looked at is unscored. Never score
from source code, docs or memory of a previous render.

**Canonical sources:** the master brief's rubric and gates; `docs/mogra-moti/animation-storyboard.md` §7.6 (hero-gate
frames); `docs/legacy-audit.md` (calibration score).

---

## 1. The loop

**BUILD → RUN → RENDER → SCREENSHOT → RECORD → INSPECT → SCORE → IDENTIFY → FIX → RENDER AGAIN**

1. **Hero gate first.** Build the opening and entry, iterate until **Opening ≥18/20**, then give other scenes major
   effort.
2. **At most 5 major iterations** per design. Stop at the target or at iteration 5 — then report honestly what
   remains.
3. **Fix the top 3 problems per iteration**, P0s first. Change few things at a time, so each score change has a known
   cause.
4. **Fix composition before animation.** A weak still frame is never rescued by motion.
5. **Re-render after every fix** before re-scoring. A fix that hasn't been rendered hasn't happened.

## 2. Capture protocol

Status: Playwright 1.63 with Chromium is installed; scene capture scripts are written with the opening in Phase 4
(`tools/capture/`). Captures can't be trusted from the Browser preview pane (no rAF or observers) or from headless
Edge for animated states.

1. Serve over http and open with `?test`.
2. **Seek, don't guess:** `?test&tl=<timeline>&t=<s>` for time-based frames; `?test&scene=<id>&p=<0–1>` for
   scroll-linked frames.
3. **Opening (Mogra & Moti):** normal t = 0.5, 1.5, 2.5, 3.2, 4.0, 4.8, 5.6, 6.5 s, then after the tap +0.12, +0.6,
   +1.15, +1.6, +2.2 s; reduced (`?rm=1`) t = 0.5, 1.2, 1.8, 2.3 s, then after the tap +0.3, +0.9 s.
4. **Scenes:** first viewport, mid state, and each transition at progress 0 / 0.5 / 1.
5. **Viewports:** 390×844, 393×852, 412×915, 1440×900.
6. **Video:** full opening + entry, and a scroll-through, normal mode, 390×844.
7. Save compressed stills and contact sheets in `docs/<slug>/evaluation/iteration-<n>/`; keep raw video out of git.
8. **Open and look at every image before scoring.**

## 3. Rubric — 100 points

Score each category with a written reason tied to specific frames. Anchors define the bands.

### Art Direction — 20
- **18–20** unmistakable identity; every scene composed for its purpose; restraint; one consistent light; the
  signatures visible; nothing could come from a template.
- **14–17** strong identity, but 1–2 scenes fall back on generic layouts or a signature is weak.
- **10–13** coherent palette and type on a template structure (repeated section recipe, centred stacks, boxes).
- **<10** generic wedding website or legacy design language.

### Image Quality — 15
- **14–15** authentic, well lit, graded to one light, deliberate crops and focal points, no AI artefacts; reads as
  one shoot.
- **11–13** good images with 1–2 weak crops, mismatched grades or one stock-feeling frame.
- **7–10** placeholders, obvious stock, inconsistent light.
- **<7** missing images, low resolution, AI faces or hands, text in images.

### Opening Experience — 20
- **18–20** a title sequence, not a hero: causal choreography from the first frame to the tap; curiosity within
  2 s; names readable by ~5 s; tap feedback ≤100 ms; the entry is a genuine transition into the invitation; at least
  one frame worth screenshotting; the reduced cut still tells the story.
- **14–17** choreographed, with one weak link: independent motion, dead time over 1.2 s, a generic reveal, or a
  weak entry.
- **10–13** an animated hero: elements fade in; the entry is a cross-fade.
- **<10** static, broken, slow to start, or a curtain/envelope template.

### Motion Design — 15
- **14–15** every motion has a visible cause; tokens used; ≤3 movers (counting rules in `wedding-motion` §2);
  stillness while reading; transitions from the vocabulary; smooth; reduced cut per policy.
- **11–13** mostly purposeful; 1–2 generic reveals or timing issues.
- **7–10** fade-ups and simultaneous independent animation.
- **<7** jank, bounce or elastic, particles, motion over text.

### Typography — 10
- **9–10** editorial scale contrast; the signature treatment executed precisely; ≤3 families; ≤3 sizes per viewport
  (with the stated exemptions); reading text 16 px; clean rags, no widows; Devanagari set correctly.
- **7–8** a good system with small spacing, rag or hierarchy slips.
- **5–6** generic sizes, weak hierarchy, near-duplicate sizes, cramped or over-tracked labels.
- **<5** unreadable text, script overuse, fallback fonts visible.

### Composition — 10
- **9–10** every viewport has one moment, one fact, one action; bleed and asymmetry deliberate; spacing on scale;
  nothing collides.
- **7–8** strong, with a couple of crowded or empty viewports.
- **5–6** stacked blocks, centred defaults, dead space.
- **<5** overlapping, clipped or confusing layouts.

### Cultural Coherence — 5
- **5** meaning through materials and rituals; accurate ceremonies and text; no stereotype decoration.
- **3–4** mostly right, with one cliché or inaccuracy.
- **<3** costume-party Indian styling or ritual errors.

### Mobile Experience — 5
- **5** right at all three phone sizes; actions in the thumb zone; ≥44 px targets; safe in in-app browsers; budgets met.
- **3–4** minor overflow or reach issues.
- **<3** broken layout, tiny targets, janky scrolling.

**Target:** 90+/100.

**Critical gates — all required:** Opening ≥18/20 (9/10) · Art Direction ≥17/20 (8.5/10) · Image Quality ≥13/15
(8.5/10, rounded up) · Motion Design ≥13/15 (8.5/10, rounded up) · **zero P0 issues**. A design over 90 that fails a
gate is not finished.

**Calibration:** the legacy Mogra & Moti scored an indicative **38/100** (Art Direction 7, Image 1, Opening 9,
Motion 6, Typography 5, Composition 3, Culture 3, Mobile 4).

## 4. Severity

| Level | Meaning | Examples | Action |
|---|---|---|---|
| **P0** | critical | broken or stuck opening; unusable phone layout; obviously broken animation; broken RSVP; missing major assets; AI-looking faces; unreadable text; generic/template identity; major interaction failure | fix immediately, before anything else |
| **P1** | major quality problem | weak crop; generic transition; bad pacing; weak layering; poor spacing; inconsistent composition; weak gallery; poor hierarchy | fix before final |
| **P2** | polish | minor spacing, timing, type refinement, small alignment | fix where useful |

**Consistency rule:** an open P0 in a category caps that category below its top band.

## 5. Documenting an iteration

Append to `docs/<slug>/design-evaluation.md`:

```markdown
## Iteration <n> — <date>

**Captures:** docs/<slug>/evaluation/iteration-<n>/ (file list)

| Category | Score | Reason (with frame and viewport) |
|---|---|---|
| Art Direction | /20 | |
| Image Quality | /15 | |
| Opening Experience | /20 | |
| Motion Design | /15 | |
| Typography | /10 | |
| Composition | /10 | |
| Cultural Coherence | /5 | |
| Mobile Experience | /5 | |
| **Total** | **/100** | Gates: Opening ✓/✗ · Art ✓/✗ · Image ✓/✗ · Motion ✓/✗ · P0 count |

**P0:** … **P1:** … **P2:** …

**Top 3 problems**
1. <frame, viewport> — <what is wrong> because <cause>.

**Changes made**
- …

**New score after re-render:** /100

**Remaining issues:** …
```

The final summary goes in `docs/<slug>/final-design-evaluation.md`.

## 6. Writing a finding

Name the frame, the viewport, the elements and the cause, so someone else could fix it without seeing the screen.

- ✓ "Opening at t=2.5 s, 390×844: feels like a website hero rather than a title sequence because the pearl, silk and
  typography enter independently without spatial cause-and-effect — the silk starts 200 ms before the pearl stops, so
  nothing appears to move it."
- ✓ "Celebrations / Sangeet, 393×852: the vertical 'Sangeet' collides with the photo's left edge by 6 px, and the
  info block starts level with the photo's top, so the eye has no entry point."
- ✓ "Welcome, 412×915: the P01 crop cuts the thread out of the hands (focal point recorded at y 0.3; the thread is at
  y 0.62)."

---

## 7. Common evaluation failure modes

| Failure | Symptom | Fix |
|---|---|---|
| Scoring the intention | scores reference what the code does, not what the frame shows | score only from captures you have opened |
| Grade inflation | 85+ while P1s pile up; "almost there" every iteration | apply anchors literally; cap categories with open P0s |
| One-viewport review | 390×844 perfect, 412×915 broken | full viewport matrix each iteration |
| Forgetting the reduced cut | reduced mode never captured | capture both modes every iteration |
| Unattributable change | score moved but nobody knows why | fix the top 3 only, re-render, re-score |
| Animation band-aid | adding motion to hide a weak composition | fix the still frame first |
| Frozen-preview verdicts | calling motion broken from a pane screenshot | Playwright captures only |
| Vague findings | "improve spacing" | frame + viewport + elements + cause |
| Moving the goalposts | lowering a gate to finish | gates are fixed; report the gap instead |

## 8. What NOT to do (examples)

```text
✗ "Iteration 2: 92/100. Looks beautiful, very premium."
✗ "Opening could be better."
✗ "Typography 9/10" while a screen shows 15, 16 and 18 px text together.
✗ "Motion 14/15" scored from reading the GSAP timeline, with no capture opened.
✗ Declaring the design finished at 91/100 with Image Quality 11/15.
✗ Iteration 6 because "one more pass" — the maximum is 5; report what remains.
✗ Skipping the hero gate and building all eight scenes first.
✗ Committing raw screen recordings to git.
```
