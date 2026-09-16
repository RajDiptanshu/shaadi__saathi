# Mogra & Moti — asset plan

Exactly what imagery, texture, vector, type and sound the experience needs, where it can come from, how it is
licensed and recorded, how it is processed, and what it may weigh. Nothing here has been downloaded yet. Phase 3
produces the assets; every download is listed to the user for approval first.

Priorities: **P0** is needed for the hero gate (Scene 01 and the entry into Scene 02). **P1** for the full
experience. **P2** is polish.

---

## 1. Inventory

### 1.1 Textures (T)

| ID | Asset | Spec | Source strategy | Priority |
|---|---|---|---|---|
| T01 | Cotton-rag paper texture | seamless tile 1024 × 1024, warm white, visible fibres, even lighting (light is added in CSS); grain matching photographs | free stock ("handmade cotton paper texture", "watercolor paper texture white"), tiled in the pipeline | P0 |
| T02 | Deckled paper edge | edge strip with alpha, 400 × 2400, top and left orientations derived from one | free stock ("deckle edge paper"), background removed | P0 |
| T03 | White marble | 1200 × 1800, honed, faint warm-grey veins, low contrast | free stock ("white marble texture honed") | P0 |
| T04 | Sheer ivory fabric with folds | 1600 × 1200, translucent, soft folds, light from the left; transparency derived from luminance | free stock ("sheer white fabric", "chiffon curtain white light") | P0 |

### 1.2 Objects and cut-outs (O)

All cut-outs: light from the left, soft focus falloff allowed, no hard studio shadows (shadows are separate
sprites), delivered at 2–4× display size, AVIF + WebP with alpha.

| ID | Asset | Variants | Display size | Source strategy | Priority |
|---|---|---|---|---|---|
| O01 | Hero pearl, near-round, macro | 1 (+ a surface-blemish layer) | 20–24 px | free stock ("single white pearl macro"); background removed | P0 |
| O02 | Strand pearls | 3 | 16 px | free stock ("loose white pearls"); cut out individually | P0 |
| O03 | Mogra closed buds | 4 | 20 px on the strand; 36–60 px loose | free stock ("jasmine buds", "Jasminum sambac buds", "mogra flowers") | P0 |
| O04 | Mogra loosening / half open | 2 + 2 | 20 px | same searches | P1 |
| O05 | Mogra full bloom | 3 | 24 px on the strand | same searches ("jasmine sambac flower") | P1 |
| O06 | Defocused bud for passes | 1 (the bloom pass; reused, scaled, for the two small passes) | 180–600 px | derived from O03 in the pipeline (pre-blurred) | P0 |

### 1.3 Vectors and pre-rendered layers (V) — made in-house

| ID | Asset | Deliverable | Priority |
|---|---|---|---|
| V01 | The thread | SVG path set: slack and taut states for Scene 01, welcome line, three Draw edges, closing loop; highlight and shadow strokes | P0 |
| V02 | Monogram R·A with thread loop | master SVG; pre-rendered deboss layers `highlight`, `shadow`, `occlusion` (rendered once in Chromium with SVG lighting, exported with transparency); foil loop path | P0 |
| V03 | Chikankari shadow motifs | 3 original outline motifs (phool, murri vine, jaali); pre-blurred shadow sprites | P1 |
| V04 | Gathbandhan knot | two-path SVG for the Wedding and closing knots | P1 |
| V05 | Favicon and app icon | a single pearl on a thread, SVG + 180 px PNG | P2 |

### 1.4 Photography (P, G)

Acceptance criteria for every photograph are in §2.

