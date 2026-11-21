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
    "chickentinga": {
      "servings": "5",
      "prep": "10 min",
      "cook": "6 hr LOW or 3 hr HIGH",
      "equipment": "Crockpot, small pot for beans",
      "ingredients": [
        "2.5 lb boneless skinless chicken thighs",
        "1 onion, sliced",
        "3 garlic cloves, minced",
        "1 can (15 oz) fire-roasted diced tomatoes",
        "2 chipotle peppers in adobo, chopped, + 1 Tbsp of the sauce",
        "1/2 cup water + 1/2 tsp bouillon",
        "1 tsp oregano, 1 tsp cumin, 1 tsp salt",
        "15 tostadas",
        "2 cans refried beans, warmed",
        "Shredded lettuce, crema and crumbled queso fresco"
      ],
      "steps": [
        {
          "title": "Thaw the meat the night before",
          "detail": "Move the chicken thighs from the freezer to the fridge the night before. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Load the crockpot",
          "detail": "Put the onion and garlic in the crockpot. Lay the chicken on top. Add the tomatoes, chipotles, adobo sauce, water with bouillon, oregano, cumin and salt."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 6 hours on LOW or 3 hours on HIGH."
        },
        {
          "title": "Shred",
          "detail": "Shred the chicken with 2 forks right in the sauce and stir."
        },
        {
          "title": "Serve",
          "detail": "Spread warm refried beans on each tostada, add chicken, then lettuce, crema and queso fresco."
        }
      ],
      "doneness": "Chicken is done at 165°F. It should shred easily with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "Chipotles are spicy. Use 1 pepper if the family likes it milder."
    },
    "ovenburgers": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 25 min",
      "equipment": "2 rimmed sheet pans, foil",
      "ingredients": [
        "2.5 lb ground beef (makes 10 patties, 2 per person)",
        "1.5 tsp salt, 1 tsp pepper, 1 tsp garlic powder",
        "10 slices American cheese",
        "10 hamburger buns",
        "Lettuce, 2 tomatoes, 1 onion and pickles, sliced",
        "Ketchup and mustard",
        "2 bags (2 lb each) frozen french fries"
      ],
      "steps": [
        {
          "title": "Thaw the meat the night before",
          "detail": "Move the ground beef from the freezer to the fridge the night before. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Start the fries",
          "detail": "Heat the oven to 425°F. Spread the fries on a foil-lined pan and bake as the bag says (usually 20–25 minutes). Stir once halfway."
        },
        {
          "title": "Make patties",
          "detail": "Split the beef into 10 equal balls and press each flat, a little wider than a bun. Set them on the second foil-lined pan. Sprinkle with salt, pepper and garlic powder."
        },
        {
          "title": "Bake",
          "detail": "Bake the patties 12–15 minutes."
        },
        {
          "title": "Add cheese",
          "detail": "Put a cheese slice on each patty and bake 1 more minute to melt."
        },
        {
          "title": "Build",
          "detail": "Toast the buns if you like. Add a patty, lettuce, tomato, onion, pickles, ketchup and mustard."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink in the middle.",
      "tip": "Press a small dent in the middle of each patty so it stays flat while it bakes."
    },
    "potroast": {
      "servings": "5",
      "prep": "15 min",
      "cook": "8–9 hr LOW or 5–6 hr HIGH",
      "equipment": "6-quart crockpot",
      "ingredients": [
        "3 lb boneless beef chuck roast",
        "2 lb potatoes, cut in big chunks",
        "1 lb baby carrots",
        "1 onion, cut in wedges",
        "1 packet dry onion soup mix",
        "1 cup water + 1 tsp beef bouillon",
        "1 Tbsp Worcestershire sauce (optional)",
        "1/2 tsp pepper",
        "2 Tbsp cornstarch + 2 Tbsp cold water (for gravy)"
      ],
      "steps": [
        {
          "title": "Thaw the meat a full day ahead",
          "detail": "The morning of the day before, move the chuck roast from the freezer to the fridge on a plate. A big piece needs about 24 hours. Never thaw it on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Vegetables first",
          "detail": "Put the potatoes, carrots and onion in the bottom of the crockpot."
        },
        {
          "title": "Add the roast",
          "detail": "Set the roast on top. Sprinkle the onion soup mix and pepper over it. Pour the water with bouillon and the Worcestershire around it."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 8–9 hours on LOW or 5–6 hours on HIGH, until the beef falls apart."
        },
        {
          "title": "Make gravy (optional)",
          "detail": "Move the meat and vegetables to a platter. Stir the cornstarch and cold water together, stir it into the liquid in the crockpot, turn it to HIGH and cook 10 minutes until thick."
        },
        {
          "title": "Serve",
          "detail": "Pull the beef into chunks and serve with the vegetables and gravy."
        }
      ],
      "doneness": "Beef is done when it pulls apart easily with a fork (it is safe well before that, at 145°F). Refrigerate leftovers within 2 hours.",
      "tip": "Do not lift the lid while it cooks. Every peek adds about 20 minutes."
    },
    "bakedziti": {
      "servings": "5",
      "prep": "20 min",
      "cook": "About 25 min in the oven",
      "equipment": "Big pot, skillet, 9x13 baking dish",
      "ingredients": [
        "2 lb ground beef",
        "1 lb ziti or penne pasta",
        "2 jars (24 oz each) marinara sauce",
        "1 tsp garlic powder, 1 tsp Italian seasoning or oregano, 1/2 tsp salt",
        "2 cups shredded mozzarella",
        "1/2 cup grated parmesan",
        "1 bag salad and 1 loaf French bread on the side"
      ],
      "steps": [
        {
          "title": "Thaw the meat the night before",
          "detail": "Move the ground beef from the freezer to the fridge the night before. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Boil the pasta",
          "detail": "Heat the oven to 375°F. Boil the pasta in salted water 2 minutes less than the box says. Drain."
        },
        {
          "title": "Brown the beef",
          "detail": "While the pasta cooks, brown the beef in a big skillet until no pink remains. Drain the fat. Stir in the marinara, garlic powder, seasoning and salt."
        },
        {
          "title": "Mix and top",
          "detail": "Stir the pasta into the sauce. Pour it into the 9x13 dish. Cover the top with mozzarella and parmesan."
        },
        {
          "title": "Bake",
          "detail": "Bake 20–25 minutes until the cheese melts and bubbles."
        },
        {
          "title": "Serve",
          "detail": "Serve with the bagged salad and sliced French bread."
        }
      ],
      "doneness": "Ground beef is done at 160°F with no pink. Refrigerate leftovers within 2 hours.",
      "tip": "Undercooking the pasta a little keeps it from getting mushy in the oven."
    },
    "barbacoa": {
      "servings": "5",
      "prep": "15 min",
      "cook": "8–10 hr LOW or 5–6 hr HIGH",
      "equipment": "6-quart crockpot",
      "ingredients": [
        "3 lb boneless beef chuck roast, cut in 4 big pieces",
        "1 onion, chopped",
        "4 garlic cloves",
        "3 chipotle peppers in adobo + 2 Tbsp of the sauce",
        "Juice of 2 limes",
        "1/2 cup water + 1/2 tsp beef bouillon",
        "1 Tbsp cumin, 1 Tbsp oregano, 1.5 tsp salt",
        "2 bay leaves",
        "20 corn tortillas",
        "Chopped onion, cilantro, salsa and lime wedges"
      ],
      "steps": [
        {
          "title": "Thaw the meat a full day ahead",
          "detail": "The morning of the day before, move the chuck roast from the freezer to the fridge on a plate. A big piece needs about 24 hours. Never thaw it on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Season",
          "detail": "Rub the beef pieces with cumin, oregano and salt. Put them in the crockpot."
        },
        {
          "title": "Add the sauce",
          "detail": "Add the onion, garlic, chipotles, adobo sauce, lime juice, water with bouillon and bay leaves."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 8–10 hours on LOW or 5–6 hours on HIGH, until it shreds easily."
        },
        {
          "title": "Shred",
          "detail": "Take out the bay leaves. Shred the beef with 2 forks and stir it back into the juices."
        },
        {
          "title": "Serve",
          "detail": "Warm the tortillas. Fill with barbacoa and top with onion, cilantro, salsa and lime."
        }
      ],
      "doneness": "Beef is done when it pulls apart easily with a fork (it is safe well before that, at 145°F). Refrigerate leftovers within 2 hours.",
      "tip": "Leftover barbacoa makes great burritos or quesadillas for lunch."
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
    "beefbroccoli": {
      "servings": "5",
      "prep": "15 min",
      "cook": "5–6 hr LOW or 3 hr HIGH",
      "equipment": "Crockpot, pot for rice",
      "ingredients": [
        "2.5 lb boneless beef chuck (roast or steaks), sliced in thin strips",
        "1 cup water + 1 tsp beef bouillon",
        "2/3 cup soy sauce (low sodium if you have it)",
        "1/3 cup brown sugar",
        "4 garlic cloves, minced",
        "1 tsp ground ginger",
        "1 Tbsp sesame oil (optional)",
        "3 Tbsp cornstarch + 3 Tbsp cold water",
        "2 lb frozen broccoli florets",
        "2.5 cups white rice"
      ],
      "steps": [
        {
          "title": "Thaw the meat a full day ahead",
          "detail": "The morning of the day before, move the beef chuck from the freezer to the fridge on a plate. A big piece needs about 24 hours. Never thaw it on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Slice the beef",
          "detail": "Slice the beef across the grain into thin strips. It is easiest while it is still a little frozen."
        },
        {
          "title": "Load the crockpot",
          "detail": "Stir the water with bouillon, soy sauce, brown sugar, garlic, ginger and sesame oil in the crockpot. Add the beef and stir."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 5–6 hours on LOW or 3 hours on HIGH."
        },
        {
          "title": "Thicken and add broccoli",
          "detail": "30 minutes before dinner, turn to HIGH. Stir the cornstarch and cold water together and stir it in. Add the frozen broccoli, cover and cook 30 minutes."
        },
        {
          "title": "Rice and serve",
          "detail": "Make the rice: 5 cups water, 1 tsp salt, 2.5 cups rice, cover, low heat 18 minutes. Serve the beef and broccoli over rice."
        }
      ],
      "doneness": "Beef is done when it pulls apart easily with a fork (it is safe well before that, at 145°F). Refrigerate leftovers within 2 hours.",
      "tip": "If you can, ask the meat counter to slice the chuck thin before you freeze it."
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
    "caldores": {
      "servings": "5",
      "prep": "20 min",
      "cook": "8 hr LOW",
      "equipment": "6-quart or bigger crockpot, pot for rice",
      "ingredients": [
        "3.5 lb bone-in beef shank (chamorro)",
        "1 onion, cut in half",
        "4 garlic cloves",
        "1 can (8 oz) tomato sauce",
        "1 Tbsp beef bouillon (caldo de res) + 2 tsp salt",
        "2 bay leaves",
        "7 cups water",
        "3 potatoes, cut in big chunks",
        "1 lb baby carrots",
        "4 frozen corn-on-the-cob pieces",
        "1/2 small cabbage, cut in wedges",
        "1.5 cups rice, cilantro, limes, tortillas"
      ],
      "steps": [
        {
          "title": "Thaw the meat a full day ahead",
          "detail": "The morning of the day before, move the beef shank from the freezer to the fridge on a plate. A big piece needs about 24 hours. Never thaw it on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Load the crockpot",
          "detail": "Put the shank, onion, garlic, tomato sauce, bouillon, salt and bay leaves in the crockpot. Add the potatoes, carrots and corn. Pour in the water (stop about 1 inch from the top)."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 8 hours on LOW, until the meat falls off the bone."
        },
        {
          "title": "Add cabbage",
          "detail": "45 minutes before dinner, turn to HIGH and push the cabbage wedges into the soup."
        },
        {
          "title": "Make rice",
          "detail": "Cook 1.5 cups rice with 3 cups water and 1 tsp salt, covered on low, 18 minutes."
        },
        {
          "title": "Serve",
          "detail": "Take out the bones and bay leaves. Taste and add salt if needed. Serve in bowls with rice, cilantro, lime and warm tortillas."
        }
      ],
      "doneness": "Beef is done when it pulls apart easily with a fork (it is safe well before that, at 145°F). Refrigerate leftovers within 2 hours.",
      "tip": "Fill bowls with plenty of broth, meat and vegetables. The bone marrow is a treat for anyone who likes it."
    },
    "chilecolorado": {
      "servings": "5",
      "prep": "10 min",
      "cook": "8 hr LOW or 4–5 hr HIGH",
      "equipment": "Crockpot, pot for rice",
      "ingredients": [
        "2.5 lb beef stew meat",
        "2 Tbsp flour",
        "1 tsp cumin, 1 tsp oregano, 1 tsp salt",
        "1 onion, diced",
        "3 garlic cloves, minced",
        "1 can (28 oz) red chile sauce (like Las Palmas)",
        "2 cups white rice",
        "2 cans refried beans, warmed",
        "10 flour tortillas"
      ],
      "steps": [
        {
          "title": "Thaw the meat the night before",
          "detail": "Move the stew meat from the freezer to the fridge the night before. Set it on a plate to catch drips. Never thaw meat on the counter, and never put frozen meat in the crockpot."
        },
        {
          "title": "Season",
          "detail": "Put the beef in the crockpot and toss it with the flour, cumin, oregano and salt."
        },
        {
          "title": "Add the sauce",
          "detail": "Add the onion and garlic. Pour the red chile sauce over the top and stir."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook 8 hours on LOW or 4–5 hours on HIGH, until the beef is tender."
        },
        {
          "title": "Rice",
          "detail": "Make the rice: 4 cups water, 1 tsp salt, 2 cups rice, covered on low, 18 minutes."
        },
        {
          "title": "Serve",
          "detail": "Serve the chile colorado with rice, refried beans and warm tortillas."
        }
      ],
      "doneness": "Beef is done when it pulls apart easily with a fork (it is safe well before that, at 145°F). Refrigerate leftovers within 2 hours.",
      "tip": "Leftovers make great burritos the next day."
    }
  },
  "sundayByWeek": {}
};
});
