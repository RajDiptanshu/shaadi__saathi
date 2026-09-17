/* Mogra & Moti · Scene 02 Welcome (first arrival only; the rest of the scene is still for reading).
   The heading holds the names apart with the same thread and a pearl. After the Draw brings the sheet to rest,
   line one is set by light, the thread draws across under it carrying its pearl to 40%, then line three and
   the lead line follow. Reduced: the same order, shorter, the pearl in place. */
(function () {
  var Invite = window.Invite;
  var M = Invite.motion, seg = M.seg, lerp = M.lerp;
  var el = null, thread = null, width = 0;

  function build() {
    el = {
      lines: document.querySelectorAll('.couple-line'),
      lead: document.querySelector('.welcome-lead'),
      box: document.querySelector('.couple-thread'),
      svg: document.querySelector('.couple-thread-svg'),
      pearl: document.querySelector('.couple-pearl')
    };
    thread = new M.Thread(el.svg);
  }

  /* The heading's thread: level under line one, then a tail that falls away to the right, like a strand
     lifted at one end. Drawn in the box's own pixels. */
  function layout() {
    if (!el) build();
    width = el.box.clientWidth;
    var h = el.box.clientHeight, y = h / 2;
    var end = width * 0.62;
    thread.size(width, h);
    thread.set('M0,' + y + 'C' + (width * 0.2) + ',' + (y + 0.6) + ' ' + (width * 0.42) + ',' + (y - 0.6) + ' ' + end + ',' + y +
      'C' + (width * 0.68) + ',' + y + ' ' + (width * 0.71) + ',' + (y + h * 0.18) + ' ' + (width * 0.74) + ',' + (h - 1));
    thread.length = 0;
  }

  function render(t, reduced) {
    if (!el) build();
    if (!width) layout();
    var p1, p2, p3, draw, slide, pearlAlpha = 1;
    if (reduced) {
      draw = seg(t, 0, 0.3, 'silk');
      p1 = seg(t, 0.1, 0.5, 'light'); p2 = seg(t, 0.2, 0.5, 'light'); p3 = seg(t, 0.3, 0.5, 'light');
      slide = 1;
      pearlAlpha = seg(t, 0.1, 0.3, 'light');
    } else {
      p1 = seg(t, 0, 1.0, 'light');
      draw = seg(t, 0.18, 0.7, 'silk');
      // The pearl rides the thread as it is drawn across, and settles at 40%.
      slide = seg(t, 0.18, 0.95, 'settle');
      p2 = seg(t, 0.36, 1.0, 'light');
      p3 = seg(t, 0.54, 1.0, 'light');
      pearlAlpha = draw > 0 ? 1 : 0;
    }
    M.setByLight(el.lines[0], p1);
    M.setByLight(el.lines[1], p2);
    M.setByLight(el.lead, p3);
    thread.draw(draw);
    var x = lerp(-0.4, 0, slide) * width;
    var t2 = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
    if (el.pearl.style.transform !== t2) el.pearl.style.transform = t2;
    el.pearl.style.opacity = String(pearlAlpha);
  }

  Invite.welcome = { layout: layout, render: render };
})();
