/* Rang Mela: the invitation stays shut until the guest scratches the gulal off the date.
   Then confetti, and the doors are open. */
(function () {
  var Invite = window.Invite;
  var Art = window.MelaArt;
  var data = Invite.data;
  var root = document.documentElement;

  Invite.timing = { press: 300, open: 1200, done: 2600 };

  document.getElementById('art-sprite').innerHTML = Art.sprite();
  function draw(scope) {
    scope.querySelectorAll('[data-art]:empty').forEach(function (el) {
      var type = el.getAttribute('data-art');
      if (type === 'gulal') el.innerHTML = Art.gulal(7);
      else if (type === 'bunting') el.innerHTML = Art.bunting(12);
      else if (type === 'garland') el.innerHTML = Art.garland(14);
      else if (type === 'couple') el.innerHTML = Art.couple();
      else if (type === 'rangoli') el.innerHTML = Art.rangoli();
    });
  }
  draw(document);

  /* Ceremony colours on the wardrobe rack, and the venue's map. */
  Invite.on('render', function () {
    draw(document);
    document.querySelectorAll('.do[data-from="events"]').forEach(function (li) {
      var ev = data.events[+li.getAttribute('data-index')];
      li.classList.toggle('major', !!ev.major);
      var dot = li.querySelector('.do-dot');
      if (dot && ev.colour) dot.style.background = ev.colour;
    });
    document.querySelectorAll('.wear[data-from="events"]').forEach(function (li) {
      var ev = data.events[+li.getAttribute('data-index')];
      var swatch = li.querySelector('[data-swatch]');
      if (swatch && ev.colour) swatch.style.background = ev.colour;
    });

    var place = data.venue || {};
    var query = place.mapQuery || [Invite.t(place.name), Invite.t(place.address)].filter(Boolean).join(', ');
    var link = document.querySelector('[data-venue-map]');
    if (link && query) link.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    var frame = document.querySelector('[data-map-embed]');
    if (frame && query && !frame.firstChild) {
      frame.innerHTML = '<iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
        'src="https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed"></iframe>';
    }
  });

  /* The cover: nothing happens until the gulal comes off. */
  var scratched = false;
  var enter = document.getElementById('open-invite');
  var cover = document.getElementById('cover');
  if (enter) enter.hidden = true;

  function blockEarly(event) {
    if (scratched || Invite.still || !cover || cover.hidden) return;
    if (!cover.contains(event.target)) return;
    if (enter && enter.contains(event.target)) return;
    event.stopImmediatePropagation();
  }
  document.addEventListener('click', blockEarly, true);
  document.addEventListener('keydown', function (event) {
    if (scratched || Invite.still) return;
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') event.stopImmediatePropagation();
  }, true);

  Invite.on('scratched', function () {
    if (scratched) return;
    scratched = true;
    root.classList.add('is-scratched');
    if (enter) enter.hidden = false;
    burst(22);
    try { if (enter) enter.focus({ preventScroll: true }); } catch (e) {}
  });
  // A few specks follow the thumb while it rubs.
  Invite.on('scratching', function (detail) {
    if (Math.random() > 0.35) return;
    var box = detail.box.getBoundingClientRect();
    speck(box.left + detail.x, box.top + detail.y);
  });
  Invite.on('open', function () { burst(40); });

  /* Gulal specks and confetti, drawn as small elements so there is no canvas to size. */
  var COLOURS = ['#F4C21B', '#E4508A', '#5E7A2E', '#6EC3E0', '#E87A2B', '#C2266E'];
  function speck(x, y) {
    var s = document.createElement('i');
    s.className = 'speck';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.background = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    s.style.setProperty('--x', ((Math.random() - 0.5) * 60).toFixed(1) + 'px');
    s.style.setProperty('--y', (20 + Math.random() * 50).toFixed(1) + 'px');
    s.style.setProperty('--s', (0.5 + Math.random()).toFixed(2));
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 900);
  }
  function burst(count) {
    if (Invite.still) return;
    var midX = window.innerWidth / 2, midY = window.innerHeight * 0.45;
    for (var i = 0; i < count; i++) {
      var c = document.createElement('i');
      var angle = Math.random() * Math.PI * 2;
      var dist = 80 + Math.random() * 220;
      c.className = 'confetti';
      c.style.left = midX + 'px';
      c.style.top = midY + 'px';
      c.style.background = COLOURS[i % COLOURS.length];
      c.style.setProperty('--x', (Math.cos(angle) * dist).toFixed(1) + 'px');
      c.style.setProperty('--y', (Math.sin(angle) * dist * 0.7 + 200).toFixed(1) + 'px');
      c.style.setProperty('--r', Math.round(Math.random() * 720 - 360) + 'deg');
      c.style.setProperty('--d', (Math.random() * 0.25).toFixed(2) + 's');
      document.body.appendChild(c);
      setTimeout(function (el) { el.remove(); }.bind(null, c), 2200);
    }
  }
})();
