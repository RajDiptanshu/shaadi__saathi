---
name: wedding-qa
description: The technical QA constitution for Shaadi Saathi invitations — what "done" means, the test matrix, opening and entry, scenes and design rules, RSVP to Google Sheets, links, sound, gallery, accessibility, share previews, legacy regression, content safety, deploy checks and how to report, with common failure modes and concrete examples of what not to do. Use before reporting any scene, phase or invitation as done, after changing shared engine code, and before any deploy.
---

# Wedding QA

**Done means rendered and exercised** on every viewport below, in every motion mode, with each check marked pass,
fail (with the reason) or not run (with the reason). "Looks fine" is not a result.

**Canonical sources:** `docs/mogra-moti/animation-storyboard.md` (expected behaviour), `scene-architecture.md`
§5–9 (hooks, markup contract, accessibility, performance), `docs/repository-audit.md` (engine contracts),
`docs/legacy-audit.md` (freeze policy).

Status: Playwright 1.63 (Chromium) and `tools/serve.js` exist since Phase 3; test specs under `tests/` arrive with the
first scene. Until a check has a spec or a manual run, list it as not run instead of assuming it passes.

---

## 1. Test matrix

| Viewports | Motion modes | Entry points |
|---|---|---|
| 390×844 · 393×852 · 412×915 · 1440×900 | normal · reduced (`?rm=1`) · still (`?still`) | cold load · `?open` · `#rsvp` · returning visitor |

Real-device pass before any deploy: the link opened from a WhatsApp message on an Android phone and an iPhone.

## 2. Opening and entry

- [ ] First frame is the designed dark frame — no flash of unstyled content, fallback fonts or unsized images.
- [ ] Opening waits for fonts and T01–T04, O01–O03, O06 (max 1.8 s).
- [ ] Hero-gate frames captured at every viewport in both modes (`wedding-design-evaluation` §2).
- [ ] A tap before 1.2 s is queued; after 1.2 s it fast-forwards at 4× then enters; tap feedback ≤100 ms.
- [ ] Enter and Space open; Escape does not.
- [ ] After entry: scroll unlocks, `#invite` loses `inert`, focus is on the `<h1>`, the music control appears.
- [ ] Returning visitor: opening at 1.6×, hint shown immediately.
- [ ] With animation frames blocked before scripts run, every scene shows its final readable state.

## 3. Scenes and design rules

- [ ] Every scene's first viewport: moment → fact → action → detail; ≤3 competing elements.
- [ ] ≤3 type sizes per viewport (exempt: Devanagari numeral, invocation, Sample mark, music control).
- [ ] No collisions or clipping with the Sample mark or the music control at any viewport.
- [ ] Spacing values come from the scale (4 · 8 · 12 · 20 · 32 · 52 · 84 · 136).
- [ ] Photos bleed one edge except the declared exceptions; no text on light photos.
- [ ] Pinned sections release cleanly; phone scroll-linked distance ≤320 svh; entrances don't replay on scroll-up.
- [ ] Reduced cut keeps the narrative and transitions (not static, not full motion).
- [ ] Each photo loads a sensible `srcset` candidate, holds its focal point and has manifest alt text.

## 4. RSVP (`site/engine/rsvp.js` + `apps-script/Code.gs`)

- [ ] Validation: missing name; missing accept/decline; "accepts" with no celebration → inline errors in `--err`,
      focus moves to the first problem, errors announced.
- [ ] Guest count stays within 1…`maxGuests`.
- [ ] Sample (`sample: true`, empty endpoint, non-https or a claude host) → sending is **simulated** and the
      "replies aren't saved" note is visible.
