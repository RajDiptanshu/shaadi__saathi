/* Haveli Jharokha: places the artwork, opens the shutters, flies the kites,
   sparkles like mirror-work where a guest taps, and turns the sky to night at the end. */
(function () {
  var Invite = window.Invite;
  var Art = window.HaveliArt;
  var data = Invite.data;
  var root = document.documentElement;

  Invite.timing = { press: 450, open: 1900, done: 3600 };

  document.getElementById('art-sprite').innerHTML = Art.sprite();
  var CAP = (function () {
    // The arch rises about 220 units above its springing line, so the cap is 234 units tall.
    var fill = Art.archPath(320, 232, 234, { round: 0.72, lobes: 3.5, depth: 9 });
    var line = Art.archLine(320, 232, 234, { round: 0.72, lobes: 3.5, depth: 9 });
    var inner = Art.archLine(296, 226, 222, { round: 0.72, lobes: 3.5, depth: 8 }, 12, 12);
    return '<svg viewBox="0 0 320 234" aria-hidden="true"><path class="cap-fill" d="' + fill + '"/>' +
      '<path class="cap-line" d="' + line + '" vector-effect="non-scaling-stroke"/>' +
      '<path class="cap-inner" d="' + inner + '" vector-effect="non-scaling-stroke"/></svg>';
  })();

  function draw(scope) {
    scope.querySelectorAll('[data-art]:empty').forEach(function (el) {
      var type = el.getAttribute('data-art');
      if (type === 'palace') el.innerHTML = Art.palace();
      else if (type === 'frame') el.innerHTML = Art.frame();
      else if (type === 'shutter-l') el.innerHTML = Art.shutter('l');
      else if (type === 'shutter-r') el.innerHTML = Art.shutter('r');
      else if (type === 'cap') el.innerHTML = CAP;
    });
  }
  draw(document);

  /* A painted cover, when there is one, replaces the drawn palace. */
  if (data.art && data.art.cover) {
    document.querySelector('.scene .painting').style.backgroundImage = 'url("' + data.art.cover + '")';
    root.classList.add('has-painting');
  }

  /* Kites crossing the dusk sky */
  var KITES = [['#D6336C', '#F4C21B'], ['#E8A23A', '#2F3A6E'], ['#1F6F6B', '#F3DEC4'], ['#F4C21B', '#B3122E']];
  var kiteBox = document.querySelector('.kites');
  KITES.forEach(function (c, i) {
    var kite = document.createElement('span');
    kite.className = 'kite kite-' + (i + 1);
    kite.innerHTML = Art.kite(c[0], c[1]);
    kiteBox.appendChild(kite);
  });

  /* A carved rosette heads each ceremony, with a petal count of its own. */
  var PETALS = { tilak: 8, sangeet: 12, pithi: 6, baraat: 10, pheras: 8, reception: 16 };
  function f(n) { return Math.round(n * 10) / 10; }
  function rosette(petals, ring) {
    var d = '', inner = 8.5, outer = 21, half = Math.PI / petals;
    for (var i = 0; i < petals; i++) {
      var a = (Math.PI * 2 * i) / petals - Math.PI / 2;
      var x1 = 24 + Math.cos(a) * inner, y1 = 24 + Math.sin(a) * inner;
      var x2 = 24 + Math.cos(a) * outer, y2 = 24 + Math.sin(a) * outer;
      var c1x = 24 + Math.cos(a - half) * outer * 0.74, c1y = 24 + Math.sin(a - half) * outer * 0.74;
      var c2x = 24 + Math.cos(a + half) * outer * 0.74, c2y = 24 + Math.sin(a + half) * outer * 0.74;
      d += 'M' + f(x1) + ',' + f(y1) + 'Q' + f(c1x) + ',' + f(c1y) + ' ' + f(x2) + ',' + f(y2) +
        'Q' + f(c2x) + ',' + f(c2y) + ' ' + f(x1) + ',' + f(y1) + 'Z';
    }
    return '<svg viewBox="0 0 48 48"><path d="' + d + '"/><circle cx="24" cy="24" r="4"/>' +
      (ring ? '<circle cx="24" cy="24" r="23" stroke-opacity=".55"/>' : '') + '</svg>';
  }

  /* Ceremony ornaments, and a "Day 1 / 2 / 3" marker wherever the date changes. */
  Invite.on('render', function () {
    draw(document);
    var lastDay = '', n = 0;
    document.querySelectorAll('.event[data-from="events"]').forEach(function (li) {
      var ev = data.events[+li.getAttribute('data-index')];
      var motif = li.querySelector('[data-motif]');
      if (motif && !motif.firstChild) motif.innerHTML = rosette(PETALS[ev.id] || 8, !!ev.major);
      var day = ev.start.slice(0, 10);
      li.classList.toggle('major', !!ev.major);
      if (day !== lastDay) {
        n++;
        lastDay = day;
        li.classList.add('new-day');
        li.setAttribute('data-day', Invite.t(data.dayLabel).replace('{n}', n));
      }
    });
  });

  /* Mirror-work sparkle wherever a guest taps (not on form fields). */
  function sparkle(x, y, count) {
    for (var i = 0; i < count; i++) {
      var s = document.createElement('i');
      var angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
      var dist = 26 + Math.random() * 34;
      s.className = 'glint-burst';
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--x', (Math.cos(angle) * dist).toFixed(1) + 'px');
      s.style.setProperty('--y', (Math.sin(angle) * dist).toFixed(1) + 'px');
      s.style.setProperty('--s', (0.6 + Math.random() * 0.7).toFixed(2));
      document.body.appendChild(s);
      setTimeout(function (el) { el.remove(); }.bind(null, s), 900);
    }
  }
  document.addEventListener('pointerdown', function (event) {
    if (Invite.still || event.target.closest('input, textarea, button, a, label, .lang')) {
      if (!event.target.closest('#open-invite')) return;
    }
    sparkle(event.clientX, event.clientY, event.target.closest('#open-invite') ? 12 : 7);
  }, { passive: true });

  /* The palace belongs to the opening and the closing, and the sky deepens to night at the end.
     Both are worked out from the scroll position rather than from IntersectionObserver or
     requestAnimationFrame, because some phones and preview panes never run either, and losing
     the night ending would cost the invitation its last moment. */
  var hero = document.querySelector('.hero');
  var closing = document.querySelector('.closing');
  var lastRun = 0, watchTimer = 0;
  function watchScroll() {
    lastRun = Date.now();
    var vh = window.innerHeight;
    if (hero) root.classList.toggle('past-hero', hero.getBoundingClientRect().bottom < vh * 0.4);
    if (closing) {
      var r = closing.getBoundingClientRect();
      root.classList.toggle('is-night', r.top < vh * 0.75 && r.bottom > 0);
    }
  }
  function queueWatch() {
    clearTimeout(watchTimer);
    if (Date.now() - lastRun > 80) watchScroll();
    else watchTimer = setTimeout(watchScroll, 80);
  }
  window.addEventListener('scroll', queueWatch, { passive: true });
  window.addEventListener('resize', queueWatch);
  Invite.on('ready', watchScroll);
  Invite.on('opened', watchScroll);
  watchScroll();
})();
