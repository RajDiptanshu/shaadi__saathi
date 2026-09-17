/* Haveli · Scene 03 Venue. Draws the caption card's deckled edge at its real pixel size (engine/motion/paper.js);
   a plain plaster-coloured box is the fallback while this runs, or if it never does. */
(function () {
  var Invite = window.Invite;

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
})();
