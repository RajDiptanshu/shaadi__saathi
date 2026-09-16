/* Mogra & Moti artwork: curtains of pearls, an ivory silk bow, mogra sprigs and a flower mandap. */
window.MograArt = (function () {
  var IVORY = '#F8F6F1', PEARL = '#EFE7DE', PEARL_DEEP = '#D8CBBE', GOLD = '#C2A26B', SAGE = '#8CA38A', BLUSH = '#E9C9C3';
  function f(n) { return Math.round(n * 10) / 10; }

  function sprite() {
    return '<svg class="sprite" aria-hidden="true" focusable="false"><defs>' +
      '<radialGradient id="mm-pearl" cx="35%" cy="30%" r="70%">' +
        '<stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="' + PEARL + '"/><stop offset="1" stop-color="' + PEARL_DEEP + '"/>' +
      '</radialGradient>' +
      '<linearGradient id="mm-silk" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#FFFFFF"/><stop offset=".4" stop-color="' + IVORY + '"/><stop offset=".62" stop-color="#E6DFD4"/><stop offset="1" stop-color="#F4EFE7"/>' +
      '</linearGradient>' +
      '<linearGradient id="mm-gold" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#E4CE9C"/><stop offset=".5" stop-color="' + GOLD + '"/><stop offset="1" stop-color="#9A7C46"/>' +
      '</linearGradient>' +
    '</defs></svg>';
  }

  /* One curtain of hanging pearl strings. Each string sways on its own in the stylesheet. */
  function pearlCurtain(side, strings) {
    strings = strings || 9;
    var w = 300, h = 700, gap = w / strings, out = '';
    for (var i = 0; i < strings; i++) {
      // Strings nearest the middle of the window hang longest.
      var x = f(gap * (i + 0.5));
      var edge = side === 'l' ? i / strings : 1 - i / strings;
      var len = f(h * (0.55 + 0.42 * edge));
      var pearls = '';
      for (var y = 26; y < len; y += 17) {
        var r = y > len - 40 ? 5.5 : 6.5;
        pearls += '<circle cx="' + x + '" cy="' + f(y) + '" r="' + r + '" fill="url(#mm-pearl)"/>';
      }
      out += '<g class="pstring" style="--i:' + i + '">' +
        '<path d="M' + x + ',0V' + len + '" stroke="' + PEARL_DEEP + '" stroke-width="1" stroke-opacity=".7"/>' +
        pearls +
        '<circle cx="' + x + '" cy="' + f(len + 8) + '" r="3.4" fill="' + GOLD + '"/>' +
        '</g>';
    }
    // "slice" keeps the pearls round; stretching the viewBox would squash them into beads.
    return '<svg class="curtain-art" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' + out + '</svg>';
  }

  /* The silk bow on the seam: two loops, a knot and two tails. It unties on the opening tap. */
  function bow() {
    return '<svg class="bow-art" viewBox="0 0 220 190" aria-hidden="true">' +
      '<g class="bow-tails">' +
        '<path d="M104,64C96,96 78,124 58,150c14,6 26,4 36,-6c10,-10 16,-30 18,-52z" fill="url(#mm-silk)" stroke="' + PEARL_DEEP + '" stroke-width="1"/>' +
        '<path d="M116,64c8,32 26,60 46,86c-14,6 -26,4 -36,-6c-10,-10 -16,-30 -18,-52z" fill="url(#mm-silk)" stroke="' + PEARL_DEEP + '" stroke-width="1"/>' +
      '</g>' +
      '<g class="bow-loop bow-loop-l">' +
        '<path d="M104,52C82,24 44,20 26,38c-16,16 -6,42 20,50c20,6 42,0 58,-14z" fill="url(#mm-silk)" stroke="' + PEARL_DEEP + '" stroke-width="1"/>' +
        '<path d="M96,44C78,32 52,32 42,44" fill="none" stroke="' + PEARL_DEEP + '" stroke-opacity=".7" stroke-width="1"/>' +
      '</g>' +
      '<g class="bow-loop bow-loop-r">' +
        '<path d="M116,52c22,-28 60,-32 78,-14c16,16 6,42 -20,50c-20,6 -42,0 -58,-14z" fill="url(#mm-silk)" stroke="' + PEARL_DEEP + '" stroke-width="1"/>' +
        '<path d="M124,44c18,-12 44,-12 54,0" fill="none" stroke="' + PEARL_DEEP + '" stroke-opacity=".7" stroke-width="1"/>' +
      '</g>' +
      '<g class="bow-knot">' +
        '<path d="M96,40h28c8,8 8,20 0,28h-28c-8,-8 -8,-20 0,-28z" fill="url(#mm-silk)" stroke="' + PEARL_DEEP + '" stroke-width="1"/>' +
        '<circle cx="110" cy="54" r="4" fill="url(#mm-gold)"/>' +
      '</g>' +
    '</svg>';
  }

  /* A mogra flower: five rounded petals around a small centre. */
  function flower(size, colour) {
    var petals = '';
    for (var i = 0; i < 5; i++) {
      var a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      var cx = 12 + Math.cos(a) * 5.4, cy = 12 + Math.sin(a) * 5.4;
      petals += '<ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="5.2" ry="4.2" transform="rotate(' + f(a * 180 / Math.PI + 90) + ' ' + f(cx) + ' ' + f(cy) + ')" fill="' + (colour || '#FFFFFF') + '"/>';
    }
    return '<svg class="flower-art" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true">' +
      petals + '<circle cx="12" cy="12" r="2.4" fill="' + GOLD + '" fill-opacity=".75"/></svg>';
  }

  /* A sprig of mogra used as a divider. */
  function sprig() {
    return '<svg class="sprig-art" viewBox="0 0 160 40" aria-hidden="true">' +
      '<path d="M8,26C34,26 44,14 60,14M152,26c-26,0 -36,-12 -52,-12" fill="none" stroke="' + SAGE + '" stroke-width="1.2"/>' +
      '<path d="M30,25c-6,-6 -14,-6 -18,-2c5,5 13,6 18,2zM130,25c6,-6 14,-6 18,-2c-5,5 -13,6 -18,2z" fill="' + SAGE + '" fill-opacity=".55"/>' +
      '<g transform="translate(68,8) scale(.85)"><circle cx="12" cy="12" r="7.5" fill="#FFFFFF" stroke="' + PEARL_DEEP + '" stroke-width=".8"/><circle cx="12" cy="12" r="2.2" fill="' + GOLD + '"/></g>' +
      '<circle cx="62" cy="22" r="4.5" fill="#FFFFFF" stroke="' + PEARL_DEEP + '" stroke-width=".8"/>' +
      '<circle cx="100" cy="22" r="4.5" fill="#FFFFFF" stroke="' + PEARL_DEEP + '" stroke-width=".8"/>' +
    '</svg>';
  }

  /* The mandap: an arch of mogra flowers, each one drawn with five petals. */
  function mandapFlower(cx, cy, size, seed, colour) {
    var g = '', spin = (seed * 37) % 72;
    for (var i = 0; i < 5; i++) {
      var a = (Math.PI * 2 * i) / 5 + (spin * Math.PI) / 180;
      var px = cx + Math.cos(a) * size * 0.46, py = cy + Math.sin(a) * size * 0.46;
      g += '<ellipse cx="' + f(px) + '" cy="' + f(py) + '" rx="' + f(size * 0.46) + '" ry="' + f(size * 0.36) +
        '" transform="rotate(' + f((a * 180) / Math.PI + 90) + ' ' + f(px) + ' ' + f(py) + ')" fill="' + colour + '"/>';
    }
    return g + '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(size * 0.2) + '" fill="' + GOLD + '" fill-opacity=".65"/>';
  }
  function leaf(cx, cy, size, turn) {
    return '<path d="M0,0C' + f(size * 0.5) + ',' + f(-size * 0.4) + ' ' + f(size * 0.9) + ',' + f(-size * 0.2) + ' ' + size + ',0C' +
      f(size * 0.9) + ',' + f(size * 0.2) + ' ' + f(size * 0.5) + ',' + f(size * 0.4) + ' 0,0Z" fill="' + SAGE +
      '" fill-opacity=".5" transform="translate(' + f(cx) + ' ' + f(cy) + ') rotate(' + turn + ')"/>';
  }
  function mandap() {
    var out = '', i, a, x, y, size, seed;
    // The arch over the couple, then the two uprights.
    for (i = 0; i <= 34; i++) {
      a = Math.PI * (i / 34);
      seed = i * 3;
      x = 200 - Math.cos(a) * 152 + (((seed * 11) % 9) - 4);
      y = 250 - Math.sin(a) * 152 + (((seed * 7) % 9) - 4);
      size = 17 + ((seed * 5) % 9);
      if (i % 5 === 2) out += leaf(x - size, y, size * 0.9, ((seed * 13) % 360));
      out += mandapFlower(x, y, size, seed, i % 6 === 0 ? BLUSH : '#FFFFFF');
    }
    for (i = 0; i < 16; i++) {
      y = 258 + i * 17;
      seed = i * 5 + 1;
      size = 15 + ((seed * 3) % 8);
      out += mandapFlower(52 + (((seed * 9) % 11) - 5), y, size, seed, i % 7 === 3 ? BLUSH : '#FFFFFF');
      out += mandapFlower(348 + (((seed * 13) % 11) - 5), y, size, seed + 4, i % 7 === 5 ? BLUSH : '#FFFFFF');
      if (i % 4 === 1) { out += leaf(66, y + 6, 14, 20); out += leaf(334, y + 6, 14, 160); }
    }
    return '<svg class="mandap-art" viewBox="0 0 400 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<g class="mandap-frame" stroke="' + SAGE + '" stroke-opacity=".45" stroke-width="1.4" fill="none">' +
        '<path d="M52,250C52,168 118,102 200,102s148,66 148,148"/><path d="M52,250v270M348,250v270"/>' +
      '</g>' + out + '</svg>';
  }

  return { sprite: sprite, pearlCurtain: pearlCurtain, bow: bow, flower: flower, sprig: sprig, mandap: mandap };
})();
