# Mogra & Moti — scene architecture

How the experience is structured: scenes, layers, files, how it plugs into the existing engine, the motion
primitives, test hooks, the central data model with every placeholder flagged, accessibility and performance.
This is the implementation plan for Phases 4–5; nothing here is built yet.

Constraints carried from Phase 0 (`docs/repository-audit.md`): static site, no framework; the legacy demos in
`site/demo/` are frozen; engine changes are additive and opt-in; every timeline is seekable for evaluation.

---

## 1. Scene map

| # | Id | Scene | Ground | Height (phone) | Enters by | Scroll-linked |
|---|---|---|---|---|---|---|
| 01 | `opening` | Opening | night-deep → paper-dawn | fixed cover, 100 svh | page load | no (time-based) |
| 02 | `welcome` | Welcome | paper-dawn | ~190 svh | T2 Bloom pass + push | parallax only |
| 03 | `story` | Our Story | paper | ~300 svh | T3 Light shift | parallax only |
| — | `draw-1` | The Draw | — | 80 svh pinned | — | yes |
| 04 | `celebrations` | Celebrations | paper-warm | ~460 svh | T1 The Draw | no |
| 05 | `venue` | Venue | dusk | 180 svh sticky + ~100 svh | T6 Letterbox open | yes |
| 06 | `gallery` | Gallery | night | ~110 svh (desktop: pinned) | T3 Light shift | desktop only |
| — | `draw-2` | The Draw | — | 80 svh pinned | — | yes |
| 07 | `rsvp` | RSVP | night + paper card | ~150 svh | T1 The Draw | no |
| — | `draw-3` | The Draw | — | 80 svh pinned | — | yes |
| 08 | `closing` | Closing | night-deep | ~140 svh | T1 The Draw → knot | no |

Total ≈ 18 phone screens, of which 240 svh are pinned. With reduced motion, nothing is pinned and the Draw
sections collapse to 12 svh spacers.

---

## 2. Files

```
site/
  vendor/gsap/<pinned 3.x>/           gsap.min.js, ScrollTrigger.min.js, MotionPathPlugin.min.js + LICENSE note
  engine/                             existing; additive, opt-in changes only (§4.1)
    motion/                           new primitives (§4.2)
      policy.js  timeline.js  scene.js  reveal.js  draw.js  thread.js  depth.js  media.js
  invitations/
    mogra-moti/
      index.html                      all scene markup; no wording (data-t bindings only)
      details.js                      the single data file (§7)
      styles/
        tokens.css                    colours, type roles, spacing, easing, durations (from the docs)
        base.css                      paper, grid, thread links, inputs, controls, sample mark
        scenes.css                    one section per scene
      scenes/
        01-opening.js  02-welcome.js  03-story.js  04-celebrations.js
        05-venue.js    06-gallery.js  07-rsvp.js   08-closing.js
      main.js                         boots the policy, registers scenes in order, wires test hooks
      assets/
        manifest.json                 (asset-plan.md §4)
        img/  tex/  svg/  audio/  fonts/
tools/                                dev only (Phase 3)
  serve.js   images/   capture/
tests/                                Playwright specs (Phase 3 onwards)
docs/mogra-moti/                      this direction; evaluations later
assets-src/                           gitignored originals
```

*Why this shape:* the flagship lives in its own namespace, so the legacy `site/demo/mogra-moti/` is never touched
and the URLs never collide (`/demo/mogra-moti/` vs `/invitations/mogra-moti/`). Animation logic lives in
exactly two places — generic primitives in `engine/motion/`, scene choreography in one file per scene — rather
than scattered across components.

**Load order in `index.html`** (all `defer`, in this order): `details.js` → `engine/strings.js` →
`engine/studio.js` → `engine/core.js` → `engine/events.js` → `engine/rsvp.js` → `engine/sound.js` →
`engine/sales.js` → GSAP files → `engine/motion/*.js` → `scenes/*.js` → `main.js`.

---

## 3. Layer model

Every scene is a `<section class="scene" data-scene="<id>">` containing depth layers:

```html
<section class="scene s04" data-scene="celebrations" aria-labelledby="celebrations-title">
  <div class="layer l0" data-depth="0" aria-hidden="true"><!-- ground, light gradients --></div>
  <div class="layer l1" data-depth="1"><!-- photographs, paper --></div>
  <div class="layer l2" data-depth="2"><!-- thread, cut-outs, type --></div>
  <div class="layer l3" data-depth="3" aria-hidden="true"><!-- sheer foreground --></div>
</section>
```

