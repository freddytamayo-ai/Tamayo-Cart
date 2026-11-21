/* Tamayo Cart — meal plan data. Edit this file to change the plan; nothing else needs to change.
 * Plan of Nov 21, 2026: 14 dinners over 2 weeks, beef-forward (12 beef: ground beef, stew meat, chuck roast,
 * sirloin, carne asada steak, beef shank; 2 chicken), every dinner feeds exactly 5, all bought in ONE trip.
 * Week 2 meat (and Week 1 meat cooked after Wednesday) is frozen on shopping day; each recipe says when to thaw it.
 * All prices are realistic Downey-area estimates (BLS West-region Oct 2026 beef averages, the Nov 10, 2026
 * El Super receipt, rounded up). Not sale prices.
 *
 * Shape:
 *   sections: ordered store sections   { id, label, icon }
 *   meals:    the 14 dinners            { id, name, method, hands (min), time, cost ($ for 5, estimate), ingredients }
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
    {"id": "guisada", "name": "Crockpot Carne Guisada", "method": "Crockpot", "hands": 15, "time": "8 hr on LOW or 4–5 hr on HIGH", "cost": 42, "ingredients": "2.5 lb beef stew meat (carne para guisar); 2 Tbsp flour; 1 onion, diced; 1 green bell pepper, diced; 4 garlic cloves, minced; 1 can (8 oz) tomato sauce; 1 cup water + 1 tsp beef bouillon; 2 tsp cumin, 1 tsp chili powder, 1 tsp oregano; 1 tsp salt, 1/2 tsp pepper; 2 cups white rice (makes rice for 5); 10 flour tortillas."},
    {"id": "steakbites", "name": "Sheet-Pan Steak Bites with Potatoes and Green Beans", "method": "Sheet pan", "hands": 15, "time": "About 40 min", "cost": 38, "ingredients": "2.5 lb top sirloin steak, cut in 1-inch cubes; 2 lb small red potatoes, cut in quarters; 1 lb fresh green beans, ends snapped off; 3 Tbsp oil; 2 tsp steak seasoning (or 1 tsp salt, 1 tsp pepper, 1 tsp garlic powder); 1 tsp salt for the vegetables; 3 garlic cloves, minced; 2 Tbsp butter."},
    {"id": "carneasada", "name": "Oven Carne Asada Tacos", "method": "Oven broiler", "hands": 15, "time": "About 25 min (plus marinating)", "cost": 41, "ingredients": "2.5 lb thin carne asada steak (flap meat / ranchera or skirt); Juice of 2 oranges and 2 limes; 3 garlic cloves, minced; 2 Tbsp oil; 1 tsp cumin, 1 tsp chili powder, 1.5 tsp salt; 20 corn tortillas; 1 white onion and 1 bunch cilantro, chopped; 2 avocados, sliced; Salsa and lime wedges."},
    {"id": "chickentinga", "name": "Crockpot Chicken Tinga Tostadas", "method": "Crockpot", "hands": 10, "time": "6 hr on LOW or 3 hr on HIGH", "cost": 39, "ingredients": "2.5 lb boneless skinless chicken thighs; 1 onion, sliced; 3 garlic cloves, minced; 1 can (15 oz) fire-roasted diced tomatoes; 2 chipotle peppers in adobo, chopped, + 1 Tbsp of the sauce; 1/2 cup water + 1/2 tsp bouillon; 1 tsp oregano, 1 tsp cumin, 1 tsp salt; 15 tostadas; 2 cans refried beans, warmed; Shredded lettuce, crema and crumbled queso fresco."},
    {"id": "ovenburgers", "name": "Sheet-Pan Oven Cheeseburgers and Fries", "method": "Sheet pan", "hands": 15, "time": "About 35 min", "cost": 44, "ingredients": "2.5 lb ground beef (makes 10 patties, 2 per person); 1.5 tsp salt, 1 tsp pepper, 1 tsp garlic powder; 10 slices American cheese; 10 hamburger buns; Lettuce, 2 tomatoes, 1 onion and pickles, sliced; Ketchup and mustard; 2 bags (2 lb each) frozen french fries."},
    {"id": "potroast", "name": "Crockpot Pot Roast with Potatoes and Carrots", "method": "Crockpot", "hands": 15, "time": "8–9 hr on LOW or 5–6 hr on HIGH", "cost": 38, "ingredients": "3 lb boneless beef chuck roast; 2 lb potatoes, cut in big chunks; 1 lb baby carrots; 1 onion, cut in wedges; 1 packet dry onion soup mix; 1 cup water + 1 tsp beef bouillon; 1 Tbsp Worcestershire sauce (optional); 1/2 tsp pepper; 2 Tbsp cornstarch + 2 Tbsp cold water (for gravy)."},
    {"id": "bakedziti", "name": "Baked Ziti with Beef", "method": "Oven bake", "hands": 20, "time": "About 50 min", "cost": 40, "ingredients": "2 lb ground beef; 1 lb ziti or penne pasta; 2 jars (24 oz each) marinara sauce; 1 tsp garlic powder, 1 tsp Italian seasoning or oregano, 1/2 tsp salt; 2 cups shredded mozzarella; 1/2 cup grated parmesan; 1 bag salad and 1 loaf French bread on the side."},
    {"id": "barbacoa", "name": "Crockpot Beef Barbacoa Tacos", "method": "Crockpot", "hands": 15, "time": "8–10 hr on LOW or 5–6 hr on HIGH", "cost": 36, "ingredients": "3 lb boneless beef chuck roast, cut in 4 big pieces; 1 onion, chopped; 4 garlic cloves; 3 chipotle peppers in adobo + 2 Tbsp of the sauce; Juice of 2 limes; 1/2 cup water + 1/2 tsp beef bouillon; 1 Tbsp cumin, 1 Tbsp oregano, 1.5 tsp salt; 2 bay leaves; 20 corn tortillas; Chopped onion, cilantro, salsa and lime wedges."},
    {"id": "chickenfajitas", "name": "Sheet-Pan Chicken Fajitas", "method": "Sheet pan", "hands": 15, "time": "About 40 min", "cost": 29, "ingredients": "2.5 lb boneless skinless chicken breasts, cut in thin strips; 3 bell peppers, sliced; 2 onions, sliced; 3 Tbsp oil; 2 tsp chili powder, 1 tsp cumin, 1 tsp paprika, 1 tsp garlic powder, 1.5 tsp salt; 2 limes; 20 flour tortillas; Shredded cheese, sour cream and salsa."},
    {"id": "burritobake", "name": "Beef and Bean Burrito Bake", "method": "Oven bake", "hands": 20, "time": "About 45 min", "cost": 38, "ingredients": "2 lb ground beef; 1 onion, diced; 1 packet taco seasoning + 2/3 cup water; 1 can (16 oz) refried beans; 8 burrito-size flour tortillas; 1 large can (19 oz) red enchilada sauce; 3 cups shredded Mexican-blend cheese; Shredded lettuce and sour cream."},
    {"id": "beefbroccoli", "name": "Crockpot Beef and Broccoli", "method": "Crockpot", "hands": 15, "time": "5–6 hr on LOW or 3 hr on HIGH", "cost": 38, "ingredients": "2.5 lb boneless beef chuck (roast or steaks), sliced in thin strips; 1 cup water + 1 tsp beef bouillon; 2/3 cup soy sauce (low sodium if you have it); 1/3 cup brown sugar; 4 garlic cloves, minced; 1 tsp ground ginger; 1 Tbsp sesame oil (optional); 3 Tbsp cornstarch + 3 Tbsp cold water; 2 lb frozen broccoli florets; 2.5 cups white rice."},
    {"id": "meatloaf", "name": "Sheet-Pan Mini Meatloaves with Potatoes and Carrots", "method": "Sheet pan", "hands": 20, "time": "About 45 min", "cost": 26, "ingredients": "2.5 lb ground beef; 2 eggs; 3/4 cup breadcrumbs; 1/2 cup milk; 1 Tbsp onion powder, 1 tsp garlic powder, 1.5 tsp salt, 1/2 tsp pepper; 1 Tbsp Worcestershire sauce (optional); Glaze: 3/4 cup ketchup, 2 Tbsp brown sugar, 1 Tbsp mustard; 2 lb potatoes, cut in 1-inch cubes; 1 lb baby carrots; 2 Tbsp oil."},
    {"id": "caldores", "name": "Crockpot Caldo de Res (Beef Soup)", "method": "Crockpot", "hands": 20, "time": "8 hr on LOW", "cost": 44, "ingredients": "3.5 lb bone-in beef shank (chamorro); 1 onion, cut in half; 4 garlic cloves; 1 can (8 oz) tomato sauce; 1 Tbsp beef bouillon (caldo de res) + 2 tsp salt; 2 bay leaves; 7 cups water; 3 potatoes, cut in big chunks; 1 lb baby carrots; 4 frozen corn-on-the-cob pieces; 1/2 small cabbage, cut in wedges; 1.5 cups rice, cilantro, limes, tortillas."},
    {"id": "chilecolorado", "name": "Crockpot Chile Colorado (Beef in Red Chile)", "method": "Crockpot", "hands": 10, "time": "8 hr on LOW or 4–5 hr on HIGH", "cost": 37, "ingredients": "2.5 lb beef stew meat; 2 Tbsp flour; 1 tsp cumin, 1 tsp oregano, 1 tsp salt; 1 onion, diced; 3 garlic cloves, minced; 1 can (28 oz) red chile sauce (like Las Palmas); 2 cups white rice; 2 cans refried beans, warmed; 10 flour tortillas."}
  ];

  // Week 1: dinners Mon–Sun plus breakfasts, lunches and snacks for 5 for BOTH weeks (bought in the same trip).
  var week1Items = [
    {"id": "stew-meat", "section": "meat", "name": "Beef stew meat (carne para guisar)", "qty": "2.5 lb — keep in FRIDGE, cook Mon", "est": 24, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "top-sirloin", "section": "meat", "name": "Top sirloin steak", "qty": "2.5 lb — keep in FRIDGE, cook Tue", "est": 32, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["steakbites"]},
    {"id": "carne-asada", "section": "meat", "name": "Carne asada steak (flap meat / ranchera, or skirt)", "qty": "2.5 lb — keep in FRIDGE, cook Wed", "est": 25, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "chicken-thighs", "section": "meat", "name": "Boneless skinless chicken thighs", "qty": "2.5 lb — FREEZE on shopping day", "est": 12, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickentinga"]},
    {"id": "ground-beef", "section": "meat", "name": "Ground beef (80/20)", "qty": "4.5 lb (burgers 2.5, ziti 2) — FREEZE in 2 bags", "est": 33, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["ovenburgers", "bakedziti"]},
    {"id": "chuck-roast", "section": "meat", "name": "Boneless beef chuck roast", "qty": "3 lb (pot roast) — FREEZE", "est": 29, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast"]},
    {"id": "onions", "section": "produce", "name": "Onions (yellow or white)", "qty": "5 onions", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada", "carneasada", "chickentinga", "ovenburgers", "potroast"]},
    {"id": "garlic", "section": "produce", "name": "Garlic", "qty": "2 heads", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada", "steakbites", "carneasada", "chickentinga"]},
    {"id": "green-pepper", "section": "produce", "name": "Green bell pepper", "qty": "1", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "potatoes", "section": "produce", "name": "Potatoes (red or yellow)", "qty": "4 lb (steak bites 2, pot roast 2) — one 5 lb bag", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["steakbites", "potroast"]},
    {"id": "green-beans", "section": "produce", "name": "Fresh green beans", "qty": "1 lb", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["steakbites"]},
    {"id": "baby-carrots", "section": "produce", "name": "Baby carrots", "qty": "1 lb", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast"]},
    {"id": "limes", "section": "produce", "name": "Limes", "qty": "4", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "oranges", "section": "produce", "name": "Oranges", "qty": "2 (carne asada marinade)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "cilantro", "section": "produce", "name": "Cilantro", "qty": "1 bunch", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "avocados", "section": "produce", "name": "Avocados", "qty": "2–3", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "lettuce-tomato", "section": "produce", "name": "Lettuce and tomatoes", "qty": "1 romaine + 1 bag shredded lettuce, 2 tomatoes", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickentinga", "ovenburgers"]},
    {"id": "salad", "section": "produce", "name": "Bagged salad", "qty": "1 large bag", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "mozzarella", "section": "dairy", "name": "Shredded mozzarella", "qty": "8 oz bag (2 cups)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "parmesan", "section": "dairy", "name": "Grated parmesan", "qty": "small container", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "american-cheese", "section": "dairy", "name": "American cheese slices", "qty": "2 packs (1 for burgers, 1 for lunches)", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["ovenburgers"]},
    {"id": "crema", "section": "dairy", "name": "Mexican crema or sour cream", "qty": "15 oz", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickentinga"]},
    {"id": "queso-fresco", "section": "dairy", "name": "Queso fresco", "qty": "10 oz", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickentinga"]},
    {"id": "flour-tortillas", "section": "bakery", "name": "Flour tortillas (taco size)", "qty": "20-count", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "corn-tortillas", "section": "bakery", "name": "Corn tortillas", "qty": "1 pack (30)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "tostadas", "section": "bakery", "name": "Tostadas", "qty": "1 pack (15+)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickentinga"]},
    {"id": "buns", "section": "bakery", "name": "Hamburger buns", "qty": "2 packs of 8", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["ovenburgers"]},
    {"id": "french-bread", "section": "bakery", "name": "French bread", "qty": "1 loaf", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "tomato-sauce", "section": "canned", "name": "Tomato sauce", "qty": "1 can (8 oz)", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "fire-tomatoes", "section": "canned", "name": "Fire-roasted diced tomatoes", "qty": "1 can (15 oz)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickentinga"]},
    {"id": "chipotle", "section": "canned", "name": "Chipotle peppers in adobo", "qty": "1 small can", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickentinga"]},
    {"id": "refried", "section": "canned", "name": "Refried beans", "qty": "2 cans", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickentinga"]},
    {"id": "marinara", "section": "canned", "name": "Marinara sauce", "qty": "2 jars (24 oz)", "est": 7, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "salsa", "section": "canned", "name": "Salsa", "qty": "1 jar (24 oz)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada", "ovenburgers"]},
    {"id": "bouillon", "section": "pantry", "name": "Beef bouillon (Knorr caldo de res)", "qty": "1 jar — makes the broth for both weeks (1 tsp + 1 cup water = 1 cup broth)", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada", "chickentinga", "potroast"]},
    {"id": "onion-soup", "section": "pantry", "name": "Dry onion soup mix", "qty": "1 packet", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast"]},
    {"id": "rice", "section": "pantry", "name": "Long-grain white rice", "qty": "10 lb bag (dinners both weeks + lunches)", "est": 9, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "pasta", "section": "pantry", "name": "Ziti or penne pasta", "qty": "1 lb box", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "fries", "section": "frozen", "name": "Frozen french fries", "qty": "2 bags (2 lb each)", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["ovenburgers"]},
    {"id": "spices", "section": "check", "name": "Spices: cumin, chili powder, oregano, paprika, garlic & onion powder, steak seasoning, bay leaves, ginger", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["guisada", "steakbites", "carneasada", "chickentinga", "ovenburgers", "bakedziti"]},
    {"id": "basics", "section": "check", "name": "Oil, flour, cornstarch, salt, pepper, Worcestershire, ketchup, mustard, pickles", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["guisada", "steakbites", "ovenburgers", "potroast"]},
    {"id": "eggs", "section": "dairy", "name": "Eggs", "qty": "5 dozen (breakfasts both weeks + meatloaf)", "est": 15, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "milk", "section": "dairy", "name": "Milk", "qty": "4 gallons (check dates; open the 2nd pair in week 2)", "est": 16, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "yogurt", "section": "dairy", "name": "Yogurt", "qty": "2 large tubs", "est": 7, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "string-cheese", "section": "dairy", "name": "String cheese", "qty": "24 count", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "butter", "section": "dairy", "name": "Butter", "qty": "1 lb", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "deli", "section": "meat", "name": "Sliced deli turkey or ham (lunches)", "qty": "3 lb — freeze 1 lb for week 2", "est": 15, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "bread", "section": "bakery", "name": "Sandwich bread", "qty": "3 loaves — freeze 1 for week 2", "est": 9, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "bananas", "section": "produce", "name": "Bananas", "qty": "2 bunches (1 green)", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "apples", "section": "produce", "name": "Apples", "qty": "5 lb bag", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "berries", "section": "produce", "name": "Grapes or strawberries", "qty": "whatever is on sale", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "pb-jam", "section": "canned", "name": "Peanut butter and jam", "qty": "1 large jar each", "est": 7, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "cereal", "section": "pantry", "name": "Cereal", "qty": "2 family-size boxes", "est": 10, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "oatmeal", "section": "pantry", "name": "Oatmeal", "qty": "1 large canister", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "pantry-topups", "section": "pantry", "name": "Pantry top-ups (oil, any spice you are out of, coffee)", "qty": "as needed", "est": 15, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "backup-frozen", "section": "frozen", "name": "Backup for a crazy night: frozen pizzas or burritos", "qty": "2 pizzas or 1 bag", "est": 12, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "granola", "section": "snacks", "name": "Granola bars", "qty": "big box", "est": 9, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "chips", "section": "snacks", "name": "Tortilla chips", "qty": "big bag", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "crackers", "section": "snacks", "name": "Crackers, pretzels or popcorn", "qty": "1–2 boxes", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true}
  ];

  // Week 2: dinners only. Meat here is frozen on shopping day (see each item's qty).
  var week2Items = [
    {"id": "stew-meat", "section": "meat", "name": "Beef stew meat (carne para guisar)", "qty": "2.5 lb — FREEZE on shopping day", "est": 24, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chilecolorado"]},
    {"id": "chicken-breast", "section": "meat", "name": "Boneless skinless chicken breasts", "qty": "2.5 lb — FREEZE on shopping day", "est": 11, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas"]},
    {"id": "ground-beef", "section": "meat", "name": "Ground beef (80/20)", "qty": "4.5 lb (burrito bake 2, meatloaf 2.5) — FREEZE in 2 bags", "est": 33, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake", "meatloaf"]},
    {"id": "chuck-roast", "section": "meat", "name": "Boneless beef chuck roast", "qty": "5.5 lb: one 3 lb roast (barbacoa) + 2.5 lb sliced thin (beef & broccoli) — FREEZE in 2 bags", "est": 53, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "beefbroccoli"]},
    {"id": "beef-shank", "section": "meat", "name": "Bone-in beef shank (chamorro)", "qty": "3.5 lb — FREEZE", "est": 27, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["caldores"]},
    {"id": "onions", "section": "produce", "name": "Onions (yellow or white)", "qty": "7 onions", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "chickenfajitas", "burritobake", "caldores", "chilecolorado"]},
    {"id": "garlic", "section": "produce", "name": "Garlic", "qty": "2 heads", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "beefbroccoli", "caldores", "chilecolorado"]},
    {"id": "bell-peppers", "section": "produce", "name": "Bell peppers (any color)", "qty": "3 — keep in the crisper drawer", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas"]},
    {"id": "potatoes", "section": "produce", "name": "Potatoes (red or yellow)", "qty": "about 3.5 lb (meatloaf 2, caldo 3 potatoes) — one 5 lb bag", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf", "caldores"]},
    {"id": "baby-carrots", "section": "produce", "name": "Baby carrots", "qty": "2 lb", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf", "caldores"]},
    {"id": "limes", "section": "produce", "name": "Limes", "qty": "6 (they keep 2+ weeks in the fridge)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "chickenfajitas", "caldores"]},
    {"id": "cilantro", "section": "produce", "name": "Cilantro", "qty": "2 bunches — stand stems in a jar of water in the fridge", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "caldores"]},
    {"id": "iceberg", "section": "produce", "name": "Iceberg lettuce", "qty": "1 whole head (keeps about 2 weeks)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "cabbage", "section": "produce", "name": "Green cabbage", "qty": "1 small head", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["caldores"]},
    {"id": "mexican-cheese", "section": "dairy", "name": "Shredded Mexican-blend cheese", "qty": "2 lb bag", "est": 9, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas", "burritobake"]},
    {"id": "sour-cream", "section": "dairy", "name": "Sour cream", "qty": "16 oz (check the date: good 2+ weeks)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas", "burritobake"]},
    {"id": "flour-tortillas", "section": "bakery", "name": "Flour tortillas (taco size)", "qty": "2 packs of 20", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas", "chilecolorado"]},
    {"id": "burrito-tortillas", "section": "bakery", "name": "Burrito-size flour tortillas", "qty": "1 pack of 8–10", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "corn-tortillas", "section": "bakery", "name": "Corn tortillas", "qty": "1 pack (30) — FREEZE it on shopping day", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "caldores"]},
    {"id": "tomato-sauce", "section": "canned", "name": "Tomato sauce", "qty": "1 can (8 oz)", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["caldores"]},
    {"id": "chipotle", "section": "canned", "name": "Chipotle peppers in adobo", "qty": "1 small can", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa"]},
    {"id": "refried", "section": "canned", "name": "Refried beans", "qty": "3 cans", "est": 7, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake", "chilecolorado"]},
    {"id": "enchilada", "section": "canned", "name": "Red enchilada sauce", "qty": "1 large can (19 oz)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "red-chile", "section": "canned", "name": "Red chile sauce (Las Palmas)", "qty": "1 can (28 oz)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chilecolorado"]},
    {"id": "salsa", "section": "canned", "name": "Salsa", "qty": "1 jar (24 oz)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "chickenfajitas"]},
    {"id": "soy-sauce", "section": "canned", "name": "Soy sauce (low sodium)", "qty": "1 bottle (15 oz)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beefbroccoli"]},
    {"id": "taco-seasoning", "section": "pantry", "name": "Taco seasoning", "qty": "1 packet", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "brown-sugar", "section": "pantry", "name": "Brown sugar", "qty": "2 lb bag", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beefbroccoli", "meatloaf"]},
    {"id": "breadcrumbs", "section": "pantry", "name": "Plain breadcrumbs", "qty": "1 canister", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf"]},
    {"id": "broccoli", "section": "frozen", "name": "Frozen broccoli florets", "qty": "2 lb", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["beefbroccoli"]},
    {"id": "corn-cob", "section": "frozen", "name": "Frozen corn on the cob", "qty": "1 pack (4–6 pieces)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["caldores"]},
    {"id": "spices", "section": "check", "name": "Spices: cumin, chili powder, oregano, paprika, garlic & onion powder, steak seasoning, bay leaves, ginger", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["barbacoa", "chickenfajitas", "beefbroccoli", "meatloaf", "caldores", "chilecolorado"]},
    {"id": "basics", "section": "check", "name": "Oil, flour, cornstarch, salt, pepper, Worcestershire, ketchup, mustard, sesame oil", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["beefbroccoli", "meatloaf", "chilecolorado"]}
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
      note: "One list for both weeks, so you shop once. Items used in both weeks are on one line with each week’s amount, and their estimates are added together. MEAT ON SHOPPING DAY: keep only the Week 1 stew meat (Mon), sirloin (Tue) and carne asada (Wed) in the fridge. Freeze everything else the same day, flat in zip bags labeled with the dinner name. Thaw each one in the fridge the night before (a full day ahead for roasts and the beef shank). If you cook out of order, any ground beef, stew meat or chicken you will not cook within 2 days goes in the freezer. Includes breakfasts, lunches and snacks for 5 for both weeks. Prices are realistic Downey-area estimates (Nov 2026), not sale prices.",
      items: tripItems
    }
  };

  var weeks = {
    '1': {
      label: 'Week 1',
      note: 'Week 1 dinners plus breakfasts, lunches and snacks for both weeks. Prices are Downey-area estimates.',
      dinners: [
        {"day": "Mon", "meal": "guisada", "title": "Crockpot Carne Guisada", "detail": "crockpot — meat from the fridge"},
        {"day": "Tue", "meal": "steakbites", "title": "Sheet-Pan Steak Bites with Potatoes and Green Beans", "detail": "sheet pan — meat from the fridge"},
        {"day": "Wed", "meal": "carneasada", "title": "Oven Carne Asada Tacos", "detail": "oven broiler — meat from the fridge"},
        {"day": "Thu", "meal": "chickentinga", "title": "Crockpot Chicken Tinga Tostadas", "detail": "crockpot — thaw chicken Wed night"},
        {"day": "Fri", "meal": "ovenburgers", "title": "Sheet-Pan Oven Cheeseburgers and Fries", "detail": "sheet pan — thaw beef Thu night"},
        {"day": "Sat", "meal": "potroast", "title": "Crockpot Pot Roast with Potatoes and Carrots", "detail": "crockpot — thaw roast Fri morning"},
        {"day": "Sun", "meal": "bakedziti", "title": "Baked Ziti with Beef", "detail": "oven — thaw beef Sat night"}
      ],
      items: week1Items
    },
    '2': {
      label: 'Week 2',
      note: 'Week 2 dinners. All week 2 meat is frozen on shopping day; each recipe says when to move it to the fridge.',
      dinners: [
        {"day": "Mon", "meal": "barbacoa", "title": "Crockpot Beef Barbacoa Tacos", "detail": "crockpot — thaw roast Sun morning"},
        {"day": "Tue", "meal": "chickenfajitas", "title": "Sheet-Pan Chicken Fajitas", "detail": "sheet pan — thaw chicken Mon night"},
        {"day": "Wed", "meal": "burritobake", "title": "Beef and Bean Burrito Bake", "detail": "oven — thaw beef Tue night"},
        {"day": "Thu", "meal": "beefbroccoli", "title": "Crockpot Beef and Broccoli", "detail": "crockpot — thaw beef Wed morning"},
        {"day": "Fri", "meal": "meatloaf", "title": "Sheet-Pan Mini Meatloaves with Potatoes and Carrots", "detail": "sheet pan — thaw beef Thu night"},
        {"day": "Sat", "meal": "caldores", "title": "Crockpot Caldo de Res (Beef Soup)", "detail": "crockpot — thaw shank Fri morning"},
        {"day": "Sun", "meal": "chilecolorado", "title": "Crockpot Chile Colorado (Beef in Red Chile)", "detail": "crockpot — thaw beef Sat night"}
      ],
      items: week2Items
    }
  };

  return { version: 4, source: 'Tamayo 2-week beef-forward plan (Nov 21, 2026)', defaultBudget: 650, sections: sections, meals: meals, weeks: weeks, lists: lists, listKey: 'trip2' };
});
