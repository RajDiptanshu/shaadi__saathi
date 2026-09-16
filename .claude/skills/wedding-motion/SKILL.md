---
name: wedding-motion
description: The motion constitution for Shaadi Saathi invitations — cause-and-effect choreography, duration and easing tokens, camera, transitions, interaction feedback, sound timing, the reduced-motion policy and GSAP implementation rules, with common failure modes and concrete examples of what not to do. Use when writing, changing or reviewing any animation, opening sequence, scroll-linked effect, transition, timeline, interaction feedback or sound cue in site/invitations/ or site/engine/motion/.
---

# Wedding motion

**Canonical sources:** `docs/mogra-moti/animation-storyboard.md` (the score: every beat, timing and reduced cut)
and `docs/mogra-moti/scene-architecture.md` §4–5 (primitives, hooks). If they disagree with this skill, fix the
skill.

---

## 1. The one question

**What visible thing caused this to move?** Valid causes: light, a pull, a breeze, another object's contact, the
guest's tap, the guest's scroll. "The section entered the viewport" is not a cause. No cause → delete the animation.

## 2. Animation rules

1. **Lead → follow → settle.** Each moment has one lead motion; followers start when the lead reaches them
   (≥80 ms later); endings use `settle`.
2. **At most three things move at once.** Light counts as one. A group moving together (a strand of beads, a pair
   of tumbling buds, a fabric and its shadow) counts as one. Camera moves don't count — they move the frame.
3. **Staggers:** chains of objects 40–60 ms; lines of text 180 ms; **never letter by letter**.
4. **Exit toward the cause:** pulled things leave toward the pull, swept things with the sweep.
5. **Stillness while reading:** once a scene has entered, only light and at most one slow ambient element move,
   never over text.
6. **Play once:** entrances stay revealed when scrolling back up.
7. **Scroll-linked motion only where declared:** the three Draws (80 svh pinned each), the venue letterbox (80 svh
   sticky extension), the desktop gallery. **Phone total ≤320 svh.**
8. **Interruptible:** taps during the opening are queued before 1.2 s; after 1.2 s a tap fast-forwards the rest at
   4× and plays the entry. Returning visitors see the opening at 1.6× with the hint shown immediately.
9. **Feedback within 100 ms** of every tap, however long the sequence it starts.
10. **Only one overshoot exists:** the thread's release. Nothing else bounces.

## 3. Tokens (never ad-hoc values)

| Duration | Normal | Reduced | For |
|---|---|---|---|
| `instant` | 120 ms | 120 ms | tap feedback |
| `quick` | 280 ms | 200 ms | small UI changes, link underlines |
| `object` | 900 ms | 360 ms | a pearl arriving, a photo mask |
| `silk` | 1600 ms | 400 ms, opacity only | fabric |
| `camera` | 2000 ms | none | dolly, push |
| `light` | 2600 ms | 800 ms | light rising, grade shifts |
| `draw` | scrubbed over 80 svh | 450 ms, time-based | the signature transition |

| Ease | CSS | GSAP | For |
|---|---|---|---|
| `settle` | `cubic-bezier(.16, 1, .3, 1)` | `expo.out` | coming to rest |
| `tension` | `cubic-bezier(.7, 0, .84, 0)` | `expo.in` | a thread tightening |
| `release` | `cubic-bezier(.34, 1.3, .64, 1)` | `back.out(1.2)` | the thread's release only |
| `silk` | `cubic-bezier(.45, .05, .25, 1)` | `power2.inOut` | fabric |
| `camera` | `cubic-bezier(.65, 0, .35, 1)` | `power3.inOut` | dolly, push, letterbox |
| `light` | `cubic-bezier(.37, 0, .63, 1)` | `sine.inOut` | light, grade |

Named sequences also have fixed values: Set by light 1000 ms per line (reduced 500 ms); Print settle mask 900 ms +
image 1.06 → 1.00 over 1400 ms (reduced: mask 360 ms, no scale); Light shift 1200 ms (reduced 600 ms); Wedding knot
1.4 s (reduced 400 ms); closing bloom 2.4 s (reduced 600 ms).

## 4. Camera rules

