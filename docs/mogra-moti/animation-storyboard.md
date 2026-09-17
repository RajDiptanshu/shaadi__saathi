# Mogra & Moti — animation storyboard

Motion language, camera, transitions, interaction, sound, the reduced-motion cut, and every scene beat by
beat. Positions are percentages of a 390 × 844 viewport unless stated. `t` is seconds from the start of a
timeline.

**Normal motion** is the full film. **Reduced motion** is the shorter cut defined by the user on 2026-09-16:
keep the opening narrative and major transitions; much shorter durations; no camera push, parallax or
scroll-linked movement; fewer continuous elements; no large spatial movement.

---

## 1. Motion language

### 1.1 The question for every animation

**What caused this to move?** The answer must be another visible element or the guest's own gesture: light,
a pull, a breeze, a tap, a scroll. If the answer is "it's a section entering the screen", the animation is
removed.

### 1.2 Choreography rules

| # | Rule | Why |
|---|---|---|
| 1 | **Lead → follow → settle.** Every moment has one lead motion; followers start when the lead reaches them (≥80 ms later); everything ends in `e-settle`. | cause and effect is what separates choreography from animation |
| 2 | **At most three things move at once.** Counting: light counts as one; a group moving together (a strand of beads, a pair of tumbling buds, a fabric and its shadow) counts as one; camera moves don't count, because they move the frame rather than an object. | the eye can follow three; more reads as busy |
| 3 | **Staggers:** beads 40–60 ms; lines of text 180 ms; never letter by letter. | beads are physical chains; letters animated one by one look like a template effect |
| 4 | **Exit in the direction of the cause.** Pulled things leave toward the pull; swept things leave with the sweep. | spatial continuity |
| 5 | **Stillness while reading.** Once a scene has entered, only light and at most one slow ambient element move, and never over text. | premium pages let you read |
| 6 | **Play once.** Scene entrances trigger once at a threshold and stay revealed when scrolling back up. | replaying on scroll-up is the clearest "website" signal |
| 7 | **Scroll-linked motion only** in the three Draws, the venue letterbox and the desktop gallery. | scrubbing everything turns scrolling into work |
| 8 | **Interruptible.** A tap during the opening fast-forwards it; nothing traps the guest. | respect impatience |
| 9 | **Animate only `transform`, `opacity`, and small masks.** No animated blur, filters, box-shadow, width/height or layout. | 60 fps on mid-range phones in in-app browsers |
| 10 | **Content never depends on animation completing.** Final readable states are the CSS default; motion sets "from" states only after the first animation frame has proven motion runs. | some phones and webviews never run animation frames; the invitation must still be complete |

### 1.3 Duration tokens

| Token | Normal | Reduced | For |
|---|---|---|---|
| `d-instant` | 120 ms | 120 ms | tap feedback |
| `d-quick` | 280 ms | 200 ms | small UI changes, link underlines |
| `d-object` | 900 ms | 360 ms | a pearl arriving, an image mask |
| `d-silk` | 1600 ms | 400 ms (opacity only) | fabric movement |
| `d-camera` | 2000 ms | — (no camera) | dolly and push |
| `d-light` | 2600 ms | 800 ms | light rising, grade shifts |
| `d-draw` | scrubbed over 80 svh | 450 ms, time-based | the signature transition |

### 1.4 Easing tokens

| Token | CSS | GSAP | For |
|---|---|---|---|
| `e-settle` | `cubic-bezier(.16, 1, .3, 1)` | `expo.out` | things coming to rest: pearls, image settle, beads |
| `e-tension` | `cubic-bezier(.7, 0, .84, 0)` | `expo.in` | a thread tightening |
| `e-release` | `cubic-bezier(.34, 1.3, .64, 1)` | `back.out(1.2)` | the thread's single release overshoot — the only overshoot in the design |
| `e-silk` | `cubic-bezier(.45, .05, .25, 1)` | `power2.inOut` | fabric |
| `e-camera` | `cubic-bezier(.65, 0, .35, 1)` | `power3.inOut` | dolly, push, letterbox |
| `e-light` | `cubic-bezier(.37, 0, .63, 1)` | `sine.inOut` | light and grade changes |

No `bounce`, `elastic` or default `ease`.

---

## 2. Camera language

The page is filmed with a virtual camera made of depth layers.

| Shot | Scenes | Allowed camera moves |
|---|---|---|
| **Top-down still life** (looking down at a table) | 01 Opening, 07 RSVP card, 08 Closing | dolly in (push) only |
| **Eye level, in the world** | 02–06 | lateral track (gallery), letterbox open (venue); locked while reading |

### Depth layers and dolly ratios

| Layer | Contents | Scale during a push (paper = 1.18) | Parallax speed (normal motion only) |
|---|---|---|---|
| L0 surface | marble, night grounds | 1.12 | 1.00 |
| L1 paper and photographs | the card, photos | 1.18 (reference) | photos 0.92 |
| L2 objects on paper | strand, deboss, cut-out buds | 1.21 | 1.00 |
| L3 sheer foreground | chanderi | 1.32 | 1.10 |
| L4 defocused foreground | the passing bud | 1.60 | 1.12 |

