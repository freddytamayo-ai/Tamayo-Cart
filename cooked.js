/* Tamayo Cart — shared "Made it" marks for dinners.
 * Keys are "<weekId>:<mealId>" (week ids are "1" and "2"; meal ids are the stable ids in meals.js;
 * Sunday, which has no catalog meal, uses "sunday"). Never the day slot.
 * Cached in localStorage under tamayoCart.made.v1, separate from the shopping list (tamayoCart.plan.v1).
 * Shared across phones via MADE API (single constant below). Offline edits stay in `pending` and replay later.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TamayoMade = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var API_BASE = 'https://tamayo-cart-sync.tamayofamily.workers.dev';
  var STORAGE_KEY = 'tamayoCart.made.v1';

  function mealKey(week, mealId) { return String(week) + ':' + String(mealId); }

  /** Stable id for a dinner. Catalog meals use their id; the Sunday dinner (meal: null) is "sunday". */
  function dinnerMealId(dinner) {
    if (dinner && dinner.meal) return String(dinner.meal);
    return 'sunday';
  }

  function compactPending(pending) {
    var out = [];
    (pending || []).forEach(function (op) {
      if (!op) return;
      if (op.op === 'set') {
        out = out.filter(function (x) { return !(x.op === 'set' && x.key === op.key); });
        out.push(op);
      } else if (op.op === 'reset') {
        var prefix = op.week + ':';
        out = out.filter(function (x) {
          if (x.op === 'reset' && x.week === op.week) return false;
          if (x.op === 'set' && x.key.indexOf(prefix) === 0) return false;
          return true;
        });
        out.push(op);
      }
    });
    return out;
  }

  /** Server map with unsent ops painted on top, so a refresh cannot drop an offline tap. */
  function applyPending(made, pending) {
    var out = {};
    if (made && typeof made === 'object') {
      Object.keys(made).forEach(function (k) { if (made[k] === true) out[k] = true; });
    }
    compactPending(pending).forEach(function (op) {
      if (op.op === 'set') {
        if (op.made === true) out[op.key] = true;
        else delete out[op.key];
      } else if (op.op === 'reset') {
        var prefix = op.week + ':';
        Object.keys(out).forEach(function (k) { if (k.indexOf(prefix) === 0) delete out[k]; });
      }
    });
    return out;
  }

  function blank() { return { made: {}, updated: null, pending: [], nextId: 1 }; }

  function normalizeState(raw) {
    var out = blank();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    if (raw.made && typeof raw.made === 'object' && !Array.isArray(raw.made)) {
      Object.keys(raw.made).forEach(function (k) { if (raw.made[k] === true) out.made[k] = true; });
    }
    if (typeof raw.updated === 'string') out.updated = raw.updated;
    var maxId = 0;
    if (Array.isArray(raw.pending)) {
      raw.pending.forEach(function (op) {
        if (!op || typeof op !== 'object') return;
        var id = typeof op.id === 'number' && op.id > 0 ? op.id : 0;
        if (op.op === 'set' && typeof op.key === 'string' && op.key) {
          out.pending.push({ op: 'set', key: op.key, made: op.made === true, id: id });
        } else if (op.op === 'reset' && (typeof op.week === 'string' || typeof op.week === 'number') && String(op.week)) {
          out.pending.push({ op: 'reset', week: String(op.week), id: id });
        }
      });
    }
    out.pending.forEach(function (p) { if (p.id > maxId) maxId = p.id; });
    out.pending.forEach(function (p) { if (!p.id) p.id = ++maxId; });
    out.pending = compactPending(out.pending);
    out.pending.forEach(function (p) { if (p.id > maxId) maxId = p.id; });
    out.nextId = maxId + 1;
    return out;
  }

  function countMade(state, week, dinners) {
    var list = dinners || [];
    var n = 0;
    for (var i = 0; i < list.length; i++) {
      if (state.made[mealKey(week, dinnerMealId(list[i]))] === true) n++;
    }
    return { made: n, total: list.length };
  }

  function create(options) {
    options = options || {};
    var fetchImpl = options.fetch || function (url, opts) { return fetch(url, opts); };
    var storage = options.storage;
    var onChange = options.onChange;
    var loaded = blank();
    try {
      if (storage) {
        var raw = storage.getItem(STORAGE_KEY);
        if (raw) loaded = normalizeState(JSON.parse(raw));
      }
    } catch (e) { loaded = blank(); }
    var state = { made: loaded.made, updated: loaded.updated, pending: loaded.pending };
    var nextId = loaded.nextId || 1;
    var seen = 0;
    var flushPromise = null;

    function persist() {
      try {
        if (storage) storage.setItem(STORAGE_KEY, JSON.stringify({ made: state.made, updated: state.updated, pending: state.pending }));
      } catch (e) {}
    }
    function snapshot() {
      return {
        made: Object.assign({}, state.made),
        updated: state.updated,
        pending: state.pending.map(function (p) { return Object.assign({}, p); })
      };
    }
    function notify() { if (typeof onChange === 'function') onChange(snapshot()); }

    function fetchJson(method, url, body) {
      var opts = { method: method, cache: 'no-store', referrerPolicy: 'no-referrer', headers: { Accept: 'application/json' } };
      if (body !== undefined) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
      }
      return Promise.resolve().then(function () { return fetchImpl(url, opts); }).then(function (res) {
        if (!res || !res.ok) return null;
        return Promise.resolve().then(function () { return res.json(); }).then(function (data) {
          if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
          if (!data.made || typeof data.made !== 'object' || Array.isArray(data.made)) return null;
          return data;
        }, function () { return null; });
      }, function () { return null; });
    }

    function adopt(body) {
      state.updated = typeof body.updated === 'string' ? body.updated : (body.updated == null ? null : state.updated);
      state.made = applyPending(body.made, state.pending);
      persist();
      notify();
    }

    function runFlush() {
      state.pending = compactPending(state.pending);
      if (!state.pending.length) return Promise.resolve(true);
      var sent = state.pending[0];
      var sentId = sent.id;
      return Promise.resolve().then(function () {
        var still = state.pending.some(function (p) { return p.id === sentId; });
        if (!still) return { skipped: true };
        var url = sent.op === 'reset' ? API_BASE + '/api/made/reset' : API_BASE + '/api/made';
        var payload = sent.op === 'reset' ? { week: sent.week } : { key: sent.key, made: sent.made === true };
        return fetchJson('POST', url, payload).then(function (body) { return { body: body }; });
      }).then(function (result) {
        if (result && result.skipped) return runFlush();
        if (!result || !result.body) {
          var head = state.pending[0];
          if (head && head.id === sentId) return false;
          return runFlush();
        }
        state.pending = state.pending.filter(function (p) { return p.id !== sentId; });
        adopt(result.body);
        return runFlush();
      }).catch(function () { return false; });
    }

    function flush() {
      if (flushPromise) return flushPromise;
      flushPromise = runFlush().then(function (ok) { flushPromise = null; return ok; }, function () { flushPromise = null; return false; });
      return flushPromise;
    }

    function pull() {
      var token = seen;
      return fetchJson('GET', API_BASE + '/api/made').then(function (body) {
        if (!body || token !== seen) return false;
        adopt(body);
        return true;
      });
    }

    function refresh() {
      return flush().then(function () { return pull(); }).catch(function () { return false; });
    }

    function setMade(week, mealId, made) {
      if (mealId == null || mealId === '') return Promise.resolve(false);
      seen++;
      var key = mealKey(week, mealId);
      var on = made === true;
      if (on) state.made[key] = true; else delete state.made[key];
      state.pending.push({ op: 'set', key: key, made: on, id: nextId++ });
      state.pending = compactPending(state.pending);
      persist();
      notify();
      return flush();
    }

    function resetWeek(week) {
      seen++;
      week = String(week);
      var prefix = week + ':';
      Object.keys(state.made).forEach(function (k) { if (k.indexOf(prefix) === 0) delete state.made[k]; });
      state.pending.push({ op: 'reset', week: week, id: nextId++ });
      state.pending = compactPending(state.pending);
      persist();
      notify();
      return flush();
    }

    return {
      storageKey: STORAGE_KEY,
      apiBase: API_BASE,
      mealKey: mealKey,
      dinnerMealId: dinnerMealId,
      getState: snapshot,
      isMade: function (week, mealId) { return state.made[mealKey(week, mealId)] === true; },
      count: function (week, dinners) { return countMade(state, week, dinners); },
      setMade: setMade,
      resetWeek: resetWeek,
      refresh: refresh
    };
  }

  return {
    API_BASE: API_BASE,
    STORAGE_KEY: STORAGE_KEY,
    mealKey: mealKey,
    dinnerMealId: dinnerMealId,
    normalizeState: normalizeState,
    compactPending: compactPending,
    applyPending: applyPending,
    countMade: countMade,
    create: create
  };
});
