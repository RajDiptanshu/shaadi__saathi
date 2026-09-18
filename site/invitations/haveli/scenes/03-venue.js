/* Haveli · Scene 03 Venue. Draws the caption card's deckled edge at its real pixel size (engine/motion/paper.js),
   and lets the camera drift over Jaisalmer as the guest scrolls the window past (a photograph may track; text
   never moves). A plain plaster-coloured box is the card's fallback; the photograph's rest position is its own. */
(function () {
  var Invite = window.Invite, P = Invite.motion.policy;

  function draw() {
    var M = Invite.motion;
    var svg = document.querySelector('.venue-card-edge');
    if (!svg || !M || !M.paper) return;
    var card = svg.closest('.venue-card');
    var w = card.clientWidth, h = card.clientHeight;
    if (!w || !h) return;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var body = svg.querySelector('.venue-card-paper');
    var rim = svg.querySelector('.venue-card-rim');
    if (body) body.setAttribute('d', M.paper.sheet(0, 0, w, h, 42, false));
    if (rim) rim.setAttribute('d', M.paper.rim(0, 0, w, h, 42, false));
  }
  window.addEventListener('load', draw);
  window.addEventListener('resize', draw);

  var photo = document.querySelector('.venue-photo img'), box = document.querySelector('.venue-window');
  if (!photo || !box) return;
  var ticking = false;
  function drift() {
    ticking = false;
    var r = box.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    photo.style.transform = 'translate3d(0,' + (-(p * 0.1 * r.height)).toFixed(1) + 'px,0)';
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }
  // Asked after load, so this never starts the policy's frame check while the page is still loading.
  window.addEventListener('load', function () {
    P.whenDecided(function (ok) {
      if (!ok || P.reduced) return;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      drift();
    });
  });
})();
