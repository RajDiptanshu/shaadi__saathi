/* Lal & Sona · the four backgrounds.

   The page alternates a full-bleed built background with a cream or glass panel laid on top of it, the
   whole way down. None of these is a picture of a place — they are the materials a Hindu wedding is
   actually made of: silk, marigold, lamplight and turmeric.

   SILK     crimson cloth with the light moving across its folds     · the threshold and the hero
   GARLAND  strings of marigold hung down the frame                  · the day, and the venue
   DIYA     lamplight thrown out of focus                            · the countdown
   HALDI    turmeric and kumkum clouds through deep red              · almost time, and the closing

   The authoring box is portrait, 1000 × 1500, because a phone is what this is opened on. Everything
   that matters is composed inside x 200 → 800; a wide screen sees the full width and loses the top. */
(function () {
  var World = window.World;
  var Worlds = window.Worlds = {};

  /* ---- a marigold ----------------------------------------------------------------------------------
     Concentric rings of small petals rather than a flat disc. At the sizes these are drawn a disc reads
     as a dot, and the whole garland turns into a string of beads. */
  function marigold(g, c, cx, cy, r, tone) {
    var outer = tone[0], inner = tone[1], heart = tone[2];
    var i, a;
    for (i = 0; i < 11; i++) {
      a = (Math.PI * 2 * i) / 11;
      g.appendChild(c.el('circle', {
        cx: c.f1(cx + Math.cos(a) * r * 0.66), cy: c.f1(cy + Math.sin(a) * r * 0.66),
        r: c.f1(r * 0.40), fill: outer
      }));
    }
    for (i = 0; i < 7; i++) {
      a = (Math.PI * 2 * i) / 7 + 0.4;
      g.appendChild(c.el('circle', {
        cx: c.f1(cx + Math.cos(a) * r * 0.34), cy: c.f1(cy + Math.sin(a) * r * 0.34),
        r: c.f1(r * 0.34), fill: inner
      }));
    }
    g.appendChild(c.el('circle', { cx: c.f1(cx), cy: c.f1(cy), r: c.f1(r * 0.26), fill: heart }));
  }

  /* A hanging string: marigolds down a cord, with a leaf every few flowers and a bud at the tail. */
  function garland(g, c, x, top, len, size, tone, seed) {
    var r = c.rng(seed);
    var n = Math.max(3, Math.round(len / (size * 2.1)));
    var d = ['M' + c.f1(x) + ',' + c.f1(top)];
    var pts = [];
    for (var i = 0; i < n; i++) {
      var t = (i + 1) / n;
      var y = top + len * t;
      var sway = Math.sin(t * 2.4 + seed) * size * 1.4;
      pts.push([x + sway, y]);
      d.push('L' + c.f1(x + sway) + ',' + c.f1(y));
    }
    g.appendChild(c.el('path', { d: d.join(' '), stroke: tone[3], 'stroke-width': c.f1(size * 0.16), fill: 'none', opacity: 0.8 }));
    pts.forEach(function (p, i) {
      if (i % 4 === 3) {
        /* a leaf, tucked behind the flower that follows it */
        var dir = i % 8 === 3 ? 1 : -1;
        g.appendChild(c.el('ellipse', {
          cx: c.f1(p[0] + dir * size * 0.9), cy: c.f1(p[1]),
          rx: c.f1(size * 0.86), ry: c.f1(size * 0.34),
          transform: 'rotate(' + c.f1(dir * 24) + ' ' + c.f1(p[0] + dir * size * 0.9) + ' ' + c.f1(p[1]) + ')',
          fill: tone[3]
        }));
      }
      marigold(g, c, p[0], p[1], size * (0.85 + r() * 0.3), tone);
    });
  }

  /* ---- 1 · SILK ------------------------------------------------------------------------------------ */

  Worlds.silk = {
    name: 'silk',
    layers: [
      /* The cloth, lit from above and behind the centre so the middle of the frame is where the eye
         goes and the corners fall away. */
      {
        depth: 0, build: function (g, defs, c) {
          g.appendChild(c.el('rect', {
            x: -60, y: -60, width: c.VBW + 120, height: c.VBH + 120,
            fill: c.gradient([[0, '#1E0309'], [0.28, '#420915'], [0.56, '#7C1330'], [0.80, '#4E0B1B'], [1, '#22040C']])
          }));
          g.appendChild(c.el('ellipse', {
            cx: 500, cy: 620, rx: 640, ry: 540,
            fill: c.radial([[0, '#C4173A', 0.66], [0.52, '#8E1028', 0.30], [1, '#8E1028', 0]])
          }));
        }
      },
      /* The folds. Long soft ellipses rather than filled bands: a band path has hard top and bottom
         edges and reads as a painted stripe however its ends are faded, whereas a radial ellipse falls
         off in every direction and reads as light lying across cloth. Because each sits on its own
         layer, they separate as the page scrolls — which is what makes the silk look folded. */
      {
        depth: 0.14, build: function (g, defs, c) {
          var lit = c.radial([[0, '#E0342B', 0.40], [0.55, '#C4173A', 0.18], [1, '#C4173A', 0]]);
          g.appendChild(c.el('ellipse', { cx: 430, cy: 560, rx: 700, ry: 190, transform: 'rotate(-9 430 560)', fill: lit }));
          g.appendChild(c.el('ellipse', { cx: 640, cy: 300, rx: 520, ry: 130, transform: 'rotate(-14 640 300)', fill: lit, opacity: 0.7 }));
        }
      },
      {
        depth: 0.28, build: function (g, defs, c) {
          var lit = c.radial([[0, '#D0203C', 0.34], [0.55, '#9A1128', 0.16], [1, '#9A1128', 0]]);
          g.appendChild(c.el('ellipse', { cx: 560, cy: 1030, rx: 760, ry: 210, transform: 'rotate(7 560 1030)', fill: lit }));
          g.appendChild(c.el('ellipse', { cx: 300, cy: 1300, rx: 560, ry: 150, transform: 'rotate(11 300 1300)', fill: lit, opacity: 0.66 }));
        }
      },
      /* Gold zari caught in the light. Static, and part of the cloth — the dust that moves is on the
         canvas in scenes/petals.js and falls in front of everything. */
      {
        depth: 0.44, build: function (g, defs, c) {
          var r = c.rng(31);
          var halo = c.radial([[0, '#F4D06F', 0.9], [1, '#F4D06F', 0]]);
          for (var i = 0; i < 52; i++) {
            var x = 120 + r() * 760, y = 200 + r() * 1180, s = 1.4 + r() * 4.6;
            g.appendChild(c.el('circle', { cx: c.f1(x), cy: c.f1(y), r: c.f1(s * 3.4), fill: halo, opacity: c.f1(0.12 + r() * 0.18) }));
            g.appendChild(c.el('circle', { cx: c.f1(x), cy: c.f1(y), r: c.f1(s), fill: '#FFF0C2', opacity: c.f1(0.26 + r() * 0.46) }));
          }
        }
      },
      /* The shadowed hem, so the names have somewhere to sit. */
      {
        depth: 0.68, build: function (g, defs, c) {
          g.appendChild(c.el('rect', {
            x: -60, y: 900, width: c.VBW + 120, height: 660,
            fill: c.gradient([[0, '#1A0308', 0], [0.6, '#1A0308', 0.48], [1, '#120206', 0.84]])
          }));
          g.appendChild(c.el('ellipse', {
            cx: 500, cy: 760, rx: 900, ry: 780,
            fill: c.radial([[0, '#000000', 0], [0.62, '#000000', 0], [1, '#000000', 0.56]])
          }));
        }
      }
    ]
  };

  /* ---- 2 · GARLAND --------------------------------------------------------------------------------- */

  /* Marigold strings hung down the frame, three ranks deep. Tropical fronds were tried here first and
     were simply the wrong flower — this is what actually hangs at the door. */
  var TONE_FAR  = ['#8A5410', '#6E4009', '#5A3407', '#3E4A2C'];
  var TONE_MID  = ['#D98A14', '#B86C0C', '#96540A', '#3E7D4F'];
  var TONE_NEAR = ['#F79F1A', '#E0761A', '#C2560F', '#4A8F5C'];

  Worlds.garland = {
    name: 'garland',
    layers: [
      {
        depth: 0, build: function (g, defs, c) {
          g.appendChild(c.el('rect', {
            x: -60, y: -60, width: c.VBW + 120, height: c.VBH + 120,
            fill: c.gradient([[0, '#22040C'], [0.42, '#4E0B1B'], [0.74, '#6E1028'], [1, '#2A0511']])
          }));
          g.appendChild(c.el('ellipse', {
            cx: 500, cy: 720, rx: 600, ry: 500,
            fill: c.radial([[0, '#B31331', 0.56], [1, '#B31331', 0]])
          }));
        }
      },
      { depth: 0.16, build: function (g, defs, c) {
          [[232, 14], [390, 27], [560, 41], [720, 55], [846, 69]].forEach(function (s) {
            garland(g, c, s[0], -40, 1120, 13, TONE_FAR, s[1]);
          });
        }
      },
      { depth: 0.36, build: function (g, defs, c) {
          [[276, 83], [470, 97], [668, 111], [800, 125]].forEach(function (s) {
            garland(g, c, s[0], -60, 900, 19, TONE_MID, s[1]);
          });
        }
      },
      /* Magenta blossoms deep in the planting, so the orange has something to argue with. */
      {
        depth: 0.52, build: function (g, defs, c) {
          var r = c.rng(77);
          var halo = c.radial([[0, '#FF4E88', 0.5], [1, '#FF4E88', 0]]);
          [[252, 560], [744, 500], [340, 1010], [690, 1080], [206, 820]].forEach(function (p) {
            var s = 0.8 + r() * 0.5;
            g.appendChild(c.el('circle', { cx: p[0], cy: p[1], r: c.f1(62 * s), fill: halo, opacity: 0.55 }));
            for (var i = 0; i < 6; i++) {
              var a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
              g.appendChild(c.el('ellipse', {
                cx: c.f1(p[0] + Math.cos(a) * 13 * s), cy: c.f1(p[1] + Math.sin(a) * 13 * s),
                rx: c.f1(13 * s), ry: c.f1(8 * s),
                transform: 'rotate(' + c.f1(a * 180 / Math.PI) + ' ' + c.f1(p[0] + Math.cos(a) * 13 * s) + ' ' + c.f1(p[1] + Math.sin(a) * 13 * s) + ')',
                fill: '#D81B60', opacity: 0.9
              }));
            }
            g.appendChild(c.el('circle', { cx: p[0], cy: p[1], r: c.f1(6 * s), fill: '#FFC93C' }));
          });
        }
      },
      /* The near rank, crossing in at the top. This layer travels most, and is what tells the eye it is
         looking through a doorway rather than at a printed pattern. */
      {
        depth: 0.84, build: function (g, defs, c) {
          [[196, 139], [418, 153], [640, 167], [858, 181]].forEach(function (s) {
            garland(g, c, s[0], -90, 520, 30, TONE_NEAR, s[1]);
          });
        }
      }
    ]
  };

  /* ---- 3 · DIYA ------------------------------------------------------------------------------------ */

  /* Lamplight thrown out of focus. An out-of-focus highlight is a disc with a brighter rim, not a
     blurred dot — so every orb is a ring gradient, and the nearest are the biggest and faintest. */
  Worlds.diya = {
    name: 'diya',
    layers: [
      {
        depth: 0, build: function (g, defs, c) {
          g.appendChild(c.el('rect', {
            x: -60, y: -60, width: c.VBW + 120, height: c.VBH + 120,
            fill: c.gradient([[0, '#170208'], [0.4, '#3A0712'], [0.72, '#5E0B1F'], [1, '#120206']])
          }));
          g.appendChild(c.el('ellipse', {
            cx: 520, cy: 820, rx: 700, ry: 580,
            fill: c.radial([[0, '#B31331', 0.48], [1, '#B31331', 0]])
          }));
        }
      },
      { depth: 0.18, build: orbs(120, 5, 16, 0.18, 0.34, '#F4D06F', 9) },
      { depth: 0.40, build: orbs(52, 14, 34, 0.16, 0.30, '#FFC93C', 23) },
      { depth: 0.64, build: orbs(22, 34, 76, 0.12, 0.24, '#FFB627', 51) },
      { depth: 0.88, build: orbs(9, 80, 165, 0.06, 0.14, '#FFDD9E', 87) }
    ]
  };

  function orbs(count, min, max, aMin, aMax, tint, seed) {
    return function (g, defs, c) {
      var r = c.rng(seed);
      var disc = c.radial([[0, tint, 0.34], [0.62, tint, 0.46], [0.88, tint, 0.94], [1, tint, 0]]);
      for (var i = 0; i < count; i++) {
        var size = min + r() * (max - min);
        g.appendChild(c.el('circle', {
          cx: c.f1(-40 + r() * (c.VBW + 80)),
          cy: c.f1(120 + r() * (c.VBH - 120)),
          r: c.f1(size),
          fill: disc,
          opacity: c.f1(aMin + r() * (aMax - aMin))
        }));
      }
    };
  }

  /* ---- 4 · HALDI ----------------------------------------------------------------------------------- */

  Worlds.haldi = {
    name: 'haldi',
    layers: [
      {
        depth: 0, build: function (g, defs, c) {
          g.appendChild(c.el('rect', {
            x: -60, y: -60, width: c.VBW + 120, height: c.VBH + 120,
            fill: c.gradient([[0, '#1C0309'], [0.34, '#4A0A18'], [0.66, '#6E1028'], [1, '#22040C']], 118)
          }));
        }
      },
      /* The drift. Large, heavily overlapped and soft-edged — the layer that gives the ground somewhere
         to breathe. Without it the scene is a flat wall. */
      {
        depth: 0.12, build: function (g, defs, c) {
          var r = c.rng(5);
          var pale = c.radial([[0, '#C4173A', 0.62], [0.55, '#9A1128', 0.28], [1, '#9A1128', 0]]);
          var dark = c.radial([[0, '#140208', 0.6], [0.58, '#140208', 0.26], [1, '#140208', 0]]);
          for (var i = 0; i < 14; i++) {
            var cx = r() * c.VBW, cy = r() * c.VBH;
            g.appendChild(c.el('ellipse', {
              cx: c.f1(cx), cy: c.f1(cy),
              rx: c.f1(230 + r() * 360), ry: c.f1(150 + r() * 280),
              transform: 'rotate(' + c.f1(r() * 180) + ' ' + c.f1(cx) + ' ' + c.f1(cy) + ')',
              fill: i % 2 ? pale : dark, opacity: c.f1(0.26 + r() * 0.34)
            }));
          }
        }
      },
      /* Turmeric and kumkum, as light rather than as line. An earlier pass drew the accent as marble
         veining and it read as stray hairs on a flat wall at every size that mattered: a 2px stroke on
         a phone is a scratch, however it is haloed. Clouds carry the colour without ever asking the eye
         to resolve an edge. */
      {
        depth: 0.32, build: function (g, defs, c) {
          var r = c.rng(23);
          var turmeric = c.radial([[0, '#FFB627', 0.44], [0.5, '#D98A14', 0.18], [1, '#D98A14', 0]]);
          var kumkum = c.radial([[0, '#FF4E88', 0.40], [0.5, '#D81B60', 0.16], [1, '#D81B60', 0]]);
          [[250, 380, 0], [760, 640, 1], [430, 1150, 0], [880, 1320, 1], [110, 900, 0]].forEach(function (p) {
            g.appendChild(c.el('ellipse', {
              cx: p[0], cy: p[1],
              rx: c.f1(220 + r() * 220), ry: c.f1(160 + r() * 170),
              transform: 'rotate(' + c.f1(r() * 180) + ' ' + p[0] + ' ' + p[1] + ')',
              fill: p[2] ? kumkum : turmeric, opacity: c.f1(0.36 + r() * 0.26)
            }));
          });
        }
      },
      /* Gold dust through the middle distance. */
      {
        depth: 0.5, build: function (g, defs, c) {
          var r = c.rng(61);
          var halo = c.radial([[0, '#F4D06F', 0.85], [1, '#F4D06F', 0]]);
          for (var i = 0; i < 44; i++) {
            var x = 60 + r() * 880, y = 120 + r() * 1300, sz = 1.2 + r() * 4;
            g.appendChild(c.el('circle', { cx: c.f1(x), cy: c.f1(y), r: c.f1(sz * 3.6), fill: halo, opacity: c.f1(0.10 + r() * 0.16) }));
            g.appendChild(c.el('circle', { cx: c.f1(x), cy: c.f1(y), r: c.f1(sz), fill: '#FFF0C2', opacity: c.f1(0.24 + r() * 0.42) }));
          }
        }
      },
      /* A sweep of light across the whole scene, then the vignette that holds the middle. */
      {
        depth: 0.78, build: function (g, defs, c) {
          g.appendChild(c.el('ellipse', {
            cx: 540, cy: 700, rx: 820, ry: 250, transform: 'rotate(-14 540 700)',
            fill: c.radial([[0, '#FFF0D6', 0.12], [0.55, '#FFF0D6', 0.05], [1, '#FFF0D6', 0]])
          }));
          g.appendChild(c.el('ellipse', {
            cx: 500, cy: 750, rx: 880, ry: 780,
            fill: c.radial([[0, '#000000', 0], [0.58, '#000000', 0], [1, '#000000', 0.52]])
          }));
        }
      }
    ]
  };
})();
