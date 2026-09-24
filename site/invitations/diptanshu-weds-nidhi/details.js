/* Baidyanath Dham · Diptanshu and Nidhi, 24 November 2026, Deoghar. The groom's-family mirror of
   the sibling baidyanath/ invitation — same wedding, same design, hosting order reversed: the Chaudhary family extends
   the invitation here, for their beloved son, and the Keshri family carries the "beloved daughter of"
   line. `couple.bride`/`couple.groom` are kept as the template's two *position* slots (first-displayed
   + inviting family / second-displayed + "beloved of" family) rather than as literal genders — swapping
   which name occupies which slot is what flips the whole page, because every scene reads couple.bride*
   and hosts.bride first. Every word the page shows comes from this file. Names, parents, date, time and
   venue are transcribed from the family's printed card. Anything listed in `placeholders` was written
   here and needs the family's eye before this is sent to guests. */
window.INVITE = {
  slug: 'diptanshu-weds-nidhi',
  design: 'Baidyanath Dham',
  sample: false,
  langs: ['en', 'hi'],

  placeholders: [
    { path: 'copy', note: 'every section line except the words transcribed from the printed card' },
    { path: 'copy.note', note: "the couple's own message — this is their voice, so replace it" },
    { path: 'media', note: 'photographs are in; the three frames take film whenever it is ready' }
  ],

  /* ---- Transcribed from the printed card, groom's-family order ------------------------------------ */

  couple: {
    groom: { en: 'Nidhi', hi: 'निधि' },
    bride: { en: 'Diptanshu', hi: 'दीप्तांशु' },
    groomFull: { en: 'Nidhi', hi: 'निधि' },
    brideFull: { en: 'Diptanshu', hi: 'दीप्तांशु' }
  },

  invocation: {
    sanskrit: 'ॐ श्री गणेशाय नमः',
    blessing: { en: 'With the blessings of the Almighty', hi: 'परमपिता परमेश्वर के आशीर्वाद से' }
  },

  hosts: {
    bride: {
      parents: { en: 'Mrs. Meera & Mr. Suresh Chaudhary', hi: 'श्रीमती मीरा एवं श्री सुरेश चौधरी' },
      invite: {
        en: 'cordially invite you to grace the auspicious wedding ceremony of their beloved son',
        hi: 'अपने प्रिय सुपुत्र के शुभ विवाह समारोह में आपकी गरिमामयी उपस्थिति की सादर कामना करते हैं'
      }
    },
    groom: {
      parents: { en: 'Mrs. Sudha & Mr. Rajeev Keshri', hi: 'श्रीमती सुधा एवं श्री राजीव केशरी' },
      relation: { en: 'Beloved daughter of', hi: 'की प्रिय सुपुत्री' }
    },
    presence: {
      en: 'Your gracious presence and blessings will make this joyous occasion truly memorable.',
      hi: 'आपकी गरिमामयी उपस्थिति एवं आशीर्वाद इस मंगल अवसर को सदा के लिए स्मरणीय बना देंगे।'
    },
    closing: {
      en: 'We look forward to celebrating this sacred union with you and your family.',
      hi: 'इस पावन बंधन के उत्सव में आपका एवं आपके परिवार का सादर स्वागत है।'
    }
  },

  wedding: {
    date: '2026-11-24',
    city: { en: 'Deoghar', hi: 'देवघर' },
    region: { en: 'Jharkhand', hi: 'झारखंड' },
    timeLabel: { en: '7:00 PM onwards', hi: 'सायं 7:00 बजे से' }
  },
  countdownTo: '2026-11-24T19:00:00+05:30',

  events: [
    {
      id: 'vivah',
      name: { en: 'Wedding Ceremony', hi: 'विवाह समारोह' },
      start: '2026-11-24T19:00:00+05:30',
      end: '2026-11-24T23:30:00+05:30',
      major: true,
      venue: {
        name: 'Vioray Inn',
        address: { en: 'Netaji Subash Rd, Big Bazar, Deoghar, Jharkhand 814112', hi: 'नेताजी सुभाष रोड, बिग बाज़ार, देवघर, झारखंड 814112' },
        mapQuery: 'Vioray Inn, Netaji Subash Road, Deoghar, Jharkhand 814112'
      }
    }
  ],

  venue: {
    name: 'Vioray Inn',
    area: { en: 'Netaji Subash Rd, Big Bazar, Deoghar, Jharkhand 814112', hi: 'नेताजी सुभाष रोड, बिग बाज़ार, देवघर, झारखंड 814112' },
    mapQuery: 'Vioray Inn, Netaji Subash Road, Deoghar, Jharkhand 814112',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Vioray%20Inn%2C%20Netaji%20Subash%20Road%2C%20Deoghar%2C%20Jharkhand%20814112'
  },

  /* ---- Written for the page ----------------------------------------------------------------------- */

  copy: {
    heroEyebrow: { en: 'Wedding Invitation', hi: 'विवाह निमंत्रण' },
    heroJoin: { en: 'weds', hi: 'संग' },

    occasionCue: { en: 'On the following occasion', hi: 'इस शुभ अवसर पर' },

    ribbon: { en: 'Save the date', hi: 'तिथि सुरक्षित रखें' },

    dayTitle: { en: 'The day', hi: 'वह दिन' },
    dayLine: { en: 'One evening, one ceremony, and everyone we love in one room.', hi: 'एक संध्या, एक समारोह, और हमारे सभी अपने एक ही छत के नीचे।' },

    countTitle: { en: 'Until the day', hi: 'उस दिन तक' },
    countLine: {
      en: 'Both our families are counting these down, and would very much like you to be counting them too.',
      hi: 'हमारे दोनों परिवार यह प्रतीक्षा गिन रहे हैं, और चाहते हैं कि आप भी हमारे साथ गिनें।'
    },

    noteTitle: { en: 'From Diptanshu and Nidhi', hi: 'दीप्तांशु और निधि की ओर से' },
    note: {
      en: 'Some things you plan for months, and some you simply know. This is both. On the twenty-fourth we would like every person who has been part of our story standing in the room with us — come early, stay late, and eat far more than you meant to.',
      hi: 'कुछ बातें महीनों की तैयारी माँगती हैं, और कुछ मन बस जान लेता है। यह दोनों है। चौबीस तारीख़ को हम चाहते हैं कि हमारी कहानी का हिस्सा रहा हर व्यक्ति हमारे साथ इस कमरे में हो — जल्दी आइए, देर तक रुकिए, और सोच से कहीं ज़्यादा खाइए।'
    },

    galleryTitle: { en: 'Engagement Glimpse', hi: 'सगाई की झलक' },

    venueTitle: { en: 'Looking forward to seeing you', hi: 'आपकी प्रतीक्षा में' },
    venueLine: { en: 'Vioray Inn is on Netaji Subash Road, a few minutes from Tower Chowk.', hi: 'वियोरे इन नेताजी सुभाष रोड पर, टावर चौक से कुछ ही मिनट की दूरी पर है।' },

    contactTitle: { en: 'Any questions at all', hi: 'कोई भी जिज्ञासा' },
    creditsLine: {
      en: 'Made with love, for the people we want in the room.',
      hi: 'प्रेम से बनाया गया — उन सबके लिए जिन्हें हम अपने साथ चाहते हैं।'
    }
  },

  /* engine/sound.js reads this. The file lives in the studio's shared audio library rather than in
     this invitation, so one encode serves every design; tools/deploy-<slug>.mjs stages it alongside.
     Supplied by the couple and used at their request — see the licence note against this track in
     site/shared/audio/manifest.json before reusing it anywhere else. */
  music: { src: '../../shared/audio/sai-pallavi-intro-amaran.mp3', volume: 0.45, loopStart: 0, loopLength: 0 },

  contact: {
    name: { en: 'Mukul', hi: 'मुकुल' },
    tel: 'tel:+918210264373',
    display: '+91 82102 64373'
  },
  contact2: {
    name: { en: 'Sagar', hi: 'सागर' },
    tel: 'tel:+917045352214',
    display: '+91 70453 52214'
  },

  /* The couple's photographs, each appearing exactly once and all of them in a single gallery rather
     than scattered down the page. Kept to the first three of the seven originally supplied — a longer
     carousel was adding weight (more originals staged into the build, more slides for the drag/keys
     logic to track) for photographs past the ones the couple actually wanted to lead with.
     No `focal` here: the gallery mounts each picture whole inside a square mat instead of cropping it,
     because p03 has the bride standing at the left and the groom sitting at the right and no portrait
     crop holds both. */
  media: {
    gallery: [
      {
        src: 'assets/photography/p01-reception',
        alt: { en: 'Nidhi and Diptanshu standing together under the flowers at their reception.', hi: 'रिसेप्शन पर फूलों के नीचे साथ खड़े निधि और दीप्तांशु।' },
        caption: { en: 'The two of us', hi: 'हम दोनों' }
      },
      {
        src: 'assets/photography/p03-sindoor-box',
        alt: { en: 'A decorated kalash held between two pairs of hands.', hi: 'दो जोड़ी हाथों में सजा हुआ कलश।' },
        caption: { en: 'Blessings in hand', hi: 'हाथों में आशीर्वाद' }
      },
      {
        src: 'assets/photography/p04-red-lehenga',
        alt: { en: 'Nidhi in a red lehenga, Diptanshu seated beside her in cream.', hi: 'लाल लहंगे में निधि, पास बैठे क्रीम शेरवानी में दीप्तांशु।' },
        caption: { en: 'Getting ready', hi: 'तैयारी' }
      }
    ]
  },

  ui: {
    openInvite: 'Open the invitation from Diptanshu and Nidhi',
    tapToOpen: { en: 'Open the invitation', hi: 'निमंत्रण खोलिए' },
    and: { en: 'and', hi: 'एवं' },
    dateLabel: { en: 'Date', hi: 'दिनांक' },
    timeLabel: { en: 'Time', hi: 'समय' },
    venueLabel: { en: 'Venue', hi: 'स्थान' },
    days: { en: 'Days', hi: 'दिन' },
    hours: { en: 'Hours', hi: 'घंटे' },
    minutes: { en: 'Minutes', hi: 'मिनट' },
    seconds: { en: 'Seconds', hi: 'सेकंड' },
    addCalendar: { en: 'Add to calendar', hi: 'कैलेंडर में जोड़ें' },
    directions: { en: 'Directions', hi: 'रास्ता देखें' },
    callContact: { en: 'Call', hi: 'कॉल करें' },
    music: { en: 'Music', hi: 'संगीत' },
    langEnglish: 'English',
    langHindi: 'हिन्दी'
  }
};
