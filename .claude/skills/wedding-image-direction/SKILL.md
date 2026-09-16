---
name: wedding-image-direction
description: The image constitution for Shaadi Saathi invitations — what to photograph, image-selection rules per slot, faces and AI rules, allowed sources and licences, download approval, grading, crops and focal points, the asset manifest, alt text, audio and the processing pipeline, with common failure modes and concrete examples of what not to do. Use when choosing, downloading, editing, grading, cropping, naming, describing or recording any photograph, texture, cut-out, font or sound for an invitation.
---

# Wedding image direction

**Canonical sources:** `docs/mogra-moti/asset-plan.md` (inventory, criteria, manifest, pipeline, budgets),
`docs/mogra-moti/visual-dna.md` §2–3 (photography direction, grades, signature image treatment),
`docs/mogra-moti/material-library.md` (textures and cut-outs, per-file ceilings).

---

## 1. What to photograph

**Default: editorial detail.** Hands, mehendi, jewellery, fabric, flowers, stationery, architecture, venues,
silhouettes, people from behind, cropped editorial portraits, atmospheric moments.

**Faces (user decision, 2026-09-16):** don't avoid them artificially. A natural, candid, well-lit, properly
licensed photograph with faces may be used. **Authentic photographic quality beats avoiding faces.**

**Never:** AI-generated people, hands or faces · stock smiles into the lens · text, logos, watermarks, brand marks ·
recognisable real venues or businesses · HDR, oversaturated reds, teal-and-orange grades · drone shots of palaces ·
the generic "bride looking over her shoulder".

## 2. Image-selection rules

Apply in order; the first failing rule rejects the candidate.

1. **Licence** permits commercial use and modification, from an allowed source (§3).
2. **Authentic:** not AI-generated. Inspect at 100%: fingers, knuckles, nails, jewellery clasps, mehendi pattern
   continuity, fabric weave, anything text-like.
3. **Clean frame:** no text, logos, watermarks, real venue signage.
4. **Light from the left or top left.** Flip only if nothing in frame reveals it (no text, no ring or mangalsutra
   side that matters, no asymmetric ritual detail).
5. **Size:** meets the slot's minimum source (photos: 1.25× largest display; venue 3000×2000; cut-outs 2–4×).
6. **Crop survives:** the planned ratio at 390, 393, 412 and 1440 px keeps the subject, with a recordable focal point.
7. **Grade survives:** the scene recipe doesn't band, posterise or turn skin grey or orange.
8. **Culture is right:** the ceremony, garments and gestures actually belong to what the slot shows.
9. **People:** identifiable → flag for replacement unless a model release is on record (§4).

Then score survivors 0–5 on **authenticity · light · gradeability · composition · cultural accuracy** and pick the
highest total. A tie goes to the image with less going on.

**Slot-type rules**

| Slot type | Prefer | Reject |
|---|---|---|
| Hands and mehendi | natural daylight, real skin texture, fresh stain colour, relaxed hands | studio-lit perfection, glossy retouching, AI hands |
| Jewellery and pearls | low-key, one light, texture visible | white-background product shots, sparkle filters |
| Fabric | folds with soft light, translucency | flat product swatches, satin shine |
| Flowers (mogra) | the right species and bloom state for the scene, green-tinged buds | roses or marigolds substituted, wilted edges |
| Venues | gardens, courtyards, water, arches at golden hour, no people | palaces, hotel facades, signage, crowds |
| People | candid, from behind, cropped at the jaw or shoulders, in motion | posed couples looking at the camera |
| Stationery | top-down on real paper with raking light | mock-up templates with fake text |

**Premium stock:** not by default (user decision). A slot becomes a purchase candidate only if its best free
candidate scores <3 on two or more criteria, it is visible in Scenes 01–04, and no re-planned subject can fill it.
The user then sees the free candidate and two paid options with price and licence (including model releases) and
decides.

## 3. Sources and licences

