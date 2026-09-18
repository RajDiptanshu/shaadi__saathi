/* Haveli · Scene 02 Welcome. Splits the couple's names into words so each can rise from the corridor floor
   on its own (CSS: .couple-line .wi), and draws the deckled top edge of the sheet laid over the photograph. */
(function () {
  var Invite = window.Invite;

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

  function edge() {
    var M = Invite.motion, svg = document.querySelector('.sheet-edge');
    if (!svg || !M || !M.paper) return;
    var w = svg.clientWidth;
    if (!w) return;
    var e = M.paper.edge(w, 0, 24, 30, 31);
    svg.setAttribute('viewBox', '0 0 ' + w + ' 56');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.querySelector('.sheet-edge-paper').setAttribute('d', e.fill);
    svg.querySelector('.sheet-edge-rim').setAttribute('d', e.line);
  }
  window.addEventListener('load', edge);
  window.addEventListener('resize', edge);
})();
