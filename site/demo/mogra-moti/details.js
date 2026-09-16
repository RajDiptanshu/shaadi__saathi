/* Mogra & Moti · sample couple. Everything a guest reads comes from this file.
   All names, places and numbers here are fictional. */
window.INVITE = {
  slug: 'mogra-moti',
  design: 'Mogra & Moti',
  sample: true,
  langs: ['en'],

  couple: {
    groom: 'Rohan',
    bride: 'Anaya',
    initials: 'RA'
  },
  kicker: 'Two families, one long-awaited weekend',
  welcome: 'Come stand with us under the mogra',
  welcomeMeaning: 'Three evenings by the sea, and you in every one of them.',

  hosts: 'Nandita & Sameer Mehra',
  hostsLine: 'invite you to the wedding of their son',
  brideParents: 'daughter of Radhika & Vikas Bhatia',
  blessingsLabel: 'Remembering',
  blessings: 'Kamal Mehra and Sushila Bhatia, who would have loved this weekend most',

  place: 'Alibaug',
  dates: '12 – 14 March 2027',
  countdownTo: '2027-03-13T19:30:00+05:30',
  countdownLabel: 'until the pheras',
  eventsTitle: 'The weekend',
  dayLabel: 'Day {n}',
  rsvpTitle: 'Save us a seat?',
  rsvpLead: 'Please reply by 10 February so we can plan rooms and cars.',
  contactsTitle: 'Anything at all',

  events: [
    {
      id: 'mehendi',
      name: 'Mehendi lunch',
      start: '2027-03-12T12:30:00+05:30',
      end: '2027-03-12T16:00:00+05:30',
      venue: { name: 'The Orchard, Villa Mogra', address: 'Awas Beach Road, Alibaug, Maharashtra 402201' },
      dress: 'Soft linens and whites',
      rsvp: true
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      start: '2027-03-12T20:00:00+05:30',
      end: '2027-03-13T00:30:00+05:30',
      venue: { name: 'The Pearl Room, Villa Mogra', address: 'Awas Beach Road, Alibaug, Maharashtra 402201' },
      dress: 'Black tie, with something that shines',
      rsvp: true
    },
    {
      id: 'haldi',
      name: 'Haldi by the pool',
      start: '2027-03-13T11:00:00+05:30',
      end: '2027-03-13T14:00:00+05:30',
      venue: { name: 'Poolside, Villa Mogra', address: 'Awas Beach Road, Alibaug, Maharashtra 402201' },
      dress: 'Anything you don’t mind losing to turmeric',
      rsvp: true
    },
    {
      id: 'pheras',
      name: 'The wedding',
      start: '2027-03-13T19:30:00+05:30',
      venue: { name: 'The Mogra Mandap, Villa Mogra', address: 'Awas Beach Road, Alibaug, Maharashtra 402201' },
      major: true,
      rsvp: true
    },
    {
      id: 'reception',
      name: 'Reception',
      start: '2027-03-14T20:00:00+05:30',
      venue: { name: 'The Ballroom, Sea House', address: 'Marine Drive, Mumbai, Maharashtra 400020' },
      dress: 'Evening formal',
      major: true,
      rsvp: true
    }
  ],

  rsvp: { endpoint: '', maxGuests: 4 },

  // Sample numbers aren't callable; a real order adds tel: '+91…'.
  contacts: [
    { name: 'Ishaan Mehra', role: 'Rooms, cars and the ferry', display: '+91 98200 •••••' },
    { name: 'Tara Bhatia', role: 'Everything else', display: '+91 99870 •••••' }
  ],

  closing: 'We’ll see you by the water',
  closingFrom: 'With love, the Mehra and Bhatia families',

  // A painted mandap of white flowers goes here when it's ready, e.g. 'art/cover.jpg'.
  art: { cover: '' },
  music: null
};
