/* Lal & Sona · the photo gallery.

   One matted card at a time, with the neighbouring cards peeking in at both edges, a counter on the
   mount, and a pill of arrows and dots below. Swipe, drag, arrow keys and the dots all drive the same
   `go()`.

   The mat is the point. The couple's photographs are three landscapes and one portrait, and the widest
   of them has the bride standing at the left and the groom sitting at the right — any crop tight enough
   to make a consistent portrait card loses one of them. So the card is a fixed square mount and the
   photograph sits inside it at its own aspect ratio, `contain` rather than `cover`. Nothing is ever cut,
   which is exactly how a mounted print behaves, and the mount does the work of making the set look
   consistent instead of the crop.

   The track moves on `transform` only, so the whole carousel stays on the compositor. */
(function () {
  var Invite = window.Invite;
  var Orn = window.Ornament;
  var data = Invite.data;

  var WIDTHS = [1080, 1440, 1920];
  var AUTO_MS = 5200;

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function picture(stem, alt) {
    var pic = document.createElement('picture');
    ['avif', 'webp'].forEach(function (ext) {
      var source = document.createElement('source');
      source.type = 'image/' + ext;
      source.sizes = '(max-width: 640px) 86vw, 520px';
      source.setAttribute('data-srcset', WIDTHS.map(function (w) {
        return stem + '-' + w + '.' + ext + ' ' + w + 'w';
      }).join(', '));
      pic.appendChild(source);
    });
    var img = document.createElement('img');
    img.alt = alt || '';
    img.decoding = 'async';
    img.loading = 'lazy';
    img.setAttribute('data-src', stem + '-1080.jpg');
    pic.appendChild(img);
    return pic;
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function build() {
    var mount = document.getElementById('gallery');
    var shots = (data.media && data.media.gallery) || [];
    if (!mount || !shots.length || mount.firstChild) return;

    var index = 0;
    var timer = 0;
    var paused = false;

    var stage = el('div', 'gal-stage');
    var track = el('div', 'gal-track');

    shots.forEach(function (shot, i) {
      var slide = el('figure', 'gal-slide');
      slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');

      var mat = el('div', 'gal-mat');
      var frame = el('div', 'gal-frame');
      frame.appendChild(picture(shot.src, Invite.t(shot.alt)));
      mat.appendChild(frame);

      var count = el('span', 'gal-count');
      count.textContent = pad(i + 1) + ' / ' + pad(shots.length);
      mat.appendChild(count);
      slide.appendChild(mat);

      var caption = el('figcaption', 'gal-caption label');
      caption.textContent = Invite.t(shot.caption);
      slide.appendChild(caption);

      track.appendChild(slide);
    });

    stage.appendChild(track);
    mount.appendChild(stage);

    /* ---- the nav ---- */
    var nav = el('div', 'gal-nav');
    var prev = el('button', 'gal-arrow gal-prev');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous photograph');
    prev.appendChild(Orn.chevron('left'));

    var dots = el('div', 'gal-dots');
    dots.setAttribute('role', 'tablist');
    var dotNodes = shots.map(function (_, i) {
      var d = el('button', 'gal-dot');
      d.type = 'button';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Photograph ' + (i + 1));
      d.addEventListener('click', function () { stop(); go(i); });
      dots.appendChild(d);
      return d;
    });

    var next = el('button', 'gal-arrow gal-next');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next photograph');
    next.appendChild(Orn.chevron('right'));

    nav.appendChild(prev);
    nav.appendChild(dots);
    nav.appendChild(next);
    mount.appendChild(nav);

    prev.addEventListener('click', function () { stop(); go(index - 1); });
    next.addEventListener('click', function () { stop(); go(index + 1); });

    /* ---- movement ---- */
    function go(i) {
      index = (i + shots.length) % shots.length;
      track.style.transform = 'translate3d(' + (-index * 100) + '%, 0, 0)';
      dotNodes.forEach(function (d, n) {
        d.classList.toggle('is-on', n === index);
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
      });
      Array.prototype.forEach.call(track.children, function (s, n) {
        s.classList.toggle('is-on', n === index);
        s.setAttribute('aria-hidden', n === index ? 'false' : 'true');
      });
    }

    function start() {
      if (timer || paused || Invite.still || shots.length < 2) return;
      timer = setInterval(function () { if (!paused) go(index + 1); }, AUTO_MS);
    }
    function stop() { clearInterval(timer); timer = 0; }

    /* Drag and swipe. Pointer events cover mouse, pen and touch in one path; the threshold is in
       pixels rather than a fraction of the width so a flick on a narrow phone still registers. */
    var startX = 0, startY = 0, dragging = false, decided = false;
    stage.addEventListener('pointerdown', function (e) {
      dragging = true; decided = false;
      startX = e.clientX; startY = e.clientY;
      stop();
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging || decided) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      /* Only claim the gesture once it is clearly sideways, or the carousel eats the page scroll. */
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
      decided = true;
      if (Math.abs(dx) > Math.abs(dy)) {
        go(index + (dx < 0 ? 1 : -1));
        dragging = false;
      } else {
        dragging = false;
      }
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      stage.addEventListener(ev, function () { dragging = false; });
    });

    mount.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { stop(); go(index - 1); }
      else if (e.key === 'ArrowRight') { stop(); go(index + 1); }
    });

    /* Nothing advances while the gallery is off screen or the tab is hidden. */
    if ('IntersectionObserver' in window && !Invite.still) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          paused = !en.isIntersecting;
          if (en.isIntersecting) start(); else stop();
        });
      }, { threshold: 0.35 }).observe(mount);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    go(0);
  }

  Invite.on('render', build);
  /* A language switch rewrites the captions, and build() bails once the gallery exists — so refresh
     the text in place rather than rebuilding the whole carousel and losing the reader's position. */
  Invite.on('lang', function () {
    var shots = (data.media && data.media.gallery) || [];
    document.querySelectorAll('#gallery .gal-caption').forEach(function (node, i) {
      if (shots[i]) node.textContent = Invite.t(shots[i].caption);
    });
  });
})();
