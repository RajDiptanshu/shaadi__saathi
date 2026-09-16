# Reference teardown — mallikainvitestudio

From 55 screenshots in `e invite reference/`, covering two of their invitations end to end.

| | Anushka & Nakul | Garima & Shivam |
|---|---|---|
| Link | `anushka-nakul-wedding.mallikainvitestudio.com` | `garima-shivam-wedding.mallikainvitestudio.com` |
| Mood | Pink palace watercolour | "A Divine Wedding", Krishna devotee |
| Opening | Pink velvet curtains with gold tassels part on a painted scene; gold wax seal "AN"; *Open the invitation* | Sage-green embossed envelope, pink wax seal "GS", flap opens |
| Palette | Blush, dusty rose, maroon ink, gold | Pale sky blue, ivory, peacock blue ink, coral |

Each couple gets their own subdomain. Both reels are shot on an iPad in candlelight — the product is
sold through the *feeling* of opening it, not a feature list.

## The running order

1. **Cover.** Painted couple seen from behind in a landscape (palace and lake; Radha–Krishna by a lotus
   pond). A framed cartouche reads YOU ARE INVITED. Wax seal with the couple's initials. Curtains or an
   envelope open on tap.
2. **The wedding of.** Near-white paper, spaced small caps "THE WEDDING OF", names in large script, each
   followed by parents in parentheses — `( D/o Mrs … & Mr … )`, `( S/o Mrs … & Mr … )`. A short poem
   ("With blessings as our crown, joy as our music, and petals beneath our feet…"). Watercolour lotuses
   and petals drift down the page. A SCROLL cue.
3. **Save the date — scratch.** Anushka: a noughts-and-crosses grid, *Scratch to make a match*. Garima:
   a gold bar, *Scratch to Reveal*, uncovering "22 – 24 August 2026".
4. **Invitation / blessings.** "AN INVITATION — With the blessings of our families", then a paragraph in
   the couple's voice.
5. **Countdown.** "COUNTING EVERY MOMENT / Until forever begins" — the four numbers hide under **gold
   scratch panels** (hearts in Anushka's, plain bars in Garima's). Hearts shower from the finger while
   scratching.
6. **Ceremonies.** "Our four days of joy" / "Three days of divine celebration". Either a painted
   illustration per ceremony (Haldi poolside, Mehendi's green door, a blue Sangeet, a rose mandap) or a
   two-column grid of pale cards with a small icon, DAY 1/2 label, script name, one-line description,
   then date • time • venue.
7. **Wardrobe planner.** "DRESS CODE — Wardrobe Planner". Outfits painted on gold clothes rails or
   couples under gold cloches, per ceremony: colour name + a line of guidance
   ("Haldi — SUNSHINE YELLOW — florals & soft pastels"; "His: Kurta Set with Bundi / Her: Saree /
   Lehenga / Sharara").
8. **Venue.** A painted or photographed hero ("A Palace of Pastel Dreams"), the venue in script, the
   address, an embedded Google map and an **Open live location** button.
9. **Gallery.** "CAPTURED MOMENTS — Our Gallery — Tap a photo to see it bigger": a swipeable carousel of
   real photographs with dot indicators and a lightbox.
10. **Closing.** "Thank You" / "Come, be a part of our forever", a short thank-you, an amber
    **RSVP — Confirm your presence** button, Back to Top, the couple's names and dates, and a
    "Made by @mallikainvitestudio" credit.

## What makes it work

- **Painted art, not vector.** Every scene is illustration: couples from behind, venues, outfits, gods.
  This is the single biggest gap between their product and ours.
- **Two moments of play.** Scratching is the only interaction besides scrolling, and it appears twice.
  It converts a date and a countdown — facts a guest would skim — into something they do with a finger.
- **Script does the talking.** Big flowing script for names and section titles, spaced small caps for
  labels, a quiet serif for details. Never more than three sizes on a screen.
- **Copy is written, not filled in.** Every ceremony has a line of its own ("A morning bathed in
  turmeric, laughter & sunlight", "An evening of dance, dholki and dazzle", "The vow that begins our
  forever"). No section is left as a bare heading.
- **Everything is pale.** Ink sits on near-white or pale sky; colour arrives through the paintings.

## What we need to add to our engine

| Piece | Status |
|---|---|
| Scratch-to-reveal (save the date + countdown) | `engine/scratch.js`, built |
| Wardrobe planner section | to build — reads `events[].dress` plus a colour name and an illustration |
| Gallery carousel with lightbox | to build — `art.gallery` exists, no viewer yet |
| Venue feature with map embed and live-location button | to build — we link to Maps but never show it |
| Thank-you closing with an RSVP button and Back to Top | partly there; needs the button and the credit line |
| Parents in parentheses under each name | our details.js carries both; markup needs the pattern |
| A written line per ceremony | add `note` to each event in details.js |
| Painted covers and venue art | blocked on image generation |

## Where we should differ

Their weaknesses are worth keeping in mind: the pages are long and almost entirely pale, so nothing
builds; both invitations use the same running order, so a buyer sees the template; and the paintings,
while lovely, are generic stock-feeling scenes. Our three demos already beat them on opening variety
(shutters, pearls, marquee) and on ceremony hierarchy. The gap to close is painted art, the scratch
moment, and the written line per ceremony.
