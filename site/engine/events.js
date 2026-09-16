/* Invite Studio engine: countdown, add-to-calendar and directions.
   details.js: events: [{ id, name, start, end, venue: { name, address, mapQuery }, major }]
   Markup: [data-countdown] holding [data-count="days|hours|minutes|seconds"], and inside each
   repeated event, links marked [data-calendar] and [data-map]. */
(function () {
  var Invite = window.Invite;
  var data = Invite.data;
  var t = Invite.t;
  var events = data.events || [];
  var isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);

  /* Countdown to data.countdownTo, or to the first main ceremony. */
  var mainEvent = events.filter(function (e) { return e.major; })[0] || events[0];
  var target = new Date(data.countdownTo || (mainEvent && mainEvent.start)).getTime();
  var timer = 0;
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tick() {
    var boxes = document.querySelectorAll('[data-countdown]');
    if (!boxes.length || isNaN(target)) return;
    var left = Math.max(0, Math.floor((target - Date.now()) / 1000));
    var parts = { days: Math.floor(left / 86400), hours: Math.floor(left % 86400 / 3600), minutes: Math.floor(left % 3600 / 60), seconds: left % 60 };
    boxes.forEach(function (box) {
      box.classList.toggle('is-done', left === 0);
      box.querySelectorAll('[data-count]').forEach(function (el) {
        var value = pad(parts[el.getAttribute('data-count')]);
        if (el.textContent !== value) el.textContent = value;
      });
    });
    if (left === 0) clearInterval(timer);
  }
  Invite.on('ready', function () {
    tick();
    if (!Invite.still) timer = setInterval(tick, 1000);
  });

  /* Calendar and map links, refreshed whenever the page re-renders (language switch). */
  function stamp(date) { return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function escapeIcs(text) { return String(text).replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n'); }
  function couple() { return t(data.couple.groom) + ' & ' + t(data.couple.bride); }
  function times(ev) {
    var start = new Date(ev.start);
    var end = ev.end ? new Date(ev.end) : new Date(start.getTime() + 3 * 36e5);
    return { start: start, end: end };
  }
  function place(ev) {
    var v = ev.venue || {};
    return [t(v.name), t(v.address)].filter(Boolean).join(', ');
  }
  function icsFile(ev) {
    var when = times(ev);
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invite Studio//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:' + (data.slug || 'invite') + '-' + ev.id + '@invite-studio',
      'DTSTAMP:' + stamp(new Date()),
      'DTSTART:' + stamp(when.start),
      'DTEND:' + stamp(when.end),
      'SUMMARY:' + escapeIcs(t(ev.name) + ' · ' + couple()),
      'LOCATION:' + escapeIcs(place(ev)),
      'DESCRIPTION:' + escapeIcs(location.href.split('?')[0]),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
  }
  function googleLink(ev) {
    var when = times(ev);
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(t(ev.name) + ' · ' + couple()) +
      '&dates=' + stamp(when.start) + '/' + stamp(when.end) +
      '&ctz=Asia/Kolkata' +
      '&location=' + encodeURIComponent(place(ev)) +
      '&details=' + encodeURIComponent(location.href.split('?')[0]);
  }
  function mapLink(ev) {
    var v = ev.venue || {};
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v.mapQuery || place(ev));
  }
  function eventFor(el) {
    var holder = el.closest('[data-from="events"]');
    return holder ? events[+holder.getAttribute('data-index')] : null;
  }

  Invite.on('render', function () {
    document.querySelectorAll('[data-calendar]').forEach(function (a) {
      var ev = eventFor(a);
      if (!ev || !ev.start) { a.hidden = true; return; }
      if (isApple) {
        a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsFile(ev));
        a.setAttribute('download', (data.slug || 'invite') + '-' + ev.id + '.ics');
        a.removeAttribute('target');
      } else {
        a.href = googleLink(ev);
        a.target = '_blank';
        a.rel = 'noopener';
      }
    });
    document.querySelectorAll('[data-map]').forEach(function (a) {
      var ev = eventFor(a);
      if (!ev || !ev.venue) { a.hidden = true; return; }
      a.href = mapLink(ev);
      a.target = '_blank';
      a.rel = 'noopener';
    });
  });
})();
