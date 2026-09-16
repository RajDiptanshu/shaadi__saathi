# Mogra & Moti — material library

What each material is, why it is in the design, how it looks, how it is made on screen, how it moves, how it
sounds, what reduced motion does to it, and what it costs. Target: **luxury editorial realism**, never glossy
CGI.

Two rendering rules apply to everything:

1. **Photograph what exists; draw only what must move precisely.** Real textures and cut-out photographs carry
   realism; SVG is reserved for thread, knot, monogram geometry and shadow motifs.
2. **Render expensive looks once, composite cheaply at runtime.** Lighting, blur and shadows are baked into
   image files during the asset pipeline. At runtime only `transform`, `opacity` and small masks animate.
   *Why:* SVG lighting filters, CSS blur and blend modes repaint every frame and stutter on mid-range Android
   phones inside WhatsApp's browser.

---

## 0. Light and shadow model

**One key light, top left, for the whole invitation** (azimuth 315°). Its height and colour change with the
chapter; its direction never does.

| Chapter | Elevation | Shadow length vs object | Colour |
|---|---|---|---|
| Dawn | low (~15°) | 3× | cool, `#DDE0E0` tint |
| Morning | ~30° | 1.7× | neutral |
| Midday | ~60° | 0.6× | neutral bright |
| Afternoon | ~35° | 1.4× | warm, `#F4E3C8` tint |
| Dusk | ~10° | 4× | gold, `#EBC98F` tint |
| Night | lamp at top left, close | soft, falls off within 40% of the frame | `--lamp` |

*Why one direction:* pearl highlights, deboss edges, thread shadows and photographed objects all agree, which is
what makes separate assets read as one physical scene. It also constrains photo selection (light from the left).

### Shadow tokens

Offsets always point away from the light (right and down).

| Token | Value | Use |
|---|---|---|
| `--shadow-contact` | `1px 1.5px 1px rgba(42,37,32,.20), 2px 4px 6px rgba(42,37,32,.10)` | thread, small objects resting on paper |
| `--shadow-lift` | `6px 12px 26px rgba(42,37,32,.14)` | a photograph overlapping another |
| `--shadow-cast` | pre-rendered soft ellipse sprite, stretched by chapter length | pearl, buds, deboss |

Cut-out objects never use CSS `filter: drop-shadow()` while animating; their shadow is a separate pre-blurred
sprite that moves with them (and lags 1 frame behind to feel attached, not glued).

---

## 1. Nacre — the signature material

**What:** the lustre of pearl — layered, soft, with a travelling highlight and faint blush and sage overtones
at its edges (the "orient").

**Why:** it is literally *moti*, it replaces gold as the luxury cue, and its essence is light moving slowly
across a surface, which is a motion idea as well as a colour.

**Look:**
- base `--pearl` with a darker `--pearl-shade` terminator away from the light
- specular highlight: soft ellipse, top left, never a hard white dot
- orient: a 1–2 px fringe of `--orient-blush` on one side of the highlight and `--orient-sage` on the other
- a faint reflection of the paper along the lower edge

**On screen:**

| Where | Made as |
|---|---|
| Hero pearl (Scene 01) | photographed near-round pearl, cut out, 3× size (`O01`); highlight baked in; a separate "surface" layer with faint blemishes inside a circular mask that rotates while the pearl translates, so it reads as rolling while the highlight stays fixed to the light |
| Strand pearls | photographed small pearls (`O02`), three variants so no two neighbours are identical |
| Music control, RSVP markers | CSS radial gradients (12–28 px) + a 2 px highlight; at this size CSS is convincing |
| Reception type | one pass of a narrow soft gradient (pearl → mogra → pearl, orient fringes) masked to the word |

**Motion physics:** a pearl has mass. It decelerates with `e-settle`, wobbles once (≤1.5 px) as it stops, and
its highlight never rotates with it. Idle lustre: the highlight drifts ±2 px over 6 s (normal motion only).

**Sound:** a soft, low click on paper; a brief roll (never a marble on glass).

**Reduced motion:** no rolling; pearls appear in place with one glint (highlight opacity 0.6 → 1 → 0.8 over
400 ms). Idle lustre off.

**Cost:** hero pearl ≤25 KB (AVIF with alpha; 20 px on screen, about 24 px at the peak of the camera push, so a
96 px file covers 4× displays); strand pearls ≤6 KB each.

