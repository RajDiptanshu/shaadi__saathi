/* Invite Studio engine: RSVP.
   details.js: rsvp: { endpoint: 'https://script.google.com/macros/s/…/exec', maxGuests: 4 }
   Events marked rsvp: true become the "which celebrations" choices.
   The form is built inside [data-rsvp]; each theme styles the .rs-* classes.
   Replies go to the couple's Google Sheet through the Apps Script in engine/apps-script/Code.gs.
   Without an endpoint, or outside an https site, sending is only simulated. */
(function () {
  var Invite = window.Invite;
  var data = Invite.data;
  var t = Invite.t;
  var box = document.querySelector('[data-rsvp]');
  var cfg = data.rsvp;
  if (!box || !cfg) return;

  var STORAGE_KEY = 'invite-' + (data.slug || 'demo') + '-rsvp';
  var MAX = cfg.maxGuests || 4;
  var live = !!cfg.endpoint && location.protocol === 'https:' && !/claude/i.test(location.hostname);
  function ui(key) { return t(data.ui[key]); }
  function tick() { return '<svg class="rs-tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.6 11.5 12.5 4.8"/></svg>'; }
  function pill(value, key) {
    return '<label class="rs-pill"><input type="radio" name="joining" value="' + value + '"><span class="rs-pill-face">' + tick() + '<span data-t="ui.' + key + '"></span></span></label>';
  }

  box.innerHTML =
    '<form class="rs-form" novalidate>' +
      '<div class="rs-q" data-reveal>' +
        '<label class="rs-title" for="rs-name" data-t="ui.yourName"></label>' +
        '<input class="rs-input" id="rs-name" type="text" autocomplete="name" autocapitalize="words" enterkeyhint="done" maxlength="80" data-attr="placeholder:ui.namePlaceholder" aria-describedby="rs-name-error">' +
        '<p class="rs-error" id="rs-name-error" hidden></p>' +
      '</div>' +
      '<div class="rs-q rs-joining" role="group" aria-labelledby="rs-joining-title" aria-describedby="rs-joining-error" data-reveal>' +
        '<p class="rs-title" id="rs-joining-title" data-t="ui.joining"></p>' +
        '<div class="rs-pills">' + pill('yes', 'yes') + pill('no', 'no') + '</div>' +
        '<p class="rs-error" id="rs-joining-error" hidden></p>' +
      '</div>' +
      '<div class="rs-q rs-coming" role="group" aria-labelledby="rs-events-title" aria-describedby="rs-events-error" hidden>' +
        '<p class="rs-title" id="rs-events-title" data-t="ui.whichEvents"></p>' +
        '<div class="rs-checks">' +
          '<template data-each="events" data-filter="rsvp">' +
            '<label class="rs-check"><input type="checkbox" name="event" data-attr="value:.id">' +
              '<span class="rs-check-face"><span class="rs-check-text"><span class="rs-check-name" data-t=".name"></span>' +
              '<span class="rs-check-meta" data-date=".start" data-format="short"></span></span>' +
              '<span class="rs-box" aria-hidden="true">' + tick() + '</span></span></label>' +
          '</template>' +
        '</div>' +
        '<p class="rs-error" id="rs-events-error" hidden></p>' +
      '</div>' +
      '<div class="rs-q rs-coming" hidden>' +
        '<p class="rs-title" id="rs-guests-title" data-t="ui.guests"></p>' +
        '<div class="rs-stepper" role="group" aria-labelledby="rs-guests-title">' +
          '<button type="button" class="rs-step" data-step="-1" data-attr="aria-label:ui.fewer"><span aria-hidden="true">−</span></button>' +
          '<output class="rs-count" id="rs-count" aria-live="polite">1</output>' +
          '<button type="button" class="rs-step" data-step="1" data-attr="aria-label:ui.more"><span aria-hidden="true">+</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="rs-q" data-reveal>' +
        '<label class="rs-title" for="rs-wish"><span data-t="ui.wish"></span> <span class="rs-optional" data-t="ui.optional"></span></label>' +
        '<textarea class="rs-note" id="rs-wish" rows="3" maxlength="500" data-attr="placeholder:ui.wishPlaceholder"></textarea>' +
      '</div>' +
      (live ? '' : '<p class="rs-preview" data-t="ui.previewNote"></p>') +
      '<p class="rs-error rs-send-error" id="rs-send-error" role="alert" hidden></p>' +
      '<button class="rs-send" type="submit"><span data-t="ui.send"></span></button>' +
    '</form>' +
    '<div class="rs-thanks" tabindex="-1" hidden>' +
      '<p class="rs-thanks-title"></p><p class="rs-thanks-text"></p>' +
      '<button type="button" class="rs-change" data-t="ui.change"></button>' +
    '</div>';

  var form = box.querySelector('.rs-form');
  var thanks = box.querySelector('.rs-thanks');
  var nameInput = box.querySelector('#rs-name');
  var wishInput = box.querySelector('#rs-wish');
  var countEl = box.querySelector('#rs-count');
  var sendButton = box.querySelector('.rs-send');
  var guests = 1;
  var last = null;

  function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; } }
  function store(reply) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reply)); } catch (e) {} }
  function makeId() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }
  function joining() {
    var input = form.querySelector('input[name="joining"]:checked');
    return input ? input.value : '';
  }
  function ticked() {
    return Array.prototype.map.call(form.querySelectorAll('input[name="event"]:checked'), function (i) { return i.value; });
  }
  function showError(id, key) {
    var el = box.querySelector('#' + id);
    el.textContent = key ? ui(key) : '';
    el.hidden = !key;
  }
  function setGuests(n) {
    guests = Math.max(1, Math.min(MAX, n));
    countEl.textContent = guests;
    box.querySelector('[data-step="-1"]').disabled = guests <= 1;
    box.querySelector('[data-step="1"]').disabled = guests >= MAX;
  }
  function syncSteps(animate) {
    var choice = joining();
    form.querySelector('.rs-joining').setAttribute('data-choice', choice);
    form.querySelectorAll('.rs-coming').forEach(function (q) {
      q.classList.toggle('rs-step-in', !!animate);
      q.hidden = choice !== 'yes';
    });
  }
  function eventNames(ids) {
    var names = (data.events || []).filter(function (ev) { return ids.indexOf(ev.id) >= 0; }).map(function (ev) { return t(ev.name); });
    if (names.length < 2) return names.join('');
    return names.slice(0, -1).join(', ') + ui('and') + names[names.length - 1];
  }
  function fillThanks() {
    if (!last) return;
    var first = last.name.split(' ')[0];
    var coming = last.attending === 'Yes';
    box.querySelector('.rs-thanks-title').textContent = ui(coming ? 'thanksYesTitle' : 'thanksNoTitle').replace('{name}', first);
    box.querySelector('.rs-thanks-text').textContent = ui(coming ? 'thanksYesText' : 'thanksNoText').replace('{events}', eventNames(last.events));
  }
  function showThanks(reply, justSent) {
    last = reply;
    fillThanks();
    form.hidden = true;
    thanks.hidden = false;
    if (justSent) {
      try { thanks.focus({ preventScroll: true }); } catch (e) {}
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
      Invite.emit('rsvp', reply);
    }
  }

  setGuests(1);
  box.querySelectorAll('[data-step]').forEach(function (button) {
    button.addEventListener('click', function () { setGuests(guests + +button.getAttribute('data-step')); });
  });
  form.addEventListener('change', function (event) {
    if (event.target.name === 'joining') { showError('rs-joining-error'); syncSteps(true); }
    if (event.target.name === 'event') { showError('rs-events-error'); selected = ticked(); }
  });
  // Switching language rebuilds the celebration choices, so the ticks are put back afterwards.
  var selected = [];
  Invite.on('render', function () {
    form.querySelectorAll('input[name="event"]').forEach(function (i) { i.checked = selected.indexOf(i.value) >= 0; });
  });
  nameInput.addEventListener('input', function () {
    if (nameInput.value.trim()) { showError('rs-name-error'); nameInput.removeAttribute('aria-invalid'); }
  });

  var saved = load();
  var replyId = (saved && saved.id) || makeId();

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = nameInput.value.replace(/\s+/g, ' ').trim();
    var choice = joining();
    var coming = choice === 'yes';
    var events = coming ? ticked() : [];
    var hasChoices = !!form.querySelector('input[name="event"]');
    var problem = null;

    if (!name) { showError('rs-name-error', 'nameMissing'); nameInput.setAttribute('aria-invalid', 'true'); problem = nameInput; }
    if (!choice) { showError('rs-joining-error', 'joiningMissing'); problem = problem || form.querySelector('input[name="joining"]'); }
    if (coming && hasChoices && !events.length) { showError('rs-events-error', 'eventsMissing'); problem = problem || form.querySelector('input[name="event"]'); }
    if (problem) {
      try { problem.focus({ preventScroll: true }); } catch (e) {}
      problem.closest('.rs-q').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var reply = {
      id: replyId,
      invite: data.slug || '',
      name: name,
      attending: coming ? 'Yes' : 'No',
      events: events,
      eventNames: (data.events || []).filter(function (ev) { return events.indexOf(ev.id) >= 0; }).map(function (ev) { return t(ev.name, 'en'); }),
      guests: coming ? guests : 0,
      wish: wishInput.value.trim()
    };
    showError('rs-send-error');
    sendButton.disabled = true;
    sendButton.firstChild.textContent = ui('sending');
    function finish() {
      sendButton.disabled = false;
      sendButton.firstChild.textContent = ui('send');
    }
    if (!live) {
      setTimeout(function () { finish(); store(reply); showThanks(reply, true); }, 700);
      return;
    }
    // Plain-text body keeps it a simple request, which Apps Script accepts without a preflight.
    fetch(cfg.endpoint, { method: 'POST', body: JSON.stringify(reply) })
      .then(function (r) { return r.json(); })
      .then(function (result) {
        if (!result || !result.ok) throw new Error('Reply not saved');
        finish();
        store(reply);
        showThanks(reply, true);
      })
      .catch(function () {
        finish();
        showError('rs-send-error', 'sendFailed');
      });
  });

  box.querySelector('.rs-change').addEventListener('click', function () {
    thanks.hidden = true;
    form.hidden = false;
    nameInput.focus();
  });

  Invite.on('lang', fillThanks);
  Invite.on('ready', function () {
    if (!saved || !saved.name) return;
    nameInput.value = saved.name;
    form.querySelectorAll('input[name="joining"]').forEach(function (i) { i.checked = i.value === (saved.attending === 'Yes' ? 'yes' : 'no'); });
    selected = (saved.events || []).slice();
    form.querySelectorAll('input[name="event"]').forEach(function (i) { i.checked = selected.indexOf(i.value) >= 0; });
    setGuests(saved.guests || 1);
    wishInput.value = saved.wish || '';
    syncSteps(false);
    showThanks(saved, false);
  });
})();
