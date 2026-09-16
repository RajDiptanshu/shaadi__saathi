/* Invite Studio engine: on sample invitations (details.js has sample: true), a small "Sample" tag
   and a WhatsApp "Get this design" button that opens a chat with the studio.
   The studio's number lives in engine/studio.js so it changes in one place for every demo. */
(function () {
  var Invite = window.Invite;
  var data = Invite.data;
  if (!data.sample || Invite.card || Invite.og) return;
  var studio = window.INVITE_STUDIO || {};

  var tag = document.createElement('div');
  tag.className = 'studio-tag';
  tag.setAttribute('aria-hidden', 'true');
  tag.innerHTML = '<span data-t="ui.sample"></span>';

  var WHATSAPP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.4-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';
  var INSTAGRAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.3" fill="currentColor"/></svg>';
  var handle = String(studio.instagram || '').replace(/^@/, '').trim();

  var buy = document.createElement('a');
  buy.className = 'studio-buy' + (handle ? ' is-instagram' : '');
  buy.target = '_blank';
  buy.rel = 'noopener';
  buy.innerHTML = (handle ? INSTAGRAM : WHATSAPP) + '<span data-t="ui.getDesign"></span>';

  document.body.appendChild(tag);
  document.body.appendChild(buy);

  Invite.on('render', function () {
    var text = Invite.t(data.ui.designMessage, 'en').replace('{design}', data.design || '');
    // Instagram carries no message, so the design's name goes in the link's title instead.
    if (handle) {
      buy.href = 'https://instagram.com/' + encodeURIComponent(handle);
      buy.title = text;
    } else {
      buy.href = 'https://wa.me/' + String(studio.whatsapp || '').replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
    }
  });
  Invite.on('opened', function () {
    setTimeout(function () { buy.classList.add('is-shown'); }, 1800);
  });
})();
