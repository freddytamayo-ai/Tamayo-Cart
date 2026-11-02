/* Tamayo Cart — meal-plan shopping list logic (pure; shared by the browser and Node tests).
 * Plan state (saved in localStorage under tamayoCart.plan.v1):
 *   { week: '1', weeks: { '1': { done: { itemId: { cartId?, price?, bought?, manual? } }, removed: { itemId: true }, custom: [item], nextCustom: 1 } } }
 *   done[id].cartId -> linked cart item; price = that line's real total (kept in sync); bought = trip finished.
 *   done[id].manual -> ticked off by hand with no scanned price (e.g. already at home). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TamayoPlan = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var OLD_DEFAULT_BUDGET = 0, NEW_DEFAULT_BUDGET = 325, BUDGET_V = 2;

  function cents(v) { return Math.round((Number(v) || 0) * 100); }
  function lineTotal(it) { return Math.round(cents(it.price) * (Number(it.qty) || 0)) / 100; }

  function emptyWeek() { return { done: {}, removed: {}, custom: [], nextCustom: 1 }; }
  function normalizePlan(p, data) {
    p = p && typeof p === 'object' ? p : {};
    var out = { week: p.week && data.weeks[p.week] ? String(p.week) : '1', weeks: {} };
    Object.keys(data.weeks).forEach(function (w) {
      var s = (p.weeks && p.weeks[w]) || {};
      out.weeks[w] = { done: s.done || {}, removed: s.removed || {}, custom: Array.isArray(s.custom) ? s.custom : [], nextCustom: s.nextCustom || 1 };
    });
    return out;
  }

  /** All visible list items for a week (base minus removed, plus custom), with their status. */
  function weekItems(data, plan, week, cartItems) {
    var w = data.weeks[week], st = plan.weeks[week];
    var byCart = {}; (cartItems || []).forEach(function (c) { byCart[c.id] = c; });
    var base = w.items.filter(function (it) { return !st.removed[it.id]; });
    var all = base.concat(st.custom.map(function (c) { return Object.assign({ custom: true }, c); }));
    return all.map(function (it) {
      var d = st.done[it.id], cart = d && d.cartId != null ? byCart[d.cartId] : null;
      var price = d ? (cart ? lineTotal(cart) : (d.price != null ? d.price : null)) : null;
      return Object.assign({}, it, { checked: !!d, linked: !!(d && d.cartId != null), price: d && !d.manual ? price : null, cartId: d ? d.cartId : null, bought: !!(d && d.bought) });
    });
  }

  /** Group items by store section in the data's section order. */
  function groupBySection(data, items) {
    return data.sections.map(function (s) {
      var list = items.filter(function (it) { return (it.section || 'household') === s.id; });
      return { id: s.id, label: s.label, icon: s.icon, items: list, est: list.reduce(function (a, it) { return a + cents(it.est); }, 0) / 100 };
    }).filter(function (g) { return g.items.length; });
  }

  /** Summary numbers for the plan view. */
  function summary(items) {
    var est = 0, scanned = 0, remaining = 0, nChecked = 0, nScanned = 0, nLeft = 0, nLeftNoPrice = 0;
    items.forEach(function (it) {
      est += cents(it.est);
      if (it.checked) {
        nChecked++;
        if (it.price != null) { scanned += cents(it.price); nScanned++; }
      } else {
        nLeft++;
        if (it.est != null) remaining += cents(it.est); else nLeftNoPrice++;
      }
    });
    return { estTotal: est / 100, scanned: scanned / 100, remaining: remaining / 100, projected: (scanned + remaining) / 100,
      total: items.length, checked: nChecked, scannedCount: nScanned, left: nLeft, leftNoPrice: nLeftNoPrice };
  }

  /** Link a cart item to a list item (checks it off). Moves the link if the cart item was linked elsewhere. */
  function link(plan, week, itemId, cartItem) {
    unlinkCart(plan, cartItem.id);
    plan.weeks[week].done[itemId] = { cartId: cartItem.id, price: lineTotal(cartItem) };
  }
  function unlinkCart(plan, cartId) {
    Object.keys(plan.weeks).forEach(function (w) {
      var d = plan.weeks[w].done;
      Object.keys(d).forEach(function (k) { if (d[k].cartId === cartId && !d[k].bought) delete d[k]; });
    });
  }
  function toggle(plan, week, itemId) {
    var d = plan.weeks[week].done;
    if (d[itemId]) { var was = d[itemId]; delete d[itemId]; return { checked: false, was: was }; }
    d[itemId] = { manual: true }; return { checked: true };
  }
  /** Keep linked prices in sync with the cart; drop links to cart items that were deleted (unless the trip was finished). */
  function sync(plan, cartItems) {
    var byCart = {}; (cartItems || []).forEach(function (c) { byCart[c.id] = c; });
    Object.keys(plan.weeks).forEach(function (w) {
      var d = plan.weeks[w].done;
      Object.keys(d).forEach(function (k) {
        var e = d[k]; if (e.cartId == null) return;
        if (byCart[e.cartId]) e.price = lineTotal(byCart[e.cartId]);
        else if (!e.bought) delete d[k];
      });
    });
  }
  /** On "Finish trip": keep linked check-offs (with their prices) after the cart empties. */
  function markBought(plan) {
    Object.keys(plan.weeks).forEach(function (w) {
      var d = plan.weeks[w].done; Object.keys(d).forEach(function (k) { if (d[k].cartId != null) d[k].bought = true; });
    });
  }
  function resetWeek(plan, week) { plan.weeks[week] = emptyWeek(); }
  function addCustom(plan, week, it) {
    var st = plan.weeks[week];
    var item = { id: 'c' + (st.nextCustom++), name: String(it.name || '').trim().slice(0, 60), qty: String(it.qty || '').trim().slice(0, 40), section: it.section || 'household', est: it.est > 0 ? Math.round(it.est * 100) / 100 : null };
    if (!item.name) return null;
    st.custom.push(item); return item;
  }
  function removeItem(plan, week, itemId) {
    var st = plan.weeks[week];
    var ci = st.custom.findIndex(function (c) { return c.id === itemId; });
    if (ci >= 0) st.custom.splice(ci, 1); else st.removed[itemId] = true;
    delete st.done[itemId];
  }

  // ---- matching a scanned / typed name to a list item ----
  var STOPW = { lb: 1, lbs: 1, oz: 1, pack: 1, packs: 1, can: 1, cans: 1, jar: 1, jars: 1, bag: 1, bags: 1, count: 1, ct: 1, the: 1, and: 1, or: 1, with: 1, of: 1, for: 1, big: 1, large: 1, small: 1, box: 1, each: 1, gal: 1, gallon: 1, gallons: 1, dozen: 1, fresh: 1, family: 1, size: 1 };
  function words(s) {
    return String(s || '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(function (w) { return w.length >= 3 && !STOPW[w]; })
      .map(function (w) { return w.replace(/(ies)$/, 'y').replace(/(oes)$/, 'o').replace(/s$/, ''); });
  }
  /** Best unchecked list item for a product name, or null. */
  function bestMatch(items, name) {
    var q = words(name); if (!q.length) return null;
    var best = null, bestScore = 0;
    items.forEach(function (it) {
      if (it.checked) return;
      var w = words(it.name), score = 0;
      q.forEach(function (x) { if (w.indexOf(x) >= 0) score += 2; else if (w.some(function (y) { return y.length >= 4 && x.length >= 4 && (y.indexOf(x) === 0 || x.indexOf(y) === 0); })) score += 1; });
      if (score > bestScore) { bestScore = score; best = it; }
    });
    return bestScore >= 2 ? best : null;
  }

  /** Budget migration: the old default was "no budget" (0). Move only that untouched default to $325. */
  function migrateBudget(state) {
    if (state.budgetV === BUDGET_V) return state;
    if (state.budget == null || Number(state.budget) === OLD_DEFAULT_BUDGET) state.budget = NEW_DEFAULT_BUDGET;
    state.budgetV = BUDGET_V;
    return state;
  }

  return { weekItems: weekItems, groupBySection: groupBySection, summary: summary, link: link, unlinkCart: unlinkCart, toggle: toggle,
    sync: sync, markBought: markBought, resetWeek: resetWeek, addCustom: addCustom, removeItem: removeItem, bestMatch: bestMatch,
    normalizePlan: normalizePlan, migrateBudget: migrateBudget, NEW_DEFAULT_BUDGET: NEW_DEFAULT_BUDGET, OLD_DEFAULT_BUDGET: OLD_DEFAULT_BUDGET, BUDGET_V: BUDGET_V };
});
