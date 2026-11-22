'use strict';
// Service worker update behaviour: a new release must reach phones that already have the app saved.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

function load({ network, cached }) {
  const handlers = {}, store = new Map(Object.entries(cached || {})), puts = [], fetches = [];
  const caches = {
    open: async () => ({ addAll: async (reqs) => { fetches.push(...reqs); }, put: async (req, res) => { puts.push(req.url || req); } }),
    match: async (req) => store.get(new URL(req.url || req, 'https://x.test/Tamayo-Cart/').pathname) || undefined,
    keys: async () => [], delete: async () => true,
  };
  const ctx = {
    self: { addEventListener: (t, fn) => { handlers[t] = fn; }, skipWaiting: async () => {}, clients: { claim: async () => {} } },
    caches, location: { origin: 'https://x.test' }, URL, Request: class { constructor(u, init) { this.url = u; this.cache = init && init.cache; } },
    Response: { error: () => ({ type: 'error' }) }, setTimeout, clearTimeout, Promise,
    fetch: async (req, init) => { fetches.push({ url: req.url, init }); if (network === 'offline') throw new TypeError('offline'); return { ok: true, type: 'basic', body: network, clone() { return this; } }; },
  };
  vm.runInNewContext(src, ctx);
  const run = (url, mode) => new Promise((resolve) => handlers.fetch({ request: { url, method: 'GET', mode: mode || 'cors' }, respondWith: (p) => resolve(Promise.resolve(p)) }));
  return { handlers, run, fetches, puts };
}

test('cache version bumped so phones stuck on an old copy re-download everything', () => {
  assert.match(src, /VERSION = 'tamayo-cart-v10'/);
});

test('install precaches with cache: reload (never an old HTTP-cached file)', async () => {
  const sw = load({ network: 'new' });
  let p; sw.handlers.install({ waitUntil: (x) => { p = x; } }); await p;
  const reqs = sw.fetches.filter((r) => r.cache !== undefined);
  assert.ok(reqs.length > 5 && reqs.every((r) => r.cache === 'reload'));
});

test('app files are network-first: the new meals.js wins over the saved one', async () => {
  const sw = load({ network: 'new meals', cached: { '/Tamayo-Cart/meals.js': { ok: true, body: 'old meals' } } });
  const res = await sw.run('https://x.test/Tamayo-Cart/meals.js');
  assert.equal(res.body, 'new meals');
  const nav = await sw.run('https://x.test/Tamayo-Cart/', 'navigate');
  assert.equal(nav.body, 'new meals');
});

test('offline still works from the saved copy', async () => {
  const sw = load({ network: 'offline', cached: { '/Tamayo-Cart/meals.js': { ok: true, body: 'saved meals' }, '/Tamayo-Cart/index.html': { ok: true, body: 'saved html' } } });
  assert.equal((await sw.run('https://x.test/Tamayo-Cart/meals.js')).body, 'saved meals');
  assert.equal((await sw.run('https://x.test/Tamayo-Cart/', 'navigate')).body, 'saved html');
});

test('the big OCR engine stays cache-first (no re-download on every open)', async () => {
  const sw = load({ network: 'net', cached: { '/Tamayo-Cart/vendor/tesseract/tesseract.min.js': { ok: true, body: 'cached ocr' } } });
  assert.equal((await sw.run('https://x.test/Tamayo-Cart/vendor/tesseract/tesseract.min.js')).body, 'cached ocr');
});

test('page reloads once when a new release takes over, and checks for updates when the app comes back', () => {
  assert.match(appSrc, /addEventListener\('controllerchange'/);
  assert.match(appSrc, /if \(!hadController \|\| reloading\) return;\s*reloading = true; location\.reload\(\);/);
  assert.match(appSrc, /reg\.update\(\)/);
  assert.match(appSrc, /updateViaCache: 'none'/);
});
