/* Invite Studio motion: media.
   Picks AVIF or WebP once, fills [data-asset] images, and waits for the fonts and every image a sequence shows
   to be decoded (with a ceiling), so nothing decodes mid-animation. */
(function () {
  var M = window.Invite.motion;
  var AVIF = 'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+gABAAAAAAAAAB8AAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAnbWRhdBIACgc4AAaQENBpMhIZQmMEwAA0IgCQQM6Xtr3j7BA=';

  var format = null;
  /* Resolves 'avif' or 'webp'. */
  M.format = function () {
    if (format) return format;
    format = new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(img.width > 0 ? 'avif' : 'webp'); };
      img.onerror = function () { resolve('webp'); };
      img.src = AVIF;
    });
    return format;
  };

  /* Sets src on every [data-asset] image inside `root` (paths are relative to the page, without extension). */
  M.fillAssets = function (root, base) {
    return M.format().then(function (ext) {
      var nodes = Array.prototype.slice.call((root || document).querySelectorAll('img[data-asset]'));
      nodes.forEach(function (img) { img.src = (base || 'assets/') + img.getAttribute('data-asset') + '.' + ext; });
      return ext;
    });
  };

  function decodeImage(img) {
    if (!img) return Promise.resolve();
    if (img.decode) return img.decode().catch(function () {});
    if (img.complete) return Promise.resolve();
    return new Promise(function (resolve) { img.onload = img.onerror = resolve; });
  }
  function decodeUrl(url) {
    var img = new Image();
    img.src = url;
    return decodeImage(img);
  }

  /* Waits for fonts, images and URLs, or for `maxMs`, whichever comes first. Resolves true if everything loaded. */
  M.ready = function (opts) {
    var jobs = [];
    if (document.fonts && opts.fonts) opts.fonts.forEach(function (f) { jobs.push(document.fonts.load(f).catch(function () {})); });
    (opts.images || []).forEach(function (img) { jobs.push(decodeImage(img)); });
    (opts.urls || []).forEach(function (u) { jobs.push(decodeUrl(u)); });
    var all = Promise.all(jobs).then(function () { return true; });
    if (!opts.maxMs) return all;
    return Promise.race([all, new Promise(function (resolve) { setTimeout(function () { resolve(false); }, opts.maxMs); })]);
  };
})();
