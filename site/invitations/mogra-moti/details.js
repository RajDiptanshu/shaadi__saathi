/* Mogra & Moti · demo invitation. Every wedding detail the page shows comes from this file.
   Rohan Malhotra, Anaya Kapoor and 15 February 2027 are the brief's fictional demo couple.
   Everything listed in `placeholders` was invented for the demo and must be replaced for a real order.
   Shape: docs/mogra-moti/scene-architecture.md §7. */
window.INVITE = {
  slug: 'mogra-moti',
  design: 'Mogra & Moti',
  sample: true,
  langs: ['en'],

  placeholders: [
    { path: 'wedding.city', note: 'demo city (chosen for the pearl association)' },
    { path: 'wedding.datesLabel', note: 'follows the invented event dates' },
    { path: 'countdownTo', note: 'invented wedding time' },
    { path: 'families', note: 'all family names, home cities and the sign-off' },
    { path: 'story', note: 'all chapters, labels and text' },
    { path: 'copy', note: 'all scene lines except interface words' },
    { path: 'events[*].start', note: 'all times; Mehendi, Sangeet and Reception dates' },
    { path: 'events[*].end', note: 'all end times' },
    { path: 'events[*].venue', note: 'all venues and areas' },
    { path: 'events[*].dress', note: 'all dress notes' },
    { path: 'venue.description', note: 'venue line' },
    { path: 'gallery[*].caption', note: 'captions' },
    { path: 'rsvp.deadline', note: 'reply-by date' },
    { path: 'contacts', note: 'contact person; number masked' }
  ],

  couple: {
    groom: 'Rohan',
    bride: 'Anaya',
    groomSurname: 'Malhotra',
    brideSurname: 'Kapoor',
    groomFull: 'Rohan Malhotra',
    brideFull: 'Anaya Kapoor',
    initials: 'RA'
  },

  wedding: {
    date: '2027-02-15',
    city: 'Hyderabad',
    datesLabel: '14–16 February 2027'
  },
  countdownTo: '2027-02-15T18:30:00+05:30',

  invocation: null, // optional ritual line, e.g. '॥ श्री गणेशाय नमः ॥'

  families: {
    together: 'Together with their families',
    groom: { parents: 'Nandini & Arvind Malhotra', from: 'New Delhi' },
    bride: { parents: 'Ritu & Ashwin Kapoor', from: 'Hyderabad' },
    signOff: 'With love, the Malhotra and Kapoor families'
  },

  copy: {
    welcomeLead: 'are getting married',
    welcomeLine: 'Three days in February, and mogra for every one.',
    celebrationsLine: 'Four celebrations. We’d love you at every one.',
    rsvpTitle: 'Will you join us?',
    rsvpThanksTitle: 'Thank you, {name}.',
    rsvpThanksLine: 'Your reply is with the family.',
    closingLine: 'Strung at dawn, open by night. Be there for both.',
    studioLine: 'Sample invitation by Shaadi Saathi',
    studioLink: 'Make this invitation yours'
  },

  story: [
    {
      id: 'table',
      label: 'Hyderabad, 2019',
      title: 'One table left, and a stranger who asked to share it.',
      text: 'A delayed flight, a crowded airport café, and a conversation that outlasted the delay.',
      images: ['P02']
    },
    {
      id: 'sundays',
      label: '2019–2025',
      title: 'Six years of Sundays.',
      text: 'Delhi to Hyderabad and back, a hundred times over. Every visit ended at the same chai stall.',
      images: ['P03', 'P05']
    },
    {
      id: 'question',
      label: 'Hyderabad, 2025',
      title: 'He asked on her grandmother’s terrace, with a strand of mogra instead of a ring.',
      text: '',
      images: ['P04']
    }
  ],

  events: [
    {
      id: 'mehendi',
      name: 'Mehendi',
      start: '2027-02-14T13:00:00+05:30',
      end: '2027-02-14T17:00:00+05:30',
      venue: { name: 'The Jasmine Courtyard', area: 'Kapoor residence, Jubilee Hills', mapQuery: 'Jubilee Hills, Hyderabad' },
      dress: 'Greens and ivory; flat shoes for the lawn',
      image: 'P06',
      composition: 'bleed-left',
      rsvp: true
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      start: '2027-02-14T19:30:00+05:30',
      end: '2027-02-15T00:30:00+05:30',
      venue: { name: 'The Glasshouse', area: 'Banjara Hills', mapQuery: 'Banjara Hills, Hyderabad' },
      dress: 'Evening wear with something that moves',
      image: 'P07',
      composition: 'vertical-name',
      rsvp: true
    },
    {
      id: 'wedding',
      name: 'The Wedding',
      start: '2027-02-15T18:30:00+05:30',
      end: '2027-02-15T23:30:00+05:30',
      venue: { name: 'Chandni Bagh', area: 'Gandipet', mapQuery: 'Gandipet, Hyderabad' },
      dress: 'Traditional; ivory and pastels welcome',
      image: 'P08',
      composition: 'centred-knot',
      major: true,
      rsvp: true
    },
    {
      id: 'reception',
      name: 'Reception',
      start: '2027-02-16T20:00:00+05:30',
      end: '2027-02-16T23:30:00+05:30',
      venue: { name: 'The Pearl Room', area: 'Banjara Hills', mapQuery: 'Banjara Hills, Hyderabad' },
      dress: 'Black tie, Indian or western',
      image: 'P09',
      composition: 'full-bleed-night',
      major: true,
      rsvp: true
    }
  ],

  venue: {
    eventId: 'wedding',
    image: 'P10',
    description: 'A lawn that runs down to the water, lit with lamps as the light goes.'
  },

  gallery: [
    { image: 'G01', caption: 'Morning' },
    { image: 'G02', caption: 'Hands' },
    { image: 'G03', caption: 'Pearls' },
    { image: 'G04', caption: 'Laughter' },
    { image: 'G05', caption: 'Silk' },
    { image: 'G06', caption: 'Mogra' },
    { image: 'G07', caption: 'Lamps' },
    { image: 'G08', caption: 'Us' }
  ],

  rsvp: { endpoint: '', maxGuests: 4, deadline: '2027-01-15' },

  contacts: [
    { name: 'Kabir Malhotra', role: 'Questions and travel', display: '+91 98••• •••••' }
  ],

  ui: {
    openInvite: 'Open the invitation from Rohan and Anaya',
    tapToOpen: 'Touch the pearl',
    sampleMark: 'Sample invitation',
    and: 'and',
    chapterWelcome: { numeral: '०२', label: 'Welcome', aria: 'Chapter 2, Welcome' },
    yes: 'Joyfully accepts',
    no: 'Regretfully declines',
    send: 'Send reply',
    yourName: 'Your name',
    whichEvents: 'Which celebrations',
    guests: 'How many of you',
    wish: 'A wish for them'
  },

  sales: { placement: 'slot' },
  music: null, // A01 once licensed: { src, loopStart: 0.5, loopLength, delay: 400, volume: 0.55, fetchAfter: 'opening' }
  sfx: { click: 'A02', roll: 'A03', pull: 'A04', silk: 'A05', bead: 'A06', knot: 'A07' },
  assets: 'assets/manifest.json'
};