- Text lives in L2 and never in a moving depth layer during reading (parallax applies to L1 photos and
  L2 cut-outs by element, not to the whole layer).
- Depth ratios for camera moves come from `data-depth` (`animation-storyboard.md` §2).
- The opening cover (`#cover`) uses the same layers plus L4 for passing buds.

---

## 4. Engine integration

### 4.1 Reused as is, or with additive opt-in changes

| Engine file | Use in the flagship | Change | Legacy impact |
|---|---|---|---|
| `core.js` | binding (`data-t`, `data-date`, `data-attr`, `data-if`, `data-each`), dates in IST, event bus, URL modes, `inert` main | **opt-in** `<html data-opening="theme">`: core does not schedule its class timeouts; the theme calls `Invite.completeOpening()`; Escape does not open | none: the default path is byte-for-byte unchanged |
| `events.js` | calendar and map links via `[data-calendar]` / `[data-map]` inside `[data-from="events"]` | none | none |
| `rsvp.js` | validation, stored reply, submission, simulated preview | **opt-in** `[data-rsvp-template]`: build the form from a `<template>` in the page, keeping the same ids and class hooks; send event **ids** (already sent) as the matching key | none |
| `apps-script/Code.gs` | the couple's sheet | `EVENTS` accepts `{ id, name }` objects and matches by id, falling back to names for old invitations | none for existing sheets |
| `sound.js` | tap unlock, gapless loop, fades, iOS playback, mute memory | **additive** `Invite.sound.fx(id)` effects on the same audio context; `Invite.sound.fadeTo(level, seconds)`; `music.fetchAfter: 'opening'` | none |
| `sales.js` | Sample mark and studio link | **opt-in** `sales: { placement: 'slot' }`: render into `[data-sales-slot]` elements instead of the floating pill; mark text "Sample invitation", readable by screen readers | none |
| `strings.js`, `studio.js` | interface words; Instagram handle | none (the flagship overrides words through `ui` in its data) | none |
| `engine.css` | `[hidden]`, `.sr-only`, form mechanics | none; the flagship never uses `data-reveal`, so the fade-up rules never apply | none |
| `gallery.js`, `scratch.js` | not used | — | — |

**Regression rule:** before the first engine edit, Playwright captures all four legacy demos (cover, opened,
mid-page) at 390×844. After every engine change the captures are repeated and compared.

### 4.2 New motion primitives (`site/engine/motion/`)

Plain scripts that register on `Invite.motion`, consistent with the engine's style. Each has one job.

| File | Primitive | Responsibility | Key API |
|---|---|---|---|
| `policy.js` | **MotionPolicy** | decides normal / reduced / still; exposes duration and easing tokens for the current mode; checks that animation frames actually run (adds `html.motion-ok` after the first frame, within 300 ms, otherwise leaves the final states showing); pauses everything when the tab is hidden | `motion.policy.reduced`, `.still`, `.dur('object')`, `.ease('settle')`, `.ok` |
| `timeline.js` | **Timeline registry** | builds GSAP timelines lazily from factories, keeps them by name, and seeks them for tests | `motion.timeline(name, factory)`, `motion.seek(name, seconds)`, `motion.progress(name, p)` |
| `scene.js` | **Scene** | activates a scene once at a threshold (ScrollTrigger, with a throttled scroll-position fallback); handles pinning and scrubbing where declared; exposes `is-entered` | `motion.scene(el, { enter, pin, scrub, onEnter })` |
| `reveal.js` | **Reveals** | T4 Set by light, T5 Print settle, T6 Letterbox open, T3 Light shift — each in both modes | `motion.setByLight(el)`, `.printSettle(el, { edge })`, `.letterbox(el)`, `.lightShift(scene, ground, grade)` |
| `draw.js` | **The Draw** | T1 in both modes: pinned scrubbed sheet with thread and beads, or threshold cross-fade with a drawn line | `motion.draw(section, { from, to, beads })` |
| `thread.js` | **Thread** | builds thread SVG (core, highlight, shadow) from a path; slack→taut morph; beads placed by arc length (MotionPath); knot tying; line drawing | `motion.thread(svg, paths)`, `.tension()`, `.beads(items)`, `.knot()` |
| `depth.js` | **Depth** | parallax per element (`data-parallax="0.92"`); camera push across a layer stack using `data-depth` ratios | `motion.parallax(el, speed)`, `motion.push(stack, { to })` |
| `media.js` | **ImageFrame** | builds `<picture>` from a manifest id: AVIF/WebP/JPEG `srcset`, `sizes`, LQIP, focal point, alt text; eager or lazy; `decode()` before a reveal | `motion.image(el, id, { priority })`, `motion.ready(ids)` |