| ID | Scene | Subject | Ratio / min source | Faces | Search terms | Priority |
|---|---|---|---|---|---|---|
| P01 | 02 Welcome | hands stringing mogra onto a thread, morning window light, close | 2:3 / 1400 × 2100 | no | "stringing jasmine flowers hands", "making jasmine garland", "gajra making" | P0 |
| P02 | 03 Story A | two cups of chai on a table by a window, morning, one chair edge | 2:3 / 1400 × 2100 | no | "two cups chai table window", "masala chai cups morning light" | P1 |
| P03 | 03 Story B | a detail of distance and return: a hand at a train window, or two tickets, or a handwritten note beside mogra | 4:5 / 1200 × 1500 | no | "train window hand india", "handwritten letter flowers" | P1 |
| P04 | 03 Story C | a hand holding a strand of mogra on a terrace at dusk | 9:16 / 1440 × 2560 | no, or cropped | "hand holding jasmine garland", "terrace dusk india flowers" | P1 |
| P05 | 03 Story B | two people from behind at a window, balcony or shoreline | 9:16 / 1440 × 2560 | from behind | "couple from behind window", "indian couple back view sea" | P1 |
| P06 | 04 Mehendi | hennaed hands, macro, natural daylight | 4:5 / 1600 × 2000 | no | "mehndi hands close up natural light", "henna bride hands" | P1 (P0 for the celebrations gate) |
| P07 | 04 Sangeet | dancing feet with anklets or swirling lehenga hem, motion blur, warm evening light | 3:2 / 2100 × 1400 | no | "indian dance feet anklets motion blur", "lehenga twirl blur" | P1 |
| P08 | 04 Wedding | the gathbandhan (two garments knotted) or joined hands with sacred thread; warm night | 4:5 / 1600 × 2000 | no | "gathbandhan knot wedding", "hindu wedding hands thread" | P1 |
| P09 | 04 Reception | pearl earring or necklace against dark fabric or skin, low key | 9:16 / 1440 × 2560 | cropped, no eyes | "pearl earring dark background", "pearl necklace low key" | P1 |
| P10 | 05 Venue | a garden or courtyard by water at golden hour; arches acceptable, palaces not | 3:2 / **3000 × 2000** (letterbox and 9:16 crops from one image) | no | "garden lake sunset india", "courtyard arches golden hour", "lakeside lawn evening" | P1 |
| G01–G08 | 06 Gallery | a mix: 2 couple moments (candid, from behind, or cropped), 2 jewellery/fabric details, 1 flowers, 1 stationery, 1 venue atmosphere at night, 1 celebration moment | mixed 4:5 ×4, 2:3 ×2, 16:9 ×2 / ≥1600 on the long side | at most 2 with visible faces, only if exceptional and licensed | per subject | P1 |

**Count:** 18 photographs, 4 textures, ~20 cut-out variants, 5 vector sets.

### 1.5 Type (F)

| ID | Family | Licence | Files | Priority |
|---|---|---|---|---|
| F01 | Imbue (variable: opsz, wght) | SIL OFL 1.1 | WOFF2, Latin subset | P0 |
| F02 | Archivo (variable: wdth, wght) | SIL OFL 1.1 | WOFF2, Latin subset | P0 |
| F03 | Noto Serif Devanagari (variable: wdth, wght) | SIL OFL 1.1 | WOFF2, subset to ०–९, danda, and invocation glyphs in the data | P1 |

### 1.6 Sound (A)

| ID | Asset | Spec | Source strategy | Priority |
|---|---|---|---|---|
| A01 | Music loop | santoor over tanpura drone, slow, no early percussion; 60–90 s seamless loop with 0.5 s wraparound; MP3 128 kbps, ≤1.2 MB | Pixabay Music (search "santoor", "santoor ambient", "indian classical calm"); fallback piano + tanpura | P1 |
| A02 | Pearl click | ≤0.4 s | Pixabay Sound Effects / Freesound CC0 ("bead click", "pearl drop") | P0 |
| A03 | Pearl roll | ≤1.2 s | as above ("bead roll wood", "marble roll soft") | P1 |
| A04 | Thread pull | ≤0.6 s | as above ("thread pull", "string tension"), or recorded | P1 |
| A05 | Silk swish | ≤0.8 s | as above ("silk fabric swish") | P1 |
| A06 | Bead drop | ≤0.5 s | as above | P1 |
| A07 | Knot | ≤0.8 s | as above ("cloth tie", "rope tighten soft") | P2 |

### 1.7 Share images (S)

| ID | Asset | Made from | Priority |
|---|---|---|---|
| S01 | Open Graph image 1200 × 630, absolute URL | a Playwright render of the settled opening frame (names, thread, pearl, date) | P1 |
| S02 | Square 1080 × 1080 for Instagram posts | a render of the closing frame | P2 (Phase 9) |

---

## 2. Acceptance criteria

A candidate is rejected if it fails any **must**. The best candidate per slot is scored on the **should** list
(0–5 each) and recorded in the manifest.

**Must**
- Licence permits commercial use and modification; licence URL and date recorded.
- Not AI-generated. (Some free libraries host AI images; check labels and inspect hands, fingers, jewellery
  and text-like marks.)
- No visible text, logos, watermarks, brand marks or recognisable real venues.
- Light from the left or top left (or flippable without breaking the subject, e.g. no text, no asymmetric
  jewellery on the wrong hand in a ritual).
- Minimum source size met.
- People: no stock-smile-at-camera portraits. Any identifiable face → `replaceBeforeLaunch: true` unless a
  model release is on record.