Rules:

- **Push, don't zoom out.** No zoom-out reveals. *Why:* a push moves the guest into the invitation.
- **Maximum scale on a photograph: 1.12** (outside the opening's paper push). Photos ship at 1.25× their
  largest display size to survive it.
- **Rack focus** is simulated by cross-fading a sharp and a pre-blurred version of a layer. Never animated
  `blur()`.
- **No rotation, roll, shake or handheld wobble.**
- **Parallax only in Welcome and Story**, photos and cut-outs only, never text, at most ±24 px per viewport of
  scroll. The one other exception is the gallery: images shift ±12 px inside their frames against a swipe.
- **Reduced motion:** camera locked; depth kept as static layering; no parallax.

---

## 3. Transition language

| ID | Name | Where | What happens | Normal | Reduced |
|---|---|---|---|---|---|
| **T1** | **The Draw** (signature) | the opening's entry into 02 Welcome (time-based, from the tap; §7.0), into 04 Celebrations, into 07 RSVP, into 08 Closing | pinned; a thread enters from the left, tightens (`e-tension`), and draws the next scene up over the current one like a new sheet: the incoming sheet translates from 100% to 0 with a soft curved top edge carrying the thread; 3 beads ride the thread; the outgoing scene scales to 0.98 and darkens 8% | scrubbed across 80 svh; beads lag the sheet by 6% of progress | not pinned or scrubbed: at the threshold the thread line draws across (300 ms) and the new scene cross-fades in (450 ms); no translation |
| ~~T2~~ | ~~Bloom pass~~ | retired 2026-09-17 | the Phase 3.5 brief makes the thread the cause of entering Welcome, so the opening enters through the Draw (§7.0) | — | — |
| **T3** | **Light shift** | 02 → 03, between celebrations, 05 → 06 | the ground colour and photo grade change as a scene's top passes 50% of the viewport | 1200 ms, time-based | 600 ms |
| **T4** | **Set by light** (type reveal) | names, titles, lines | a soft diagonal light band (gradient mask, 30% wide) sweeps across the text in the key light's direction; the text is fully present behind it | 1000 ms per line, 180 ms stagger | 500 ms, 100 ms stagger |
| **T5** | **Print settle** (image reveal) | every photograph | a mask opens from the photo's bleeding edge while the image inside scales 1.06 → 1.00 | mask 900 ms, scale 1400 ms | mask 360 ms, no scale |
| **T6** | **Letterbox open** | into 05 Venue | the venue appears as a 21:9 band between two hairlines; scrolling opens the band to the full frame while the image inside settles 1.12 → 1.00 | scrubbed across the venue's sticky 180 svh | the full frame is revealed by a 400 ms cross-fade; no band animation |

**Banned transitions:** fade-up, slide-in from the side without a cause, scale-in, flip, rotate, blur-in,
curtains, doors, page-turns, wipes with hard straight edges, glitches.

**Budget (phone):** pinned scroll for the three Draws is 240 svh (3 × 80); the venue's sticky letterbox adds
80 svh beyond its own height; **all scroll-linked distance together is ≤320 svh.** The desktop-only gallery pin
is outside this phone budget. *Why:* the whole page is about 18 screens on a phone; more pinning would make it
feel like a scroll-jacked marketing site.

---

## 4. Interaction principles

| # | Principle | Detail | Why |
|---|---|---|---|
| 1 | **Feedback within 100 ms.** | The pearl reacts to the tap immediately even though the entry lasts 2.2 s. | a slow response to a tap feels broken, however beautiful |
| 2 | **One gesture per moment.** | Tap to enter; scroll to read; swipe the gallery; type the reply. | clarity |
| 3 | **The whole cover is the button.** | The pearl is the affordance; anywhere works; Enter and Space work; Escape does not open it. | big target, honest keyboard behaviour |
| 4 | **Impatience is respected.** | A tap after 1.2 s fast-forwards the remaining opening at 4× speed, then plays the entry. Returning visitors (stored flag) get the opening at 1.6× with the hint shown at once. | the first visit is a film; the tenth is a link |
| 5 | **Native scrolling.** | No smooth-scroll libraries; pinning only within budget; momentum untouched. | in-app browsers and accessibility tools depend on native scroll |
| 6 | **Nothing depends on hover.** | Every state is reachable by tap and keyboard. | phones |
| 7 | **The reply is part of the story.** | RSVP inline on the reply card; success adds a pearl to the strand (with sound and a light haptic on Android). | the form becomes a gesture of joining |
| 8 | **Gallery swipes natively.** | Horizontal scroll-snap on phones; tap opens a full-screen view with focus trapped; swipe down or "Close" returns. Desktop scrubs horizontally with vertical scroll. | hijacking vertical scroll into horizontal fights thumbs |
| 9 | **Links leave gently.** | Maps and calendar open in a new tab (Google Calendar) or download an `.ics` (Apple); music pauses while the tab is hidden. | guests return to where they were |
| 10 | **Deep links.** | `?open` skips the opening; `#rsvp` opens straight to the reply card. | the family will forward "just reply here" links |

Haptics: `navigator.vibrate(8)` on the opening tap and RSVP success, Android only; nothing else.

---

## 5. Sound direction

### 5.1 Music

- **Instrument:** solo **santoor**, over a soft tanpura drone. Slow and free, like an alap: no percussion
  for at least the first 60 s.
- **Mood:** morning calm and devotional without temple bells; spacious, with silence between phrases.
- **Why santoor:** its struck strings fall like pearls — bright, discrete notes with a shimmer. It avoids the
  shehnai (wedding cliché) and the bansuri used in the user's family invite.
- **File:** a 60–90 s seamless loop made with the half-second wraparound the engine already supports
  (`loopStart`, `loopLength`). Candidates from Pixabay's music library, downloaded only with the user's
  approval. Fallback: solo piano with tanpura drone.
- **Level:** gain 0.55 of a normalised track; everything else is quieter.

### 5.2 Sound effects

| ID | Sound | When | Character |
|---|---|---|---|
| A02 | pearl click | the opening tap | soft, low, on paper |
| A03 | pearl roll | as the strand leaves on the tap | brief, muffled |
| A04 | thread pull | each Draw, once at 30% progress, forward scroll only, once per session per Draw | a fine dry tension, very quiet |
| A05 | silk swish | the opening's fabric sweep | one breath of cloth |
| A06 | bead drop | RSVP success | a pearl settling onto thread |
| A07 | knot | the closing knot | a soft cinch, followed by the music's fade |

Rules: every effect ≤1.2 s, about 6 dB under the music, dry (no long reverb), silent when muted, unaffected by
reduced motion.

### 5.3 Behaviour

| Moment | Behaviour | Why |
|---|---|---|
| Before the tap | silence | browsers block sound; and dawn is quiet |
| The tap | click at 0 ms; music starts at 400 ms and fades in over 3 s | the first sound belongs to the object the guest touched |
| Tab hidden | music suspends; resumes on return | courtesy |
| Mute | remembered per device; fades out over 400 ms | control |
| Closing at 60% in view | knot sound, then music fades to silence over 6 s; scrolling back above the closing fades it back in over 3 s | the film's ending |

Reused engine: `site/engine/sound.js` (tap unlock, gapless loop, fades, iOS playback). New: an effects bus on
the same audio context and a closing fade (`scene-architecture.md` §4).

---

## 6. Reduced-motion policy

| Element | Normal | Reduced |
|---|---|---|
| Opening narrative (light → deboss → pearl → strand → names → date → hint) | full, about 6.4 s | kept, about 2.2 s |
| Pearl roll | rolls in from the right edge | appears in place with a glint |
| Strand | beads slide along the thread | beads appear in place; thread draws along its length |
| Chanderi | drifts, then sweeps on the tap | static at 0.55 opacity; fades out on the tap |
| Foreground buds | tumble past | removed |
| Camera push on entry | yes | removed |
| The opening's Draw | the thread lifts the Welcome sheet in by its corner | thread tightens in place; the strand fades while moving ≤12 px toward the pull; Welcome cross-fades in 450 ms |
| The Draw | pinned and scrubbed | threshold-triggered: thread line draws, new scene cross-fades |
| Letterbox open | scrubbed | 400 ms cross-fade to the full frame |
| Light shift | 1200 ms | 600 ms |
| Set by light | 1000 ms per line | 500 ms per line |
| Print settle | mask 900 ms + scale | mask 360 ms, no scale |
| Parallax | Welcome, Story | none |
| Gathbandhan knot | tied over 1.4 s | drawn over 400 ms |
| Closing bloom | 2.4 s | 600 ms |
| Ambient (pearl lustre, lamp breath, music-pearl highlight) | slow, continuous | static |
| Sound | full | full |

Implementation: one motion policy object decides these values; scenes read tokens from it and never check the
media query themselves (`scene-architecture.md` §4). `?rm=1` forces the reduced cut for testing.

---

## 7. Scene 01 — Opening (dawn)

### 7.0 As built in Phase 3.5 (supersedes §7.2–7.5 where they differ)

The Phase 3.5 brief (2026-09-17) fixed the order of the opening and made the thread the mechanism for entering
Welcome. The prototype in `site/invitations/mogra-moti/scenes/01-opening.js` follows this score; the tables below
it (§7.3–7.5) remain as the Phase 1 design record. Scored in `design-evaluation.md`.

**Removed from the opening:** the chanderi breeze and sweep (no fabric beat in the brief's order), the passing
defocused buds and the Bloom pass. The camera push is replaced by the Draw's push-back of the card (0.98).

| t (s) | Beat | Lead (cause) | What the guest sees |
|---|---|---|---|
| 0–0.3 | Near-darkness | — | a dark frame; the paper's edge barely there |
| 0.25–2.55 | Morning light | a light front crosses from the top-left corner (a soft diagonal edge with a warm leading band, moved by transform) | marble, deckled card and paper fibre are found by the light; the cool shade at the lower right clears last |
| 0.95–2.35 | Blind deboss | the light's front passes the top of the card | R·A rises out of the paper; the foil knot glints once (2.05–2.95) |
| 2.1–3.35 | A pearl rolls in | its own momentum, from the right edge along the slack thread | one object crosses the lit card and comes to rest (`settle`) |
| 3.42–4.0 | The thread responds | the pearl's stop | slack → taut (`tension` 220 ms, then the thread's one `release` overshoot) |
| 3.78–5.1 | The thread draws | the pull at the upper right | the pearl is drawn into the gap between the names; three strand pearls follow in (60 ms apart) |
| 3.95–5.95 | Names | a brighter band of light travelling along the thread | "Rohan" (4.15), "Anaya" (4.33), surnames (4.51) set by light, 1000 ms each |
| 4.7–5.95 | Mogra | the strand's tail, still being drawn | three closed buds arrive last on the thread |
| 5.5–6.7 | Facts | the light settles | the weekday, then date and city, set by light |
| 6.25–7.25 | Invitation | — | "Touch the pearl" set by light; from 6.4 s the pearl's lustre drifts (the only ambient motion) |

**The Draw into Welcome (after the tap, ~1.8 s to hand-over):**

| t (ms) | Beat | Lead | What the guest sees |
|---|---|---|---|
| 0–120 | Touch | the guest | the pearl presses (0.94) and brightens; haptic on Android |
| 100–400 | Tension | the pull at the upper right | the thread straightens |
| 140–1180 | Strand leaves | the pull | pearl, pearls and buds run off the upper right, 40 ms apart |
| 260–1760 | The sheet | the thread, tied by a zari knot at the Welcome sheet's held corner | Welcome rises over the card from below; its held corner leads the free side by up to 9% of the height; deckled lit edge with soft contact shade; the card beneath pushes back to 0.98 and darkens 10% |
| 1780–2280 | Release | the pull continues | the thread slips its knot and leaves |
| 1600–2600 | Welcome | light | the heading's lines set by light 180 ms apart; its thread draws across and carries its pearl to 40% |
| 1780 | Hand-over | — | scrolling unlocks, focus moves to the `<h1>` |

**Reduced cut:** light by opacity (0–0.8 s) → deboss (0.4–0.86) → the pearl appears in place with a glint (0.9) →
the thread draws along its length (1.0–1.4) → strand pearls (1.15+) → names (1.3, 1.45, 1.6; 500 ms) → buds (1.75+)
→ facts (1.85–2.45) → hint (2.2). After the tap: press (0–120 ms), the thread tightens in place and the strand fades
while moving ≤12 px toward the pull (120–420 ms), Welcome cross-fades in (420–870 ms), its heading set by light;
hand-over at 950 ms.


**Purpose:** create curiosity, establish materials and light, and turn a tap into entering.
**Shot:** top-down still life. **Ground:** `--night-deep` → `--paper-dawn`.

### 7.1 Layout of the settled frame (390 × 844)

```
┌──────────────────────────────────────┐
│ [Sample invitation]          chanderi│  y 0–30%: sheer fabric over the top-right corner
│   ┌──────────────── card ───────────── │  card's deckled corner at x 6%, y 7%; marble beyond
│   │           ⟨R·A⟩ deboss            │  monogram centre x 50%, y 17%, 112 px
│   │                                 ╱  │  thread leaves the right edge at y 28%
│ Rohan                             ╱    │  Rohan baseline y 39%
│ MALHOTRA                     ╱         │
│                          ●╱            │  hero pearl in the gap, x 40%, y 52%, 20 px
│                  ○●○●○╱       Anaya    │  strand on the lower-left segment; Anaya baseline y 61%
│             ○●○╱                KAPOOR │
│         ○●╱                            │  thread enters the left edge at y 74%
│                                        │
│ MONDAY                                 │  y 83%
│ 15 February 2027 · Hyderabad           │
│ TOUCH THE PEARL                    ◌   │  y 92% hint, left; music pearl hidden until tap
└──────────────────────────────────────┘
```

### 7.2 Layers (back to front)

| Layer | Contents | Asset |
|---|---|---|
| L0 | night ground; marble strip left and top of the card | `T03` |
| L1 | card: paper texture, deckled edge, light falloff gradients | `T01`, `T02` |
| L1b | deboss monogram (highlight, shadow, occlusion) + foil loop | `V02` |
| L2 | thread, strand beads (pearls `O02`, closed buds `O03`), hero pearl `O01` and its cast shadow | `V01` |
| L2b | names, surnames, date, hint (live text) | fonts |
| L3 | chanderi with its cast shadow and shadow-work sprite beneath | `T04`, `V03` |
| L4 | two passing defocused buds; the bloom-pass bud | `O06` |

### 7.3 Before the tap — normal motion (about 6.4 s)

Waits first for fonts and the first-frame images to decode (max 1.8 s); the dark ground hides the wait.

| t | Beat | Lead (cause) | Followers | Ease | Frame description | Why |
|---|---|---|---|---|---|---|
| 0.0–1.6 | **Light** | light rises from the top left: a gradient over the card goes from 0 to full; ground night-deep → paper-dawn | paper grain appears where the light rakes | `e-light` | darkness becomes a card on marble, lit from the corner | materials revealed by light; "something is about to happen" |
| 0.9–2.1 | **Relief** | the light's leading band passes the monogram | deboss highlight and shadow layers emerge; the foil loop glints once along its path | `e-light` | R·A rises out of the paper without ink | the name of the design is present before any words |
| 1.8–3.1 | **Pearl** | a pearl rolls in from the right edge along y 52%, surface rotating, highlight fixed; it decelerates and stops at x 40% with one 1.5 px wobble | its cast shadow travels with it | `e-settle` | one object crosses a still card | a single moving object creates curiosity |
| 3.0–3.5 | **Tension** | the pearl stops; the slack thread trailing behind it snaps taut from the left edge (y 74%) through the pearl to the right edge (y 28%) | the thread's shadow line tightens with it | `e-tension` 200 ms, then `e-release` | a diagonal line cuts the card | the stop *causes* the tension |
| 3.4–4.5 | **Strand** | tension pulls beads in from the left edge along the thread | ten beads (pearl, bud, bud, pearl …) slide up toward the pearl, 60 ms apart, bunching then spacing | `e-settle` | a strand of mogra and pearls is strung on screen | the concept, *moti pirona*, happens in front of the guest |
| 4.2–5.2 | **Names** | a second, brighter light band sweeps diagonally along the thread's direction | "Rohan" is set by light (4.2), "Anaya" (4.45), surnames (4.65) | `e-light` | the names appear on either side of the thread | light, not opacity, reveals the words; the thread holds them apart |
| 5.0–7.4 | **Breeze** | sheer chanderi drifts in over the top-right corner, rotation ≤1.5° | its shadow and shadow-work motif follow 120 ms later; two defocused buds tumble through the bottom-right foreground (5.3–6.3) | `e-silk`; buds linear with a slight curve | a breath of air crosses the table | depth and air; the monogram half-seen through fabric |
| 5.8–6.4 | **Date** | the light settles | "MONDAY" and "15 February 2027 · Hyderabad" set by light | `e-light` | the facts, low and left | after the names, one fact |
| 6.4 | **Invitation** | — | "TOUCH THE PEARL" set by light; the hero pearl's highlight begins drifting ±2 px over 6 s | — | still frame, one slow shimmer | an object to touch, not a pulsing label |

Concurrency check: never more than three leads and followers moving at once.

### 7.4 After the tap — normal motion (about 2.2 s)

| t (ms) | Beat | Lead | Followers | Sound | Ease |
|---|---|---|---|---|---|
| 0–120 | **Touch** | the pearl presses down (scale 0.94) and its highlight brightens | — | A02 click; haptic | `e-settle` |
| 120–820 | **Pull** | the thread is pulled toward the top-right exit | pearl and beads slide up the diagonal and off the right edge, 40 ms apart, passing through the gap between the names | A03 roll | `e-tension` 200 ms → `e-camera` |
| 400 | **Music** | — | music begins its 3 s fade-in | music | — |
| 450–1350 | **Sweep** | the strand leaving through the top-right catches the chanderi and drags it across the whole frame, top right to bottom left | its shadow follows | A05 silk | `e-silk` |
| 700–1300 | **Bloom pass** | a large defocused closed bud, flung by the fabric, crosses bottom to top through the centre, peak coverage at ~1150 ms | — | — | linear, slight curve |
| 600–2200 | **Push** | the camera pushes toward the monogram (paper 1.00 → 1.18, per-layer ratios §2) | light warms from dawn to morning grade | — | `e-camera` |
| 1150 | **Cut** | hidden by the bloom pass, the cover is replaced by Scene 02, which starts at scale 1.06 | — | — | — |
| 1150–2200 | **Arrive** | Scene 02 settles 1.06 → 1.00, continuing the push's momentum | the welcome's thread line starts where the monogram's foil loop was on screen (a match cut) | — | `e-settle` |
| 2200 | **Hand over** | scrolling unlocks; focus moves to the `<h1>` | the music pearl appears bottom right | — | — |

### 7.5 Reduced motion (about 2.2 s before the tap, 0.9 s after)

| t | Beat |
|---|---|
| 0.0–0.8 | light rises (opacity and grade only) |
| 0.4–1.0 | deboss emerges; one foil glint |
| 0.9–1.3 | pearl and beads fade in in place (300 ms) with a single glint on the pearl; the thread draws along its length (400 ms) |
| 1.3–1.8 | names set by light (500 ms, 150 ms apart) |
| 1.8–2.2 | date set by light; chanderi fades to 0.55 in place |
| 2.2 | hint appears; nothing moves |
| tap 0–120 ms | pearl press + click + haptic |
| tap 120–420 ms | thread tightens; strand fades while moving at most 12 px toward the exit; chanderi fades out |
| tap 420–870 ms | cross-fade to Scene 02 while the grade warms; music starts its 3 s fade-in |

### 7.6 Hero-gate capture points

Frames Playwright must capture at 390×844, 393×852, 412×915 and 1440×900, and score, before any other scene
gets major work:

- Normal: t = 0.5, 1.5, 2.5, 3.2, 4.0, 4.8, 5.6, 6.5; after tap +0.12, +0.6, +1.15, +1.6, +2.2 s
- Reduced: t = 0.5, 1.2, 1.8, 2.3; after tap +0.3, +0.9 s
- Plus a video of each full sequence

### 7.7 Scene anti-patterns

The pearl bouncing; beads falling like rain; names fading up; a pulsing "tap" label; a visible hand; the fabric
waving continuously; gold glows; any curtain-like centred split.

---

## 8. Scene 02 — Welcome (morning)

**Purpose:** the formal invitation in an editorial composition. **Ground:** `--paper-dawn`. **Grade:** Dawn.
**Height:** about 190 svh.

### First viewport

```
┌──────────────────────────────────────┐
│ ०२  WELCOME          ┌───────────────│  chapter mark top left
│                      │               │  P01: hands stringing mogra, 2:3,
│                      │   photograph  │  bleeds right, x 44–100%, y 10–49%
│        ◦ bud         │               │  a closed-bud cut-out on paper, x 18% y 44%
│                      └───────────────│
│ Rohan Malhotra                        │  <h1> title scale, flush left, y 58%
│ ────────●──────────╲                  │  the thread and its pearl as line two
│ Anaya Kapoor                          │  y 70%
│ are getting married                   │  type-line
│                                       │
│ 14–16 FEBRUARY 2027 · HYDERABAD       │  label, y 88%
└──────────────────────────────────────┘
```

### Second viewport

The families and the words, left-aligned in columns 1–5: optional invocation line (`type-mark`, only if
provided); "Together with their families" (label); "Nandini & Arvind Malhotra" and "Ritu & Ashwin Kapoor" (info
lines); a hairline; the welcome line in `type-line` (placeholder, 10 words: "Three days in February, and mogra
for every one.").

| Beat | Normal | Reduced |
|---|---|---|
| Entry | arrives from the opening's push (§7.4) | arrives by cross-fade |
| P01 | already settled (it is revealed by the bloom pass) | same |
| `<h1>` | set by light, lines 180 ms apart; the thread draws from left to right under line one (700 ms) and its pearl slides to x 40% | set by light 500 ms; thread draws 300 ms; pearl in place |
| Bud cut-out | parallax 1.12 | static |
| P01 | parallax 0.92 | static |
| Second viewport | families' lines set by light at 50% visibility | same, shorter |
| Exit | **T3 Light shift** to `--paper` | 600 ms |

Scene anti-patterns: centring the names; a photograph with equal margins; a countdown; decorative dividers.

---

## 9. Scene 03 — Our Story (midday)

**Purpose:** their story as three magazine spreads. **Ground:** `--paper`. **Grade:** Midday. **Height:** about
300 svh. Copy is placeholder (`scene-architecture.md` §7).

| Spread | Composition at 390 px | Motion (normal) | Reduced |
|---|---|---|---|
| **A · A shared table** | P02 (2:3) bleeds left, x 0–70%, top of the spread; caption label + hairline at the right, aligned to the photo's bottom edge ("HYDERABAD, 2019"); pull quote in `type-title` below across columns 2–6; 2 lines of body | P02 print settle (from left); quote set by light; P02 parallax 0.92 | shorter settle, no parallax |
| **B · Six years of Sundays** | text first, top left, columns 1–4; P03 (4:5) bleeds right, x 48–100%; P05 (9:16, silhouettes from behind) bleeds left, x 0–62%, overlapping P03's lower-left corner by 18%, casting `--shadow-lift` | P03 settles from the right, then P05 from the left 250 ms later; P05 parallax 0.88, P03 0.96 (they slide past each other slightly) | settles only |
| **C · The question** | P04 full bleed on the bottom edge of the spread (9:16), text above on paper: pull quote in `type-title` (placeholder: "He asked on her grandmother's terrace, with a strand of mogra instead of a ring.") | print settle from the bottom; quote set by light | shorter |
| **Exit** | — | **T1 The Draw** into Celebrations | reduced Draw |

Scene anti-patterns: a grid of equal photos; dates as a timeline; captions centred under photos; rounded
corners.

---

## 10. Scene 04 — Celebrations (afternoon; each photograph at its own hour)

**Purpose:** four celebrations, each with its own composition, all equally easy to read.
**Ground:** `--paper-warm` throughout. **Height:** about 460 svh.

**Information contract (identical in all four):** the event name; a label with weekday and date; time; venue name
and area; a "Wear" label with the dress note; two thread links — Directions and Add to calendar. Same order, same
type tokens, same spacing. *Why:* guests compare events; only composition changes.

### Opener

Chapter mark `०४ CELEBRATIONS`; `type-line`: "Four celebrations. We'd love you at every one." (placeholder).
Arrives with the Draw.

### 10.1 Mehendi — Sunday 14 February, 1:00 pm (afternoon)

| | |
|---|---|
| Composition | P06 (hennaed hands, 4:5, Afternoon grade) bleeds left, x 0–78%; "Mehendi" in `type-display`, `--mehendi` colour, right-aligned at 372 px (opposite the bleed), baseline 20 px below the photo; info block below, columns 2–6; one chikan bud shadow motif faint behind the info block |
| Why | the henna colour enters as the page's only warm accent; hands are the ceremony |
| Motion | print settle from the left; name set by light; info lines set by light 180 ms apart |
| Reduced | shorter, no scale |

### 10.2 Sangeet — Sunday 14 February, 7:30 pm (evening)

| | |
|---|---|
| Composition | P07 (dancing feet with anklets, motion blur, 3:2, Godhuli grade) bleeds right, x 22–100%; "Sangeet" set **vertically** (rotated −90°, reading upward) along the left margin in `type-display`, from y 70% to 20% of the composition; info block to the right of the vertical word, under the photo |
| Why | rhythm: the one vertical word breaks the horizontal repetition like a beat; motion blur is the only movement captured in a photograph |
| Motion | print settle from the right; inside its mask the image pans 3% horizontally over 2 s (film pan); vertical word set by light along its length |
| Reduced | no pan |

### 10.3 The Wedding — Monday 15 February, 6:30 pm (night)

| | |
|---|---|
| Composition | **the only centred, symmetrical composition in the invitation.** A thread descends from the top centre and ties the gathbandhan knot at y 18%; below it P08 (two fabrics knotted, or hands with sacred thread; Lamp grade) centred at 70% width, 4:5; "THE WEDDING" in `type-label` centred directly above "15" in `type-figure`, `--zari-ink`, which sits centred behind the lower edge of the photo; info block centred (the figure is this scene's one display size — `typography-system.md` §3, rule 13) |
| Why | the pheras are the sacred centre; symmetry reserved for it gives it weight; the thread that has run through the invitation becomes the knot that marries them |
| Motion | knot tied over 1.4 s (two paths drawn in sequence, `e-silk`, ending in a small `e-release` cinch); photo settles from the top; "15" set by light |
| Reduced | knot drawn in 400 ms; photo mask 360 ms |

### 10.4 Reception — Tuesday 16 February, 8:00 pm (late night)

| | |
|---|---|
| Composition | P09 (pearl jewellery against dark fabric, low key, 9:16, Lamp grade) full bleed; a bottom scrim to `#15110E` at 70%; "Reception" in `type-display`, `--pearl`, bottom left over the scrim; info block below the photo on a `--night` band |
| Why | the first taste of night, previewing the page's ending; pearls return at their most luminous |
| Motion | print settle from the bottom; one nacre light pass across "Reception" (1.2 s) |
| Reduced | no light pass; the word is set by light in 500 ms |

**Between celebrations:** T3 Light shift, which only warms the photo grade; the ground stays `--paper-warm`.
**Exit:** T6 Letterbox open into the Venue.

Scene anti-patterns: identical layouts; icons for time or place; buttons; a dress-code colour swatch rack; any
event without the same five facts.

---

## 11. Scene 05 — Venue (dusk)

**Purpose:** reveal the wedding venue like an establishing shot. **Ground:** `--dusk`. **Grade:** Godhuli.
**Height:** 180 svh sticky frame + 100 svh text.

| Beat | Normal | Reduced |
|---|---|---|
| Arrival | chapter mark `०५ THE VENUE`; P10 (a garden by water at golden hour, no palace) appears as a 21:9 band centred vertically between two `--zari` hairlines | full frame shown at once |
| Scroll | the band opens to a full-bleed 9:16 frame across the sticky section; the image inside settles 1.12 → 1.00; the hairlines travel with the band's edges and fade at full size | cross-fade 400 ms |
| After | the frame releases; on `--dusk`: "Chandni Bagh" in `type-display`, "Gandipet, Hyderabad" in `type-info`, "THE WEDDING · MONDAY 15 FEBRUARY · 6:30 PM" label, 2 lines of body, thread links "Open in Maps" and "Add to calendar" | same, text set by light 500 ms |
| Exit | **T3 Light shift** to `--night` | 600 ms |

No map embed. *Why:* an embedded Google map is a generic widget, loads heavy third-party code, and tracks guests;
a link does the job.

---

## 12. Scene 06 — Gallery (night)

**Purpose:** a film strip of moments. **Ground:** `--night`. **Grade:** Lamp. **Height:** about 110 svh.

| | Normal | Reduced |
|---|---|---|
| Composition | chapter mark in `--zari`; a horizontal strip of 8 frames on a shared baseline, heights 58 svh, widths by ratio (4:5, 2:3, 16:9 mixed); 10 px gaps; the first frame starts at 20 px and the second peeks from the right edge; under each frame a label: frame number ("01") and one caption word | same |
| Swipe | native scroll-snap; inside each frame the image shifts ±12 px opposite the swipe | no inner shift |
| Entry | frames settle from the right edge in sequence as the strip enters (120 ms stagger, first three only) | mask 360 ms, first frame only |
| Full view | tap opens the frame full screen over `--night-deep` with its caption; swipe for next; "CLOSE" label at top right; focus trapped | same, cross-fades only |
| Desktop | pinned; vertical scroll moves the strip horizontally | cross-fade view, no pin |
| Exit | **T1 The Draw** brings the reply card up | reduced Draw |

Scene anti-patterns: a 3-column grid; dots under a carousel; auto-advancing slides; rounded thumbnails.

---

## 13. Scene 07 — RSVP (night, lamp-lit card)

**Purpose:** reply as a gesture of joining the strand. **Ground:** `--night` with a `--paper` card lit from the
top left. **Height:** about 150 svh.

**Composition:** the card fills the width minus 12 px margins with a deckled top edge (the top-down shot
returns, echoing the opening). A thread runs across the card's top with one pearl on it. Inside, left-aligned:

1. `०७` mark + label "KINDLY REPLY BY 15 JANUARY 2027"
2. "Will you join us?" in `type-title`
3. "YOUR NAME" label + ruled input
4. Two choice words with pearl markers, in `type-info`: "Joyfully accepts" / "Regretfully declines"
5. If accepting: "WHICH CELEBRATIONS" + four choice words in `type-info` (Mehendi, Sangeet, Wedding, Reception);
   "HOW MANY OF YOU" + stepper "−  2  +" with the number in `type-info`
6. "A WISH FOR THEM" (optional) + two ruled lines (`type-input`)
7. "Send reply" — the page's one filled button (label type)
8. In the sample: a note in `type-body`, `--ink-soft`: "This is a sample invitation, so replies aren't saved."

Type sizes on the card: 44 (title), 16 (reading tier: choices, inputs, note), 11 (labels) — three.

| Beat | Normal | Reduced |
|---|---|---|
| Arrival | the Draw pulls the card up; lamp glow already on | cross-fade |
| Choosing | a chosen word's pearl fills with nacre (280 ms); follow-up questions reveal below by print settle from the top (no fade-up) | 200 ms, no movement |
| Errors | inline label in `--err` under the question; focus moves to the first problem | same |
| Sending | the button label reads "Sending…"; the thread across the top tightens slightly | no tension animation |
| Success | a new pearl slides along the top thread and settles beside the first (`e-settle`, A06, haptic); the form is replaced by "Thank you, {first name}." in `type-title` and "Your reply is with the family." in `type-line`, plus "Change my reply" link | pearl appears in place with a glint |

Engineering reuse: `site/engine/rsvp.js` validation, persistence and submission, with theme-supplied markup and
id-based event matching (`scene-architecture.md` §4).

Scene anti-patterns: bordered input boxes; toggles; radio circles; a modal; confetti on success.

---

## 14. Scene 08 — Closing (late night)

**Purpose:** the last frame of the film, and the memory the guest keeps. **Ground:** `--night-deep`, one lamp at
top left. **Height:** about 140 svh.

### Final frame (390 × 844)

```
┌──────────────────────────────────────┐
│░ lamp glow                           │
│ Rohan                                │  masthead, --pearl, baseline y 30%
│ MALHOTRA                        ╱    │
│                              ╱       │  the thread passes between the names …
│                   Anaya  ●╱          │  … Anaya baseline y 48%
│                          KAPOOR      │
│        ✿●✿●✿●✿●✿●✿                   │  … and becomes the strand, knotted, in full bloom,
│      ✿            ⌘ knot ●✿          │  lying in a loose loop across y 58–78%
│        ✿●✿●✿●✿●✿●                    │
│ 15 · 02 · 2027                       │  label in --zari, y 84%
│ Strung at dawn, open by night.       │  type-line, --pearl, y 88% (placeholder, 10 words)
│ Be there for both.                   │
└──────────────────────────────────────┘
```

Below, after 40 svh of night: "WITH LOVE, THE MALHOTRA AND KAPOOR FAMILIES" (label); "QUESTIONS? KABIR MALHOTRA ·
+91 98••• •••••" (placeholder, masked); a hairline; "Sample invitation by Shaadi Saathi" (`type-body`) and the
thread link "MAKE THIS INVITATION YOURS".

| t | Beat | Normal | Reduced |
|---|---|---|---|
| Draw | **T1 The Draw** brings up the night sheet; as it completes, the thread's two ends meet | pinned, scrubbed | reduced Draw |
| 0.0–1.2 | **Knot** | the ends cross and cinch into a knot (`e-silk` → `e-release`); A07 | drawn 400 ms; A07 |
| 0.4–2.8 | **Bloom** | the strand's buds cross-fade closed → half → full bloom, left to right, 120 ms apart | one 600 ms cross-fade |
| 1.0–2.0 | **Names** | set by light in pearl | 500 ms |
| 2.0–2.6 | **Date and line** | set by light | 500 ms |
| 60% in view | **Music** | fades to silence over 6 s | same |
| after | **Stillness** | only the lamp breathes (≤2%) and the knot's pearl highlight drifts | nothing moves |

**What the guest remembers:** this frame (`creative-concept.md` §4.10). It is also the source for the share image.

Scene anti-patterns: "Thank you ❤️"; a footer with social icons; back-to-top buttons; fireworks; the sales pitch
before the ending has finished.
