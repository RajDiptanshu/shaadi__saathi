/* Kolam · everything after the threshold. Splits the names for the hero, draws the small kolams (each one
   traces itself when it comes into view, the way a hand would), keeps jasmine drifting down the page, draws
   the kasavu border with the scroll, and lets the camera move slowly over the photographs. Text never moves
   with the scroll; only the drawn kolams, the flowers and the photographs do. */
(function () {
  var Invite = window.Invite, P = Invite.motion.policy;
  var NS = 'http://www.w3.org/2000/svg';

  /* ───────── the hero's names, one word to a line ───────── */
  function split() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-split]'), function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach(function (word, i) {
        var w = document.createElement('span'), wi = document.createElement('span');
        w.className = 'w'; wi.className = 'wi'; wi.style.setProperty('--i', i); wi.textContent = word;
        w.appendChild(wi); el.appendChild(w);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }
  Invite.on('render', split);

  /* ───────── the small kolams: the threshold's geometry again, drawn when they arrive ───────── */
  var dividers = [];
  function buildDividers() {
    if (!window.Kolam) return;
    dividers = Array.prototype.map.call(document.querySelectorAll('.kolam-divider'), function (svg) {
      var dims = (svg.getAttribute('data-kolam') || '3,4').split(',').map(Number);
      var k = Kolam.build(dims[0], dims[1], 13, 7);
      svg.setAttribute('viewBox', '0 0 ' + k.width + ' ' + k.height);
      svg.style.width = Math.round(k.width * 1.25) + 'px';
      svg.innerHTML = '';
      var dots = k.dots.map(function (d) {
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', d.x);
        c.setAttribute('cy', d.y);
        c.setAttribute('r', '1.15');
        svg.appendChild(c);
        return c;
      });
      var paths = k.paths.map(function (d) {
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', d);
        svg.appendChild(path);
        return path;
      });
      return { svg: svg, dots: dots, paths: paths, drawn: false };
    });
  }

  /* Dots first, one after another, then each line traced in a single stroke. Reduced motion keeps the
     drawing — it is the whole idea of this design — and simply gets a much shorter cut of it. */
  function drawDivider(item) {
    if (item.drawn) return;
    item.drawn = true;
    if (!P.ok || !item.svg.animate) return;   // the finished kolam is the default state
    var slow = !P.reduced;
    var dotDur = slow ? 240 : 140, dotStep = slow ? 26 : 8, lineDur = slow ? 1100 : 420;
    item.dots.forEach(function (dot, i) {
      dot.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
        { duration: dotDur, delay: i * dotStep, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
    });
    var after = item.dots.length * dotStep + (slow ? 140 : 60);
    item.paths.forEach(function (path, i) {
      var len = path.getTotalLength();
      path.animate([
        { strokeDasharray: len + ' ' + len, strokeDashoffset: len },
        { strokeDasharray: len + ' ' + len, strokeDashoffset: 0 }
      ], { duration: lineDur, delay: after + i * (slow ? 300 : 110), easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'both' });
    });
  }

  /* ───────── jasmine: the one thing that keeps moving while the guest reads ───────── */
  function jasmine() {
    if (Invite.still || !document.body.animate) return;
    var field = document.createElement('div');
    field.className = 'petal-field';
    field.setAttribute('aria-hidden', 'true');
    document.body.appendChild(field);
    /* Reduced motion thins the fall and slows it right down rather than emptying the sky. */
    var count = P.reduced ? 5 : (window.innerWidth < 600 ? 12 : 18);
    var calm = P.reduced ? 0.35 : 1;
    for (var i = 0; i < count; i++) {
      var petal = document.createElement('i');
      var size = 5 + (i % 4) * 2;
      petal.className = 'petal petal-' + (i % 3);
      petal.style.left = ((i * 37 + 11) % 100) + '%';
      petal.style.width = size + 'px';
      petal.style.height = (size * 1.35).toFixed(1) + 'px';
      field.appendChild(petal);
      var drift = (i % 2 ? 46 : -38) * calm;
      petal.animate([
        { transform: 'translate3d(0,-6vh,0) rotate(0deg)', opacity: 0 },
        { transform: 'translate3d(' + (drift * 0.2).toFixed(1) + 'px,6vh,0) rotate(' + (60 * calm).toFixed(0) + 'deg)', opacity: 0.7, offset: 0.1 },
        { transform: 'translate3d(' + drift.toFixed(1) + 'px,52vh,0) rotate(' + (220 * calm).toFixed(0) + 'deg)', opacity: 0.6, offset: 0.55 },
        { transform: 'translate3d(' + (drift * -0.4).toFixed(1) + 'px,104vh,0) rotate(' + (430 * calm).toFixed(0) + 'deg)', opacity: 0 }
      ], {
        duration: (15 + (i % 5) * 3) * 1000 * (P.reduced ? 1.9 : 1),
        delay: -(i * 1700), iterations: Infinity, easing: 'linear'
      });
    }
  }

  /* ───────── the scroll: the zari border draws down the paper, the camera drifts over photographs ───────── */
  var borders = [], movers = [], ticking = false;
  function collect() {
    if (P.reduced) { borders = []; movers = []; return; }   // nothing here follows the scroll on a calm phone
    borders = Array.prototype.slice.call(document.querySelectorAll('[data-kasavu]'));
    movers = [
      { sel: '.venue-photo', travel: 0.08, zoom: 1.1 },
      { sel: '.blessing-photo', travel: 0.06, zoom: 1.08 },
      { sel: '.interlude-photo', travel: 0.1, zoom: 1.14 }
    ].map(function (m) {
      var box = document.querySelector(m.sel);
      return box ? { box: box, img: box.querySelector('img'), travel: m.travel, zoom: m.zoom } : null;
    }).filter(function (m) { return m && m.img; });
  }
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    borders.forEach(function (b) {
      var r = b.parentNode.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (r.height * 0.85)));
      b.style.setProperty('--p', p.toFixed(3));
    });
    movers.forEach(function (m) {
      var r = m.box.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      m.img.style.transform = 'translate3d(0,' + (-(p * m.travel * r.height)).toFixed(1) + 'px,0) scale(' + m.zoom + ')';
    });
    dividers.forEach(function (item) {
      if (item.drawn) return;
      var r = item.svg.getBoundingClientRect();
      if (r.top < vh * 0.88 && r.bottom > 0) drawDivider(item);
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  function start() {
    buildDividers();
    collect();
    var backTop = document.querySelector('.back-top');
    if (backTop) backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: P.reduced ? 'auto' : 'smooth' });
    });
    /* Whatever does not follow the scroll must already look finished: the zari drawn its full length. */
    function settleBorders() {
      Array.prototype.forEach.call(document.querySelectorAll('[data-kasavu]'), function (b) {
        b.style.setProperty('--p', '1');
      });
    }
    P.whenDecided(function (ok) {
      /* Reduced motion drops everything tied to the scroll position — the zari drawing itself down the
         page and the camera over the photographs — but keeps the kolams drawing and the jasmine falling. */
      if (P.reduced) settleBorders();
      if (!ok) {
        settleBorders();
        dividers.forEach(function (item) { item.drawn = true; });
        return;
      }
      jasmine();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () { collect(); onScroll(); });
      update();
    });
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