Scenes use only these primitives and GSAP. No scene reads `prefers-reduced-motion` directly.

### 4.3 Opening, handled by the theme

`01-opening.js` builds two timelines — `opening` (before the tap) and `entry` (after) — from the storyboard
(`animation-storyboard.md` §7), and:

1. waits for `motion.ready(['T01','T02','T03','O01','O02','O03'])` and fonts (max 1.8 s);
2. plays `opening`; enables the tap at 1.2 s (earlier taps are queued);
3. on tap: `Invite.emit('open')` (sound unlock), fast-forwards `opening` if unfinished, plays `entry`;
4. at the cut (1150 ms): swaps the cover for the welcome scene; at 2200 ms calls `Invite.completeOpening()`,
   unlocks scroll and focuses the `<h1>`.

---

## 5. Test and share hooks

| URL | Effect | For |
|---|---|---|
| `?open` | skip the opening (engine behaviour) | deep links |
| `?still` | every scene in its final state, no motion, music hidden | screenshots, share images |
| `?rm=1` | force the reduced-motion cut | QA |
| `?test` | expose `window.__mm` (the timeline registry and policy) | Playwright |
| `?test&tl=opening&t=3.2` | pause the `opening` timeline at 3.2 s | hero-gate frames |
| `?test&scene=venue&p=0.5` | scroll to the venue and set its scrubbed progress to 50% | scroll-linked frames |
| `#rsvp` | open straight to the reply card (skips the opening) | "please reply" links |

*Why seekable timelines:* the evaluation loop can capture any exact frame deterministically on every viewport,
without video tooling, and compare iterations frame by frame.

---

## 6. Markup contract

- **One `<h1>`:** the couple's names in Scene 02 (visually the title-scale signature). The cover's names are
  decorative and `aria-hidden`; the cover button is labelled "Open the invitation from Rohan and Anaya".
- **`<h2>` per scene:** the chapter mark, e.g. `<h2 id="celebrations-title" aria-label="Chapter 4, Celebrations">`
  with the Devanagari numeral `aria-hidden` and `lang="hi"`.
- **`<h3>` per celebration.** Events render from `<template data-each="events">`; each rendered `<article>`
  receives `celebration--<composition>` from its data (§7), and CSS grid areas rearrange the same inner
  structure per composition. *Why:* a real order may have three events or six; compositions are a vocabulary
  assigned in data, not four hard-coded blocks.
- **Composition vocabulary:** `bleed-left`, `bleed-right`, `vertical-name`, `centred-knot` (at most one per
  invitation, for the most sacred event), `full-bleed-night`.
- **Skip link:** "Skip to reply" appears on keyboard focus.
- **RSVP result** announced in a polite live region.
- **Gallery viewer:** `role="dialog"`, `aria-modal`, focus trapped, Escape closes, focus returns to the frame.

---

## 7. Invitation data model

`site/invitations/mogra-moti/details.js` is the **only** place wedding details exist. It follows the existing
`window.INVITE` contract (so `core.js`, `events.js`, `rsvp.js` and `sound.js` work unchanged) and extends it
additively. Components bind to paths; they never contain names, dates or places.

### 7.1 What is given vs invented

| Given by the user | Invented as a demo placeholder |
|---|---|
| Couple: Rohan Malhotra & Anaya Kapoor | city, all venues and areas |
| Wedding date: 15 February 2027 | the wedding's time; all dates and times of Mehendi, Sangeet, Reception |
| Celebrations: Mehendi, Sangeet, Wedding, Reception | families' names and home cities, sign-off |
| It is a demo | all story copy; welcome, celebration, venue and closing lines |
| | dress notes, RSVP deadline, contact person, gallery captions |

Every invented value is listed in `placeholders` inside the data file, with the path and a note, so a real
order can be checked line by line and nothing invented survives by accident.

### 7.2 Shape and demo values