**Should** (scored)
1. Authenticity — it looks lived, not staged.
2. Light quality — soft, directional, highlights keep detail.
3. Gradeability — survives the chapter's recipe without banding or colour breaks.
4. Composition — works in the planned crop with the focal point recorded.
5. Cultural accuracy — correct ritual detail, no costume-party styling.

*Why the criteria:* free stock is uneven; explicit rules stop the invitation drifting back to generic wedding
imagery, and scores make a later purchase decision (§7) evidence-based.

---

## 3. Sourcing rules

| Allowed | Not allowed |
|---|---|
| Pexels, Unsplash, Pixabay (images, music, sound effects) | Pinterest, Google Images, Instagram, photographers' portfolios, other invitation studios' sites |
| Freesound items under CC0 | Freesound items with non-commercial licences |
| In-house vector and pipeline renders | AI-generated people, hands or faces |
| Images edited in the pipeline or with the Adobe connector (background removal, exposure, temperature, grain) | Any AI generation containing text |

**Licences in brief** (re-read the live licence page at each download; record its URL and the date):
- *Pexels:* free commercial use, no attribution required; not allowed to sell unaltered copies, redistribute on
  other stock sites, or imply endorsement by identifiable people or brands.
- *Unsplash:* free commercial use, no attribution required; not allowed to sell unaltered copies or compile
  photos into a competing service. No model releases.
- *Pixabay Content License:* free commercial use; not allowed to sell or distribute content standalone, or to use
  identifiable people, brands or trademarks in misleading or endorsing ways.

**Why "replace before commercial launch" exists:** the demo is marketing for a paid service. Showing an
identifiable stranger as the couple implies their endorsement, which these licences don't cover. Detail
photography has no such issue.

**Downloads need approval.** Before any download, the user gets a list: file, source page, licence, size.

**Originals stay out of git.** Downloaded originals live in `assets-src/mogra-moti/` (gitignored). Only the
processed web files the page uses are committed. *Why:* the repository is public, and committing untouched
stock originals would amount to redistributing them.

---

## 4. Manifest

`site/invitations/mogra-moti/assets/manifest.json` — the single record of every shipped file. The page refers
to assets by ID; only the manifest knows file names. Swapping a photograph means editing the manifest, not the
scenes.

```json
{
  "design": "mogra-moti",
  "updated": "2026-09-16",
  "assets": [
    {
      "id": "P06",
      "scene": "celebrations.mehendi",
      "kind": "photo",
      "description": "Hennaed hands, macro, natural daylight",
      "alt": "Two hands with fresh mehendi resting on an ivory cloth",
      "files": {
        "avif": ["img/p06-480.avif", "img/p06-780.avif", "img/p06-1170.avif", "img/p06-1600.avif"],
        "webp": ["img/p06-480.webp", "img/p06-780.webp", "img/p06-1170.webp", "img/p06-1600.webp"],
        "jpg": "img/p06-1170.jpg"
      },
      "width": 1600,
      "height": 2000,
      "focal": { "x": 0.46, "y": 0.58 },
      "lqip": "data:image/webp;base64,…",
      "grade": "afternoon",
      "source": {
        "site": "pexels",
        "page": "https://www.pexels.com/photo/…",
        "creator": "Name of photographer",
        "downloaded": "2026-09-20",
        "licence": "Pexels License",
        "licenceUrl": "https://www.pexels.com/license/",
        "licenceCheckedOn": "2026-09-20"
      },
      "edits": ["crop 4:5", "grade afternoon", "grain 4%"],
      "identifiablePeople": false,
      "modelRelease": null,
      "aiGenerated": false,
      "scores": { "authenticity": 4, "light": 5, "gradeability": 4, "composition": 4, "culture": 5 },
      "usage": "Scene 04, Mehendi composition, bleeds left",
      "replaceBeforeLaunch": false,
      "replaceReason": null
    }
  ]
}
```

Every entry type (photo, cutout, texture, vector, font, audio, share) uses the same fields; vectors and renders
record `"site": "in-house"`; fonts record the OFL and the foundry repository.

---

## 5. Pipeline

Dev-only tools; nothing here ships to guests.

