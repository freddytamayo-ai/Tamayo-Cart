/* Tamayo Cart — meal plan data. Edit this file to change the plan; nothing else needs to change.
 * Source: the "Tamayo Weeknight Meals: Easy Dinners Anyone Can Make" Page (19 dinners, a 2-week plan,
 * and a week 1 grocery list), scaled so every dinner feeds exactly 5. All prices are rough Downey-area estimates from that Page.
 *
 * Shape:
 *   sections: ordered store sections   { id, label, icon }
 *   meals:    the 19 dinners            { id, name, method, hands (min), time, cost ($ for 5, estimate), ingredients }
 *   weeks:    { '1': { label, note, dinners: [{ day, meal (meal id or null), title }], items: [...] }, '2': {...} }
 *   item:     { id (stable, unique per week), name, qty, section, est ($ or null = check pantry), basis?, for? }
 * Item ids are saved with check-offs in localStorage, so keep them stable when you edit names or prices.
 * Bump `version` when you change the lists. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TamayoMeals = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var sections = [
    { id: 'produce', label: 'Produce', icon: '🥬' },
    { id: 'meat', label: 'Meat & poultry', icon: '🍗' },
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
    { id: 'salsabeef', name: 'One-Pot Salsa Beef', method: 'One pot', hands: 10, time: 'About 25 min', cost: 14, ingredients: '1 lb ground beef, 1 jar salsa (16 oz), chili powder, garlic powder, onion powder. Serve with tortillas or rice, beans, cheese, lettuce.' },
    { id: 'tingabeef', name: 'One-Pot Beef Tinga', method: 'One pot', hands: 10, time: 'About 30 min', cost: 15, ingredients: '1 lb ground beef, 1 onion (diced), 4 garlic cloves or 1 Tbsp jarred garlic, cumin, oregano, salt, pepper, 1 can fire-roasted diced tomatoes, 2 chipotle peppers in adobo plus 1 Tbsp of the sauce. Tostadas, lettuce, crema, avocado.' },
    { id: 'carnitas', name: 'Slow Cooker Carnitas', method: 'Crockpot', hands: 15, time: 'About 4–5 hr on HIGH', cost: 16, ingredients: '2 lb pork butt or shoulder (ask the meat counter to cut it into chunks, or buy pre-cut carnitas meat), 1 onion, 4 garlic cloves, 2 cinnamon sticks, oregano, cumin, salt, pepper, chipotle powder, 2 oranges. Corn tortillas, onion, cilantro, lime.' },
    { id: 'pozole', name: 'Slow Cooker Chicken Pozole Verde', method: 'Crockpot', hands: 10, time: 'About 8.5 hr on LOW or 4–4.5 hr on HIGH', cost: 19, ingredients: '1.5 lb boneless chicken thighs, 1 white onion, 1 poblano (seeded, chopped), chili powder, 16 oz jar salsa verde, 2 cups water, 2 cans hominy (drained, rinsed), cilantro, 1 lime. Shredded cabbage and tostadas on the side.' },
    { id: 'tacobeef', name: 'Shredded Taco Beef', method: 'Crockpot', hands: 10, time: 'About 6–8 hr on LOW', cost: 26, ingredients: '1.5 lb boneless beef chuck or shoulder roast (ask for it cut in chunks), chili powder, cumin, oregano, red pepper flakes, salt, 3 garlic cloves. Tortillas and toppings.' },
    { id: 'bbqbeef', name: 'One-Pot BBQ Beef Sandwiches', method: 'One pot', hands: 10, time: 'About 25 min', cost: 14, ingredients: '1.25 lb ground beef, smoked paprika, garlic powder, salt, pepper, one large bottle BBQ sauce. Hamburger buns (use 5 from a pack of 8) and bagged coleslaw mix.' },
    { id: 'whitechili', name: 'Crockpot White Chicken Chili', method: 'Crockpot', hands: 10, time: '4 hr on HIGH or 8 hr on LOW', cost: 15, ingredients: '1 onion, 2 garlic cloves, 1.5 lb chicken breast, 2 cans cannellini beans, 1 can pinto beans, cumin, oregano, pepper, 16 oz jar salsa verde, 2 cups chicken broth. Shredded cheese and tortilla chips on top.' },
    { id: 'beeftacosoup', name: 'Crockpot Beef Taco Soup', method: 'Crockpot', hands: 10, time: '3–4 hr on HIGH or 6–8 hr on LOW', cost: 13, ingredients: '1 lb ground beef, 1 onion, 2 garlic cloves, chili powder, cumin, smoked paprika, 1 can fire-roasted tomatoes, 1 can diced tomatoes with green chiles, 1 can black beans, 1 cup frozen corn, 4 cups beef broth. Tortilla chips, avocado, sour cream, lime.' },
    { id: 'teriyaki', name: 'Slow Cooker Pineapple Teriyaki Chicken', method: 'Crockpot', hands: 10, time: '4 hr on HIGH or 8 hr on LOW', cost: 15, ingredients: '20 oz can pineapple chunks in juice, 1/4 cup soy sauce, 2 Tbsp brown sugar, 2 garlic cloves, 1 tsp grated ginger, 5–6 skinless chicken thighs, 1.5 Tbsp cornstarch, green onions, rice.' },
    { id: 'chili', name: 'Crockpot Chili', method: 'Crockpot', hands: 10, time: '3–4 hr on HIGH or 6–8 hr on LOW', cost: 19, ingredients: '1 lb ground beef, onion, green bell pepper, garlic, tomato paste, 2 cans diced tomatoes (one with green chiles), kidney and pinto beans, 1 cup beef broth, chili powder, cumin, garlic and onion powder, brown sugar, salt, pepper.' },
    { id: 'fajitas', name: 'Sheet Pan Chicken Fajitas', method: 'Sheet pan', hands: 15, time: 'About 55 min', cost: 18, ingredients: '1.5 lb chicken breast (pre-cut stir-fry strips skip knife work), 3–4 bell peppers, 2 onions (or pre-sliced fajita veggies), chili powder, paprika, onion and garlic powder, cumin, salt, sugar (or a fajita packet), oil, lime, tortillas, sour cream.' },
    { id: 'kielbasa', name: 'Sheet Pan Kielbasa, Potatoes and Green Beans', method: 'Sheet pan', hands: 10, time: 'About 45 min', cost: 16, ingredients: '2 lb small red potatoes, 2 packs kielbasa (already cooked), 1 onion, 1 lb frozen green beans, olive oil, steak seasoning.' },
    { id: 'honeymustard', name: 'Sheet Pan Honey Mustard Chicken and Veggies', method: 'Sheet pan', hands: 15, time: 'About 45 min', cost: 14, ingredients: 'Mayo, Dijon and yellow mustard, honey, cider vinegar, garlic powder, paprika, salt, pepper; 2 lb boneless chicken thighs, 1.5 lb red potatoes, red onion, about 12 oz green beans and 8 oz baby carrots, oil.' },
    { id: 'drumsticks', name: 'Oven Baked Chicken Drumsticks', method: 'Sheet pan', hands: 5, time: 'About 45 min', cost: 11, ingredients: '10 drumsticks (about 3.5 lb, 2 per person), smoked paprika, garlic powder, onion powder, oregano, salt, pepper, oil. Rice and a bag of frozen veggies on the side.' },
    { id: 'tortillacasserole', name: 'Cheesy Chicken Tortilla Casserole (enchilada bake)', method: 'Oven bake', hands: 15, time: 'About 50 min', cost: 17, ingredients: '3 cups shredded rotisserie chicken, 1 taco seasoning packet, 4 oz can green chiles, 2 cups frozen corn, 10 oz can red enchilada sauce, 8 corn tortillas cut in half, 2 cups shredded cheese.' },
    { id: 'burritocasserole', name: 'Beef Burrito Casserole', method: 'Oven bake', hands: 10, time: 'About 50 min', cost: 16, ingredients: '1/2–1 lb ground beef (browned on Sunday), 4 cups cooked rice, 1 can black beans, 16 oz salsa, green onions, chili powder, 4 oz cream cheese, 1 cup cheddar.' },
    { id: 'tacocasserole', name: 'Taco Casserole', method: 'Oven bake', hands: 15, time: 'About 45 min', cost: 19, ingredients: '1 lb ground beef, 1/2 onion, 1 green bell pepper, chili powder, cumin, paprika, oregano, salt, pepper, 16 oz salsa, 1 can black beans, 2 cups cheddar, 6 burrito-size flour tortillas.' },
    { id: 'beefbowls', name: 'One-Pot Beef Burrito Bowls', method: 'One pot', hands: 10, time: 'About 30 min', cost: 15, ingredients: '1 lb ground beef, 1 cup beef broth, 1 taco seasoning packet, 1 can corn, 1 can black beans, 1 cup salsa, 4.5 oz can green chiles, 1 cup long-grain white rice, 1 cup shredded cheese.' },
    { id: 'onepotteriyaki', name: 'One Pot Teriyaki Chicken and Rice', method: 'Instant Pot / one pot', hands: 15, time: 'About 35 min', cost: 11, ingredients: '1.5 lb chicken breast in small pieces, oil, garlic, ginger, 1.5 cups jasmine rice, 2.5 cups water, 12–16 oz frozen stir-fry veggies, 1/4 cup soy sauce, 2 Tbsp brown sugar, 1 tsp sesame oil, green onions.' }
  ];

  // Week 1: the Page's grocery list (6 dinners + breakfasts, lunches and snacks for 5), with dinner amounts scaled to feed 5 (about $266).
  function w1(id, section, name, qty, est) { return { id: id, section: section, name: name, qty: qty, est: est }; }
  var week1Items = [
    w1('ground-beef', 'meat', 'Ground beef', 'about 2 lb (salsa beef 1, beef tinga 1)', 10),
    w1('pork-shoulder', 'meat', 'Pork shoulder or butt', '2 lb (El Super or Food 4 Less)', 6),
    w1('kielbasa', 'meat', 'Kielbasa', '2 packs', 9),
    w1('drumsticks', 'meat', 'Chicken drumsticks', 'about 3.5 lb (10 pieces)', 6),
    w1('rotisserie', 'meat', 'Rotisserie chickens', '2 (Costco; casserole plus lunches)', 10),
    w1('deli', 'meat', 'Sliced deli turkey or ham', '2 lb (lunches)', 10),
    w1('onions', 'produce', 'Onions', '3 lb bag', 3),
    w1('garlic', 'produce', 'Garlic', '1 head or jar', 1),
    w1('limes', 'produce', 'Limes', '10', 2),
    w1('cilantro', 'produce', 'Cilantro', '2 bunches', 2),
    w1('oranges', 'produce', 'Oranges', '4 lb bag (carnitas plus snacks)', 5),
    w1('red-potatoes', 'produce', 'Red potatoes', '3 lb bag (use 2 lb for kielbasa)', 4),
    w1('lettuce', 'produce', 'Shredded lettuce or romaine', '1', 3),
    w1('avocados', 'produce', 'Avocados', '4', 4),
    w1('bananas', 'produce', 'Bananas', '2 bunches', 3),
    w1('apples', 'produce', 'Apples', '3 lb bag', 5),
    w1('baby-carrots', 'produce', 'Baby carrots', '2 lb', 3),
    w1('cuke-tomato', 'produce', 'Cucumbers and tomatoes', 'a few', 4),
    w1('berries', 'produce', 'Grapes or strawberries', 'whatever is on sale', 5),
    w1('eggs', 'dairy', 'Eggs', '5 dozen', 11),
    w1('milk', 'dairy', 'Milk', '2 gallons', 8),
    w1('cheese', 'dairy', 'Shredded Mexican-blend cheese', '2.5 lb (Costco)', 10),
    w1('sour-cream', 'dairy', 'Sour cream or Mexican crema', '24 oz', 4),
    w1('yogurt', 'dairy', 'Yogurt', '2 large tubs', 6),
    w1('string-cheese', 'dairy', 'String cheese', '24 count', 7),
    w1('butter', 'dairy', 'Butter', '1 lb', 4),
    w1('corn-tortillas', 'bakery', 'Corn tortillas', '80 count', 4),
    w1('flour-tortillas', 'bakery', 'Flour tortillas', '20 count', 4),
    w1('tostadas', 'bakery', 'Tostadas', '1 pack', 3),
    w1('bread', 'bakery', 'Sandwich bread', '2 loaves', 5),
    w1('salsa', 'canned', 'Salsa', 'two 24 oz jars', 7),
    w1('fire-tomatoes', 'canned', 'Fire-roasted diced tomatoes', '1 can', 2),
    w1('chipotle', 'canned', 'Chipotle peppers in adobo', '1 small can', 2),
    w1('enchilada', 'canned', 'Red enchilada sauce', '10 oz', 3),
    w1('green-chiles', 'canned', 'Diced green chiles', '4 oz', 2),
    w1('refried', 'canned', 'Refried beans', '2 cans', 3),
    w1('peanut-butter', 'canned', 'Peanut butter', 'large jar', 4),
    w1('jam', 'canned', 'Jam or jelly', '1 jar', 3),
    w1('rice', 'pantry', 'Long-grain white rice', '10 lb', 8),
    w1('taco-cinnamon', 'pantry', 'Taco seasoning packet and cinnamon sticks', '1 each', 3),
    w1('oatmeal', 'pantry', 'Oatmeal', 'large canister', 4),
    w1('cereal', 'pantry', 'Cereal', '2 family boxes', 8),
    w1('spaghetti', 'pantry', 'Spaghetti and jarred sauce (weekend)', '1 each', 5),
    w1('pantry-topups', 'pantry', 'Pantry top-ups (oil, spices, coffee)', 'as needed', 15),
    w1('frozen-corn', 'frozen', 'Frozen corn', '1 lb', 2),
    w1('frozen-green-beans', 'frozen', 'Frozen green beans', '2 lb', 3),
    w1('backup-frozen', 'frozen', 'Backup shelf: frozen pizzas or frozen burritos', '2 pizzas or 1 bag', 12),
    w1('granola', 'snacks', 'Granola bars', 'big box', 8),
    w1('chips', 'snacks', 'Tortilla chips', 'big bag', 4),
    w1('popcorn', 'snacks', 'Popcorn', '1 box', 3),
    w1('crackers', 'snacks', 'Crackers or pretzels', '1 box', 4)
  ];

  // Week 2: the Page has no week 2 grocery list. This list combines the ingredients for
  // week 2's dinners (amounts sized so each dinner feeds 5) and de-duplicates them. Every price is an ESTIMATE:
  // where week 1 has the same item we use week 1's price; otherwise it's a rough guess (basis says which).
  // Like the Page's week 1 list, it assumes salt, pepper, oil and spices are already in the pantry.
  // It covers dinners only, not breakfasts, lunches or snacks.
  function w2(id, section, name, qty, est, basis, forMeals) { return { id: id, section: section, name: name, qty: qty, est: est, basis: basis, for: forMeals, estimate: true }; }
  var week2Items = [
    w2('chicken-breast', 'meat', 'Boneless skinless chicken breasts', 'about 3 lb (white chili 1.5, fajitas 1.5)', 11, 'week 1 price scaled from $21 for 6 lb ($3.50/lb; 3 lb rounds to $11)', ['whitechili', 'fajitas']),
    w2('chicken-thighs', 'meat', 'Boneless chicken thighs', '1.5 lb', 5, 'rough estimate', ['pozole']),
    w2('ground-beef', 'meat', 'Ground beef', 'about 2.25 lb (burrito casserole 1, BBQ beef 1.25)', 11, 'rough estimate, $5/lb; 2.25 lb rounds to $11', ['burritocasserole', 'bbqbeef']),
    w2('beef-chuck', 'meat', 'Boneless beef chuck or shoulder roast', '1.5 lb, cut in chunks', 10, 'rough estimate, scaled from a 3 lb roast', ['tacobeef']),
    w2('onions', 'produce', 'Onions', '3 lb bag (4 onions: chili 1, fajitas 2, 1 white for pozole)', 3, 'week 1 price', ['whitechili', 'fajitas', 'pozole']),
    w2('garlic', 'produce', 'Garlic', '1 head (about 5 cloves)', 1, 'week 1 price', ['whitechili', 'tacobeef']),
    w2('bell-peppers', 'produce', 'Bell peppers', '3–4 (or pre-sliced fajita veggies)', 4, 'rough estimate', ['fajitas']),
    w2('poblano', 'produce', 'Poblano pepper', '1', 1, 'rough estimate', ['pozole']),
    w2('limes', 'produce', 'Limes', '2', 1, 'week 1 price (10 for $2)', ['fajitas', 'pozole']),
    w2('cilantro', 'produce', 'Cilantro', '1 bunch', 1, 'week 1 price', ['pozole']),
    w2('green-onions', 'produce', 'Green onions', '1 bunch', 1, 'rough estimate', ['burritocasserole']),
    w2('coleslaw', 'produce', 'Bagged coleslaw mix / shredded cabbage', '2 bags (BBQ slaw + pozole topping)', 5, 'rough estimate', ['bbqbeef', 'pozole']),
    w2('cheese', 'dairy', 'Shredded cheese (Mexican blend or cheddar)', 'about 1 lb (chili topping + 1 cup cheddar)', 4, 'week 1 price ($10 for 2.5 lb)', ['whitechili', 'burritocasserole']),
    w2('sour-cream', 'dairy', 'Sour cream', '16 oz', 3, 'week 1 price (24 oz $4)', ['fajitas']),
    w2('cream-cheese', 'dairy', 'Cream cheese', '4 oz (one 8 oz block)', 2, 'rough estimate', ['burritocasserole']),
    w2('flour-tortillas', 'bakery', 'Flour tortillas', '20 count (fajitas + taco beef)', 4, 'week 1 price', ['fajitas', 'tacobeef']),
    w2('tostadas', 'bakery', 'Tostadas', '1 pack', 3, 'week 1 price', ['pozole']),
    w2('buns', 'bakery', 'Hamburger buns', '1 pack (8)', 3, 'rough estimate', ['bbqbeef']),
    w2('salsa-verde', 'canned', 'Salsa verde', 'two 16 oz jars (chili + pozole)', 6, 'rough estimate', ['whitechili', 'pozole']),
    w2('salsa', 'canned', 'Salsa', '16 oz jar', 3, 'week 1 price ($7 for two 24 oz)', ['burritocasserole']),
    w2('cannellini', 'canned', 'Cannellini beans', '2 cans', 2, 'rough estimate', ['whitechili']),
    w2('pinto', 'canned', 'Pinto beans', '1 can', 1, 'rough estimate', ['whitechili']),
    w2('black-beans', 'canned', 'Black beans', '1 can', 1, 'rough estimate', ['burritocasserole']),
    w2('hominy', 'canned', 'Hominy', '2 cans', 4, 'rough estimate', ['pozole']),
    w2('broth', 'canned', 'Chicken broth', '2 cups (one 32 oz carton)', 2, 'rough estimate', ['whitechili']),
    w2('bbq-sauce', 'canned', 'BBQ sauce', '1 large bottle', 3, 'rough estimate', ['bbqbeef']),
    w2('chips', 'snacks', 'Tortilla chips', '1 bag (chili topping)', 4, 'week 1 price', ['whitechili']),
    w2('rice', 'check', 'White rice', '4 cups cooked (left from week 1’s 10 lb bag)', null, 'on hand', ['burritocasserole']),
    w2('spices', 'check', 'Spices: chili powder, cumin, oregano, paprika, smoked paprika, garlic & onion powder, red pepper flakes', 'check you have them', null, 'on hand', ['whitechili', 'fajitas', 'pozole', 'burritocasserole', 'bbqbeef', 'tacobeef']),
    w2('basics', 'check', 'Oil, sugar, salt, pepper', 'check you have them', null, 'on hand', ['fajitas', 'bbqbeef', 'tacobeef'])
  ];

  var weeks = {
    '1': {
      label: 'Week 1',
      note: 'The Page’s week 1 list: 6 dinners plus breakfasts, lunches and snacks for 5. Prices are rough Downey-area estimates. Assumes salt, pepper, oil and chili powder are in the pantry. Pet food is budgeted separately.',
      dinners: [
        { day: 'Mon', meal: 'salsabeef', title: 'Salsa Beef tacos', detail: 'one pot, about 25 min' },
        { day: 'Tue', meal: 'kielbasa', title: 'Sheet Pan Kielbasa, Potatoes and Green Beans', detail: '' },
        { day: 'Wed', meal: 'tingabeef', title: 'Beef Tinga tostadas', detail: 'one pot' },
        { day: 'Thu', meal: 'tortillacasserole', title: 'Cheesy Chicken Tortilla Casserole', detail: 'rotisserie chicken' },
        { day: 'Fri', meal: 'drumsticks', title: 'Oven Baked Drumsticks with rice and green beans', detail: '' },
        { day: 'Sat', meal: 'carnitas', title: 'Slow Cooker Carnitas tacos', detail: '5 hr on HIGH' },
        { day: 'Sun', meal: null, title: 'Sunday spaghetti', detail: 'box pasta and jarred sauce' }
      ],
      items: week1Items
    },
    '2': {
      label: 'Week 2',
      note: 'The Page has no week 2 list, so this one is built from week 2’s recipes on the Page and de-duplicated. Dinners only (add breakfast, lunch and snack items yourself). All prices are estimates: week 1 prices where the item repeats, otherwise rough guesses.',
      dinners: [
        { day: 'Mon', meal: 'whitechili', title: 'White Chicken Chili', detail: 'crockpot' },
        { day: 'Tue', meal: 'fajitas', title: 'Sheet Pan Chicken Fajitas', detail: '' },
        { day: 'Wed', meal: 'pozole', title: 'Chicken Pozole Verde', detail: 'crockpot, parent loads on LOW' },
        { day: 'Thu', meal: 'burritocasserole', title: 'Beef Burrito Casserole', detail: 'Sunday beef and rice' },
        { day: 'Fri', meal: 'bbqbeef', title: 'BBQ Beef sandwiches with coleslaw', detail: 'one pot' },
        { day: 'Sat', meal: 'tacobeef', title: 'Shredded Taco Beef', detail: '6–8 hr on LOW' },
        { day: 'Sun', meal: null, title: 'Sunday prep, then breakfast for dinner or quesadillas', detail: 'uses eggs, tortillas, cheese on hand' }
      ],
      items: week2Items
    }
  };

  return { version: 2, source: 'Tamayo Weeknight Meals (Page)', defaultBudget: 325, sections: sections, meals: meals, weeks: weeks };
});