```js
/* Mogra & Moti · demo invitation. Every wedding detail the page shows comes from this file.
   Rohan Malhotra, Anaya Kapoor and 15 February 2027 are the brief's fictional demo couple.
   Everything listed in `placeholders` was invented for the demo and must be replaced for a real order. */
window.INVITE = {
  slug: 'mogra-moti',
  design: 'Mogra & Moti',
  sample: true,
  langs: ['en'],

  placeholders: [
    { path: 'wedding.city', note: 'demo city (chosen for the pearl association)' },
    { path: 'wedding.datesLabel', note: 'follows the invented event dates' },
    { path: 'countdownTo', note: 'invented wedding time' },
    { path: 'families', note: 'all family names, home cities and the sign-off' },
    { path: 'story', note: 'all chapters, labels and text' },
    { path: 'copy', note: 'all scene lines except interface words' },
    { path: 'events[*].start', note: 'all times; Mehendi, Sangeet and Reception dates' },
    { path: 'events[*].end', note: 'all end times' },
    { path: 'events[*].venue', note: 'all venues and areas' },
    { path: 'events[*].dress', note: 'all dress notes' },
    { path: 'venue.description', note: 'venue line' },
    { path: 'gallery[*].caption', note: 'captions' },
    { path: 'rsvp.deadline', note: 'reply-by date' },
    { path: 'contacts', note: 'contact person; number masked' }
  ],

  couple: {
    groom: 'Rohan',
    bride: 'Anaya',
    groomSurname: 'Malhotra',
    brideSurname: 'Kapoor',
    groomFull: 'Rohan Malhotra',
    brideFull: 'Anaya Kapoor',
    initials: 'RA'
  },

  wedding: {
    date: '2027-02-15',
    city: 'Hyderabad',
    datesLabel: '14–16 February 2027'
  },
  countdownTo: '2027-02-15T18:30:00+05:30',

  invocation: null, // optional ritual line, e.g. '॥ श्री गणेशाय नमः ॥'

  families: {
    together: 'Together with their families',
    groom: { parents: 'Nandini & Arvind Malhotra', from: 'New Delhi' },
    bride: { parents: 'Ritu & Ashwin Kapoor', from: 'Hyderabad' },
    signOff: 'With love, the Malhotra and Kapoor families'
  },

  copy: {
    welcomeLead: 'are getting married',
    welcomeLine: 'Three days in February, and a strand of mogra for every one of them.',
    celebrationsLine: 'Four celebrations. We’d love you at every one.',
    rsvpTitle: 'Will you join us?',
    rsvpThanksTitle: 'Thank you, {name}.',
    rsvpThanksLine: 'Your reply is with the family.',
    closingLine: 'Mogra is strung in the morning and opens by night. Be there for both.',
    studioLine: 'Sample invitation by Shaadi Saathi',
    studioLink: 'Make this invitation yours'
  },

  story: [
    {
      id: 'table',
      label: 'Hyderabad, 2019',
      title: 'One table left, and a stranger who asked to share it.',
      text: 'A delayed flight, a crowded airport café, and a conversation that outlasted the delay.',
      images: ['P02']
    },
    {
      id: 'sundays',
      label: '2019–2025',
      title: 'Six years of Sundays.',
      text: 'Delhi to Hyderabad and back, a hundred times over. Every visit ended at the same chai stall.',
      images: ['P03', 'P05']
    },
    {
      id: 'question',
      label: 'Hyderabad, 2025',
      title: 'He asked on her grandmother’s terrace, with a strand of mogra instead of a ring.',
      text: '',
      images: ['P04']
    }
  ],

  events: [
    {
      id: 'mehendi',
      name: 'Mehendi',
      start: '2027-02-14T13:00:00+05:30',
      end: '2027-02-14T17:00:00+05:30',
      venue: { name: 'The Jasmine Courtyard', area: 'Kapoor residence, Jubilee Hills', mapQuery: 'Jubilee Hills, Hyderabad' },
      dress: 'Greens and ivory; flat shoes for the lawn',
      image: 'P06',
      composition: 'bleed-left',
      rsvp: true
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      start: '2027-02-14T19:30:00+05:30',
      end: '2027-02-15T00:30:00+05:30',
      venue: { name: 'The Glasshouse', area: 'Banjara Hills', mapQuery: 'Banjara Hills, Hyderabad' },
      dress: 'Evening wear with something that moves',
      image: 'P07',
      composition: 'vertical-name',
      rsvp: true
    },
    {
      id: 'wedding',
      name: 'The Wedding',
      start: '2027-02-15T18:30:00+05:30',
      end: '2027-02-15T23:30:00+05:30',
      venue: { name: 'Chandni Bagh', area: 'Gandipet', mapQuery: 'Gandipet, Hyderabad' },
      dress: 'Traditional; ivory and pastels welcome',
      image: 'P08',
      composition: 'centred-knot',
      major: true,
      rsvp: true
    },
    {
      id: 'reception',
      name: 'Reception',
      start: '2027-02-16T20:00:00+05:30',
      end: '2027-02-16T23:30:00+05:30',
      venue: { name: 'The Pearl Room', area: 'Banjara Hills', mapQuery: 'Banjara Hills, Hyderabad' },
      dress: 'Black tie, Indian or western',
      image: 'P09',
      composition: 'full-bleed-night',
      major: true,
      rsvp: true
    }
  ],

  venue: {
    eventId: 'wedding',
    image: 'P10',
    description: 'A lawn that runs down to the water, lit with lamps as the light goes.'
  },

  gallery: [
    { image: 'G01', caption: 'Morning' },
    { image: 'G02', caption: 'Hands' },
    { image: 'G03', caption: 'Pearls' },
    { image: 'G04', caption: 'Laughter' },
    { image: 'G05', caption: 'Silk' },
    { image: 'G06', caption: 'Mogra' },
    { image: 'G07', caption: 'Lamps' },
    { image: 'G08', caption: 'Us' }
  ],

  rsvp: { endpoint: '', maxGuests: 4, deadline: '2027-01-15' },

  contacts: [
    { name: 'Kabir Malhotra', role: 'Questions and travel', display: '+91 98••• •••••' }
  ],

  ui: {
    openInvite: 'Open the invitation from Rohan and Anaya',
    tapToOpen: 'Touch the pearl',
    yes: 'Joyfully accepts',
    no: 'Regretfully declines',
    send: 'Send reply',
    yourName: 'Your name',
    whichEvents: 'Which celebrations',
    guests: 'How many of you',
    wish: 'A wish for them'
  },

  sales: { placement: 'slot' },
  music: null, // A01 once licensed: { src, loopStart: 0.5, loopLength, fetchAfter: 'opening' }
  sfx: { click: 'A02', roll: 'A03', pull: 'A04', silk: 'A05', bead: 'A06', knot: 'A07' },
  assets: 'assets/manifest.json'
};
```

