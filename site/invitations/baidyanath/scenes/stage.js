/* Baidyanath Dham · the stage.

   One requestAnimationFrame loop for the whole page, one device tier, one scroll read per frame. The
   failure this exists to prevent is the usual one: a petal loop, a parallax loop and a smooth-scroll
   library all ticking at once, each fine alone and together dropping frames on a ₹12,000 Android.

   Everything that moves subscribes here. Nothing else calls requestAnimationFrame.

   Layout is measured on resize and cached. Reading getBoundingClientRect inside the scroll path forces
   a synchronous layout on every frame, which is the single most expensive mistake available. */
(function () {
  var Invite = window.Invite;
  var Stage = window.Stage = {};
  var root = document.documentElement;

  /* ---- device tier --------------------------------------------------------------------------------- */

  var mem = navigator.deviceMemory || 4;
  var cores = navigator.hardwareConcurrency || 4;
  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  Stage.phone = coarse || window.innerWidth < 760;
  Stage.tier = (mem <= 3 || cores <= 4) ? 'low' : (mem >= 8 && cores >= 8) ? 'high' : 'mid';
  Stage.dpr = Math.min(window.devicePixelRatio || 1, Stage.tier === 'low' ? 1.5 : 2);

  var tierListeners = [];
  Stage.onTier = function (fn) { tierListeners.push(fn); fn(Stage.tier); };
  function setTier(tier) {
    if (tier === Stage.tier) return;
    Stage.tier = tier;
    Stage.dpr = Math.min(window.devicePixelRatio || 1, tier === 'low' ? 1.5 : 2);
    root.setAttribute('data-tier', tier);
    tierListeners.forEach(function (fn) { try { fn(tier); } catch (e) {} });
  }
  root.setAttribute('data-tier', Stage.tier);

  /* ---- the loop ------------------------------------------------------------------------------------ */

  var jobs = [];
  var running = false;
  var last = 0;
  var raf = 0;

  /* fn(dt, now) where dt is seconds, clamped so a stall never teleports anything. */
  Stage.add = function (fn) { jobs.push(fn); start(); return fn; };
  Stage.remove = function (fn) {
    var i = jobs.indexOf(fn);
    if (i >= 0) jobs.splice(i, 1);
  };

  /* Thermal throttling arrives after the page has loaded, so a one-off capability check is not enough:
     sample the first 90 frames after the opening and drop a tier if the median frame is too slow. */
  var samples = [], sampling = false;
  Stage.sample = function () { samples = []; sampling = true; };
  function judge(ms) {
    if (!sampling) return;
    samples.push(ms);
    if (samples.length < 90) return;
    sampling = false;
    var sorted = samples.slice().sort(function (a, b) { return a - b; });
    var median = sorted[Math.floor(sorted.length / 2)];
    if (median > 22) setTier(Stage.tier === 'high' ? 'mid' : 'low');
  }

  function frame(now) {
    if (!running) return;
    var dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    judge(last ? now - last : 16);
    last = now;
    for (var i = 0; i < jobs.length; i++) {
      try { jobs[i](dt, now); } catch (e) {}
    }
    raf = requestAnimationFrame(frame);
  }
  function start() {
    // ?still and the share-card renders want one settled frame, not a loop — a canvas that keeps
    // painting is also what makes headless screenshots of this page time out.
    if (running || !jobs.length || document.hidden || Invite.still) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }
  Stage.start = start;
  Stage.stop = stop;

  /* Guests tab away to WhatsApp constantly. A canvas still painting in a background tab drains the
     battery and gets the link closed. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  /* ---- scroll + layout cache ----------------------------------------------------------------------- */

  var vh = window.innerHeight;
  var vw = window.innerWidth;
  Stage.scrollY = window.pageYOffset || 0;
  Stage.vh = vh;

  var measurers = [];
  /* fn is called on resize, and once now, to re-cache anything derived from layout. */
  Stage.onMeasure = function (fn) { measurers.push(fn); fn(vw, vh); return fn; };

  var resizeTimer = 0;
  function measure() {
    vh = Stage.vh = window.innerHeight;
    vw = window.innerWidth;
    Stage.phone = coarse || vw < 760;
    measurers.forEach(function (fn) { try { fn(vw, vh); } catch (e) {} });
  }
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 160);
  }, { passive: true });
  window.addEventListener('orientationchange', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 220);
  }, { passive: true });

  window.addEventListener('scroll', function () {
    Stage.scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  }, { passive: true });

  /* ---- parallax ------------------------------------------------------------------------------------ */

  /* Each world layer carries a depth: 0 is the sky, 1 is at the reader's nose. The pivot sits at about
     depth .71, where a layer tracks the page exactly; everything behind it lags and everything in front
     of it runs ahead. That crossing is what the eye reads as looking *through* a scene rather than at a
     picture of one.

     Only transform is written, and only when the scene is actually near the viewport. */
  var scenes = [];

  Stage.parallax = function (mount, options) {
    if (!mount) return;
    var opts = options || {};
    var layers = Array.prototype.slice.call(mount.querySelectorAll('.world-layer')).map(function (node) {
      var depth = parseFloat(node.getAttribute('data-depth')) || 0;
      return { node: node, lag: 1 - depth * 1.4, last: null };
    });
    if (!layers.length) return;

    var entry = {
      mount: mount,
      layers: layers,
      range: opts.range == null ? 14 : opts.range,  // per cent of the scene's own height
      section: mount.closest ? mount.closest('.stage') : null,
      top: 0, height: 1, visible: false
    };
    scenes.push(entry);

    Stage.onMeasure(function () {
      var box = mount.getBoundingClientRect();
      entry.top = box.top + (window.pageYOffset || 0);
      entry.height = box.height || 1;
    });
    return entry;
  };

  /* Only the scene nearest the middle of the screen keeps its layers on the compositor.

     This is the fix for a reload loop on iOS. Each layer is 116% × 128% of a full-screen section, so
     at DPR 3 one promoted layer costs roughly 16 MB of backing store. Promoting every *live* scene
     meant up to twenty at once — about 250 MB — and iOS answers that by discarding the tab and
     reloading it, which looked like the page refreshing itself every time you reached the note.
     One scene's worth is five layers, and the neighbours still move; they are just not held in
     video memory while they do it. */
  function drive() {
    var y = Stage.scrollY, h = Stage.vh, i, s;
    var mid = y + h / 2;
    var front = null, bestDist = Infinity;

    for (i = 0; i < scenes.length; i++) {
      s = scenes[i];
      /* Cheap cull: a scene more than two screens away is not touched at all.

         Ahead is two full screens, not one — because "near" is also what lifts a scene's
         content-visibility: auto (base.css, `.stage:not(.is-near)`), and that is the switch that
         makes the browser lay out and rasterise the scene's SVG background for the first time. Each
         background is 100–200 overlapping gradient shapes; on a modern GPU that is unmeasurable, but
         on the weak fill-rate of a budget Android GPU it can take seconds. At a screen of lead time
         that cost lands in the middle of the user's swipe and reads as the page freezing. Two screens
         of lead time moves it earlier, while the guest is still reading the previous scene, so the
         browser has idle frames to spend it in rather than paying it all at once mid-gesture. */
      var near = s.top - y < h * 2 && s.top + s.height - y > -h * 0.25;
      if (!near) {
        if (s.visible) {
          s.visible = false;
          s.mount.classList.remove('is-live', 'is-front');
          if (s.section) s.section.classList.remove('is-near');
        }
        continue;
      }
      if (!s.visible) {
        s.visible = true;
        s.mount.classList.add('is-live');
        if (s.section) s.section.classList.add('is-near');
      }

      var dist = Math.abs(s.top + s.height / 2 - mid);
      if (dist < bestDist) { bestDist = dist; front = s; }

      /* 0 as the scene's top reaches the bottom of the screen, 1 as its bottom leaves the top. */
      var p = (y + h - s.top) / (h + s.height);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      var base = (p - 0.5) * s.range;
      for (var j = 0; j < s.layers.length; j++) {
        var L = s.layers[j];
        var shift = Math.round(base * L.lag * 100) / 100;
        if (L.last === shift) continue;   // most frames move most layers by nothing
        L.last = shift;
        L.node.style.transform = 'translate3d(0,' + shift + '%,0)';
      }
    }

    if (front !== Stage._front) {
      if (Stage._front) Stage._front.mount.classList.remove('is-front');
      if (front) front.mount.classList.add('is-front');
      Stage._front = front;
    }
  }

  Stage.add(drive);

  /* Stills and the card renders want one settled frame, not a loop. */
  Stage.settle = function () {
    measure();
    Stage.scrollY = window.pageYOffset || 0;
    drive();
  };

  Invite.on('opened', function () {
    measure();
    Stage.sample();
  });
})();