**Never:** rainbow iridescence, holographic gradients, sparkles, glowing halos, perfect CG spheres.

---

## 2. Cotton-rag paper, with blind deboss

**What:** heavy handmade cotton paper, warm white, visible fibres, a deckled edge. The monogram is pressed
into it without ink.

**Why:** it is the invitation itself — the object guests understand as "stationery". Blind deboss is the most
restrained luxury print technique: it exists only when light touches it, which is exactly the opening's idea.

**Look:** fibre texture visible only at low light angles; soft light falloff across the sheet; deckled edge
along the top and left in Scenes 01 and 07; the deboss shows a thin highlight on edges facing away from the
light and a thin shadow on edges facing it (pressed in, so the lit side is the far wall).

**On screen:**

| Layer | Made as |
|---|---|
| Paper texture | photographed cotton-rag texture (`T01`), made seamless, 1024 px tile, AVIF, applied as a background at 512 px scale |
| Light falloff | CSS radial and linear gradients on top of the texture; animated by opacity only (the dawn light) |
| Deckled edge | photographed or masked edge strip (`T02`) with alpha |
| Deboss monogram | from the vector monogram, rendered once in the pipeline with lighting: three PNG/AVIF layers — `highlight`, `shadow`, `occlusion` — composited at runtime; "emergence by light" is a gradient mask sweeping across the highlight and shadow layers |
| Foil (thread loop in the monogram) | vector path in `--zari` with a glint: a small gradient mask travelling along the loop once |

**Motion physics:** paper never bends, curls or flips. It only receives light and is pushed toward the camera.

**Sound:** none (a paper sound would be a gimmick).

**Reduced motion:** the light still rises and the deboss still emerges, over 600–800 ms.

**Cost:** texture ≤40 KB; deboss layers ≤30 KB total; edge ≤20 KB.

**Never:** crumpled paper, parchment, torn edges, visible bevel/emboss CSS effects, printed ink monograms.

---

## 3. Sheer chanderi with chikankari shadow work

**What:** a sheer silk-cotton fabric (chanderi) with a faint sheen, embroidered in the chikankari tradition of
white-on-white shadow work (bakhiya), where stitches on the reverse show through as soft shadow.

**Why:** it answers "silk" in the brief with an Indian textile, and it lets ornament exist only as shadow —
the most restrained way to be decorative.

**Look:** translucent ivory with fold highlights; soft-focus when in the foreground; motifs never crisp, only
as blurred shadows beneath the fabric on the paper.

**On screen:**

| Layer | Made as |
|---|---|
| Fabric | photographed sheer ivory fabric with folds (`T04`), alpha, opacity 0.55, placed as foreground |
| Shadow work | the three vector motifs (`visual-dna.md` §4.1) pre-rendered as blurred shadow sprites (`V03`), `--ink` 8–10%, on the paper beneath the fabric |
| Fabric's cast shadow | a pre-blurred shape derived from the fabric alpha, 12% opacity |

**Motion physics:** silk is slow and has follow-through. Translation with `e-silk`; rotation ≤1.5°; its cast
shadow lags 120 ms behind the fabric; edges settle last.

**Sound:** a single soft silk swish on the opening's tap (A05). Never on scroll.

**Reduced motion:** the fabric is placed in its final position and fades to 0.55 opacity over 400 ms; no drift,
no sweep. On the tap, it fades out instead of sweeping.

**Cost:** fabric ≤60 KB (it is large and soft; low detail compresses well); motif sprites ≤8 KB total.

**Never:** satin gloss, fluttering flags, waving loops, printed chikan patterns as fills.

---

## 4. The thread — champagne silk, zari-toned

**What:** a single fine silk thread in champagne, the strand's spine.

**Why:** the concept's object: it joins mogra and moti, holds the names apart, draws scenes in and ties the
knot.

