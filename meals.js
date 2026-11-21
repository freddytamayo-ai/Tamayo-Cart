/* Tamayo Cart — meal plan data. Edit this file to change the plan; nothing else needs to change.
 * Plan of Nov 21, 2026 (rev. t827u, budget): each week has 5 cooked dinners + 2 leftover nights. The dinner before each
 * leftover night is a double batch. 10 cooked dinners: 9 beef (mostly ground beef stretched with beans, potatoes, rice and
 * pasta, plus one chuck roast and one stew-meat double batch) + 1 chicken. Every dinner feeds exactly 5, all bought in ONE trip.
 * Leftover nights are their own meals (ids 'lo-*') so the shared Made it check works on them. The list covers the 14 dinners only.
 * Prices are realistic Downey-area value-store regular prices (Nov 2026; BLS Oct 2026 averages as a check), rounded up. Not sale prices.
 *
 * Shape:
 *   sections: ordered store sections   { id, label, icon }
 *   meals:    the 14 nights (10 cooked + 4 leftovers)            { id, name, method, hands (min), time, cost ($ for 5, estimate), ingredients }
 *   weeks:    { '1': { label, note, dinners: [{ day, meal (meal id), title, detail }], items: [...] }, '2': {...} }
 *   lists:    { trip2: the ONE combined 2-week shopping list (week 1 + week 2 merged) }
 *   item:     { id (stable, unique per week), name, qty, section, est ($ or null = check pantry), basis?, for? }
 * Item ids are saved with check-offs in localStorage, so keep them stable when you edit names or prices.
 * The combined list key changed from 'both' to 'trip2' with this plan, so last trip's check-offs do not carry over.
 * Meal ids are all new, so last plan's shared "Made it" marks do not carry over either. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TamayoMeals = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var sections = [
    { id: 'produce', label: 'Produce', icon: '🥬' },
    { id: 'meat', label: 'Meat & poultry', icon: '🥩' },
    { id: 'dairy', label: 'Dairy & eggs', icon: '🧀' },
    { id: 'bakery', label: 'Tortillas & bakery', icon: '🌮' },
    { id: 'canned', label: 'Canned & jarred', icon: '🥫' },
    { id: 'pantry', label: 'Dry goods & pantry', icon: '🍚' },
    { id: 'frozen', label: 'Frozen', icon: '🧊' },
    { id: 'snacks', label: 'Snacks', icon: '🍿' },
    { id: 'household', label: 'Household & pet', icon: '🧻' },
    { id: 'check', label: 'Check the pantry first', icon: '🔎' }
  ];

  var meals = [
    {"id": "beeftacos", "name": "Oven-Baked Beef and Bean Tacos", "method": "Oven bake", "hands": 15, "time": "About 35 min", "cost": 25, "ingredients": "1.5 lb ground beef (from the fridge); 1 can (16 oz) refried beans; 1 packet taco seasoning + 2/3 cup water; 20 corn tortillas; 3 Tbsp oil; 2 cups shredded Mexican-blend cheese; Shredded cabbage and salsa."},
    {"id": "meatloaf", "name": "Sheet-Pan Mini Meatloaves with Potatoes and Carrots", "method": "Sheet pan", "hands": 20, "time": "About 45 min", "cost": 22, "ingredients": "2.5 lb ground beef; 2 eggs; 3/4 cup quick or old-fashioned oats (from the oatmeal); 1/2 cup milk; 1 Tbsp onion powder, 1 tsp garlic powder, 1.5 tsp salt, 1/2 tsp pepper; 1 Tbsp Worcestershire sauce (optional); Glaze: 3/4 cup ketchup, 2 Tbsp sugar, 1 Tbsp mustard; 2 lb potatoes, cut in 1-inch cubes; 1 lb carrots, peeled and cut in sticks; 2 Tbsp oil."},
    {"id": "potroast", "name": "Crockpot Pot Roast with Potatoes and Carrots (double batch)", "method": "Crockpot", "hands": 20, "time": "8–9 hr on LOW or 5–6 hr on HIGH", "cost": 27, "ingredients": "4 lb boneless beef chuck roast (2 roasts, about 2 lb each, from the fridge) — double batch, save half for Thursday; 5 lb potatoes, cut in big chunks; 2 lb carrots, peeled and cut in big pieces; 2 onions, cut in wedges; 2 packets dry onion soup mix; 2 cups water + 2 tsp beef bouillon; 2 Tbsp Worcestershire sauce (optional); 1 tsp pepper; 3 Tbsp cornstarch + 3 Tbsp cold water (for gravy)."},
    {"id": "lo-potroast", "name": "Leftovers: Pot Roast", "method": "Leftovers", "hands": 5, "time": "About 15–30 min", "cost": 18, "ingredients": "Saved half of Wednesday’s pot roast, vegetables and gravy; 1/2 cup water."},
    {"id": "picadillo", "name": "Crockpot Picadillo with Potatoes", "method": "Crockpot", "hands": 15, "time": "4–5 hr on LOW or 2.5–3 hr on HIGH", "cost": 24, "ingredients": "1.5 lb ground beef; 1 onion, diced; 3 garlic cloves, minced; 2 lb potatoes, cut in 1/2-inch cubes; 1 bag (12–16 oz) frozen mixed vegetables; 2 cans (8 oz each) tomato sauce; 1 cup water + 1 tsp beef bouillon; 2 tsp cumin, 1 tsp chili powder, 1.5 tsp salt; 2 cups white rice; 20 flour tortillas."},
    {"id": "bakedziti", "name": "Baked Ziti with Beef (double batch, 2 pans)", "method": "Oven bake", "hands": 30, "time": "About 1 hr", "cost": 23, "ingredients": "2.5 lb ground beef — double batch, save one pan for Sunday; 2 lb ziti or penne pasta; 3 jars (24 oz each) store-brand marinara + 1 can (15 oz) tomato sauce; 2 tsp garlic powder, 2 tsp Italian seasoning or oregano, 1 tsp salt; 4 cups (1 lb) shredded mozzarella; 1 bag frozen mixed vegetables tonight (another for Sunday)."},
    {"id": "lo-bakedziti", "name": "Leftovers: Baked Ziti", "method": "Leftovers", "hands": 5, "time": "About 15–30 min", "cost": 19, "ingredients": "The second (unbaked) pan of ziti saved Saturday; 1 bag frozen mixed vegetables."},
    {"id": "chili", "name": "Crockpot Beef and Bean Chili (double batch)", "method": "Crockpot", "hands": 20, "time": "6–8 hr on LOW or 4 hr on HIGH", "cost": 28, "ingredients": "3 lb ground beef — double batch, save half for Tuesday; 2 onions, diced; 4 garlic cloves, minced; 4 cans (15 oz each) pinto or kidney beans, drained and rinsed; 2 cans (15 oz each) diced tomatoes; 1 can (15 oz) tomato sauce; 1 cup water + 1 tsp beef bouillon; 2 packets chili seasoning (or 3 Tbsp chili powder, 1 Tbsp cumin, 2 tsp salt); 2 cups white rice (tonight); 1 cup shredded cheese (tonight)."},
    {"id": "lo-chili", "name": "Leftovers: Chili-Stuffed Baked Potatoes", "method": "Leftovers", "hands": 5, "time": "About 1 hr", "cost": 15, "ingredients": "Saved half of Monday’s chili; 10 russet potatoes (about 5 lb); 1 Tbsp oil and 1 tsp salt; 1 cup shredded cheese and sour cream."},
    {"id": "chickenfajitas", "name": "Sheet-Pan Chicken Fajitas", "method": "Sheet pan", "hands": 15, "time": "About 40 min", "cost": 23, "ingredients": "2.5 lb boneless skinless chicken breasts, cut in thin strips; 3 bell peppers, sliced; 2 onions, sliced; 3 Tbsp oil; 2 tsp chili powder, 1 tsp cumin, 1 tsp paprika, 1 tsp garlic powder, 1.5 tsp salt; 2 limes; 20 flour tortillas; Shredded cheese, sour cream and salsa (from the fridge)."},
    {"id": "burritobake", "name": "Beef and Bean Burrito Bake", "method": "Oven bake", "hands": 20, "time": "About 45 min", "cost": 25, "ingredients": "1.5 lb ground beef; 1 onion, diced; 1 packet taco seasoning + 2/3 cup water; 2 cans (16 oz each) refried beans; 10 burrito-size flour tortillas; 1 large can (19 oz) red enchilada sauce; 2.5 cups shredded Mexican-blend cheese; Shredded cabbage and sour cream."},
    {"id": "shepherdspie", "name": "Oven Shepherd’s Pie with Ground Beef", "method": "Oven bake", "hands": 25, "time": "About 1 hr", "cost": 19, "ingredients": "1.5 lb ground beef; 3 lb potatoes, peeled and cut in chunks; 1/2 cup milk + 3 Tbsp butter; 1 onion, diced; 2 Tbsp flour; 1 cup water + 1 tsp beef bouillon; 1 Tbsp Worcestershire sauce (optional); 1 bag (12–16 oz) frozen mixed vegetables; 1 cup shredded cheese; Salt and pepper."},
    {"id": "chilecolorado", "name": "Crockpot Chile Colorado con Papas (double batch)", "method": "Crockpot", "hands": 15, "time": "8–9 hr on LOW or 5 hr on HIGH", "cost": 28, "ingredients": "3 lb beef stew meat — double batch, save half for Sunday; 2 lb potatoes, cut in 1-inch cubes (con papas); 1/4 cup flour; 2 tsp cumin, 2 tsp oregano, 2 tsp salt; 1 onion, diced; 4 garlic cloves, minced; 2 cans (28 oz each) red chile sauce (like Las Palmas); 2 cups white rice (tonight); 1 can refried beans, warmed (tonight); 10 flour tortillas (tonight)."},
    {"id": "lo-chilecolorado", "name": "Leftovers: Chile Colorado", "method": "Leftovers", "hands": 5, "time": "About 15–30 min", "cost": 24, "ingredients": "Saved half of Saturday’s chile colorado; 2 cups white rice; 1 can refried beans; 10 flour tortillas."}
  ];

  // Week 1: dinners Mon–Sun plus breakfasts, lunches and snacks for 5 for BOTH weeks (bought in the same trip).
  var week1Items = [
    {"id": "ground-beef", "section": "meat", "name": "Ground beef (80/20), family packs", "qty": "8 lb — keep 1.5 lb in FRIDGE for Mon; FREEZE the rest in labeled bags: meatloaf 2.5, picadillo 1.5, ziti 2.5 (2 bags)", "est": 52, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beeftacos", "meatloaf", "picadillo", "bakedziti", "lo-bakedziti"]},
    {"id": "chuck-roast", "section": "meat", "name": "Boneless beef chuck roast", "qty": "4 lb (2 roasts, pot roast double batch) — keep in FRIDGE, cook Wed", "est": 36, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast", "lo-potroast"]},
    {"id": "potatoes", "section": "produce", "name": "Russet potatoes", "qty": "10 lb bag (meatloaf 2, pot roast 5, picadillo 2) — keep cool and dark", "est": 7, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf", "potroast", "picadillo"]},
    {"id": "carrots", "section": "produce", "name": "Carrots (regular, not baby)", "qty": "3 lb (pot roast 2, meatloaf 1)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast", "meatloaf"]},
    {"id": "onions", "section": "produce", "name": "Onions (yellow or white)", "qty": "5 lb bag (about 10, for both weeks)", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast", "picadillo", "chili", "chickenfajitas", "burritobake", "shepherdspie", "chilecolorado"]},
    {"id": "garlic", "section": "produce", "name": "Garlic", "qty": "2 heads (both weeks)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["picadillo", "chili", "chilecolorado"]},
    {"id": "cabbage", "section": "produce", "name": "Green cabbage (shred for tacos; keeps 2+ weeks)", "qty": "1 head", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beeftacos", "burritobake"]},
    {"id": "eggs", "section": "dairy", "name": "Eggs", "qty": "1 dozen (meatloaf; breakfast eggs are not on this list)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf"]},
    {"id": "milk", "section": "dairy", "name": "Milk", "qty": "1/2 gallon (meatloaf + mashed potatoes only)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf", "shepherdspie"]},
    {"id": "mozzarella", "section": "dairy", "name": "Shredded mozzarella (store brand)", "qty": "1 lb bag (4 cups)", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti", "lo-bakedziti"]},
    {"id": "mexican-cheese", "section": "dairy", "name": "Shredded Mexican-blend cheese (store brand)", "qty": "1 lb bag", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beeftacos"]},
    {"id": "corn-tortillas", "section": "bakery", "name": "Corn tortillas", "qty": "1 pack (30)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beeftacos"]},
    {"id": "flour-tortillas", "section": "bakery", "name": "Flour tortillas (taco size)", "qty": "20-count", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["picadillo"]},
    {"id": "frozen-veg", "section": "frozen", "name": "Frozen mixed vegetables (store brand)", "qty": "3 bags (picadillo, ziti night, ziti leftovers)", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["picadillo", "bakedziti", "lo-bakedziti"]},
    {"id": "refried", "section": "canned", "name": "Refried beans", "qty": "1 can (tacos)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beeftacos"]},
    {"id": "tomato-sauce", "section": "canned", "name": "Tomato sauce", "qty": "2 small cans (8 oz) + 1 can (15 oz)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["picadillo", "bakedziti"]},
    {"id": "marinara", "section": "canned", "name": "Marinara sauce (store brand)", "qty": "3 jars (24 oz)", "est": 7, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti", "lo-bakedziti"]},
    {"id": "salsa", "section": "canned", "name": "Salsa (store brand)", "qty": "1 jar (24 oz) — keeps in the fridge for both weeks", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beeftacos", "chickenfajitas"]},
    {"id": "rice", "section": "pantry", "name": "Long-grain white rice", "qty": "5 lb bag (both weeks)", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["picadillo", "chili", "chilecolorado", "lo-chilecolorado"]},
    {"id": "pasta", "section": "pantry", "name": "Ziti or penne pasta", "qty": "2 lb", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "oatmeal", "section": "pantry", "name": "Quick or old-fashioned oats (store brand)", "qty": "1 small canister (18 oz, meatloaf)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf"]},
    {"id": "taco-seasoning", "section": "pantry", "name": "Taco seasoning", "qty": "2 packets (tacos, burrito bake)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beeftacos", "burritobake"]},
    {"id": "onion-soup", "section": "pantry", "name": "Dry onion soup mix", "qty": "2 packets", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast"]},
    {"id": "bouillon", "section": "pantry", "name": "Beef bouillon (Knorr caldo de res)", "qty": "1 jar — makes the broth for both weeks", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast", "picadillo", "chili", "shepherdspie"]},
    {"id": "spices", "section": "check", "name": "Spices: cumin, chili powder, oregano, garlic & onion powder, Italian seasoning, pepper", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["picadillo", "meatloaf", "bakedziti", "chilecolorado"]},
    {"id": "basics", "section": "check", "name": "Oil, butter, flour, cornstarch, salt, sugar, ketchup, mustard, Worcestershire", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["potroast", "meatloaf", "shepherdspie", "chilecolorado"]}
  ];

  // Week 2: dinners only. Meat here is frozen on shopping day (see each item's qty).
  var week2Items = [
    {"id": "ground-beef", "section": "meat", "name": "Ground beef (80/20), family packs", "qty": "6 lb — FREEZE in labeled bags: chili 3 (2 bags), burrito bake 1.5, shepherd’s pie 1.5", "est": 39, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chili", "lo-chili", "burritobake", "shepherdspie"]},
    {"id": "stew-meat", "section": "meat", "name": "Beef stew meat (carne para guisar)", "qty": "3 lb (chile colorado double batch) — FREEZE in 2 bags", "est": 28, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chilecolorado", "lo-chilecolorado"]},
    {"id": "chicken-breast", "section": "meat", "name": "Boneless skinless chicken breasts (value pack)", "qty": "2.5 lb — FREEZE on shopping day", "est": 11, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas"]},
    {"id": "potatoes", "section": "produce", "name": "Russet potatoes", "qty": "10 lb bag (stuffed potatoes 5, shepherd’s pie 3, chile colorado 2)", "est": 7, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["lo-chili", "shepherdspie", "chilecolorado"]},
    {"id": "bell-peppers", "section": "produce", "name": "Bell peppers (green are cheapest)", "qty": "3", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas"]},
    {"id": "limes", "section": "produce", "name": "Limes", "qty": "2", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas"]},
    {"id": "mexican-cheese", "section": "dairy", "name": "Shredded Mexican-blend cheese (store brand)", "qty": "2 lb bag", "est": 10, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chili", "lo-chili", "chickenfajitas", "burritobake", "shepherdspie"]},
    {"id": "sour-cream", "section": "dairy", "name": "Sour cream", "qty": "16 oz", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["lo-chili", "chickenfajitas", "burritobake"]},
    {"id": "flour-tortillas", "section": "bakery", "name": "Flour tortillas (taco size)", "qty": "2 packs of 20 (fajitas, chile colorado, leftovers)", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas", "chilecolorado", "lo-chilecolorado"]},
    {"id": "burrito-tortillas", "section": "bakery", "name": "Burrito-size flour tortillas", "qty": "1 pack of 10", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "frozen-veg", "section": "frozen", "name": "Frozen mixed vegetables (store brand)", "qty": "1 bag (shepherd’s pie)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["shepherdspie"]},
    {"id": "refried", "section": "canned", "name": "Refried beans", "qty": "4 cans (burrito bake 2, chile colorado 2)", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake", "chilecolorado", "lo-chilecolorado"]},
    {"id": "pinto-beans", "section": "canned", "name": "Pinto or kidney beans", "qty": "4 cans (15 oz)", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chili"]},
    {"id": "diced-tomatoes", "section": "canned", "name": "Diced tomatoes", "qty": "2 cans (15 oz)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chili"]},
    {"id": "tomato-sauce", "section": "canned", "name": "Tomato sauce", "qty": "1 can (15 oz)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chili"]},
    {"id": "enchilada", "section": "canned", "name": "Red enchilada sauce", "qty": "1 large can (19 oz)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "red-chile", "section": "canned", "name": "Red chile sauce (Las Palmas)", "qty": "2 cans (28 oz)", "est": 9, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chilecolorado", "lo-chilecolorado"]},
    {"id": "chili-seasoning", "section": "pantry", "name": "Chili seasoning", "qty": "2 packets", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chili"]}
  ];

  // ONE combined 2-week shopping list (Freddy, Nov 10 and Nov 21, 2026: shop both weeks in one trip). Items that appear in both
  // weeks are merged into one line: quantities are listed per week and the estimates are added (never lowered).
  function combineWeeks(a, b) {
    var out = [], byId = {};
    function add(it, wk) {
      var cur = byId[it.id];
      if (!cur) {
        cur = byId[it.id] = { id: it.id, section: it.section, name: it.name, qty: it.qty, est: it.est, basis: it.basis, for: (it.for || []).slice(), weeks: [wk], qtyBy: {} };
        cur.qtyBy[wk] = it.qty; out.push(cur); return;
      }
      cur.weeks.push(wk); cur.qtyBy[wk] = it.qty;
      if (cur.section === 'check' && it.section !== 'check') cur.section = it.section;
      if (it.est != null) cur.est = (cur.est || 0) + it.est;
      (it.for || []).forEach(function (m) { if (cur.for.indexOf(m) < 0) cur.for.push(m); });
      if (cur.est != null) cur.basis = 'week 1 + week 2 added together';
    }
    a.forEach(function (it) { add(it, '1'); });
    b.forEach(function (it) { add(it, '2'); });
    return out.map(function (it) {
      var o = { id: it.id, section: it.section, name: it.name, est: it.est, weeks: it.weeks };
      o.qty = it.weeks.length > 1 ? 'Wk 1: ' + it.qtyBy['1'] + ' · Wk 2: ' + it.qtyBy['2'] : 'Wk ' + it.weeks[0] + ': ' + it.qty;
      if (it.basis) o.basis = it.basis;
      if (it.for.length) o.for = it.for;
      return o;
    });
  }
  var tripItems = combineWeeks(week1Items, week2Items);
  var lists = {
    trip2: {
      label: '2-week list',
      note: "One list for both weeks, so you shop once. Items used in both weeks are on one line with each week’s amount, and their estimates are added together. 5 cooked dinners + 2 leftover nights each week: the dinner before each leftover night is a DOUBLE BATCH (amounts on this list are already doubled). Budget list: mostly ground beef stretched with beans, potatoes, rice and pasta, plus one chuck roast and one stew-meat dinner. Buy store brands. MEAT ON SHOPPING DAY: keep only the Week 1 Monday ground beef (1.5 lb) and the chuck roast (Wed) in the fridge. Freeze everything else the same day, flat in zip bags labeled with the dinner name. Thaw each one in the fridge as its recipe says. This list covers the 14 dinners only (breakfasts, lunches and snacks are not on it). Prices are realistic Downey-area value-store estimates (Nov 2026), rounded up, not sale prices.",
      items: tripItems
    }
  };

  var weeks = {
    '1': {
      label: 'Week 1',
      note: 'Week 1 dinners plus breakfasts, lunches and snacks for both weeks. Prices are Downey-area estimates.',
      dinners: [
        {"day": "Mon", "meal": "beeftacos", "title": "Oven-Baked Beef and Bean Tacos", "detail": "oven — beef from the fridge"},
        {"day": "Tue", "meal": "meatloaf", "title": "Sheet-Pan Mini Meatloaves with Potatoes and Carrots", "detail": "sheet pan — thaw beef Mon night"},
        {"day": "Wed", "meal": "potroast", "title": "Crockpot Pot Roast with Potatoes and Carrots (double batch)", "detail": "crockpot — DOUBLE BATCH, save half for Thu — roast from the fridge"},
        {"day": "Thu", "meal": "lo-potroast", "title": "Leftovers: Pot Roast", "detail": "leftovers — reheat Wed’s double batch"},
        {"day": "Fri", "meal": "picadillo", "title": "Crockpot Picadillo with Potatoes", "detail": "crockpot — thaw beef Thu night"},
        {"day": "Sat", "meal": "bakedziti", "title": "Baked Ziti with Beef (double batch, 2 pans)", "detail": "oven — DOUBLE BATCH, save one pan for Sun — thaw beef Fri night"},
        {"day": "Sun", "meal": "lo-bakedziti", "title": "Leftovers: Baked Ziti", "detail": "leftovers — bake Sat’s second pan"}
      ],
      items: week1Items
    },
    '2': {
      label: 'Week 2',
      note: 'Week 2 dinners. All week 2 meat is frozen on shopping day; each recipe says when to move it to the fridge.',
      dinners: [
        {"day": "Mon", "meal": "chili", "title": "Crockpot Beef and Bean Chili (double batch)", "detail": "crockpot — DOUBLE BATCH, save half for Tue — thaw beef Sun night"},
        {"day": "Tue", "meal": "lo-chili", "title": "Leftovers: Chili-Stuffed Baked Potatoes", "detail": "leftovers — reheat Mon’s double batch"},
        {"day": "Wed", "meal": "chickenfajitas", "title": "Sheet-Pan Chicken Fajitas", "detail": "sheet pan — thaw chicken Tue night"},
        {"day": "Thu", "meal": "burritobake", "title": "Beef and Bean Burrito Bake", "detail": "oven — thaw beef Wed night"},
        {"day": "Fri", "meal": "shepherdspie", "title": "Oven Shepherd’s Pie with Ground Beef", "detail": "oven — thaw beef Thu night"},
        {"day": "Sat", "meal": "chilecolorado", "title": "Crockpot Chile Colorado con Papas (double batch)", "detail": "crockpot — DOUBLE BATCH, save half for Sun — thaw beef Thu night"},
        {"day": "Sun", "meal": "lo-chilecolorado", "title": "Leftovers: Chile Colorado", "detail": "leftovers — reheat Sat’s double batch"}
      ],
      items: week2Items
    }
  };

  return { version: 4, source: 'Tamayo 2-week beef-forward plan (Nov 21, 2026)', defaultBudget: 325, sections: sections, meals: meals, weeks: weeks, lists: lists, listKey: 'trip2' };
});
