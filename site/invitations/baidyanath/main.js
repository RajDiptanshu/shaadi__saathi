/* Baidyanath Dham · boot. Binds the details and names the page from them. */
(function () {
  function boot() {
    var Invite = window.Invite;
    var data = Invite.data;
    Invite.render();
    // render() rebuilds every repeated card, which orphans the reveal observers pointed at the old nodes.
    Invite.observeReveals();
    document.title = Invite.t(data.couple.brideFull) + ' ' + Invite.t(data.ui.and) + ' ' +
      Invite.t(data.couple.groomFull) + ' · ' + Invite.formatDate(data.countdownTo, 'date') + ' · ' +
      Invite.t(data.wedding.city);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
