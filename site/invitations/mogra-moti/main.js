/* Mogra & Moti · boot. Binds the details, names the page from them, and starts the scenes in order.
   Phase 3.5 prototype: Scene 01 Opening and Scene 02 Welcome only. */
(function () {
  function boot() {
    var Invite = window.Invite, data = Invite.data;
    Invite.render();
    document.title = data.couple.groom + ' ' + Invite.t(data.ui.and) + ' ' + data.couple.bride + ' · ' + data.design + ' · ' + Invite.t(data.ui.sampleMark);
    Invite.opening.init();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
