/* Invite Studio motion: paper.
   Deckled paper edges as SVG paths, drawn at the real pixel size so the fibre edge stays crisp at any width.
   The edge is seeded noise at two scales (the torn fibre line and single fibres), about ±1.3 px. */
(function () {
  var M = window.Invite.motion;

  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function valueNoise(seed, step) {
    var r = rng(seed), vals = [], i;
    for (i = 0; i < 1024; i++) vals.push(r() * 2 - 1);
    return function (x) {
      var u = x / step, k = Math.floor(u), f = u - k;
      var a = vals[((k % 1024) + 1024) % 1024], b = vals[(((k + 1) % 1024) + 1024) % 1024];
      f = f * f * (3 - 2 * f);
      return a + (b - a) * f;
    };
  }
  function deckle(seed) {
    var coarse = valueNoise(seed, 11), fine = valueNoise(seed + 7, 2.7);
    return function (x) { return coarse(x) * 0.85 + fine(x) * 0.5; };
  }
  function f2(n) { return Math.round(n * 100) / 100; }

  M.paper = {
    /* A sheet with deckled top and left edges (and right, when `deckleRight`) and softened corners; the bottom,
       and otherwise the right, run off-screen straight. */
    sheet: function (x, y, right, bottom, seed, deckleRight) {
      var top = deckle(seed), left = deckle(seed + 101), side = deckle(seed + 211), step = 3, r = 3, d = [], i;
      d.push('M' + f2(x + r) + ',' + f2(y + top(x + r)));
      for (i = x + r + step; i < (deckleRight ? right - r : right); i += step) d.push('L' + i + ',' + f2(y + top(i)));
      if (deckleRight) {
        d.push('Q' + right + ',' + y + ' ' + f2(right + side(y + r)) + ',' + (y + r));
        for (i = y + r + step; i < bottom; i += step) d.push('L' + f2(right + side(i)) + ',' + i);
        d.push('L' + f2(right + side(bottom)) + ',' + bottom);
      } else {
        d.push('L' + right + ',' + f2(y + top(right)), 'L' + right + ',' + bottom);
      }
      d.push('L' + f2(x + left(bottom)) + ',' + bottom);
      for (i = bottom - step; i > y + r; i -= step) d.push('L' + f2(x + left(i)) + ',' + i);
      d.push('Q' + x + ',' + y + ' ' + f2(x + r) + ',' + f2(y + top(x + r)), 'Z');
      return d.join('');
    },
    /* The lit rim of the same sheet: its left and top edges (light comes from the top left). */
    rim: function (x, y, right, bottom, seed, deckleRight) {
      var top = deckle(seed), left = deckle(seed + 101), step = 3, r = 3, d = [], i;
      d.push('M' + f2(x + left(bottom) + 0.6) + ',' + bottom);
      for (i = bottom - step; i > y + r; i -= step) d.push('L' + f2(x + left(i) + 0.6) + ',' + i);
      d.push('Q' + (x + 0.6) + ',' + (y + 0.6) + ' ' + f2(x + r) + ',' + f2(y + top(x + r) + 0.6));
      for (i = x + r + step; i < (deckleRight ? right - r : right); i += step) d.push('L' + i + ',' + f2(y + top(i) + 0.6));
      return d.join('');
    },
    /* Depth of a drawn sheet's top edge at x, below its held corner. The thread holds the left corner, so the free
       side lags by up to `lead` px. */
    edgeAt: function (x, width, lead) { return lead * Math.pow(Math.max(0, x) / width, 1.1); },
    /* That top edge as SVG paths, in a box whose y = offset is the sheet's top and which extends `band` px down;
       the fill runs 2 px past the band so it overlaps the sheet's body. */
    edge: function (width, lead, offset, band, seed) {
      var noise = deckle(seed), step = 4, pts = [], i, y;
      for (i = -4; i <= width + 4; i += step) {
        y = offset + M.paper.edgeAt(i, width, lead) + noise(i) * 0.9;
        pts.push(f2(i) + ',' + f2(Math.min(y, offset + band)));
      }
      var line = 'M' + pts.join('L');
      var bottom = offset + band + 2;
      return { fill: line + 'L' + (width + 4) + ',' + bottom + 'L-4,' + bottom + 'Z', line: line };
    }
  };
})();
