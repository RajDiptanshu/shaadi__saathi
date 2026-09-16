---
name: wedding-motion
description: Motion, camera, transition, interaction and sound-timing standards for Shaadi Saathi invitations, including the reduced-motion policy and GSAP implementation rules. Use when writing, changing or reviewing any animation, opening sequence, scroll-linked effect, transition, timeline, interaction feedback or sound cue in site/invitations/ or site/engine/motion/.
---

# Wedding motion

The flagship storyboard is `docs/mogra-moti/animation-storyboard.md`; architecture is
`docs/mogra-moti/scene-architecture.md` §4–5. This skill is the rulebook; those docs are the score.

## 1. The only question

**What visible thing caused this to move?** Valid causes: light, a pull, a breeze, another object, the guest's
tap, the guest's scroll. "The section entered the viewport" is not a cause. If there is no cause, delete the
animation.

## 2. Choreography rules

1. **Lead → follow → settle.** One lead motion per moment; followers start when the lead reaches them
   (≥80 ms later); endings use the settle ease.
2. **≤3 moving things at once**, light included.
3. **Staggers:** chains of objects 40–60 ms; lines of text 180 ms; never letter by letter.
4. **Exit toward the cause** (pulled things leave toward the pull).
5. **Stillness while reading:** after a scene enters, only light and ≤1 slow ambient element move, never over
   text.
6. **Play once:** entrances don't replay on scroll-up.
7. **Scroll-linked only where declared:** the signature transition, venue letterbox, desktop gallery. Total
   pinned scroll ≤240 svh on a phone.
8. **Interruptible:** a tap during the opening fast-forwards (4×) then enters; returning visitors get 1.6×.
9. **Feedback within 100 ms** of any tap, even when the sequence it starts is long.

## 3. Tokens (use these, never ad-hoc values)

| Duration | Normal | Reduced |
|---|---|---|
| `instant` | 120 ms | 120 ms |
| `quick` | 280 ms | 200 ms |
| `object` | 900 ms | 360 ms |
| `silk` | 1600 ms | 400 ms, opacity only |
| `camera` | 2000 ms | — |
| `light` | 2600 ms | 800 ms |
| `draw` | scrubbed over 80 svh | 450 ms, time-based |

| Ease | CSS | GSAP |
|---|---|---|
| `settle` | `cubic-bezier(.16,1,.3,1)` | `expo.out` |
| `tension` | `cubic-bezier(.7,0,.84,0)` | `expo.in` |
| `release` (the only overshoot, thread snap only) | `cubic-bezier(.34,1.3,.64,1)` | `back.out(1.2)` |
| `silk` | `cubic-bezier(.45,.05,.25,1)` | `power2.inOut` |
| `camera` | `cubic-bezier(.65,0,.35,1)` | `power3.inOut` |
| `light` | `cubic-bezier(.37,0,.63,1)` | `sine.inOut` |

Never `bounce`, `elastic` or the browser default `ease`.

## 4. Camera

- Top-down still life (stationery shots) may **push in** only; eye-level scenes may **track laterally** or
  **open a letterbox**; nothing zooms out, rotates, rolls or shakes.
- Dolly by depth layer (`data-depth`): surface 1.12, paper/photos 1.18 (reference), objects 1.21, sheer
  foreground 1.32, defocused foreground 1.60.
- Max scale on a photograph 1.12 outside the opening push; photos ship at 1.25× display size.
- Rack focus = cross-fade sharp ↔ pre-blurred image. **Never animate `filter: blur()`.**
- Parallax only on photos and cut-outs, only in designated scenes, ±24 px per viewport, **never on text**.

## 5. Transitions

Allowed vocabulary (Mogra & Moti names): **The Draw** (signature, ≤3 uses), **Bloom pass** (foreground object
covers a cut), **Light shift** (ground and grade change), **Set by light** (type revealed by a moving soft
light band), **Print settle** (photo mask opens from its bleeding edge while the image settles 1.06 → 1.00),
**Letterbox open**.

Banned: fade-up on scroll, scale-in, bounce, rotate-in, blur-in, flips, page turns, curtains/doors, glitch,
typewriter, particle showers (petals, confetti, sparkles, hearts), continuous floating/bobbing, pulsing
"tap to open" text, random ambient drift.

## 6. Reduced motion (user decision, 2026-09-16)

A **shorter, simplified cut of the same film — never static or plain.**

| Keep | Remove or reduce |
|---|---|
| the opening narrative in the same order | camera push and dolly |
| every major scene transition (as short cross-fades with a drawn thread line) | parallax |
| light reveals, deboss emergence, knot and bloom (shortened) | scroll-linked and pinned motion |
| sound | large spatial travel (≤12 px) |
| | continuous ambient motion (made static) |

Durations drop to roughly a third (see tokens). Test with `?rm=1`.

## 7. Implementation rules

- **Where code lives:** generic primitives in `site/engine/motion/` (policy, timeline, scene, reveal, draw,
  thread, depth, media); choreography in **one file per scene** in `site/invitations/<slug>/scenes/`.
  Don't scatter animation into other files.
- **Scenes never read `prefers-reduced-motion` themselves.** They ask the motion policy for tokens.
- **Content never depends on animation completing.** Final readable states are the CSS default. The policy adds
  `html.motion-ok` only after the first animation frame actually fires (within 300 ms); only then do scenes set
  "from" states. *Reason:* some phones, webviews and this project's Browser preview pane never run
  `requestAnimationFrame` or IntersectionObserver.
- **Every timeline is registered and seekable** (`motion.timeline(name, factory)`), exposing test hooks:
  `?test&tl=<name>&t=<seconds>`, `?test&scene=<id>&p=<0–1>`, `?still`, `?rm=1`, `?open`.
- **Animate only `transform`, `opacity` and small masks.** No animated width/height/top/left, box-shadow,
  filters or blend modes. `will-change` only during a tween. Shadows of moving cut-outs are separate
  pre-blurred sprites, not `drop-shadow()`.
- **GSAP** is vendored and pinned under `site/vendor/gsap/<version>/` (core, ScrollTrigger, MotionPathPlugin).
  No CDN at runtime. Kill and rebuild tweens bound to templated nodes when the engine emits `render`
  (language switches rebuild `data-each` nodes).
- **The opening** uses core's opt-in `<html data-opening="theme">`, waits for fonts + first-frame images
  (max 1.8 s behind a dark first frame), and calls `Invite.completeOpening()` when done.
- **Sound timing:** nothing before the tap; the first sound belongs to the tapped object; music starts ~400 ms
  after the tap with a 3 s fade; effects ≤1.2 s, ~6 dB under music, silent when muted; the closing fades the
  music to silence over 6 s. Reuse `site/engine/sound.js`.

## 8. Review checklist

- [ ] Every motion has a named visible cause.
- [ ] ≤3 simultaneous movers; no motion over text while reading.
- [ ] Only tokens used for durations and eases.
- [ ] Reduced-motion cut exists, keeps the narrative, and has no camera/parallax/scroll-linked movement.
- [ ] Page is complete and readable with animation frames disabled.
- [ ] Timeline registered and seekable; hero-gate frames capturable.
- [ ] Only transform/opacity/small masks animate; no blur/filter animation.
- [ ] 60 fps on a mid-range phone during the opening (see `wedding-performance`).
