/* Invite Studio motion: policy.
   Decides normal, reduced or still motion and holds the duration tokens (wedding-motion §3).
   html.motion-ok is added only after an animation frame has actually run (within 300 ms), so content never
   waits on animation: webviews and previews that never run frames keep every final state showing.
   Scenes read this object; they never check prefers-reduced-motion themselves. */
(function () {
  var Invite = window.Invite;
  var M = Invite.motion = Invite.motion || {};
  var root = document.documentElement;
  var params = Invite.params || new URLSearchParams(location.search);
  var query = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  var DURATIONS = {
    normal: { instant: 0.12, quick: 0.28, object: 0.9, silk: 1.6, camera: 2.0, light: 2.6, draw: 0.45 },
    reduced: { instant: 0.12, quick: 0.2, object: 0.36, silk: 0.4, camera: 0, light: 0.8, draw: 0.45 }
  };

  var policy = M.policy = {
    reduced: params.get('rm') === '1' || (params.get('rm') !== '0' && !!(query && query.matches)),
    still: params.has('still'),
    test: params.has('test'),
    ok: false,
    decided: false,
    dur: function (name) { return DURATIONS[policy.reduced ? 'reduced' : 'normal'][name]; }
  };
  root.classList.toggle('motion-reduced', policy.reduced);

  var waiting = [], checking = false;
  function decide(ok) {
    if (policy.decided) return;
    policy.decided = true;
    policy.ok = ok;
    if (ok) root.classList.add('motion-ok');
    waiting.splice(0).forEach(function (fn) { fn(ok); });
  }
  /* Calls fn(ok) once the policy knows whether frames run. The check starts at the first call — when a scene
     is ready to move, not while the page is still loading — and allows 300 ms for a frame to arrive. */
  policy.whenDecided = function (fn) {
    if (policy.decided) return fn(policy.ok);
    waiting.push(fn);
    if (checking) return;
    checking = true;
    if (policy.still || !window.requestAnimationFrame) return decide(false);
    requestAnimationFrame(function () { decide(true); });
    setTimeout(function () { decide(false); }, 300);
  };
})();
