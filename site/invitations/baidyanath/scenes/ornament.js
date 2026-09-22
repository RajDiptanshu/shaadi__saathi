/* Lal & Sona · ornament.

   Every decorative mark on the page is drawn here rather than shipped as a file: the monogram ring,
   the climbing garlands, the arch the hero stands inside, the deco rules, the corner botanicals and
   the scalloped frame the note sits in.

   Anything meant to draw itself on screen is given `pathLength="1"` and the class `draw`. That makes a
   stroke of any real length animate over the same normalised 0 → 1, so one CSS rule can draw a 40px
   flourish and a 900px vine at the same speed without either being hand-tuned.

   Nothing here knows the couple's details. It returns geometry. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var Orn = window.Ornament = {};

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    return node;
  }
  Orn.el = el;

  function svg(viewBox, cls) {
    return el('svg', { viewBox: viewBox, class: cls, 'aria-hidden': 'true', focusable: 'false', overflow: 'visible' });
  }
  Orn.svg = svg;

  /* A stroke that draws itself. `order` staggers it against its siblings. */
  function stroke(parent, d, cls, order) {
    var p = el('path', { d: d, class: 'draw ' + (cls || ''), pathLength: 1, fill: 'none' });
    if (order != null) p.style.setProperty('--o', order);
    parent.appendChild(p);
    return p;
  }
  Orn.stroke = stroke;

  function f(n) { return Math.round(n * 100) / 100; }
  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  /* ---- leaves and blooms ------------------------------------------------------------------------- */

  /* One leaf, pointing along +x from the origin: two mirrored curves meeting at the tip, with a midrib.
     Filled rather than stroked, because at the sizes these are used a stroked leaf reads as a wireframe. */
  function leaf(parent, len, wide, cls) {
    var g = el('g', { class: cls || 'leaf' });
    g.appendChild(el('path', {
      class: 'leaf-blade',
      d: 'M0,0 C' + f(len * 0.28) + ',' + f(-wide) + ' ' + f(len * 0.74) + ',' + f(-wide * 0.72) + ' ' + len + ',0' +
         ' C' + f(len * 0.74) + ',' + f(wide * 0.72) + ' ' + f(len * 0.28) + ',' + f(wide) + ' 0,0 Z'
    }));
    g.appendChild(el('path', { class: 'leaf-rib', d: 'M0,0 L' + f(len * 0.92) + ',0', fill: 'none' }));
    parent.appendChild(g);
    return g;
  }
  Orn.leaf = leaf;

  /* A six-petal blossom, seen face on. The petals are pointed teardrops rather than round ellipses:
     five round petals around a yellow dot is a child's daisy, and it undid the rest of the page
     wherever it appeared. Small, and used as a full stop rather than as a flower bed. */
  function bloom(parent, cx, cy, r, cls) {
    var g = el('g', { class: cls || 'bloom' });
    for (var i = 0; i < 6; i++) {
      var deg = (360 / 6) * i;
      g.appendChild(el('path', {
        class: 'bloom-petal',
        transform: 'rotate(' + f(deg) + ' ' + f(cx) + ' ' + f(cy) + ')',
        d: 'M' + f(cx) + ',' + f(cy) +
           ' C' + f(cx + r * 0.34) + ',' + f(cy - r * 0.30) +
           ' ' + f(cx + r * 0.30) + ',' + f(cy - r * 0.86) +
           ' ' + f(cx) + ',' + f(cy - r * 1.04) +
           ' C' + f(cx - r * 0.30) + ',' + f(cy - r * 0.86) +
           ' ' + f(cx - r * 0.34) + ',' + f(cy - r * 0.30) +
           ' ' + f(cx) + ',' + f(cy) + ' Z'
      }));
    }
    g.appendChild(el('circle', { class: 'bloom-heart', cx: f(cx), cy: f(cy), r: f(r * 0.22) }));
    parent.appendChild(g);
    return g;
  }
  Orn.bloom = bloom;

  /* ---- the monogram ------------------------------------------------------------------------------ */

  /* A gold ring with the couple's initials interlocked inside it, in copperplate script. The ring is
     two arcs rather than one circle so the halves draw towards each other and meet at the top, which
     is a better opening beat than a circle unspooling from one point.

     The letters are real type, not paths, so a change of initials is a change of text.

     **Centring is measured, never assumed.** An earlier version placed the letters with `text-anchor:
     middle` and `dominant-baseline: central` and trusted the result; it sat visibly off centre inside
     the ring, because the two glyphs have different side bearings, a script `N` carries a long entry
     swash on its left, and `central` resolves against the font's own metrics rather than the ink. The
     fix is to render first and then measure: `centre()` reads the drawn bounding box and translates
     the group so the *ink* is centred, which is what the eye is actually judging. */
  Orn.monogram = function (left, right) {
    var s = svg('0 0 200 200', 'monogram');
    var g = el('g', {});

    stroke(g, 'M100,8 A92,92 0 0 1 100,192', 'mono-ring', 0);
    stroke(g, 'M100,8 A92,92 0 0 0 100,192', 'mono-ring', 0);
    stroke(g, 'M100,20 A80,80 0 0 1 100,180', 'mono-ring mono-ring--inner', 1);
    stroke(g, 'M100,20 A80,80 0 0 0 100,180', 'mono-ring mono-ring--inner', 1);

    /* Four small leaves at the compass points, sitting on the ring. */
    [0, 90, 180, 270].forEach(function (deg, i) {
      var lg = el('g', { class: 'mono-sprig', transform: 'rotate(' + deg + ' 100 100) translate(100,8)' });
      lg.style.setProperty('--o', 2 + i * 0.15);
      leaf(lg, 17, 6.5, 'leaf leaf--mono');
      var inner = el('g', { transform: 'rotate(180)' });
      leaf(inner, 17, 6.5, 'leaf leaf--mono');
      lg.appendChild(inner);
      g.appendChild(lg);
    });

    /* The two letters overlap so the D's bowl passes through the N's last stroke. They are separate
       <text> nodes rather than one string, because the overlap has to be set in ems of the display
       size and no pair kerning in the face will produce it. */
    var letters = el('g', { class: 'mono-letters' });
    var L = el('text', { class: 'mono-letter mono-letter--l', x: -22, y: 0, 'text-anchor': 'middle' });
    L.textContent = left || 'N';
    var R = el('text', { class: 'mono-letter mono-letter--r', x: 22, y: 0, 'text-anchor': 'middle' });
    R.textContent = right || 'D';
    letters.appendChild(L);
    letters.appendChild(R);
    g.appendChild(letters);

    s.appendChild(g);
    centre(s, letters, 100, 100);
    return s;
  };

  /* Translates `node` so the centre of its rendered ink sits at (cx, cy) in the SVG's own units.
     getBBox only returns anything once the node is laid out and the webfont has decoded, so this
     re-runs on fonts.ready and once more on the next frame; both are cheap and idempotent. */
  function centre(svgRoot, node, cx, cy) {
    function apply() {
      if (!node.isConnected) return;
      node.removeAttribute('transform');
      var b;
      try { b = node.getBBox(); } catch (e) { return; }
      if (!b || !b.width) return;
      var dx = cx - (b.x + b.width / 2);
      var dy = cy - (b.y + b.height / 2);
      node.setAttribute('transform', 'translate(' + f(dx) + ',' + f(dy) + ')');
    }
    requestAnimationFrame(apply);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply).catch(function () {});
    setTimeout(apply, 600);
    svgRoot.addEventListener('mono-recentre', apply);
  }
  Orn.centre = centre;

  /* ---- vines ------------------------------------------------------------------------------------- */

  /* A vine that climbs the edge of the screen: one serpentine stem with leaves alternating off it and
     a blossom every few nodes. `dir` is 1 for the left edge and -1 for the right, so the two mirror.

     The stem is drawn first and the leaves fade in behind it, which reads as growth. A vine whose
     leaves are already there while the stem draws reads as a mask sliding. */
  Orn.vine = function (dir, height, seed) {
    var r = rng(seed || 7), h = height || 1000, w = 150;
    var s = svg('0 0 ' + w + ' ' + h, 'vine');
    s.setAttribute('preserveAspectRatio', 'none');
    var g = el('g', { transform: dir < 0 ? 'translate(' + w + ',0) scale(-1,1)' : null });

    /* The stem: a cubic snake up the edge. */
    var nodes = 7, step = h / nodes, d = ['M14,' + h];
    var pts = [];
    for (var i = 1; i <= nodes; i++) {
      var y = h - i * step;
      var x = 14 + Math.sin(i * 1.15) * 30 + r() * 10;
      pts.push([x, y]);
      var py = y + step * 0.5;
      d.push('Q' + f(x + (i % 2 ? 24 : -18)) + ',' + f(py) + ' ' + f(x) + ',' + f(y));
    }
    stroke(g, d.join(' '), 'vine-stem', 0);

    /* Leaves alternate sides along the stem; blossoms land on every third node. */
    pts.forEach(function (p, i) {
      var side = i % 2 ? 1 : -1;
      var lg = el('g', {
        class: 'vine-leaf',
        transform: 'translate(' + f(p[0]) + ',' + f(p[1]) + ') rotate(' + f(side * (24 + r() * 34) - 10) + ')'
      });
      lg.style.setProperty('--o', 0.5 + i * 0.16);
      leaf(lg, 40 + r() * 26, 15 + r() * 7);
      g.appendChild(lg);

      if (i % 3 === 1) {
        var bg = el('g', { class: 'vine-bloom', transform: 'translate(' + f(p[0] + side * 26) + ',' + f(p[1] - 16) + ')' });
        bg.style.setProperty('--o', 0.9 + i * 0.16);
        bloom(bg, 0, 0, 11);
        g.appendChild(bg);
      }
    });

    s.appendChild(g);
    return s;
  };

  /* ---- the arch ---------------------------------------------------------------------------------- */

  /* A tall round-shouldered arch — the shape every wedding stage and every mehndi backdrop is built
     on. Drawn as a frame with a second hairline inset, and two sprigs where the curve springs. */
  Orn.arch = function () {
    var W = 320, H = 470, r = W / 2, spring = H - r - 40;
    var s = svg('0 0 ' + W + ' ' + H, 'arch');

    var outline = 'M6,' + H + ' L6,' + f(spring) +
      ' A' + (r - 6) + ',' + (r - 6) + ' 0 0 1 ' + (W - 6) + ',' + f(spring) + ' L' + (W - 6) + ',' + H;
    var inner = 'M20,' + H + ' L20,' + f(spring + 4) +
      ' A' + (r - 20) + ',' + (r - 20) + ' 0 0 1 ' + (W - 20) + ',' + f(spring + 4) + ' L' + (W - 20) + ',' + H;

    stroke(s, outline, 'arch-line', 0);
    stroke(s, inner, 'arch-line arch-line--thin', 0.5);

    /* The sprigs sit well below the springing point and point outward and down, away from the frame.
       Placed at the springing line and turned inward — which is the obvious reading of "where the curve
       starts" — they land exactly on the widest line of type the arch is built around. */
    [[6, spring + 74, 1], [W - 6, spring + 74, -1]].forEach(function (p, i) {
      var g = el('g', { class: 'arch-sprig', transform: 'translate(' + p[0] + ',' + f(p[1]) + ') scale(' + p[2] + ',1)' });
      g.style.setProperty('--o', 1 + i * 0.2);
      var a = el('g', { transform: 'rotate(158)' });
      leaf(a, 40, 14);
      g.appendChild(a);
      var b = el('g', { transform: 'rotate(206)' });
      leaf(b, 30, 11);
      g.appendChild(b);
      bloom(g, -13, 9, 8);
      s.appendChild(g);
    });

    return s;
  };

  /* ---- rules and corners ------------------------------------------------------------------------- */

  /* The divider used between beats: a hairline out to each side, two leaves, and a diamond centred. */
  Orn.deco = function () {
    var s = svg('0 0 240 30', 'deco');
    stroke(s, 'M4,15 L92,15', 'deco-line', 0);
    stroke(s, 'M236,15 L148,15', 'deco-line', 0);
    var l = el('g', { transform: 'translate(104,15) rotate(180)' });
    l.style.setProperty('--o', 0.4);
    leaf(l, 22, 8);
    s.appendChild(l);
    var r = el('g', { transform: 'translate(136,15)' });
    r.style.setProperty('--o', 0.4);
    leaf(r, 22, 8);
    s.appendChild(r);
    var d = el('g', { class: 'deco-key' });
    d.style.setProperty('--o', 0.7);
    d.appendChild(el('path', { class: 'deco-diamond', d: 'M120,6 l8,9 -8,9 -8,-9 Z' }));
    s.appendChild(d);
    return s;
  };

  /* A botanical corner, for the four corners of a sheet. */
  Orn.corner = function (pos) {
    var s = svg('0 0 92 92', 'corner corner--' + pos);
    stroke(s, 'M6,52 C6,24 24,6 52,6', 'corner-line', 0);
    var a = el('g', { transform: 'translate(10,44) rotate(-64)' });
    a.style.setProperty('--o', 0.4);
    leaf(a, 30, 11);
    s.appendChild(a);
    var b = el('g', { transform: 'translate(44,10) rotate(-16)' });
    b.style.setProperty('--o', 0.55);
    leaf(b, 26, 10);
    s.appendChild(b);
    var c = el('g', { transform: 'translate(20,20)' });
    c.style.setProperty('--o', 0.75);
    bloom(c, 0, 0, 8);
    s.appendChild(c);
    return s;
  };

  /* A sideways chevron, for the gallery's arrows. */
  Orn.chevron = function (dir) {
    var s = svg('0 0 24 24', 'chev');
    var d = dir === 'right' ? 'M9,4 L17,12 L9,20' : 'M15,4 L7,12 L15,20';
    s.appendChild(el('path', { class: 'chev-line', d: d, fill: 'none' }));
    return s;
  };

  /* A downward chevron that nudges, used as the cue from one scene to the next. */
  Orn.arrow = function () {
    var s = svg('0 0 22 34', 'cue-arrow');
    stroke(s, 'M11,2 L11,26', 'cue-line', 0);
    stroke(s, 'M3,19 L11,30 L19,19', 'cue-line', 0.3);
    return s;
  };

  /* ---- the scalloped frame ----------------------------------------------------------------------- */

  /* A rectangle with a semicircle hung off every step of its perimeter — the cloud panel the note is
     written inside. Built from the geometry rather than from an image so it fits any aspect. */
  function scallopPath(w, h, steps) {
    var perX = Math.max(3, Math.round(steps * (w / (w + h))));
    var perY = Math.max(3, Math.round(steps * (h / (w + h))));
    var dx = w / perX, dy = h / perY, d = [], i;
    d.push('M0,0');
    for (i = 0; i < perX; i++) d.push('A' + f(dx / 2) + ',' + f(dx / 2) + ' 0 0 1 ' + f((i + 1) * dx) + ',0');
    for (i = 0; i < perY; i++) d.push('A' + f(dy / 2) + ',' + f(dy / 2) + ' 0 0 1 ' + f(w) + ',' + f((i + 1) * dy));
    for (i = 0; i < perX; i++) d.push('A' + f(dx / 2) + ',' + f(dx / 2) + ' 0 0 1 ' + f(w - (i + 1) * dx) + ',' + f(h));
    for (i = 0; i < perY; i++) d.push('A' + f(dy / 2) + ',' + f(dy / 2) + ' 0 0 1 0,' + f(h - (i + 1) * dy));
    d.push('Z');
    return d.join(' ');
  }
  Orn.scallopPath = scallopPath;

  Orn.scallopFrame = function () {
    var w = 460, h = 560, pad = 22;
    var s = svg('0 0 ' + (w + pad * 2) + ' ' + (h + pad * 2), 'scallop');
    var g = el('g', { transform: 'translate(' + pad + ',' + pad + ')' });
    g.appendChild(el('path', { class: 'scallop-face', d: scallopPath(w, h, 30) }));
    var edge = el('path', { class: 'scallop-edge draw', d: scallopPath(w, h, 30), pathLength: 1, fill: 'none' });
    g.appendChild(edge);
    var inset = el('path', { class: 'scallop-inner draw', d: 'M18,18 H' + (w - 18) + ' V' + (h - 18) + ' H18 Z', pathLength: 1, fill: 'none' });
    inset.style.setProperty('--o', 0.6);
    g.appendChild(inset);
    s.appendChild(g);
    return s;
  };

  /* ---- the curtain's scalloped hem ---------------------------------------------------------------- */

  /* The valance across the top of the threshold: a swagged hem with a tassel hanging at each dip. */
  Orn.valance = function (swags) {
    var W = 1000, H = 190, n = swags || 5, w = W / n;
    var s = svg('0 0 ' + W + ' ' + H, 'valance');
    s.setAttribute('preserveAspectRatio', 'none');

    /* The cloth carries its own gradient rather than a flat fill, because a valance is lit along its
       hem and a flat green one reads as a paper cut-out. */
    var defs = el('defs', {});
    var grad = el('linearGradient', { id: 'valance-grad', x1: 0, y1: 0, x2: 0, y2: 1 });
    [['0', '#3A0713'], ['0.42', '#7C1330'], ['0.78', '#B31331'], ['1', '#6E1028']].forEach(function (st) {
      grad.appendChild(el('stop', { offset: st[0], 'stop-color': st[1] }));
    });
    defs.appendChild(grad);
    s.appendChild(defs);

    var d = ['M0,0 L' + W + ',0 L' + W + ',26'];
    for (var i = n - 1; i >= 0; i--) {
      d.push('Q' + f(i * w + w / 2) + ',' + f(H * 0.82) + ' ' + f(i * w) + ',26');
    }
    d.push('L0,0 Z');
    s.appendChild(el('path', { class: 'valance-cloth', d: d.join(' ') }));

    var hem = ['M0,26'];
    for (i = 0; i < n; i++) hem.push('Q' + f(i * w + w / 2) + ',' + f(H * 0.82) + ' ' + f((i + 1) * w) + ',26');
    s.appendChild(el('path', { class: 'valance-hem', d: hem.join(' '), fill: 'none' }));

    for (i = 0; i <= n; i++) {
      var x = i * w, y = i === 0 || i === n ? 30 : 34;
      var t = el('g', { class: 'valance-tassel', transform: 'translate(' + f(x) + ',' + f(y) + ')' });
      t.style.setProperty('--o', i * 0.12);
      t.appendChild(el('path', { class: 'tassel-cord', d: 'M0,0 L0,22', fill: 'none' }));
      t.appendChild(el('path', { class: 'tassel-head', d: 'M-9,22 L9,22 L6,40 L-6,40 Z' }));
      t.appendChild(el('circle', { class: 'tassel-bead', cx: 0, cy: 48, r: 7 }));
      s.appendChild(t);
    }
    return s;
  };
})();
