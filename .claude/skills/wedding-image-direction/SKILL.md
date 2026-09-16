---
name: wedding-image-direction
description: Image, texture, cut-out and audio sourcing standards for Shaadi Saathi invitations — subjects, licensing, the asset manifest, grading recipes, crops and focal points, faces and AI rules, download approval and the processing pipeline. Use when choosing, downloading, editing, grading, cropping, naming or recording any photograph, texture, cut-out, font or sound for an invitation.
---

# Wedding image direction

The flagship plan is `docs/mogra-moti/asset-plan.md`; photography direction is
`docs/mogra-moti/visual-dna.md` §2–3. This skill holds the rules that apply to every asset.

## 1. What to photograph

**Default: editorial.** Hands, mehendi, jewellery, fabric, flowers, stationery, architecture, venues,
silhouettes, people from behind, cropped editorial portraits, atmospheric moments.

**Faces (user decision, 2026-09-16):** don't avoid them artificially. A natural, candid, well-lit, properly
licensed photograph with faces may be used. **Authentic photographic quality beats avoiding faces.** Reject
stock smiles at the camera and anything posed like an advert.

**Never:** AI-generated people, hands or faces; text, logos, watermarks or brand marks in frame; recognisable
real venues or businesses; HDR, oversaturated reds, teal-and-orange grades; drone shots of palaces; generic
"bride looking over her shoulder".

## 2. Allowed and forbidden sources

| Allowed | Forbidden |
|---|---|
| Pexels, Unsplash, Pixabay (photos, music, sound effects) | Pinterest, Google Images, Instagram |
| Freesound under CC0 only | Photographers' portfolios, other invitation studios' sites |
| In-house vectors and pipeline renders | Freesound non-commercial licences |
| Edits of licensed assets (Adobe connector background removal, exposure, temperature, grain) | Any AI generation containing text; AI generation of people |

**Paid stock:** not by default (user decision). A slot becomes a purchase candidate only when its best free
candidate scores <3 on two or more criteria, it is visible in the first four scenes, and no re-planned subject
can fill it. Then show the user the free candidate and two paid options with price and licence terms
(including model releases) and let them decide.

## 3. Download rules

1. **Every download needs the user's approval first.** List file, source page, licence, and size.
2. Re-read the live licence page at download; record its URL and the date.
3. **Originals stay out of git** in `assets-src/<slug>/` (gitignored). Only processed web files the page uses are
   committed. *Reason:* the repository is public; committing untouched stock originals redistributes them.
4. **Identifiable people** → `identifiablePeople: true` and `replaceBeforeLaunch: true` unless a model release is
   on record. *Reason:* the demo markets a paid service; free licences don't cover implied endorsement.

Licence essentials (verify at download): Pexels and Unsplash — free commercial use, no attribution required,
no selling unaltered copies, no implied endorsement by identifiable people (Unsplash: no compiling a competing
service). Pixabay Content License — free commercial use, no standalone redistribution, no misleading use of
identifiable people or brands; some Pixabay content is AI-generated, so check labels.

## 4. Acceptance criteria

**Must (any failure rejects):** licence permits commercial use and modification · not AI-generated (inspect
hands, fingers, jewellery, text-like marks at 100%) · no text/logos/watermarks/real venues · light from the left
or top left (or safely flippable) · minimum source size met · faces rule respected.

**Should (score 0–5 each, recorded in the manifest):** authenticity · light quality · gradeability ·
composition in the planned crop · cultural accuracy.

## 5. Grading

One key light direction for a whole invitation (Mogra & Moti: top left). Grade each photo to its scene's recipe
so different photographers read as one shoot. Mogra & Moti recipes: **Dawn, Midday, Afternoon, Godhuli, Lamp**
(numbers in `visual-dna.md` §2.3). Shared rules: no clarity/dehaze boosts; highlights never above the design's
lightest token; blacks never below its darkest; fine grain matched to the paper texture, baked into the export —
never a full-screen grain overlay at runtime.

## 6. Crops and focal points

- Ratios: 4:5 (default detail), 2:3 (tall editorial), 9:16 (full-bleed moments), 3:2 source → 21:9 display
  (letterbox), 16:9 (motion, variety).
- Every image records `focal: { x, y }` (0–1) used as `object-position`, so crops hold at 390, 393, 412 and
  1440 px.
- Deliver photos at 1.25× their largest display size (camera moves scale them); cut-outs at 2–4×.

## 7. The manifest

`site/invitations/<slug>/assets/manifest.json` is the single record of every shipped file. Pages reference
**asset IDs**; only the manifest knows filenames. Required fields per entry:

`id`, `scene`, `kind` (photo | cutout | texture | vector | font | audio | share), `description`, `alt`,
`files`, `width`, `height`, `focal`, `lqip`, `grade`, `source { site, page, creator, downloaded, licence,
licenceUrl, licenceCheckedOn }`, `edits`, `identifiablePeople`, `modelRelease`, `aiGenerated`, `scores`,
`usage`, `replaceBeforeLaunch`, `replaceReason`.

In-house assets use `"site": "in-house"`; fonts record the OFL and the foundry repository.

## 8. Alt text

Describe what a guest would notice, in one plain sentence, without "image of": *"Two hands with fresh mehendi
resting on an ivory cloth."* Decorative textures, cut-outs and threads are `aria-hidden` with empty alt.

## 9. Pipeline (dev-only; set up in Phase 3)

collect (approved) → cut out → grade → derive with `sharp` (photos: 480/780/1170/1600 wide; AVIF q≈50, WebP
q≈72, JPEG q≈78; cut-outs: AVIF + WebP with alpha; 16 px LQIP) → pre-render expensive looks with Playwright
(deboss layers, blurs, share images) → subset fonts (`subset-font`) → encode audio (ffmpeg is not installed on
this machine; choose a minimal encoder) → verify (fail on unlisted files, missing licence fields, unflagged
identifiable people, or budget overruns).

Tooling status: the pipeline and its commands do not exist yet; update this section when Phase 3 creates them.

## 10. Audio

Music: licensed loop (Pixabay Music), 60–90 s with 0.5 s wraparound for gapless looping, MP3 128 kbps,
≤1.2 MB. Effects: ≤1.2 s each, ≤150 KB total, CC0 or Pixabay. Mogra & Moti brief: santoor over a tanpura drone;
no shehnai, no temple bells.