| Allowed | Forbidden |
|---|---|
| Pexels, Unsplash, Pixabay (photos, music, sound effects) | Pinterest, Google Images, Instagram |
| Freesound under CC0 | photographers' portfolios, other invitation studios' sites |
| in-house vectors and pipeline renders | Freesound non-commercial licences |
| edits of licensed files (background removal, exposure, temperature, grain) | AI generation of people, or any AI image with text |

Licence essentials — re-read the live page at download and record its URL and date:
- **Pexels / Unsplash:** free commercial use, no attribution required; no selling unaltered copies; no implied
  endorsement by identifiable people; Unsplash also forbids compiling photos into a competing service.
- **Pixabay Content License:** free commercial use; no standalone redistribution; no misleading use of identifiable
  people or brands; some content is AI-generated — check the label.

## 4. Download and storage rules

1. **Every download needs the user's approval first** — list file, source page, licence and size.
2. **Originals stay out of git** in `assets-src/<slug>/` (gitignored). Only processed web files the page uses are
   committed. *Reason:* the repository is public; untouched stock originals would be redistributed.
3. **Never hotlink** third-party image URLs; every shipped file is processed and self-hosted.
4. **Identifiable people** → `identifiablePeople: true`, `replaceBeforeLaunch: true` unless `modelRelease` is
   recorded. *Reason:* the demo markets a paid service; free licences don't cover implied endorsement.

## 5. Grading rules

- **One key light direction for the whole invitation** (Mogra & Moti: top left).
- **Grade to the scene's recipe** so different photographers read as one shoot. Mogra & Moti recipes: Dawn
  (Welcome) · Midday (Story) · Celebrations graded to each event's hour — Mehendi Afternoon, Sangeet Godhuli,
  Wedding Lamp, Reception Lamp · Godhuli (Venue) · Lamp (Gallery). Numbers: `visual-dna.md` §2.3.
- **Bounds:** highlights never above `#FAF8F2`; blacks never below `#15110E`.
- **No clarity or dehaze boosts** (they create the HDR look).
- **Grain:** fine, about 4%, matched to the paper texture and baked into the export. Never a runtime overlay.

## 6. Crops, sizes and treatment

- Ratios: 4:5 (details), 2:3 (tall editorial), 9:16 (full-screen moments), 3:2 source → 21:9 display (letterbox),
  16:9 (motion, gallery variety).
- **Every image records `focal: { x, y }`** (0–1), used as `object-position`.
- Deliver photos at 1.25× their largest display size; cut-outs at 2–4×.
- **Bleed one edge**; declared full-screen/centred exceptions only (`wedding-art-direction` §6.5). No borders, radii
  or drop shadows on photos.
- Photos enter by **Print settle** (`wedding-motion`).

## 7. The manifest

`site/invitations/<slug>/assets/manifest.json` is the single record of every shipped file. Pages reference **asset
IDs**; only the manifest knows filenames. Required per entry:

`id` · `scene` · `kind` (photo | cutout | texture | vector | font | audio | share) · `description` · `alt` ·
`files` · `width` · `height` · `focal` · `lqip` · `grade` · `source { site, page, creator, downloaded, licence,
licenceUrl, licenceCheckedOn }` · `edits` · `identifiablePeople` · `modelRelease` · `aiGenerated` · `scores` ·
`usage` · `replaceBeforeLaunch` · `replaceReason`.

In-house assets use `"site": "in-house"`; fonts record the OFL and the foundry repository.

## 8. Alt text rules

One plain sentence describing what a guest would notice: *"Two hands with fresh mehendi resting on an ivory
cloth."* No "image of", no keywords, no couple names unless they're genuinely the people shown. Decorative
textures, cut-outs, threads and ornaments are `aria-hidden` with empty alt.

## 9. Pipeline and per-file rules

collect (approved) → cut out → grade → derive with `sharp` → pre-render expensive looks with Playwright →
subset fonts → encode audio → verify.

