/* Haveli · Scene 01 Opening. The choreography itself is CSS (scenes.css) keyed off html.motion-ok and
   core.js's is-pressing / is-opening / is-open. This file sets the entry's timing, decodes the corridor
   before the tap, and runs the one thing CSS can't: dust turning in the beam of light under the window. */
(function () {
  var Invite = window.Invite, P = Invite.motion.policy, root = document.documentElement;

  // is-opening at 120 ms (shutters start), is-open at 2.5 s (the sheet beneath takes over), cover gone at 3.4 s.
  Invite.timing = P.reduced ? { press: 120, open: 1300, done: 2100 } : { press: 120, open: 2500, done: 3400 };

  var beyond = document.querySelector('.beyond img');
  if (beyond && beyond.decode) beyond.decode().catch(function () {});

  if (Invite.params.has('open')) { root.classList.add('haveli-ready'); return; }

  /* ── dust ── */
  var canvas = document.querySelector('.dust');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = 1, motes = [], raf = 0, running = false, born = 0, fading = false, fadeAt = 0;
  var COUNT = 48;

  function size() {
    var box = canvas.parentNode.getBoundingClientRect();
    W = Math.round(box.width); H = Math.round(box.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  // The beam falls from the window's sill (46% down) toward the lower left; its centre line drifts left as it descends.
  function beamCentre(y) { return W * (0.5 - (y - 0.46 * H) / H * 0.42); }
  function spawn(m, top) {
    var y = top ? 0.46 * H + Math.random() * 0.08 * H : 0.46 * H + Math.random() * 0.54 * H;
    m.x = beamCentre(y) + (Math.random() - 0.5) * W * 0.6;
    m.y = y;
    m.r = 0.7 + Math.random() * 1.5;
    m.a = 0.22 + Math.random() * 0.5;
    m.vx = -0.06 - Math.random() * 0.1;
    m.vy = 0.06 + Math.random() * 0.14;
    m.ph = Math.random() * Math.PI * 2;
    return m;
  }
  function frame(now) {
    if (!running) return;
    if (!born) born = now;
    var life = Math.min(1, (now - born) / 1800);
    var fade = fading ? Math.max(0, 1 - (now - fadeAt) / 600) : 1;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];
      m.x += m.vx + Math.sin(now / 1700 + m.ph) * 0.09;
      m.y += m.vy + Math.cos(now / 2300 + m.ph) * 0.03;
      if (m.y > H + 4 || m.x < -4) spawn(m, true);
      var dx = Math.abs(m.x - beamCentre(m.y)) / (W * 0.34);
      var env = Math.max(0, 1 - dx * dx);
      var a = m.a * env * (0.7 + 0.3 * Math.sin(now / 900 + m.ph)) * life * fade;
      if (a <= 0.01) continue;
      ctx.fillStyle = 'rgba(255, 226, 180, ' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (fade <= 0) { running = false; ctx.clearRect(0, 0, W, H); return; }
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true; born = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  /* The frame stays dark until the fonts and the corridor have arrived and the policy has seen a frame run;
     only then do the "from" states apply, so the first thing seen is the sun coming out, not a jump. The
     question is asked after load, because asking while the page is still loading answers "no" on any
     phone that takes more than 300 ms to paint. */
  function decide() {
    P.whenDecided(function (ok) {
      root.classList.add('haveli-ready');
      if (!ok || P.reduced) return;
      size();
      for (var i = 0; i < COUNT; i++) motes.push(spawn({}, false));
      setTimeout(start, 1200);
      window.addEventListener('resize', function () { size(); });
      document.addEventListener('visibilitychange', function () {
        if (fading) return;
        if (document.hidden) stop(); else start();
      });
      Invite.on('open', function () { fading = true; fadeAt = performance.now(); });
    });
  }
  function whenLoaded(fn) {
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn);
  }
  whenLoaded(function () {
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fonts, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
      if (window.requestAnimationFrame) requestAnimationFrame(decide); else decide();
    });
  });
})();
