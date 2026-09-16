# Mogra & Moti — visual DNA

Colour, photography, image treatment, illustration, composition and interface elements. Every rule states why
it exists. Concept: `creative-concept.md`. Type: `typography-system.md`. Materials: `material-library.md`.

---

## 1. Colour system

### 1.1 Principle

**Every colour comes from a material in the concept.** Nothing is picked from a wedding palette.

| Material | Gives the palette |
|---|---|
| Cotton-rag paper in morning light | the ivories |
| Pearl and its orient (overtone) | pearl, blush, pale sage |
| Mogra calyx and leaf | sage |
| Zari / champagne silk thread | the golds |
| Printing ink on cotton | ink |
| Henna stain | the one warm accent (Mehendi scene only) |
| Lamp light in a dark room | night, lamp |

*Why:* colours derived from materials stay coherent with the photography and textures, and cannot drift into
generic "blush and gold wedding" territory.

### 1.2 Tokens

Contrast ratios are computed (WCAG 2.x) against the ground they are allowed on.

**Grounds**

| Token | Hex | Source | Used for |
|---|---|---|---|
| `--paper-dawn` | `#ECEAE4` | paper in cool first light | Scene 01 after the light rises, Scene 02 |
| `--paper` | `#F3EEE5` | cotton rag at midday | Scene 03, reply card in Scene 07 |
| `--paper-warm` | `#F2E8D9` | paper in afternoon sun | Scene 04 |
| `--dusk` | `#E8DAC4` | paper at godhuli | Scene 05 |
| `--night` | `#1E1915` | a lamp-lit room, not black | Scenes 06–07 |
| `--night-deep` | `#15110E` | the last hour | Scene 08; the dark before the opening's light |

**Ink and text**

| Token | Hex | On | Contrast | Rule |
|---|---|---|---|---|
| `--ink` | `#2A2520` | `--paper` | 13.1:1 | all primary text on light grounds |
| `--ink-soft` | `#675E55` | `--paper` / `--paper-warm` / `--dusk` | 5.5 / 5.2 / 4.6:1 | secondary text, labels, captions |
| `--zari-ink` | `#76603C` | `--paper` / `--paper-warm` | 5.2 / 4.9:1 | chapter marks, the Wedding's "15". **On `--dusk` only at ≥24 px (4.3:1).** |
| `--sage-ink` | `#535D4C` | `--paper` | 6.0:1 | rarely: botanical captions |
| `--mehendi` | `#7E4128` | `--paper-warm` | 6.5:1 | the word "Mehendi" and nothing else |
| `--err` | `#8E2F24` | `--paper` | 7.0:1 | RSVP error text only |
| `--pearl` | `#ECE6DF` | `--night` | 14.1:1 | primary text at night |
| `--night-soft` | `#A89C8F` | `--night` | 6.5:1 | secondary text at night |
| `--zari` | `#B89A6A` | `--night` | 6.5:1 | gold text **at night only**; on paper it is 2.3:1 and decorative |

**Material colours (never text on light grounds)**

| Token | Hex | Source | Used for |
|---|---|---|---|
| `--zari` | `#B89A6A` | champagne silk thread | the thread, hairline rules, foil |
| `--zari-light` | `#E2CFA6` | thread highlight | the thread's highlight line, foil glint |
| `--pearl-shade` | `#D4C9BD` | pearl's shadow side | CSS pearls (markers), paper deboss shadow tint |
| `--orient-blush` | `#E6CBC1` | pearl overtone | nacre highlight fringe |
| `--orient-sage` | `#D3DBD0` | pearl overtone | nacre highlight fringe |
| `--sage` | `#8C9885` | mogra calyx | botanical accents inside photos only |
| `--mogra` | `#FAF8F2` | petal highlight | the brightest white allowed |
| `--lamp` | `#F0C987` | brass lamp glow | radial light at night, max 22% opacity |

### 1.3 Rules

1. **No pure white or black.** Lightest `#FAF8F2`, darkest `#15110E`. *Why:* pure values look digital and
   flatten material differences.
2. **Gold is a thread, not a fill.** `--zari` covers under 3% of any light viewport and is never a gradient
   background. It becomes text only on night grounds. *Why:* gold fills are the template signal we reject; at
   night gold text is both legible and warm.
3. **Blush and sage live inside materials.** They appear as pearl overtones, photographed calyxes and the
   nacre fringe — never as flat section backgrounds or button colours. *Why:* flat blush/sage blocks read as
   stock wedding palettes.
4. **One accent per scene at most.** `--mehendi` exists only in Mehendi. *Why:* accent scarcity keeps the
   white-on-white identity intact.
