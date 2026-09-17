/* Invite Studio motion: timelines.
   A timeline is a pure function of time: render(t) sets every animated property from t alone. That makes any
   frame exactly seekable for the evaluation loop (?test&tl=<name>&t=<s>) and lets a tap fast-forward safely.
   Easing tokens match wedding-motion §3 (CSS cubic-bezier values; GSAP names in comments). */
(function () {
  var M = window.Invite.motion;

  /* Cubic-bezier easing, solved like the browser's own (Newton steps, then bisection). */
  function bezier(x1, y1, x2, y2) {
    var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    var cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    function sx(t) { return ((ax * t + bx) * t + cx) * t; }
    function sy(t) { return ((ay * t + by) * t + cy) * t; }
    function dx(t) { return (3 * ax * t + 2 * bx) * t + cx; }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var t = x, i, e, d;
      for (i = 0; i < 8; i++) {
        e = sx(t) - x;
        if (Math.abs(e) < 1e-6) return sy(t);
        d = dx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= e / d;
      }
      var lo = 0, hi = 1;
      t = x;
      for (i = 0; i < 40; i++) {
        e = sx(t);
        if (Math.abs(e - x) < 1e-6) break;
        if (x > e) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return sy(t);
    };
  }

  M.ease = {
    linear: function (p) { return p; },
    settle: bezier(0.16, 1, 0.3, 1),     // expo.out — things coming to rest
    tension: bezier(0.7, 0, 0.84, 0),    // expo.in — a thread tightening
    release: bezier(0.34, 1.3, 0.64, 1), // back.out(1.2) — the thread's release only
    silk: bezier(0.45, 0.05, 0.25, 1),   // power2.inOut — fabric
    camera: bezier(0.65, 0, 0.35, 1),    // power3.inOut — dolly, push, the sheet's travel
    light: bezier(0.37, 0, 0.63, 1)      // sine.inOut — light and grade
  };

  M.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  M.lerp = function (a, b, p) { return a + (b - a) * p; };
  /* Eased progress of a beat that starts at `start` and lasts `dur` seconds. */
  M.seg = function (t, start, dur, ease) {
    var p = dur > 0 ? M.clamp((t - start) / dur, 0, 1) : (t >= start ? 1 : 0);
    return (M.ease[ease] || M.ease.linear)(p);
  };

  function Timeline(name, duration, render) {
    this.name = name;
    this.duration = duration;
    this.render = render;
    this.time = 0;
    this.speed = 1;
    this.playing = false;
    this.marks = [];
    this.onEnd = null;
    this._raf = 0;
  }
  /* A mark runs once when playback passes its time (never when seeking). */
  Timeline.prototype.at = function (time, fn) { this.marks.push({ time: time, fn: fn, done: false }); return this; };
  Timeline.prototype.seek = function (t) {
    this.time = M.clamp(t, 0, this.duration);
    this.render(this.time);
    return this;
  };
  Timeline.prototype.play = function (speed) {
    var self = this, last = null;
    if (speed) this.speed = speed;
    if (this.playing) return this;
    this.playing = true;
    function frame(now) {
      if (!self.playing) return;
      // Long gaps (a hidden tab) resume where they left off instead of jumping.
      var dt = last == null ? 0 : Math.min((now - last) / 1000, 0.05);
      last = now;
      var t = Math.min(self.time + dt * self.speed, self.duration);
      self.seek(t);
      self.marks.forEach(function (m) {
        if (!m.done && t >= m.time) { m.done = true; m.fn(); }
      });
      if (t >= self.duration) {
        self.playing = false;
        if (self.onEnd) self.onEnd();
        return;
      }
      self._raf = requestAnimationFrame(frame);
    }
    this._raf = requestAnimationFrame(frame);
    return this;
  };
  Timeline.prototype.pause = function () {
    this.playing = false;
    cancelAnimationFrame(this._raf);
    return this;
  };

  M.timelines = {};
  M.timeline = function (name, duration, render) {
    return (M.timelines[name] = new Timeline(name, duration, render));
  };
  M.seek = function (name, t) {
    var tl = M.timelines[name];
    if (tl) tl.pause().seek(t);
  };
})();