- Top-down still life (opening, reply card, closing) may **push in** only. Eye-level scenes may **track laterally**
  (gallery) or **open a letterbox** (venue). Never zoom out, rotate, roll or shake.
- Dolly ratios by `data-depth`: surface 1.12 · paper and photos 1.18 (reference) · objects on paper 1.21 · sheer
  foreground 1.32 · defocused foreground 1.60.
- Max scale on a photograph 1.12 outside the opening push; photos ship at 1.25× display size.
- **Rack focus = cross-fade between a sharp and a pre-blurred image.** Never animate `blur()`.
- Parallax only in Welcome and Story, only on photos and cut-outs, ±24 px per viewport. **Never on text.** The
  gallery's ±12 px inner shift during a swipe is the only other parallax.

## 5. Transition rules

**Vocabulary:** The Draw (signature; ×3: into Celebrations, RSVP, Closing) · Bloom pass (opening entry only) ·
Light shift (02→03, between celebrations, 05→06) · Set by light (type) · Print settle (photos) · Letterbox open
(venue).

**Banned:** fade-up on scroll · scale-in · bounce/elastic · rotate-in · blur-in · flips · page turns · curtains or
doors · hard straight-edged wipes · glitches · typewriter text · particle showers (petals, confetti, sparkles,
hearts) · continuous floating/bobbing · pulsing "tap to open" labels · random ambient drift.

## 6. Reduced motion (user decision, 2026-09-16)

A **shorter, simplified cut of the same film — never static, never plain.**

| Keep (shortened) | Remove |
|---|---|
| opening narrative in order: light → relief → pearl and strand (in place) → names → date → hint (~2.2 s) | camera push and dolly |
| every major transition, as a drawn thread line + 450 ms cross-fade | parallax |
| light reveals, deboss, knot (400 ms), bloom (600 ms) | pinned and scroll-scrubbed motion |
| tap feedback and all sound | spatial travel over 12 px |
| | continuous ambient motion (pearl lustre, lamp breath, fabric drift) |

Test with `?rm=1`. Scenes read tokens from the motion policy; they never branch on the media query themselves.

## 7. Interaction and sound timing

- The whole cover is the opening button; Enter and Space open; **Escape does not**.
- After the entry: scroll unlocks, main is no longer `inert`, focus moves to the `<h1>`.
- **Silence before the tap.** On the tap: the object's sound at 0 ms, music starts at 400 ms with a 3 s fade to
  gain 0.55. Effects ≤1.2 s, ~6 dB under music, silent when muted, unchanged by reduced motion. A Draw's thread
  sound plays once at 30% progress, forward scroll only. At 60% into the closing: knot sound, then music fades to
  silence over 6 s (scrolling back above fades it in over 3 s). Hidden tab suspends audio.
- Haptics (`navigator.vibrate(8)`, Android only): the opening tap and RSVP success. Nothing else.

## 8. Implementation rules

1. **Where code lives:** primitives in `site/engine/motion/` (`policy`, `timeline`, `scene`, `reveal`, `draw`,
   `thread`, `depth`, `media`); choreography in **one file per scene** in `site/invitations/<slug>/scenes/`.
   No animation code anywhere else.
2. **Content never depends on animation completing.** Final readable states are the CSS default. The policy adds
   `html.motion-ok` only after the first animation frame actually fires (within 300 ms); only then may scenes apply
   "from" states. *Reason:* some webviews, battery-saving phones and this project's Browser preview pane never run
   `requestAnimationFrame` or IntersectionObserver.
3. **Every timeline is registered and seekable:** `motion.timeline(name, factory)`; hooks `?test&tl=<name>&t=<s>`,
   `?test&scene=<id>&p=<0–1>`, `?still`, `?rm=1`, `?open`, `#rsvp`.
4. **Animate only `transform`, `opacity` and small masks.** Never width/height/top/left, box-shadow, filters,
   backdrop-filter or blend modes. `will-change` only while a tween runs. Moving cut-outs carry pre-blurred shadow
   sprites, not `drop-shadow()`.
5. **GSAP is vendored and pinned** in `site/vendor/gsap/<version>/` (core, ScrollTrigger, MotionPathPlugin). No CDN.
6. **Rebind on `render`:** language switches rebuild `data-each` nodes; kill tweens and ScrollTriggers bound to them
   and rebuild.
