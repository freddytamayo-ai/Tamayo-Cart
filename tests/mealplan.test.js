// Run: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const Meals = require('../meals.js');
const P = require('../mealplan.js');

const fresh = () => P.normalizePlan({}, Meals);
const sum = (items) => Math.round(items.reduce((s, i) => s + (i.est || 0) * 100, 0)) / 100;

test('data: 19 meals, 2 weeks of 7 dinners, every dinner points at a real meal', () => {
  assert.equal(Meals.meals.length, 19);
  const ids = new Set(Meals.meals.map((m) => m.id));
  for (const w of ['1', '2']) {
    const d = Meals.weeks[w].dinners;
    assert.deepEqual(d.map((x) => x.day), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    d.forEach((x) => assert.ok(x.meal === null || ids.has(x.meal), x.meal));
    assert.equal(d.filter((x) => x.meal).length, 6);
  }
  assert.deepEqual(Meals.weeks['1'].dinners.map((d) => d.meal).slice(0, 6), ['salsa', 'kielbasa', 'tinga', 'tortillacasserole', 'drumsticks', 'carnitas']);
  assert.deepEqual(Meals.weeks['2'].dinners.map((d) => d.meal).slice(0, 6), ['whitechili', 'fajitas', 'pozole', 'burritocasserole', 'bbq', 'tacobeef']);
});

test('data: item ids unique, sections valid; week 1 = $270 after scaling dinners to 5; week 2 estimate $99, all marked estimates', () => {
  const secs = new Set(Meals.sections.map((s) => s.id));
  for (const w of ['1', '2']) {
    const it = Meals.weeks[w].items;
    assert.equal(new Set(it.map((i) => i.id)).size, it.length, 'unique ids week ' + w);
    it.forEach((i) => assert.ok(secs.has(i.section), i.section));
  }
  assert.equal(sum(Meals.weeks['1'].items), 270);
  assert.equal(Meals.weeks['1'].items.length, 51);
  assert.equal(sum(Meals.weeks['2'].items), 99);
  Meals.weeks['2'].items.forEach((i) => { assert.equal(i.estimate, true); assert.ok(i.basis); assert.ok(i.for.length); });
  // week 2 ingredients only come from week 2 meals
  const w2meals = new Set(Meals.weeks['2'].dinners.map((d) => d.meal).filter(Boolean));
  Meals.weeks['2'].items.forEach((i) => i.for.forEach((m) => assert.ok(w2meals.has(m), m)));
  // de-duplicated: chicken breast listed once with combined qty
  assert.equal(Meals.weeks['2'].items.filter((i) => /chicken breast/i.test(i.name)).length, 1);
});

test('groupBySection keeps store order and subtotals', () => {
  const g = P.groupBySection(Meals, P.weekItems(Meals, fresh(), '1', []));
  assert.equal(g[0].id, 'produce');
  assert.equal(g.find((x) => x.id === 'meat').est, 55);
  assert.equal(g.find((x) => x.id === 'produce').est, 44);
  assert.equal(g.reduce((s, x) => s + x.est, 0), 270);
});

test('summary: link a scanned cart item, manual check, remaining', () => {
  const plan = fresh();
  const cart = [{ id: 1, name: 'Onions', price: 3.49, qty: 1 }, { id: 2, name: 'Eggs', price: 2.5, qty: 4 }];
  P.link(plan, '1', 'onions', cart[0]);
  P.link(plan, '1', 'eggs', cart[1]);
  P.toggle(plan, '1', 'garlic'); // had it at home
  const s = P.summary(P.weekItems(Meals, plan, '1', cart));
  assert.equal(s.scanned, 13.49);
  assert.equal(s.scannedCount, 2);
  assert.equal(s.checked, 3);
  assert.equal(s.remaining, 270 - 3 - 11 - 1);
  assert.equal(s.left, 48);
});

test('sync: price follows cart edits; deleted cart line unchecks; finished trip keeps price', () => {
  const plan = fresh();
  let cart = [{ id: 7, price: 4, qty: 1 }];
  P.link(plan, '1', 'milk', cart[0]);
  cart[0].qty = 2; P.sync(plan, cart);
  assert.equal(plan.weeks['1'].done.milk.price, 8);
  P.sync(plan, []); assert.equal(plan.weeks['1'].done.milk, undefined);
  P.link(plan, '1', 'milk', cart[0]); P.markBought(plan); P.sync(plan, []);
  assert.equal(plan.weeks['1'].done.milk.price, 8);
  const it = P.weekItems(Meals, plan, '1', []).find((i) => i.id === 'milk');
  assert.ok(it.checked && it.bought && it.price === 8);
});

test('linking a cart item to a new list item moves the link', () => {
  const plan = fresh(); const c = { id: 3, price: 1, qty: 1 };
  P.link(plan, '1', 'limes', c); P.link(plan, '1', 'garlic', c);
  assert.equal(plan.weeks['1'].done.limes, undefined);
  assert.equal(plan.weeks['1'].done.garlic.cartId, 3);
});

test('custom items, remove, reset week; weeks are independent', () => {
  const plan = fresh();
  const dog = P.addCustom(plan, '1', { name: 'Dog food', qty: '30 lb', est: 32.5 });
  assert.equal(dog.section, 'household');
  assert.equal(P.addCustom(plan, '1', { name: '  ' }), null);
  P.removeItem(plan, '1', 'popcorn');
  let items = P.weekItems(Meals, plan, '1', []);
  assert.equal(items.length, 51);
  assert.ok(items.find((i) => i.id === dog.id && i.custom));
  assert.equal(P.summary(items).estTotal, 270 - 3 + 32.5);
  P.removeItem(plan, '1', dog.id);
  assert.equal(plan.weeks['1'].custom.length, 0);
  P.toggle(plan, '2', 'hominy');
  P.resetWeek(plan, '1');
  assert.equal(P.weekItems(Meals, plan, '1', []).length, 51);
  assert.ok(plan.weeks['2'].done.hominy, 'week 2 untouched by week 1 reset');
});

test('bestMatch finds the list item for a scanned/typed name', () => {
  const items = P.weekItems(Meals, fresh(), '1', []);
  assert.equal(P.bestMatch(items, 'Whole Milk 1 Gal').id, 'milk');
  assert.equal(P.bestMatch(items, 'Bananas').id, 'bananas');
  assert.equal(P.bestMatch(items, 'Foster Farms Drumsticks').id, 'drumsticks');
  assert.equal(P.bestMatch(items, 'Corn tortillas 80 ct').id, 'corn-tortillas');
  assert.equal(P.bestMatch(items, 'Avocado').id, 'avocados');
  assert.equal(P.bestMatch(items, 'Coca-Cola 12 pk'), null);
  assert.equal(P.bestMatch(items, ''), null);
  const w2 = P.weekItems(Meals, fresh(), '2', []);
  assert.equal(P.bestMatch(w2, 'Hominy 25 oz').id, 'hominy');
});

test('budget migration: only the old default (no budget) moves to $325', () => {
  assert.equal(P.migrateBudget({ budget: 0 }).budget, 325);
  assert.equal(P.migrateBudget({}).budget, 325);
  assert.equal(P.migrateBudget({ budget: 60 }).budget, 60);
  assert.equal(P.migrateBudget({ budget: 0, budgetV: 2 }).budget, 0, 'explicit "no budget" after upgrade is kept');
  assert.equal(Meals.defaultBudget, 325);
});
