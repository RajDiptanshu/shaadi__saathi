# Mogra & Moti — opening asset candidates

Phase 3, 2026-09-17. The shortlist for the cinematic opening and the entry into Welcome, how it was chosen, what
was rejected and why. **Nothing external has been downloaded yet**: every file below needs the user's approval
first (`wedding-image-direction` §4).

Full records (sources, creators, licences, scores, rejections, intended use, replacement flags) are in
[`site/invitations/mogra-moti/assets/manifest.json`](../../site/invitations/mogra-moti/assets/manifest.json).

## Where assets live

The Phase 3 brief suggested `site/assets/mogra-moti/`. The approved architecture (`scene-architecture.md` §2) keeps
each invitation self-contained, so assets are at **`site/invitations/mogra-moti/assets/`**, in the categories the
brief asked for:

```
site/invitations/mogra-moti/assets/
  manifest.json
  photography/  flowers/  pearls/  silk/  textures/  ornaments/  video/  audio/  fonts/
assets-src/mogra-moti/originals/        downloaded originals (gitignored, never committed)
tools/assets/sources/mogra-moti/        in-house masters (thread, monogram, chikankari motifs)
tools/assets/mogra-moti.recipes.json    how each original becomes web files (written after download)
```

No video is planned for the opening: the 350 KB first-frame budget can't carry it, and the brief's cinematic
motion is achieved with layered stills. The folder exists for later scenes if a clip earns its weight.

## How candidates were chosen

1. Searched Unsplash (about 270 results, Unsplash+ excluded) and Pexels for each opening slot.
2. Filtered to originals ≥2400 px on the long side and relevant subjects.
3. Rendered contact sheets per slot and **looked at every image**; then 100% crops of the shortlist to check
   realism (hands, skin, pearl surfaces, fibres), light direction and colour casts.
4. Scored survivors on authenticity, light, gradeability, composition and cultural accuracy; kept the best per slot.
5. Checked the live licence pages (Pexels, Unsplash, Pixabay) on 2026-09-17.

No image-generation tool is available in this environment, so no environmental artwork was generated.

## Approval list

