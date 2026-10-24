/* Accord VI: boot.js
   Loaded as the first thing inside <body> on every public page, so it runs before the page paints.
   Sections:
     @section intro-loader  the animated logo screen, shown once per visit (first page opened)
     @section back-button   header back arrow: previous page if it was on this site, else its fallback link
   Deleting this file and its <script> tags removes both. */
(function () {
  'use strict';

  /* @section intro-loader: animated logo screen, once per visit
     The rings of the Accord mark ripple out like sound, the wordmark settles, then the screen fades
     away as soon as the page has loaded. It never stays longer than MAX_MS, even on a slow
     connection, because a loading screen does not make waiting free: it only makes the wait
     look intentional for about a second. */
  var MIN_MS = 900;    // long enough for the animation to finish
  var MAX_MS = 1800;   // hard cap on slow connections
  var seen = false;
  try { seen = sessionStorage.getItem('accord_intro_seen') === '1'; sessionStorage.setItem('accord_intro_seen', '1'); } catch (e) { seen = true; }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!seen && document.body) {
    var css =
      '.intro{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;' +
        'background:var(--sc-canvas,var(--color-bg,#0e0f12));color:var(--sc-accent,var(--color-primary,#0f8f87));' +
        'touch-action:none;transition:opacity .38s cubic-bezier(.22,1,.36,1),visibility 0s linear .38s}' +
      '.intro.is-leaving{opacity:0;visibility:hidden;pointer-events:none}' +
      '.intro__inner{display:grid;justify-items:center;gap:18px;transition:transform .38s cubic-bezier(.22,1,.36,1)}' +
      '.intro.is-leaving .intro__inner{transform:scale(1.06)}' +
      '.intro svg{width:84px;height:84px;overflow:visible}' +
      '.intro path,.intro line{fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;' +
        'stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:introDraw .42s cubic-bezier(.22,1,.36,1) forwards}' +
      '.intro circle{fill:currentColor;transform-origin:60px 60px;transform:scale(0);animation:introPop .3s cubic-bezier(.34,1.56,.64,1) forwards}' +
      '.intro .r1{animation-delay:.12s}.intro .r2{animation-delay:.24s}.intro .r3{animation-delay:.36s}.intro line{animation-duration:.5s;animation-delay:.05s}' +
      '.intro__word{font:700 15px/1 var(--sc-font-display,var(--font-display,"Sora",system-ui,sans-serif));letter-spacing:.42em;' +
        'text-transform:uppercase;color:var(--sc-ink,var(--color-text,#efece6));padding-left:.42em;opacity:0;' +
        'transform:translateY(6px);animation:introWord .45s cubic-bezier(.22,1,.36,1) .45s forwards}' +
      '.intro__word b{font-weight:700;color:var(--sc-gold,var(--color-gold,#e0b455))}' +
      '@keyframes introDraw{to{stroke-dashoffset:0}}' +
      '@keyframes introPop{to{transform:scale(1)}}' +
      '@keyframes introWord{to{opacity:1;transform:none;letter-spacing:.32em}}' +
      '@media (prefers-reduced-motion:reduce){.intro *{animation:none!important;stroke-dashoffset:0!important;transform:none!important;opacity:1!important}' +
        '.intro__inner{transition:none}}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // The Accord resonance mark, drawn ring by ring (same geometry as the site's logo symbol)
    var mark =
      '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<line x1="60" y1="8" x2="60" y2="112" style="--len:106"/>' +
      '<path class="r1" d="M66.8,41.2 A20,20 0 0 1 66.8,78.8" style="--len:50"/><path class="r1" d="M53.2,41.2 A20,20 0 0 0 53.2,78.8" style="--len:50"/>' +
      '<path class="r2" d="M71.6,28.1 A34,34 0 0 1 71.6,91.9" style="--len:86"/><path class="r2" d="M48.4,28.1 A34,34 0 0 0 48.4,91.9" style="--len:86"/>' +
      '<path class="r3" d="M76.4,14.9 A48,48 0 0 1 76.4,105.1" style="--len:120"/><path class="r3" d="M43.6,14.9 A48,48 0 0 0 43.6,105.1" style="--len:120"/>' +
      '<circle cx="60" cy="60" r="4"/></svg>';
    var el = document.createElement('div');
    el.className = 'intro';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="intro__inner">' + mark + '<div class="intro__word">Accord <b>VI</b></div></div>';
    document.body.insertBefore(el, document.body.firstChild);

    var start = Date.now();
    var closed = false;
    var stopWheel = function (e) { e.preventDefault(); };
    window.addEventListener('wheel', stopWheel, { passive: false });
    var close = function () {
      if (closed) return;
      closed = true;
      window.removeEventListener('wheel', stopWheel);
      el.classList.add('is-leaving');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); if (style.parentNode) style.parentNode.removeChild(style); }, 450);
    };
    var minWait = reduce ? 350 : MIN_MS;
    var whenLoaded = function () { setTimeout(close, Math.max(0, minWait - (Date.now() - start))); };
    if (document.readyState === 'complete') whenLoaded();
    else window.addEventListener('load', whenLoaded, { once: true });
    setTimeout(close, MAX_MS);
  }

  /* @section back-button: header back arrow (markup in each page's header, look in css/apple.css)
     If the visitor came from another page of this site, go back to it (keeps their scroll place).
     Otherwise (opened from a link, a QR code or a bookmark) follow the arrow's own href. */
  var base = location.origin + location.pathname.replace(/[^/]*$/, '');
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('[data-back]') : null;
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var ref = document.referrer;
    if (ref && ref.indexOf(base) === 0 && ref.split('#')[0] !== location.href.split('#')[0] && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });

})();
