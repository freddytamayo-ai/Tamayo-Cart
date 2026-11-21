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
  assert.equal(Object.keys(Recipes.sundayByWeek).length, 0, 'every night is a catalog meal now');
  assert.equal(list.length, Meals.meals.length);

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

test('each dinner has ingredients and step-by-step instructions on the meal, sized for 5, with freezer thaw steps', () => {
  const by = Recipes.byMeal;
  const beefMeals = Meals.meals.filter((m) => !/chicken/i.test(m.name)).map((m) => m.id);
  assert.equal(beefMeals.length, 12);
  for (const id of beefMeals) {
    assert.ok(by[id].ingredients.some((i) => /beef|steak|sirloin|chuck|carne asada/i.test(i)), id + ' is a beef dinner');
  }
  for (const m of Meals.meals) assert.ok(by[m.id].steps.length >= 4, m.id + ' has step-by-step instructions');
  assert.ok(by.guisada.ingredients.some((i) => /2\.5 lb beef stew meat/.test(i)));
  assert.ok(by.ovenburgers.ingredients.some((i) => /2\.5 lb ground beef/.test(i)));
  assert.ok(by.potroast.ingredients.some((i) => /3 lb boneless beef chuck roast/.test(i)));
  // meat frozen on shopping day gets a thaw step; fridge meat (week 1 Mon-Wed) does not
  const frozen = ['chickentinga', 'ovenburgers', 'potroast', 'bakedziti', 'barbacoa', 'chickenfajitas', 'burritobake', 'beefbroccoli', 'meatloaf', 'caldores', 'chilecolorado'];
  frozen.forEach((id) => assert.match(by[id].steps[0].title, /^Thaw/, id));
  ['guisada', 'steakbites', 'carneasada'].forEach((id) => assert.doesNotMatch(by[id].steps[0].title, /^Thaw/, id));
  // no prices or account data in recipes
  const blob = JSON.stringify(Recipes);
  assert.doesNotMatch(blob, /\$\d/);
});
