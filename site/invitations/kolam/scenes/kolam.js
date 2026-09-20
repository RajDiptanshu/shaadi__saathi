/* Kolam · the drawing itself. A kambi (wire) kolam traced on an m by n grid of dots: the line runs diagonally
   between neighbouring dots, and where it reaches the edge it loops round the outer dot and comes back. On a
   grid like 5 by 6 this gives two unbroken lines woven through each other, each visiting every corner of the
   grid. Everything is geometry, so it can be redrawn at any size and animated by stroke length. */
(function () {
  function trace(m, n) {
    var seen = {}, loops = [], starts = [], i, j, s;
    function key(x, y, dx, dy) { return x + ',' + y + ',' + dx + ',' + dy; }
    for (i = 0; i < m - 1; i++) for (j = 0; j < n; j++) {
      starts.push([i + 0.5, j, 0.5, 0.5], [i + 0.5, j, -0.5, 0.5], [i + 0.5, j, 0.5, -0.5], [i + 0.5, j, -0.5, -0.5]);
    }
    for (s = 0; s < starts.length; s++) {
      var x = starts[s][0], y = starts[s][1], dx = starts[s][2], dy = starts[s][3];
      if (seen[key(x, y, dx, dy)]) continue;
      var segs = [{ t: 'M', x: x, y: y }], guard;
      for (guard = 0; guard < 4000; guard++) {
        var k = key(x, y, dx, dy);
        if (seen[k]) break;
        seen[k] = true;
        var nx = x + dx, ny = y + dy;
        var exitX = nx < 0 || nx > m - 1, exitY = ny < 0 || ny > n - 1;
        if (!exitX && !exitY) { segs.push({ t: 'L', x: nx, y: ny }); x = nx; y = ny; continue; }
        var cx, cy, tx, ty;
        if (exitY) {
          cx = x + dx; cy = y; tx = x + 2 * dx;
          if (tx >= 0 && tx <= m - 1) { segs.push({ t: 'A', cx: cx, cy: cy, x: tx, y: y, large: 0 }); x = tx; dy = -dy; }
          else { var sy = cy === 0 ? 0.5 : -0.5; segs.push({ t: 'A', cx: cx, cy: cy, x: cx, y: cy + sy, large: 1 }); x = cx; y = cy + sy; dx = -dx; dy = sy; }
        } else {
          cx = x; cy = y + dy; ty = y + 2 * dy;
          if (ty >= 0 && ty <= n - 1) { segs.push({ t: 'A', cx: cx, cy: cy, x: x, y: ty, large: 0 }); y = ty; dx = -dx; }
          else { var sx = cx === 0 ? 0.5 : -0.5; segs.push({ t: 'A', cx: cx, cy: cy, x: cx + sx, y: cy, large: 1 }); x = cx + sx; y = cy; dy = -dy; dx = sx; }
        }
      }
      loops.push(segs);
    }
    return loops;
  }

  /* SVG path data for one loop, with dot spacing s and the top-left dot at (ox, oy). */
  function path(segs, s, ox, oy) {
    function P(x, y) { return (ox + x * s).toFixed(2) + ',' + (oy + y * s).toFixed(2); }
    var d = '', px = 0, py = 0, r = (s / 2).toFixed(2), i, g;
    for (i = 0; i < segs.length; i++) {
      g = segs[i];
      if (g.t === 'M') { d += 'M' + P(g.x, g.y); }
      else if (g.t === 'L') { d += ' L' + P(g.x, g.y); }
      else {
        var cross = (px - g.cx) * (g.y - g.cy) - (py - g.cy) * (g.x - g.cx);
        var sweep = cross > 0 ? 1 : 0;
        if (g.large) sweep = 1 - sweep;
        d += ' A' + r + ',' + r + ' 0 ' + g.large + ' ' + sweep + ' ' + P(g.x, g.y);
      }
      px = g.x; py = g.y;
    }
    return d + ' Z';
  }

  /* Everything needed to draw an m by n kolam with dot spacing s inside a box: its size, the dots in the order a
     hand would place them (row by row, alternating direction), and one path per line. */
  function build(m, n, s, pad) {
    pad = pad == null ? s * 0.6 : pad;
    var ox = pad + s / 2, oy = pad + s / 2, dots = [], i, j;
    for (j = 0; j < n; j++) for (i = 0; i < m; i++) {
      var col = j % 2 ? m - 1 - i : i;
      dots.push({ x: ox + col * s, y: oy + j * s });
    }
    var loops = trace(m, n);
    return {
      width: (m - 1) * s + s + 2 * pad,
      height: (n - 1) * s + s + 2 * pad,
      dots: dots,
      paths: loops.map(function (l) { return path(l, s, ox, oy); })
    };
  }

  window.Kolam = { trace: trace, path: path, build: build };
})();
