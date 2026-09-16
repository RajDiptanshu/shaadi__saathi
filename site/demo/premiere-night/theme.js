/* Premiere Night: sets the stage, flashes the bulbs, lifts the curtain and tears the ticket.
   The billing on each card and the film strip come from details.js. */
(function () {
  var Invite = window.Invite;
  var Art = window.PremiereArt;
  var data = Invite.data;

  // The bulbs flash first, then the curtain goes up.
  Invite.timing = { press: 520, open: 2000, done: 3500 };

  var gallery = (data.art && data.art.gallery) || [];

  // An empty film strip reads as a broken page, so the gallery only appears once there are stills.
  if (!gallery.length) {
    var galleryBox = document.querySelector('.gallery');
    if (galleryBox) galleryBox.hidden = true;
  }

  document.getElementById('art-sprite').innerHTML = Art.sprite();
  function draw(scope) {
    scope.querySelectorAll('[data-art]:empty').forEach(function (el) {
      var type = el.getAttribute('data-art');
      if (type === 'curtain-l') el.innerHTML = Art.curtain('l');
      else if (type === 'curtain-r') el.innerHTML = Art.curtain('r');
      else if (type === 'marquee') el.innerHTML = Art.marquee();
      else if (type === 'ticket') el.innerHTML = Art.ticket();
      else if (type === 'reel') el.innerHTML = Art.reel();
      else if (type === 'film') el.innerHTML = Art.filmStrip(Math.max(4, gallery.length));
    });
  }
  draw(document);

  /* Photographs, when the couple has sent any, go into the film frames. */
  function fillFilm() {
    var strip = document.querySelector('.film svg');
    if (!strip || !gallery.length || strip.dataset.filled) return;
    strip.dataset.filled = '1';
    var frames = strip.querySelectorAll('.frame');
    gallery.slice(0, frames.length).forEach(function (src, i) {
      var frame = frames[i];
      var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      img.setAttribute('href', src);
      img.setAttribute('x', frame.getAttribute('x'));
      img.setAttribute('y', frame.getAttribute('y'));
      img.setAttribute('width', frame.getAttribute('width'));
      img.setAttribute('height', frame.getAttribute('height'));
      img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      frame.parentNode.insertBefore(img, frame.nextSibling);
    });
  }

  Invite.on('render', function () {
    draw(document);
    fillFilm();
    // The wedding and the reception are the main features.
    document.querySelectorAll('.show[data-from="events"]').forEach(function (li) {
      var ev = data.events[+li.getAttribute('data-index')];
      li.classList.toggle('major', !!ev.major);
    });
  });

  /* The gallery scrolls sideways; start it a little in so the strip reads as a strip. */
  Invite.on('ready', function () {
    var gal = document.querySelector('.gallery');
    if (gal && !Invite.still) gal.scrollLeft = 24;
  });
})();
