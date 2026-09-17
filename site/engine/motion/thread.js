/* Invite Studio motion: thread.
   Curves for the silk thread (cubic Béziers built from a chord and a bow), arc-length sampling so beads sit on
   the thread by distance, and an SVG thread made of contact shadow, champagne core and highlight strokes. */
(function () {
  var M = window.Invite.motion;

  function pt(x, y) { return { x: x, y: y }; }

  var C = M.curve = {
    /* A cubic whose control points sit on the chord's thirds, pushed `bow` px along the chord's normal.
       Its point at t is p0 + t·(p3 − p0) + 3t(1 − t)·bow·n, which keeps chord and bow independent. */
    line: function (p0, p3, bow) {
      var dx = p3.x - p0.x, dy = p3.y - p0.y, len = Math.hypot(dx, dy) || 1;
      var nx = -dy / len, ny = dx / len;
      return [pt(p0.x, p0.y), pt(p0.x + dx / 3 + nx * bow, p0.y + dy / 3 + ny * bow),
        pt(p0.x + 2 * dx / 3 + nx * bow, p0.y + 2 * dy / 3 + ny * bow), pt(p3.x, p3.y)];
    },
    /* The bow that makes a chord-based cubic pass exactly through point w. */
    bowThrough: function (p0, p3, w) {
      var dx = p3.x - p0.x, dy = p3.y - p0.y, len = Math.hypot(dx, dy) || 1;
      var ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
      var t = ((w.x - p0.x) * ux + (w.y - p0.y) * uy) / len;
      t = Math.min(0.95, Math.max(0.05, t));
      return ((w.x - p0.x) * nx + (w.y - p0.y) * ny) / (3 * t * (1 - t));
    },
    mix: function (a, b, p) {
      return a.map(function (q, i) { return pt(q.x + (b[i].x - q.x) * p, q.y + (b[i].y - q.y) * p); });
    },
    point: function (c, t) {
      var u = 1 - t, a = u * u * u, b = 3 * u * u * t, d = 3 * u * t * t, e = t * t * t;
      return pt(a * c[0].x + b * c[1].x + d * c[2].x + e * c[3].x, a * c[0].y + b * c[1].y + d * c[2].y + e * c[3].y);
    },
    /* Samples n+1 points with cumulative arc length. */
    sample: function (c, n) {
      var pts = [], len = 0, prev = null, i, p;
      for (i = 0; i <= n; i++) {
        p = C.point(c, i / n);
        if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
        p.s = len;
        pts.push(p);
        prev = p;
      }
      return { pts: pts, len: len };
    },
    /* Position and direction at arc length s; beyond either end it continues along the end tangent. */
    at: function (lut, s) {
      var pts = lut.pts, n = pts.length - 1, a, b, f;
      if (s <= 0) { a = pts[0]; b = pts[1]; f = s / (b.s - a.s); }
      else if (s >= lut.len) { a = pts[n - 1]; b = pts[n]; f = 1 + (s - b.s) / (b.s - a.s); }
      else {
        var lo = 0, hi = n;
        while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (pts[mid].s < s) lo = mid; else hi = mid; }
        a = pts[lo]; b = pts[hi]; f = (s - a.s) / ((b.s - a.s) || 1);
      }
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, a: Math.atan2(b.y - a.y, b.x - a.x) };
    },
    /* Arc length of the sampled point nearest to p. */
    nearest: function (lut, p) {
      var best = 0, bd = Infinity;
      lut.pts.forEach(function (q) { var d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = q.s; } });
      return best;
    },
    /* First arc length after `from` where the thread rises to height y. */
    atHeight: function (lut, y, from) {
      var pts = lut.pts, i;
      for (i = 1; i < pts.length; i++) {
        if (pts[i].s > from && pts[i].y <= y && pts[i - 1].y > y) {
          var f = (pts[i - 1].y - y) / (pts[i - 1].y - pts[i].y);
          return pts[i - 1].s + (pts[i].s - pts[i - 1].s) * f;
        }
      }
      return from;
    },
    d: function (c) {
      function f(n) { return Math.round(n * 10) / 10; }
      return 'M' + f(c[0].x) + ',' + f(c[0].y) + 'C' + f(c[1].x) + ',' + f(c[1].y) + ' ' + f(c[2].x) + ',' + f(c[2].y) + ' ' + f(c[3].x) + ',' + f(c[3].y);
    }
  };

  /* An SVG thread: every path inside the svg shares one geometry (styles give shadow, core and light). */
  function Thread(svg) {
    this.svg = svg;
    this.paths = Array.prototype.slice.call(svg.querySelectorAll('path'));
    this.last = '';
    this.length = 0;
  }
  Thread.prototype.size = function (w, h) {
    this.svg.setAttribute('width', w);
    this.svg.setAttribute('height', h);
    this.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  };
  Thread.prototype.set = function (d) {
    if (typeof d !== 'string') d = C.d(d);
    if (d === this.last) return;
    this.last = d;
    this.paths.forEach(function (p) { p.setAttribute('d', d); });
  };
  /* Draws the thread along its length (0 → 1). `length` must be measured after set(). */
  Thread.prototype.draw = function (p) {
    if (!this.length) this.length = this.paths[0].getTotalLength ? this.paths[0].getTotalLength() : 1000;
    var len = this.length;
    var off = p >= 1 ? '' : String(len * (1 - p));
    var dash = p >= 1 ? '' : len + ' ' + len;
    this.paths.forEach(function (path) {
      path.style.strokeDasharray = dash;
      path.style.strokeDashoffset = off;
    });
  };
  M.Thread = Thread;
})();
