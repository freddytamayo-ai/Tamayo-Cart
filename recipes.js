/* Tamayo Cart — step-by-step recipes for every dinner (2-week beef-forward plan, Nov 21, 2026).
 * Plain cooking instructions only. No prices, budgets, or account data.
 * Shape: { version, byMeal: { mealId: recipe }, sundayByWeek: {} }  (every night is a catalog meal now)
 * recipe: { servings, prep, cook, equipment, ingredients[], steps[{title,detail}], doneness, tip }
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TamayoRecipes = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  return {
  "version": 3,
  "byMeal": {
    "beeftacos": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 20 min in the oven",
      "equipment": "Big skillet, 2 rimmed sheet pans",
      "ingredients": [
        "1.5 lb ground beef (from the fridge)",
        "1 can (16 oz) refried beans",
        "1 packet taco seasoning + 2/3 cup water",
        "20 corn tortillas",
        "3 Tbsp oil",
        "2 cups shredded Mexican-blend cheese",
        "Shredded cabbage and salsa"
      ],
      "steps": [
        {
          "title": "Brown the beef",
          "detail": "Heat the oven to 425°F. Brown the beef in a big skillet until no pink remains. Drain the fat. Stir in the taco seasoning and water and simmer 5 minutes. Stir in the refried beans until hot."
        },
        {
          "title": "Soften the tortillas",
          "detail": "Wrap 10 tortillas in a damp paper towel and microwave 45 seconds so they bend without cracking. Do the other 10 the same way."
        },
        {
          "title": "Fill",
          "detail": "Brush the sheet pans with the oil. Put 2 spoonfuls of filling and a little cheese on half of each tortilla, fold it over and lay it on the pan."
        },
        {
          "title": "Bake",
          "detail": "Bake 10 minutes, flip each taco, and bake 5–8 minutes more until crisp."
        },
        {
          "title": "Serve",
          "detail": "Serve 4 tacos each with cabbage and salsa."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "The beans stretch the beef so 1.5 lb feeds all 5."
    },
    "meatloaf": {
      "servings": "5",
      "prep": "20 min",
      "cook": "About 30 min",
      "equipment": "2 rimmed sheet pans, foil, big bowl",
      "ingredients": [
        "2.5 lb ground beef",
        "2 eggs",
        "3/4 cup quick or old-fashioned oats (from the oatmeal)",
        "1/2 cup milk",
        "1 Tbsp onion powder, 1 tsp garlic powder, 1.5 tsp salt, 1/2 tsp pepper",
        "1 Tbsp Worcestershire sauce (optional)",
        "Glaze: 3/4 cup ketchup, 2 Tbsp sugar, 1 Tbsp mustard",
        "2 lb potatoes, cut in 1-inch cubes",
        "1 lb carrots, peeled and cut in sticks",
        "2 Tbsp oil"
      ],
      "steps": [
        {
          "title": "Thaw the meat Monday night",
          "detail": "Move the ground beef from the freezer to the fridge Monday night. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Start the vegetables",
          "detail": "Heat the oven to 425°F. Toss the potatoes and carrots with the oil and 1 tsp salt on a foil-lined pan. Roast 15 minutes."
        },
        {
          "title": "Mix the meat",
          "detail": "In a big bowl, mix the beef, eggs, oats, milk, spices and Worcestershire with your hands until just combined."
        },
        {
          "title": "Shape",
          "detail": "Shape 10 small loaves (about the size of your hand) on the second foil-lined pan. Stir the glaze together and spoon it over the tops."
        },
        {
          "title": "Bake",
          "detail": "Put the meatloaf pan in the oven with the vegetables. Bake both 25 minutes more."
        },
        {
          "title": "Serve",
          "detail": "Let the meatloaves rest 5 minutes. Serve 2 per person with the potatoes and carrots."
        }
      ],
      "doneness": "Meatloaf is done at 160°F in the middle, with no pink.",
      "tip": "Wash your hands well after mixing raw beef, before you touch anything else."
    },
    "potroast": {
      "servings": "5",
      "prep": "20 min",
      "cook": "8–9 hr LOW or 5–6 hr HIGH",
      "equipment": "7-quart or bigger crockpot (or a 6-quart plus a 9x13 pan and foil)",
      "ingredients": [
        "4 lb boneless beef chuck roast (2 roasts, about 2 lb each, from the fridge) — double batch, save half for Thursday",
        "5 lb potatoes, cut in big chunks",
        "2 lb carrots, peeled and cut in big pieces",
        "2 onions, cut in wedges",
        "2 packets dry onion soup mix",
        "2 cups water + 2 tsp beef bouillon",
        "2 Tbsp Worcestershire sauce (optional)",
        "1 tsp pepper",
        "3 Tbsp cornstarch + 3 Tbsp cold water (for gravy)"
      ],
      "steps": [
        {
          "title": "Vegetables first",
          "detail": "Put the potatoes, carrots and onions in the bottom of the crockpot. If your crockpot is only 6 quarts, use half the vegetables now and see step 4."
        },
        {
          "title": "Add the roasts",
          "detail": "Set both roasts on top. Sprinkle the onion soup mix and pepper over them. Pour the water with bouillon and the Worcestershire around them."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 8–9 hours on LOW or 5–6 hours on HIGH, until the beef falls apart."
        },
        {
          "title": "Extra vegetables (6-quart crockpot only)",
          "detail": "An hour before dinner, put the rest of the potatoes and carrots in a 9x13 pan with 1 cup of liquid from the crockpot. Cover with foil and bake at 400°F for 50 minutes."
        },
        {
          "title": "Make gravy",
          "detail": "Move the meat and vegetables to a platter. Stir the cornstarch and cold water together, stir it into the liquid in the crockpot, turn to HIGH and cook 10 minutes until thick."
        },
        {
          "title": "Serve half tonight",
          "detail": "Pull the beef into chunks and serve half of the meat, vegetables and gravy."
        },
        {
          "title": "Save half for Thursday",
          "detail": "Within 2 hours of cooking, put the saved half in containers with lids, label them “Thursday leftovers” and put them in the fridge. Eat within 3–4 days."
        }
      ],
      "doneness": "Beef is done when it pulls apart easily with a fork (it is safe well before that, at 145°F). Refrigerate leftovers within 2 hours.",
      "tip": "Double batch: this one dinner feeds 5 tonight and 5 again on Thursday. Lots of potatoes and carrots stretch 4 lb of beef over 2 nights. Do not lift the lid while it cooks."
    },
    "lo-potroast": {
      "servings": "5",
      "prep": "5 min",
      "cook": "About 15–30 min",
      "equipment": "Covered baking dish or pot, or microwave",
      "ingredients": [
        "Saved half of Wednesday’s pot roast, vegetables and gravy",
        "1/2 cup water"
      ],
      "steps": [
        {
          "title": "Reheat in the oven",
          "detail": "Heat the oven to 350°F. Put the meat, vegetables and gravy in a baking dish, add the water, cover with foil and heat 25–30 minutes, stirring once."
        },
        {
          "title": "Or the microwave",
          "detail": "Heat each plate covered for 2–3 minutes, stir, then 1–2 minutes more until steaming."
        },
        {
          "title": "Serve",
          "detail": "Serve hot with the gravy."
        }
      ],
      "doneness": "Reheat leftovers until steaming hot all the way through (165°F). Reheat only once; throw away anything older than 4 days.",
      "tip": "Pot roast also makes great sandwiches."
    },
    "picadillo": {
      "servings": "5",
      "prep": "15 min",
      "cook": "4–5 hr LOW or 2.5–3 hr HIGH",
      "equipment": "Skillet, 6-quart crockpot, pot for rice",
      "ingredients": [
        "1.5 lb ground beef",
        "1 onion, diced",
        "3 garlic cloves, minced",
        "2 lb potatoes, cut in 1/2-inch cubes",
        "1 bag (12–16 oz) frozen mixed vegetables",
        "2 cans (8 oz each) tomato sauce",
        "1 cup water + 1 tsp beef bouillon",
        "2 tsp cumin, 1 tsp chili powder, 1.5 tsp salt",
        "2 cups white rice",
        "20 flour tortillas"
      ],
      "steps": [
        {
          "title": "Thaw the meat Thursday night",
          "detail": "Move the ground beef from the freezer to the fridge Thursday night. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Brown the beef",
          "detail": "Brown the beef, onion and garlic in a skillet until no pink remains. Drain the fat."
        },
        {
          "title": "Load the crockpot",
          "detail": "Put the potatoes in the crockpot. Add the beef, tomato sauce, water with bouillon, cumin, chili powder and salt. Stir."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 4–5 hours on LOW or 2.5–3 hours on HIGH, until the potatoes are soft."
        },
        {
          "title": "Add the vegetables",
          "detail": "30 minutes before dinner, stir in the frozen vegetables, cover and keep cooking."
        },
        {
          "title": "Rice and serve",
          "detail": "Make the rice: 4 cups water, 1 tsp salt, 2 cups rice, covered on low, 18 minutes. Serve the picadillo over rice or in warm tortillas."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "Potatoes and vegetables stretch 1.5 lb of beef to feed 5. Always brown ground beef before it goes in the crockpot."
    },
    "bakedziti": {
      "servings": "5",
      "prep": "30 min",
      "cook": "About 25 min in the oven",
      "equipment": "Biggest pot, big skillet, 2 baking dishes (9x13), foil",
      "ingredients": [
        "2.5 lb ground beef — double batch, save one pan for Sunday",
        "2 lb ziti or penne pasta",
        "3 jars (24 oz each) store-brand marinara + 1 can (15 oz) tomato sauce",
        "2 tsp garlic powder, 2 tsp Italian seasoning or oregano, 1 tsp salt",
        "4 cups (1 lb) shredded mozzarella",
        "1 bag frozen mixed vegetables tonight (another for Sunday)"
      ],
      "steps": [
        {
          "title": "Thaw the meat Friday night",
          "detail": "Move the ground beef (both bags) from the freezer to the fridge Friday night. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Boil the pasta",
          "detail": "Heat the oven to 375°F. Boil the pasta in your biggest pot of salted water (or in 2 batches) 2 minutes less than the box says. Drain."
        },
        {
          "title": "Brown the beef",
          "detail": "Brown the beef in 2 batches in a big skillet until no pink remains. Drain the fat. Return it all to the pasta pot with the marinara, tomato sauce, garlic powder, seasoning and salt."
        },
        {
          "title": "Fill 2 pans",
          "detail": "Stir the pasta into the sauce. Split it between the 2 dishes. Cover each top with half the mozzarella."
        },
        {
          "title": "Bake one pan",
          "detail": "Bake one pan 20–25 minutes until the cheese melts and bubbles. Microwave or boil one bag of frozen vegetables to serve on the side."
        },
        {
          "title": "Save the second pan for Sunday",
          "detail": "Cover the second (unbaked) pan tightly with foil, label it “Sunday” and put it in the fridge right away. Eat within 3 days."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "Double batch: the second pan is Sunday’s dinner, already made. 2.5 lb of beef and 2 lb of pasta make 2 full pans. Undercooking the pasta a little keeps it from getting mushy."
    },
    "lo-bakedziti": {
      "servings": "5",
      "prep": "5 min",
      "cook": "About 15–30 min",
      "equipment": "Covered baking dish or pot, or microwave",
      "ingredients": [
        "The second (unbaked) pan of ziti saved Saturday",
        "1 bag frozen mixed vegetables"
      ],
      "steps": [
        {
          "title": "Bake from the fridge",
          "detail": "Heat the oven to 375°F. Keep the foil on and bake 30 minutes."
        },
        {
          "title": "Brown the top",
          "detail": "Take off the foil and bake 15 minutes more, until the cheese bubbles and the middle is hot."
        },
        {
          "title": "Serve",
          "detail": "Microwave or boil the frozen vegetables and serve them on the side."
        }
      ],
      "doneness": "Reheat leftovers until steaming hot all the way through (165°F). Reheat only once; throw away anything older than 4 days.",
      "tip": "The pan goes into the oven cold, so give it the full time."
    },
    "chili": {
      "servings": "5",
      "prep": "20 min",
      "cook": "6–8 hr LOW or 4 hr HIGH",
      "equipment": "Big skillet, 6-quart crockpot, pot for rice",
      "ingredients": [
        "3 lb ground beef — double batch, save half for Tuesday",
        "2 onions, diced",
        "4 garlic cloves, minced",
        "4 cans (15 oz each) pinto or kidney beans, drained and rinsed",
        "2 cans (15 oz each) diced tomatoes",
        "1 can (15 oz) tomato sauce",
        "1 cup water + 1 tsp beef bouillon",
        "2 packets chili seasoning (or 3 Tbsp chili powder, 1 Tbsp cumin, 2 tsp salt)",
        "2 cups white rice (tonight)",
        "1 cup shredded cheese (tonight)"
      ],
      "steps": [
        {
          "title": "Thaw the meat Sunday night",
          "detail": "Move the ground beef (both bags) from the freezer to the fridge Sunday night. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Brown the beef",
          "detail": "Brown the beef in 2 batches with the onions and garlic until no pink remains. Drain the fat."
        },
        {
          "title": "Load the crockpot",
          "detail": "Put the beef, beans, diced tomatoes, tomato sauce, water with bouillon and chili seasoning in the crockpot. Stir."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 6–8 hours on LOW or 4 hours on HIGH."
        },
        {
          "title": "Rice",
          "detail": "Make the rice: 4 cups water, 1 tsp salt, 2 cups rice, covered on low, 18 minutes."
        },
        {
          "title": "Serve half tonight",
          "detail": "Serve half of the chili over rice with a little cheese."
        },
        {
          "title": "Save half for Tuesday",
          "detail": "Within 2 hours of cooking, put the saved half in containers with lids, label them “Tuesday leftovers” and put them in the fridge. Eat within 3–4 days."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "Double batch: beans stretch 3 lb of beef over 2 dinners. Tuesday it goes over baked potatoes."
    },
    "lo-chili": {
      "servings": "5",
      "prep": "10 min",
      "cook": "About 1 hr (potatoes bake 50–60 min; 15 min in the microwave)",
      "equipment": "Rimmed sheet pan, pot with a lid (or microwave)",
      "ingredients": [
        "Saved half of Monday’s chili",
        "10 russet potatoes (about 5 lb)",
        "1 Tbsp oil and 1 tsp salt",
        "1 cup shredded cheese and sour cream"
      ],
      "steps": [
        {
          "title": "Bake the potatoes",
          "detail": "Heat the oven to 425°F. Scrub the potatoes, poke each one 4 times with a fork, rub with oil and salt and bake right on a sheet pan 50–60 minutes until soft. (Faster: microwave 5 at a time for 10–12 minutes, turning once.)"
        },
        {
          "title": "Reheat the chili",
          "detail": "Put the chili in a pot. Cover and heat on medium-low 10–15 minutes, stirring often, until steaming."
        },
        {
          "title": "Serve",
          "detail": "Split each potato open and spoon chili over it. Top with cheese and sour cream. 2 potatoes each."
        }
      ],
      "doneness": "Reheat leftovers until steaming hot all the way through (165°F). Reheat only once; throw away anything older than 4 days.",
      "tip": "Add a splash of water if the chili got thick in the fridge."
    },
    "chickenfajitas": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 25 min",
      "equipment": "2 rimmed sheet pans, foil",
      "ingredients": [
        "2.5 lb boneless skinless chicken breasts, cut in thin strips",
        "3 bell peppers, sliced",
        "2 onions, sliced",
        "3 Tbsp oil",
        "2 tsp chili powder, 1 tsp cumin, 1 tsp paprika, 1 tsp garlic powder, 1.5 tsp salt",
        "2 limes",
        "20 flour tortillas",
        "Shredded cheese, sour cream and salsa (from the fridge)"
      ],
      "steps": [
        {
          "title": "Thaw the meat Tuesday night",
          "detail": "Move the chicken breasts from the freezer to the fridge Tuesday night. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Heat the oven",
          "detail": "Heat the oven to 425°F. Line 2 sheet pans with foil."
        },
        {
          "title": "Season",
          "detail": "In a big bowl, toss the chicken, peppers and onions with the oil and all the spices."
        },
        {
          "title": "Bake",
          "detail": "Spread everything in one layer across both pans. Bake 20–25 minutes, stirring once halfway."
        },
        {
          "title": "Finish",
          "detail": "Squeeze the limes over the pans."
        },
        {
          "title": "Serve",
          "detail": "Warm the tortillas. Fill with chicken and vegetables and top with cheese, sour cream and salsa."
        }
      ],
      "doneness": "Chicken is done at 165°F, white all the way through.",
      "tip": "Chicken cuts into strips more easily while it is still a little frozen."
    },
    "burritobake": {
      "servings": "5",
      "prep": "20 min",
      "cook": "About 25 min in the oven",
      "equipment": "Skillet, 9x13 baking dish",
      "ingredients": [
        "1.5 lb ground beef",
        "1 onion, diced",
        "1 packet taco seasoning + 2/3 cup water",
        "2 cans (16 oz each) refried beans",
        "10 burrito-size flour tortillas",
        "1 large can (19 oz) red enchilada sauce",
        "2.5 cups shredded Mexican-blend cheese",
        "Shredded cabbage and sour cream"
      ],
      "steps": [
        {
          "title": "Thaw the meat Wednesday night",
          "detail": "Move the ground beef from the freezer to the fridge Wednesday night. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Brown the beef",
          "detail": "Heat the oven to 375°F. Brown the beef and onion in a skillet until no pink remains. Drain the fat. Stir in the taco seasoning and water and simmer 5 minutes."
        },
        {
          "title": "Fill",
          "detail": "Spread a spoon of refried beans down each tortilla. Add beef and a little cheese. Roll them up."
        },
        {
          "title": "Sauce",
          "detail": "Pour 1/2 cup enchilada sauce in the 9x13 dish. Set the burritos in it seam-side down. Pour the rest of the sauce over the top and cover with the rest of the cheese."
        },
        {
          "title": "Bake",
          "detail": "Bake 20–25 minutes until the cheese bubbles."
        },
        {
          "title": "Serve",
          "detail": "Top with shredded cabbage and sour cream."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "Two cans of beans stretch 1.5 lb of beef to 10 burritos. You can make it the night before, cover and refrigerate; add 10 minutes to the bake time."
    },
    "shepherdspie": {
      "servings": "5",
      "prep": "25 min",
      "cook": "About 25 min in the oven",
      "equipment": "Big pot, skillet, 9x13 baking dish, potato masher",
      "ingredients": [
        "1.5 lb ground beef",
        "3 lb potatoes, peeled and cut in chunks",
        "1/2 cup milk + 3 Tbsp butter",
        "1 onion, diced",
        "2 Tbsp flour",
        "1 cup water + 1 tsp beef bouillon",
        "1 Tbsp Worcestershire sauce (optional)",
        "1 bag (12–16 oz) frozen mixed vegetables",
        "1 cup shredded cheese",
        "Salt and pepper"
      ],
      "steps": [
        {
          "title": "Thaw the meat Thursday night",
          "detail": "Move the ground beef from the freezer to the fridge Thursday night. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Boil the potatoes",
          "detail": "Cover the potatoes with salted water in a big pot. Boil 15–20 minutes until a fork slides in. Drain and mash with the milk, butter, 1 tsp salt and some pepper."
        },
        {
          "title": "Brown the beef",
          "detail": "Heat the oven to 400°F. Brown the beef and onion in a skillet until no pink remains. Drain the fat."
        },
        {
          "title": "Make the gravy",
          "detail": "Sprinkle the flour over the beef and stir 1 minute. Stir in the water with bouillon and the Worcestershire. Simmer 3 minutes until thick. Stir in the frozen vegetables."
        },
        {
          "title": "Layer",
          "detail": "Spread the beef mixture in the 9x13 dish. Spread the mashed potatoes over the top and sprinkle on the cheese."
        },
        {
          "title": "Bake",
          "detail": "Bake 20–25 minutes until bubbling at the edges. Let it sit 5 minutes, then serve."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "Mashed potatoes and vegetables stretch 1.5 lb of beef into a full dinner for 5."
    },
    "chilecolorado": {
      "servings": "5",
      "prep": "15 min",
      "cook": "8–9 hr LOW or 5 hr HIGH",
      "equipment": "6-quart crockpot, pot for rice",
      "ingredients": [
        "3 lb beef stew meat — double batch, save half for Sunday",
        "2 lb potatoes, cut in 1-inch cubes (con papas)",
        "1/4 cup flour",
        "2 tsp cumin, 2 tsp oregano, 2 tsp salt",
        "1 onion, diced",
        "4 garlic cloves, minced",
        "2 cans (28 oz each) red chile sauce (like Las Palmas)",
        "2 cups white rice (tonight)",
        "1 can refried beans, warmed (tonight)",
        "10 flour tortillas (tonight)"
      ],
      "steps": [
        {
          "title": "Thaw the meat 2 nights ahead",
          "detail": "Thursday night, move both bags of stew meat (3 lb) from the freezer to the fridge on a plate so they are fully thawed by Saturday morning. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Season",
          "detail": "Put the potatoes in the bottom of the crockpot. Add the beef and toss it with the flour, cumin, oregano and salt."
        },
        {
          "title": "Add the sauce",
          "detail": "Add the onion and garlic. Pour both cans of red chile sauce over the top and stir."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 8–9 hours on LOW or 5 hours on HIGH, until the beef is tender."
        },
        {
          "title": "Rice",
          "detail": "Make the rice: 4 cups water, 1 tsp salt, 2 cups rice, covered on low, 18 minutes."
        },
        {
          "title": "Serve half tonight",
          "detail": "Serve half of the chile colorado with rice, refried beans and warm tortillas."
        },
        {
          "title": "Save half for Sunday",
          "detail": "Within 2 hours of cooking, put the saved half in containers with lids, label them “Sunday leftovers” and put them in the fridge. Eat within 3–4 days."
        }
      ],
      "doneness": "Beef is done when it pulls apart easily with a fork (it is safe well before that, at 145°F). Refrigerate leftovers within 2 hours.",
      "tip": "Double batch: potatoes stretch 3 lb of beef over 2 dinners. It tastes even better the second day."
    },
    "lo-chilecolorado": {
      "servings": "5",
      "prep": "5 min",
      "cook": "About 15–30 min",
      "equipment": "Covered baking dish or pot, or microwave",
      "ingredients": [
        "Saved half of Saturday’s chile colorado",
        "2 cups white rice",
        "1 can refried beans",
        "10 flour tortillas"
      ],
      "steps": [
        {
          "title": "Reheat",
          "detail": "Put the chile colorado in a pot. Cover and heat on medium-low 15 minutes, stirring often, until steaming."
        },
        {
          "title": "Make fresh rice",
          "detail": "Make the rice: 4 cups water, 1 tsp salt, 2 cups rice, covered on low, 18 minutes. Warm the beans."
        },
        {
          "title": "Serve",
          "detail": "Serve with rice, beans and warm tortillas."
        }
      ],
      "doneness": "Reheat leftovers until steaming hot all the way through (165°F). Reheat only once; throw away anything older than 4 days.",
      "tip": "Leftovers also make great burritos."
    }
  },
  "sundayByWeek": {}
};
});
