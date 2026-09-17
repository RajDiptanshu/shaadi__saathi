/* Haveli · boot. Binds the details and names the page from them. */
(function () {
  function boot() {
    var Invite = window.Invite, data = Invite.data;
    Invite.render();
    document.title = data.couple.groom + ' ' + Invite.t(data.ui.and) + ' ' + data.couple.bride + ' · ' + data.design + ' · ' + Invite.t(data.ui.sampleMark);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
