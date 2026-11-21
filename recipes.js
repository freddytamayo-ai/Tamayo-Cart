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
    "carneasada": {
      "servings": "5",
      "prep": "15 min + 1 hr or more marinating",
      "cook": "About 12 min",
      "equipment": "Sheet pan, foil, oven broiler",
      "ingredients": [
        "2.5 lb thin carne asada steak (flap meat / ranchera or skirt)",
        "Juice of 2 oranges and 2 limes",
        "3 garlic cloves, minced",
        "2 Tbsp oil",
        "1 tsp cumin, 1 tsp chili powder, 1.5 tsp salt",
        "20 corn tortillas",
        "1 white onion and 1 bunch cilantro, chopped",
        "2 avocados, sliced",
        "Salsa and lime wedges"
      ],
      "steps": [
        {
          "title": "Marinate",
          "detail": "In the morning (or at least 1 hour before), put the steak in a zip bag with the orange and lime juice, garlic, oil, cumin, chili powder and salt. Squeeze out the air and keep it in the fridge."
        },
        {
          "title": "Heat the broiler",
          "detail": "Move an oven rack to the top (about 5 inches below the heat). Turn the broiler to HIGH. Line a sheet pan with foil."
        },
        {
          "title": "Broil",
          "detail": "Lay the steak flat on the pan (throw away the marinade). Broil 4–5 minutes, flip, and broil 3–4 minutes more."
        },
        {
          "title": "Rest and chop",
          "detail": "Let the steak rest 5 minutes, then chop it into small pieces."
        },
        {
          "title": "Serve",
          "detail": "Warm the tortillas in a dry pan. Fill with meat and top with onion, cilantro, avocado, salsa and a squeeze of lime."
        }
      ],
      "doneness": "Steak is done at 145°F. Throw away the used marinade. Never pour it on cooked meat.",
      "tip": "El Super and most Mexican markets sell carne asada already marinated. If you buy that, skip step 1."
    },
    "steakbites": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 40 min",
      "equipment": "2 rimmed sheet pans, foil",
      "ingredients": [
        "2.5 lb top sirloin steak, cut in 1-inch cubes",
        "2 lb small red potatoes, cut in quarters",
        "1 lb fresh green beans, ends snapped off",
        "3 Tbsp oil",
        "2 tsp steak seasoning (or 1 tsp salt, 1 tsp pepper, 1 tsp garlic powder)",
        "1 tsp salt for the vegetables",
        "3 garlic cloves, minced",
        "2 Tbsp butter"
      ],
      "steps": [
        {
          "title": "Heat the oven",
          "detail": "Heat the oven to 425°F. Line 2 sheet pans with foil."
        },
        {
          "title": "Roast the potatoes",
          "detail": "Toss the potatoes with 1 Tbsp oil and 1/2 tsp salt on one pan. Roast 20 minutes."
        },
        {
          "title": "Season the steak",
          "detail": "While the potatoes roast, toss the steak cubes with 1 Tbsp oil, the steak seasoning and the garlic. Toss the green beans with the last 1 Tbsp oil and 1/2 tsp salt."
        },
        {
          "title": "Add steak and beans",
          "detail": "Take out the potatoes. Put the green beans next to them. Spread the steak in one layer on the second pan. Roast both pans 10–12 minutes."
        },
        {
          "title": "Finish",
          "detail": "Put small pieces of butter over the hot steak and stir. Serve right away."
        }
      ],
      "doneness": "Steak is medium at 145°F (cut one cube: pink in the middle is fine). Potatoes are done when a fork slides in easily.",
      "tip": "Cut the steak while it is cold from the fridge. It is much easier."
    },
    "potroast": {
      "servings": "5",
      "prep": "20 min",
      "cook": "9–10 hr LOW or 6 hr HIGH",
      "equipment": "7-quart or bigger crockpot (or a 6-quart plus a 9x13 pan and foil)",
      "ingredients": [
        "6 lb boneless beef chuck roast (2 roasts, about 3 lb each) — double batch, save half for Thursday",
        "4 lb potatoes, cut in big chunks",
        "2 lb baby carrots",
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
          "detail": "Cover and cook 9–10 hours on LOW or 6 hours on HIGH, until the beef falls apart."
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
      "tip": "Double batch: this one dinner feeds 5 tonight and 5 again on Thursday. Do not lift the lid while it cooks."
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
      "tip": "Pot roast also makes great sandwiches on bread from the pantry."
    },
    "guisada": {
      "servings": "5",
      "prep": "15 min",
      "cook": "8 hr LOW or 4–5 hr HIGH",
      "equipment": "6-quart crockpot, pot for rice",
      "ingredients": [
        "2.5 lb beef stew meat (carne para guisar)",
        "2 Tbsp flour",
        "1 onion, diced",
        "1 green bell pepper, diced",
        "4 garlic cloves, minced",
        "1 can (8 oz) tomato sauce",
        "1 cup water + 1 tsp beef bouillon",
        "2 tsp cumin, 1 tsp chili powder, 1 tsp oregano",
        "1 tsp salt, 1/2 tsp pepper",
        "2 cups white rice (makes rice for 5)",
        "10 flour tortillas"
      ],
      "steps": [
        {
          "title": "Thaw the meat the night before",
          "detail": "Move the stew meat from the freezer to the fridge the night before. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Season the beef",
          "detail": "Put the stew meat in the crockpot. Sprinkle on the flour, cumin, chili powder, oregano, salt and pepper. Stir so every piece is coated."
        },
        {
          "title": "Add the rest",
          "detail": "Add the onion, bell pepper and garlic. Pour in the tomato sauce and the water mixed with bouillon. Stir."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 8 hours on LOW or 4–5 hours on HIGH, until a piece of beef breaks apart with a fork."
        },
        {
          "title": "Make the rice",
          "detail": "30 minutes before dinner: bring 4 cups water and 1 tsp salt to a boil, add 2 cups rice, cover, turn to low and cook 18 minutes. Turn off and leave covered 5 minutes."
        },
        {
          "title": "Serve",
          "detail": "Warm the tortillas in a dry pan. Serve the guisada over rice or in tortillas."
        }
      ],
      "doneness": "Beef is done when it pulls apart easily with a fork (it is safe well before that, at 145°F). Refrigerate leftovers within 2 hours.",
      "tip": "Load it in the morning before school or work and dinner is ready when you get home."
    },
    "bakedziti": {
      "servings": "5",
      "prep": "30 min",
      "cook": "About 25 min in the oven",
      "equipment": "Biggest pot, big skillet, 2 baking dishes (9x13), foil",
      "ingredients": [
        "4 lb ground beef — double batch, save one pan for Sunday",
        "2 lb ziti or penne pasta",
        "4 jars (24 oz each) marinara sauce",
        "2 tsp garlic powder, 2 tsp Italian seasoning or oregano, 1 tsp salt",
        "4 cups shredded mozzarella",
        "1 cup grated parmesan",
        "1 bag salad and 1 loaf French bread tonight (another of each for Sunday)"
      ],
      "steps": [
        {
          "title": "Thaw the meat the night before",
          "detail": "Move the ground beef (both bags) from the freezer to the fridge the night before. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Boil the pasta",
          "detail": "Heat the oven to 375°F. Boil the pasta in your biggest pot of salted water (or in 2 batches) 2 minutes less than the box says. Drain."
        },
        {
          "title": "Brown the beef",
          "detail": "Brown the beef in 2 batches in a big skillet until no pink remains. Drain the fat. Return it all to the pasta pot with the marinara, garlic powder, seasoning and salt."
        },
        {
          "title": "Fill 2 pans",
          "detail": "Stir the pasta into the sauce. Split it between the 2 dishes. Cover each top with half the mozzarella and parmesan."
        },
        {
          "title": "Bake one pan",
          "detail": "Bake one pan 20–25 minutes until the cheese melts and bubbles. Serve with salad and French bread."
        },
        {
          "title": "Save the second pan for Sunday",
          "detail": "Cover the second (unbaked) pan tightly with foil, label it “Sunday” and put it in the fridge right away. Eat within 3 days."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "Double batch: the second pan is Sunday’s dinner, already made. Undercooking the pasta a little keeps it from getting mushy."
    },
    "lo-bakedziti": {
      "servings": "5",
      "prep": "5 min",
      "cook": "About 15–30 min",
      "equipment": "Covered baking dish or pot, or microwave",
      "ingredients": [
        "The second (unbaked) pan of ziti saved Saturday",
        "1 bag salad and 1 loaf French bread"
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
          "detail": "Serve with the salad and sliced French bread."
        }
      ],
      "doneness": "Reheat leftovers until steaming hot all the way through (165°F). Reheat only once; throw away anything older than 4 days.",
      "tip": "The pan goes into the oven cold, so give it the full time."
    },
    "barbacoa": {
      "servings": "5",
      "prep": "20 min",
      "cook": "9–10 hr LOW or 6 hr HIGH",
      "equipment": "6-quart or bigger crockpot",
      "ingredients": [
        "6 lb boneless beef chuck roast, cut in 8 big pieces — double batch, save half for Tuesday",
        "2 onions, chopped",
        "8 garlic cloves",
        "5 chipotle peppers in adobo + 3 Tbsp of the sauce",
        "Juice of 4 limes",
        "1 cup water + 1 tsp beef bouillon",
        "2 Tbsp cumin, 2 Tbsp oregano, 1 Tbsp salt",
        "3 bay leaves",
        "20 corn tortillas for tonight",
        "Chopped onion, cilantro, salsa and lime wedges"
      ],
      "steps": [
        {
          "title": "Thaw the meat 2 days ahead",
          "detail": "Saturday morning, move both bags of chuck roast (6 lb) from the freezer to the fridge on a plate. That much meat needs about 2 days. Never thaw it on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Season",
          "detail": "Rub the beef pieces with cumin, oregano and salt. Put them in the crockpot."
        },
        {
          "title": "Add the sauce",
          "detail": "Add the onions, garlic, chipotles, adobo sauce, lime juice, water with bouillon and bay leaves."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 9–10 hours on LOW or 6 hours on HIGH, until it shreds easily."
        },
        {
          "title": "Shred",
          "detail": "Take out the bay leaves. Shred the beef with 2 forks and stir it back into the juices."
        },
        {
          "title": "Serve half tonight",
          "detail": "Warm the tortillas. Fill with barbacoa and top with onion, cilantro, salsa and lime."
        },
        {
          "title": "Save half for Tuesday",
          "detail": "Within 2 hours of cooking, put the saved half in containers with lids, label them “Tuesday leftovers” and put them in the fridge. Eat within 3–4 days."
        }
      ],
      "doneness": "Beef is done when it pulls apart easily with a fork (it is safe well before that, at 145°F). Refrigerate leftovers within 2 hours.",
      "tip": "Double batch: save half with plenty of the juices so it stays moist when you reheat it."
    },
    "lo-barbacoa": {
      "servings": "5",
      "prep": "5 min",
      "cook": "About 15–30 min",
      "equipment": "Covered baking dish or pot, or microwave",
      "ingredients": [
        "Saved half of Monday’s barbacoa with its juices",
        "20 corn tortillas",
        "Chopped onion, cilantro, salsa and lime wedges"
      ],
      "steps": [
        {
          "title": "Reheat",
          "detail": "Put the barbacoa and its juices in a pot. Cover and heat on medium-low 10–15 minutes, stirring often, until steaming."
        },
        {
          "title": "Warm tortillas",
          "detail": "Warm the tortillas in a dry pan."
        },
        {
          "title": "Serve",
          "detail": "Fill with barbacoa and top with onion, cilantro, salsa and lime."
        }
      ],
      "doneness": "Reheat leftovers until steaming hot all the way through (165°F). Reheat only once; throw away anything older than 4 days.",
      "tip": "Add a splash of water if it looks dry."
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
        "Shredded cheese, sour cream and salsa"
      ],
      "steps": [
        {
          "title": "Thaw the meat the night before",
          "detail": "Move the chicken breasts from the freezer to the fridge the night before. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
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
        "2 lb ground beef",
        "1 onion, diced",
        "1 packet taco seasoning + 2/3 cup water",
        "1 can (16 oz) refried beans",
        "8 burrito-size flour tortillas",
        "1 large can (19 oz) red enchilada sauce",
        "3 cups shredded Mexican-blend cheese",
        "Shredded lettuce and sour cream"
      ],
      "steps": [
        {
          "title": "Thaw the meat the night before",
          "detail": "Move the ground beef from the freezer to the fridge the night before. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
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
          "detail": "Top with lettuce and sour cream."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "Make it the night before, cover and refrigerate. Add 10 minutes to the bake time."
    },
    "meatloaf": {
      "servings": "5",
      "prep": "20 min",
      "cook": "About 30 min",
      "equipment": "2 rimmed sheet pans, foil, big bowl",
      "ingredients": [
        "2.5 lb ground beef",
        "2 eggs",
        "3/4 cup breadcrumbs",
        "1/2 cup milk",
        "1 Tbsp onion powder, 1 tsp garlic powder, 1.5 tsp salt, 1/2 tsp pepper",
        "1 Tbsp Worcestershire sauce (optional)",
        "Glaze: 3/4 cup ketchup, 2 Tbsp brown sugar, 1 Tbsp mustard",
        "2 lb potatoes, cut in 1-inch cubes",
        "1 lb baby carrots",
        "2 Tbsp oil"
      ],
      "steps": [
        {
          "title": "Thaw the meat the night before",
          "detail": "Move the ground beef from the freezer to the fridge the night before. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Start the vegetables",
          "detail": "Heat the oven to 425°F. Toss the potatoes and carrots with the oil and 1 tsp salt on a foil-lined pan. Roast 15 minutes."
        },
        {
          "title": "Mix the meat",
          "detail": "In a big bowl, mix the beef, eggs, breadcrumbs, milk, spices and Worcestershire with your hands until just combined."
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
    "chilecolorado": {
      "servings": "5",
      "prep": "15 min",
      "cook": "8–9 hr LOW or 5 hr HIGH",
      "equipment": "6-quart crockpot, pot for rice",
      "ingredients": [
        "5 lb beef stew meat — double batch, save half for Sunday",
        "1/4 cup flour",
        "2 tsp cumin, 2 tsp oregano, 2 tsp salt",
        "2 onions, diced",
        "6 garlic cloves, minced",
        "2 cans (28 oz each) red chile sauce (like Las Palmas)",
        "2 cups white rice (tonight)",
        "2 cans refried beans, warmed (tonight)",
        "10 flour tortillas (tonight)"
      ],
      "steps": [
        {
          "title": "Thaw the meat 2 nights ahead",
          "detail": "Thursday night, move both bags of stew meat (5 lb) from the freezer to the fridge on a plate so they are fully thawed by Saturday morning. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Season",
          "detail": "Put the beef in the crockpot and toss it with the flour, cumin, oregano and salt."
        },
        {
          "title": "Add the sauce",
          "detail": "Add the onions and garlic. Pour both cans of red chile sauce over the top and stir."
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
      "tip": "Double batch: it tastes even better the second day."
    },
    "lo-chilecolorado": {
      "servings": "5",
      "prep": "5 min",
      "cook": "About 15–30 min",
      "equipment": "Covered baking dish or pot, or microwave",
      "ingredients": [
        "Saved half of Saturday’s chile colorado",
        "2 cups white rice",
        "2 cans refried beans",
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
