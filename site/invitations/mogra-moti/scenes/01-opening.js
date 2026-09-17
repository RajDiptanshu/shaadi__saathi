/* Mogra & Moti · Scene 01 Opening, and the Draw that carries the guest into Scene 02 Welcome.
   "The light finds their names." Order (Phase 3.5 brief): near-darkness → morning light finds the paper → the
   blind deboss rises → a pearl rolls in → the silk thread tightens → the thread draws the pearl and strand across
   → the names are set by light → mogra arrives at the strand's tail → the guest's touch → the thread draws the
   Welcome sheet up over the card. Every movement names its cause. Score: animation-storyboard.md §7. */
(function () {
  var Invite = window.Invite;
  var M = Invite.motion, P = M.policy, C = M.curve;
  var seg = M.seg, lerp = M.lerp, clamp = M.clamp;
  var root = document.documentElement;

  /* Art direction. Phone (390 × 844 design size) and wide (1440 × 900) are composed separately.
     Fractions are of the opening's width (x) or height (y); pixel sizes are CSS px. */
  var ART = {
    /* Phone: the camera is close — the card fills the frame, its deckled top-left corner showing marble. */
    phone: {
      card: function (w, h) { return { x: Math.round(w * 0.06), y: Math.round(h * 0.07), right: w + 60, deckleRight: false }; },
      nameSize: function (w) { return clamp(w * 0.34, 112, 240); },
      firstX: function () { return 16; },
      firstBase: 0.39,
      secondRight: function (w) { return w - 18; },
      secondBase: 0.61,
      surnameGap: 12,
      monogram: function (w, h) { return { x: w * 0.5, y: h * 0.17, size: 112 }; },
      facts: function (w, h) { return { x: 20, y: h * 0.83 }; },
      hint: function (w, h) { return { x: 20, y: h * 0.92 }; },
      taut: { y0: 0.74, y3: 0.28 },
      slack: { y0: 0.87, y3: 0.8, bow: 12 },
      weave: 0.72,
      pearl: 20, bead: 12, bud: 23,
      rollTo: 0.36,
      sweep: 460,
      marble: 1200
    },
    /* Wide: the camera pulls back — a portrait card stands on marble with all three deckled edges in frame; the
       thread runs across marble, card and marble again. Composition on a diagonal: monogram high right,
       first name left, second name low right, facts low left. */
    wide: {
      card: function (w, h) { return { x: Math.round(w * 0.24), y: Math.round(h * 0.08), right: Math.round(w * 0.7), deckleRight: true }; },
      nameSize: function () { return 220; },
      firstX: function (w) { return Math.round(w * 0.24) + 44; },
      firstBase: 0.38,
      secondRight: function (w) { return Math.round(w * 0.7) - 44; },
      secondBase: 0.66,
      surnameGap: 16,
      monogram: function (w, h) { return { x: Math.round(w * 0.7) - 108, y: h * 0.2, size: 128 }; },
      facts: function (w, h) { return { x: Math.round(w * 0.24) + 48, y: h * 0.83 }; },
      hint: function (w, h) { return { x: Math.round(w * 0.24) + 48, y: h * 0.91 }; },
      taut: { y0: 0.8, y3: 0.2 },
      slack: { y0: 0.84, y3: 0.78, bow: 16 },
      weave: 0.72,
      pearl: 26, bead: 15, bud: 30,
      rollTo: 0.36,
      sweep: 760,
      marble: 1920
    }
  };

  /* The strand behind the hero pearl: moti first, mogra at the tail. */
  var STRAND = [
    { kind: 'pearl', asset: 'pearls/o02-strand-a-64' },
    { kind: 'pearl', asset: 'pearls/o02-strand-c-64' },
    { kind: 'pearl', asset: 'pearls/o02-strand-a-64' },
    { kind: 'bud', asset: 'flowers/o03-bud-tall-160', ratio: 0.92 },
    { kind: 'bud', asset: 'flowers/o03-bud-small-160', ratio: 0.96 },
    { kind: 'bud', asset: 'flowers/o03-bud-tall-160', ratio: 0.92 }
  ];

  /* Beat times in seconds. Normal: ~6.4 s to the invitation to touch. Reduced: ~2.2 s. */
  var BEATS = {
    normal: { tapFrom: 1.2, ready: 6.4, end: 7.3, entryEnd: 3.0, handover: 1.78 },
    reduced: { tapFrom: 1.2, ready: 2.2, end: 2.75, entryEnd: 1.6, handover: 0.95 }
  };

  /* The Draw's sheet: the knot sits 5% in from the held left corner; the corner leads the free side by up to 9% of
     the height, which the sheet's edge band (px, matched in scenes.css) must contain. */
  var KNOT_X = 0.05, LEAD = 0.09, BAND = 96;

  var el = {}, geo = null, opening = null, entry = null;
  var st = { tapped: false, queued: false, entering: false, handed: false, returning: false, laidOut: false, ext: 'webp' };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function css(node, prop, value) { if (node && node.style[prop] !== String(value)) node.style[prop] = value; }
  function fade(node, v) { css(node, 'opacity', String(Math.round(v * 1000) / 1000)); }

  /* ───────── build ───────── */

  function makeBead(kind, asset, hero) {
    var node = document.createElement('span');
    node.className = 'bead bead--' + kind + (hero ? ' bead--hero' : '');
    node.innerHTML = '<i class="bead-shadow"></i><img alt="" data-asset="' + asset + '">' + (hero ? '<i class="bead-glint"></i>' : '');
    el.beads.appendChild(node);
    return { node: node, img: node.querySelector('img'), glint: node.querySelector('.bead-glint'), kind: kind, w: 0, h: 0 };
  }

  function build() {
    el.opening = $('#opening');
    el.stage = $('.stage', el.opening);
    el.surface = $('.surface', el.opening);
    el.card = $('.card', el.opening);
    el.cardPaper = $('.card-paper', el.card);
    el.cardShadow = $('.card-shadow', el.card);
    el.cardRim = $('.card-rim', el.card);
    el.monogram = $('.monogram', el.opening);
    el.occ = $('.mono-occlusion'); el.shadow = $('.mono-shadow'); el.highlight = $('.mono-highlight');
    el.foil = $('.mono-foil'); el.glint = $('.foil-glint');
    el.first = $('.name--first'); el.firstWord = $('.name--first .name-word'); el.firstProbe = $('.name--first .probe');
    el.firstSurname = $('.name--first .surname');
    el.second = $('.name--second'); el.secondWord = $('.name--second .name-word'); el.secondProbe = $('.name--second .probe');
    el.secondSurname = $('.name--second .surname'); el.bride = $('.bride-word');
    el.factsLabel = $('.facts .label'); el.factsInfo = $('.facts .info');
    el.hint = $('.hint'); el.sweep = $('.sweep'); el.shade = $('.shade'); el.glow = $('.glow'); el.front = $('.front');
    el.facts = $('.facts');
    el.dark = $('.dark'); el.dim = $('.dim');
    el.strand = $('.strand');
    el.thread = new M.Thread($('.strand .thread'));
    el.weave = $('.weave'); el.beads = $('.beads'); el.knot = $('.knot');
    el.button = $('#open-invitation');
    el.main = $('#invitation');
    el.edge = $('.sheet-edge');
    el.edgePaper = $('.edge-paper', el.edge); el.edgeRim = $('.edge-rim', el.edge);
    el.edgeAo = Array.prototype.slice.call(el.edge.querySelectorAll('.edge-ao'));
    el.hero = makeBead('pearl', 'pearls/o01-hero-96', true);
    el.strandBeads = STRAND.map(function (b) { return makeBead(b.kind, b.asset, false); });
  }

  function dressMaterials(ext) {
    var paper = 'assets/textures/t01-paper-768.' + ext;
    Array.prototype.forEach.call(document.querySelectorAll('.paper-image'), function (img) {
      img.setAttribute('href', paper);
    });
    var foil = 'url(assets/ornaments/monogram-foil.' + ext + ')';
    el.glint.style.webkitMaskImage = foil;
    el.glint.style.maskImage = foil;
    var ground = $('.s02');
    // Absolute, because a url() inside a custom property resolves against the stylesheet that uses it.
    if (ground) ground.style.setProperty('--paper-tile', 'url(' + new URL(paper, location.href).href + ')');
    var marble = window.innerWidth >= 1024 && window.innerWidth / window.innerHeight >= 1.1 ? ART.wide.marble : ART.phone.marble;
    return [paper, 'assets/textures/t03-marble-' + marble + '.' + ext];
  }

  /* ───────── layout: measure once, then every frame is arithmetic ───────── */

  function layout() {
    var w = el.opening.clientWidth, h = el.opening.clientHeight;
    var wide = w >= 1024 && w / h >= 1.1;
    var A = wide ? ART.wide : ART.phone;
    var g = { w: w, h: h, wide: wide, art: A };
    root.classList.toggle('layout-wide', wide);
    css(el.stage, 'transform', '');

    // The card: deckled edges in frame, running off the bottom (and, on phones, the right) edge.
    var card = A.card(w, h);
    el.card.setAttribute('width', w);
    el.card.setAttribute('height', h);
    el.card.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var sheet = M.paper.sheet(card.x, card.y, card.right, h + 60, 7, card.deckleRight);
    el.cardPaper.setAttribute('d', sheet);
    el.cardShadow.setAttribute('d', sheet);
    el.cardRim.setAttribute('d', M.paper.rim(card.x, card.y, card.right, h + 60, 7, card.deckleRight));
    css(el.surface, 'backgroundImage', 'url(assets/textures/t03-marble-' + A.marble + '.' + st.ext + ')');
    g.card = card;

    // Monogram, facts and the hint, placed per composition.
    var mono = A.monogram(w, h), facts = A.facts(w, h), hint = A.hint(w, h);
    if (!wide) {
      // Short phones (in-app browsers): the monogram keeps a scale step clear of the first name's capitals.
      var capTop = Math.round(h * A.firstBase) - A.nameSize(w) * 0.66;
      mono.size = Math.min(mono.size, Math.round(capTop - card.y - 32));
      mono.y = Math.min(mono.y, (card.y + capTop) / 2);
    }
    css(el.monogram, 'left', Math.round(mono.x - mono.size / 2) + 'px');
    css(el.monogram, 'top', Math.round(mono.y - mono.size / 2) + 'px');
    css(el.monogram, 'width', mono.size + 'px');
    css(el.monogram, 'height', mono.size + 'px');
    css(el.facts, 'left', facts.x + 'px');
    css(el.facts, 'top', Math.round(facts.y) + 'px');
    css(el.hint, 'left', hint.x + 'px');
    css(el.hint, 'right', 'auto');
    css(el.hint, 'top', Math.round(hint.y) + 'px');

    // The morning light's front: a soft diagonal edge on a square D px wide, travelling from beyond the top-left
    // corner (everything in shade) until its lit side covers the far corner.
    var D = 2.2 * (w + h);
    g.front = { D: D, from: -0.6 * D, to: (w + h) / 2 - 0.38 * D };

    // The names: masthead scale, placed by baseline (typography-system.md §4).
    var size = A.nameSize(w);
    [el.firstWord, el.secondWord, el.weave].forEach(function (n) { n.style.fontSize = size + 'px'; });
    var fb = el.firstProbe.offsetTop, fBase = Math.round(h * A.firstBase);
    css(el.first, 'left', A.firstX(w) + 'px');
    css(el.first, 'top', (fBase - fb) + 'px');

    var sb = el.secondProbe.offsetTop, sBase = Math.round(h * A.secondBase);
    css(el.second, 'right', (w - A.secondRight(w)) + 'px');
    css(el.second, 'top', (sBase - sb) + 'px');

    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '300 ' + size + 'px Imbue';
    var cap = (ctx.measureText('H').actualBoundingBoxAscent || size * 0.66);
    function descent(node) { return Math.max(0, ctx.measureText(node.textContent).actualBoundingBoxDescent || 0); }

    // Surnames sit a scale step below the baseline, or below the descenders when a letter drops (y, g, p).
    css(el.firstSurname, 'top', (fb + A.surnameGap + Math.max(0, descent(el.firstWord) - 2)) + 'px');
    css(el.secondSurname, 'top', (sb + A.surnameGap + Math.max(0, descent(el.secondWord) - 2)) + 'px');

    var o = el.opening.getBoundingClientRect();
    function rel(r) { return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height, r: r.right - o.left, b: r.bottom - o.top }; }

    // The weave: the thread passes behind the left diagonal of the second name's first letter.
    var text = el.bride.firstChild;
    var range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 1);
    var glyph = rel(range.getBoundingClientRect());
    var word = rel(el.secondWord.getBoundingClientRect());
    el.weave.textContent = text.data.charAt(0);
    css(el.weave, 'left', glyph.x + 'px');
    css(el.weave, 'top', (sBase - sb) + 'px');
    css(el.weave, 'clipPath', 'inset(-10% 50% -10% -10%)');
    g.weaveBox = { width: word.w, offset: glyph.x - word.x };

    var W = { x: glyph.x + glyph.w * (0.1 + 0.4 * A.weave) + 1, y: sBase - A.weave * cap };
    var p0 = { x: -8, y: h * A.taut.y0 }, p3 = { x: w + 8, y: h * A.taut.y3 };
    g.tautBow = C.bowThrough(p0, p3, W);
    g.taut = C.line(p0, p3, g.tautBow);
    g.slack = C.line({ x: -8, y: h * A.slack.y0 }, { x: w + 8, y: h * A.slack.y3 }, A.slack.bow);
    var lut = C.sample(g.taut, 120);
    g.len = lut.len;
    g.lenSlack = C.sample(g.slack, 120).len;
    g.sW = C.nearest(lut, W);

    // The hero pearl rests in the gap between the first surname and the second name's cap height.
    var gapTop = rel(el.firstSurname.getBoundingClientRect()).b;
    var gapY = (gapTop + (sBase - cap)) / 2;
    g.sH = C.atHeight(lut, gapY, g.sW);

    // Strand beads sit below the weave, touching as strung beads do.
    var s = g.sW - A.pearl * 0.8, prev = 0;
    g.strand = STRAND.map(function (b, i) {
      var hgt = b.kind === 'bud' ? A.bud : A.bead;
      s -= i === 0 ? hgt / 2 : prev / 2 + hgt / 2 + (b.kind === 'bud' ? 0.5 : 1.5);
      prev = hgt;
      return { s: s, h: hgt, w: hgt * (b.ratio || 1) };
    });
    // Before the pull every strand bead waits off-frame, bunched, pearls nearest.
    g.strand.forEach(function (b, i) { b.from = -A.bead - i * A.bead * 0.9 - (STRAND[i].kind === 'bud' ? 40 : 0); });

    // The light band that sets the names travels along the thread, lower left to upper right.
    var a = C.at(lut, g.sW - 180), z = C.at(lut, g.len + 60);
    g.sweepFrom = a; g.sweepTo = z;
    css(el.sweep, 'width', A.sweep + 'px');
    css(el.sweep, 'height', Math.round(A.sweep * 0.66) + 'px');

    el.thread.size(w, h);
    el.edge.setAttribute('viewBox', '0 0 ' + w + ' 48');
    el.edge.setAttribute('preserveAspectRatio', 'none');
    geo = g;
    st.laidOut = true;
    root.classList.add('is-laid-out');
  }

  /* ───────── drawing helpers ───────── */

  function place(b, lut, s, h, w, opts) {
    var p = C.at(lut, s);
    w = w || h;
    var t = 'translate3d(' + (p.x - w / 2).toFixed(2) + 'px,' + (p.y - h / 2).toFixed(2) + 'px,0)';
    if (b.kind === 'bud') t += ' rotate(' + (p.a * 180 / Math.PI + 90).toFixed(1) + 'deg)';
    if (opts && opts.scale != null && opts.scale !== 1) t += ' scale(' + opts.scale.toFixed(3) + ')';
    css(b.node, 'transform', t);
    if (b.w !== w || b.h !== h) { b.node.style.width = w + 'px'; b.node.style.height = h + 'px'; b.w = w; b.h = h; }
    fade(b.node, opts && opts.alpha != null ? opts.alpha : 1);
    return p;
  }

  function lightBand(p) {
    var g = geo, half = g.art.sweep / 2;
    var x = lerp(g.sweepFrom.x, g.sweepTo.x, p) - half, y = lerp(g.sweepFrom.y, g.sweepTo.y, p) - half * 0.66;
    css(el.sweep, 'transform', 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)');
    fade(el.sweep, Math.sin(Math.PI * p));
  }

  function setNames(p1, p2, p3) {
    M.setByLight(el.firstWord, p1);
    M.setByLight(el.secondWord, p2);
    M.setByLight(el.weave, p2, geo.weaveBox);
    M.setByLight(el.firstSurname, p3);
    M.setByLight(el.secondSurname, p3);
  }

  /* The strand layer sits above the card, so it takes the same darkness as the card beneath it. */
  function strandLight(darkness) { fade(el.strand, 1 - darkness); }

  /* The light front at progress p; returns how dark it leaves a point (0 lit … 0.94 shade). */
  function frontAt(p) {
    var f = geo.front, tx = lerp(f.from, f.to, p);
    css(el.front, 'transform', 'translate3d(' + tx.toFixed(1) + 'px,' + tx.toFixed(1) + 'px,0) scale(' + (f.D / 100).toFixed(3) + ')');
    fade(el.front, p < 1 ? 1 : 0);
    return function (x, y) {
      var k = ((x - tx) + (y - tx)) / (2 * f.D);
      k = clamp((k - 0.38) / 0.22, 0, 1);
      return p < 1 ? 0.94 * k * k * (3 - 2 * k) : 0;
    };
  }

  /* ───────── the opening, normal cut ───────── */

  function renderOpening(t) {
    if (P.reduced) return renderOpeningReduced(t);
    var g = geo, A = g.art;

    // 1–2 · Near-darkness; the morning light's front crosses from the top-left corner and finds the paper, its warm
    //       edge travelling ahead of it; the cool shade at the lower right clears last (lead: light).
    var darkAt = frontAt(seg(t, 0.25, 2.3, 'light'));
    var shade = 1 - seg(t, 1.3, 1.5, 'light');
    fade(el.dark, 0);
    fade(el.shade, 0.5 * shade);
    fade(el.glow, seg(t, 0.4, 2.6, 'light'));
    strandLight(Math.max(darkAt(0.2 * g.w, 0.86 * g.h), darkAt(0.85 * g.w, 0.8 * g.h), 0.42 * shade));

    // 3 · The blind deboss rises as the light's band passes the top of the card (follows the light).
    fade(el.occ, 0.45 * seg(t, 0.95, 1.1, 'light'));
    fade(el.shadow, seg(t, 1.1, 1.1, 'light'));
    fade(el.highlight, seg(t, 1.25, 1.1, 'light'));
    fade(el.foil, seg(t, 1.05, 1.2, 'light'));
    var glint = seg(t, 2.05, 0.9, 'light');
    fade(el.glint, glint > 0 && glint < 1 ? 1 : 0);
    css(el.glint, 'backgroundPosition', (100 - 100 * glint).toFixed(1) + '% 0');

    // 4 · A pearl rolls in from the right edge along the slack thread, across the newly lit card, and comes to
    //     rest (its own momentum; it leaves the shade at the lower right as it enters the light).
    var roll = seg(t, 2.1, 1.25, 'settle');
    // 5 · Its stop tightens the thread: slack to taut, then the thread's single release overshoot.
    var tight = 0.78 * seg(t, 3.42, 0.22, 'tension') + 0.22 * seg(t, 3.64, 0.36, 'release');
    var curve = C.mix(g.slack, g.taut, tight);
    var lut = C.sample(curve, 72);
    el.thread.set(curve);

    // 6 · The pull at the upper right draws the pearl across, and the strand in after it.
    var u = lerp(1 + A.pearl / g.lenSlack, A.rollTo, roll);
    var draw = seg(t, 3.78, 1.3, 'camera');
    var heroS = lerp(u * lut.len, g.sH, draw);
    place(el.hero, lut, heroS, A.pearl, A.pearl);
    fade(el.hero.glint, 0);
    g.strand.forEach(function (b, i) {
      var bud = STRAND[i].kind === 'bud';
      // 8 · Mogra last: the buds at the tail come in after the names have begun to be lit.
      var p = bud ? seg(t, 4.7 + 0.07 * (i - 3), 1.25, 'camera') : seg(t, 3.9 + 0.06 * i, 1.2, 'camera');
      place(el.strandBeads[i], lut, lerp(b.from, b.s, p), b.h, b.w);
    });

    // 7 · A brighter band of light travels along the thread and sets the names (lead: light).
    lightBand(seg(t, 3.95, 2.0, 'light'));
    setNames(seg(t, 4.15, 1.0, 'light'), seg(t, 4.33, 1.0, 'light'), seg(t, 4.51, 1.0, 'light'));
    fade(el.weave, 1);

    // 9 · The facts, then the invitation to touch. The hint is lit, never pulsed.
    M.setByLight(el.factsLabel, seg(t, 5.5, 1.0, 'light'));
    M.setByLight(el.factsInfo, seg(t, 5.68, 1.0, 'light'));
    M.setByLight(el.hint, seg(t, st.returning ? 1.2 : 6.25, 1.0, 'light'));
    // 9 · The object to touch: once the hint is lit, the hero pearl's lustre begins its slow drift.
    root.classList.toggle('is-inviting', t >= BEATS.normal.ready);
  }

  /* ───────── the opening, reduced cut: the same story, in place, about 2.2 s ───────── */

  function renderOpeningReduced(t) {
    var g = geo;
    var dark = 0.95 * (1 - seg(t, 0, 0.8, 'light')), shade = 1 - seg(t, 0.15, 0.7, 'light');
    frontAt(1);
    fade(el.dark, dark);
    fade(el.shade, shade);
    fade(el.glow, seg(t, 0, 0.8, 'light'));
    strandLight(Math.max(dark, shade * 0.85));
    fade(el.occ, 0.45 * seg(t, 0.4, 0.36, 'light'));
    fade(el.shadow, seg(t, 0.45, 0.36, 'light'));
    fade(el.highlight, seg(t, 0.5, 0.36, 'light'));
    fade(el.foil, seg(t, 0.4, 0.36, 'light'));
    var glint = seg(t, 0.7, 0.36, 'light');
    fade(el.glint, glint > 0 && glint < 1 ? 1 : 0);
    css(el.glint, 'backgroundPosition', (100 - 100 * glint).toFixed(1) + '% 0');

    var lut = C.sample(g.taut, 72);
    el.thread.set(g.taut);
    // The pearl appears in place with a glint; then the thread draws along its length through it.
    place(el.hero, lut, g.sH, g.art.pearl, g.art.pearl, { alpha: seg(t, 0.9, 0.3, 'light') });
    fade(el.hero.glint, Math.sin(Math.PI * seg(t, 0.9, 0.5, 'light')));
    el.thread.draw(seg(t, 1.0, 0.4, 'silk'));
    g.strand.forEach(function (b, i) {
      var bud = STRAND[i].kind === 'bud';
      var a = bud ? seg(t, 1.75 + 0.05 * (i - 3), 0.3, 'light') : seg(t, 1.15 + 0.05 * i, 0.3, 'light');
      place(el.strandBeads[i], lut, b.s, b.h, b.w, { alpha: a });
    });
    fade(el.sweep, 0);
    setNames(seg(t, 1.3, 0.5, 'light'), seg(t, 1.45, 0.5, 'light'), seg(t, 1.6, 0.5, 'light'));
    M.setByLight(el.factsLabel, seg(t, 1.85, 0.5, 'light'));
    M.setByLight(el.factsInfo, seg(t, 1.95, 0.5, 'light'));
    M.setByLight(el.hint, seg(t, 2.2, 0.5, 'light'));
  }

  /* ───────── the entry: the Draw ───────── */

  function setEntryClasses(entering, drawing, handed) {
    root.classList.toggle('is-entering', entering && !handed);
    root.classList.toggle('is-drawing', entering && drawing && !handed);
    root.classList.toggle('is-covered', !handed);
  }

  function renderEntry(t) {
    var g = geo, w = g.w, h = g.h, A = g.art, B = BEATS[P.reduced ? 'reduced' : 'normal'];
    var handed = t >= B.handover;
    setEntryClasses(true, !P.reduced, handed);
    root.classList.remove('is-inviting');
    if (P.reduced) return renderEntryReduced(t, handed);

    // Touch: the pearl presses into the paper and catches more light (feedback inside 100 ms).
    var press = seg(t, 0, 0.1, 'settle') * (1 - seg(t, 0.14, 0.3, 'settle'));

    // The Draw: the thread is pulled from the upper right. It straightens at once and the strand runs off toward
    // the pull. Its lower end is tied at the held corner of the Welcome sheet, which it lifts in from below: the
    // held corner leads, the free side lags, and once the sheet is down the thread slips its knot and leaves.
    var travel = seg(t, 0.26, 1.5, 'camera');
    var sheetTop = lerp(h + 30, 0, travel);
    var lead = LEAD * h * Math.pow(Math.sin(Math.PI * travel), 0.8);
    var straight = seg(t, 0.1, 0.3, 'tension');
    var p3 = { x: w + 8, y: lerp(g.taut[3].y, -0.35 * h, seg(t, 0.14, 1.55, 'camera')) };
    var corner = { x: KNOT_X * w, y: sheetTop + M.paper.edgeAt(KNOT_X * w, w, lead) };
    var catchUp = clamp((g.taut[0].y + 90 - corner.y) / 90, 0, 1);
    catchUp = catchUp * catchUp * (3 - 2 * catchUp);
    var p0 = { x: lerp(-8, corner.x, catchUp), y: lerp(g.taut[0].y, corner.y, catchUp) };
    var slip = seg(t, 1.78, 0.5, 'tension');
    p0 = { x: lerp(p0.x, p3.x + 40, slip), y: lerp(p0.y, p3.y - 40, slip) };
    var curve = C.line(p0, p3, g.tautBow * (1 - 0.85 * straight));
    var lut = C.sample(curve, 72);
    el.thread.set(curve);
    el.thread.draw(1);
    css(el.knot, 'transform', 'translate3d(' + (p0.x - 3.5).toFixed(1) + 'px,' + (p0.y - 3.5).toFixed(1) + 'px,0)');
    fade(el.knot, catchUp);

    var exitS = lut.len + 60;
    place(el.hero, lut, lerp(g.sH, exitS, seg(t, 0.14, 1.0, 'silk')), A.pearl, A.pearl, { scale: 1 - 0.06 * press });
    fade(el.hero.glint, press);
    g.strand.forEach(function (b, i) {
      place(el.strandBeads[i], lut, lerp(b.s, exitS, seg(t, 0.18 + 0.04 * i, 1.05, 'silk')), b.h, b.w);
    });
    fade(el.weave, 1 - seg(t, 0.1, 0.2, 'light'));
    fade(el.sweep, 0);
    frontAt(1);

    // The card beneath is pushed back a little and falls into the new sheet's shade.
    css(el.stage, 'transform', 'scale(' + lerp(1, 0.98, travel).toFixed(4) + ')');
    fade(el.dim, 0.1 * travel);

    if (!handed) {
      css(el.main, 'transform', 'translate3d(0,' + sheetTop.toFixed(1) + 'px,0)');
      var edge = M.paper.edge(w, lead, 24, BAND, 29);
      el.edgePaper.setAttribute('d', edge.fill);
      el.edgeRim.setAttribute('d', edge.line);
      el.edgeAo.forEach(function (p) { p.setAttribute('d', edge.line); });
      el.edge.setAttribute('viewBox', '0 0 ' + w + ' ' + (BAND + 26));
    } else {
      css(el.main, 'transform', '');
    }
    root.classList.toggle('is-threading', t < B.entryEnd - 0.5);
    fade(el.strand, 1);

    // The Welcome heading is lit once the sheet has come to rest.
    Invite.welcome.render(t - 1.6, false);
  }

  function renderEntryReduced(t, handed) {
    var g = geo, A = g.art;
    var press = seg(t, 0, 0.1, 'settle') * (1 - seg(t, 0.14, 0.2, 'settle'));
    var tighten = seg(t, 0.12, 0.3, 'tension');
    var p3 = { x: g.w + 8, y: g.taut[3].y - 10 * tighten };
    var curve = C.line(g.taut[0], p3, g.tautBow * (1 - 0.5 * tighten));
    var lut = C.sample(curve, 72);
    el.thread.set(curve);
    el.thread.draw(1);
    var gone = seg(t, 0.12, 0.3, 'light');
    place(el.hero, lut, g.sH + 12 * tighten, A.pearl, A.pearl, { scale: 1 - 0.06 * press, alpha: 1 - gone });
    fade(el.hero.glint, press);
    g.strand.forEach(function (b, i) { place(el.strandBeads[i], lut, b.s + 12 * tighten, b.h, b.w, { alpha: 1 - gone }); });
    fade(el.weave, 1 - gone);
    fade(el.strand, 1 - seg(t, 0.42, 0.45, 'light'));
    css(el.main, 'transform', 'none');
    fade(el.main, handed ? 1 : seg(t, 0.42, 0.45, 'light'));
    if (handed) css(el.main, 'opacity', '');
    Invite.welcome.render(t - 0.45, true);
  }

  /* ───────── flow ───────── */

  function handOver() {
    if (st.handed) return;
    st.handed = true;
    el.main.inert = false;
    el.button.setAttribute('tabindex', '-1');
    var title = document.getElementById('welcome-title');
    try { title.focus({ preventScroll: true }); } catch (e) { title.focus(); }
    Invite.emit('opened', { instant: false });
  }

  function playEntry() {
    if (st.entering) return;
    st.entering = true;
    entry.seek(0).play(1);
  }

  function openInstant() {
    st.tapped = true;
    root.classList.remove('is-covered', 'is-entering', 'is-drawing');
    Invite.welcome.render(99, P.reduced);
    st.handed = false;
    handOver();
  }

  function onTap() {
    if (st.tapped) return;
    st.tapped = true;
    Invite.emit('open');
    try { if (navigator.vibrate && /Android/i.test(navigator.userAgent)) navigator.vibrate(8); } catch (e) {}
    try { localStorage.setItem('mogra-moti-opened', '1'); } catch (e) {}
    if (!P.ok || !opening) return openInstant();
    if (opening.time >= opening.duration) return playEntry();
    // Impatience is respected: after 1.2 s the rest of the opening runs at 4×; earlier taps wait for 1.2 s.
    opening.onEnd = playEntry;
    if (opening.time < BEATS.normal.tapFrom) st.queued = true;
    else opening.speed = 4;
  }

  function createTimelines() {
    var B = BEATS[P.reduced ? 'reduced' : 'normal'];
    opening = M.timeline('opening', B.end, renderOpening);
    opening.at(B.tapFrom, function () { if (st.queued) opening.speed = 4; });
    entry = M.timeline('entry', B.entryEnd, renderEntry);
    entry.at(B.handover, handOver);
  }

  function testHooks() {
    var params = Invite.params;
    window.__mm = {
      policy: P, state: st, timelines: M.timelines,
      geo: function () { return geo; },
      tap: onTap,
      seek: function (name, t) {
        if (name === 'entry') { opening.pause().seek(opening.duration); entry.pause().seek(t); }
        else { entry.pause(); setEntryClasses(false, false, false); opening.pause().seek(t); }
      }
    };
    var tl = params.get('tl');
    if (tl) {
      window.__mm.seek(tl, parseFloat(params.get('t') || '0'));
      return true;
    }
    return false;
  }

  function init() {
    build();
    el.main.inert = true;
    try { st.returning = !P.test && localStorage.getItem('mogra-moti-opened') === '1'; } catch (e) {}
    el.button.addEventListener('click', onTap);

    if (Invite.params.has('open')) {
      root.classList.remove('is-covered');
      el.main.inert = false;
      Invite.welcome.render(99, P.reduced);
      M.fillAssets(document);
      return;
    }

    M.fillAssets(document).then(function (ext) {
      st.ext = ext;
      var urls = dressMaterials(ext);
      var images = Array.prototype.slice.call(document.querySelectorAll('.opening img, .beads img'));
      var fonts = ['300 100px Imbue', '520 11px Archivo', '440 16px Archivo'];
      return M.ready({ fonts: fonts, images: images, urls: urls, maxMs: P.test ? 0 : 1800 });
    }).then(function () {
      P.whenDecided(function (ok) {
        layout();
        createTimelines();
        Invite.welcome.layout();
        window.addEventListener('resize', debounce(function () {
          if (st.handed) return;
          layout();
          Invite.welcome.layout();
          if (st.entering) entry.seek(entry.time); else opening.seek(opening.time);
        }, 150));
        if (!ok) { opening.seek(opening.duration); window.__mm = { policy: P, state: st, ready: true }; return; }
        // Welcome's paper photograph is fetched while the opening plays, so it is decoded before the Draw.
        var photo = document.querySelector('.welcome-photo img');
        if (photo && photo.decode) photo.decode().catch(function () {});
        if (P.test && testHooks()) { window.__mm.ready = true; return; }
        if (P.test) window.__mm.ready = true;
        opening.seek(0).play(st.returning ? 1.6 : 1);
      });
    });
  }

  function debounce(fn, ms) {
    var id = 0;
    return function () { clearTimeout(id); id = setTimeout(fn, ms); };
  }

  Invite.opening = { init: init, tap: onTap };
})();
