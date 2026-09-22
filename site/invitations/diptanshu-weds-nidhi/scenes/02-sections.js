/* Lal & Sona · the invitation's own behaviour.
   Background mounting, ornament, the letter and word reveals, the running ribbon, and the deferred
   loading of every image behind the silk. The gallery has its own module. */
(function () {
  var Invite = window.Invite;
  var Orn = window.Ornament;
  var data = Invite.data;

  var WIDTHS = [1080, 1440, 1920];

  /* ---- images -------------------------------------------------------------------------------- */

  /* An image is referenced by its stem ("assets/photography/p01-reception"); the widths and formats are
     the ones the build scripts always write, so the markup never repeats them. */
  function picture(stem, alt, eager) {
    var pic = document.createElement('picture');
    ['avif', 'webp'].forEach(function (ext) {
      var source = document.createElement('source');
      source.type = 'image/' + ext;
      source.sizes = '100vw';
      source.setAttribute(eager ? 'srcset' : 'data-srcset', WIDTHS.map(function (w) {
        return stem + '-' + w + '.' + ext + ' ' + w + 'w';
      }).join(', '));
      pic.appendChild(source);
    });
    var img = document.createElement('img');
    img.alt = alt || '';
    img.decoding = 'async';
    img.setAttribute(eager ? 'src' : 'data-src', stem + '-1080.jpg');
    pic.appendChild(img);
    return pic;
  }

  function hydrate(scope) {
    (scope || document).querySelectorAll('[data-srcset]').forEach(function (el) {
      el.srcset = el.getAttribute('data-srcset');
      el.removeAttribute('data-srcset');
    });
    (scope || document).querySelectorAll('img[data-src]').forEach(function (el) {
      el.src = el.getAttribute('data-src');
      el.removeAttribute('data-src');
    });
  }

  /* ---- the built backgrounds ------------------------------------------------------------------ */

  /* Every [data-world] section gets its layers built and then registered with the stage, which slides
     each layer by its own depth from the single scroll read. The art costs bytes of code rather than
     megabytes of image, which is the only reason a page with this many full-bleed scenes fits the
     phone budget. */
  function buildWorlds() {
    document.querySelectorAll('[data-world]').forEach(function (section) {
      var name = section.getAttribute('data-world');
      var spec = window.Worlds && window.Worlds[name];
      if (!spec || section.querySelector('.world')) return;

      var mount = document.createElement('div');
      mount.className = 'world-mount';
      mount.setAttribute('aria-hidden', 'true');
      window.World.build(mount, spec);
      section.insertBefore(mount, section.firstChild);

      window.Stage.parallax(mount, { range: parseFloat(section.getAttribute('data-range')) || 14 });
    });
    // Stills never scroll, so the layers need their one settled frame written directly.
    if (Invite.still) window.Stage.settle();
  }

  /* ---- ornament ------------------------------------------------------------------------------- */

  function mountOrnament() {
    var arch = document.getElementById('hero-arch-mount');
    if (arch && !arch.firstChild) arch.appendChild(Orn.arch());

    var cue = document.getElementById('hero-cue-mount');
    if (cue && !cue.firstChild) cue.appendChild(Orn.arrow());

    var arrow = document.getElementById('card-arrow-mount');
    if (arrow && !arrow.firstChild) arrow.appendChild(Orn.arrow());

    // These mounts already hold their words, so the frame goes in front of them, not after.
    var note = document.getElementById('note-frame');
    if (note && !note.querySelector('.scallop')) note.insertBefore(Orn.scallopFrame(), note.firstChild);

    var bloom = document.getElementById('note-bloom');
    if (bloom && !bloom.firstChild) {
      var svg = Orn.svg('0 0 44 44', 'bloom-mark');
      Orn.bloom(svg, 22, 22, 18);
      bloom.appendChild(svg);
    }

    var sheet = document.getElementById('card-sheet');
    if (sheet && !sheet.querySelector('.card-corner')) {
      ['tl', 'tr', 'bl', 'br'].forEach(function (pos) {
        var c = Orn.corner(pos);
        c.classList.add('card-corner', pos);
        sheet.appendChild(c);
      });
    }

    document.querySelectorAll('[data-deco]').forEach(function (node) {
      if (node.firstChild) return;
      node.appendChild(Orn.deco());
    });
  }

  /* ---- the letter and word reveals ------------------------------------------------------------- */

  /* Split on render, because a language switch replaces the text wholesale. The text alone is not
     enough to skip on: every render refills the node from details.js and wipes the spans, so a node
     whose text is unchanged but whose spans are gone still has to be re-split. */
  function splitInto(selector, cls, varName) {
    document.querySelectorAll(selector).forEach(function (node) {
      var text = node.textContent.trim();
      if (!text) return;
      if (node.querySelector('.' + cls) && node.getAttribute('data-split-of') === text) return;
      node.setAttribute('data-split-of', text);
      node.textContent = '';

      var parts = cls === 'word' ? text.split(/\s+/) : text.split('');
      parts.forEach(function (part, i) {
        var span = document.createElement('span');
        span.className = cls;
        span.style.setProperty(varName, i);
        span.textContent = part;
        node.appendChild(span);
        if (cls === 'word') node.appendChild(document.createTextNode(' '));
      });
    });
  }
  function splitWords() { splitInto('[data-words]', 'word', '--w'); }
  /* Letters only on the masthead. Splitting a paragraph per character would put a thousand nodes on a
     phone for no visible gain. */
  function splitChars() { splitInto('[data-chars]', 'char', '--c'); }

  /* ---- the running ribbon ---------------------------------------------------------------------- */

  /* One run of items is built, then duplicated, and the track is translated by exactly -50%: that is
     what makes the loop seamless rather than jumping at the end. */
  function buildRibbon() {
    var track = document.getElementById('ribbon-track');
    if (!track) return;
    track.textContent = '';
    var t = Invite.t;
    var words = [
      t(data.couple.brideFull),
      t(data.copy.heroJoin),
      t(data.couple.groomFull),
      Invite.formatDate(data.countdownTo, 'date'),
      t(data.copy.ribbon)
    ];
    function run() {
      var frag = document.createDocumentFragment();
      words.forEach(function (word) {
        var item = document.createElement('div');
        item.className = 'ribbon-item';
        var span = document.createElement('span');
        span.textContent = word;
        var dot = document.createElement('i');
        dot.className = 'ribbon-dot';
        item.appendChild(span);
        item.appendChild(dot);
        frag.appendChild(item);
      });
      return frag;
    }
    track.appendChild(run());
    track.appendChild(run());
  }

  /* ---- wiring ------------------------------------------------------------------------------------ */

  /* The foil gradients are clipped to the glyphs, so the text is invisible until the face has decoded.
     Holding the solid colour until then costs nothing and avoids an empty masthead on first paint. */
  function watchFonts() {
    var done = function () { document.documentElement.classList.add('fonts-ready'); };
    if (!document.fonts || !document.fonts.ready) return done();
    document.fonts.ready.then(done);
    setTimeout(done, 2500);
  }

  Invite.on('ready', function () {
    buildWorlds();
    watchFonts();
  });

  // A language switch rebuilds every repeated card from its template, which throws away the ornament
  // mounted inside it — so the mounting belongs here, not only on 'ready'.
  Invite.on('render', function () {
    mountOrnament();
    splitWords();
    splitChars();
    buildRibbon();
  });

  Invite.on('opening', function () { hydrate(document); });
  Invite.on('opened', function () {
    hydrate(document);
    window.Stage.settle();
  });

  // ?still and the share-card modes never run the opening, so nothing would have loaded the rest.
  if (Invite.still) {
    Invite.on('ready', function () {
      hydrate(document);
      window.Stage.settle();
    });
  }
})();