5. **The ground follows the clock** (table below). Grounds change only at chapter transitions, never
   mid-reading.
6. **The page ignores the OS dark theme.** *Why:* the light-to-night arc is the narrative. Form controls still
   get `color-scheme: light` on paper and `dark` on night so native pickers match.

### 1.4 The clock

| Scene | Ground | Photo grade | Light direction and quality |
|---|---|---|---|
| 01 Opening | `--night-deep` → `--paper-dawn` | — | low, cool, raking from top left; long shadows |
| 02 Welcome | `--paper-dawn` | Dawn | soft window light from left |
| 03 Our Story | `--paper` | Midday | even, bright, short shadows |
| 04 Celebrations | `--paper-warm` | each photo graded to its own hour | afternoon sun from left |
| 05 Venue | `--dusk` | Godhuli | low gold light from left |
| 06 Gallery | `--night` | Lamp | warm pools of light, deep surround |
| 07 RSVP | `--night` with a `--paper` card | Lamp | a lamp at top left lighting the card |
| 08 Closing | `--night-deep` | Lamp | one lamp; the strand glows |

### 1.5 Proportions per light viewport

About 70% paper, 20% photography, 7% ink, under 3% zari. Night viewports: about 65% night, 25% photography,
8% pearl text, 2% zari.

---

## 2. Photography direction

### 2.1 What we photograph

Materials and gestures first, people second, and people as they are, not posed at the camera.

