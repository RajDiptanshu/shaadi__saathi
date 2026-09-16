# Invite Studio

Sample wedding invitations, all built on one engine. A new order means filling in one file.

## Folders

```
site/                     what gets deployed
  engine/                 shared by every design
    core.js               fills the page from details.js, language switch, opening, reveals
    events.js             countdown, add to calendar, directions
    scratch.js            scratch-to-reveal foil over any [data-scratch] block
    gallery.js            photo strip with dots and a full-size viewer
    rsvp.js               builds the RSVP form and sends replies
    sound.js              looping music and the opening sound
    sales.js              "Sample" tag and the WhatsApp "Get this design" button
    strings.js            interface words in each language
    studio.js             our WhatsApp number and brand name
    engine.css            behaviour styles shared by every design
  demo/<slug>/            one design
    details.js            the couple's details — the only file an order changes
    index.html            the page
    theme.css             the design's colours, type and layout
    theme.js              the design's artwork and motion
    art.js                that design's drawings
  _test/phone.html        local test harness — delete before deploying
apps-script/Code.gs       RSVP collection for one couple's Google Sheet
```

## Making a new invitation from an existing design

1. Copy `site/demo/<design>/` to `site/demo/<new-slug>/`.
2. Edit `details.js`: names, hosts, dates, ceremonies, contacts, closing words. Set `sample: false`.
3. Set up the couple's sheet with `apps-script/Code.gs` (instructions at the top of that file), then put the
   `/exec` URL in `details.js` as `rsvp.endpoint`.
4. Deploy. Nothing else needs touching.

## details.js

- Any text can be a string, or `{ en: '…', hi: '…' }` for a page in two languages. `langs` lists the
  languages the switch offers.
- `events[]`: `id`, `name`, `start` and `end` as ISO times with `+05:30`, `venue.name`, `venue.address`,
  optional `venue.mapQuery`, `dress`, `major: true` for the main ceremonies, `rsvp: true` to let guests
  reply for it.
- `countdownTo` sets what the countdown counts to; without it, the first `major` ceremony is used.
- `music: { src, cue, loopStart, loopLength }`. A loop file with half a second of wraparound at each end
  repeats without a gap (see the family invite's notes).
- `art.cover` points at a painted cover when there is one; until then each design draws its own.
- `sample: true` shows the "Sample" tag and the "Get this design" button.

## Writing a page

Text comes from `details.js` through data attributes, so markup carries no wording:

- `data-t="couple.groom"` — text, in the current language.
- `data-date=".start" data-format="day|month|weekday|time|short|full"` — dates in India time.
- `data-attr="href:.tel"` — attributes.
- `data-if=".dress"` — hide when empty.
- `<template data-each="events">` — one copy per ceremony; inside it, paths start with a dot.
- `data-reveal` — fades in when scrolled to. `data-rsvp` — where the RSVP form is built.
- `data-countdown` around `[data-count="days|hours|minutes|seconds"]`; `[data-map]` and `[data-calendar]`
  inside a ceremony become its links.

## Share and test links

`?open` skips the opening, `?still` shows everything at once for screenshots, `?lang=hi` picks a language,
`?card=1..5` and `?og` are for share images.

## Testing locally

Pages block scripts when opened as files, so serve the folder and open it over http:

```bash
node serve.js "Invite Studio/site" 8123
```

Then `http://127.0.0.1:8123/demo/haveli-jharokha/`, or `/_test/phone.html?src=...&y=...` for a
phone-sized frame at a scroll position.
