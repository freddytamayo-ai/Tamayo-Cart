/* Tamayo Cart — meal plan data. Edit this file to change the plan; nothing else needs to change.
 * Plan of Nov 21, 2026 (rev. t826u): each week has 5 cooked dinners + 2 leftover nights. The dinner before each
 * leftover night is a double batch. 10 cooked dinners: 9 beef (ground beef, stew meat, chuck roast, sirloin,
 * carne asada steak) + 1 chicken. Every dinner feeds exactly 5, all bought in ONE trip. Leftover nights are their own
 * meals (ids 'lo-*') so the shared Made it check works on them. Meat cooked after Week 1 Wednesday is frozen on shopping day.
 * All prices are realistic Downey-area estimates (BLS West-region Oct 2026 beef averages, the Nov 10, 2026
 * El Super receipt, rounded up). Not sale prices.
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
    {"id": "carneasada", "name": "Oven Carne Asada Tacos", "method": "Oven broiler", "hands": 15, "time": "About 25 min (plus marinating)", "cost": 44, "ingredients": "2.5 lb thin carne asada steak (flap meat / ranchera or skirt); Juice of 2 oranges and 2 limes; 3 garlic cloves, minced; 2 Tbsp oil; 1 tsp cumin, 1 tsp chili powder, 1.5 tsp salt; 20 corn tortillas; 1 white onion and 1 bunch cilantro, chopped; 2 avocados, sliced; Salsa and lime wedges."},
    {"id": "steakbites", "name": "Sheet-Pan Steak Bites with Potatoes and Green Beans", "method": "Sheet pan", "hands": 15, "time": "About 40 min", "cost": 40, "ingredients": "2.5 lb top sirloin steak, cut in 1-inch cubes; 2 lb small red potatoes, cut in quarters; 1 lb fresh green beans, ends snapped off; 3 Tbsp oil; 2 tsp steak seasoning (or 1 tsp salt, 1 tsp pepper, 1 tsp garlic powder); 1 tsp salt for the vegetables; 3 garlic cloves, minced; 2 Tbsp butter."},
    {"id": "potroast", "name": "Crockpot Pot Roast with Potatoes and Carrots (double batch)", "method": "Crockpot", "hands": 20, "time": "9–10 hr on LOW or 6 hr on HIGH", "cost": 45, "ingredients": "6 lb boneless beef chuck roast (2 roasts, about 3 lb each) — double batch, save half for Thursday; 4 lb potatoes, cut in big chunks; 2 lb baby carrots; 2 onions, cut in wedges; 2 packets dry onion soup mix; 2 cups water + 2 tsp beef bouillon; 2 Tbsp Worcestershire sauce (optional); 1 tsp pepper; 3 Tbsp cornstarch + 3 Tbsp cold water (for gravy)."},
    {"id": "lo-potroast", "name": "Leftovers: Pot Roast", "method": "Leftovers", "hands": 5, "time": "About 15–30 min", "cost": 30, "ingredients": "Saved half of Wednesday’s pot roast, vegetables and gravy; 1/2 cup water."},
    {"id": "guisada", "name": "Crockpot Carne Guisada", "method": "Crockpot", "hands": 15, "time": "8 hr on LOW or 4–5 hr on HIGH", "cost": 44, "ingredients": "2.5 lb beef stew meat (carne para guisar); 2 Tbsp flour; 1 onion, diced; 1 green bell pepper, diced; 4 garlic cloves, minced; 1 can (8 oz) tomato sauce; 1 cup water + 1 tsp beef bouillon; 2 tsp cumin, 1 tsp chili powder, 1 tsp oregano; 1 tsp salt, 1/2 tsp pepper; 2 cups white rice (makes rice for 5); 10 flour tortillas."},
    {"id": "bakedziti", "name": "Baked Ziti with Beef (double batch, 2 pans)", "method": "Oven bake", "hands": 30, "time": "About 1 hr", "cost": 50, "ingredients": "4 lb ground beef — double batch, save one pan for Sunday; 2 lb ziti or penne pasta; 4 jars (24 oz each) marinara sauce; 2 tsp garlic powder, 2 tsp Italian seasoning or oregano, 1 tsp salt; 4 cups shredded mozzarella; 1 cup grated parmesan; 1 bag salad and 1 loaf French bread tonight (another of each for Sunday)."},
    {"id": "lo-bakedziti", "name": "Leftovers: Baked Ziti", "method": "Leftovers", "hands": 5, "time": "About 15–30 min", "cost": 22, "ingredients": "The second (unbaked) pan of ziti saved Saturday; 1 bag salad and 1 loaf French bread."},
    {"id": "barbacoa", "name": "Crockpot Beef Barbacoa Tacos (double batch)", "method": "Crockpot", "hands": 20, "time": "9–10 hr on LOW or 6 hr on HIGH", "cost": 43, "ingredients": "6 lb boneless beef chuck roast, cut in 8 big pieces — double batch, save half for Tuesday; 2 onions, chopped; 8 garlic cloves; 5 chipotle peppers in adobo + 3 Tbsp of the sauce; Juice of 4 limes; 1 cup water + 1 tsp beef bouillon; 2 Tbsp cumin, 2 Tbsp oregano, 1 Tbsp salt; 3 bay leaves; 20 corn tortillas for tonight; Chopped onion, cilantro, salsa and lime wedges."},
    {"id": "lo-barbacoa", "name": "Leftovers: Barbacoa Tacos", "method": "Leftovers", "hands": 5, "time": "About 15–30 min", "cost": 37, "ingredients": "Saved half of Monday’s barbacoa with its juices; 20 corn tortillas; Chopped onion, cilantro, salsa and lime wedges."},
    {"id": "chickenfajitas", "name": "Sheet-Pan Chicken Fajitas", "method": "Sheet pan", "hands": 15, "time": "About 40 min", "cost": 29, "ingredients": "2.5 lb boneless skinless chicken breasts, cut in thin strips; 3 bell peppers, sliced; 2 onions, sliced; 3 Tbsp oil; 2 tsp chili powder, 1 tsp cumin, 1 tsp paprika, 1 tsp garlic powder, 1.5 tsp salt; 2 limes; 20 flour tortillas; Shredded cheese, sour cream and salsa."},
    {"id": "burritobake", "name": "Beef and Bean Burrito Bake", "method": "Oven bake", "hands": 20, "time": "About 45 min", "cost": 38, "ingredients": "2 lb ground beef; 1 onion, diced; 1 packet taco seasoning + 2/3 cup water; 1 can (16 oz) refried beans; 8 burrito-size flour tortillas; 1 large can (19 oz) red enchilada sauce; 3 cups shredded Mexican-blend cheese; Shredded lettuce and sour cream."},
    {"id": "meatloaf", "name": "Sheet-Pan Mini Meatloaves with Potatoes and Carrots", "method": "Sheet pan", "hands": 20, "time": "About 45 min", "cost": 28, "ingredients": "2.5 lb ground beef; 2 eggs; 3/4 cup breadcrumbs; 1/2 cup milk; 1 Tbsp onion powder, 1 tsp garlic powder, 1.5 tsp salt, 1/2 tsp pepper; 1 Tbsp Worcestershire sauce (optional); Glaze: 3/4 cup ketchup, 2 Tbsp brown sugar, 1 Tbsp mustard; 2 lb potatoes, cut in 1-inch cubes; 1 lb baby carrots; 2 Tbsp oil."},
    {"id": "chilecolorado", "name": "Crockpot Chile Colorado (double batch)", "method": "Crockpot", "hands": 15, "time": "8–9 hr on LOW or 5 hr on HIGH", "cost": 41, "ingredients": "5 lb beef stew meat — double batch, save half for Sunday; 1/4 cup flour; 2 tsp cumin, 2 tsp oregano, 2 tsp salt; 2 onions, diced; 6 garlic cloves, minced; 2 cans (28 oz each) red chile sauce (like Las Palmas); 2 cups white rice (tonight); 2 cans refried beans, warmed (tonight); 10 flour tortillas (tonight)."},
    {"id": "lo-chilecolorado", "name": "Leftovers: Chile Colorado", "method": "Leftovers", "hands": 5, "time": "About 15–30 min", "cost": 30, "ingredients": "Saved half of Saturday’s chile colorado; 2 cups white rice; 2 cans refried beans; 10 flour tortillas."}
  ];

  // Week 1: dinners Mon–Sun plus breakfasts, lunches and snacks for 5 for BOTH weeks (bought in the same trip).
  var week1Items = [
    {"id": "carne-asada", "section": "meat", "name": "Carne asada steak (flap meat / ranchera, or skirt)", "qty": "2.5 lb — keep in FRIDGE, cook Mon", "est": 25, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "top-sirloin", "section": "meat", "name": "Top sirloin steak", "qty": "2.5 lb — keep in FRIDGE, cook Tue", "est": 32, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["steakbites"]},
    {"id": "chuck-roast", "section": "meat", "name": "Boneless beef chuck roast", "qty": "6 lb (2 roasts, pot roast double batch) — keep in FRIDGE, cook Wed", "est": 59, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast", "lo-potroast"]},
    {"id": "stew-meat", "section": "meat", "name": "Beef stew meat (carne para guisar)", "qty": "2.5 lb — FREEZE on shopping day", "est": 24, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "ground-beef", "section": "meat", "name": "Ground beef (80/20)", "qty": "4 lb (baked ziti double batch) — FREEZE in 2 bags", "est": 30, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti", "lo-bakedziti"]},
    {"id": "onions", "section": "produce", "name": "Onions (yellow or white)", "qty": "5 onions", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada", "potroast", "guisada"]},
    {"id": "garlic", "section": "produce", "name": "Garlic", "qty": "2 heads", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada", "steakbites", "guisada"]},
    {"id": "green-pepper", "section": "produce", "name": "Green bell pepper", "qty": "1", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "potatoes", "section": "produce", "name": "Potatoes (red or yellow)", "qty": "6 lb (steak bites 2, pot roast 4)", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["steakbites", "potroast"]},
    {"id": "green-beans", "section": "produce", "name": "Fresh green beans", "qty": "1 lb", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["steakbites"]},
    {"id": "baby-carrots", "section": "produce", "name": "Baby carrots", "qty": "2 lb (pot roast double batch)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast"]},
    {"id": "limes", "section": "produce", "name": "Limes", "qty": "4", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "oranges", "section": "produce", "name": "Oranges", "qty": "2 (carne asada marinade)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "cilantro", "section": "produce", "name": "Cilantro", "qty": "1 bunch", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "avocados", "section": "produce", "name": "Avocados", "qty": "2–3", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "salad", "section": "produce", "name": "Bagged salad", "qty": "2 large bags (ziti night + leftover night)", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti", "lo-bakedziti"]},
    {"id": "mozzarella", "section": "dairy", "name": "Shredded mozzarella", "qty": "1 lb bag (4 cups)", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "parmesan", "section": "dairy", "name": "Grated parmesan", "qty": "8 oz container", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "flour-tortillas", "section": "bakery", "name": "Flour tortillas (taco size)", "qty": "20-count", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "corn-tortillas", "section": "bakery", "name": "Corn tortillas", "qty": "1 pack (30)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "french-bread", "section": "bakery", "name": "French bread", "qty": "2 loaves (ziti night + leftover night)", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti", "lo-bakedziti"]},
    {"id": "tomato-sauce", "section": "canned", "name": "Tomato sauce", "qty": "1 can (8 oz)", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "marinara", "section": "canned", "name": "Marinara sauce", "qty": "4 jars (24 oz)", "est": 14, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "salsa", "section": "canned", "name": "Salsa", "qty": "1 jar (24 oz)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["carneasada"]},
    {"id": "bouillon", "section": "pantry", "name": "Beef bouillon (Knorr caldo de res)", "qty": "1 jar — makes the broth for both weeks (1 tsp + 1 cup water = 1 cup broth)", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada", "potroast"]},
    {"id": "onion-soup", "section": "pantry", "name": "Dry onion soup mix", "qty": "2 packets", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["potroast"]},
    {"id": "rice", "section": "pantry", "name": "Long-grain white rice", "qty": "10 lb bag (dinners both weeks + lunches)", "est": 9, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["guisada"]},
    {"id": "pasta", "section": "pantry", "name": "Ziti or penne pasta", "qty": "2 lb", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["bakedziti"]},
    {"id": "spices", "section": "check", "name": "Spices: cumin, chili powder, oregano, paprika, garlic & onion powder, steak seasoning, Italian seasoning, bay leaves", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["guisada", "steakbites", "carneasada", "bakedziti"]},
    {"id": "basics", "section": "check", "name": "Oil, flour, cornstarch, salt, pepper, Worcestershire", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["guisada", "steakbites", "potroast"]},
    {"id": "eggs", "section": "dairy", "name": "Eggs", "qty": "5 dozen (breakfasts both weeks + meatloaf)", "est": 15, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "milk", "section": "dairy", "name": "Milk", "qty": "4 gallons (check dates; open the 2nd pair in week 2)", "est": 16, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "yogurt", "section": "dairy", "name": "Yogurt", "qty": "2 large tubs", "est": 7, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "string-cheese", "section": "dairy", "name": "String cheese", "qty": "24 count", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
    {"id": "american-cheese", "section": "dairy", "name": "American cheese slices (lunches)", "qty": "1 pack", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true},
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
    {"id": "chuck-roast", "section": "meat", "name": "Boneless beef chuck roast", "qty": "6 lb (barbacoa double batch) — FREEZE in 2 bags", "est": 59, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "lo-barbacoa"]},
    {"id": "stew-meat", "section": "meat", "name": "Beef stew meat (carne para guisar)", "qty": "5 lb (chile colorado double batch) — FREEZE in 2 bags", "est": 48, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chilecolorado", "lo-chilecolorado"]},
    {"id": "ground-beef", "section": "meat", "name": "Ground beef (80/20)", "qty": "4.5 lb (burrito bake 2, meatloaf 2.5) — FREEZE in 2 bags", "est": 33, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake", "meatloaf"]},
    {"id": "chicken-breast", "section": "meat", "name": "Boneless skinless chicken breasts", "qty": "2.5 lb — FREEZE on shopping day", "est": 11, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas"]},
    {"id": "onions", "section": "produce", "name": "Onions (yellow or white)", "qty": "8 onions", "est": 5, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "chickenfajitas", "burritobake", "chilecolorado"]},
    {"id": "garlic", "section": "produce", "name": "Garlic", "qty": "3 heads", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "chilecolorado"]},
    {"id": "bell-peppers", "section": "produce", "name": "Bell peppers (any color)", "qty": "3 — keep in the crisper drawer", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas"]},
    {"id": "potatoes", "section": "produce", "name": "Potatoes (red or yellow)", "qty": "2 lb (meatloaf)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf"]},
    {"id": "baby-carrots", "section": "produce", "name": "Baby carrots", "qty": "1 lb", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf"]},
    {"id": "limes", "section": "produce", "name": "Limes", "qty": "8 (they keep 2+ weeks in the fridge)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "lo-barbacoa", "chickenfajitas"]},
    {"id": "cilantro", "section": "produce", "name": "Cilantro", "qty": "2 bunches — stand stems in a jar of water in the fridge", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "lo-barbacoa"]},
    {"id": "iceberg", "section": "produce", "name": "Iceberg lettuce", "qty": "1 whole head (keeps about 2 weeks)", "est": 2, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "mexican-cheese", "section": "dairy", "name": "Shredded Mexican-blend cheese", "qty": "2 lb bag", "est": 9, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas", "burritobake"]},
    {"id": "sour-cream", "section": "dairy", "name": "Sour cream", "qty": "16 oz (check the date: good 2+ weeks)", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas", "burritobake"]},
    {"id": "flour-tortillas", "section": "bakery", "name": "Flour tortillas (taco size)", "qty": "2 packs of 20", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chickenfajitas", "chilecolorado", "lo-chilecolorado"]},
    {"id": "burrito-tortillas", "section": "bakery", "name": "Burrito-size flour tortillas", "qty": "1 pack of 8–10", "est": 4, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "corn-tortillas", "section": "bakery", "name": "Corn tortillas", "qty": "2 packs (30 each) — FREEZE on shopping day", "est": 6, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "lo-barbacoa"]},
    {"id": "chipotle", "section": "canned", "name": "Chipotle peppers in adobo", "qty": "1 small can (7 oz)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa"]},
    {"id": "refried", "section": "canned", "name": "Refried beans", "qty": "5 cans", "est": 11, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake", "chilecolorado", "lo-chilecolorado"]},
    {"id": "enchilada", "section": "canned", "name": "Red enchilada sauce", "qty": "1 large can (19 oz)", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "red-chile", "section": "canned", "name": "Red chile sauce (Las Palmas)", "qty": "2 cans (28 oz)", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["chilecolorado"]},
    {"id": "salsa", "section": "canned", "name": "Salsa", "qty": "2 jars (24 oz)", "est": 8, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["barbacoa", "lo-barbacoa", "chickenfajitas"]},
    {"id": "taco-seasoning", "section": "pantry", "name": "Taco seasoning", "qty": "1 packet", "est": 1, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["burritobake"]},
    {"id": "brown-sugar", "section": "pantry", "name": "Brown sugar", "qty": "2 lb bag", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf"]},
    {"id": "breadcrumbs", "section": "pantry", "name": "Plain breadcrumbs", "qty": "1 canister", "est": 3, "basis": "estimate: Downey/SoCal price, Nov 2026", "estimate": true, "for": ["meatloaf"]},
    {"id": "spices", "section": "check", "name": "Spices: cumin, chili powder, oregano, paprika, garlic & onion powder, bay leaves", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["barbacoa", "chickenfajitas", "meatloaf", "chilecolorado"]},
    {"id": "basics", "section": "check", "name": "Oil, flour, salt, pepper, Worcestershire, ketchup, mustard", "qty": "check you have them", "est": null, "basis": "on hand", "estimate": true, "for": ["meatloaf", "chilecolorado"]}
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
      note: "One list for both weeks, so you shop once. Items used in both weeks are on one line with each week’s amount, and their estimates are added together. 5 cooked dinners + 2 leftover nights each week: the dinner before each leftover night is a DOUBLE BATCH (amounts on this list are already doubled). MEAT ON SHOPPING DAY: keep only the Week 1 carne asada (Mon), sirloin (Tue) and chuck roast (Wed) in the fridge. Freeze everything else the same day, flat in zip bags labeled with the dinner name. Thaw each one in the fridge as its recipe says (the night before; a full day or more for roasts). If you cook out of order, any ground beef, stew meat or chicken you will not cook within 2 days goes in the freezer. Includes breakfasts, lunches and snacks for 5 for both weeks. Prices are realistic Downey-area estimates (Nov 2026), not sale prices.",
      items: tripItems
    }
  };

  var weeks = {
    '1': {
      label: 'Week 1',
      note: 'Week 1 dinners plus breakfasts, lunches and snacks for both weeks. Prices are Downey-area estimates.',
      dinners: [
        {"day": "Mon", "meal": "carneasada", "title": "Oven Carne Asada Tacos", "detail": "oven broiler — meat from the fridge"},
        {"day": "Tue", "meal": "steakbites", "title": "Sheet-Pan Steak Bites with Potatoes and Green Beans", "detail": "sheet pan — meat from the fridge"},
        {"day": "Wed", "meal": "potroast", "title": "Crockpot Pot Roast with Potatoes and Carrots (double batch)", "detail": "crockpot — DOUBLE BATCH, save half for Thu — roast from the fridge"},
        {"day": "Thu", "meal": "lo-potroast", "title": "Leftovers: Pot Roast", "detail": "leftovers — reheat Wed’s double batch"},
        {"day": "Fri", "meal": "guisada", "title": "Crockpot Carne Guisada", "detail": "crockpot — thaw stew meat Thu night"},
        {"day": "Sat", "meal": "bakedziti", "title": "Baked Ziti with Beef (double batch, 2 pans)", "detail": "oven — DOUBLE BATCH, save one pan for Sun — thaw beef Fri night"},
        {"day": "Sun", "meal": "lo-bakedziti", "title": "Leftovers: Baked Ziti", "detail": "leftovers — bake Sat’s second pan"}
      ],
      items: week1Items
    },
    '2': {
      label: 'Week 2',
      note: 'Week 2 dinners. All week 2 meat is frozen on shopping day; each recipe says when to move it to the fridge.',
      dinners: [
        {"day": "Mon", "meal": "barbacoa", "title": "Crockpot Beef Barbacoa Tacos (double batch)", "detail": "crockpot — DOUBLE BATCH, save half for Tue — thaw roast Sat morning"},
        {"day": "Tue", "meal": "lo-barbacoa", "title": "Leftovers: Barbacoa Tacos", "detail": "leftovers — reheat Mon’s double batch"},
        {"day": "Wed", "meal": "chickenfajitas", "title": "Sheet-Pan Chicken Fajitas", "detail": "sheet pan — thaw chicken Tue night"},
        {"day": "Thu", "meal": "burritobake", "title": "Beef and Bean Burrito Bake", "detail": "oven — thaw beef Wed night"},
        {"day": "Fri", "meal": "meatloaf", "title": "Sheet-Pan Mini Meatloaves with Potatoes and Carrots", "detail": "sheet pan — thaw beef Thu night"},
        {"day": "Sat", "meal": "chilecolorado", "title": "Crockpot Chile Colorado (double batch)", "detail": "crockpot — DOUBLE BATCH, save half for Sun — thaw beef Thu night"},
        {"day": "Sun", "meal": "lo-chilecolorado", "title": "Leftovers: Chile Colorado", "detail": "leftovers — reheat Sat’s double batch"}
      ],
      items: week2Items
    }
  };

  return { version: 4, source: 'Tamayo 2-week beef-forward plan (Nov 21, 2026)', defaultBudget: 650, sections: sections, meals: meals, weeks: weeks, lists: lists, listKey: 'trip2' };
});
