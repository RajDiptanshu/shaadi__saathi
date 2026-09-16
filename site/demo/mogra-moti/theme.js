/* Mogra & Moti: draws the pearl curtains and the bow, parts them on the opening tap,
   drifts mogra buds down the page, and fills the pearl rail as the guest reads the weekend. */
(function () {
  var Invite = window.Invite;
  var Art = window.MograArt;
  var data = Invite.data;
  var root = document.documentElement;

  Invite.timing = { press: 420, open: 1800, done: 3400 };

  document.getElementById('art-sprite').innerHTML = Art.sprite();
  function draw(scope) {
    scope.querySelectorAll('[data-art]:empty').forEach(function (el) {
      var type = el.getAttribute('data-art');
      // Six strings a side: enough to read as a curtain, open enough to see through.
      if (type === 'curtain-l') el.innerHTML = Art.pearlCurtain('l', 6);
      else if (type === 'curtain-r') el.innerHTML = Art.pearlCurtain('r', 6);
      else if (type === 'bow') el.innerHTML = Art.bow();
      else if (type === 'mandap') el.innerHTML = Art.mandap();
      else if (type === 'sprig') el.innerHTML = Art.sprig();
    });
  }
  draw(document);
  Invite.on('render', function () {
    draw(document);
    // The wedding and the reception are marked on the rail.
    document.querySelectorAll('.ev[data-from="events"]').forEach(function (li) {
      var ev = data.events[+li.getAttribute('data-index')];
      li.classList.toggle('major', !!ev.major);
    });
  });

  /* A painted mandap, when there is one, replaces the drawn flowers. */
  if (data.art && data.art.cover) {
    document.querySelector('.hero .painting').style.backgroundImage = 'url("' + data.art.cover + '")';
    root.classList.add('has-painting');
  }

  /* The pearl rail fills as the weekend scrolls past. Worked out from the scroll position,
     because preview panes and battery-saving phones don't always run animation frames. */
  var rail = document.querySelector('.rail');
  var lastRun = 0, railTimer = 0;
  function updateRail() {
    lastRun = Date.now();
    if (!rail) return;
    if (Invite.still) { rail.style.setProperty('--progress', 1); return; }
    var r = rail.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (window.innerHeight * 0.68 - r.top) / r.height));
    rail.style.setProperty('--progress', p.toFixed(3));
  }
  function queueRail() {
    clearTimeout(railTimer);
    if (Date.now() - lastRun > 80) updateRail();
    else railTimer = setTimeout(updateRail, 80);
  }
  window.addEventListener('scroll', queueRail, { passive: true });
  window.addEventListener('resize', queueRail);
  Invite.on('ready', updateRail);
  Invite.on('opened', updateRail);

  /* Mogra buds: a shower as the curtains part, then a few drifting while you read. */
  function makeCanvas(cls) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return null;
    canvas.className = cls;
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    return { canvas: canvas, ctx: ctx };
  }
  function bud(ctx, ratio, p, elapsed) {
    var x = p.x + Math.sin(elapsed / 900 + p.phase) * p.sway;
    var flip = 0.4 + 0.6 * Math.abs(Math.cos(elapsed / 620 + p.phase));
    ctx.setTransform(ratio, 0, 0, ratio, x * ratio, p.y * ratio);
    ctx.rotate(p.angle);
    ctx.scale(flip, 1);
    ctx.fillStyle = p.colour;
    for (var i = 0; i < 5; i++) {
      var a = (Math.PI * 2 * i) / 5;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * p.size * 0.5, Math.sin(a) * p.size * 0.5, p.size * 0.5, p.size * 0.38, a, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  var COLOURS = ['#FFFFFF', '#FFFDF8', '#F6EEE6', '#F4E2DD'];
  function newBud(w, h, anywhere) {
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -24 - Math.random() * 80,
      size: 5 + Math.random() * 5,
      fall: 20 + Math.random() * 26,
      sway: 12 + Math.random() * 26,
      phase: Math.random() * 6.3,
      spin: (Math.random() - 0.5) * 1.2,
      angle: Math.random() * 3.1,
      colour: COLOURS[Math.floor(Math.random() * COLOURS.length)]
    };
  }
  function budBurst() {
    var c = makeCanvas('buds');
    if (!c) return;
    var ratio = Math.min(window.devicePixelRatio || 1, 2), w = window.innerWidth, h = window.innerHeight;
    c.canvas.width = Math.round(w * ratio);
    c.canvas.height = Math.round(h * ratio);
    var flakes = [], count = Math.round(Math.min(90, Math.max(45, w * h / 8000)));
    for (var i = 0; i < count; i++) {
      var p = newBud(w, h, false);
      p.y = -30 - Math.random() * h * 0.9;
      p.fall = 70 + Math.random() * 110;
      flakes.push(p);
    }
    var start = performance.now(), last = start;
    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000), elapsed = now - start;
      last = now;
      c.ctx.setTransform(1, 0, 0, 1, 0, 0);
      c.ctx.clearRect(0, 0, c.canvas.width, c.canvas.height);
      c.ctx.globalAlpha = elapsed > 4200 ? Math.max(0, 1 - (elapsed - 4200) / 1200) : 1;
      flakes.forEach(function (p) { p.y += p.fall * dt; p.angle += p.spin * dt; bud(c.ctx, ratio, p, elapsed); });
      if (elapsed < 5400) requestAnimationFrame(frame); else c.canvas.remove();
    }
    requestAnimationFrame(frame);
  }
  function ambientBuds() {
    var c = makeCanvas('buds ambient');
    if (!c) return;
    var ratio = Math.min(window.devicePixelRatio || 1, 2), w = 0, h = 0, flakes = [], last = 0, start = performance.now();
    function size() {
      w = window.innerWidth; h = window.innerHeight;
      c.canvas.width = Math.round(w * ratio);
      c.canvas.height = Math.round(h * ratio);
    }
    size();
    window.addEventListener('resize', size);
    for (var i = 0; i < 8; i++) flakes.push(newBud(w, h, true));
    function frame(now) {
      requestAnimationFrame(frame);
      if (document.hidden || (last && now - last < 33)) return;
      var dt = last ? Math.min(0.1, (now - last) / 1000) : 0.033, elapsed = now - start;
      last = now;
      c.ctx.setTransform(1, 0, 0, 1, 0, 0);
      c.ctx.clearRect(0, 0, c.canvas.width, c.canvas.height);
      c.ctx.globalAlpha = 0.85;
      for (var j = 0; j < flakes.length; j++) {
        var p = flakes[j];
        p.y += p.fall * dt;
        p.angle += p.spin * dt;
        if (p.y > h + 24) p = flakes[j] = newBud(w, h, false);
        bud(c.ctx, ratio, p, elapsed);
      }
    }
    requestAnimationFrame(frame);
  }

  Invite.on('opening', function () { if (!Invite.still) budBurst(); });
  Invite.on('opened', function (detail) { if (!Invite.still && !(detail && detail.instant)) ambientBuds(); });
})();
