# Shaadi Saathi — project documents

Everything written for the flagship programme, in the order it was produced. Work happens on the
`feature/mogra-moti` branch.

## Phase 0 — Repository and legacy audit

| Document | What it covers |
|---|---|
| [repository-audit.md](repository-audit.md) | the engine, data and RSVP contracts, tooling constraints, what to reuse, isolate or replace, recommended architecture, risks |
| [legacy-audit.md](legacy-audit.md) | each legacy invitation assessed, what must never be copied, the freeze policy, the 38/100 calibration score |

## Phase 1 — Mogra & Moti creative direction

| Document | What it covers |
|---|---|
| [mogra-moti/creative-concept.md](mogra-moti/creative-concept.md) | the idea (*moti pirona*), emotional concept, visual narrative, the ten answers, principles, anti-patterns |
| [mogra-moti/visual-dna.md](mogra-moti/visual-dna.md) | colour tokens and contrast, photography and grading, signature image treatment, illustration, grid and spacing, interface elements |
| [mogra-moti/typography-system.md](mogra-moti/typography-system.md) | Imbue, Archivo and Noto Serif Devanagari; type tokens; rules; the names-held-by-the-thread treatment; loading |
| [mogra-moti/material-library.md](mogra-moti/material-library.md) | light model; nacre, paper, chanderi, thread, mogra, marble, lamp light, grain; per-file size ceilings |
| [mogra-moti/animation-storyboard.md](mogra-moti/animation-storyboard.md) | motion, camera, transitions, interaction, sound, the reduced-motion cut, and every scene beat by beat |
| [mogra-moti/asset-plan.md](mogra-moti/asset-plan.md) | every asset needed, acceptance criteria, sourcing and licences, the manifest, pipeline, budgets |
| [mogra-moti/scene-architecture.md](mogra-moti/scene-architecture.md) | scene map, files, layers, engine integration, motion primitives, test hooks, the placeholder data model |
| [mogra-moti/mogra-moti-creative-direction.pdf](mogra-moti/mogra-moti-creative-direction.pdf) | the direction board as a 10-page A4 PDF |
| [mogra-moti/asset-candidates.md](mogra-moti/asset-candidates.md) | Phase 3: opening asset shortlist, rejections, approval list, processing risks |
| [mogra-moti/mogra-moti-creative-direction.html](mogra-moti/mogra-moti-creative-direction.html) | the direction board's source page (download and open in a browser to view it rendered) |

## Phase 2 — Project skills (the design and engineering constitution)

Claude Code loads these automatically in sessions opened in this repository.

| Skill | What it governs |
|---|---|
| [wedding-art-direction](../.claude/skills/wedding-art-direction/SKILL.md) | concept gate, visual decision rules, colour, typography, spacing, composition, culture, copy |
| [wedding-motion](../.claude/skills/wedding-motion/SKILL.md) | animation rules, tokens, camera, transitions, reduced motion, sound timing, GSAP rules |
| [wedding-image-direction](../.claude/skills/wedding-image-direction/SKILL.md) | image selection, sources and licences, grading, crops, manifest, alt text, audio |
| [wedding-performance](../.claude/skills/wedding-performance/SKILL.md) | budgets, loading, images, fonts, animation cost, in-app browsers, measurement |
| [wedding-qa](../.claude/skills/wedding-qa/SKILL.md) | test matrix and checklists for every feature, reporting, commonly missed failures |
| [wedding-design-evaluation](../.claude/skills/wedding-design-evaluation/SKILL.md) | the evaluation loop, capture protocol, 100-point rubric, gates, severity, write-ups |

## Earlier material

| Document | What it covers |
|---|---|
| [../README.md](../README.md) | the original engine contract and how a new order is made |
| [../research/reference-teardown.md](../research/reference-teardown.md) | teardown of two mallikainvitestudio invitations |
| [../research/launch-brief.html](../research/launch-brief.html) | the original competitor study and launch brief |
