/* Premiere Night artwork: the velvet curtain, the marquee and its bulbs, the ticket that tears,
   a film strip for photographs, and a reel for dividers. Text stays in HTML so both languages work. */
window.PremiereArt = (function () {
  var NIGHT = '#111014', GOLD = '#F2C14E', GOLD_DEEP = '#B98A22', CRIMSON = '#8C1C24', CRIMSON_DEEP = '#5E1017', CREAM = '#F4E9D8';
  function f(n) { return Math.round(n * 10) / 10; }

  function sprite() {
    return '<svg class="sprite" aria-hidden="true" focusable="false"><defs>' +
      '<linearGradient id="pn-velvet" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="' + CRIMSON_DEEP + '"/><stop offset=".18" stop-color="#A32530"/>' +
        '<stop offset=".34" stop-color="' + CRIMSON_DEEP + '"/><stop offset=".52" stop-color="#9E232D"/>' +
        '<stop offset=".7" stop-color="#570F16"/><stop offset=".86" stop-color="#A32530"/><stop offset="1" stop-color="' + CRIMSON_DEEP + '"/>' +
      '</linearGradient>' +
      '<linearGradient id="pn-gold" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#FBE6A8"/><stop offset=".45" stop-color="' + GOLD + '"/><stop offset="1" stop-color="' + GOLD_DEEP + '"/>' +
      '</linearGradient>' +
      '<radialGradient id="pn-bulb" cx="42%" cy="36%" r="62%">' +
        '<stop offset="0" stop-color="#FFF8E2"/><stop offset=".5" stop-color="' + GOLD + '"/><stop offset="1" stop-color="' + GOLD_DEEP + '"/>' +
      '</radialGradient>' +
    '</defs></svg>';
  }

  /* Half of a velvet drape, with folds and a scalloped hem. side 'l' or 'r'. */
  function curtain(side) {
    var w = 220, h = 900, folds = 6, out = '';
    for (var i = 0; i < folds; i++) {
      var x = (w / folds) * i;
      var mid = x + w / folds / 2;
      out += '<path d="M' + f(x) + ',0V' + h + 'H' + f(x + w / folds) + 'V0Z" fill="url(#pn-velvet)" opacity="' + (i % 2 ? '.9' : '1') + '"/>' +
        '<path d="M' + f(mid) + ',0V' + h + '" stroke="#3E0A10" stroke-opacity=".55" stroke-width="' + (6 + (i % 3) * 3) + '"/>';
    }
    // Scalloped hem, deeper towards the middle of the stage.
    var hem = 'M0,' + h;
    for (var k = 0; k < folds; k++) {
      var kx = (w / folds) * k, kw = w / folds;
      hem += 'q' + f(kw / 2) + ',' + (34 + k * 2) + ' ' + f(kw) + ',0';
    }
    hem += 'V' + (h + 60) + 'H0Z';
    return '<svg class="curtain-art" viewBox="0 0 ' + w + ' ' + (h + 60) + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<g' + (side === 'r' ? ' transform="translate(' + w + ',0) scale(-1,1)"' : '') + '>' + out +
      '<path d="' + hem + '" fill="' + NIGHT + '"/>' +
      '<path d="M0,0H' + w + 'V26H0Z" fill="#3E0A10"/>' +
      '</g></svg>';
  }

  /* The marquee board. The couple's names go inside it as HTML, so the language switch still works. */
  function marquee() {
    var w = 360, h = 190, bulbs = '';
    var step = 26, i;
    for (i = 0; i * step < w - 18; i++) {
      bulbs += bulb(14 + i * step, 13, i);
      bulbs += bulb(14 + i * step, h - 13, i + 3);
    }
    for (i = 1; i * step < h - 26; i++) {
      bulbs += bulb(13, 13 + i * step, i + 1);
      bulbs += bulb(w - 13, 13 + i * step, i + 5);
    }
    function bulb(cx, cy, n) {
      return '<circle class="bulb" style="--b:' + (n % 6) + '" cx="' + f(cx) + '" cy="' + f(cy) + '" r="4.6" fill="url(#pn-bulb)"/>';
    }
    return '<svg class="marquee-art" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' +
      '<path d="M6,6H' + (w - 6) + 'V' + (h - 6) + 'H6Z" fill="#191720" stroke="url(#pn-gold)" stroke-width="2.5"/>' +
      '<path d="M22,22H' + (w - 22) + 'V' + (h - 22) + 'H22Z" fill="none" stroke="' + GOLD_DEEP + '" stroke-opacity=".5" stroke-width="1"/>' +
      bulbs +
    '</svg>';
  }

  /* The ticket a guest tears to come in. */
  /* The ticket: a wide half to read, a stub to tear, and a line of perforations between them.
     Both halves reach the same margins, so the ticket sits centred in its box. */
  function ticket() {
    var w = 320, h = 120, cut = 214, holes = '';
    for (var y = 14; y < h - 8; y += 12) {
      holes += '<circle cx="' + cut + '" cy="' + y + '" r="2.4" fill="' + NIGHT + '"/>';
    }
    return '<svg class="ticket-art" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' +
      '<g class="ticket-body">' +
        '<path d="M6,10h' + (cut - 12) + 'v' + (h - 20) + 'H6Z" fill="' + CREAM + '"/>' +
        '<path d="M20,24h' + (cut - 40) + 'v' + (h - 48) + 'H20Z" fill="none" stroke="' + CRIMSON + '" stroke-opacity=".3" stroke-width="1"/>' +
      '</g>' +
      '<g class="ticket-stub">' +
        '<path d="M' + (cut + 6) + ',10h' + (w - cut - 12) + 'v' + (h - 20) + 'h-' + (w - cut - 12) + 'Z" fill="' + CREAM + '"/>' +
        '<path d="M' + (cut + 26) + ',' + (h / 2 - 18) + 'l12,18l-12,18" fill="none" stroke="' + CRIMSON + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M' + (cut + 44) + ',' + (h / 2 - 18) + 'l12,18l-12,18" fill="none" stroke="' + CRIMSON + '" stroke-opacity=".45" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</g>' +
      holes +
    '</svg>';
  }

  /* A strip of film for the photographs. Frames are filled from details.js when there are any. */
  function filmStrip(frames) {
    var fw = 104, fh = 78, pad = 12, n = frames || 4, out = '', x, i;
    var w = n * (fw + pad) + pad, h = fh + 40;
    for (i = 0; i < n; i++) {
      x = pad + i * (fw + pad);
      out += '<rect class="frame" x="' + x + '" y="20" width="' + fw + '" height="' + fh + '" fill="#241F2C"/>';
    }
    var holes = '';
    for (x = 8; x < w - 6; x += 18) {
      holes += '<rect x="' + x + '" y="6" width="9" height="8" rx="1.5" fill="' + NIGHT + '"/>' +
        '<rect x="' + x + '" y="' + (h - 14) + '" width="9" height="8" rx="1.5" fill="' + NIGHT + '"/>';
    }
    return '<svg class="film-art" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' +
      '<rect width="' + w + '" height="' + h + '" fill="#17151D"/>' + holes + out + '</svg>';
  }

  /* A film reel, used to divide sections. */
  function reel() {
    var out = '';
    for (var i = 0; i < 6; i++) {
      var a = (Math.PI * 2 * i) / 6;
      out += '<circle cx="' + f(24 + Math.cos(a) * 11) + '" cy="' + f(24 + Math.sin(a) * 11) + '" r="4.6" fill="none" stroke="' + GOLD + '" stroke-width="1.4"/>';
    }
    return '<svg class="reel-art" viewBox="0 0 48 48" aria-hidden="true">' +
      '<circle cx="24" cy="24" r="21" fill="none" stroke="' + GOLD + '" stroke-width="1.6"/>' +
      '<circle cx="24" cy="24" r="3.4" fill="' + GOLD + '"/>' + out + '</svg>';
  }

  return { sprite: sprite, curtain: curtain, marquee: marquee, ticket: ticket, filmStrip: filmStrip, reel: reel };
})();