**Preferred subjects** (from the user's direction): hands, mehendi, jewellery, fabric, flowers, stationery,
architecture, venues, silhouettes, people from behind, cropped editorial portraits, atmospheric moments.

**Faces:** allowed when the photograph is natural, candid, well lit, not looking into the lens with a stock
smile, and properly licensed. Any identifiable person is flagged "replace before commercial launch" in the
manifest unless a model release is recorded.

*Why:* detail photography holds its quality at small phone sizes, survives free-stock sourcing, and tells a
story without asking a guest to believe strangers are the couple.

### 2.2 Light and lens

| | Rule | Why |
|---|---|---|
| Light | natural, soft, from the **left or top left** | one key light across the invitation (see `material-library.md` §0) |
| Contrast | gentle; detail in petals and in shadows | whites and pearls must keep texture |
| Lens feel | 50–100 mm, shallow depth of field, f/1.8–2.8 look | intimacy, separation, editorial compression |
| Angles | top-down for stationery and flat lays; eye level or slightly below for places; close for hands | matches the camera language (`animation-storyboard.md` §2) |
| No | flash, ring light, HDR, wide-angle distortion, drones, tilted horizons, visible logos or text | each reads as stock or documentary, not editorial |

### 2.3 Grade recipes

Applied before export (Phase 3 decides the tool: an editor by hand, or scripted in the image pipeline).
Numbers are Lightroom-style relative values; the manifest records which recipe each image received.

| Recipe | White balance | Contrast | Highlights / whites | Shadows / blacks | Saturation | Split tone |
|---|---|---|---|---|---|---|
| **Dawn** | neutral-cool (≈5200 K) | −15 | −30 / −10 | +10 / +12 | −25; greens → sage (hue −15, sat −35) | highlights pearl (25°, 5); shadows cool grey (210°, 4) |
| **Midday** | neutral (≈5600 K) | −10 | −25 / −8 | +8 / +10 | −20; greens → sage | highlights blush (20°, 5); shadows umber (30°, 6) |
| **Afternoon** | warm (≈6000 K), tint +4 | −10 | −20 / −6 | +8 / +10 | −15; reds −10 (except henna) | highlights blush (22°, 7); shadows umber (30°, 8) |
| **Godhuli** | warm (≈6800 K) | −8 | −25 / −10 | +6 / +8 | −15; blues −40 | highlights lamp (40°, 12); shadows umber (28°, 10) |
| **Lamp** | tungsten look (≈3400 K) | +5 | −15 / −12 | +4 / black point `#1E1915` | −15 | highlights lamp (40°, 14); shadows umber (28°, 12) |

Shared rules: no clarity or dehaze boosts (they create the HDR look); highlights never above `#FAF8F2`;
blacks never below `#15110E`; grain matches the paper (fine, about 4%), baked into the export — never a
runtime overlay (see `material-library.md` §8).

*Why graded recipes rather than filters:* photos from different photographers only look like one shoot when
white balance, contrast and black point are matched per scene.

### 2.4 Crops and ratios

| Ratio | Use |
|---|---|
| 4:5 | default portrait: hands, details, jewellery |
| 2:3 | tall editorial: story, welcome |
| 9:16 | full-bleed moments (one in Story, Reception, closing) |
| 3:2 source → 21:9 display | venue letterbox (needs a wide original) |
| 16:9 | Sangeet motion, gallery variety |

Every image records a **focal point** (`x, y` in 0–1) in the manifest, used as `object-position`, so crops
stay correct at 390, 393, 412 and 1440 px.

*Why:* tall ratios suit a phone and echo the vertical type; recorded focal points stop automatic centre-crops
from cutting off hands or knots.

---

## 3. Signature image treatment

**Graded to the hour. One edge bleeds. It settles into place.**

1. **Graded to the hour** — the recipe of its scene (§2.3).
2. **One edge bleeds.** An inline photograph touches exactly one screen edge: left, right, top or bottom.
   Never equal margins on all sides.
   Declared exceptions, and no others:
   - **centred:** the Wedding photo (sacred symmetry — the one centred composition);
   - **full screen** (touching both sides): Story spread C, Reception, the Venue once its letterbox has opened,
     and the gallery's full-screen view;
   - **film strip:** gallery frames sit in a strip that starts at the left margin and runs off the right edge.
3. **Settles into place.** Entrance = a mask opening from the bleeding edge (0 → 100% over 900 ms,
   `e-settle`) while the image inside scales from 1.06 to 1.00 over 1400 ms. Reduced motion: mask opens over
   360 ms, no scale.
4. **Shares the paper.** No borders, no rounded corners, no drop shadows on flat photos. When one photo
   overlaps another, the upper one casts `--shadow-lift` (`material-library.md` §0).

*Why:* bleeding edges are the fastest way to make a phone layout feel editorial rather than stacked; the
settle gives photographs weight without the banned fade-up; no frames keeps the paper the only surface.

---

## 4. Illustration direction

**Almost nothing is drawn.** The concept is material and photographic; vector is used only where it must move
precisely or where a photograph cannot exist.

### 4.1 What is drawn

| Element | Spec | Why vector |
|---|---|---|
| **The thread** | 1.25 px core stroke `--zari` at 390 px width (scales to 2 px at 1440); highlight line 0.5 px `--zari-light` offset −0.4 px toward the light; contact shadow 0.75 px `rgba(42,37,32,.18)` offset +1.2 px away from the light. Round caps. | must change shape (slack → taut), carry beads, and cross the screen |
| **Monogram** | R and A in Imbue 200 at optical size 100, R upper left and A lower right with bounding boxes overlapping 18%; one thread loop passes *behind* the R's leg and *in front of* the A's crossbar and closes in a small knot below. The letters are blind-debossed (no ink); only the loop is champagne foil. | the deboss relief is pre-rendered from this vector (`material-library.md` §2) |
| **Chikankari shadow work** | three original motifs drawn as closed outline paths: a mogra bud (phool), a vine with rice-grain knots (murri), a small lattice (jaali). Never displayed as lines — only as a shadow: blurred 4 px, `--ink` at 8–10%, beneath a sheer fabric layer. At most one motif cluster per viewport. | ornament that exists only as shadow, white on white — the Indian textile tradition without printed pattern |
| **Gathbandhan knot** | a loose reef knot built from two paths (one per "fabric end"), drawn in sequence | tied live in the Wedding scene |
| **Hairline rules** | 1 CSS px `--zari` at 55% opacity; horizontal only; never boxes | captions and info groups |
| **Pearl markers** | 12 px CSS radial gradients (`--mogra` → `--pearl` → `--pearl-shade`) with a 2 px highlight at top left | RSVP choices and the music control; small enough that CSS nacre is convincing |

### 4.2 What is never drawn

Flowers, leaves, people, buildings, lamps, mehendi patterns, mandalas, paisleys, borders, frames, arches,
icons, patterns used as fills.

*Why:* drawn versions of real objects are exactly what made the legacy work look like clip-art. If a flower
is on screen, it is a photograph.

---

## 5. Mobile composition (390 × 844 is the design size)

### 5.1 Grid

| | Value | Why |
|---|---|---|
| Side margins | 20 px (plus safe-area insets) | wide enough for thumbs, narrow enough for masthead names |
| Columns | 6, gutter 10 px, column 50 px | 6 divides into halves and thirds for asymmetric splits |
| Baseline | 4 px | every type line height is a multiple of 4 (`typography-system.md` §2), so text and spacing share one rhythm |
| Spacing scale | 4 · 8 · 12 · 20 · 32 · 52 · 84 · 136 | a ~1.6× progression, like beads on a strand; nothing arbitrary |
| Full-screen units | `svh`, never `vh` | in-app browsers (WhatsApp, Instagram) resize the toolbar |

**What each spacing step is for** (the gutter of 10 px is a grid value, not a spacing step):

| Step | Use |
|---|---|
| 4 | a label to the value directly beneath it; a hairline to the text it underlines |
| 8 | lines inside one grouped fact (time → venue → area) |
| 12 | Devanagari numeral to its chapter label; a name's baseline to its surname; caption to its photo |
| 20 | side margins; between separate fact groups (when → where → wear); between two thread links |
| 32 | chapter mark to the top safe area; heading to the content it introduces |
| 52 | photograph to its text block; between blocks inside one composition |
| 84 | between compositions inside a scene (story spreads, celebrations) |
| 136 | breathing room at the start and end of a scene, around a transition |

Values outside the scale are defects. Touch targets (44 px) and the button height (52 px) are sizes, not
spacing.

Other widths: 393 and 412 keep the 390 composition (margins stay 20; columns widen). 768: 8 columns,
32 px margins. ≥1024: 12 columns, 64 px margins, 1280 px maximum; scenes become two-page spreads, names cap at
240 px.

### 5.2 Hierarchy per viewport

In order, one of each (`creative-concept.md` §4.9):

1. **Moment** — image or names, 45–70% of the viewport
2. **Fact** — event name or date, the only other large type
3. **Action** — one text link or button, in the lower 40% of the screen
4. **Detail** — time, place, dress note, caption

At most **three type sizes** (counted as in `typography-system.md` §3, rule 1) and **three competing
elements** in any viewport.

### 5.3 Placement rules

- **Text aligns left** by default. Right alignment is allowed only for (a) the second name in the signature
  treatment and (b) a single display-size word placed on the side opposite a photograph's bleed, to balance it
  (e.g. "Mehendi" under a photo bleeding left). Centring is reserved for the Wedding. *Why:* left-aligned
  editorial rags read faster on phones and break the centred-template habit; the two exceptions exist only to
  counterweight a diagonal or a bleed.
- **Text never sits on a photograph** except in Reception, where the image is dark and a bottom scrim
  guarantees ≥4.5:1. *Why:* light photographs under text fail contrast and look like stock banners. (The
  closing's names sit on the night ground and cut-outs, not on a photograph.)
- **Actions sit low.** Links and the RSVP button live in the lower 40% of their viewport. *Why:* thumb reach.
- **Chrome is fixed and small.** Only two fixed elements: the Sample mark (top left) and the music pearl
  (bottom right). Nothing else floats. *Why:* fixed UI over art is the template tell.

---

## 6. Interface elements

There are no cards, pills, icons or gradients.

| Element | Design | Why |
|---|---|---|
| **Thread link** (Directions, Add to calendar, Open in Maps, Make this yours) | label type (Archivo, expanded caps, 11–12 px, `--ink`); 44 px tall tap area; underline is a 1 px `--zari` thread that draws in on focus and tightens (scaleX 0.96 → 1) on press | links as words, underlined by the concept's own object |
| **Primary button** (only "Send reply") | full-width rectangle, `--ink` fill, `--pearl` label type, 52 px tall, no radius | one strong action on the page; square corners match paper |
| **Opening button** | the whole cover is a `<button>` labelled "Open the invitation from Rohan and Anaya"; the pearl is its visual affordance | a big target without a visible button |
| **Text inputs** | ruled line: 1 px `--ink-soft` at 40%, label above in label type, input text `type-input` (Archivo 16 px) | a reply card, not a SaaS form; 16 px is the smallest size that stops iOS zooming |
| **Choices** | words with a 12 px pearl marker that fills with nacre when chosen; the whole word row is the target | the pearl says "this one" without a checkbox |
| **Focus** | 2 px `--zari-ink` outline, 3 px offset (on night: `--zari`) | visible and on palette |
| **Music control** | a 28 px pearl in a 44 px target, bottom right; playing: a nacre highlight slowly travels across it; muted: pearl desaturates with a hairline strike; labelled "Music, playing" / "Music, muted" | replaces generic equaliser bars with the design's object |
| **Sample mark** | "Sample invitation" in 10 px label type on a `--paper` chip at 80%, top left; readable by screen readers | honest that it's a demo, without shouting |
| **Studio call to action** | at the closing only: a thread link "Make this invitation yours" to Instagram | selling after the experience, never over it |

No icons anywhere. *Why:* words in label type are more elegant and more accessible than pins, calendars and
hearts.
