/* Invite Studio motion: reveals.
   T4 "Set by light": a soft diagonal mask uncovers text in the key light's direction. The text is always in the
   DOM and readable without motion; base.css applies the mask only under html.motion-ok. */
(function () {
  var M = window.Invite.motion;

  /* p: 0 hidden → 1 fully lit. `box` ({ width, offset }) lines a mask up with a larger word it belongs to, so a
     separately positioned glyph is lit at exactly the same moment as the word around it. */
  M.setByLight = function (el, p, box) {
    if (!el) return;
    if (p >= 1) {
      if (!el.classList.contains('is-lit')) el.classList.add('is-lit');
      return;
    }
    if (el.classList.contains('is-lit')) el.classList.remove('is-lit');
    var pos, size;
    if (box) {
      var w = box.width * 2.6;
      pos = ((box.width - w) * (1 - p) - box.offset).toFixed(1) + 'px 0';
      size = w.toFixed(1) + 'px 100%';
    } else {
      pos = (100 - 100 * p).toFixed(2) + '% 0';
    }
    el.style.webkitMaskPosition = pos;
    el.style.maskPosition = pos;
    if (size) { el.style.webkitMaskSize = size; el.style.maskSize = size; }
  };
})();
