/* Invite Studio engine: the couple's photographs.
   <div data-gallery></div> becomes a swipeable strip with dots, and a tap opens the photo full size.
   Photos come from details.js: art.gallery = ['art/us-1.jpg', …]. With none, the section is hidden. */
(function () {
  var Invite = window.Invite;
  var box = document.querySelector('[data-gallery]');
  if (!box) return;
  var data = Invite.data;
  var photos = (data.art && data.art.gallery) || [];

  if (!photos.length) {
    var section = box.closest('section') || box;
    section.hidden = true;
    return;
  }

  var strip = document.createElement('div');
  strip.className = 'gl-strip';
  var dots = document.createElement('div');
  dots.className = 'gl-dots';
  dots.setAttribute('aria-hidden', 'true');

  photos.forEach(function (src, i) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'gl-item';
    button.innerHTML = '<img src="' + src + '" alt="" loading="lazy">';
    button.addEventListener('click', function () { open(i); });
    strip.appendChild(button);

    var dot = document.createElement('i');
    dot.className = 'gl-dot' + (i ? '' : ' is-on');
    dots.appendChild(dot);
  });
  box.appendChild(strip);
  if (photos.length > 1) box.appendChild(dots);

  // The dot that lights up follows whichever photo is nearest the middle.
  var marking = 0;
  strip.addEventListener('scroll', function () {
    clearTimeout(marking);
    marking = setTimeout(function () {
      var middle = strip.scrollLeft + strip.clientWidth / 2;
      var items = strip.children, best = 0, bestGap = Infinity;
      for (var i = 0; i < items.length; i++) {
        var gap = Math.abs(items[i].offsetLeft + items[i].offsetWidth / 2 - middle);
        if (gap < bestGap) { bestGap = gap; best = i; }
      }
      for (var j = 0; j < dots.children.length; j++) {
        dots.children[j].classList.toggle('is-on', j === best);
      }
    }, 90);
  }, { passive: true });

  /* Full size, over the page. */
  var viewer = null, current = 0, opener = null;
  function build() {
    viewer = document.createElement('div');
    viewer.className = 'gl-viewer';
    viewer.hidden = true;
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.innerHTML =
      '<button type="button" class="gl-close" aria-label="' + (Invite.t(data.ui.close) || 'Close') + '">&times;</button>' +
      '<button type="button" class="gl-arrow gl-prev" aria-label="Previous">&#8249;</button>' +
      '<img class="gl-big" src="" alt="">' +
      '<button type="button" class="gl-arrow gl-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(viewer);
    viewer.querySelector('.gl-close').addEventListener('click', close);
    viewer.querySelector('.gl-prev').addEventListener('click', function () { show(current - 1); });
    viewer.querySelector('.gl-next').addEventListener('click', function () { show(current + 1); });
    viewer.addEventListener('click', function (event) { if (event.target === viewer) close(); });
    document.addEventListener('keydown', function (event) {
      if (viewer.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
  }
  function show(i) {
    current = (i + photos.length) % photos.length;
    viewer.querySelector('.gl-big').src = photos[current];
  }
  function open(i) {
    if (!viewer) build();
    opener = document.activeElement;
    show(i);
    viewer.hidden = false;
    document.documentElement.classList.add('gl-open');
    viewer.querySelector('.gl-close').focus();
  }
  function close() {
    viewer.hidden = true;
    document.documentElement.classList.remove('gl-open');
    try { if (opener) opener.focus(); } catch (e) {}
  }
})();