**Look:** 1.25 px at 390 px; a highlight line toward the light; a contact shadow away from it; round ends;
where it passes behind something (the weave in Anaya's A, the knot), a 1 px gap on each side to read as depth.

**On screen:** SVG paths (`V01`). Beads are placed along the path with GSAP MotionPathPlugin by arc length:
pearl 16 px, bud 20 px, 4 px gaps. Slack and taut states are paths with the same number of points so they can
interpolate directly.

**Motion physics:**
- **tension:** accelerates into tautness with `e-tension` (expo in, 200 ms), then one tiny release overshoot
  with `e-release` — the only overshoot allowed anywhere, because strings physically do this
- **beads:** follow the thread with 40–60 ms stagger; they bunch as they start and space out as they settle
- **pull:** things on the thread leave in the direction of the pull, never another way

**Sound:** a fine, dry tension sound on draws (A04) — short, quiet, never a zipper.

**Reduced motion:** the thread is drawn along its length (stroke reveal, 300–400 ms) instead of snapping;
beads appear in place; a draw becomes a 450 ms cross-fade with the thread line drawing across.

**Cost:** inline SVG, negligible; beads are the image cost (see pearls and mogra).

**Never:** a straight horizontal rule, a timeline with nodes, a progress bar, a thread used as a divider
between sections.

---

## 5. Mogra — from bud to bloom

**What:** *Jasminum sambac*: waxy white petals, green-tinged tight buds, a faint green calyx. Buds are strung
closed in the morning and open at night.

**Why:** the name, the fragrance, and the clock of the whole invitation.

**Four states, used by chapter:**

| State | Look | Chapters |
|---|---|---|
| Closed bud | pointed, tight, green-white, calyx visible | 01–02 |
| Loosening | tip parting, petals still overlapping | 03–04 |
| Half open | 3–4 petals separating, cream centre shows | 05–06 |
| Full bloom | 5–8 open waxy petals, double-layered | 07–08 |

**On screen:** photographed cut-outs (`O03`–`O05`), 2–4 variants per state; a pre-blurred large bud for the
foreground pass (`O06`, made in the pipeline from a sharp bud). In the closing, bud → half → bloom versions of
the same strand positions cross-fade to "bloom" the strand.

**Motion physics:** light. Buds tumble slowly (rotation 40–90° across a pass), never spin; they drift with the
air that moves them; they never fall like rain.

**Sound:** none.

**Reduced motion:** no tumbling; the bloom cross-fade in the closing takes 600 ms instead of 2.4 s.

**Cost:** each cut-out ≤12 KB (AVIF alpha, 2× display size); the foreground pass bud ≤35 KB (large but soft).

**Never:** drawn flowers, petal showers, confetti-like falling buds, marigolds, roses.

---

## 6. White marble

**What:** honed white marble with faint warm-grey veins, the kind laid in old Indian courtyards (Makrana-type).

**Why:** the surface the card rests on in the opening: a quiet Indian luxury material that adds a second white.

**On screen:** photographed texture (`T03`), visible only as a thin strip beyond the card's deckled edge in
Scene 01, darkened by the light falloff. ≤15% of that frame.

**Motion physics:** static; receives light only.

**Reduced motion:** unchanged.

**Cost:** ≤35 KB (only a strip is visible; crop the file accordingly).

**Never:** polished glossy marble, gold veins, marble as a section background.

---

## 7. Lamp light

**What:** the warm light of a brass lamp in a dark room.

**Why:** the night chapters' only light source; it makes pearl text and gold legible and the strand glow.

**On screen:** CSS radial gradients from the top left, `--lamp` at ≤22% opacity to transparent, on `--night`
grounds; photographs graded with the Lamp recipe.

**Motion physics:** an optional breath of ≤2% opacity over 8 s (normal motion only).

**Reduced motion:** static.

**Cost:** CSS only.

**Never:** a drawn diya, flame illustrations, glowing bokeh circles, fairy lights overlays.

---

## 8. Grain

**What:** the fine grain shared by paper and photographs.

**Why:** a shared grain is what makes a photograph look printed on the same sheet as the type around it.

**On screen:** baked into the paper texture and into every exported photograph (about 4%, fine). **No
full-screen grain overlay at runtime.** *Why:* a fixed, blended overlay repaints on every scroll frame and
halves frame rates on phones.

---

## 9. Mehendi stain

**What:** henna's real colour on skin, from fresh orange to deep brown-red.

**Why:** the one warm accent in the design, borrowed from a photograph rather than invented.

**On screen:** in the Mehendi photograph (`P06`), and as `--mehendi` for the word "Mehendi" only.

**Never:** drawn mehendi patterns, henna-cone illustrations.

---

## 10. Material budget per viewport

At most **three material groups visible at once**. The strand (thread + pearls + mogra) counts as one group;
grain and light don't count. Opening: paper (with its marble surround), the strand, and chanderi arriving last
as a translucent foreground. *Why:* more materials compete and cheapen each other; restraint is the luxury.
