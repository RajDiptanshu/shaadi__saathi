/* Lal & Sona · scene 00, the threshold.

   Crimson silk stands in two panels that meet in the middle. A scalloped valance hangs across the top
   with tasselled cords, marigold garlands climb both edges, and the monogram draws itself in gold
   above the names. The touch sweeps the silk apart, lifts the valance, throws the vines aside and
   walks the camera through into the invitation.

   The choreography, in order: the garlands draw up the edges · the monogram ring closes · the sprigs and
   blossoms settle · the names arrive letter by letter under a foil sweep · the button breathes. */
(function () {
  var Invite = window.Invite;
  var Orn = window.Ornament;
  var root = document.documentElement;

  // Long enough for the silk to travel and the camera to follow it through.
  Invite.timing = { press: 260, open: 2200, done: 3400 };

  function initials() {
    var d = Invite.data;
    var bride = Invite.t(d.couple.brideFull) || 'N';
    var groom = Invite.t(d.couple.groomFull) || 'D';
    return [bride.trim().charAt(0).toUpperCase(), groom.trim().charAt(0).toUpperCase()];
  }

  function mount() {
    var world = document.getElementById('cover-world');
    if (world && !world.firstChild && window.World && window.Worlds) {
      window.World.build(world, window.Worlds.silk);
      world.classList.add('is-live');
    }

    var valance = document.getElementById('valance-mount');
    if (valance && !valance.firstChild) valance.appendChild(Orn.valance(5));

    var height = Math.max(window.innerHeight, 720);
    [['vine-left', 1], ['vine-right', -1]].forEach(function (pair, i) {
      var slot = document.getElementById(pair[0]);
      if (slot && !slot.firstChild) slot.appendChild(Orn.vine(pair[1], height, 7 + i * 13));
    });

    var mono = document.getElementById('mono-mount');
    if (mono && !mono.firstChild) {
      var pair = initials();
      mono.appendChild(Orn.monogram(pair[0], pair[1]));
    }
  }

  /* The monogram's initials follow the language switch, because the bride's name is not spelled with
     the same letter in both. */
  Invite.on('lang', function () {
    var mono = document.getElementById('mono-mount');
    if (!mono) return;
    mono.textContent = '';
    var pair = initials();
    mono.appendChild(Orn.monogram(pair[0], pair[1]));
    if (root.classList.contains('threshold-drawn')) mono.classList.add('drawn');
  });

  Invite.on('ready', function () {
    mount();

    function begin() {
      root.classList.add('threshold-ready');

      /* The policy only decides once something asks it to, and until it does, html.motion-ok is never
         set — which leaves the foil sweep, every draw-on, the marquee and the drift dormant while the
         page still renders its final states and so looks deliberate rather than broken. Asking here is
         what starts the whole page moving. */
      var policy = Invite.motion && Invite.motion.policy;
      var start = function () {
        /* `drawn` goes on the cover rather than relying on a sibling selector, because the ornament
           sits inside its own mount and is never a sibling of the words. */
        var cover = document.getElementById('cover');
        if (cover) cover.classList.add('drawn');
        root.classList.add('threshold-drawn');

        if (window.Petals) {
          window.Petals.attach(document.getElementById('cover-fall'), {
            dense: true, mix: { petal: 0.52, leaf: 0.2, mote: 0.28 }
          });
        }
        if (window.Stage) window.Stage.settle();
      };

      if (policy) policy.whenDecided(start);
      else start();
    }

    // Asked while the page is still loading, the motion policy answers "no frames" and nothing plays.
    if (document.readyState === 'complete') begin();
    else window.addEventListener('load', begin);
  });

  /* The invitation keeps its own quieter fall the whole way down, fixed to the viewport so petals cross
     every scene rather than restarting at each one. */
  Invite.on('opened', function () {
    if (window.Petals) {
      window.Petals.attach(document.getElementById('page-fall'), {
        mix: { petal: 0.44, leaf: 0.34, mote: 0.22 }
      });
    }
  });
})();
