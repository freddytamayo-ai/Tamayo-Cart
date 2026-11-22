/* Tamayo Cart service worker: precache everything (incl. the OCR engine) so the app works offline. */
var VERSION = 'tamayo-cart-v10'; // bump on every release so phones pick up new files
var ASSETS = [
  './', './index.html', './styles.css', './parser.js', './meals.js', './recipes.js', './mealplan.js', './cooked.js', './app.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png',
  './vendor/tesseract/tesseract.min.js', './vendor/tesseract/worker.min.js',
  './vendor/tesseract/core/tesseract-core-simd-lstm.wasm.js', './vendor/tesseract/core/tesseract-core-lstm.wasm.js',
  './vendor/tesseract/lang/eng.traineddata.gz'
];
// App files (HTML, JS, CSS, manifest) are small and change every release: network first, cache as offline fallback.
// The OCR engine and icons are big and never change between releases: cache first.
var SHELL = /\/(index\.html|[^\/]+\.(js|css|webmanifest))?$/;
function isShell(url) { return url.pathname.indexOf('/vendor/') < 0 && url.pathname.indexOf('/icons/') < 0 && SHELL.test(url.pathname); }
self.addEventListener('install', function (e) {
  // cache: 'reload' skips the browser's HTTP cache so a new release never precaches an old copy of a file.
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function fromCache(req) {
  return caches.match(req, { ignoreSearch: true }).then(function (hit) {
    return hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error());
  });
}
function networkFirst(req) {
  return new Promise(function (resolve) {
    var done = false;
    var timer = setTimeout(function () { if (!done) { done = true; resolve(fromCache(req)); } }, 4000); // slow network: show the saved copy
    fetch(req, { cache: 'no-cache' }).then(function (res) {
      if (res.ok && res.type === 'basic') { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
      if (!done) { done = true; clearTimeout(timer); resolve(res.ok ? res : fromCache(req).then(function (h) { return h.type === 'error' ? res : h; })); }
    }).catch(function () { if (!done) { done = true; clearTimeout(timer); resolve(fromCache(req)); } });
  });
}
self.addEventListener('fetch', function (e) {
  var req = e.request;
  var url = new URL(req.url);
  // The shared "Made it" API is network-only. Never cache it (cross-origin already falls through).
  if (url.pathname === '/api/made' || url.pathname === '/api/made/reset') return;
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (req.mode === 'navigate' || isShell(url)) { e.respondWith(networkFirst(req)); return; }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res.ok && res.type === 'basic') { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () { return Response.error(); });
    })
  );
});
