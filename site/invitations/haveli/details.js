/* Haveli · demo invitation. Every wedding detail the page shows comes from this file.
   Aarav Bhati, Meera Rathi and 24 January 2027 are the brief's fictional demo couple.
   Everything listed in `placeholders` was invented for the demo and must be replaced for a real order. */
window.INVITE = {
  slug: 'haveli',
  design: 'Haveli',
  sample: true,
  langs: ['en'],

  placeholders: [
    { path: 'wedding.city', note: 'demo city (Jaisalmer, for its sandstone)' },
    { path: 'families', note: 'all family names, home cities and the sign-off' },
    { path: 'copy', note: 'all scene lines except interface words' },
    { path: 'event', note: 'date, time, venue and description' },
    { path: 'rsvp.deadline', note: 'reply-by date' }
  ],

  couple: {
    groom: 'Aarav',
    bride: 'Meera',
    groomSurname: 'Bhati',
    brideSurname: 'Rathi',
    groomFull: 'Aarav Bhati',
    brideFull: 'Meera Rathi'
  },

  wedding: {
    date: '2027-01-24',
    city: 'Jaisalmer'
  },

  families: {
    together: 'Together with their families',
    groom: { parents: 'Kavita & Suresh Bhati', from: 'Jodhpur' },
    bride: { parents: 'Alka & Devendra Rathi', from: 'Jaisalmer' },
    signOff: 'With love, the Bhati and Rathi families'
  },

  copy: {
    welcomeLead: 'are getting married',
    welcomeLine: 'A hundred years of sandstone, and one afternoon of light for us.',
    venueLine: 'The courtyard where his grandfather once kept pigeons, and where the afternoon sun still keeps its old hours.',
    closingLine: 'Come find us where the light falls.',
    sampleMark: 'Sample invitation',
    studioLine: 'Sample invitation by Shaadi Saathi'
  },

  event: {
    name: 'The Wedding',
    start: '2027-01-24T17:30:00+05:30',
    venue: { name: 'Kothi Aangan', area: 'near Gadisar Lake, Jaisalmer' }
  },

  rsvp: { deadline: '2026-12-20' },

  ui: {
    openInvite: 'Open the invitation from Aarav and Meera',
    tapToOpen: 'Open the shutters',
    sampleMark: 'Sample invitation',
    and: 'and',
    chapterWelcome: 'Welcome',
    chapterVenue: 'The Venue',
    rsvpNote: 'RSVP · details to follow'
  },

  assets: 'assets/manifest.json'
};
