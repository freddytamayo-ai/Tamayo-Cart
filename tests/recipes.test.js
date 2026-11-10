// Run: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const Recipes = require('../recipes.js');
const Meals = require('../meals.js');

function allRecipes() {
  const out = [];
  for (const [id, r] of Object.entries(Recipes.byMeal)) out.push({ id, r });
  for (const [week, r] of Object.entries(Recipes.sundayByWeek)) out.push({ id: 'sunday-week-' + week, r });
  return out;
}

test('every dinner recipe serves exactly 5', () => {
  const list = allRecipes();
  assert.equal(Object.keys(Recipes.byMeal).length, Meals.meals.length);
  assert.equal(Object.keys(Recipes.sundayByWeek).length, 2);
  assert.equal(list.length, Meals.meals.length + 2);

  for (const meal of Meals.meals) {
    assert.ok(Recipes.byMeal[meal.id], 'missing recipe for meal ' + meal.id);
  }

  for (const { id, r } of list) {
    assert.equal(r.servings, '5', id + ' must state servings as 5');
    assert.ok(Array.isArray(r.ingredients) && r.ingredients.length, id + ' has ingredients');
    assert.ok(Array.isArray(r.steps) && r.steps.length, id + ' has steps');
    const blob = [r.servings, r.tip, r.doneness].concat(
      r.ingredients,
      r.steps.map((s) => (typeof s === 'string' ? s : (s.title || '') + ' ' + (s.detail || '')))
    ).join(' ').toLowerCase();
    assert.equal(/freeze half|leftovers for burritos|serve half/.test(blob), false, id + ' should not plan extra leftover batches');
  }
});

test('oversized family-batch amounts were scaled to feed 5', () => {
  const by = Recipes.byMeal;
  assert.ok(by.carnitas.ingredients.some((i) => /2 lb pork/.test(i)));
  assert.ok(by.tacobeef.ingredients.some((i) => /1\.5 lb boneless beef/.test(i)));
  assert.ok(by.kielbasa.ingredients.some((i) => /2 lb small red potatoes/.test(i)));
  assert.ok(by.kielbasa.ingredients.some((i) => /1 lb frozen green beans/.test(i)));
  assert.ok(by.drumsticks.ingredients.some((i) => /10 chicken drumsticks/.test(i)));
  assert.ok(by.onepotteriyaki.ingredients.some((i) => /1\.5 lb chicken/.test(i)));

  // Beef dinners that replaced chicken: budget ground beef, still a 5-serving batch.
  for (const id of ['salsabeef', 'tingabeef', 'bbqbeef', 'beeftacosoup', 'beefbowls']) {
    assert.equal(by[id].servings, '5', id);
    assert.ok(by[id].ingredients.some((i) => /ground beef/.test(i)), id + ' uses ground beef');
    assert.ok(by[id].steps.length >= 3, id + ' has step-by-step instructions');
  }
  assert.ok(by.salsabeef.ingredients.some((i) => /1 lb ground beef/.test(i)));
  assert.ok(by.tingabeef.ingredients.some((i) => /1 lb ground beef/.test(i)));
  assert.ok(by.bbqbeef.ingredients.some((i) => /1\.25 lb ground beef/.test(i)));
  assert.ok(by.beeftacosoup.ingredients.some((i) => /1 lb ground beef/.test(i)));
  assert.ok(by.beefbowls.ingredients.some((i) => /1 lb ground beef/.test(i)));

  const w1 = Object.fromEntries(Meals.weeks['1'].items.map((i) => [i.id, i.qty]));
  const w2 = Object.fromEntries(Meals.weeks['2'].items.map((i) => [i.id, i.qty]));
  assert.match(w1['ground-beef'], /2 lb/);
  assert.match(w1['pork-shoulder'], /2 lb/);
  assert.match(w1['drumsticks'], /3\.5 lb/);
  assert.match(w2['chicken-breast'], /3 lb/);
  assert.match(w2['ground-beef'], /2\.25 lb/);
  assert.match(w2['beef-chuck'], /1\.5 lb/);
});
