// Accord VI — Immersive
// Bespoke page behaviour only. The engine (scrollcraft.js) is never edited;
// this reads its own scroll state and drives page-specific things off it.

document.addEventListener('DOMContentLoaded', () => {
  // ---- Custom cursor: brass ring + dot standing in for the system
  // pointer. Fine-pointer only, off under reduced motion. The dot tracks
  // the mouse almost exactly; the ring lags behind it with a lerp, same
  // "weight, not glue" rule the engine's own tilt/magnet devices use. It
  // grows over links, buttons and tilt cards to read as a hover state. ----
  (() => {
    const cursor = document.getElementById('avCursor');
    if (!cursor) return;
    const fineMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    let started = false;
    function maybeStart() {
      if (started || !fineMQ.matches || reduceMQ.matches) return;
      started = true;
      startCursor();
    }
    // fineMQ/reduceMQ are live queries — a hybrid device that gains a mouse
    // mid-session (or has reduced-motion toggled off) fires 'change' here.
    // Without this, the CSS (which re-evaluates live) would start hiding
    // the native cursor and showing an empty .av-cursor shell that JS never
    // began driving — no cursor at all until reload.
    fineMQ.addEventListener('change', maybeStart);
    reduceMQ.addEventListener('change', maybeStart);
    maybeStart();

    function startCursor() {
    const dot = cursor.querySelector('.av-cursor__dot');
    const ring = cursor.querySelector('.av-cursor__ring');
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let scale = 0.577, scaleTarget = 0.577;
    let seen = false;
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!seen) { seen = true; rx = mx; ry = my; cursor.style.opacity = '1'; }
    }, { passive: true });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
    cursor.style.opacity = '0';
    (function tick() {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      scale += (scaleTarget - scale) * 0.2;
      dot.style.transform = 'translate3d(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px,0)';
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0) scale(' + scale.toFixed(3) + ')';
      requestAnimationFrame(tick);
    })();
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest('a, button, [data-sc-tilt]')) { cursor.classList.add('is-active'); scaleTarget = 1; }
    });
    document.addEventListener('pointerout', (e) => {
      if (e.target.closest('a, button, [data-sc-tilt]')) { cursor.classList.remove('is-active'); scaleTarget = 0.577; }
    });
    }
  })();

  // ---- Countdown to Accord VI (18 Oct 2026, local time) ----
  // Flip-clock style: each unit is a hinged card. On a value change, the
  // back face (already holding the new number) is primed, the card flips,
  // and once the flip finishes the front face silently takes the new
  // value and the card resets flat — ready for the next flip with no
  // visible snap. Under reduced motion, values just swap with no flip.
  const countdownReduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  function makeFlipUnit(baseId) {
    const card = document.getElementById(baseId + 'Card');
    if (!card) return null;
    const inner = card.querySelector('.av-flip__inner');
    const front = document.getElementById(baseId);
    const back = document.getElementById(baseId + 'Back');
    return { card, inner, front, back };
  }
  const flipUnits = {
    days: makeFlipUnit('avDays'),
    hours: makeFlipUnit('avHours'),
    mins: makeFlipUnit('avMins'),
    secs: makeFlipUnit('avSecs'),
  };
  function setFlipValue(unit, value) {
    if (!unit || unit.front.textContent === value) return;
    if (countdownReduceMQ.matches) { unit.front.textContent = value; unit.back.textContent = value; return; }
    unit.back.textContent = value;
    unit.card.classList.add('is-flipped');
    // transitionend alone is fragile here: a backgrounded/throttled tab can
    // pause the transition indefinitely, and the countdown's real numbers
    // would never reveal themselves. A timeout backstop guarantees the
    // swap happens regardless — whichever fires first wins, the other is
    // a no-op against the already-settled state.
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      unit.front.textContent = value;
      unit.card.classList.remove('is-flipped');
      unit.inner.style.transition = 'none';
      void unit.inner.offsetWidth;
      unit.inner.style.transition = '';
    }
    unit.inner.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 700);
  }
  const target = new Date('2026-10-18T00:00:00');
  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      setFlipValue(flipUnits.days, '0'); setFlipValue(flipUnits.hours, '0');
      setFlipValue(flipUnits.mins, '0'); setFlipValue(flipUnits.secs, '0');
      return;
    }
    const sec = Math.floor(diff / 1000);
    setFlipValue(flipUnits.days, String(Math.floor(sec / 86400)));
    setFlipValue(flipUnits.hours, String(Math.floor((sec % 86400) / 3600)).padStart(2, '0'));
    setFlipValue(flipUnits.mins, String(Math.floor((sec % 3600) / 60)).padStart(2, '0'));
    setFlipValue(flipUnits.secs, String(sec % 60).padStart(2, '0'));
  }
  tick();
  setInterval(tick, 1000);

  // ---- Signature move: the Resonance mark draws itself in on the way to
  // the Proof chapter (the event photos), not across the whole page — it
  // should already be fully formed by the time you're scrolling through
  // those photos, not still filling in. Six arcs for the sixth edition. ----
  const mark = document.querySelector('.av-mark');
  const completeByEl = document.querySelector('[data-act-id="proof-photos"]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateScrollProgress() {
    const doc = document.documentElement;
    const target = completeByEl
      ? completeByEl.getBoundingClientRect().top + window.scrollY
      : Math.max(doc.scrollHeight - window.innerHeight, 1);
    const p = reduceMotion ? 1 : Math.min(1, Math.max(0, window.scrollY / Math.max(target, 1)));
    doc.style.setProperty('--av-scroll-p', p.toFixed(4));
    if (mark) mark.setAttribute('data-complete', p >= 1 ? 'true' : 'false');
  }
  updateScrollProgress();
  // rAF-throttled, same as the engine's own scroll handler: an unthrottled
  // 'scroll' listener runs getBoundingClientRect (a forced layout read) on
  // every fired event, and phones fire scroll far more often than desktop
  // during momentum scrolling — cheap on its own, but one more source of
  // main-thread work competing with the engine's per-frame pin/pan math on
  // exactly the low-powered devices where that math is already tightest.
  let scrollProgressTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollProgressTicking) return;
    scrollProgressTicking = true;
    requestAnimationFrame(() => { updateScrollProgress(); scrollProgressTicking = false; });
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth === railLastW && isRailMobile()) return;
    updateScrollProgress();
  });

  // ---- The Two Nights: typewriter reveal on the two panel names, timed
  // to land just after the screen finishes tearing open. Fires once. ----
  const panelNames = document.querySelectorAll('.av-panel__name[data-av-type]');
  const splitStage = document.querySelector('.av-split-stage');
  if (panelNames.length && splitStage && !reduceMotion) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io2.disconnect();
        panelNames.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('av-type-in');
            el.addEventListener('animationend', () => el.classList.add('av-type-done'), { once: true });
          }, 900 + i * 300);
        });
      });
    }, { threshold: 0.4 });
    io2.observe(splitStage);
  }

  // ---- Proof rail: guarantee real pan travel at any screen width. A pan
  // act with capped-width cards can run out of overflow on a wide enough
  // monitor and go dead (devices.md's own documented trap: correct on a
  // laptop, frozen at fullscreen on a big screen) — a CSS max-width can
  // never fully rule this out, so measure the real overflow and pad it.
  //
  // The spacer is always removed and recreated from scratch, never resized
  // in place: a real, repro'd Chromium quirk means resizing an *existing*
  // flex child's width, once it has already been through a layout pass
  // inside a will-change:transform flex container (exactly what
  // [data-sc-pan] is), does not reliably invalidate the container's own
  // scrollWidth — the child visibly resizes (confirmed via
  // getBoundingClientRect) but the parent's scrollWidth silently keeps
  // reporting the old, pre-resize value, so the engine's own `over =
  // rail.scrollWidth - vw` pan-distance calculation never sees the change.
  // A freshly created element with its final width already set at
  // creation does not hit this — scrollWidth updates correctly. ----
  const railEl = document.querySelector('.av-rail');
  function ensureRailOverflow() {
    if (!railEl) return;
    const old = document.getElementById('avRailSpacer');
    if (old) old.remove();
    const bare = railEl.scrollWidth - window.innerWidth;
    const target = window.innerWidth * 0.5;
    const width = Math.max(0, target - bare);
    if (width <= 0) return;
    const spacer = document.createElement('div');
    spacer.id = 'avRailSpacer';
    spacer.setAttribute('aria-hidden', 'true');
    spacer.setAttribute('style', 'flex:0 0 auto; width:' + width + 'px;');
    railEl.appendChild(spacer);
  }
  ensureRailOverflow();
  // Same guard as the engine's own resize handler, and for the same reason:
  // iOS/Android fire 'resize' when the URL bar collapses or expands during
  // an ordinary scroll gesture (width unchanged, only height moves). This
  // handler destructively removes and re-creates a DOM node, which is
  // exactly the kind of layout-invalidating write that must never happen
  // mid-scroll — the very next engine tick reads the rail's now-briefly-
  // different scrollWidth and the pan rail visibly jumps under the
  // reader's thumb. Without this guard, that jump fires on essentially
  // every scroll on a phone, which read as constant glitching through the
  // "Two Nights" and "Proof" pan/parallax chapters specifically, since
  // those are the only sections whose per-frame math depends on rail width.
  const railMobileMQ = window.matchMedia('(hover: none) and (pointer: coarse)');
  const railSmallMQ = window.matchMedia('(max-width: 860px)');
  const isRailMobile = () => railMobileMQ.matches || railSmallMQ.matches;
  let railLastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === railLastW && isRailMobile()) return;
    railLastW = window.innerWidth;
    ensureRailOverflow();
  });

  // ---- Folio nav: chapter number + title, updating as chapters pass ----
  const folioNum = document.getElementById('avFolioNum');
  const folioTitle = document.getElementById('avFolioTitle');
  const chapters = Array.from(document.querySelectorAll('[data-chapter]'));

  if (chapters.length && folioNum && folioTitle) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          folioNum.textContent = el.getAttribute('data-chapter');
          folioTitle.textContent = el.getAttribute('data-chapter-title');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    chapters.forEach((c) => io.observe(c));
  }

  // ---- The Accord Team: expand/collapse the rest of the team ----
  const teamToggle = document.getElementById('avTeamToggle');
  const teamMore = document.getElementById('avTeamMore');
  if (teamToggle && teamMore) {
    const label = teamToggle.querySelector('.av-team__toggle-label');
    teamToggle.addEventListener('click', () => {
      const open = teamToggle.getAttribute('aria-expanded') === 'true';
      teamToggle.setAttribute('aria-expanded', String(!open));
      teamMore.hidden = open;
      label.textContent = open ? 'See the rest of the team' : 'Hide the rest of the team';
    });
  }

  // Executive council "more info" reveals — each card's button toggles
  // only its own sibling paragraph.
  document.querySelectorAll('.av-team-card__info-toggle').forEach((btn) => {
    const info = btn.nextElementSibling;
    if (!info) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      info.hidden = open;
      btn.textContent = open ? 'More info' : 'Less info';
    });
  });

  // ---- Mount the engine last, once the page's own state is wired up ----
  if (window.ScrollCraft) window.ScrollCraft.mount(document.body);
});
