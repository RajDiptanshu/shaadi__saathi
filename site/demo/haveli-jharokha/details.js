/* Haveli Jharokha · sample couple. Everything a guest reads comes from this file.
   All names, places and numbers here are fictional. */
window.INVITE = {
  slug: 'haveli-jharokha',
  design: 'Haveli Jharokha',
  sample: true,
  langs: ['en', 'hi'],

  couple: {
    groom: { en: 'Vikram', hi: 'विक्रम' },
    bride: { en: 'Rajnandini', hi: 'राजनंदिनी' },
    initials: { en: 'VR', hi: 'वि रा' }
  },
  invocation: { en: '॥ Shri Ganeshaya Namah ॥', hi: '॥ श्री गणेशाय नमः ॥' },
  welcome: { en: 'Padharo mhare des', hi: 'पधारो म्हारे देस' },
  welcomeMeaning: { en: 'Come, be welcomed in our land', hi: 'हमारे आँगन में आपका स्वागत है' },

  hosts: {
    en: 'Smt. Padmini & Shri Mahendra Singh Rathore',
    hi: 'श्रीमती पद्मिनी एवं श्री महेंद्र सिंह राठौड़'
  },
  hostsLine: {
    en: 'request the pleasure of your company, with family, at the wedding of their son',
    hi: 'अपने सुपुत्र के शुभ विवाह में आपको सपरिवार सादर आमंत्रित करते हैं'
  },
  brideParents: {
    en: 'daughter of Smt. Gayatri & Shri Devendra Singh Shekhawat',
    hi: 'सुपुत्री श्रीमती गायत्री एवं श्री देवेंद्र सिंह शेखावत'
  },
  blessingsLabel: { en: 'With the blessings of', hi: 'आशीर्वाद' },
  blessings: {
    en: 'Late Thakur Bhawani Singh Ji & Late Smt. Sugan Kanwar Ji',
    hi: 'स्व. ठाकुर भवानी सिंह जी एवं स्व. श्रीमती सुगन कंवर जी'
  },

  countdownLabel: { en: 'until the pheras', hi: 'पाणिग्रहण में शेष' },
  eventsTitle: { en: 'Three days at the haveli', hi: 'हवेली में तीन दिन' },
  dayLabel: { en: 'Day {n}', hi: 'दिन {n}' },
  rsvpTitle: { en: 'Send word to the haveli', hi: 'हवेली तक खबर भेजिए' },
  rsvpLead: { en: 'Kindly reply by 20 January, so the family can plan your stay.', hi: 'कृपया 20 जनवरी तक बताएँ, ताकि आपके ठहरने की व्यवस्था हो सके।' },
  contactsTitle: { en: 'For anything you need', hi: 'किसी भी सहायता के लिए' },

  place: { en: 'Udaipur', hi: 'उदयपुर' },
  dates: { en: '5 – 7 February 2027', hi: '5 – 7 फ़रवरी 2027' },
  countdownTo: '2027-02-06T21:00:00+05:30',

  events: [
    {
      id: 'tilak',
      name: { en: 'Tilak & Ganesh Puja', hi: 'तिलक एवं गणेश पूजन' },
      start: '2027-02-05T11:00:00+05:30',
      end: '2027-02-05T13:30:00+05:30',
      venue: { name: { en: 'The Courtyard, Haveli Chandrabagh', hi: 'आंगन, हवेली चंद्रबाग' }, address: 'Lake Pichola Road, Udaipur, Rajasthan 313001' },
      rsvp: true
    },
    {
      id: 'sangeet',
      name: { en: 'Mehendi & Mahila Sangeet', hi: 'मेहंदी एवं महिला संगीत' },
      start: '2027-02-05T19:00:00+05:30',
      end: '2027-02-05T23:00:00+05:30',
      venue: { name: { en: 'Zenana Terrace, Haveli Chandrabagh', hi: 'ज़नाना छत, हवेली चंद्रबाग' }, address: 'Lake Pichola Road, Udaipur, Rajasthan 313001' },
      dress: { en: 'Leheriya and bandhej in greens', hi: 'हरे रंग में लहरिया और बंधेज' },
      rsvp: true
    },
    {
      id: 'pithi',
      name: { en: 'Pithi', hi: 'पीठी' },
      start: '2027-02-06T10:30:00+05:30',
      end: '2027-02-06T13:00:00+05:30',
      venue: { name: { en: 'The Courtyard, Haveli Chandrabagh', hi: 'आंगन, हवेली चंद्रबाग' }, address: 'Lake Pichola Road, Udaipur, Rajasthan 313001' },
      dress: { en: 'Something yellow', hi: 'पीले रंग में' },
      rsvp: true
    },
    {
      id: 'baraat',
      name: { en: 'Baraat Nikasi', hi: 'बारात निकासी' },
      start: '2027-02-06T18:30:00+05:30',
      venue: { name: { en: 'From Gangaur Ghat', hi: 'गणगौर घाट से' }, address: 'Gangaur Ghat Marg, Udaipur, Rajasthan 313001' },
      dress: { en: 'Safa for the men, bring your dancing shoes', hi: 'पुरुषों के लिए साफ़ा, और नाचने की पूरी तैयारी' }
    },
    {
      id: 'pheras',
      name: { en: 'Pheras', hi: 'पाणिग्रहण संस्कार' },
      start: '2027-02-06T21:00:00+05:30',
      venue: { name: { en: 'Sheesh Mahal Lawns, Haveli Chandrabagh', hi: 'शीश महल लॉन, हवेली चंद्रबाग' }, address: 'Lake Pichola Road, Udaipur, Rajasthan 313001' },
      major: true,
      rsvp: true
    },
    {
      id: 'reception',
      name: { en: 'Reception', hi: 'प्रीतिभोज' },
      start: '2027-02-07T20:00:00+05:30',
      venue: { name: { en: 'Durbar Hall, Haveli Chandrabagh', hi: 'दरबार हॉल, हवेली चंद्रबाग' }, address: 'Lake Pichola Road, Udaipur, Rajasthan 313001' },
      dress: { en: 'Royal Indo-western', hi: 'शाही इंडो-वेस्टर्न' },
      major: true,
      rsvp: true
    }
  ],

  rsvp: { endpoint: '', maxGuests: 6 },

  // Sample numbers aren't callable; a real order adds tel: '+91…'.
  contacts: [
    { name: { en: 'Kunwar Aditya Singh', hi: 'कुंवर आदित्य सिंह' }, role: { en: 'For travel and stay', hi: 'यात्रा एवं ठहराव' }, display: '+91 98290 •••••' },
    { name: { en: 'Baisa Kritika Rathore', hi: 'बाईसा कृतिका राठौड़' }, role: { en: 'For the ceremonies', hi: 'कार्यक्रम संबंधी' }, display: '+91 94140 •••••' }
  ],

  closing: { en: 'Your presence will make our celebrations complete', hi: 'आपकी उपस्थिति से ही उत्सव पूर्ण होगा' },
  closingFrom: { en: 'The Rathore family', hi: 'समस्त राठौड़ परिवार' },

  // A painted palace for the cover goes here when it's ready, e.g. 'art/cover.jpg'. Until then the drawn palace shows.
  art: { cover: '' },
  music: null
};