| # | Slot | Candidate | Creator | Source | Licence | Original | Use |
|---|---|---|---|---|---|---|---|
| 1 | T01 paper | cold-press white paper texture | Artem Dvoretsky | [Pexels 20899958](https://www.pexels.com/photo/20899958/) | Pexels | 4000×3000, ~2.0 MB | card surface (tile, desaturated, warmed) |
| 2 | T02 deckled edge | deckle-edge card on white | Elisabeth Ende | [Pexels 7371983](https://www.pexels.com/photo/7371983/) | Pexels | 2592×3577, ~0.6 MB | card edge (extracted, mirrored) |
| 3 | T03 marble | honed white marble, fine veins | Augustine Wong | [Unsplash li0iC0rjvvg](https://unsplash.com/photos/li0iC0rjvvg) | Unsplash | 3456×5184, ~0.7 MB | surface beyond the card |
| 4 | T04 sheer fabric | white curtain lifting in window light | Olivia Harper | [Unsplash xnppIJt_3-I](https://unsplash.com/photos/xnppIJt_3-I) | Unsplash | 2232×2689, ~0.3 MB | the breeze and the tap's sweep |
| 5 | O01–O02 pearls | double strand of freshwater pearls on a pale surface | Paige Johnson | [Unsplash QMBar9xvhMU](https://unsplash.com/photos/QMBar9xvhMU) | Unsplash | 4752×3168, ~1.2 MB | hero pearl + three strand pearls |
| 6 | O03 buds | closed jasmine buds on black | Saravanan Narayanan | [Pexels 36666888](https://www.pexels.com/photo/36666888/) | Pexels | 5184×3456, ~0.4 MB | strand and loose buds; the bloom-pass bud |
| 7 | O03 buds (companion) | two jasmine buds on black, same series | Saravanan Narayanan | [Unsplash 1b85pJ8sETI](https://unsplash.com/photos/1b85pJ8sETI) | Unsplash | 5184×3456, ~1.2 MB | more bud variants |
| 8 | P01 hands | hands stringing jasmine buds onto thread | Tahamie Farooqui | [Unsplash N92ZPJUDiQ8](https://unsplash.com/photos/N92ZPJUDiQ8) | Unsplash | 9504×6336, ~8.8 MB | Welcome photograph revealed by the entry |
| 9 | F01 font | Imbue variable | Tyler Finck | [google/fonts ofl/imbue](https://github.com/google/fonts/tree/main/ofl/imbue) | OFL | ~0.2 MB + OFL.txt | display type |
| 10 | F02 font | Archivo variable | Omnibus-Type | [google/fonts ofl/archivo](https://github.com/google/fonts/tree/main/ofl/archivo) | OFL | ~0.6 MB + OFL.txt | labels and reading type |
| 11 | F03 font | Noto Serif Devanagari variable | Google | [google/fonts ofl/notoserifdevanagari](https://github.com/google/fonts/tree/main/ofl/notoserifdevanagari) | OFL | ~0.7 MB + OFL.txt | chapter numerals |

Total ≈ 16 MB of originals, kept out of git; the processed opening set is budgeted at ≤260 KB.

No identifiable people appear in any of these, so none needs a replacement flag.

### Sound — needs your ear

The pearl click (A02) can't be judged without listening. Preview and pick one (or none):

- [pearls rubbing together](https://pixabay.com/sound-effects/film-special-effects-pearls-rubbing-together-26928/) — freesound_community, 0:26 (a single contact would be trimmed out)
- [collar de bolas_01](https://pixabay.com/sound-effects/film-special-effects-collar-de-bolas-01-238240/) — freesound_community
- [Rosary](https://pixabay.com/sound-effects/household-rosary-25489/) — freesound_community

## Notable rejections

| Rejected | Why |
|---|---|
| Unsplash "many small white pearls" | plastic craft beads — identical, glossy, no orient |
| Unsplash pearl necklace on teal textile | teal bokeh contaminates the pearl colour |
| Unsplash sheer fabric series with a lily | a flower trapped under the fabric and a green cast |
| Unsplash organza on white | crinkled with dark outline edges |
| Unsplash jasmine bud pile on dark wood | beautiful, but overlapping buds give no clean silhouettes — kept as a gallery candidate |
| Pexels handmade/recycled papers (kaboompics) | coloured inclusions; too rustic for ivory stationery |
| Crumpled and parchment papers | banned by the material library |
| Marble with green or dramatic veins, countertop edges | competes with the card; not Makrana-like |
| Market garland-makers with faces, marigolds | wrong palette; documentary rather than editorial |

## Known processing risks

| Asset | Risk | Plan |
|---|---|---|
| P01 | warm market light fights the Dawn grade | grade by hand if the scripted grade greys the skin; if it still fights, look for a second candidate before Phase 4 |
| T02 | deckle extraction may not key cleanly on a white background | fall back to a deckle mask derived from T01's own fibres |
| O03 | bright green sepals may read as spikes at 20 px | trim sepals in the cut-out; keep the calyx |
| T04 | light comes from the right | mirrored in the pipeline |
| T01 | tiny coloured specks | desaturation and tint remove them |

## Gallery and story candidates found along the way (not requested yet)

- [Jasmine garland with pearls on a marble table](https://unsplash.com/photos/3lUv0ZynLLE) — Vidit Goswami (on-concept: mogra + moti)
- [Hand holding a jasmine garland](https://unsplash.com/photos/G0U6ZEEwrDY) — Vidit Goswami
- [Pile of closed jasmine buds on dark wood](https://unsplash.com/photos/TGzVxmmpyts) — Tahamie Farooqui (same photographer as P01)
