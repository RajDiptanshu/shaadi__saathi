/* Haveli Jharokha artwork, drawn in SVG: the cusped Rajput arch, carved shutters with mirror-work,
   the sandstone window frame, the palace at dusk on the lake, and paper kites. */
window.HaveliArt = (function () {
  var GOLD = '#C9A13E', GOLD_LIGHT = '#EBCB7A', TEAL = '#1F6F6B', TEAL_DEEP = '#134744', STONE = '#C98F5E', STONE_DEEP = '#8A5A3B';
  function r1(n) { return Math.round(n * 10) / 10; }

  /* A cusped (multifoil) arch across width w, springing at springY.
     round sets how pointed it is; lobes is the number of lobes on each side; depth is how far the cusps reach in. */
  function archSide(w, springY, opts) {
    var r = w * (opts.round || 0.75);
    var lobes = opts.lobes || 4, depth = opts.depth || 0, n = opts.samples || 90;
    var apexY = springY - Math.sqrt(r * r - Math.pow(w / 2 - r, 2));
    var end = Math.atan2(apexY - springY, w / 2 - r);
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var k = i / n;
      var a = -Math.PI + (end + Math.PI) * k;
      // Shifted by a quarter turn so a lobe, not a cusp, sits at the springing line: the arch
      // starts exactly at the card's edge, and the cusp lands at the apex.
      var off = depth * (1 - Math.abs(Math.sin(lobes * Math.PI * k + Math.PI / 2)));
      var x = r + r * Math.cos(a) - off * Math.cos(a);
      var y = springY + r * Math.sin(a) - off * Math.sin(a);
      pts.push([x, y]);
    }
    return pts;
  }
  function archPath(w, springY, bottom, opts, dx, dy) {
    dx = dx || 0; dy = dy || 0;
    var left = archSide(w, springY, opts);
    var right = left.slice().reverse().map(function (p) { return [w - p[0], p[1]]; });
    var pts = left.concat(right.slice(1));
    var d = 'M' + r1(dx) + ',' + r1(bottom + dy);
    pts.forEach(function (p) { d += 'L' + r1(p[0] + dx) + ',' + r1(p[1] + dy); });
    return d + 'L' + r1(w + dx) + ',' + r1(bottom + dy) + 'Z';
  }
  /* The arch alone, open at the bottom, for outlines. */
  function archLine(w, springY, bottom, opts, dx, dy) {
    return archPath(w, springY, bottom, opts, dx, dy).replace(/Z$/, '');
  }

  /* Opening geometry shared by the frame and shutters. */
  var W = 320, SPRING = 250, BOTTOM = 560;
  var OPEN = { round: 0.72, lobes: 3.5, depth: 11 };

  function mirrors(x, y, cols, rows, gap) {
    var s = '';
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        var cx = x + i * gap + (j % 2 ? gap / 2 : 0), cy = y + j * gap;
        s += '<g class="mirror" style="--m:' + ((i * 7 + j * 3) % 11) + '">' +
          '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="4.2" fill="' + GOLD + '"/>' +
          '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="2.8" fill="#DCE6EA"/>' +
          '<circle class="glint" cx="' + r1(cx - 0.9) + '" cy="' + r1(cy - 0.9) + '" r="1" fill="#fff"/></g>';
      }
    }
    return s;
  }
  function panel(x, y, w, h) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="' + TEAL_DEEP + '" stroke="' + GOLD + '" stroke-width="2"/>' +
      '<rect x="' + (x + 7) + '" y="' + (y + 7) + '" width="' + (w - 14) + '" height="' + (h - 14) + '" rx="2" fill="none" stroke="' + GOLD + '" stroke-opacity=".45" stroke-width="1"/>';
  }

  /* Hidden sprite: gradients, patterns, the opening clip and the full shutter artwork.
     Each shutter shows its half of #hj-shutters through its viewBox. */
  function sprite() {
    var inner = archPath(W - 36, SPRING + 4, BOTTOM, { round: 0.72, lobes: 3.5, depth: 9 }, 18, 18);
    return '<svg class="sprite" aria-hidden="true" focusable="false"><defs>' +
      '<linearGradient id="hj-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#23807A"/><stop offset=".55" stop-color="' + TEAL + '"/><stop offset="1" stop-color="#15504C"/></linearGradient>' +
      '<linearGradient id="hj-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6DE9C"/><stop offset=".45" stop-color="' + GOLD + '"/><stop offset="1" stop-color="#8F6A1F"/></linearGradient>' +
      '<pattern id="hj-jaali" width="22" height="22" patternUnits="userSpaceOnUse">' +
        '<path d="M11 0L22 11L11 22L0 11Z" fill="none" stroke="' + GOLD + '" stroke-opacity=".7" stroke-width="1.3"/>' +
        '<circle cx="11" cy="11" r="3" fill="none" stroke="' + GOLD_LIGHT + '" stroke-opacity=".55" stroke-width="1"/>' +
        '<circle cx="0" cy="0" r="1.6" fill="' + GOLD_LIGHT + '"/><circle cx="22" cy="22" r="1.6" fill="' + GOLD_LIGHT + '"/>' +
      '</pattern>' +
      '<clipPath id="hj-open"><path d="' + archPath(W, SPRING, BOTTOM, OPEN) + '"/></clipPath>' +
      '<clipPath id="hj-inner"><path d="' + inner + '"/></clipPath>' +
    '</defs></svg>';
  }

  /* Both shutters carry the full artwork inline (so the mirrors can twinkle); each viewBox shows one half. */
  var shutterMarkup = null;
  function shutterArt() {
    if (shutterMarkup) return shutterMarkup;
    var inner = archPath(W - 36, SPRING + 4, BOTTOM, { round: 0.72, lobes: 3.5, depth: 9 }, 18, 18);
    shutterMarkup =
        '<g clip-path="url(#hj-open)">' +
          '<rect width="' + W + '" height="' + BOTTOM + '" fill="url(#hj-wood)"/>' +
          '<g clip-path="url(#hj-inner)"><rect width="' + W + '" height="310" fill="url(#hj-jaali)"/></g>' +
          '<path d="' + inner + '" fill="none" stroke="' + GOLD + '" stroke-width="2"/>' +
          '<path d="' + archPath(W, SPRING, BOTTOM, OPEN) + '" fill="none" stroke="url(#hj-gold)" stroke-width="16"/>' +
          '<rect x="18" y="310" width="284" height="3" fill="' + GOLD + '"/>' +
          panel(30, 330, 112, 96) + panel(178, 330, 112, 96) +
          panel(30, 438, 112, 104) + panel(178, 438, 112, 104) +
          mirrors(48, 350, 5, 4, 19) + mirrors(196, 350, 5, 4, 19) +
          mirrors(48, 460, 5, 4, 19) + mirrors(196, 460, 5, 4, 19) +
          '<rect x="157" y="0" width="6" height="' + BOTTOM + '" fill="#0F3A37"/>' +
          '<rect x="159" y="0" width="2" height="' + BOTTOM + '" fill="' + GOLD + '" fill-opacity=".8"/>' +
          '<circle cx="146" cy="392" r="9" fill="none" stroke="url(#hj-gold)" stroke-width="3"/>' +
          '<circle cx="174" cy="392" r="9" fill="none" stroke="url(#hj-gold)" stroke-width="3"/>' +
        '</g>';
    return shutterMarkup;
  }

  function shutter(side) {
    var vb = side === 'l' ? '0 0 160 ' + BOTTOM : '160 0 160 ' + BOTTOM;
    return '<svg class="shutter-art" viewBox="' + vb + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' + shutterArt() + '</svg>';
  }

  /* The carved sandstone wall around the opening: pillars, an eave with brackets, a lotus finial. */
  function frame() {
    var hole = archPath(W, SPRING, BOTTOM, OPEN);
    // The wall reaches far past the viewBox so it fills any screen shape around the window.
    var wall = 'M-1500,-2000H1820V1500H-1500Z';
    var brackets = '';
    for (var i = 0; i < 7; i++) {
      var bx = -34 + i * 64.6;
      brackets += '<path d="M' + r1(bx) + ',-46c0,14 8,22 20,22c-4,-8 -4,-14 0,-22z" fill="' + STONE_DEEP + '"/>';
    }
    return '<svg class="frame-art" viewBox="-80 -110 480 700" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
      '<path d="' + wall + hole + '" fill-rule="evenodd" fill="' + STONE + '"/>' +
      '<path d="' + archLine(W + 44, SPRING - 4, BOTTOM, { round: 0.72, lobes: 3.5, depth: 13 }, -22, -22) + '" fill="none" stroke="' + STONE_DEEP + '" stroke-width="3"/>' +
      '<path d="' + archLine(W + 20, SPRING - 2, BOTTOM, { round: 0.72, lobes: 3.5, depth: 12 }, -10, -10) + '" fill="none" stroke="' + GOLD + '" stroke-width="2.2"/>' +
      '<path d="' + archLine(W, SPRING, BOTTOM, OPEN) + '" fill="none" stroke="#6E4329" stroke-width="5"/>' +
      '<rect x="-60" y="-66" width="440" height="20" rx="3" fill="' + STONE_DEEP + '"/>' +
      '<rect x="-68" y="-84" width="456" height="20" rx="4" fill="#A86F48"/>' +
      '<path d="M-68,-84 Q160,-116 388,-84" fill="#A86F48"/>' +
      brackets +
      '<g transform="translate(160,-100)"><path d="M0,-18c5,6 5,12 0,18c-5,-6 -5,-12 0,-18z" fill="' + GOLD + '"/>' +
        '<path d="M0,0c-6,-4 -13,-4 -18,-1c6,4 12,4 18,1zM0,0c6,-4 13,-4 18,-1c-6,4 -12,4 -18,1z" fill="' + GOLD + '"/></g>' +
      '<rect x="-54" y="170" width="30" height="400" fill="#B97E52"/><rect x="344" y="170" width="30" height="400" fill="#B97E52"/>' +
      '<rect x="-60" y="160" width="42" height="14" rx="2" fill="' + STONE_DEEP + '"/><rect x="338" y="160" width="42" height="14" rx="2" fill="' + STONE_DEEP + '"/>' +
      '<path d="M-39,190V560M359,190V560" stroke="' + STONE_DEEP + '" stroke-width="2" stroke-dasharray="2 10"/>' +
      '<rect x="-80" y="' + BOTTOM + '" width="480" height="30" fill="#A86F48"/>' +
      '<rect x="-80" y="' + (BOTTOM - 4) + '" width="480" height="6" fill="' + GOLD + '" fill-opacity=".7"/>' +
    '</svg>';
  }

  /* The palace at dusk. Windows glow gold; the lake holds a faint reflection. */
  function palace() {
    var INK = '#2A2346';
    var s = '';
    function block(x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + INK + '"/>'; }
    function merlons(x1, x2, y) {
      var m = '';
      for (var x = x1; x < x2 - 4; x += 9) m += '<rect x="' + x + '" y="' + (y - 5) + '" width="5" height="5" fill="' + INK + '"/>';
      return m;
    }
    function dome(cx, baseY, half, tall) {
      return '<path d="M' + (cx - half) + ',' + baseY + 'C' + (cx - half * 1.25) + ',' + r1(baseY - tall * 0.35) + ' ' + r1(cx - half * 0.55) + ',' + r1(baseY - tall * 0.7) + ' ' + cx + ',' + (baseY - tall) +
        'C' + r1(cx + half * 0.55) + ',' + r1(baseY - tall * 0.7) + ' ' + (cx + half * 1.25) + ',' + r1(baseY - tall * 0.35) + ' ' + (cx + half) + ',' + baseY + 'Z" fill="' + INK + '"/>' +
        '<rect x="' + (cx - 0.8) + '" y="' + (baseY - tall - 7) + '" width="1.6" height="7" fill="' + INK + '"/>';
    }
    function chhatri(cx, baseY, size) {
      var w = size * 2;
      return '<rect x="' + (cx - size - 2) + '" y="' + (baseY - 3) + '" width="' + (w + 4) + '" height="3" fill="' + INK + '"/>' +
        '<rect x="' + (cx - size) + '" y="' + (baseY - size * 1.1) + '" width="2" height="' + r1(size * 1.1) + '" fill="' + INK + '"/>' +
        '<rect x="' + (cx + size - 2) + '" y="' + (baseY - size * 1.1) + '" width="2" height="' + r1(size * 1.1) + '" fill="' + INK + '"/>' +
        '<rect x="' + (cx - size - 3) + '" y="' + r1(baseY - size * 1.1 - 3) + '" width="' + (w + 6) + '" height="3" fill="' + INK + '"/>' +
        dome(cx, r1(baseY - size * 1.1 - 3), size * 0.9, size * 1.2);
    }
    function windows(x, y, cols, rows, gapX, gapY, w, h) {
      var out = '';
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          var lit = ((i * 5 + j * 3 + x) % 4) !== 0;
          var wx = x + i * gapX, wy = y + j * gapY;
          out += '<path class="' + (lit ? 'win' : 'win-dark') + '" style="--w:' + ((i * 3 + j * 7) % 9) + '" d="M' + wx + ',' + (wy + h) + 'V' + (wy + w / 2) + 'a' + (w / 2) + ',' + (w / 2) + ' 0 0 1 ' + w + ',0V' + (wy + h) + 'Z"/>';
        }
      }
      return out;
    }
    s += '<path d="M0,196 C40,176 70,186 104,172 C140,158 170,170 204,160 C250,148 300,170 340,158 C366,150 386,160 400,156 V262 H0Z" fill="#5A4E84" fill-opacity=".55"/>';
    s += block(34, 176, 60, 86) + merlons(34, 94, 176) + chhatri(64, 176, 9);
    s += block(306, 176, 60, 86) + merlons(306, 366, 176) + chhatri(336, 176, 9);
    s += block(90, 124, 42, 138) + merlons(90, 132, 124) + chhatri(111, 124, 12);
    s += block(268, 124, 42, 138) + merlons(268, 310, 124) + chhatri(289, 124, 12);
    s += block(132, 142, 136, 120) + merlons(132, 268, 142);
    s += '<rect x="150" y="104" width="100" height="40" fill="' + INK + '"/>' + dome(200, 106, 34, 58);
    s += chhatri(160, 104, 8) + chhatri(240, 104, 8);
    s += '<rect x="176" y="176" width="48" height="10" fill="' + INK + '"/><rect x="172" y="186" width="56" height="3" fill="' + INK + '"/>';
    s += windows(44, 196, 4, 3, 12, 20, 6, 12) + windows(316, 196, 4, 3, 12, 20, 6, 12);
    s += windows(99, 140, 3, 5, 10, 22, 6, 13) + windows(277, 140, 3, 5, 10, 22, 6, 13);
    s += windows(142, 156, 11, 1, 11.6, 0, 7, 14) + windows(146, 196, 10, 3, 11.6, 20, 7, 13);
    s += windows(160, 118, 8, 1, 10.6, 0, 6, 12);
    s += '<rect x="0" y="260" width="400" height="3" fill="' + INK + '"/>';

    return '<svg class="palace-art" viewBox="0 0 400 340" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<defs><linearGradient id="hj-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6F5C8C"/><stop offset="1" stop-color="#2B2E5A"/></linearGradient>' +
      '<linearGradient id="hj-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<mask id="hj-reflect"><rect x="0" y="262" width="400" height="78" fill="url(#hj-fade)"/></mask></defs>' +
      '<g class="palace">' + s + '</g>' +
      '<rect x="0" y="262" width="400" height="78" fill="url(#hj-lake)"/>' +
      '<g mask="url(#hj-reflect)"><g class="reflection" transform="translate(0,524) scale(1,-1)">' + s + '</g></g>' +
      '<g class="ripples" stroke="#F3D59A" stroke-opacity=".35" stroke-width="1" stroke-linecap="round">' +
        '<path d="M120,278h40M210,284h56M70,296h30M250,300h44M150,312h60M40,322h26M300,318h34"/></g>' +
    '</svg>';
  }

  /* A paper kite (patang) with its tail. */
  function kite(colour, accent) {
    return '<svg class="kite-art" viewBox="-30 -36 60 110" aria-hidden="true">' +
      '<path d="M0,-32L24,0L0,34L-24,0Z" fill="' + colour + '"/>' +
      '<path d="M0,-32L0,34M-24,0L24,0" stroke="' + accent + '" stroke-width="1.4"/>' +
      '<path d="M0,-32L24,0L0,0Z" fill="#fff" fill-opacity=".18"/>' +
      '<path class="kite-tail" d="M0,34c-6,8 6,14 0,22c-6,8 6,14 0,18" fill="none" stroke="' + accent + '" stroke-width="1.6"/>' +
      '<path d="M-5,48l5,4l5,-4l-5,-4z" fill="' + accent + '"/>' +
    '</svg>';
  }

  return { sprite: sprite, shutter: shutter, frame: frame, palace: palace, kite: kite, archPath: archPath, archLine: archLine };
})();
