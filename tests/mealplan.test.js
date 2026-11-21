// Run: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const Meals = require('../meals.js');
const P = require('../mealplan.js');

const fresh = () => P.normalizePlan({}, Meals);
const sum = (items) => Math.round(items.reduce((s, i) => s + (i.est || 0) * 100, 0)) / 100;

test('data: 14 meals, 2 weeks of 7 dinners, every night is a real meal; beef-forward (12 beef, 2 chicken)', () => {
  assert.equal(Meals.meals.length, 14);
  const ids = new Set(Meals.meals.map((m) => m.id));
  for (const w of ['1', '2']) {
    const d = Meals.weeks[w].dinners;
    assert.deepEqual(d.map((x) => x.day), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    d.forEach((x) => assert.ok(ids.has(x.meal), x.meal));
  }
  assert.deepEqual(Meals.weeks['1'].dinners.map((d) => d.meal), ['guisada', 'steakbites', 'carneasada', 'chickentinga', 'ovenburgers', 'potroast', 'bakedziti']);
  assert.deepEqual(Meals.weeks['2'].dinners.map((d) => d.meal), ['barbacoa', 'chickenfajitas', 'burritobake', 'beefbroccoli', 'meatloaf', 'caldores', 'chilecolorado']);
  const chicken = Meals.meals.filter((m) => /chicken/i.test(m.name));
  assert.ok(chicken.length <= 3, 'chicken at most 2-3 nights');
  assert.equal(chicken.length, 2);
  // old plan's meal ids are gone, so last plan's Made it marks cannot show on new dinners
  ['salsabeef', 'kielbasa', 'drumsticks', 'carnitas', 'pozole', 'whitechili', 'fajitas', 'tacobeef'].forEach((old) => assert.ok(!ids.has(old), old));
});

test('data: item ids unique, sections valid; week 1 = $443 (dinners + both weeks of breakfast/lunch/snacks), week 2 = $247', () => {
  const secs = new Set(Meals.sections.map((s) => s.id));
  for (const w of ['1', '2']) {
    const it = Meals.weeks[w].items;
    assert.equal(new Set(it.map((i) => i.id)).size, it.length, 'unique ids week ' + w);
    it.forEach((i) => assert.ok(secs.has(i.section), i.section));
    it.forEach((i) => { assert.equal(i.estimate, true); assert.ok(i.basis); });
  }
  assert.equal(sum(Meals.weeks['1'].items), 443);
  assert.equal(Meals.weeks['1'].items.length, 59);
  assert.equal(sum(Meals.weeks['2'].items), 247);
  // every week-2 item is for a week-2 dinner
  const w2meals = new Set(Meals.weeks['2'].dinners.map((d) => d.meal));
  Meals.weeks['2'].items.forEach((i) => { assert.ok(i.for && i.for.length, i.id); i.for.forEach((m) => assert.ok(w2meals.has(m), m)); });
  // every week-2 meat is frozen on shopping day; week-1 meat after Wednesday is frozen too
  Meals.weeks['2'].items.filter((i) => i.section === 'meat').forEach((i) => assert.match(i.qty, /FREEZE/, i.id));
  ['stew-meat', 'top-sirloin', 'carne-asada'].forEach((id) => assert.match(Meals.weeks['1'].items.find((i) => i.id === id).qty, /FRIDGE/, id));
  ['chicken-thighs', 'ground-beef', 'chuck-roast'].forEach((id) => assert.match(Meals.weeks['1'].items.find((i) => i.id === id).qty, /FREEZE/, id));
});

test('groupBySection keeps store order and subtotals', () => {
  const g = P.groupBySection(Meals, P.weekItems(Meals, fresh(), '1', []));
  assert.equal(g[0].id, 'produce');
  assert.equal(g.find((x) => x.id === 'meat').est, 170);
  assert.equal(g.find((x) => x.id === 'produce').est, 55);
  assert.equal(g.reduce((s, x) => s + x.est, 0), 443);
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
  assert.equal(s.remaining, 443 - 4 - 15 - 2);
  assert.equal(s.left, 56);
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
  P.removeItem(plan, '1', 'crackers');
  let items = P.weekItems(Meals, plan, '1', []);
  assert.equal(items.length, 59);
  assert.ok(items.find((i) => i.id === dog.id && i.custom));
  assert.equal(P.summary(items).estTotal, 443 - 5 + 32.5);
  P.removeItem(plan, '1', dog.id);
  assert.equal(plan.weeks['1'].custom.length, 0);
  P.toggle(plan, '2', 'beef-shank');
  P.resetWeek(plan, '1');
  assert.equal(P.weekItems(Meals, plan, '1', []).length, 59);
  assert.ok(plan.weeks['2'].done['beef-shank'], 'week 2 untouched by week 1 reset');
});

test('bestMatch finds the list item for a scanned/typed name', () => {
  const items = P.weekItems(Meals, fresh(), '1', []);
  assert.equal(P.bestMatch(items, 'Whole Milk 1 Gal').id, 'milk');
  assert.equal(P.bestMatch(items, 'Bananas').id, 'bananas');
  assert.equal(P.bestMatch(items, 'Foster Farms Chicken Thighs Boneless').id, 'chicken-thighs');
  assert.equal(P.bestMatch(items, 'Corn tortillas 80 ct').id, 'corn-tortillas');
  assert.equal(P.bestMatch(items, 'Avocado').id, 'avocados');
  assert.equal(P.bestMatch(items, 'Coca-Cola 12 pk'), null);
  assert.equal(P.bestMatch(items, ''), null);
  const w2 = P.weekItems(Meals, fresh(), '2', []);
  assert.equal(P.bestMatch(w2, 'Beef Shank').id, 'beef-shank');
});

test('budget migration: an old default ($0 none, or the old $325) moves to the $650 2-week budget once; typed amounts are kept', () => {
  assert.equal(P.migrateBudget({ budget: 0 }).budget, 650);
  assert.equal(P.migrateBudget({}).budget, 650);
  assert.equal(P.migrateBudget({ budget: 325, budgetV: 2 }).budget, 650);
  assert.equal(P.migrateBudget({ budget: 60 }).budget, 60);
  assert.equal(P.migrateBudget({ budget: 0, budgetV: 3 }).budget, 0, 'explicit "no budget" after upgrade is kept');
  assert.equal(P.migrateBudget({ budget: 325, budgetV: 3 }).budget, 325, 'a $325 typed after the upgrade is kept');
  assert.equal(Meals.defaultBudget, 650);
});
