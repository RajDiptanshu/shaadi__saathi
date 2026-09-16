---
name: wedding-qa
description: Technical QA checklist for Shaadi Saathi invitations — viewports, reduced motion, the opening and entry interaction, RSVP to Google Sheets, calendar and map links, music, gallery, accessibility, share previews, legacy regression, content safety and deploy checks. Use before reporting any scene, phase or invitation as done, after changing shared engine code, and before any deploy.
---

# Wedding QA

"It works on my screen" is not done. Done means it was **rendered and exercised** on the viewports below, in
both motion modes, and every item here passed or was reported as failing with a reason.

Status: Playwright and the capture tools are set up in Phase 3 (`tests/`, `tools/capture/`, `tools/serve.js`).
Until they exist, report which checks could not run instead of assuming they pass.

## 1. Matrix

| Viewports | Modes | Entry points |
|---|---|---|
| 390×844, 393×852, 412×915, 1440×900 | normal, reduced (`?rm=1`), still (`?still`) | cold load, `?open`, `#rsvp`, returning visitor (stored flag) |

## 2. Opening and entry

- [ ] First frame is the designed dark/quiet frame, never a flash of unstyled content or fallback fonts.
- [ ] Opening waits for fonts and first-frame images, max 1.8 s.
- [ ] Hero-gate frames (from the storyboard) captured at every viewport, both modes.
- [ ] Tap before 1.2 s is queued; tap after fast-forwards and enters; tap feedback ≤100 ms.
- [ ] Enter and Space open; Escape does not.
- [ ] After entry: scroll unlocks, `#invite` is no longer `inert`, focus moves to the `<h1>`.
- [ ] Returning visitor gets the faster opening.
- [ ] With animation frames disabled (simulate by blocking rAF before scripts run), every scene still shows its
      final readable state.

## 3. Scenes

- [ ] Every scene's first viewport obeys moment → fact → action → detail; ≤3 type sizes.
- [ ] No text overlaps, clipping or collisions with the Sample mark or music control at any viewport.
- [ ] Pinned transitions release cleanly; scrolling back up doesn't replay entrances.
- [ ] Language switch (if the design has one) rebuilds content without orphaned animations.
- [ ] Every photo loads the right `srcset` candidate, holds its focal point, has alt text from the manifest.

## 4. RSVP (reuse `site/engine/rsvp.js` + `apps-script/Code.gs`)

- [ ] Validation: missing name, missing yes/no, "yes" with no celebrations → inline errors, focus moves to the
      first problem, messages announced.
- [ ] Guest stepper respects 1…`maxGuests`.
- [ ] Sample/demo (`sample: true`, empty endpoint, non-https, or claude host) → send is **simulated** and the
      "sample, replies aren't saved" note is visible.
- [ ] Stored reply restores on reload; "Change my reply" works; resubmitting updates the same row (same reply id).
- [ ] **Events match by id** end to end; a celebration whose display name differs from the sheet's list is not
      silently dropped.
- [ ] Live endpoint (real orders only, with the user's approval): a test reply lands in the RSVPs tab and the
      Summary counts update; ask the user to delete test rows themselves.
- [ ] Formula-like input (`=SUM(1)`) is stored as text.

## 5. Links and sound

- [ ] Directions opens Google Maps to the neighbourhood/venue query in a new tab.
- [ ] Add to calendar: Google Calendar link on Android/desktop; `.ics` download on Apple devices; correct IST
      times and titles.
- [ ] No sound before the tap; the tap's sound plays; music fades in; mute persists across reloads; music
      pauses when the tab is hidden and resumes on return; closing fade happens; seamless loop (no gap at the wrap).
- [ ] Sound effects respect mute.

## 6. Gallery

- [ ] Native swipe with snap; the next frame peeks.
- [ ] Viewer: opens on tap/Enter, focus trapped, Escape and "Close" work, focus returns to the frame, arrow keys
      navigate.

## 7. Accessibility

- [ ] One `<h1>`; an `<h2>` per scene; `<h3>` per celebration; landmarks present.
- [ ] Decorative layers `aria-hidden`; split names read as one string; chapter numerals labelled.
- [ ] All text colour pairs come from the design's contrast table (≥4.5:1 reading text).
- [ ] Visible focus on every interactive element; targets ≥44 px; no hover-only states.
- [ ] 200% text zoom without horizontal scroll.
- [ ] Reduced-motion cut keeps the narrative (user decision) — neither static nor full motion.

## 8. Share previews

- [ ] `og:title`, `og:description` and an **absolute** `og:image` URL (1200×630) exist and the image file exists
      (all legacy demos fail this — don't copy their tags).
- [ ] Test by pasting the deployed link into WhatsApp.

## 9. Legacy regression

- [ ] Before the first change to any `site/engine/` file, capture all four legacy demos (cover, `?open`, a
      mid-page frame) at 390×844.
- [ ] After every engine change, recapture and compare. Any visual difference in a legacy demo is a regression
      to fix, not to accept.

## 10. Content and safety

- [ ] No wedding detail hard-coded in markup or scene code; everything binds to `details.js`.
- [ ] Every invented demo value is listed in `placeholders`; `sample: true`; the Sample mark is visible and
      readable by screen readers.
- [ ] No real person's name, phone number, address or sheet URL anywhere in this public repository.
- [ ] Every shipped asset is in the manifest with licence fields; identifiable people flagged.

## 11. Deploy

- [ ] Test harnesses and tooling are not inside the deploy root (`site/_test/` must move or be excluded).
- [ ] Budgets from `wedding-performance` measured and within limits.
- [ ] Never deploy or publish without the user's approval.

## 12. Environment notes (this machine)

- Reload PATH from the registry before `node`/`npm` in a fresh shell.
- Pages block scripts on `file://`; serve over http.
- The Browser preview pane never runs rAF/IntersectionObserver and freezes CSS transitions at t=0 — use it for DOM
  questions only, not motion. Headless Edge can't lay out narrower than ~500 px (use a 390 px iframe) and is
  unreliable for rAF-driven states.
- A port may already be held by a server from an earlier session; check before assuming a start failed.