7. **The opening** opts in with `<html data-opening="theme">`, waits for fonts and every image it shows before or
   during the entry (T01–T04, O01–O03, O06; max 1.8 s behind a dark first frame) and ends with
   `Invite.completeOpening()`.
8. **Measure layout before tweening, never inside `onUpdate`.**
9. Use `svh` and ScrollTrigger's `ignoreMobileResize` so in-app browser toolbars don't make pins jump; don't use
   smooth-scroll libraries or scroll normalisation.

---

## 9. Common failure modes

| Failure | Symptom | Cause | Fix |
|---|---|---|---|
| "Everything fades up" | each block rises 20–40 px as it enters | a generic scroll-reveal loop | delete it; use Set by light / Print settle with a cause |
| Independent starts | pearl, fabric and names all begin at t=0 | tweens placed at the same timeline position | re-sequence as lead → follow; check the ≤3 rule |
| Invisible page | content missing on some phones or in previews | CSS hides content by default and waits for JS/rAF | final states as default; gate "from" states behind `html.motion-ok` |
| "It's frozen" misdiagnosis | animation doesn't move in the Browser pane | the pane doesn't run rAF | verify in Playwright's Chromium, not the pane |
| Orphaned tweens | after a language switch, reveals stop or double | nodes rebuilt by `render` | kill and rebind on `render` |
| Replay on scroll-up | entrances animate again | `toggleActions` reversing | play once |
| Pin jump | pinned section jerks when the toolbar hides | `vh` units, resize refresh | `svh`, `ignoreMobileResize` |
| Static reduced cut | reduced motion shows nothing moving | `return` early on the media query | policy tokens: short, not none |
| Dead tap | tapping during the opening does nothing for a second | tap ignored until the sequence ends | queue before 1.2 s, fast-forward after; ≤100 ms feedback |
| Silent iOS | music never starts on iPhone | audio created outside the tap | create/unlock inside the tap handler (engine `sound.js` does this) |
| Jank at 5 s | stutter when the fabric appears | image decoding mid-sequence | include it in the pre-decode set |

## 10. What NOT to do (examples)

```js
// ✗ Generic fade-up for every section
gsap.utils.toArray('section').forEach((s) => gsap.from(s, { y: 40, opacity: 0, scrollTrigger: s }));

// ✗ Four independent movers at the same instant, ad-hoc durations, bounce
tl.to('.pearl', { x: -200, duration: 0.75, ease: 'bounce.out' }, 0)
  .to('.silk', { x: 120, duration: 1.1 }, 0)
  .to('.names', { opacity: 1, duration: 0.9 }, 0)
  .to('.date', { y: 0, duration: 0.6 }, 0);

// ✗ Floating ornament with no cause
gsap.to('.pearl', { y: -8, repeat: -1, yoyo: true, duration: 2 });

// ✗ Animated blur (and, in CSS, `.bud { filter: drop-shadow(…) }` on a moving cut-out)
gsap.to('.bud', { filter: 'blur(0px)', duration: 1 });

// ✗ Scene deciding reduced motion by itself, producing a static page
if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

// ✗ Over-budget pin
ScrollTrigger.create({ trigger: '#story', pin: true, end: '+=300%' });

// ✗ Music before a gesture
window.addEventListener('load', () => new Audio('music.mp3').play());
```

```css
/* ✗ Content hidden by default, waiting for JS */
.names { opacity: 0; }
/* ✓ Hidden only once motion is proven to run */
html.motion-ok .names.is-waiting { opacity: 0; }
```

```js
// ✓ Lead → follow → settle, tokens from the policy, registered and seekable
motion.timeline('opening', () => {
  const p = motion.policy;
  return gsap.timeline()
    .add(light.rise(), 0)                                             // lead: light
    .add(deboss.emerge(), p.dur('light') * 0.35)                      // follows the light band
    .to(pearl, { x: 0, duration: p.dur('object') * 1.45, ease: p.ease('settle') }, 1.8)
    .add(thread.tension(), '>-0.1');                                  // caused by the pearl stopping
});
```
