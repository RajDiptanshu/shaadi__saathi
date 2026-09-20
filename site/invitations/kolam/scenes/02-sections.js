/* Kolam · the scenes after the threshold. Splits the names into words for the hero (CSS: .couple-line .wi),
   draws the small kolam dividers, lets the kasavu border draw down the paper as the guest scrolls, and lets the
   camera drift over the venue. Text never moves with scroll; only the border and photographs do. */
(function () {
  var Invite = window.Invite, P = Invite.motion.policy;
  var NS = 'http://www.w3.org/2000/svg';

  function split() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-split]'), function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach(function (word, i) {
        var w = document.createElement('span'), wi = document.createElement('span');
        w.className = 'w'; wi.className = 'wi'; wi.style.setProperty('--i', i); wi.textContent = word;
        w.appendChild(wi); el.appendChild(w);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }
  Invite.on('render', split);

  function dividers() {
    if (!window.Kolam) return;
    Array.prototype.forEach.call(document.querySelectorAll('.kolam-divider'), function (svg) {
      var dims = (svg.getAttribute('data-kolam') || '3,4').split(',').map(Number);
      var k = Kolam.build(dims[0], dims[1], 12, 6);
      svg.setAttribute('viewBox', '0 0 ' + k.width + ' ' + k.height);
      svg.style.width = k.width * 1.2 + 'px';
      svg.innerHTML = '';
      k.dots.forEach(function (d) {
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', d.x); c.setAttribute('cy', d.y); c.setAttribute('r', '1.1');
        svg.appendChild(c);
      });
      k.paths.forEach(function (d) {
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        svg.appendChild(p);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dividers); else dividers();

  var borders = Array.prototype.slice.call(document.querySelectorAll('[data-kasavu]'));
  var venuePhoto = document.querySelector('.venue-photo img'), venueBox = document.querySelector('.venue-photo');
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    borders.forEach(function (b) {
      var r = b.parentNode.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (r.height * 0.85)));
      b.style.setProperty('--p', p.toFixed(3));
    });
    if (venuePhoto && venueBox) {
      var v = venueBox.getBoundingClientRect();
      var q = Math.min(1, Math.max(0, (vh - v.top) / (vh + v.height)));
      venuePhoto.style.transform = 'translate3d(0,' + (-(q * 0.08 * v.height)).toFixed(1) + 'px,0) scale(1.1)';
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('load', function () {
    P.whenDecided(function (ok) {
      if (!ok || P.reduced) { borders.forEach(function (b) { b.style.setProperty('--p', '1'); }); return; }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
    });
  });
})();
