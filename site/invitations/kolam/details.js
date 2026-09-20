/* Kolam · demo invitation. Every wedding detail the page shows comes from this file.
   Karthik Ramanathan, Meenakshi Srinivasan and 7 February 2027 are a fictional demo couple.
   Everything listed in `placeholders` was invented for the demo and must be replaced for a real order. */
window.INVITE = {
  slug: 'kolam',
  design: 'Kolam',
  sample: true,
  langs: ['en'],

  placeholders: [
    { path: 'wedding.city', note: 'demo city (Kanchipuram, for silk and temples)' },
    { path: 'families', note: 'all family names, home towns and the sign-off' },
    { path: 'copy', note: 'all scene lines except interface words' },
    { path: 'events', note: 'dates, times, venue, notes, colours and dress lines' },
    { path: 'tamil', note: 'Tamil lines; check with the family before print' },
    { path: 'rsvp.deadline', note: 'reply-by date' }
  ],

  couple: {
    groom: 'Karthik',
    bride: 'Meenakshi',
    groomFull: 'Karthik Ramanathan',
    brideFull: 'Meenakshi Srinivasan'
  },

  tamil: {
    groom: 'கார்த்திக்',
    bride: 'மீனாட்சி',
    invite: 'திருமண அழைப்பு',
    muhurtham: 'முகூர்த்தம்',
    blessing: 'வாழ்க வளமுடன்',
    mangalam: 'மங்களம்'
  },

  wedding: {
    date: '2027-02-07',
    city: 'Kanchipuram',
    datesLabel: '5–7 February 2027'
  },
  countdownTo: '2027-02-07T09:45:00+05:30',

  families: {
    together: 'With the blessings of our families',
    groom: { parents: 'Lakshmi & R. Ramanathan', from: 'Kanchipuram' },
    bride: { parents: 'Vasanthi & K. Srinivasan', from: 'Madurai' },
    signOff: 'The Ramanathan and Srinivasan families'
  },

  copy: {
    welcomeLead: 'are getting married',
    welcomeLine: 'Two lines, one kolam. Drawn at our door before the sun was up, for you.',
    blessingLine: 'A handful of rice, a touch of turmeric, and every elder we have.',
    muhurthamEyebrow: 'Kaalai muhurtham',
    muhurthamTime: '9.45 – 10.45',
    muhurthamLine: 'The thaali is tied within the hour. Please be seated by nine.',
    saveHint: 'Rub the manjal to see the hour',
    countdownLine: 'until the nadaswaram begins.',
    ceremoniesTitle: 'Three days, each with a colour of its own.',
    wardrobeTitle: 'What to wear, day by day.',
    venueLine: 'A mandapam of old stone beside the temple tank, where the morning light arrives before the guests do.',
    closingLine: 'Come, take the blessings and the first plate of the feast.',
    studioLine: 'Sample invitation by Shaadi Saathi'
  },

  events: [
    {
      id: 'nichayathartham', number: 'I', name: 'Nichayathartham', tamil: 'நிச்சயதார்த்தம்',
      start: '2027-02-05T18:30:00+05:30', end: '2027-02-05T21:30:00+05:30',
      note: 'Rings, a plate of betel, and the first of many blessings.',
      colour: 'Ivory and temple red', swatchStyle: '--a:#F3ECD8;--b:#8E1B1B', dress: 'Silk sarees and veshtis; ivory with a red border', rsvp: true,
      venue: { name: 'Kailasa Kalyana Mandapam', address: 'near the temple tank, Kanchipuram', mapQuery: 'Kanchipuram' }
    },
    {
      id: 'nalangu', number: 'II', name: 'Nalangu', tamil: 'நலங்கு',
      start: '2027-02-06T17:00:00+05:30', end: '2027-02-06T20:00:00+05:30',
      note: 'Turmeric, songs, and the games the elders still know the rules to.',
      colour: 'Manjal yellow', swatchStyle: '--a:#E4B33A;--b:#3C6E3A', dress: 'Cottons in yellow and green; nothing you would mind turmeric on', rsvp: true,
      venue: { name: 'Kailasa Kalyana Mandapam', address: 'near the temple tank, Kanchipuram', mapQuery: 'Kanchipuram' }
    },
    {
      id: 'muhurtham', number: 'III', name: 'Muhurtham', tamil: 'முகூர்த்தம்',
      start: '2027-02-07T09:45:00+05:30', end: '2027-02-07T10:45:00+05:30',
      note: 'The thaali is tied as the nadaswaram rises. Be seated by nine.',
      colour: 'Arakku and gold', swatchStyle: '--a:#8E1B1B;--b:#C6A04B', dress: 'Kanjivaram silks and pattu veshtis', major: true, rsvp: true,
      venue: { name: 'Kailasa Kalyana Mandapam', address: 'near the temple tank, Kanchipuram', mapQuery: 'Kanchipuram' }
    },
    {
      id: 'reception', number: 'IV', name: 'Reception', tamil: 'வரவேற்பு',
      start: '2027-02-07T19:00:00+05:30', end: '2027-02-07T22:30:00+05:30',
      note: 'An evening in Kanchipuram silk, with dinner on a banana leaf.',
      colour: 'Peacock and rose', swatchStyle: '--a:#1F5F6B;--b:#C97B8E', dress: 'Evening silks, Indian or western', rsvp: true,
      venue: { name: 'Kailasa Kalyana Mandapam', address: 'near the temple tank, Kanchipuram', mapQuery: 'Kanchipuram' }
    }
  ],

  venue: {
    name: 'Kailasa Kalyana Mandapam',
    area: 'near the temple tank, Kanchipuram',
    mapQuery: 'Kanchipuram',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kanchipuram'
  },

  rsvp: { deadline: '2027-01-10' },

  ui: {
    openInvite: 'Open the invitation from Karthik and Meenakshi',
    tapToOpen: 'Step in',
    sampleMark: 'Sample invitation',
    and: 'and',
    chapterWelcome: 'Welcome',
    chapterBlessings: 'With the blessings of',
    chapterMuhurtham: 'The muhurtham',
    chapterCountdown: 'Counting to the muhurtham',
    chapterCeremonies: 'Three days in Kanchipuram',
    chapterWardrobe: 'Pattu for the day',
    chapterVenue: 'The mandapam',
    openLocation: 'Open live location',
    rsvpLabel: 'RSVP',
    rsvpNote: 'A live guest-response form on every bespoke order.'
  },

  assets: 'assets/manifest.json'
};
