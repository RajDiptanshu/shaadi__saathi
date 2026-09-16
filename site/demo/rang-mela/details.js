/* Rang Mela · sample couple. Everything a guest reads comes from this file.
   All names, places and numbers here are fictional. */
window.INVITE = {
  slug: 'rang-mela',
  design: 'Rang Mela',
  sample: true,
  langs: ['en', 'hi'],

  couple: {
    groom: { en: 'Dev', hi: 'देव' },
    bride: { en: 'Tara', hi: 'तारा' },
    initials: { en: 'DT', hi: 'दे ता' }
  },
  kicker: { en: 'Save the date', hi: 'तारीख़ नोट कर लीजिए' },
  tagline: { en: 'Three days of colour, dhol and far too much food', hi: 'तीन दिन रंग, ढोल और बहुत सारा खाना' },
  welcome: { en: 'Aap aa rahe ho, na?', hi: 'आप आ रहे हैं ना?' },
  welcomeMeaning: { en: 'Because we have already told everyone you are.', hi: 'क्योंकि हमने सबको बता दिया है कि आप आ रहे हैं।' },

  hosts: { en: 'Meenal & Ashok Chandra', hi: 'मीनल एवं अशोक चंद्रा' },
  hostsLine: { en: 'are marrying off their son, with great joy and some relief', hi: 'अपने बेटे की शादी बड़े उत्साह के साथ कर रहे हैं' },
  brideParents: { en: 'daughter of Ritu & Nikhil Sondhi', hi: 'बेटी रितु एवं निखिल सोंधी की' },
  blessingsLabel: { en: 'Missing at every function', hi: 'हर रस्म में याद आएँगे' },
  blessings: { en: 'Nani Kamla Sondhi, who taught Tara every step she will dance', hi: 'नानी कमला सोंधी, जिनसे तारा ने हर ठुमका सीखा' },

  place: { en: 'Jaipur', hi: 'जयपुर' },
  dates: { en: '5 – 7 November 2027', hi: '5 – 7 नवंबर 2027' },
  countdownTo: '2027-11-07T07:30:00+05:30',
  countdownLabel: { en: 'until the pheras', hi: 'फेरों में बाकी' },
  scratchTitle: { en: 'Scratch the gulal', hi: 'गुलाल हटाइए' },
  scratchLead: { en: 'Rub it off with your thumb. Go on.', hi: 'अंगूठे से रगड़िए। हाँ, अभी।' },
  eventsTitle: { en: 'Teen din, poora mela', hi: 'तीन दिन, पूरा मेला' },
  dayLabel: { en: 'Day {n}', hi: 'दिन {n}' },
  wardrobeTitle: { en: 'Kya pehnein?', hi: 'क्या पहनें?' },
  wardrobeLead: { en: 'Nothing fancy. Just don’t clash with the decor.', hi: 'ज़्यादा सोचिए मत, बस सजावट से मत टकराइए।' },
  galleryTitle: { en: 'Us, mostly laughing', hi: 'हम, ज़्यादातर हँसते हुए' },
  galleryLead: { en: 'Tap a photo to see it bigger.', hi: 'बड़ा देखने के लिए फ़ोटो दबाइए।' },
  venueTitle: { en: 'Where it all happens', hi: 'सब कुछ यहीं होगा' },
  venueBlurb: { en: 'Mango trees, string lights, one very loud dhol and parking for everyone’s uncle.', hi: 'आम के पेड़, रोशनी, एक ज़ोरदार ढोल और सबके अंकल के लिए पार्किंग।' },
  rsvpTitle: { en: 'Bata dijiye', hi: 'बता दीजिए' },
  rsvpLead: { en: 'Tell us by 10 October so the halwai knows what he’s up against.', hi: '10 अक्टूबर तक बता दीजिए, हलवाई को तैयारी करनी है।' },
  contactsTitle: { en: 'Koi bhi doubt?', hi: 'कोई सवाल?' },

  venue: {
    name: { en: 'Gulmohar Farm', hi: 'गुलमोहर फ़ार्म' },
    address: 'Vatika Road, Jaipur, Rajasthan 303905',
    mapQuery: 'Vatika Road Jaipur Rajasthan 303905'
  },

  events: [
    {
      id: 'mehendi',
      name: { en: 'Mehendi', hi: 'मेहंदी' },
      note: { en: 'Hatheli pe rang, aur bahut saari chai.', hi: 'हथेली पर रंग, और ढेर सारी चाय।' },
      start: '2027-11-05T11:00:00+05:30',
      end: '2027-11-05T15:00:00+05:30',
      venue: { name: { en: 'The Courtyard', hi: 'आँगन' }, address: 'Gulmohar Farm, Vatika Road, Jaipur 303905' },
      dress: { en: 'Leheriya, mirrorwork, comfortable shoes', hi: 'लहरिया, शीशे का काम, आरामदायक जूते' },
      dressName: { en: 'Leheriya bright', hi: 'लहरिया रंग' },
      colour: '#F4C21B',
      rsvp: true
    },
    {
      id: 'haldi',
      name: { en: 'Haldi', hi: 'हल्दी' },
      note: { en: 'Poora din peela. Poori family pagal.', hi: 'पूरा दिन पीला। पूरा परिवार पागल।' },
      start: '2027-11-05T16:00:00+05:30',
      end: '2027-11-05T19:00:00+05:30',
      venue: { name: { en: 'Mango Lawn', hi: 'आम का लॉन' }, address: 'Gulmohar Farm, Vatika Road, Jaipur 303905' },
      dress: { en: 'Yellow, and nothing you’re fond of', hi: 'पीला, और कुछ ऐसा जिससे मोह न हो' },
      dressName: { en: 'Haldi yellow', hi: 'हल्दी पीला' },
      colour: '#E4B429',
      rsvp: true
    },
    {
      id: 'sangeet',
      name: { en: 'Sangeet', hi: 'संगीत' },
      note: { en: 'Practice kar lena — yahan competition hai.', hi: 'थोड़ी प्रैक्टिस कर लीजिए, यहाँ मुक़ाबला है।' },
      start: '2027-11-06T19:30:00+05:30',
      end: '2027-11-07T00:30:00+05:30',
      venue: { name: { en: 'The Big Tent', hi: 'बड़ा शामियाना' }, address: 'Gulmohar Farm, Vatika Road, Jaipur 303905' },
      dress: { en: 'Sequins on top, sneakers below', hi: 'ऊपर सितारे, नीचे स्नीकर्स' },
      dressName: { en: 'Sequin pink', hi: 'सितारा गुलाबी' },
      colour: '#E4508A',
      rsvp: true
    },
    {
      id: 'phere',
      name: { en: 'Phere', hi: 'फेरे' },
      note: { en: 'Subah ki thandi hawa, aur saat vachan.', hi: 'सुबह की ठंडी हवा, और सात वचन।' },
      start: '2027-11-07T07:30:00+05:30',
      venue: { name: { en: 'Under the peepal', hi: 'पीपल के नीचे' }, address: 'Gulmohar Farm, Vatika Road, Jaipur 303905' },
      dress: { en: 'Pastel bandhani, and a shawl — it’s cold', hi: 'हल्का बंधेज, और शॉल ज़रूर — ठंड है' },
      dressName: { en: 'Morning pastel', hi: 'सुबह का हल्का रंग' },
      colour: '#6EC3E0',
      major: true,
      rsvp: true
    },
    {
      id: 'reception',
      name: { en: 'Reception', hi: 'रिसेप्शन' },
      note: { en: 'Aakhri dance floor. Promise.', hi: 'आख़िरी डांस फ़्लोर। वादा।' },
      start: '2027-11-07T20:00:00+05:30',
      venue: { name: { en: 'The Terrace', hi: 'छत' }, address: 'Gulmohar Farm, Vatika Road, Jaipur 303905' },
      dress: { en: 'Whatever makes you dance', hi: 'जिसमें नाच सकें' },
      dressName: { en: 'Mela green', hi: 'मेला हरा' },
      colour: '#5E7A2E',
      major: true,
      rsvp: true
    }
  ],

  rsvp: { endpoint: '', maxGuests: 5 },

  // Sample numbers aren't callable; a real order adds tel: '+91…'.
  contacts: [
    { name: { en: 'Ishan Chandra', hi: 'ईशान चंद्रा' }, role: { en: 'Rooms, cabs, everything', hi: 'कमरे, गाड़ी, सब कुछ' }, display: '+91 98290 •••••' },
    { name: { en: 'Simi Sondhi', hi: 'सिमी सोंधी' }, role: { en: 'Sangeet practice', hi: 'संगीत की प्रैक्टिस' }, display: '+91 99100 •••••' }
  ],

  closing: { en: 'Aana zaroor', hi: 'आना ज़रूर' },
  closingFrom: { en: 'Dev, Tara and both sets of parents', hi: 'देव, तारा और दोनों परिवार' },

  // Photographs go here when the couple sends them, e.g. ['art/us-1.jpg', …].
  art: { cover: '', gallery: [] },
  music: null
};