Venue notes: venues are fictional, and map links resolve to **neighbourhoods**, never to a named business, so the
demo never sends guests to a real place that has nothing to do with it.

Checked: 14 February 2027 is a Sunday, 15 February a Monday, 16 February a Tuesday.

---

## 8. Accessibility plan

| Area | Plan |
|---|---|
| Keyboard | cover button focused on load; Enter/Space open; after entry, focus moves to the `<h1>`; skip link to the reply; every link and control reachable; gallery viewer traps focus |
| Screen readers | decorative layers `aria-hidden`; one accessible string for split names; chapter headings labelled; photos have written alt text from the manifest; RSVP errors linked with `aria-describedby`; result announced |
| Contrast | only the colour pairs listed in `visual-dna.md` §1.2; text over photographs only with the night scrim |
| Motion | reduced-motion cut (`animation-storyboard.md` §6); nothing flashes; no motion is required to understand content |
| Sound | never before a tap; mute control labelled with its state and remembered |
| Zoom | layouts survive 200% text zoom without horizontal scrolling |
| Touch | targets ≥44 px; no hover-only states; no gestures without a button equivalent |

---

## 9. Performance plan

| Area | Plan |
|---|---|
| Critical path | preload Imbue, Archivo, T01 and O01; inline the opening's critical CSS; everything else deferred |
| Images | `media.js` decodes the opening set before starting; later scenes load one scene ahead (scene trigger with a 150% margin, scroll-position fallback); explicit width/height for zero layout shift |
| Animation | transforms and opacity only; `will-change` only while a tween runs; ScrollTrigger `fastScrollEnd`; timelines outside the viewport are paused |
| Audio | music fetched after the opening assets decode; effects decoded on first tap |
| Fallback | if animation frames don't run, `html.motion-ok` is never added and every scene shows its final state |
| Measured | Phase 7 runs Lighthouse-style checks and frame-rate traces through Playwright against the budgets in `asset-plan.md` §6 |

---

## 10. Open technical questions (for Phase 3–4)

1. Grading: scripted recipes vs hand grading — test both on three photographs, keep whichever holds skin and
   petal tones.
2. Audio encoding without ffmpeg: a small npm encoder vs the Windows transcoder route used for the family invite.
3. Whether the desktop gallery pin earns its complexity — decide after the phone version is scored.