- Photos: widths 480 / 780 / 1170 / 1600; AVIF q≈50, WebP q≈72, JPEG q≈78; 16 px LQIP.
- Cut-outs: AVIF + WebP with alpha.
- Opening file ceilings (they sum to the 350 KB opening budget): paper 30 KB · deckled edge 12 · marble strip 20 ·
  sheer fabric 40 · hero pearl 8 · strand pearls 4 each · closed buds 8 each · bloom-pass bud 20 · deboss layers 20 ·
  shadow-work sprite 4.
- Verification fails on: unlisted files, missing licence fields, unflagged identifiable people, over-ceiling files.

Commands (built 2026-09-17; reload PATH first): `npm run assets:render` (in-house ornaments) ·
`npm run assets:build` (approved originals via `tools/assets/<slug>.recipes.json`) · `npm run assets:check`
(manifest, files, licences, ceilings, opening budget) · `npm run assets:sheet` (contact sheet in
`tools/capture/out/`). Always run the check and look at the contact sheet before calling assets done.

## 10. Audio rules

- **Music:** licensed loop (Pixabay Music), 60–90 s with a 0.5 s wraparound for gapless looping, MP3 128 kbps,
  ≤1.2 MB. Mogra & Moti: santoor over a tanpura drone, no percussion for the first 60 s; no shehnai, no temple bells.
- **Effects:** ≤1.2 s each, dry, ≤150 KB together; Pixabay or CC0.
- Record audio in the manifest like images.

---

## 11. Common failure modes

| Failure | Symptom | Fix |
|---|---|---|
| One-shoot illusion breaks | adjacent photos differ in warmth and contrast | regrade to the scene recipe; replace if it still clashes |
| Wrong-side light | pearl highlight top left, photo lit from the right | reject or flip only if nothing in frame forbids it |
| AI hands slipped through | six knuckles, melted rings, mehendi that doesn't continue | inspect at 100% before scoring |
| Implied couple | a stranger shown as "Rohan & Anaya" | detail or from-behind shots; flag faces for replacement |
| Species swap | jasmine replaced by any white flower | check the species and bloom state against the scene |
| Centre-crop amputation | hands or knot cut off on 412 px screens | record focal points; check all four viewports |
| Stock originals in the repo | 6 MB JPEGs under `site/` | keep originals in `assets-src/` (gitignored) |
| Orphan files | images on disk no manifest entry mentions | verification step; delete or record |
| Placeholder alt text | `alt="image"`, `alt="photo1"` | one descriptive sentence from the manifest |

## 12. What NOT to do (examples)

```text
✗ Using a Pinterest find "because it's only a demo".
✗ Picking the most beautiful photo, lit from the right, then mirroring it — with a wedding ring now on the wrong hand.
✗ A gallery of eight photos of the same stock couple, implying they are Rohan and Anaya.
✗ Downloading ten Unsplash photos without listing them for the user first.
✗ Committing assets-src/mogra-moti/p06-original.jpg.
✗ <img src="https://images.unsplash.com/photo-…?w=2000">   (hotlinked, unprocessed, no manifest entry)
✗ <img src="img/p06.jpg" alt="image">
✗ A grain PNG fixed over the whole page with mix-blend-mode.
✗ A manifest entry with "licence": "free" and no licenceUrl or date.
✗ Replacing the Wedding photo with a gathbandhan from a different tradition because it "looks close enough".
```

```json
// ✓ A complete manifest entry
{ "id": "P06", "scene": "celebrations.mehendi", "kind": "photo",
  "alt": "Two hands with fresh mehendi resting on an ivory cloth",
  "focal": { "x": 0.46, "y": 0.58 }, "grade": "afternoon",
  "source": { "site": "pexels", "page": "https://www.pexels.com/photo/…", "creator": "…", "downloaded": "2026-09-20",
              "licence": "Pexels License", "licenceUrl": "https://www.pexels.com/license/", "licenceCheckedOn": "2026-09-20" },
  "identifiablePeople": false, "modelRelease": null, "aiGenerated": false,
  "scores": { "authenticity": 4, "light": 5, "gradeability": 4, "composition": 4, "culture": 5 },
  "replaceBeforeLaunch": false }
```
