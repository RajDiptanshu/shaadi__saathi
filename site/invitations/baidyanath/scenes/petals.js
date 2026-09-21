/* Lal & Sona · the fall.

   Marigold and rose petals, garland leaves and gold dust, on one 2-D canvas per field. A DOM node per particle is
   the classic way to make an invitation unusable on the phones it is actually opened on.

   What makes these read as petals and leaves rather than as confetti is the tumble. Each one turns
   about its own long axis, so it presents its face, thins to nothing edge-on, and opens out the other
   side. That instant of near-disappearance is the whole effect. Two things follow from it:

     · the sideways slip is driven by the same angle, ninety degrees out of phase, so a petal slides
       when it knifes through the air edge-on and stalls when it lies flat. An independent sine on x
       reads as wind, or as a bug;
     · both faces are baked, the back duller than the front, so it reads as a solid object turning
       rather than a flat cut-out spinning.

   Everything else — fall, roll, slip, scale, phase, opacity — varies per particle, or the field stops
   being petals and becomes a texture scrolling down the screen. The eye finds a shared rhythm in about
   two seconds. */
(function () {
  var Stage = window.Stage;
  var Invite = window.Invite;

  var SPRITE = 48;   // the size each sprite is baked at, and the largest any is drawn

  /* front, back. The back of a petal is always paler and greyer than its face. */
  var PETALS = [
    ['#F79F1A', '#C2700D'],   // marigold
    ['#FFC93C', '#D9A017'],   // turmeric
    ['#E0342B', '#A81F1B'],   // red rose
    ['#FF4E88', '#C2265C'],   // magenta
    ['#FFE3C2', '#D8B993']    // pale, to keep the field from turning into one colour
  ];
  /* Garland leaves — the green belongs on the flowers, never on the ground. */
  var LEAVES = [
    ['#3E7D4F', '#255036'],
    ['#4E9460', '#2E6040'],
    ['#2F6B45', '#1C4630']
  ];

  function canvas2d(size) {
    var c = document.createElement('canvas');
    c.width = c.height = size;
    return { c: c, x: c.getContext('2d') };
  }

  /* A rounded teardrop with a notch at the tip, and one crease down the middle so it has a spine. */
  function bakePetal(fill, shade) {
    var o = canvas2d(SPRITE), x = o.x, s = SPRITE;
    x.translate(s / 2, s / 2);
    x.beginPath();
    x.moveTo(0, s * 0.42);
    x.bezierCurveTo(s * 0.40, s * 0.22, s * 0.44, -s * 0.18, s * 0.06, -s * 0.44);
    x.bezierCurveTo(s * 0.02, -s * 0.38, -s * 0.02, -s * 0.38, -s * 0.06, -s * 0.44);
    x.bezierCurveTo(-s * 0.44, -s * 0.18, -s * 0.40, s * 0.22, 0, s * 0.42);
    x.closePath();
    x.fillStyle = fill;
    x.fill();
    x.beginPath();
    x.moveTo(0, s * 0.38);
    x.quadraticCurveTo(s * 0.04, 0, 0, -s * 0.40);
    x.strokeStyle = shade;
    x.globalAlpha = 0.42;
    x.lineWidth = s * 0.045;
    x.stroke();
    return o.c;
  }

  /* A pointed leaf with a midrib and three pairs of veins. */
  function bakeLeaf(fill, shade) {
    var o = canvas2d(SPRITE), x = o.x, s = SPRITE;
    x.translate(s / 2, s / 2);
    x.beginPath();
    x.moveTo(0, -s * 0.46);
    x.bezierCurveTo(s * 0.34, -s * 0.20, s * 0.30, s * 0.22, 0, s * 0.46);
    x.bezierCurveTo(-s * 0.30, s * 0.22, -s * 0.34, -s * 0.20, 0, -s * 0.46);
    x.closePath();
    x.fillStyle = fill;
    x.fill();
    x.strokeStyle = shade;
    x.globalAlpha = 0.5;
    x.lineWidth = s * 0.035;
    x.beginPath();
    x.moveTo(0, -s * 0.44);
    x.lineTo(0, s * 0.44);
    x.stroke();
    x.lineWidth = s * 0.022;
    for (var i = -1; i <= 1; i++) {
      var y = i * s * 0.17;
      x.beginPath();
      x.moveTo(0, y);
      x.quadraticCurveTo(s * 0.13, y + s * 0.05, s * 0.21, y + s * 0.13);
      x.moveTo(0, y);
      x.quadraticCurveTo(-s * 0.13, y + s * 0.05, -s * 0.21, y + s * 0.13);
      x.stroke();
    }
    return o.c;
  }

  /* A mote of gold dust: a soft disc with a hot centre. No tumble — dust has no faces. */
  function bakeMote() {
    var o = canvas2d(SPRITE), x = o.x, s = SPRITE, h = s / 2;
    var grad = x.createRadialGradient(h, h, 0, h, h, h);
    grad.addColorStop(0, 'rgba(255,248,220,.95)');
    grad.addColorStop(0.35, 'rgba(244,208,111,.58)');
    grad.addColorStop(1, 'rgba(244,208,111,0)');
    x.fillStyle = grad;
    x.fillRect(0, 0, s, s);
    return o.c;
  }

  var sprites = {
    petal: PETALS.map(function (p) { return { face: bakePetal(p[0], p[1]), back: bakePetal(p[1], p[0]), kind: 'petal' }; }),
    leaf: LEAVES.map(function (p) { return { face: bakeLeaf(p[0], p[1]), back: bakeLeaf(p[1], p[0]), kind: 'leaf' }; }),
    mote: (function () { var m = bakeMote(); return [{ face: m, back: m, kind: 'mote' }]; })()
  };

  /* Three depth bands. Far ones are small, slow and faint and sit behind the words; near ones are
     large, quick and cross in front of them. That crossing is the depth cue — two or three, never a
     curtain. */
  var BANDS = [
    { scale: [0.28, 0.46], fall: [24, 42], alpha: [0.26, 0.46], share: 0.44 },
    { scale: [0.50, 0.82], fall: [44, 74], alpha: [0.48, 0.74], share: 0.40 },
    { scale: [0.88, 1.22], fall: [82, 126], alpha: [0.52, 0.76], share: 0.16 }
  ];

  function pick(range) { return range[0] + Math.random() * (range[1] - range[0]); }

  function Field(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.opts = opts || {};
    this.mix = this.opts.mix || { petal: 0.5, leaf: 0.3, mote: 0.2 };
    this.pool = [];
    this.w = 0;
    this.h = 0;
    this.live = true;
    this.build();
  }

  Field.prototype.build = function () {
    var box = this.canvas.parentNode;
    var w = box ? box.clientWidth : window.innerWidth;
    var h = box ? box.clientHeight : window.innerHeight;
    /* A page laid out after this runs would otherwise leave the canvas 0 × 0 for ever. */
    if (w < 2 || h < 2) { this.w = 0; return; }

    this.w = w;
    this.h = h;
    var dpr = Stage.dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Count comes from viewport *area*, so a drift on a laptop does not arrive as a blizzard on a
       phone, and is then held under the tier's ceiling. */
    var ceiling = Stage.tier === 'low' ? 30 : Stage.phone ? 54 : 110;
    if (this.opts.dense) ceiling = Math.round(ceiling * 1.35);
    var n = Math.max(14, Math.min(Math.round((w * h) / 24000), ceiling));

    while (this.pool.length > n) this.pool.pop();
    while (this.pool.length < n) this.pool.push(this.spawn({}, true));
  };

  Field.prototype.spawn = function (p, initial) {
    var roll = Math.random();
    var band = roll < BANDS[0].share ? BANDS[0] : roll < BANDS[0].share + BANDS[1].share ? BANDS[1] : BANDS[2];

    var k = Math.random(), kind;
    if (k < this.mix.petal) kind = 'petal';
    else if (k < this.mix.petal + this.mix.leaf) kind = 'leaf';
    else kind = 'mote';

    var set = sprites[kind];
    p.sprite = set[(Math.random() * set.length) | 0];
    p.kind = kind;
    p.scale = pick(band.scale) * (kind === 'mote' ? 0.6 : 1);
    p.fall = pick(band.fall) * (kind === 'mote' ? 0.45 : 1);
    p.alpha = pick(band.alpha) * (kind === 'mote' ? 0.9 : 1);
    p.x = Math.random() * this.w;
    p.y = initial ? Math.random() * this.h : -SPRITE * p.scale;
    p.roll = Math.random() * Math.PI * 2;
    p.rollRate = (Math.random() - 0.5) * 0.7;
    p.spin = Math.random() * Math.PI * 2;
    p.spinRate = kind === 'mote' ? 0 : 0.5 + Math.random() * 1.5;
    p.slip = 14 + Math.random() * 48;
    p.drift = (Math.random() - 0.5) * 12;
    return p;
  };

  Field.prototype.step = function (dt) {
    if (!this.w) { this.build(); return; }
    var ctx = this.ctx, pool = this.pool, i, p;
    ctx.clearRect(0, 0, this.w, this.h);

    for (i = 0; i < pool.length; i++) {
      p = pool[i];
      p.spin += p.spinRate * dt;
      p.roll += p.rollRate * dt;
      p.y += p.fall * dt;
      /* The slip: fastest where cos(spin) is near zero, which is exactly where the petal is edge-on.
         Dust has no tumble, so it gets a plain drift instead. */
      p.x += (p.kind === 'mote' ? p.drift : Math.sin(p.spin) * p.slip) * dt;

      if (p.y - SPRITE > this.h) { this.spawn(p, false); continue; }
      if (p.x < -SPRITE) p.x += this.w + SPRITE * 2;
      else if (p.x > this.w + SPRITE) p.x -= this.w + SPRITE * 2;

      var turn = p.kind === 'mote' ? 1 : Math.cos(p.spin);
      var img = turn < 0 ? p.sprite.back : p.sprite.face;
      var s = SPRITE * p.scale;

      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.kind !== 'mote') {
        ctx.rotate(p.roll);
        ctx.scale(turn, 1);        // the tumble: crosses zero, so it goes edge-on
      }
      ctx.globalAlpha = p.alpha;
      ctx.drawImage(img, -s / 2, -s / 2, s, s);
      ctx.restore();
    }
  };

  /* One composed frame, for stills and card exports, rather than an empty canvas. */
  Field.prototype.still = function () {
    if (!this.w) this.build();
    if (this.w) this.step(0);
  };

  /* ---- wiring -------------------------------------------------------------------------------------- */

  var fields = [];

  function attach(mount, opts) {
    if (!mount) return null;
    var canvas = mount.querySelector('canvas');
    if (canvas) return null;
    canvas = document.createElement('canvas');
    canvas.className = 'fall-canvas';
    mount.appendChild(canvas);
    var field = new Field(canvas, opts);
    field.mount = mount;
    fields.push(field);

    /* Off-screen fields stop entirely. On a thermally limited phone this is the highest-leverage
       saving available and costs nothing visually. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { field.live = e.isIntersecting; });
      }, { rootMargin: '12% 0px' }).observe(mount);
    }
    if (Invite.still) field.still();
    return field;
  }

  window.Petals = {
    attach: attach,
    still: function () { fields.forEach(function (f) { f.still(); }); }
  };

  Stage.onMeasure(function () { fields.forEach(function (f) { f.build(); }); });
  Stage.onTier(function () { fields.forEach(function (f) { if (f.w) f.build(); }); });

  Stage.add(function (dt) {
    for (var i = 0; i < fields.length; i++) if (fields[i].live) fields[i].step(dt);
  });
})();
