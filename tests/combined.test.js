'use strict';
const test = require('node:test');
const assert = require('node:assert');
const Meals = require('../meals.js');
const P = require('../mealplan.js');
const K = 'trip2';

test('combined 2-week list: one list, merged quantities, one total = week 1 + week 2', () => {
  const trip = Meals.lists[K].items;
  const sum = (a) => a.reduce((s, i) => s + (i.est || 0), 0);
  assert.equal(new Set(trip.map((i) => i.id)).size, trip.length, 'one line per item');
  assert.equal(sum(trip), sum(Meals.weeks['1'].items) + sum(Meals.weeks['2'].items), 'estimates are added, never lowered');
  const beef = trip.find((i) => i.id === 'ground-beef');
  assert.deepEqual(beef.weeks, ['1', '2']);
  assert.match(beef.qty, /Wk 1: .*Wk 2: /);
  assert.equal(beef.est, 91);
  assert.equal(trip.find((i) => i.id === 'chuck-roast').est, 36);
  assert.equal(sum(trip), 322);
  assert.ok(sum(trip) >= 300 && sum(trip) <= 325, 'whole 2-week list lands in the $300-325 target');
  ['backup-frozen', 'pantry-topups', 'parmesan', 'french-bread', 'salad', 'top-sirloin', 'carne-asada', 'cereal', 'chips'].forEach((id) => assert.ok(!trip.find((i) => i.id === id), id + ' is off the budget list'));
  assert.equal(trip.length, 37);
  assert.equal(trip.find((i) => i.id === 'rice').section, 'pantry');
  assert.equal(Meals.listKey, K);
  assert.equal(Meals.lists.both, undefined, 'last trip\'s list key is retired so old check-offs do not carry over');
});

test('combined list: plan state, summary and custom-item carry-over', () => {
  const old = { week: '2', weeks: { '1': { custom: [{ id: 'c1', name: 'Dog food', qty: '30 lb', section: 'household', est: 32.5 }], nextCustom: 2 } } };
  const plan = P.normalizePlan(old, Meals);
  assert.equal(plan.week, '2');
  assert.equal(plan.weeks[K].custom.length, 1);
  const items = P.weekItems(Meals, plan, K, []);
  assert.equal(items.length, Meals.lists[K].items.length + 1);
  P.toggle(plan, K, 'milk');
  const s = P.summary(P.weekItems(Meals, plan, K, []));
  assert.equal(s.checked, 1);
  assert.equal(P.normalizePlan(plan, Meals).weeks[K].custom.length, 1, 'no duplicate carry-over on reload');
});

test('last trip\'s check-offs on the old combined list do not show on the new list', () => {
  const old = { week: '1', weeks: { both: { done: { onions: { manual: true }, 'ground-beef': { price: 55.55, bought: true } }, removed: {}, custom: [], nextCustom: 1 } } };
  const plan = P.normalizePlan(old, Meals);
  const s = P.summary(P.weekItems(Meals, plan, K, []));
  assert.equal(s.checked, 0);
  assert.equal(s.remaining, 322);
});

test('trip spend is the combined list, and a single week does not have its own total', () => {
  const plan = P.normalizePlan({}, Meals);
  const trip = () => P.weekItems(Meals, plan, K, []);
  const open = P.tripSpend(trip(), [], 0);
  assert.equal(open.listTotal, 322);
  assert.equal(open.spent, 0);
  assert.equal(open.remaining, 322);
  assert.equal(open.projected, 322);
  assert.equal(open.total, 37);
  P.toggle(plan, '1', 'garlic');
  assert.equal(P.tripSpend(trip(), [], 0).projected, 322, 'week 1 check-off is not a separate spend');
  const garlic = trip().find((i) => i.id === 'garlic');
  P.toggle(plan, K, 'garlic');
  const home = P.tripSpend(trip(), [], 0);
  assert.equal(home.listTotal, 322, 'list total stays the full estimate');
  assert.equal(home.remaining, 322 - garlic.est);
  const onions = Meals.lists[K].items.find((i) => i.id === 'onions');
  const cart = [{ id: 1, price: 2.99, qty: 1 }, { id: 2, price: 4, qty: 1 }];
  P.link(plan, K, 'onions', cart[0]);
  const shop = P.tripSpend(P.weekItems(Meals, plan, K, cart), cart, 6.99);
  assert.equal(shop.spent, 6.99, 'check-off price plus the unlinked cart line, tax included once');
  assert.equal(shop.remaining, 322 - garlic.est - onions.est);
  const grouped = P.groupBySection(Meals, P.weekItems(Meals, P.normalizePlan({}, Meals), K, []));
  assert.equal(Math.round(grouped.reduce((s, g) => s + g.est, 0) * 100) / 100, 322);
  assert.equal(grouped.find((g) => g.id === 'meat').est, 166);
  assert.equal(Meals.defaultBudget, 325);
});