| Step | Tool | Output |
|---|---|---|
| 1. Collect | manual download after approval | `assets-src/mogra-moti/<id>-original.*` (gitignored) |
| 2. Cut out | Adobe connector background removal, or manual masks | `<id>-cutout.png` |
| 3. Grade | recipe applied in an editor or scripted (decided in Phase 3 after testing both on 3 photos) | `<id>-graded.tif/png` |
| 4. Derive | `sharp` in `tools/images/` | widths 480 / 780 / 1170 / 1600 (photos); 2× and 4× display (cut-outs); AVIF (q≈50), WebP (q≈72), JPEG (q≈78) for opaque images; AVIF + WebP with alpha for cut-outs; 16 px LQIP |
| 5. Pre-render | Playwright + Chromium for V02 deboss layers and O06 blurs; S01/S02 share images | transparent PNG → AVIF/WebP |
| 6. Fonts | `subset-font` (npm) | subsetted variable WOFF2 |
| 7. Audio | trim, loop wraparound, encode (tool chosen in Phase 3; ffmpeg is not installed, so either a small npm-packaged encoder or the Windows transcoder used for the family invite) | MP3 |
| 8. Verify | `tools/images/check` | fails if a file is missing from the manifest, a manifest entry lacks licence fields, an identifiable person lacks a replace flag, or a budget (§6) is exceeded |

---

## 6. Budgets

| Budget | Limit | Why |
|---|---|---|
| Opening, transferred before the first frame animates | ≤350 KB including HTML, CSS, engine and scene JS, GSAP, fonts, T01–T04, O01–O03, O06, V01–V03 (breakdown below) | guests open links on mobile data inside WhatsApp |
| GSAP (core + ScrollTrigger + MotionPath), gzipped | ≈50 KB | the only third-party code |
| Each later scene's images | ≤400 KB, lazy-loaded one scene ahead | smooth scrolling without a huge initial load |
| Whole page without music | ≤2.8 MB | |
| Music | ≤1.2 MB, fetched after the opening's assets have decoded | music must not compete with the first frame |
| All sound effects | ≤150 KB | |
| Largest Contentful Paint (mid-range phone, 4G) | ≤2.5 s | |
| Cumulative Layout Shift | ≤0.05 | fonts and images are sized in advance |
| Interaction to Next Paint | ≤200 ms | the pearl tap and RSVP choices must answer instantly |
| Frame rate during the opening | 60 fps on a recent iPhone and Pixel 6a-class Android; ≥45 fps on a budget Android | |

**Opening budget breakdown** (ceilings from `material-library.md`; they must sum to ≤350 KB):

| Item | Ceiling |
|---|---|
| T01 paper texture | 30 KB |
| T02 deckled edge | 12 KB |
| T03 marble strip | 20 KB |
| T04 sheer fabric | 40 KB |
| O01 hero pearl | 8 KB |
| O02 strand pearls (3 × 4) | 12 KB |
| O03 closed buds (4 × 8) | 32 KB |
| O06 passing buds (the bloom-pass bud; the two small ones reuse it scaled) | 20 KB |
| V02 deboss layers + V03 shadow-work sprite | 24 KB |
| Imbue + Archivo subsets | 60 KB |
| GSAP core + ScrollTrigger + MotionPath (gzipped) | 50 KB |
| HTML, CSS, engine and scene JS (gzipped) | 40 KB |
| **Total** | **348 KB** |

---

## 7. Deciding on premium stock

Not now. After Phase 3 sourcing, each P0/P1 photo slot has a best free candidate with scores. A slot becomes a
purchase candidate only if **all** of these are true:

1. Its best free candidate scores below 3 on two or more criteria.
2. It is visible in Scenes 01–04 (where first impressions form).
3. No re-planned subject (e.g. a detail instead of people) can fill the composition.

The user then sees the slot, the free candidate, two paid candidates with prices and licence terms (including
model releases), and decides.

---

## 8. Gaps and risks

| Gap | Impact | Plan |
|---|---|---|
| No text-to-image generation reachable | no generated environments (silk scenes, florals) | the direction is photograph- and texture-led by design; revisit only if a tool appears |
| Mogra in four bloom states with consistent light | the bud-to-bloom arc needs matched cut-outs | source several photos per state; match with grading; the arc tolerates variation because cut-outs are small |
| One consistent couple across the gallery | rarely available free | the gallery is mostly details; at most two people photographs, not presented as the same couple |
| Correct ritual detail (gathbandhan, sacred thread) | stock may be mislabelled or from other traditions | culture score; if no accurate photo exists, P08 becomes a macro of knotted silk and chunri fabric |
| Hands in free stock may be AI-generated | uncanny fingers | inspect at 100%; reject anything uncertain |
| No ffmpeg | audio looping and encoding | choose a minimal encoder in Phase 3; no video encoding is needed (evaluation uses frame captures and Playwright's own recording) |
