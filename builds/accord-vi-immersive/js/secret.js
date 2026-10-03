/* Hidden executive entry (Terms page only).
 *
 * The (c) at the very bottom of terms.html is the secret button. Clicking it
 * opens an "Executive access" popup; the popup's button leaves a short-lived
 * pass and goes to the admin registrations. admin.html sends anyone without a
 * pass back to the Terms page.
 *
 * This keeps the admin panel out of sight, it is not security: the panel itself
 * is still protected by its password and rate limit.
 */
(function () {
  'use strict';

  var PASS_KEY = 'accord_exec_pass';
  var PASS_MINUTES = 30;
  var ADMIN_URL = 'admin.html';

  var panel = null;
  var lastFocus = null;

  function injectStyles() {
    if (document.getElementById('secretStyles')) return;
    var s = document.createElement('style');
    s.id = 'secretStyles';
    s.textContent =
      '.secret-overlay{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:1.25rem;' +
      'background:rgba(8,9,12,.72);backdrop-filter:blur(4px);opacity:0;transition:opacity .2s ease}' +
      '.secret-overlay.is-open{opacity:1}' +
      '.secret-panel{position:relative;width:min(100%,24rem);text-align:center;padding:1.8rem 1.5rem 1.5rem;' +
      'background:#14151a;color:#efece6;border:1px solid #e0b455;border-radius:16px;' +
      'box-shadow:0 24px 70px rgba(0,0,0,.6);font:15px/1.45 system-ui,sans-serif;' +
      'transform:translateY(10px);transition:transform .25s ease}' +
      '.secret-overlay.is-open .secret-panel{transform:none}' +
      '.secret-panel__eyebrow{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#e0b455;margin:0 0 .3rem}' +
      '.secret-panel__title{font-size:1.3rem;font-weight:700;margin:0 0 .5rem}' +
      '.secret-panel__text{color:#9a9aa8;font-size:.92rem;margin:0 0 1.3rem}' +
      '.secret-panel__link{display:block;text-align:center;text-decoration:none;font-weight:600;color:#0e0f12;' +
      'background:linear-gradient(135deg,#e0b455,#b8873a);border-radius:999px;padding:.8rem 1rem}' +
      '.secret-panel__link:hover{box-shadow:0 8px 24px rgba(224,180,85,.35)}' +
      '.secret-panel__link:focus-visible,.secret-panel__close:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
      '.secret-panel__close{position:absolute;top:.4rem;right:.55rem;appearance:none;border:0;background:none;' +
      'color:#9a9aa8;font-size:1.5rem;line-height:1;cursor:pointer;padding:.25rem .45rem}' +
      '.secret-panel__close:hover{color:#efece6}' +
      '@media (prefers-reduced-motion:reduce){.secret-overlay,.secret-panel{transition:none}}';
    document.head.appendChild(s);
  }

  function make(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  }

  function open() {
    if (panel) return;
    injectStyles();
    lastFocus = document.activeElement;

    var overlay = make('div', 'secret-overlay');
    var box = make('div', 'secret-panel');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Executive access');

    var close = make('button', 'secret-panel__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', hide);

    var link = make('a', 'secret-panel__link', 'Open registrations →');
    link.href = ADMIN_URL;
    link.addEventListener('click', function () {
      // Leave a short-lived pass so admin.html lets this browser in.
      try { localStorage.setItem(PASS_KEY, String(Date.now() + PASS_MINUTES * 60 * 1000)); } catch (e) {}
    });

    box.appendChild(close);
    box.appendChild(make('p', 'secret-panel__eyebrow', 'Hidden'));
    box.appendChild(make('p', 'secret-panel__title', 'Executive access'));
    box.appendChild(make('p', 'secret-panel__text', 'Registrations and payment checks. You will still need the admin password.'));
    box.appendChild(link);
    overlay.appendChild(box);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) hide(); });
    document.body.appendChild(overlay);
    panel = overlay;

    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
      link.focus({ preventScroll: true });
    });
  }

  function hide() {
    if (!panel) return;
    var p = panel;
    panel = null;
    p.classList.remove('is-open');
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-exec-trigger]')) open();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hide();
  });
})();
