/* ==========================================================================
   em-watch.js — development auto-reload for docs & examples.
   Not part of the design system; omit it from production pages.

   Smart mode (served over http, e.g. `python3 -m http.server`): polls the
   page plus every local stylesheet and script it loads, and reloads only
   when one of them changes.  Indicator: "watching".
   Fallback (file:// in browsers that block fetch, e.g. Chrome): plain reload
   every 2 s.  Indicator: "reload-2s".
   Both modes keep the scroll position across reloads, and the fallback
   pauses while a form control is focused, a pointer is down, or the tab is
   hidden, so the guilloché lab and other controls stay usable.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__emWatch) return;
  window.__emWatch = true;

  const KEY = 'em-watch-scroll:' + location.pathname;
  const POLL = 1500, FALLBACK = 2000;

  // restore scroll from the previous reload
  try {
    const y = sessionStorage.getItem(KEY);
    if (y !== null) {
      sessionStorage.removeItem(KEY);
      const go = () => window.scrollTo(0, +y);
      window.addEventListener('load', go);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    }
  } catch (e) { /* storage unavailable */ }

  function reload() {
    try { sessionStorage.setItem(KEY, String(window.scrollY)); } catch (e) { /* ignore */ }
    location.reload();
  }

  function sameOrigin(u) {
    try { const x = new URL(u, location.href); return x.protocol === location.protocol && x.host === location.host; }
    catch (e) { return false; }
  }

  let pointerDown = false;
  addEventListener('pointerdown', () => (pointerDown = true), true);
  addEventListener('pointerup', () => (pointerDown = false), true);
  const busy = () => document.hidden || pointerDown ||
    (document.activeElement && document.activeElement.matches('input,select,textarea,[contenteditable]'));

  function start() {
    const badge = document.createElement('div');
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = 'init';
    badge.style.cssText = 'position:fixed;right:.5rem;bottom:.5rem;z-index:9999;font:10px/1 ui-monospace,Menlo,monospace;' +
      'padding:.25rem .45rem;border:1px solid currentColor;background:var(--em-paper,#fff);color:var(--em-ink,#000);opacity:.55;pointer-events:none';
    const ps = document.createElement('style');
    ps.textContent = '@media print{[data-em-watch]{display:none!important}}';
    badge.setAttribute('data-em-watch', '');
    document.head.appendChild(ps);
    document.body.appendChild(badge);

    const urls = [location.href.split('#')[0]];
    document.querySelectorAll('link[rel="stylesheet"][href], script[src]').forEach((n) => {
      const u = n.href || n.src;
      if (sameOrigin(u) && !urls.includes(u)) urls.push(u);
    });

    const snapshot = () => Promise.all(urls.map((u) =>
      fetch(u, { cache: 'no-store' }).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })));

    snapshot().then((base) => {
      badge.textContent = 'watching';
      setInterval(() => {
        if (document.hidden) return;
        snapshot().then((now) => { if (now.some((t, i) => t !== base[i])) reload(); })
          .catch(() => { /* transient (file mid-save); try again next tick */ });
      }, POLL);
    }).catch(() => {
      badge.textContent = 'reload-2s';
      setInterval(() => { if (!busy()) reload(); }, FALLBACK);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
