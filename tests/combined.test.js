'use strict';
const test = require('node:test');
const assert = require('node:assert');
const Meals = require('../meals.js');
const P = require('../mealplan.js');

test('combined 2-week list: one list, merged quantities, one total = week 1 + week 2', () => {
  const both = Meals.lists.both.items;
  const sum = (a) => a.reduce((s, i) => s + (i.est || 0), 0);
  assert.equal(new Set(both.map((i) => i.id)).size, both.length, 'one line per item');
  assert.equal(sum(both), sum(Meals.weeks['1'].items) + sum(Meals.weeks['2'].items), 'estimates are added, never lowered');
  const beef = both.find((i) => i.id === 'ground-beef');
  assert.deepEqual(beef.weeks, ['1', '2']);
  assert.match(beef.qty, /Wk 1: .*Wk 2: /);
  assert.equal(beef.est, 56, 'raised to the $55.55 paid at El Super');
  assert.match(beef.basis, /El Super/);
  assert.equal(sum(both), 451);
  assert.equal(both.find((i) => i.id === 'cheese').est, 14, 'never lowered when less was paid');
  assert.equal(both.find((i) => i.id === 'rice').section, 'pantry');
  assert.equal(Meals.listKey, 'both');
});

test('combined list: plan state, summary and custom-item carry-over', () => {
  const old = { week: '2', weeks: { '1': { custom: [{ id: 'c1', name: 'Dog food', qty: '30 lb', section: 'household', est: 32.5 }], nextCustom: 2 } } };
  const plan = P.normalizePlan(old, Meals);
  assert.equal(plan.week, '2');
  assert.equal(plan.weeks.both.custom.length, 1);
  const items = P.weekItems(Meals, plan, 'both', []);
  assert.equal(items.length, Meals.lists.both.items.length + 1);
  P.toggle(plan, 'both', 'milk');
  const s = P.summary(P.weekItems(Meals, plan, 'both', []));
  assert.equal(s.checked, 1);
  assert.equal(P.normalizePlan(plan, Meals).weeks.both.custom.length, 1, 'no duplicate carry-over on reload');
});

test('trip spend is the combined list, and a single week does not have its own total', () => {
  const plan = P.normalizePlan({}, Meals);
  const both = () => P.weekItems(Meals, plan, 'both', []);
  const open = P.tripSpend(both(), [], 0);
  assert.equal(open.listTotal, 451);
  assert.equal(open.spent, 0);
  assert.equal(open.remaining, 451);
  assert.equal(open.projected, 451);
  assert.equal(open.total, 69);
  assert.notEqual(open.listTotal, 313);
  assert.notEqual(open.listTotal, 138);
  P.toggle(plan, '1', 'garlic');
  assert.equal(P.tripSpend(both(), [], 0).projected, 451, 'week 1 check-off is not a separate spend');
  assert.equal(P.tripSpend(both(), [], 0).checked, 0);
  const garlic = both().find((i) => i.id === 'garlic');
  P.toggle(plan, 'both', 'garlic');
  const home = P.tripSpend(both(), [], 0);
  assert.equal(home.listTotal, 451, 'list total stays the full estimate');
  assert.equal(home.spent, 0);
  assert.equal(home.remaining, 451 - garlic.est);
  const onions = Meals.lists.both.items.find((i) => i.id === 'onions');
  const cart = [{ id: 1, price: 2.99, qty: 1 }, { id: 2, price: 4, qty: 1 }];
  P.link(plan, 'both', 'onions', cart[0]);
  const shop = P.tripSpend(P.weekItems(Meals, plan, 'both', cart), cart, 6.99);
  assert.equal(shop.spent, 6.99, 'check-off price plus the unlinked cart line, tax included once');
  assert.equal(shop.remaining, 451 - garlic.est - onions.est);
  assert.equal(shop.projected, Math.round((shop.spent + shop.remaining) * 100) / 100);
  assert.equal(shop.listTotal, 451);
  const grouped = P.groupBySection(Meals, P.weekItems(Meals, P.normalizePlan({}, Meals), 'both', []));
  const week1 = P.groupBySection(Meals, P.weekItems(Meals, P.normalizePlan({}, Meals), '1', []));
  assert.equal(Math.round(grouped.reduce((s, g) => s + g.est, 0) * 100) / 100, 451);
  assert.notEqual(grouped.find((g) => g.id === 'produce').est, week1.find((g) => g.id === 'produce').est);
  assert.equal(Meals.defaultBudget, 325);
});
