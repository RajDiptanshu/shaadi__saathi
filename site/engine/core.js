/* Invite Studio engine: core.
   Every demo page loads details.js (window.INVITE, the couple's details) and then this file.
   It fills the page from those details, switches language, runs the opening and reveals sections.
   Themes add their own artwork and timing through Invite.on('open'), Invite.on('opened') and Invite.timing. */
(function () {
  var root = document.documentElement;
  var data = window.INVITE || {};
  var params = new URLSearchParams(location.search);
  var card = params.get('card');
  var og = params.has('og');
  var still = params.has('still') || !!card || og;
  var listeners = {};
  // Shared interface words (engine/strings.js), which a couple's details can override.
  data.ui = Object.assign({}, window.INVITE_STRINGS || {}, data.ui || {});
  var langs = data.langs && data.langs.length ? data.langs : ['en'];
  var LANG_KEY = 'invite-' + (data.slug || 'demo') + '-lang';

  if (still) root.classList.add('is-still');
  if (og) root.classList.add('og-mode');
  if (card) root.classList.add('card-mode', 'card-' + card);

  var Invite = window.Invite = {
    data: data,
    params: params,
    still: still,
    card: card,
    og: og,
    lang: langs[0],
    timing: { press: 420, open: 1700, done: 3400 },
    on: function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); },
    // One broken listener must never stop the rest: a throw here used to abandon the whole chain, so a
    // design could silently lose its countdown or its scratch card.
    emit: function (name, detail) {
      (listeners[name] || []).forEach(function (fn) {
        try { fn(detail); } catch (error) { setTimeout(function () { throw error; }, 0); }
      });
    }
  };

  /* Text: a value is either a plain string or { en: '…', hi: '…' }. */
  function t(value, lang) {
    if (value == null) return '';
    if (typeof value !== 'object') return String(value);
    lang = lang || Invite.lang;
    return value[lang] != null ? value[lang] : (value.en != null ? value.en : '');
  }
  function get(obj, path) {
    return path.split('.').reduce(function (o, key) { return o == null ? undefined : o[key]; }, obj);
  }
  Invite.t = t;
  Invite.get = function (path) { return get(data, path); };

  /* Dates are ISO strings with the +05:30 offset, shown in India time in the page's language. */
  var LOCALES = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', ta: 'ta-IN', pa: 'pa-IN', ur: 'ur-IN' };
  var FORMATS = {
    date: { day: 'numeric', month: 'long', year: 'numeric' },
    day: { day: 'numeric' },
    month: { month: 'long' },
    monthShort: { month: 'short' },
    dayMonth: { day: 'numeric', month: 'short' },
    weekday: { weekday: 'long' },
    time: { hour: 'numeric', minute: '2-digit' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    short: { weekday: 'short', day: 'numeric', month: 'short' }
  };
  function formatDate(iso, style, lang) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var opts = Object.assign({ timeZone: 'Asia/Kolkata' }, FORMATS[style] || FORMATS.date);
    try { return new Intl.DateTimeFormat(LOCALES[lang || Invite.lang] || 'en-IN', opts).format(d); }
    catch (e) { return d.toDateString(); }
  }
  Invite.formatDate = formatDate;

  /* Binding. Inside a repeated block, a path starting with "." is read from the current item.
     data-t="couple.groom"           text
     data-date="start" data-format   formatted date
     data-attr="href:map.url"        attributes
     data-if="venue"                 hidden when empty
     <template data-each="events">   one copy per item */
  function resolve(path, scope) {
    if (path.charAt(0) === '.') return get(scope, path.slice(1));
    return get(data, path);
  }
  function bind(container, scope) {
    container.querySelectorAll('template[data-each]').forEach(function (tpl) {
      if (tpl.closest('[data-bound-list]') && tpl.closest('[data-bound-list]') !== container) return;
      var list = resolve(tpl.getAttribute('data-each'), scope) || [];
      var filter = tpl.getAttribute('data-filter');
      tpl.parentNode.querySelectorAll('[data-from="' + tpl.getAttribute('data-each') + '"]').forEach(function (el) { el.remove(); });
      list.forEach(function (item, index) {
        if (filter && !item[filter]) return;
        var frag = tpl.content.cloneNode(true);
        var nodes = Array.prototype.slice.call(frag.children);
        item.index = index;
        nodes.forEach(function (node) {
          node.setAttribute('data-from', tpl.getAttribute('data-each'));
          node.setAttribute('data-index', index);
          node.style.setProperty('--i', index);
          bind(node, item);
          fill(node, item);
        });
        tpl.parentNode.insertBefore(frag, tpl);
      });
    });
    fill(container, scope);
  }
  function fill(container, scope) {
    var els = Array.prototype.slice.call(container.querySelectorAll('[data-t], [data-date], [data-attr], [data-if]'));
    if (container.matches && container.matches('[data-t], [data-date], [data-attr], [data-if]')) els.unshift(container);
    // Each element is filled only by its own repeated item (or by the page, outside any item).
    var owner = container.closest ? container.closest('[data-from]') : null;
    els.forEach(function (el) {
      if (el.closest('[data-from]') !== owner) return;
      var path;
      if ((path = el.getAttribute('data-if'))) el.hidden = !truthy(resolve(path, scope));
      if ((path = el.getAttribute('data-t'))) {
        var text = t(resolve(path, scope));
        if (el.hasAttribute('data-html')) el.innerHTML = text.replace(/\n/g, '<br>');
        else el.textContent = text;
      }
      if ((path = el.getAttribute('data-date'))) el.textContent = formatDate(resolve(path, scope), el.getAttribute('data-format'));
      if ((path = el.getAttribute('data-attr'))) {
        path.split(';').forEach(function (pair) {
          var bits = pair.split(':');
          var value = resolve(bits[1].trim(), scope);
          if (value != null) el.setAttribute(bits[0].trim(), t(value));
        });
      }
    });
  }
  function truthy(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') return !!t(value);
    return !!value;
  }
  Invite.render = function () {
    bind(document.body, data);
    Invite.emit('render');
  };

  /* Language */
  function setLang(lang) {
    if (langs.indexOf(lang) < 0) lang = langs[0];
    Invite.lang = lang;
    root.setAttribute('lang', lang);
    root.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-set-lang]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-set-lang') === lang ? 'true' : 'false');
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    Invite.render();
    // Repeated items are rebuilt on a language switch; show the new copies straight away.
    if (root.classList.contains('is-open')) {
      document.querySelectorAll('[data-from] [data-reveal]:not(.is-in), [data-from][data-reveal]:not(.is-in)').forEach(reveal);
    }
    Invite.emit('lang', lang);
  }
  Invite.setLang = setLang;

  /* Opening: press, open, done. The theme's CSS keys off is-pressing, is-opening and is-open. */
  function openInvite(instant) {
    if (root.classList.contains('is-pressing')) return;
    var cover = document.getElementById('cover');
    var main = document.getElementById('invite');
    root.classList.add('is-pressing');
    if (main) main.inert = false;
    if (instant) {
      root.classList.add('is-opening', 'is-open');
      if (cover) cover.hidden = true;
      Invite.emit('opened', { instant: true });
      revealVisible();
      return;
    }
    Invite.emit('open');
    setTimeout(function () { root.classList.add('is-opening'); Invite.emit('opening'); }, Invite.timing.press);
    setTimeout(function () { root.classList.add('is-open'); Invite.emit('opened', { instant: false }); revealVisible(); }, Invite.timing.open);
    setTimeout(function () { if (cover) cover.hidden = true; }, Invite.timing.done);
  }
  Invite.open = openInvite;

  /* Reveals play on every phone, including those with reduced motion switched on. */
  var observer = null;
  function reveal(el) {
    el.classList.add('is-in');
    Invite.emit('reveal', el);
  }
  function revealVisible() {
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94 && r.bottom > 0) {
        reveal(el);
        if (observer) observer.unobserve(el);
      }
    });
  }
  Invite.observeReveals = function () {
    var targets = document.querySelectorAll('[data-reveal]:not(.is-in)');
    if (still || !('IntersectionObserver' in window)) {
      targets.forEach(reveal);
      return;
    }
    root.classList.add('can-reveal');
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && root.classList.contains('is-open')) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    }
    targets.forEach(function (el) { observer.observe(el); });
  };

  /* Start once the page and the theme's scripts have loaded. */
  function start() {
    var startLang = params.get('lang');
    if (langs.indexOf(startLang) < 0) {
      try { startLang = localStorage.getItem(LANG_KEY); } catch (e) { startLang = null; }
    }
    document.querySelectorAll('[data-set-lang]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        setLang(button.getAttribute('data-set-lang'));
      });
    });
    setLang(startLang);
    Invite.emit('ready');
    Invite.observeReveals();

    var cover = document.getElementById('cover');
    var main = document.getElementById('invite');
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
    if (card === '1' || og) {
      if (main) main.inert = true;
    } else if (card || params.has('open') || !cover) {
      openInvite(true);
    } else {
      window.scrollTo(0, 0);
      if (main) main.inert = true;
      cover.addEventListener('click', function () { openInvite(false); });
      document.addEventListener('keydown', function (event) {
        if ((event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') && !root.classList.contains('is-pressing')) {
          event.preventDefault();
          openInvite(false);
        }
      });
      var button = document.getElementById('open-invite');
      try { if (button) button.focus({ preventScroll: true }); } catch (e) {}
    }
  }
  if (document.readyState === 'complete') setTimeout(start, 0);
  else document.addEventListener('DOMContentLoaded', start);
})();
