// Run: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const Meals = require('../meals.js');
const P = require('../mealplan.js');

const fresh = () => P.normalizePlan({}, Meals);
const sum = (items) => Math.round(items.reduce((s, i) => s + (i.est || 0) * 100, 0)) / 100;

test('data: 14 nights per 2 weeks = 5 cooked + 2 leftover nights each week; doubled dinner before each leftover night; beef-heavy', () => {
  assert.equal(Meals.meals.length, 14);
  const byId = Object.fromEntries(Meals.meals.map((m) => [m.id, m]));
  for (const w of ['1', '2']) {
    const d = Meals.weeks[w].dinners;
    assert.deepEqual(d.map((x) => x.day), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    d.forEach((x) => assert.ok(byId[x.meal], x.meal));
    const lo = d.filter((x) => /^lo-/.test(x.meal));
    assert.equal(lo.length, 2, 'two leftover nights in week ' + w);
    assert.equal(d.length - lo.length, 5, 'five cooked dinners in week ' + w);
    lo.forEach((x) => {
      const i = d.indexOf(x), prev = d[i - 1];
      assert.equal(prev.meal, x.meal.slice(3), x.meal + ' comes the night after its double batch');
      assert.match(prev.detail, /DOUBLE BATCH/);
      assert.match(byId[x.meal].name, /^Leftovers: /);
    });
  }
  assert.deepEqual(Meals.weeks['1'].dinners.map((d) => d.meal), ['beeftacos', 'meatloaf', 'potroast', 'lo-potroast', 'picadillo', 'bakedziti', 'lo-bakedziti']);
  assert.deepEqual(Meals.weeks['2'].dinners.map((d) => d.meal), ['chili', 'lo-chili', 'chickenfajitas', 'burritobake', 'shepherdspie', 'chilecolorado', 'lo-chilecolorado']);
  const cooked = Meals.meals.filter((m) => !/^lo-/.test(m.id));
  assert.equal(cooked.length, 10);
  assert.equal(cooked.filter((m) => /chicken/i.test(m.name)).length, 1, 'at most 2 chicken');
  ['salsabeef', 'kielbasa', 'drumsticks', 'carnitas', 'pozole', 'whitechili', 'fajitas', 'tacobeef', 'carneasada', 'steakbites', 'barbacoa', 'guisada'].forEach((old) => assert.ok(!byId[old], old));
});

test('data: item ids unique, sections valid; week 1 = $174, week 2 = $148 (14 dinners only)', () => {
  const secs = new Set(Meals.sections.map((s) => s.id));
  for (const w of ['1', '2']) {
    const it = Meals.weeks[w].items;
    assert.equal(new Set(it.map((i) => i.id)).size, it.length, 'unique ids week ' + w);
    it.forEach((i) => assert.ok(secs.has(i.section), i.section));
    it.forEach((i) => { assert.equal(i.estimate, true); assert.ok(i.basis); });
  }
  assert.equal(sum(Meals.weeks['1'].items), 174);
  assert.equal(Meals.weeks['1'].items.length, 26);
  assert.equal(sum(Meals.weeks['2'].items), 148);
  assert.equal(Meals.weeks['2'].items.length, 18);
  const w2meals = new Set(Meals.weeks['2'].dinners.map((d) => d.meal));
  Meals.weeks['2'].items.forEach((i) => { assert.ok(i.for && i.for.length, i.id); i.for.forEach((m) => assert.ok(w2meals.has(m), m)); });
  Meals.weeks['2'].items.filter((i) => i.section === 'meat').forEach((i) => assert.match(i.qty, /FREEZE/, i.id));
  assert.match(Meals.weeks['1'].items.find((i) => i.id === 'chuck-roast').qty, /FRIDGE/);
  assert.match(Meals.weeks['1'].items.find((i) => i.id === 'ground-beef').qty, /1\.5 lb in FRIDGE for Mon; FREEZE the rest/);
  Meals.weeks['1'].items.forEach((i) => assert.ok(i.for && i.for.length, i.id + ' is for a dinner (no breakfast/lunch/snack extras)'));
  // doubled batches are bought doubled
  assert.match(Meals.weeks['1'].items.find((i) => i.id === 'chuck-roast').qty, /^4 lb/);
  assert.match(Meals.weeks['2'].items.find((i) => i.id === 'stew-meat').qty, /^3 lb/);
  assert.match(Meals.weeks['1'].items.find((i) => i.id === 'ground-beef').qty, /^8 lb/);
  assert.match(Meals.weeks['2'].items.find((i) => i.id === 'ground-beef').qty, /^6 lb/);
});

test('groupBySection keeps store order and subtotals', () => {
  const g = P.groupBySection(Meals, P.weekItems(Meals, fresh(), '1', []));
  assert.equal(g[0].id, 'produce');
  assert.equal(g.find((x) => x.id === 'meat').est, 88);
  assert.equal(g.find((x) => x.id === 'produce').est, 20);
  assert.equal(g.reduce((s, x) => s + x.est, 0), 174);
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
  assert.equal(s.remaining, 174 - 5 - 3 - 2);
  assert.equal(s.left, 23);
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
  P.removeItem(plan, '1', 'salsa');
  let items = P.weekItems(Meals, plan, '1', []);
  assert.equal(items.length, 26);
  assert.ok(items.find((i) => i.id === dog.id && i.custom));
  assert.equal(P.summary(items).estTotal, 174 - 4 + 32.5);
  P.removeItem(plan, '1', dog.id);
  assert.equal(plan.weeks['1'].custom.length, 0);
  P.toggle(plan, '2', 'chicken-breast');
  P.resetWeek(plan, '1');
  assert.equal(P.weekItems(Meals, plan, '1', []).length, 26);
  assert.ok(plan.weeks['2'].done['chicken-breast'], 'week 2 untouched by week 1 reset');
});

test('bestMatch finds the list item for a scanned/typed name', () => {
  const items = P.weekItems(Meals, fresh(), '1', []);
  assert.equal(P.bestMatch(items, 'Whole Milk 1 Gal').id, 'milk');
  assert.equal(P.bestMatch(items, 'Russet Potatoes 10 lb').id, 'potatoes');
  assert.equal(P.bestMatch(items, 'Beef Chuck Roast Boneless').id, 'chuck-roast');
  assert.equal(P.bestMatch(items, 'Corn tortillas 80 ct').id, 'corn-tortillas');
  assert.equal(P.bestMatch(items, 'Green Cabbage').id, 'cabbage');
  assert.equal(P.bestMatch(items, 'Coca-Cola 12 pk'), null);
  assert.equal(P.bestMatch(items, ''), null);
  const w2 = P.weekItems(Meals, fresh(), '2', []);
  assert.equal(P.bestMatch(w2, 'Foster Farms Chicken Breasts Boneless').id, 'chicken-breast');
});

test('budget migration: only the old default (no budget) moves to the $325 2-week budget', () => {
  assert.equal(P.migrateBudget({ budget: 0 }).budget, 325);
  assert.equal(P.migrateBudget({}).budget, 325);
  assert.equal(P.migrateBudget({ budget: 60 }).budget, 60);
  assert.equal(P.migrateBudget({ budget: 0, budgetV: 2 }).budget, 0, 'explicit "no budget" after upgrade is kept');
  assert.equal(P.migrateBudget({ budget: 325, budgetV: 2 }).budget, 325);
  assert.equal(Meals.defaultBudget, 325);
});
