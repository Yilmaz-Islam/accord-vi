// Bespoke behaviour for artists.html. The engine (scrollcraft.js) is never
// edited: the 3D turn is pure CSS driven by the engine's --sc-p on #drum (see
// artists.css). This file only adds what CSS cannot: the pointer-following
// light on each portrait, the lock control, keyboard/jump navigation and the
// screen-reader announcements.
(function () {
  'use strict';

  var root = document.documentElement;
  var is3d = root.classList.contains('is-3d');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stage = document.getElementById('stage');
  var drum = document.getElementById('drum');
  var live = document.getElementById('artLive');
  var lockBtn = document.getElementById('lockBtn');
  var lockLabel = document.getElementById('lockLabel');
  var panels = Array.prototype.slice.call(document.querySelectorAll('.art-panel'));
  var jumpBtns = Array.prototype.slice.call(document.querySelectorAll('[data-jump]'));
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll('[data-mode-btn]'));

  var NAMES = ['Hasan Raheem, King', 'Nehaal Naseem, Queen', 'Sabaat Batin, Jack'];
  var HOLDS = [0.06, 0.5, 0.94]; // scroll progress that parks on each artist

  var state = { mode: 'spotlight', locked: false, front: 0, spoken: -1 };

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  // Same curve artists.css uses for --cur, so JS and CSS agree on "who is
  // at the front" without reading computed styles every frame.
  function curFromP(p) { return smooth((p - 0.14) / 0.28) + smooth((p - 0.58) / 0.28); }

  // ---------------------------------------------------------- portraits --
  var portraits = panels.map(function (panel, i) {
    var el = panel.querySelector('.art-portrait');
    var face = (el.getAttribute('data-face') || '50 30').split(' ').map(Number);
    return {
      el: el, panel: panel, i: i,
      fx: face[0] / 100, fy: face[1] / 100,
      w: 0, h: 0, r: 120,
      x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0,
      hover: false, kbd: false, visible: false, seeded: false,
      seed: i * 1.7
    };
  });

  function measure(p) {
    p.w = p.el.offsetWidth;
    p.h = p.el.offsetHeight;
    if (!p.w) return;
    p.r = Math.round(p.w * (state.mode === 'lens' ? 0.3 : 0.46));
    if (!p.seeded) {
      p.x = p.tx = p.fx * p.w;
      p.y = p.ty = p.fy * p.h;
      p.seeded = true;
    }
  }

  function settle(p) {
    if (reduce) return;
    p.el.classList.remove('is-settle');
    void p.el.offsetWidth;
    p.el.classList.add('is-settle');
    setTimeout(function () { p.el.classList.remove('is-settle'); }, 760);
  }

  portraits.forEach(function (p) {
    function aim(e) {
      if (state.locked || reduce || !p.w) return;
      p.hover = true;
      p.kbd = false;
      // offsetX/Y are in the portrait's own (possibly 3D-transformed) space.
      p.tx = clamp(e.offsetX, 0, p.w);
      p.ty = clamp(e.offsetY, 0, p.h);
    }
    p.el.addEventListener('pointermove', aim);
    p.el.addEventListener('pointerdown', aim);
    p.el.addEventListener('pointerleave', function () { p.hover = false; });
    p.el.addEventListener('pointercancel', function () { p.hover = false; });

    p.el.addEventListener('click', function () {
      if (is3d && p.i !== state.front) goTo(p.i);
    });

    p.el.addEventListener('keydown', function (e) {
      var step = p.w * 0.06;
      var dx = 0, dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      else if (e.key === 'ArrowRight') dx = step;
      else if (e.key === 'ArrowUp') dy = -step;
      else if (e.key === 'ArrowDown') dy = step;
      else return;
      e.preventDefault();
      if (state.locked || reduce) return;
      p.kbd = true;
      p.tx = clamp(p.tx + dx, 0, p.w);
      p.ty = clamp(p.ty + dy, 0, p.h);
    });
    p.el.addEventListener('blur', function () { p.kbd = false; });

    p.panel.addEventListener('focusin', function () {
      if (is3d && p.i !== state.front) goTo(p.i);
    });
  });

  // ------------------------------------------------- front-of-drum state --
  function setFront(f) {
    state.front = f;
    panels.forEach(function (panel, i) { panel.classList.toggle('is-front', i === f); });
    jumpBtns.forEach(function (b, i) {
      if (i === f) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    var theme = getComputedStyle(panels[f]).getPropertyValue('--theme').trim();
    if (theme) stage.style.setProperty('--front-theme', theme);
  }

  function progress() {
    var v = parseFloat(drum.style.getPropertyValue('--sc-p'));
    return isNaN(v) ? 0 : v;
  }

  function updateFront() {
    var cur = curFromP(progress());
    var f = clamp(Math.round(cur), 0, panels.length - 1);
    if (f !== state.front) setFront(f);
    if (Math.abs(cur - f) < 0.04 && state.spoken !== f) {
      state.spoken = f;
      live.textContent = 'Showing ' + NAMES[f] + '.';
      settle(portraits[f]);
    }
  }

  function goTo(i) {
    var behavior = reduce ? 'auto' : 'smooth';
    if (is3d) {
      var top = drum.getBoundingClientRect().top + window.scrollY;
      var span = drum.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + HOLDS[i] * span, behavior: behavior });
    } else {
      panels[i].scrollIntoView({ behavior: behavior, block: 'center' });
    }
  }

  jumpBtns.forEach(function (b) {
    b.addEventListener('click', function () { goTo(Number(b.getAttribute('data-jump'))); });
  });

  // ----------------------------------------------------------- controls --
  modeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      state.mode = b.getAttribute('data-mode-btn');
      stage.setAttribute('data-mode', state.mode);
      modeBtns.forEach(function (o) {
        o.setAttribute('aria-pressed', String(o === b));
      });
      portraits.forEach(measure);
      if (state.mode === 'lens') settle(portraits[state.front]);
    });
  });

  lockBtn.addEventListener('click', function () {
    state.locked = !state.locked;
    lockBtn.setAttribute('aria-pressed', String(state.locked));
    lockLabel.textContent = state.locked ? 'Unlock the light' : 'Lock the light';
    if (state.locked) settle(portraits[state.front]);
  });

  // -------------------------------------------------------------- loop --
  function frame(t) {
    requestAnimationFrame(frame);
    if (is3d) updateFront();

    var lens = state.mode === 'lens';
    // Spotlight follows tightly; the lens floats with a little inertia.
    var k = lens ? 0.055 : 0.15;
    var damp = lens ? 0.8 : 0.66;

    portraits.forEach(function (p) {
      var active = is3d ? p.i === state.front : p.visible;
      if (!active || reduce) return;
      if (!p.w) measure(p);
      if (!p.w) return;

      if (!state.locked && !p.hover && !p.kbd) {
        // Nobody is steering: drift slowly around the face so touch and
        // keyboard visitors still see the light move.
        p.tx = p.fx * p.w + Math.sin(t * 0.00055 + p.seed) * 0.13 * p.w;
        p.ty = p.fy * p.h + Math.cos(t * 0.00075 + p.seed) * 0.07 * p.h;
      }

      p.vx = (p.vx + (p.tx - p.x) * k) * damp;
      p.vy = (p.vy + (p.ty - p.y) * k) * damp;
      p.x += p.vx;
      p.y += p.vy;

      var speed = Math.hypot(p.vx, p.vy);
      if (state.locked && speed < 0.02 && Math.abs(p.tx - p.x) < 0.2 && Math.abs(p.ty - p.y) < 0.2) return;

      var s = p.el.style;
      s.setProperty('--mx', p.x.toFixed(1) + 'px');
      s.setProperty('--my', p.y.toFixed(1) + 'px');
      s.setProperty('--r', p.r + 'px');
      s.setProperty('--rot', clamp(p.vx * 1.6, -18, 18).toFixed(1) + 'deg');
      s.setProperty('--sq', (1 + Math.min(speed * 0.014, 0.1)).toFixed(3));
    });
  }

  // ------------------------------------------------------------ set-up --
  if (window.ScrollCraft) window.ScrollCraft.mount(document.body);

  portraits.forEach(measure);
  setFront(0);

  if (!is3d && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var p = portraits.filter(function (q) { return q.el === en.target; })[0];
        if (p) p.visible = en.isIntersecting;
      });
    }, { threshold: 0.2 });
    portraits.forEach(function (p) { io.observe(p.el); });
  } else if (!is3d) {
    portraits.forEach(function (p) { p.visible = true; });
  }

  // Images arrive after first layout; re-measure once they have real sizes.
  window.addEventListener('load', function () { portraits.forEach(measure); });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var wants3d = !matchMedia('(max-width: 860px)').matches && !reduce;
      if (wants3d !== is3d) { location.reload(); return; }
      portraits.forEach(measure);
    }, 200);
  });

  requestAnimationFrame(frame);
})();
