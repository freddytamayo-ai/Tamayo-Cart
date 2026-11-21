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
  }
});

test('each night has ingredients and step-by-step instructions, sized for 5; double batches save half; leftovers reheat; freezer thaw steps', () => {
  const by = Recipes.byMeal;
  const cooked = Meals.meals.filter((m) => !/^lo-/.test(m.id));
  const beef = cooked.filter((m) => !/chicken/i.test(m.name)).map((m) => m.id);
  assert.equal(beef.length, 9);
  for (const id of beef) assert.ok(by[id].ingredients.some((i) => /beef|steak|sirloin|chuck|carne asada/i.test(i)), id + ' is a beef dinner');
  for (const m of cooked) assert.ok(by[m.id].steps.length >= 4, m.id + ' has step-by-step instructions');
  const doubles = { potroast: 'Thursday', bakedziti: 'Sunday', barbacoa: 'Tuesday', chilecolorado: 'Sunday' };
  for (const [id, day] of Object.entries(doubles)) {
    assert.ok(by[id].ingredients.some((i) => new RegExp('double batch, save (half|one pan) for ' + day).test(i)), id + ' says double batch, save for ' + day);
    assert.ok(by[id].steps.some((s) => /fridge/.test(s.detail) && new RegExp(day).test(s.title + s.detail)), id + ' has a storage step');
    const lo = by['lo-' + id];
    assert.ok(lo, 'leftover recipe for ' + id);
    assert.equal(lo.servings, '5');
    assert.ok(lo.steps.length >= 3);
    assert.match(lo.doneness, /165°F/);
  }
  assert.ok(by.potroast.ingredients.some((i) => /^6 lb boneless beef chuck roast/.test(i)));
  assert.ok(by.chilecolorado.ingredients.some((i) => /^5 lb beef stew meat/.test(i)));
  assert.ok(by.bakedziti.ingredients.some((i) => /^4 lb ground beef/.test(i)));
  const frozen = ['guisada', 'bakedziti', 'barbacoa', 'chickenfajitas', 'burritobake', 'meatloaf', 'chilecolorado'];
  frozen.forEach((id) => assert.match(by[id].steps[0].title, /^Thaw/, id));
  ['carneasada', 'steakbites', 'potroast'].forEach((id) => assert.doesNotMatch(by[id].steps[0].title, /^Thaw/, id));
  assert.doesNotMatch(JSON.stringify(Recipes), /\$\d/);
});
