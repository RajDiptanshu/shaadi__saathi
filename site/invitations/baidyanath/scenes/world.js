/* Emerald & Rose Gold · painted worlds.

   Every full-bleed background on this page is built here as a stack of SVG layers, each tagged with a
   depth. scenes/stage.js slides each layer by its own depth as the page scrolls, so a background has
   real cardboard-theatre depth instead of being a flat image that moves as one piece.

   Two consequences worth stating: the whole art direction costs bytes of code rather than megabytes of
   image, which is what keeps a page with four full-bleed scenes inside the phone budget; and every
   colour is a value here, so the same geometry can be repainted between scenes without redrawing it.

   The authoring box is portrait, 1000 × 1500, because a phone is what this is opened on. `slice` then
   covers whatever the screen is:

     phone  375 × 812   the whole height, and x from about 186 to 814
     laptop 1200 × 900  the whole width, and the bottom two-thirds

   So everything that matters is composed inside x 200 → 800. A square box was tried first and put the
   framing of every scene off the sides of every phone.

   Nothing here knows the couple's details. It returns scenery. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var World = window.World = {};

  var VBW = 1000, VBH = 1500;

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    return node;
  }
  World.el = el;

  /* Deterministic noise, so a background looks identical on every load and every device. A marble vein
     that reshuffles itself between a scroll and a screenshot is not a material. */
  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  World.rng = rng;
  function f1(n) { return Math.round(n * 10) / 10; }

  /* ---- colour ------------------------------------------------------------------------------------- */

  function hex(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function toHex(c) {
    return '#' + c.map(function (v) {
      var s = Math.max(0, Math.min(255, Math.round(v))).toString(16);
      return s.length < 2 ? '0' + s : s;
    }).join('');
  }
  /* Aerial perspective: anything far away drifts toward the colour of the air in front of it. On a dark
     ground this is what stops the back layers reading as black holes. */
  function haze(colour, air, amount) {
    var a = hex(colour), b = hex(air);
    return toHex([0, 1, 2].map(function (i) { return a[i] + (b[i] - a[i]) * amount; }));
  }
  World.haze = haze;

  /* ---- gradients ---------------------------------------------------------------------------------- */

  var uid = 0;
  function gradient(defs, stops, angle) {
    var id = 'w' + (++uid);
    var a = (angle == null ? 90 : angle) * Math.PI / 180;
    var g = el('linearGradient', {
      id: id,
      x1: f1(0.5 - Math.cos(a) * 0.5), y1: f1(0.5 - Math.sin(a) * 0.5),
      x2: f1(0.5 + Math.cos(a) * 0.5), y2: f1(0.5 + Math.sin(a) * 0.5)
    });
    stops.forEach(function (s) {
      g.appendChild(el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }));
    });
    defs.appendChild(g);
    return 'url(#' + id + ')';
  }
  function radial(defs, stops, cx, cy, r) {
    var id = 'w' + (++uid);
    var g = el('radialGradient', { id: id, cx: cx == null ? 0.5 : cx, cy: cy == null ? 0.5 : cy, r: r == null ? 0.5 : r });
    stops.forEach(function (s) {
      g.appendChild(el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }));
    });
    defs.appendChild(g);
    return 'url(#' + id + ')';
  }

  /* ---- primitives --------------------------------------------------------------------------------- */

  /* A band of sheen running across the frame — the highlight on a fold of silk. Returned as a path so
     it can be filled with a gradient that fades at both ends. */
  function sheen(y, height, lean) {
    var l = lean == null ? 180 : lean;
    return 'M-60,' + f1(y) +
      ' C' + f1(VBW * 0.3) + ',' + f1(y - height * 0.5) + ' ' + f1(VBW * 0.7) + ',' + f1(y + height * 0.4) + ' ' + (VBW + 60) + ',' + f1(y - l) +
      ' L' + (VBW + 60) + ',' + f1(y - l + height) +
      ' C' + f1(VBW * 0.7) + ',' + f1(y + height * 1.4) + ' ' + f1(VBW * 0.3) + ',' + f1(y + height * 0.5) + ' -60,' + f1(y + height) + ' Z';
  }
  World.sheen = sheen;

  /* A marble vein: a wandering line that thins and forks. Drawn as a stroke, with a couple of hairline
     children so it reads as a seam rather than a wire. */
  function vein(parent, x0, y0, x1, y1, seed, cls) {
    var r = rng(seed), g = el('g', { class: cls || 'vein' });
    var steps = 9, d = ['M' + f1(x0) + ',' + f1(y0)];
    var px = x0, py = y0;
    for (var i = 1; i <= steps; i++) {
      var t = i / steps;
      var nx = x0 + (x1 - x0) * t + (r() - 0.5) * 150;
      var ny = y0 + (y1 - y0) * t + (r() - 0.5) * 90;
      d.push('Q' + f1(px + (nx - px) * 0.5 + (r() - 0.5) * 90) + ',' + f1(py + (ny - py) * 0.5 + (r() - 0.5) * 60) + ' ' + f1(nx) + ',' + f1(ny));
      px = nx; py = ny;

      /* A fork every few steps, short and thinner than its parent. */
      if (i % 3 === 0) {
        var fx = nx + (r() - 0.5) * 220, fy = ny + (r() - 0.5) * 160;
        g.appendChild(el('path', {
          class: 'vein-branch',
          d: 'M' + f1(nx) + ',' + f1(ny) + ' Q' + f1((nx + fx) / 2 + 40) + ',' + f1((ny + fy) / 2) + ' ' + f1(fx) + ',' + f1(fy),
          fill: 'none'
        }));
      }
    }
    /* The same line is drawn three times: a wide, very faint halo, then the seam, then a bright core.
       A single stroke reads as a wire or a scratch however thin it is — what makes a vein read as being
       *inside* the stone is the soft bleed of colour on either side of it. */
    var path = d.join(' ');
    g.appendChild(el('path', { class: 'vein-halo', d: path, fill: 'none' }));
    g.appendChild(el('path', { class: 'vein-main', d: path, fill: 'none' }));
    g.appendChild(el('path', { class: 'vein-core', d: path, fill: 'none' }));
    parent.appendChild(g);
    return g;
  }
  World.vein = vein;

  /* A large tropical frond, the kind a wedding backdrop is built out of. Drawn about the origin,
     pointing along +x: a midrib with paired leaflets that shorten toward the tip. */
  function frond(parent, len, spread, seed, cls) {
    var r = rng(seed), g = el('g', { class: cls || 'frond' });
    g.appendChild(el('path', {
      class: 'frond-rib',
      d: 'M0,0 Q' + f1(len * 0.5) + ',' + f1(-spread * 0.18) + ' ' + f1(len) + ',' + f1(-spread * 0.1),
      fill: 'none'
    }));
    var n = 13;
    for (var i = 1; i <= n; i++) {
      var t = i / (n + 1);
      var bx = len * t, by = -spread * 0.18 * (2 * t * (1 - t)) * 2;
      var L = spread * (0.55 + 0.45 * Math.sin(Math.PI * t)) * (0.85 + r() * 0.3);
      [-1, 1].forEach(function (dir) {
        g.appendChild(el('path', {
          class: 'frond-blade',
          d: 'M' + f1(bx) + ',' + f1(by) +
             ' C' + f1(bx + L * 0.30) + ',' + f1(by + dir * L * 0.42) +
             ' ' + f1(bx + L * 0.62) + ',' + f1(by + dir * L * 0.86) +
             ' ' + f1(bx + L * 0.46) + ',' + f1(by + dir * L * 1.06) +
             ' C' + f1(bx + L * 0.26) + ',' + f1(by + dir * L * 0.78) +
             ' ' + f1(bx + L * 0.10) + ',' + f1(by + dir * L * 0.36) +
             ' ' + f1(bx) + ',' + f1(by) + ' Z'
        }));
      });
    }
    parent.appendChild(g);
    return g;
  }
  World.frond = frond;

  /* A single broad leaf — the monstera-ish shape used at the very front of the garden. */
  function broadLeaf(parent, len, wide, cls) {
    var g = el('g', { class: cls || 'broad' });
    g.appendChild(el('path', {
      class: 'broad-blade',
      d: 'M0,0 C' + f1(len * 0.20) + ',' + f1(-wide) + ' ' + f1(len * 0.72) + ',' + f1(-wide * 0.92) + ' ' + f1(len) + ',' + f1(-wide * 0.10) +
         ' C' + f1(len * 0.74) + ',' + f1(wide * 0.86) + ' ' + f1(len * 0.22) + ',' + f1(wide) + ' 0,0 Z'
    }));
    for (var i = 1; i <= 5; i++) {
      var t = i / 6;
      g.appendChild(el('path', {
        class: 'broad-rib',
        d: 'M' + f1(len * t * 0.5) + ',0 L' + f1(len * t) + ',' + f1(-wide * 0.72 * (1 - t * 0.5)),
        fill: 'none'
      }));
      g.appendChild(el('path', {
        class: 'broad-rib',
        d: 'M' + f1(len * t * 0.5) + ',0 L' + f1(len * t) + ',' + f1(wide * 0.72 * (1 - t * 0.5)),
        fill: 'none'
      }));
    }
    parent.appendChild(g);
    return g;
  }
  World.broadLeaf = broadLeaf;

  /* ---- assembly ----------------------------------------------------------------------------------- */

  /* Builds one world into `mount`. Each layer becomes its own <svg> stacked over the last, tagged with
     the depth that stage.js reads. Separate SVGs rather than one: a layer can then be translated on the
     compositor without the browser re-rasterising the whole scene.

     A layer is { depth, build(g, defs, ctx) }, where depth 0 is the far sky and 1 is at the reader's
     nose. `fit` overrides how that layer covers the frame. */
  World.build = function (mount, world) {
    if (!mount || !world) return null;
    mount.textContent = '';
    mount.classList.add('world', 'world--' + world.name);

    var built = [];
    world.layers.forEach(function (layer, index) {
      var svg = el('svg', {
        class: 'world-layer',
        viewBox: '0 0 ' + VBW + ' ' + VBH,
        preserveAspectRatio: layer.fit || 'xMidYMax slice',
        'aria-hidden': 'true',
        focusable: 'false'
      });
      svg.style.zIndex = String(index);
      svg.setAttribute('data-depth', layer.depth);
      if (layer.cls) svg.setAttribute('data-role', layer.cls);

      var defs = el('defs', {});
      svg.appendChild(defs);
      var g = el('g', { class: 'world-layer-art' });
      svg.appendChild(g);

      /* Rules written into an inline <style> apply to the whole document, not to the SVG they sit in.
         Four worlds that each paint `.frond-blade` would otherwise collide and the last one in the DOM
         would win. Every selector is therefore scoped to this layer's own id before it is written. */
      var layerId = 'wl' + (++uid);
      svg.setAttribute('id', layerId);
      function css(rules) {
        var scoped = rules.replace(/(^|\})\s*([^{}@]+)\{/g, function (all, close, selector) {
          var parts = selector.split(',').map(function (s) { return '#' + layerId + ' ' + s.trim(); });
          return (close || '') + parts.join(',') + '{';
        });
        var style = el('style', {});
        style.textContent = scoped;
        defs.appendChild(style);
      }

      layer.build(g, defs, {
        VBW: VBW, VBH: VBH, el: el, rng: rng, css: css, f1: f1,
        gradient: function (s, a) { return gradient(defs, s, a); },
        radial: function (s, cx, cy, r) { return radial(defs, s, cx, cy, r); },
        haze: haze, sheen: sheen, vein: vein, frond: frond, broadLeaf: broadLeaf
      });

      mount.appendChild(svg);
      built.push(svg);
    });
    return built;
  };

  World.VBW = VBW;
  World.VBH = VBH;
})();
