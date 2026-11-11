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
