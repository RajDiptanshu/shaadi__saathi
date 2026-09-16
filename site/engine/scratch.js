/* Invite Studio engine: scratch to reveal.
   Any element marked [data-scratch] gets a foil cover the guest rubs away with a finger.

   <div class="scratch" data-scratch data-scratch-label="Scratch to reveal">
     …the thing underneath…
   </div>

   The cover's colour comes from --scratch-foil / --scratch-foil-edge on the element.
   Themes can shower petals or hearts by listening for Invite.on('scratching', …).
   A "Reveal" button is added for keyboards and for anyone who would rather not scratch. */
(function () {
  var Invite = window.Invite;
  var boxes = document.querySelectorAll('[data-scratch]');
  if (!boxes.length) return;

  var REVEAL_AT = 0.45; // Rubbed away this much of the cover and the rest falls away on its own.

  function setup(box) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return; // Without canvas the guest simply sees what is underneath.

    canvas.className = 'scratch-foil';
    canvas.setAttribute('aria-hidden', 'true');
    box.appendChild(canvas);
    box.classList.add('has-foil');

    var reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.className = 'scratch-reveal';
    reveal.textContent = box.getAttribute('data-scratch-label') || Invite.t(Invite.data.ui.scratchHint) || 'Reveal';
    box.appendChild(reveal);

    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, done = false, drawing = false, last = null, checked = 0;

    function size() {
      var rect = box.getBoundingClientRect();
      if (!rect.width || !rect.height || done) return;
      if (Math.abs(rect.width - w) < 2 && Math.abs(rect.height - h) < 2) return;
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      paint();
    }
    function paint() {
      var style = getComputedStyle(box);
      var foil = (style.getPropertyValue('--scratch-foil') || '#D9B356').trim();
      var edge = (style.getPropertyValue('--scratch-foil-edge') || '#F3E0A8').trim();
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      var sheen = ctx.createLinearGradient(0, 0, w, h);
      sheen.addColorStop(0, foil);
      sheen.addColorStop(0.35, edge);
      sheen.addColorStop(0.55, foil);
      sheen.addColorStop(0.85, edge);
      sheen.addColorStop(1, foil);
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, w, h);
      // A little brushed texture so it reads as foil rather than a flat block.
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      for (var x = -h; x < w; x += 7) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function rub(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(26, Math.min(w, h) * 0.22);
      ctx.beginPath();
      if (last) ctx.moveTo(last[0], last[1]);
      else ctx.moveTo(x - 0.1, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      last = [x, y];
      Invite.emit('scratching', { box: box, x: x, y: y });
    }

    // Sampling a grid of pixels is enough to know roughly how much is gone.
    function cleared() {
      var step = 16, gone = 0, total = 0;
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (var y = 0; y < canvas.height; y += step) {
        for (var x = 0; x < canvas.width; x += step) {
          total++;
          if (data[(y * canvas.width + x) * 4 + 3] < 40) gone++;
        }
      }
      return total ? gone / total : 0;
    }

    function finish() {
      if (done) return;
      done = true;
      box.classList.add('is-revealed');
      reveal.hidden = true;
      Invite.emit('scratched', box);
      setTimeout(function () { canvas.remove(); }, 900);
    }

    function point(event) {
      var rect = canvas.getBoundingClientRect();
      return [event.clientX - rect.left, event.clientY - rect.top];
    }
    canvas.addEventListener('pointerdown', function (event) {
      if (done) return;
      drawing = true;
      last = null;
      try { canvas.setPointerCapture(event.pointerId); } catch (e) {}
      var p = point(event);
      rub(p[0], p[1]);
    });
    canvas.addEventListener('pointermove', function (event) {
      if (!drawing || done) return;
      event.preventDefault();
      var p = point(event);
      rub(p[0], p[1]);
      if (Date.now() - checked > 220) {
        checked = Date.now();
        if (cleared() > REVEAL_AT) finish();
      }
    });
    function stop() {
      if (!drawing) return;
      drawing = false;
      last = null;
      if (!done && cleared() > REVEAL_AT) finish();
    }
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    canvas.addEventListener('pointerleave', stop);
    reveal.addEventListener('click', finish);

    size();
    window.addEventListener('resize', size);
    Invite.on('ready', size);
    Invite.on('opened', size);
    if (Invite.still) finish(); // Share images and screenshots show the answer.
  }

  boxes.forEach(setup);
})();
