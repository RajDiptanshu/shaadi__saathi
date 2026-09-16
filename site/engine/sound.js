/* Invite Studio engine: music and an opening sound.
   details.js: music: { src, cue, loopStart, loopLength }
   A loop file made like the family invite's (half a second of wraparound at each end) sets
   loopStart 0.5 and loopLength to the phrase length, so Web Audio repeats it with no gap.
   Phones only allow sound after a tap, so everything starts from the opening tap. */
(function () {
  var Invite = window.Invite;
  var music = Invite.data.music;
  var toggle = document.getElementById('sound-toggle');
  if (!music || !music.src || Invite.still) {
    if (toggle) toggle.hidden = true;
    return;
  }

  var KEY = 'invite-' + (Invite.data.slug || 'demo') + '-music';
  var LOOP_START = music.loopStart || 0;
  var LOOP_LENGTH = music.loopLength || 0;
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var useElement = !AudioCtx || !window.fetch || !window.Promise;
  var wanted = true;
  var started = false;
  var failed = false;
  var audio = null, bytes = null, buffer = null, fadeTimer = 0;

  var el = new Audio();
  el.preload = 'none';
  el.src = music.src;
  var cue = null;
  if (music.cue) {
    cue = new Audio();
    cue.preload = 'auto';
    cue.src = music.cue;
  }
  try { wanted = localStorage.getItem(KEY) !== 'off'; } catch (e) {}

  function quiet(p) { if (p && p.catch) p.catch(function () {}); }
  function setToggle(on) { if (toggle) toggle.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  function giveUp() {
    failed = true;
    setToggle(false);
    if (toggle) toggle.hidden = true;
  }

  // Fetch while the cover shows; decode after the tap.
  if (!useElement) {
    bytes = fetch(music.src).then(function (r) {
      if (!r.ok) throw new Error('Music failed to load: HTTP ' + r.status);
      return r.arrayBuffer();
    });
    quiet(bytes);
  }
  // iPhone: play like a music app even with the ringer switch on silent.
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}

  function ensureContext() {
    if (!audio) {
      try {
        var ctx = new AudioCtx();
        var gain = ctx.createGain();
        gain.gain.value = 0;
        gain.connect(ctx.destination);
        audio = { ctx: ctx, gain: gain, source: null };
      } catch (e) { return false; }
    }
    if (audio.ctx.state !== 'running') quiet(audio.ctx.resume());
    return true;
  }
  function decode() {
    if (!buffer) {
      buffer = bytes.then(function (b) {
        return new Promise(function (resolve, reject) {
          var d = audio.ctx.decodeAudioData(b, resolve, reject);
          if (d && d.then) d.then(resolve, reject);
        });
      });
    }
    return buffer;
  }
  function rampTo(target, seconds) {
    var level = audio.gain.gain, now = audio.ctx.currentTime;
    level.cancelScheduledValues(now);
    level.setValueAtTime(level.value, now);
    level.linearRampToValueAtTime(target, now + seconds);
  }
  function fadeElement(target, ms) {
    clearInterval(fadeTimer);
    var from = el.volume, t0 = Date.now();
    fadeTimer = setInterval(function () {
      var k = Math.min(1, (Date.now() - t0) / ms);
      try { el.volume = from + (target - from) * k; } catch (e) {}
      if (k >= 1) clearInterval(fadeTimer);
    }, 50);
  }

  function play() {
    if (!wanted || failed) return;
    started = true;
    if (useElement) {
      el.muted = false;
      try { el.volume = 0; } catch (e) {}
      quiet(el.play());
      fadeElement(1, 3000);
      return;
    }
    if (!audio) return;
    if (audio.ctx.state !== 'running') quiet(audio.ctx.resume());
    if (audio.source) { rampTo(1, 1.2); return; }
    decode().then(function (buf) {
      if (audio.source) return;
      var source = audio.ctx.createBufferSource();
      source.buffer = buf;
      source.loop = true;
      if (LOOP_LENGTH) {
        source.loopStart = LOOP_START;
        source.loopEnd = LOOP_START + LOOP_LENGTH;
      }
      source.connect(audio.gain);
      source.start(0, LOOP_START);
      audio.source = source;
      rampTo(wanted ? 1 : 0, 3);
      if (document.hidden) quiet(audio.ctx.suspend());
    }, giveUp);
  }
  function stop() {
    if (useElement) {
      fadeElement(0, 400);
      setTimeout(function () { if (!wanted) el.pause(); }, 450);
    } else if (audio) {
      rampTo(0, 0.4);
      setTimeout(function () { if (!wanted) quiet(audio.ctx.suspend()); }, 450);
    }
  }

  // Runs inside the opening tap: the cue sounds at once, the music follows.
  Invite.on('open', function () {
    if (toggle) toggle.hidden = false;
    if (cue) {
      try { cue.currentTime = 0; } catch (e) {}
      quiet(cue.play());
    }
    setToggle(wanted && !failed);
    if (!wanted || failed) return;
    if (!useElement && !ensureContext()) useElement = true;
    var delay = music.delay != null ? music.delay : 1100;
    if (useElement) {
      el.muted = true;
      var unlock = el.play();
      var hold = function () { el.pause(); setTimeout(play, delay); };
      if (unlock && unlock.then) unlock.then(hold, function () { setToggle(false); });
      else hold();
    } else {
      setTimeout(play, delay);
    }
  });
  // Opened without a tap (?open or a share image): offer the button, start nothing.
  Invite.on('opened', function (detail) {
    if (detail && detail.instant && toggle) {
      toggle.hidden = false;
      setToggle(false);
    }
  });

  el.addEventListener('timeupdate', function () {
    if (LOOP_LENGTH && el.currentTime >= LOOP_START + LOOP_LENGTH) el.currentTime -= LOOP_LENGTH;
  });
  el.addEventListener('ended', function () {
    el.currentTime = LOOP_START;
    if (wanted) quiet(el.play());
  });
  el.addEventListener('error', function () { if (useElement) giveUp(); });

  if (toggle) {
    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      wanted = toggle.getAttribute('aria-pressed') !== 'true';
      try { localStorage.setItem(KEY, wanted ? 'on' : 'off'); } catch (e) {}
      setToggle(wanted);
      if (!wanted) { stop(); return; }
      if (!useElement && !ensureContext()) useElement = true;
      play();
    });
  }
  document.addEventListener('visibilitychange', function () {
    if (!started) return;
    if (!document.hidden) { if (wanted) play(); }
    else if (useElement) el.pause();
    else if (audio) quiet(audio.ctx.suspend());
  });
})();
