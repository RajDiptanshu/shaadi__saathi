/* Rang Mela artwork: paper bunting, a marigold garland, a doodled couple, a rangoli
   and the gulal smudges that cover the scratch card. */
window.MelaArt = (function () {
  var YELLOW = '#F4C21B', PINK = '#E4508A', GREEN = '#5E7A2E', BLUE = '#6EC3E0', INK = '#3B2B22', CREAM = '#FFF7E6';
  function f(n) { return Math.round(n * 10) / 10; }

  function sprite() {
    return '<svg class="sprite" aria-hidden="true" focusable="false"><defs>' +
      '<linearGradient id="rm-sun" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#FFE9A8"/><stop offset="1" stop-color="' + YELLOW + '"/>' +
      '</linearGradient>' +
    '</defs></svg>';
  }

  /* Paper bunting across the top of a section. */
  function bunting(flags) {
    flags = flags || 12;
    var w = 480, step = w / flags, out = '';
    var colours = [YELLOW, PINK, GREEN, BLUE, '#E87A2B'];
    for (var i = 0; i < flags; i++) {
      var x = i * step;
      out += '<g class="flag" style="--i:' + i + '">' +
        '<path d="M' + f(x) + ',10 L' + f(x + step) + ',10 L' + f(x + step / 2) + ',' + f(34 + (i % 3) * 5) + 'Z" fill="' + colours[i % colours.length] + '"/>' +
        '</g>';
    }
    return '<svg class="bunting-art" viewBox="0 0 ' + w + ' 48" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0,10 Q' + (w / 2) + ',24 ' + w + ',10" fill="none" stroke="' + INK + '" stroke-opacity=".45" stroke-width="1.5"/>' +
      out + '</svg>';
  }

  /* A marigold, drawn as two rings of petals. */
  function marigold(size, colour) {
    var out = '', i, a;
    for (i = 0; i < 12; i++) {
      a = (Math.PI * 2 * i) / 12;
      out += '<ellipse cx="' + f(24 + Math.cos(a) * 9) + '" cy="' + f(24 + Math.sin(a) * 9) + '" rx="6.5" ry="5" fill="' + colour + '" fill-opacity=".9"/>';
    }
    for (i = 0; i < 8; i++) {
      a = (Math.PI * 2 * i) / 8 + 0.3;
      out += '<ellipse cx="' + f(24 + Math.cos(a) * 4.5) + '" cy="' + f(24 + Math.sin(a) * 4.5) + '" rx="5" ry="4" fill="' + colour + '"/>';
    }
    return '<svg class="marigold-art" width="' + size + '" height="' + size + '" viewBox="0 0 48 48" aria-hidden="true">' +
      out + '<circle cx="24" cy="24" r="3.4" fill="#C25A0E"/></svg>';
  }

  /* A garland of marigolds looping across a section. */
  function garland(count) {
    count = count || 14;
    var w = 480, out = '';
    for (var i = 0; i < count; i++) {
      var t = i / (count - 1);
      var x = t * w;
      var y = 12 + Math.sin(t * Math.PI) * 26;
      var r = 9 + ((i * 7) % 4);
      out += '<g transform="translate(' + f(x - r) + ' ' + f(y - r) + ') scale(' + f((r * 2) / 48) + ')">' +
        '<circle cx="24" cy="24" r="20" fill="' + (i % 4 === 1 ? '#E87A2B' : YELLOW) + '"/>' +
        '<circle cx="24" cy="24" r="12" fill="#F6D65C" fill-opacity=".85"/>' +
        '<circle cx="24" cy="24" r="4" fill="#C25A0E"/></g>';
    }
    return '<svg class="garland-art" viewBox="0 0 ' + w + ' 56" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0,12 Q' + (w / 2) + ',44 ' + w + ',12" fill="none" stroke="' + GREEN + '" stroke-width="2"/>' + out + '</svg>';
  }

  /* The couple, doodled: her lehenga, his kurta, both mid-laugh. */
  function couple() {
    return '<svg class="couple-art" viewBox="0 0 240 260" aria-hidden="true">' +
      '<g fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
        // Her
        '<path d="M86,96c-14,6 -22,20 -24,36l-10,72c26,10 54,10 80,0l-12,-74c-2,-16 -10,-28 -22,-34z" fill="' + PINK + '" fill-opacity=".85"/>' +
        '<circle cx="98" cy="72" r="21" fill="#F6D2B8"/>' +
        '<path d="M78,66c2,-16 14,-24 24,-24c12,0 20,10 18,24c-2,-8 -8,-12 -18,-12c-10,0 -18,4 -24,12z" fill="' + INK + '"/>' +
        '<path d="M120,74c8,4 10,14 4,20" />' +
        // Him
        '<path d="M150,98c-12,6 -18,18 -18,32v70c20,8 42,8 60,0v-70c0,-14 -8,-26 -20,-32z" fill="' + BLUE + '" fill-opacity=".8"/>' +
        '<circle cx="162" cy="74" r="20" fill="#EFC3A4"/>' +
        '<path d="M143,70c4,-14 14,-20 24,-20c10,0 16,8 16,18c-6,-6 -14,-8 -22,-6c-8,2 -14,6 -18,8z" fill="' + INK + '"/>' +
        // Hands held
        '<path d="M124,150c8,6 16,6 22,0" />' +
        '<path d="M60,214c40,12 84,12 124,0" stroke-opacity=".35"/>' +
      '</g>' +
      '<g fill="' + YELLOW + '"><circle cx="46" cy="60" r="5"/><circle cx="206" cy="48" r="4"/><circle cx="214" cy="120" r="5"/><circle cx="34" cy="140" r="4"/></g>' +
      '<g fill="' + PINK + '"><circle cx="30" cy="92" r="4"/><circle cx="196" cy="86" r="3.5"/></g>' +
    '</svg>';
  }

  /* A rangoli of dots and petals for section breaks. */
  function rangoli() {
    var out = '', i, a;
    for (i = 0; i < 8; i++) {
      a = (Math.PI * 2 * i) / 8;
      out += '<ellipse cx="' + f(40 + Math.cos(a) * 20) + '" cy="' + f(40 + Math.sin(a) * 20) + '" rx="9" ry="6" transform="rotate(' + f((a * 180) / Math.PI) + ' ' + f(40 + Math.cos(a) * 20) + ' ' + f(40 + Math.sin(a) * 20) + ')" fill="' + (i % 2 ? PINK : YELLOW) + '" fill-opacity=".9"/>';
      out += '<circle cx="' + f(40 + Math.cos(a + 0.39) * 32) + '" cy="' + f(40 + Math.sin(a + 0.39) * 32) + '" r="3" fill="' + GREEN + '"/>';
    }
    return '<svg class="rangoli-art" viewBox="0 0 80 80" aria-hidden="true">' + out +
      '<circle cx="40" cy="40" r="8" fill="' + BLUE + '"/><circle cx="40" cy="40" r="3.5" fill="' + CREAM + '"/></svg>';
  }

  /* Loose gulal smudges, scattered behind the scratch card. */
  function gulal(seed) {
    var out = '', colours = [PINK, YELLOW, BLUE, GREEN, '#E87A2B'];
    for (var i = 0; i < 7; i++) {
      var n = (seed || 1) * (i + 3);
      var cx = 20 + ((n * 37) % 280);
      var cy = 16 + ((n * 53) % 110);
      var r = 18 + ((n * 11) % 26);
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + colours[i % colours.length] + '" fill-opacity="' + (0.1 + ((n % 3) * 0.05)).toFixed(2) + '"/>';
    }
    return '<svg class="gulal-art" viewBox="0 0 320 140" preserveAspectRatio="none" aria-hidden="true">' + out + '</svg>';
  }

  return { sprite: sprite, bunting: bunting, marigold: marigold, garland: garland, couple: couple, rangoli: rangoli, gulal: gulal };
})();