- [ ] Stored reply restores on reload; "Change my reply" works; resubmitting updates the same row (same reply id).
- [ ] **Celebrations match by id** end to end; a name that differs from the sheet's list is not silently dropped.
- [ ] Formula-like input (`=SUM(1)`) is stored as text.
- [ ] Success adds the pearl to the strand, plays the bead sound (unless muted) and moves focus to the thank-you.
- [ ] Live sheet (real orders only, with the user's approval): a test reply lands in the RSVPs tab and Summary
      counts update. **Ask the user to delete test rows themselves**; never delete rows.

## 5. Links and sound

- [ ] Directions opens Google Maps for the neighbourhood query in a new tab.
- [ ] Add to calendar: Google Calendar on Android and desktop; `.ics` on Apple; IST times; correct titles.
- [ ] No sound before the tap; the tap's sound at once; music from ~400 ms with a 3 s fade to 0.55; mute persists
      across reloads; audio suspends when the tab is hidden and resumes; the closing fade happens; the loop has no
      audible gap; effects respect mute.

## 6. Gallery

- [ ] Native swipe with snap; the next frame peeks from the right edge.
- [ ] Viewer opens on tap and Enter; focus trapped; Escape and "Close" work; focus returns to the frame; arrows move.

## 7. Accessibility

- [ ] One `<h1>` (Scene 02); an `<h2>` per scene labelled like "Chapter 4, Celebrations"; an `<h3>` per celebration
      (the Wedding's in label style is still an `<h3>`).
- [ ] Decorative layers `aria-hidden`; split names read as one string; the cover button is labelled.
- [ ] Text colours only from the contrast table; reading text ≥4.5:1; text sizes ≥16 px reading, ≥11 px labels.
- [ ] Visible focus on every control; targets ≥44 px; nothing hover-only.
- [ ] 200% text zoom without horizontal scrolling.
- [ ] Skip link "Skip to reply" appears on keyboard focus.

## 8. Share previews

- [ ] `og:title`, `og:description` and an **absolute** `og:image` URL (1200×630) whose file exists.
- [ ] Paste the deployed link into WhatsApp and check the preview.

## 9. Legacy regression

- [ ] **Before the first change to any `site/engine/` file:** capture the four legacy demos (cover, `?open`, one
      mid-page frame) at 390×844 as the baseline.
- [ ] After every engine change: recapture and compare. Any visual difference in a legacy demo is a regression to
      fix, not accept.

## 10. Content and safety

- [ ] No wedding detail hard-coded in markup or scene code; all bound to `details.js`.
- [ ] Every invented value is in `placeholders`; `sample: true`; the Sample mark is visible and screen-reader readable.
- [ ] No real person's name, phone number, address or sheet URL in this public repository.
- [ ] Every shipped asset has a manifest entry with licence fields; identifiable people flagged.

## 11. Deploy

- [ ] `site/_test/` and all tooling are outside the deploy root or excluded.
- [ ] Budgets from `wedding-performance` measured and within limits.
- [ ] **Never deploy or publish without the user's approval.**

## 12. How to report

For each run, state: viewports × modes covered; checks passed; checks failed with the frame/viewport and the
cause; checks not run and why; screenshots or captures that prove it. Use P0/P1/P2 from
`wedding-design-evaluation` §4 for failures.

## 13. Environment notes (this machine)

- Reload PATH from the registry before `node`/`npm` in a fresh shell.
- Pages block scripts on `file://`; serve over http.
- A port may already be held by a server from an earlier session; check before assuming a start failed.
- The Browser preview pane doesn't run rAF or IntersectionObserver and freezes CSS transitions at t=0 — use it for
  DOM questions only. Headless Edge can't lay out narrower than ~500 px (use a 390 px iframe) and is unreliable for
  rAF-driven states. PDFs: some viewers (pdf.js in Firefox and GitHub previews) paint certain CSS gradients hot pink.

---

## 14. Common failure modes (things that slip through)

| Failure | Why it slips through | How to catch it |
|---|---|---|
| Focus stranded on the removed cover | opening tested with a mouse only | keyboard-only run: Tab after entry |
| `#invite` still `inert` | desktop testers scroll anyway | try to tab into a link after entry |
| Simulated RSVP mistaken for working | sample mode shows the thank-you | test a real endpoint only for real orders; label the result "simulated" |
| Celebrations dropped by the sheet | client and server lists drift | a reply with every celebration; read the row |
| iPhone silent-switch mute | tested only on Android or desktop | real iPhone with the switch on silent |
| Share preview broken | relative or missing `og:image` | WhatsApp paste on the deployed link |
| Legacy demo quietly changed | no baseline captured before an engine edit | baseline first, compare after |
| 412 px crop cuts the subject | only 390 px checked | full viewport matrix |
| Reduced cut is static | only normal mode checked | `?rm=1` in every run |
| Toolbar-resize pin jump | desktop emulation only | real phone in the WhatsApp browser |

## 15. What NOT to do (examples)

```text
✗ "Tested, works."                                   → which viewports, which modes, which checks?
✗ Declaring the RSVP done because the thank-you appeared in sample mode.
✗ Calling an animation "broken" from a Browser pane screenshot frozen at t=0.
✗ Deleting a row from a couple's RSVP sheet to "clean up" — ask the user.
✗ Editing site/engine/core.js and only then capturing the legacy demos.
✗ Checking the opening at 390×844 only.
✗ Deploying because "the user will want to see it live".
✗ Leaving site/_test/ in the deployed folder.
✗ Skipping a check silently because the tool isn't installed yet.
```
