/* Premiere Night · sample couple. Everything a guest reads comes from this file.
   All names, places and numbers here are fictional. */
window.INVITE = {
  slug: 'premiere-night',
  design: 'Premiere Night',
  sample: true,
  langs: ['en', 'hi'],

  couple: {
    groom: { en: 'Aditya', hi: 'आदित्य' },
    bride: { en: 'Kiara', hi: 'कियारा' },
    initials: { en: 'AK', hi: 'आ कि' }
  },
  kicker: { en: 'Now showing', hi: 'अब प्रदर्शित' },
  tagline: { en: 'A love story, three nights only', hi: 'एक प्रेम कहानी, केवल तीन रातें' },
  ticketText: { en: 'Admit one', hi: 'प्रवेश: एक' },
  ticketSeat: { en: 'Row A · Best seat in the house', hi: 'पंक्ति A · सबसे अच्छी सीट' },
  welcome: { en: 'Doors open at seven', hi: 'सात बजे दरवाज़े खुलेंगे' },
  welcomeMeaning: { en: 'Two families, one very long shoot, and the happiest ending we could write.', hi: 'दो परिवार, एक लंबी शूटिंग, और सबसे सुखद अंत।' },

  hosts: { en: 'Sunita & Rakesh Malhotra', hi: 'सुनीता एवं राकेश मल्होत्रा' },
  hostsLine: { en: 'present the wedding of their son', hi: 'अपने सुपुत्र के विवाह का निमंत्रण प्रस्तुत करते हैं' },
  brideParents: { en: 'daughter of Rupa & Anil Sethi', hi: 'सुपुत्री रूपा एवं अनिल सेठी' },
  blessingsLabel: { en: 'In loving memory', hi: 'स्मृति शेष' },
  blessings: { en: 'Dadaji Prem Malhotra, who never missed a first-day first show', hi: 'दादाजी प्रेम मल्होत्रा, जो पहला शो कभी नहीं चूके' },

  place: { en: 'Mumbai', hi: 'मुंबई' },
  dates: { en: '12 – 14 February 2027', hi: '12 – 14 फ़रवरी 2027' },
  countdownTo: '2027-02-13T19:30:00+05:30',
  countdownLabel: { en: 'until showtime', hi: 'शो शुरू होने में' },
  eventsTitle: { en: 'The programme', hi: 'कार्यक्रम' },
  dayLabel: { en: 'Night {n}', hi: 'रात {n}' },
  rsvpTitle: { en: 'Reserve your seats', hi: 'अपनी सीट बुक कीजिए' },
  rsvpLead: { en: 'Seats are limited and the house fills fast. Tell us by 25 January.', hi: 'सीटें सीमित हैं। कृपया 25 जनवरी तक बताइए।' },
  contactsTitle: { en: 'Box office', hi: 'बुकिंग सहायता' },

  events: [
    {
      id: 'mehendi',
      name: { en: 'Mehendi', hi: 'मेहंदी' },
      billing: { en: 'The trailer', hi: 'ट्रेलर' },
      start: '2027-02-12T12:00:00+05:30',
      end: '2027-02-12T16:00:00+05:30',
      venue: { name: { en: 'The Terrace, Studio Seven', hi: 'टेरेस, स्टूडियो सेवन' }, address: 'Filmcity Road, Goregaon East, Mumbai 400065' },
      dress: { en: 'Something bright enough for the camera', hi: 'कैमरे के लिए चटख रंग' },
      rsvp: true
    },
    {
      id: 'sangeet',
      name: { en: 'Sangeet', hi: 'संगीत' },
      billing: { en: 'Opening night', hi: 'पहला शो' },
      start: '2027-02-12T20:00:00+05:30',
      end: '2027-02-13T01:00:00+05:30',
      venue: { name: { en: 'Sound Stage 4, Studio Seven', hi: 'साउंड स्टेज 4, स्टूडियो सेवन' }, address: 'Filmcity Road, Goregaon East, Mumbai 400065' },
      dress: { en: 'Black tie, with a red-carpet streak', hi: 'ब्लैक टाई, थोड़े ग्लैमर के साथ' },
      rsvp: true
    },
    {
      id: 'haldi',
      name: { en: 'Haldi', hi: 'हल्दी' },
      billing: { en: 'Morning matinee', hi: 'सुबह का शो' },
      start: '2027-02-13T10:30:00+05:30',
      end: '2027-02-13T13:30:00+05:30',
      venue: { name: { en: 'The Garden, The Grand Regal', hi: 'गार्डन, द ग्रैंड रीगल' }, address: 'Juhu Tara Road, Mumbai 400049' },
      dress: { en: 'White and yellow, nothing you love too much', hi: 'सफ़ेद और पीला, जो ख़राब होने से डर न लगे' },
      rsvp: true
    },
    {
      id: 'wedding',
      name: { en: 'The Wedding', hi: 'विवाह' },
      billing: { en: 'The main feature', hi: 'मुख्य फ़िल्म' },
      start: '2027-02-13T19:30:00+05:30',
      venue: { name: { en: 'The Ballroom, The Grand Regal', hi: 'बॉलरूम, द ग्रैंड रीगल' }, address: 'Juhu Tara Road, Mumbai 400049' },
      major: true,
      rsvp: true
    },
    {
      id: 'reception',
      name: { en: 'Reception', hi: 'स्वागत समारोह' },
      billing: { en: 'The after party', hi: 'आफ़्टर पार्टी' },
      start: '2027-02-14T20:00:00+05:30',
      venue: { name: { en: 'Marine Ballroom', hi: 'मरीन बॉलरूम' }, address: 'Nariman Point, Mumbai 400021' },
      dress: { en: 'Retro Bollywood glamour', hi: 'रेट्रो बॉलीवुड ग्लैमर' },
      major: true,
      rsvp: true
    }
  ],

  rsvp: { endpoint: '', maxGuests: 4 },

  // Sample numbers aren't callable; a real order adds tel: '+91…'.
  contacts: [
    { name: { en: 'Veer Malhotra', hi: 'वीर मल्होत्रा' }, role: { en: 'Seats and stay', hi: 'सीट एवं ठहराव' }, display: '+91 98200 •••••' },
    { name: { en: 'Naina Sethi', hi: 'नैना सेठी' }, role: { en: 'Everything else', hi: 'अन्य जानकारी' }, display: '+91 99300 •••••' }
  ],

  closing: { en: 'See you at the movies', hi: 'फिर मिलते हैं, शो पर' },
  closingFrom: { en: 'The Malhotra and Sethi families', hi: 'मल्होत्रा एवं सेठी परिवार' },

  // The film-strip gallery shows these when they exist, e.g. ['art/still-1.jpg', …].
  art: { cover: '', gallery: [] },
  music: null
};
