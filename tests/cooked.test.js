// Run: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const Meals = require('../meals.js');
const Made = require('../cooked.js');

const PLAN_KEY = 'tamayoCart.plan.v1';

function memoryStorage(initial) {
  const data = Object.assign({}, initial);
  return {
    getItem(k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
    setItem(k, v) { data[k] = String(v); },
    dump: data
  };
}

function jsonResponse(body, ok = true) {
  return { ok, status: ok ? 200 : 500, json: () => Promise.resolve(body) };
}

function tick() { return new Promise((resolve) => setTimeout(resolve, 0)); }

test('endpoint is one constant and storage does not use the shopping-list key', () => {
  assert.equal(Made.API_BASE, 'https://tamayo-cart-sync.tamayofamily.workers.dev');
  assert.equal(Made.STORAGE_KEY, 'tamayoCart.made.v1');
  assert.notEqual(Made.STORAGE_KEY, PLAN_KEY);
});

test('keys are week plus stable meal id, not the day slot; Sunday is stable', () => {
  const week1 = Meals.weeks['1'].dinners.map((d) => Made.mealKey('1', Made.dinnerMealId(d)));
  const week2 = Meals.weeks['2'].dinners.map((d) => Made.mealKey('2', Made.dinnerMealId(d)));
  assert.deepEqual(week1, ['1:salsabeef', '1:kielbasa', '1:tingabeef', '1:tortillacasserole', '1:drumsticks', '1:carnitas', '1:sunday']);
  assert.deepEqual(week2, ['2:whitechili', '2:fajitas', '2:pozole', '2:burritocasserole', '2:bbqbeef', '2:tacobeef', '2:sunday']);
  assert.equal(Made.dinnerMealId({ day: 'Sun', meal: null, title: 'Sunday spaghetti' }), 'sunday');
  assert.equal(Made.dinnerMealId({ day: 'Wed', meal: 'drumsticks' }), 'drumsticks');
  assert.equal(Made.mealKey('1', 'drumsticks'), '1:drumsticks');
  // Moving the same meal to another day does not change its key.
  const moved = Meals.weeks['1'].dinners.map((d) => Object.assign({}, d, { day: 'Fri' }));
  assert.deepEqual(moved.map((d) => Made.mealKey('1', Made.dinnerMealId(d))), week1);
});

test('normalize keeps only real made flags and ignores shopping-list fields', () => {
  const norm = Made.normalizeState({
    made: { '1:salsabeef': true, '1:gone': false, '2:pozole': 1 },
    updated: null,
    pending: [
      { op: 'set', key: '1:kielbasa', made: true },
      { op: 'set', key: '', made: true },
      { nope: true },
      { op: 'reset', week: 2 }
    ],
    done: { onions: { manual: true } },
    weeks: { '1': { done: { milk: true } } }
  });
  assert.deepEqual(norm.made, { '1:salsabeef': true });
  assert.equal(norm.updated, null);
  assert.equal(norm.pending.length, 2);
  assert.equal(norm.pending[0].key, '1:kielbasa');
  assert.equal(norm.pending[1].op, 'reset');
  assert.equal(norm.pending[1].week, '2');
  assert.equal(norm.done, undefined);
  assert.deepEqual(Made.normalizeState('{'), { made: {}, updated: null, pending: [], nextId: 1 });
  assert.equal(Made.normalizeState(null).nextId, 1);
});

test('queue compacts repeat taps and a reset drops that week only', () => {
  const set = (key, made, id) => ({ op: 'set', key, made, id });
  const reset = (week, id) => ({ op: 'reset', week, id });
  let q = Made.compactPending([
    set('1:salsabeef', true, 1),
    set('1:salsabeef', false, 2),
    set('2:pozole', true, 3)
  ]);
  assert.deepEqual(q.map((op) => op.id), [2, 3]);
  assert.equal(q[0].made, false);
  q = Made.compactPending([
    set('1:salsabeef', true, 1),
    set('2:pozole', true, 2),
    reset('1', 3),
    set('1:carnitas', true, 4)
  ]);
  assert.deepEqual(q.map((op) => op.op + ':' + (op.key || op.week)), ['set:2:pozole', 'reset:1', 'set:1:carnitas']);
});

test('count follows the meal, so cooking out of order and reordering days stay consistent', () => {
  const dinners = Meals.weeks['1'].dinners;
  const state = { made: { '1:drumsticks': true, '1:sunday': true, '2:pozole': true } };
  const count = Made.countMade(state, '1', dinners);
  assert.deepEqual(count, { made: 2, total: 7 });
  assert.deepEqual(Made.countMade(state, '1', dinners.slice().reverse()), count);
  assert.deepEqual(Made.countMade(state, '2', Meals.weeks['2'].dinners), { made: 1, total: 7 });
  assert.equal(Made.countMade(state, '1', [dinners[0]]).made, 0);
});

test('optimistic tap posts the key, then re-renders from the response', async () => {
  const storage = memoryStorage();
  storage.setItem(PLAN_KEY, '{"week":"1","weeks":{"1":{"done":{"onions":{"manual":true}}}}}');
  let rendered = 0;
  let resolvePost;
  const posts = [];
  const client = Made.create({
    storage,
    onChange: () => { rendered++; },
    fetch: (url, opts) => {
      posts.push({ url, body: JSON.parse(opts.body), cache: opts.cache });
      return new Promise((resolve) => {
        resolvePost = () => resolve(jsonResponse({
          made: { '1:salsabeef': true, '2:pozole': true },
          updated: '2026-11-10T03:11:06.614Z'
        }));
      });
    }
  });
  const pending = client.setMade('1', 'salsabeef', true);
  assert.equal(client.isMade('1', 'salsabeef'), true, 'UI updates before the network returns');
  assert.equal(rendered, 1);
  assert.equal(client.isMade('2', 'pozole'), false);
  await tick();
  assert.equal(posts.length, 1);
  assert.equal(posts[0].url, Made.API_BASE + '/api/made');
  assert.deepEqual(posts[0].body, { key: '1:salsabeef', made: true });
  assert.equal(posts[0].cache, 'no-store');
  resolvePost();
  assert.equal(await pending, true);
  assert.equal(client.isMade('1', 'salsabeef'), true);
  assert.equal(client.isMade('2', 'pozole'), true, 'response map replaces local state');
  assert.equal(client.getState().pending.length, 0);
  assert.equal(client.getState().updated, '2026-11-10T03:11:06.614Z');
  assert.equal(storage.getItem(PLAN_KEY), '{"week":"1","weeks":{"1":{"done":{"onions":{"manual":true}}}}}');
  const saved = JSON.parse(storage.getItem(Made.STORAGE_KEY));
  assert.equal(saved.made['1:salsabeef'], true);
  assert.equal(saved.done, undefined);
  assert.equal(saved.weeks, undefined);
});

test('unreachable endpoint keeps the local cache and does not throw', async () => {
  const storage = memoryStorage();
  const client = Made.create({
    storage,
    fetch: () => Promise.reject(new TypeError('Failed to fetch'))
  });
  const ok = await client.setMade('1', 'kielbasa', true);
  assert.equal(ok, false);
  assert.equal(client.isMade('1', 'kielbasa'), true);
  assert.equal(client.getState().pending.length, 1);
  const again = await client.refresh();
  assert.equal(again, false);
  assert.equal(client.isMade('1', 'kielbasa'), true);
  const reloaded = Made.create({
    storage,
    fetch: () => Promise.reject(new TypeError('still offline'))
  });
  assert.equal(reloaded.isMade('1', 'kielbasa'), true);
  assert.equal(reloaded.getState().pending.length, 1);
  assert.equal(reloaded.isMade('1', 'salsabeef'), false);
});

test('bad HTTP and bad JSON fall back to the cache', async () => {
  const storage = memoryStorage();
  let mode = '500';
  const client = Made.create({
    storage,
    fetch: () => {
      if (mode === '500') return Promise.resolve(jsonResponse({ made: {} }, false));
      if (mode === 'bad') return Promise.resolve({ ok: true, status: 200, json: () => Promise.reject(new Error('nope')) });
      return Promise.resolve(jsonResponse({ made: { '1:carnitas': true }, updated: 't' }));
    }
  });
  await client.setMade('1', 'carnitas', true);
  assert.equal(client.isMade('1', 'carnitas'), true);
  assert.equal(client.getState().pending.length, 1);
  mode = 'bad';
  assert.equal(await client.refresh(), false);
  assert.equal(client.isMade('1', 'carnitas'), true);
  mode = 'ok';
  assert.equal(await client.refresh(), true);
  assert.equal(client.getState().pending.length, 0);
  assert.equal(client.isMade('1', 'carnitas'), true);
});

test('offline queue replays on reconnect and a newer GET cannot wipe it', async () => {
  const storage = memoryStorage();
  const server = { made: {}, updated: null };
  let online = false;
  const calls = [];
  const fetchImpl = (url, opts) => {
    const method = (opts && opts.method) || 'GET';
    const body = opts && opts.body ? JSON.parse(opts.body) : null;
    if (!online) return Promise.reject(new TypeError('offline'));
    calls.push({ url, method, body });
    if (method === 'POST' && String(url).endsWith('/reset')) {
      const prefix = body.week + ':';
      Object.keys(server.made).forEach((k) => { if (k.startsWith(prefix)) delete server.made[k]; });
      server.updated = 'reset';
    } else if (method === 'POST') {
      if (body.made) server.made[body.key] = true;
      else delete server.made[body.key];
      server.updated = 'set';
    }
    return Promise.resolve(jsonResponse({ made: Object.assign({}, server.made), updated: server.updated }));
  };
  const client = Made.create({ storage, fetch: fetchImpl });
  await client.setMade('1', 'salsabeef', true);
  await client.setMade('2', 'pozole', true);
  await client.setMade('1', 'salsabeef', false);
  await client.setMade('1', 'salsabeef', true);
  assert.equal(client.getState().pending.length, 2, 'repeat taps on one dinner collapse');
  assert.equal(calls.length, 0);

  online = true;
  server.made['2:fajitas'] = true; // another phone, already on the server
  assert.equal(await client.refresh(), true);
  assert.equal(client.getState().pending.length, 0);
  assert.equal(server.made['1:salsabeef'], true);
  assert.equal(server.made['2:pozole'], true);
  assert.equal(client.isMade('2', 'fajitas'), true);
  assert.equal(client.isMade('1', 'kielbasa'), false);
  const posted = calls.filter((c) => c.method === 'POST' && c.url === Made.API_BASE + '/api/made').map((c) => c.body);
  assert.deepEqual(posted, [
    { key: '2:pozole', made: true },
    { key: '1:salsabeef', made: true }
  ]);
});

test('reset week confirms only that week on the server and leaves the other week', async () => {
  const storage = memoryStorage();
  const server = { made: { '1:salsabeef': true, '1:sunday': true, '2:pozole': true }, updated: 't0' };
  const calls = [];
  const client = Made.create({
    storage,
    fetch: (url, opts) => {
      const method = opts.method || 'GET';
      const body = opts.body ? JSON.parse(opts.body) : null;
      calls.push({ url, method, body, cache: opts.cache });
      if (method === 'POST' && url.endsWith('/api/made/reset')) {
        const prefix = body.week + ':';
        Object.keys(server.made).forEach((k) => { if (k.startsWith(prefix)) delete server.made[k]; });
        server.updated = 't1';
      }
      return Promise.resolve(jsonResponse({ made: Object.assign({}, server.made), updated: server.updated }));
    }
  });
  // Hydrate from the server, then reset week 1.
  assert.equal(await client.refresh(), true);
  assert.equal(client.count('1', Meals.weeks['1'].dinners).made, 2);
  const resetP = client.resetWeek('1');
  assert.equal(client.isMade('1', 'salsabeef'), false, 'clears locally before the response');
  assert.equal(client.isMade('1', 'sunday'), false);
  assert.equal(await resetP, true);
  assert.deepEqual(server.made, { '2:pozole': true });
  assert.equal(client.isMade('2', 'pozole'), true);
  assert.equal(client.count('1', Meals.weeks['1'].dinners).made, 0);
  assert.equal(client.count('2', Meals.weeks['2'].dinners).made, 1);
  const resetCall = calls.find((c) => c.method === 'POST');
  assert.equal(resetCall.url, Made.API_BASE + '/api/made/reset');
  assert.deepEqual(resetCall.body, { week: '1' });
  assert.equal(resetCall.cache, 'no-store');
});

test('a stale GET does not undo a newer tap', async () => {
  const storage = memoryStorage();
  let resolveGet;
  const client = Made.create({
    storage,
    fetch: (url, opts) => {
      if ((opts.method || 'GET') === 'GET') {
        return new Promise((resolve) => {
          resolveGet = () => resolve(jsonResponse({ made: {}, updated: 'old' }));
        });
      }
      return Promise.resolve(jsonResponse({ made: { '1:sunday': true }, updated: 'new' }));
    }
  });
  const refreshP = client.refresh();
  await tick();
  assert.equal(typeof resolveGet, 'function');
  const setP = client.setMade('1', 'sunday', true);
  resolveGet();
  await refreshP;
  await setP;
  assert.equal(client.isMade('1', 'sunday'), true);
  assert.equal(client.getState().pending.length, 0);
});

test('rapid taps send only the latest value for that dinner', async () => {
  const storage = memoryStorage();
  const calls = [];
  const client = Made.create({
    storage,
    fetch: (url, opts) => {
      const body = JSON.parse(opts.body);
      calls.push(body);
      const made = {};
      if (body.made) made[body.key] = true;
      return Promise.resolve(jsonResponse({ made, updated: 'u' }));
    }
  });
  const first = client.setMade('1', 'fajitas', true);
  const second = client.setMade('1', 'fajitas', false);
  assert.equal(client.isMade('1', 'fajitas'), false);
  await first;
  await second;
  assert.deepEqual(calls, [{ key: '1:fajitas', made: false }]);
  assert.equal(client.isMade('1', 'fajitas'), false);
});

test('corrupt cache does not throw and weeks stay independent', async () => {
  const storage = memoryStorage();
  storage.setItem(Made.STORAGE_KEY, '{not json');
  const client = Made.create({
    storage,
    fetch: (url, opts) => {
      const body = opts && opts.body ? JSON.parse(opts.body) : null;
      const made = {};
      if (body && body.made) made[body.key] = true;
      return Promise.resolve(jsonResponse({ made, updated: body ? 't' : null }));
    }
  });
  assert.deepEqual(client.getState().made, {});
  await client.setMade('1', 'salsabeef', true);
  assert.equal(client.isMade('2', 'salsabeef'), false);
  assert.equal(client.isMade('1', 'salsabeef'), true);
});
