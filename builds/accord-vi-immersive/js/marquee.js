/* Sponsor logo strip: scrolls by itself at a steady pace; on touch screens you can also
 * swipe it left or right and it carries on from wherever you let go.
 *
 * The strip used to be a pure CSS animation that paused on :hover. On a phone a tap counts
 * as hover, so touching a logo froze the whole strip. Here the auto-scroll never stops for a
 * touch (it only holds still while a finger is actually dragging), and the mouse still pauses
 * it on hover like before.
 *
 * Needs the track to hold its chips twice in a row (the second set is aria-hidden), so the
 * loop point is the distance from the first chip to its copy.
 */
(function () {
  'use strict';

  var marquee = document.querySelector('.sponsor-marquee');
  var track = marquee && marquee.querySelector('.sponsor-track');
  if (!track || !window.requestAnimationFrame) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SECONDS_PER_LOOP = parseFloat(marquee.getAttribute('data-seconds')) || 55;

  var chips = track.querySelectorAll('.sponsor-chip');
  var copyStart = track.querySelector('.sponsor-chip[aria-hidden="true"]');
  var loop = 0;      // px from a chip to its copy: one full cycle
  var autoSpeed = 0; // px per second, steady drift
  var pos = 0;       // how far the strip has moved left, 0 <= pos < loop
  var inertia = 0;   // px per second left over from a flick, fades out
  var dragging = false;
  var hovering = false;
  var userPaused = false; // the Pause button: moving content that cannot be stopped fails WCAG 2.2.2
  var toggle = document.getElementById('marqueeToggle');
  var visible = true;
  var lastTime = 0;
  var frame = 0;

  function measure() {
    if (!chips.length || !copyStart) { loop = 0; return; }
    loop = copyStart.offsetLeft - chips[0].offsetLeft;
    autoSpeed = reduceMotion ? 0 : loop / SECONDS_PER_LOOP;
  }

  function paint() {
    if (loop > 0) pos = ((pos % loop) + loop) % loop;
    track.style.transform = 'translate3d(' + (-pos).toFixed(2) + 'px,0,0)';
  }

  function tick(now) {
    frame = 0;
    var dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
    lastTime = now;

    if (!dragging) {
      var drift = (hovering || userPaused) ? 0 : autoSpeed;
      pos += (drift + inertia) * dt;
      // a flick fades out in roughly a third of a second and hands back to the steady drift
      inertia *= Math.exp(-dt * 5);
      if (Math.abs(inertia) < 4) inertia = 0;
    }
    paint();
    schedule();
  }

  function schedule() {
    if (frame || !visible || document.hidden) return;
    frame = requestAnimationFrame(tick);
  }

  // ---- touch / pen: swipe to move the strip ----
  var startX = 0, startPos = 0, lastX = 0, lastT = 0, velocity = 0, activeId = null;

  marquee.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' || activeId !== null || !loop) return;
    activeId = e.pointerId;
    dragging = true;
    inertia = 0;
    startX = lastX = e.clientX;
    startPos = pos;
    lastT = e.timeStamp;
    velocity = 0;
    try { marquee.setPointerCapture(e.pointerId); } catch (err) {}
  });

  marquee.addEventListener('pointermove', function (e) {
    if (!dragging || e.pointerId !== activeId) return;
    pos = startPos - (e.clientX - startX);
    var dt = (e.timeStamp - lastT) / 1000;
    if (dt > 0) {
      // smoothed so one jittery sample does not become the flick speed
      velocity = 0.7 * velocity + 0.3 * ((lastX - e.clientX) / dt);
    }
    lastX = e.clientX;
    lastT = e.timeStamp;
    paint();
  });

  function release(e) {
    if (!dragging || e.pointerId !== activeId) return;
    dragging = false;
    activeId = null;
    // a finger that stopped before lifting leaves no flick behind
    var idle = e.timeStamp - lastT > 90;
    inertia = idle ? 0 : Math.max(-2600, Math.min(2600, velocity));
    lastTime = 0;
    schedule();
  }
  marquee.addEventListener('pointerup', release);
  marquee.addEventListener('pointercancel', release);

  // ---- mouse: keep the old pause-on-hover ----
  marquee.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hovering = true; });
  marquee.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hovering = false; lastTime = 0; } });

  // ---- Pause / Play ----
  function paintToggle() {
    if (!toggle) return;
    toggle.textContent = userPaused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', userPaused ? 'Play the scrolling list of past sponsors' : 'Pause the scrolling list of past sponsors');
    toggle.setAttribute('aria-pressed', String(userPaused));
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      userPaused = !userPaused;
      inertia = 0;
      lastTime = 0;
      paintToggle();
      schedule();
    });
  }

  // ---- housekeeping ----
  document.addEventListener('visibilitychange', function () { lastTime = 0; schedule(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      lastTime = 0;
      schedule();
    }).observe(marquee);
  }
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { measure(); paint(); }, 120);
  });

  function start() {
    measure();
    if (!loop) return; // markup not as expected: leave the CSS animation running
    marquee.classList.add('is-js'); // switches the CSS animation off
    if (toggle && !reduceMotion) { toggle.hidden = false; paintToggle(); } // nothing moves under reduced motion, so no button
    paint();
    schedule();
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
