/* Kolam · Scene 01 The threshold. The kolam is drawn as a hand would draw it: the dots go down one by one,
   row by row; then the first line is drawn in one unbroken stroke, then the second, a flour glow travelling
   with the drawing tip. One seekable timeline (engine/motion/timeline.js) renders every frame from t alone.
   The light, the words and the step over the threshold are CSS (scenes.css) keyed off html.motion-ok and
   core.js's is-pressing / is-opening / is-open. */
(function () {
  var Invite = window.Invite, M = Invite.motion, P = M.policy, root = document.documentElement;
  var NS = 'http://www.w3.org/2000/svg';
  var seg = M.seg;

  Invite.timing = P.reduced ? { press: 120, open: 1300, done: 2100 } : { press: 120, open: 2600, done: 3500 };

  /* The room beyond is fetched once the kolam is drawn (or at the touch, if that comes first), so it never
     competes with the first frame. */
  var roomLoaded = false;
  function loadRoom() {
    if (roomLoaded) return;
    roomLoaded = true;
    document.querySelectorAll('source[data-srcset]').forEach(function (s) { s.srcset = s.getAttribute('data-srcset'); });
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      img.src = img.getAttribute('data-src');
      if (img.decode) img.decode().catch(function () {});
    });
  }

  if (Invite.still) loadRoom();
  var svg = document.querySelector('.kolam');
  if (!svg || !window.Kolam) { root.classList.add('kolam-ready', 'is-drawn'); loadRoom(); return; }
  if (Invite.params.has('open')) { root.classList.add('kolam-ready', 'is-drawn'); loadRoom(); return; }

  var GRID = [5, 6];
  /* Beats in seconds. Normal: the last line closes at 5.0 s, the names follow; ~6.4 s to the invitation to touch. */
  var BEATS = {
    normal: { dotsFrom: 0.5, dotStep: 0.045, dotDur: 0.5, line1: [2.0, 2.2], line2: [3.9, 1.8], drawn: 5.0, end: 6.6 },
    reduced: { dotsFrom: 0.1, dotStep: 0.012, dotDur: 0.3, line1: [0.5, 0.6], line2: [1.1, 0.6], drawn: 1.4, end: 1.9 }
  };
  var dotsG = svg.querySelector('.kdots'), lines = [svg.querySelector('.kline-1'), svg.querySelector('.kline-2')], tip = svg.querySelector('.ktip');
  var built = null, lens = [0, 0], dots = [], radius = 2, tl = null;

  function layout() {
    var frame = svg.parentNode.getBoundingClientRect();
    var s = Math.max(34, Math.min(60, Math.round(frame.width * 0.135)));
    built = Kolam.build(GRID[0], GRID[1], s, s * 0.7);
    svg.setAttribute('viewBox', '0 0 ' + built.width + ' ' + built.height);
    svg.style.width = built.width + 'px';
    svg.style.height = built.height + 'px';
    radius = Math.max(1.8, s * 0.055);
    dotsG.innerHTML = '';
    dots = built.dots.map(function (d) {
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('class', 'kdot');
      c.setAttribute('cx', d.x.toFixed(2));
      c.setAttribute('cy', d.y.toFixed(2));
      c.setAttribute('r', radius.toFixed(2));
      dotsG.appendChild(c);
      return c;
    });
    lines.forEach(function (p, i) {
      p.setAttribute('d', built.paths[i]);
      lens[i] = p.getTotalLength();
      p.style.strokeDasharray = lens[i] + ' ' + lens[i];
      p.style.strokeWidth = Math.max(2.4, s * 0.072).toFixed(2);
    });
    tip.setAttribute('r', Math.max(6, s * 0.2).toFixed(1));
  }

  function render(t) {
    var K = BEATS[P.reduced ? 'reduced' : 'normal'], i, p;
    for (i = 0; i < dots.length; i++) {
      p = seg(t, K.dotsFrom + i * K.dotStep, K.dotDur, 'settle');
      dots[i].setAttribute('r', (radius * p).toFixed(2));
    }
    var p1 = seg(t, K.line1[0], K.line1[1], 'silk'), p2 = seg(t, K.line2[0], K.line2[1], 'silk');
    lines[0].style.strokeDashoffset = (lens[0] * (1 - p1)).toFixed(1);
    lines[1].style.strokeDashoffset = (lens[1] * (1 - p2)).toFixed(1);
    var active = p1 < 1 ? 0 : (p2 < 1 ? 1 : -1), prog = active === 0 ? p1 : p2;
    if (active >= 0 && prog > 0 && lens[active]) {
      var pt = lines[active].getPointAtLength(prog * lens[active]);
      tip.setAttribute('cx', pt.x.toFixed(1));
      tip.setAttribute('cy', pt.y.toFixed(1));
      tip.style.opacity = (0.4 + 0.6 * Math.sin(Math.PI * prog)).toFixed(3);
    } else {
      tip.style.opacity = '0';
    }
  }

  function finish() {
    render(999);
    root.classList.add('is-drawn');
    loadRoom();
  }

  /* Asked after load and fonts, so the policy never answers "no" just because the page was still loading. */
  function decide() {
    P.whenDecided(function (ok) {
      layout();
      root.classList.add('kolam-ready');
      if (!ok) return finish();
      var K = BEATS[P.reduced ? 'reduced' : 'normal'];
      tl = M.timeline('opening', K.end, render);
      tl.at(K.drawn, function () { root.classList.add('is-drawn'); loadRoom(); });
      tl.seek(0).play();
      window.addEventListener('resize', function () { layout(); if (tl) tl.seek(tl.time); });
    });
  }
  // The threshold is drawn, not photographed, so it waits only for the fonts and one real frame — never for
  // the page's photographs, which would hold the first paint for seconds on a phone.
  var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise(function (r) { setTimeout(r, 700); })]).then(function () {
    if (window.requestAnimationFrame) requestAnimationFrame(decide); else decide();
  });

  /* A touch mid-drawing finishes the kolam at once; the step over it follows on core.js's timing. */
  Invite.on('open', function () {
    loadRoom();
    if (tl && tl.time < tl.duration) { tl.pause(); finish(); }
  });
})();
