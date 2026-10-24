// @section human-check
// Cloudflare Turnstile, the "are you human" check on forms that email someone
// (sign-up and the sponsor form). Each form that uses it gets a slot:
//   const check = AccordHumanCheck.slot(containerEl);
//   const token = await check.token();   // '' when the check is switched off
//   check.reset();                       // after each send: a token works once
// Most people never see anything; Cloudflare only shows a box when it is unsure.
(function () {
  // The public site key from Cloudflare (Turnstile > the Accord VI widget).
  // Empty means the check is off, which matches a worker without TURNSTILE_SECRET.
  const SITE_KEY = '';
  // Cloudflare's published test key: always passes, works on any address.
  const TEST_KEY = '1x00000000000000000000AA';
  const IS_LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);
  const key = IS_LOCAL ? TEST_KEY : SITE_KEY;

  let loading = null;
  function loadScript() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (!loading) {
      loading = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true;
        s.onload = () => resolve(window.turnstile);
        s.onerror = () => { loading = null; reject(new Error('load')); };
        document.head.appendChild(s);
      });
    }
    return loading;
  }

  function slot(container) {
    let widgetId = null;
    let waiting = [];
    const settle = (value) => { const w = waiting; waiting = []; w.forEach((fn) => fn(value)); };

    async function render() {
      if (widgetId !== null) return;
      const ts = await loadScript();
      if (widgetId !== null) return;
      widgetId = ts.render(container, {
        sitekey: key,
        theme: 'dark',
        // The wide box needs 300px; small phones get the square one so it never spills out.
        size: (container.parentElement || container).clientWidth < 300 ? 'compact' : 'flexible',
        appearance: 'interaction-only',
        callback: (t) => settle(t),
        'error-callback': () => settle(''),
        'expired-callback': () => ts.reset(widgetId),
      });
    }

    return {
      // Start early (e.g. when someone starts typing) so the token is ready by Send.
      warm() { if (key) render().catch(() => {}); },
      async token() {
        if (!key) return '';
        try { await render(); } catch { throw new Error("The \"I'm human\" check couldn't load. Check your connection and try again."); }
        const ready = window.turnstile.getResponse(widgetId);
        if (ready) return ready;
        const t = await new Promise((resolve) => {
          waiting.push(resolve);
          setTimeout(() => resolve(''), 60000);
        });
        if (!t) throw new Error("Please complete the \"I'm human\" check and try again.");
        return t;
      },
      reset() { if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId); },
    };
  }

  window.AccordHumanCheck = { slot, enabled: !!key };
})();
