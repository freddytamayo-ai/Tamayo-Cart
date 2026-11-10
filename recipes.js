/* Tamayo Cart — step-by-step recipes for every dinner.
 * Plain cooking instructions only. No prices, budgets, or account data.
 * Shape: { version, byMeal: { mealId: recipe }, sundayByWeek: { '1'| '2': recipe } }
 * recipe: { servings, prep, cook, equipment, ingredients[], steps[{title,detail}], doneness, tip }
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TamayoRecipes = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  return {
  "version": 2,
  "byMeal": {
    "salsabeef": {
      "servings": "5",
      "prep": "10 min",
      "cook": "About 25 min",
      "equipment": "Large pot or deep skillet",
      "ingredients": [
        "1 lb ground beef",
        "1 jar salsa (16 oz)",
        "1 tsp chili powder",
        "1 tsp garlic powder",
        "1 tsp onion powder",
        "Tortillas or rice, beans, cheese, lettuce"
      ],
      "steps": [
        {
          "title": "Brown the beef",
          "detail": "Put ground beef in a large pot over medium heat. Break it up with a spoon and cook until no pink remains. Drain extra fat."
        },
        {
          "title": "Simmer in salsa",
          "detail": "Stir in the salsa, chili powder, garlic powder, and onion powder. Simmer 10 minutes, stirring once or twice. Add a splash of water if it looks dry."
        },
        {
          "title": "Serve",
          "detail": "Spoon into tortillas or over rice. Add beans, cheese, and lettuce."
        }
      ],
      "doneness": "Ground beef is done when no pink remains (160°F). Fridge leftovers within 2 hours.",
      "tip": "One pot and about 25 minutes — start it when you get home and dinner is ready without a long wait."
    },
    "tingabeef": {
      "servings": "5",
      "prep": "10 min",
      "cook": "About 30 min",
      "equipment": "Large pot or deep skillet",
      "ingredients": [
        "1 lb ground beef",
        "1 onion, diced",
        "4 garlic cloves (or 1 Tbsp jarred garlic)",
        "1 tsp cumin",
        "1 tsp oregano",
        "1/2 tsp salt",
        "1/4 tsp black pepper",
        "1 can fire-roasted diced tomatoes",
        "2 chipotle peppers in adobo + 1 Tbsp of the sauce",
        "Tostadas, shredded lettuce, crema or sour cream, avocado"
      ],
      "steps": [
        {
          "title": "Brown the beef",
          "detail": "Cook ground beef with the diced onion and garlic over medium heat until the beef has no pink left. Drain extra fat."
        },
        {
          "title": "Simmer the sauce",
          "detail": "Stir in cumin, oregano, salt, pepper, the can of tomatoes (with juice), the 2 chipotle peppers (chopped), and 1 Tbsp of the adobo sauce. Simmer 15 minutes, stirring a few times."
        },
        {
          "title": "Taste",
          "detail": "Taste and add a pinch more salt if needed."
        },
        {
          "title": "Serve",
          "detail": "Warm tostadas in a dry pan or oven for 1–2 minutes. Spoon tinga on each tostada. Top with lettuce, crema, and sliced avocado."
        }
      ],
      "doneness": "Ground beef is done when no pink remains (160°F). Do not leave cooked beef sitting out more than 2 hours.",
      "tip": "Chipotles are spicy — use 1 pepper the first time if the family likes milder food."
    },
    "carnitas": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 4–5 hr on HIGH (about 4.5–5.5 hr total)",
      "equipment": "Crockpot, forks for shredding, optional broiler",
      "ingredients": [
        "2 lb pork butt or shoulder, cut in chunks",
        "1 onion, sliced",
        "4 garlic cloves, smashed",
        "2 cinnamon sticks",
        "1 tsp oregano",
        "1 tsp cumin",
        "1 tsp salt",
        "1/2 tsp black pepper",
        "1/2 tsp chipotle powder (or chili powder)",
        "Juice of 2 oranges (or 1/2 cup orange juice)",
        "Corn tortillas, diced onion, cilantro, lime wedges"
      ],
      "steps": [
        {
          "title": "Load the crockpot",
          "detail": "Add pork chunks, onion, garlic, cinnamon sticks, oregano, cumin, salt, pepper, chipotle powder, and orange juice. Stir to coat."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook on HIGH 4–5 hours (or LOW 7–8 hours) until pork shreds easily."
        },
        {
          "title": "Shred",
          "detail": "Remove cinnamon sticks. Shred pork with two forks in the juices. Taste and salt if needed."
        },
        {
          "title": "Optional crisp",
          "detail": "For crispy edges: spread some shredded pork on a sheet pan and broil 3–5 minutes, watching closely so it does not burn."
        },
        {
          "title": "Serve",
          "detail": "Warm corn tortillas. Fill with carnitas, diced onion, cilantro, and a squeeze of lime."
        }
      ],
      "doneness": "Pork is done when it shreds easily. Keep leftovers in the fridge within 2 hours.",
      "tip": "Ask the meat counter to cut the pork into chunks — less knife work at home."
    },
    "pozole": {
      "servings": "5",
      "prep": "10 min",
      "cook": "About 8.5 hr on LOW or 4–4.5 hr on HIGH",
      "equipment": "Crockpot",
      "ingredients": [
        "1.5 lb boneless chicken thighs",
        "1 white onion, chopped",
        "1 poblano pepper, seeded and chopped",
        "1 tsp chili powder",
        "1 jar (16 oz) salsa verde",
        "2 cups water",
        "2 cans hominy, drained and rinsed",
        "Cilantro and 1 lime",
        "Shredded cabbage and tostadas on the side"
      ],
      "steps": [
        {
          "title": "Load in the morning",
          "detail": "Add chicken thighs, onion, poblano, chili powder, salsa verde, and water to the crockpot. Stir."
        },
        {
          "title": "Cook",
          "detail": "Cook on LOW about 8–8.5 hours or HIGH 4–4.5 hours until chicken shreds easily."
        },
        {
          "title": "Finish the soup",
          "detail": "Shred chicken in the pot. Stir in drained hominy and warm 15–20 more minutes. Add chopped cilantro and lime juice."
        },
        {
          "title": "Serve",
          "detail": "Ladle into bowls. Top with shredded cabbage. Serve tostadas on the side for scooping."
        }
      ],
      "doneness": "Chicken thighs should reach 165°F and shred easily. Soup must be piping hot.",
      "tip": "A parent can load this on LOW in the morning so it is ready after school."
    },
    "tacobeef": {
      "servings": "5",
      "prep": "10 min",
      "cook": "About 6–8 hr on LOW",
      "equipment": "Crockpot",
      "ingredients": [
        "1.5 lb boneless beef chuck or shoulder roast, cut in chunks",
        "1 Tbsp chili powder",
        "2 tsp cumin",
        "1 tsp oregano",
        "1/4 tsp red pepper flakes",
        "1 tsp salt",
        "3 garlic cloves, minced",
        "Flour or corn tortillas and toppings (cheese, lettuce, salsa, sour cream)"
      ],
      "steps": [
        {
          "title": "Load the crockpot",
          "detail": "Add beef chunks, chili powder, cumin, oregano, red pepper flakes, salt, and garlic. Toss to coat. No broth needed — the beef makes its own juices."
        },
        {
          "title": "Cook low and slow",
          "detail": "Cook on LOW 6–8 hours until beef shreds easily. Start checking at 6 hours."
        },
        {
          "title": "Shred",
          "detail": "Shred beef in the juices. Taste and add salt if needed."
        },
        {
          "title": "Serve",
          "detail": "Serve with warm tortillas and toppings."
        }
      ],
      "doneness": "Beef chuck is done when it shreds with little effort. Fridge any leftover meat within 2 hours.",
      "tip": "Ask the butcher to cut the roast into chunks — less knife work at home."
    },
    "bbqbeef": {
      "servings": "5",
      "prep": "10 min",
      "cook": "About 25 min",
      "equipment": "Large skillet",
      "ingredients": [
        "1.25 lb ground beef",
        "1 tsp smoked paprika",
        "1 tsp garlic powder",
        "1 tsp salt",
        "1/2 tsp black pepper",
        "1 large bottle BBQ sauce",
        "Hamburger buns (1 pack of 8; use 5)",
        "1 bag coleslaw mix (dress per bag or use a bottled slaw dressing)"
      ],
      "steps": [
        {
          "title": "Brown the beef",
          "detail": "Cook ground beef in a skillet over medium heat, breaking it up, until no pink remains. Drain extra fat."
        },
        {
          "title": "Season and sauce",
          "detail": "Stir in paprika, garlic powder, salt, and pepper. Add enough BBQ sauce to coat (save some for serving). Simmer 8–10 minutes, stirring once or twice."
        },
        {
          "title": "Slaw",
          "detail": "Toss coleslaw mix with dressing while the beef simmers."
        },
        {
          "title": "Serve",
          "detail": "Pile beef on buns and add a scoop of slaw (or serve slaw on the side)."
        }
      ],
      "doneness": "Ground beef is done when no pink remains (160°F). Sauce should look thick enough to stay on the bun.",
      "tip": "This is one of the easiest nights — almost no chopping."
    },
    "whitechili": {
      "servings": "5",
      "prep": "10 min",
      "cook": "4 hr on HIGH or 8 hr on LOW",
      "equipment": "Crockpot, forks for shredding",
      "ingredients": [
        "1 onion, diced",
        "2 garlic cloves, minced",
        "1.5 lb chicken breast",
        "2 cans cannellini beans, drained and rinsed",
        "1 can pinto beans, drained and rinsed",
        "1 tsp cumin",
        "1 tsp oregano",
        "1/2 tsp black pepper",
        "1 jar (16 oz) salsa verde",
        "2 cups chicken broth",
        "Shredded cheese and tortilla chips for topping"
      ],
      "steps": [
        {
          "title": "Load the crockpot",
          "detail": "Add onion, garlic, chicken, both kinds of beans, cumin, oregano, pepper, salsa verde, and chicken broth. Stir gently."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook on HIGH 4 hours or LOW 8 hours."
        },
        {
          "title": "Shred chicken",
          "detail": "Remove chicken, shred with two forks, return to the pot, and stir. If it is too thick, splash in a little more broth or water."
        },
        {
          "title": "Serve",
          "detail": "Ladle into bowls. Top with shredded cheese and crushed tortilla chips."
        }
      ],
      "doneness": "Chicken must reach 165°F before shredding. Chili should be steaming hot.",
      "tip": "Rinse the canned beans — it cuts the salty canned taste."
    },
    "beeftacosoup": {
      "servings": "5",
      "prep": "10 min",
      "cook": "3–4 hr on HIGH or 6–8 hr on LOW",
      "equipment": "Skillet (to brown beef), crockpot",
      "ingredients": [
        "1 lb ground beef",
        "1 onion, diced",
        "2 garlic cloves, minced",
        "1 tsp chili powder",
        "1 tsp cumin",
        "1/2 tsp smoked paprika",
        "1 can fire-roasted tomatoes",
        "1 can diced tomatoes with green chiles",
        "1 can black beans, drained and rinsed",
        "1 cup frozen corn",
        "4 cups beef broth (one 32 oz carton)",
        "Tortilla chips, avocado, sour cream, lime"
      ],
      "steps": [
        {
          "title": "Brown the beef",
          "detail": "Brown ground beef with onion and garlic in a skillet until no pink remains. Drain extra fat."
        },
        {
          "title": "Load the crockpot",
          "detail": "Add the beef mix, spices, both tomato cans, black beans, corn, and beef broth to the crockpot. Stir."
        },
        {
          "title": "Cook",
          "detail": "Cover and cook on HIGH 3–4 hours or LOW 6–8 hours."
        },
        {
          "title": "Serve",
          "detail": "Taste for salt. Ladle into bowls. Top with crushed tortilla chips, avocado, sour cream, and a squeeze of lime."
        }
      ],
      "doneness": "Ground beef must be fully browned (no pink, 160°F) before it goes in the crockpot. Soup should be steaming hot.",
      "tip": "Keep toppings on the side so leftovers stay crisp-friendly."
    },
    "teriyaki": {
      "servings": "5",
      "prep": "10 min",
      "cook": "4 hr on HIGH or 8 hr on LOW",
      "equipment": "Crockpot, small bowl for cornstarch slurry, pot for rice",
      "ingredients": [
        "20 oz can pineapple chunks in juice",
        "1/4 cup soy sauce",
        "2 Tbsp brown sugar",
        "2 garlic cloves, minced",
        "1 tsp grated ginger (or 1/2 tsp ground)",
        "5–6 skinless chicken thighs",
        "1.5 Tbsp cornstarch mixed with 2 Tbsp cold water",
        "Green onions and cooked rice"
      ],
      "steps": [
        {
          "title": "Load",
          "detail": "Add pineapple with its juice, soy sauce, brown sugar, garlic, ginger, and chicken thighs to the crockpot. Stir to coat."
        },
        {
          "title": "Cook",
          "detail": "Cook on HIGH 4 hours or LOW 8 hours until chicken is tender."
        },
        {
          "title": "Thicken",
          "detail": "Stir in the cornstarch slurry. Cook on HIGH 10–15 more minutes until the sauce thickens a bit."
        },
        {
          "title": "Serve",
          "detail": "Serve over rice. Top with sliced green onions."
        }
      ],
      "doneness": "Chicken thighs to 165°F. Sauce should look glossy, not watery.",
      "tip": "Start the rice when you add the cornstarch so everything finishes together."
    },
    "chili": {
      "servings": "5",
      "prep": "10 min",
      "cook": "3–4 hr on HIGH or 6–8 hr on LOW",
      "equipment": "Skillet (to brown beef), crockpot",
      "ingredients": [
        "1 lb ground beef",
        "1 onion, diced",
        "1 green bell pepper, diced",
        "2 garlic cloves, minced",
        "1 Tbsp tomato paste",
        "2 cans diced tomatoes (one with green chiles)",
        "1 can kidney beans, drained",
        "1 can pinto beans, drained",
        "1 cup beef broth",
        "2 Tbsp chili powder",
        "1 tsp cumin",
        "1 tsp garlic powder",
        "1 tsp onion powder",
        "1 tsp brown sugar",
        "Salt and pepper"
      ],
      "steps": [
        {
          "title": "Brown the beef",
          "detail": "In a skillet, brown ground beef with onion, bell pepper, and garlic. Drain extra fat. Stir in tomato paste for 1 minute."
        },
        {
          "title": "Load the crockpot",
          "detail": "Dump the beef mix into the crockpot. Add tomatoes, beans, broth, and all spices. Stir."
        },
        {
          "title": "Cook",
          "detail": "Cook on HIGH 3–4 hours or LOW 6–8 hours."
        },
        {
          "title": "Serve",
          "detail": "Taste for salt. Serve with cheese, chips, or rice if you like."
        }
      ],
      "doneness": "Ground beef must be fully browned (no pink) before it goes in. Chili should be steaming hot when served.",
      "tip": "Brown the beef the night before and fridge it to make morning load faster."
    },
    "fajitas": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 25–30 min (about 55 min total with prep)",
      "equipment": "Sheet pan, oven",
      "ingredients": [
        "1.5 lb chicken breast, cut in strips (or pre-cut stir-fry strips)",
        "3–4 bell peppers, sliced",
        "2 onions, sliced (or pre-sliced fajita veggies)",
        "1 Tbsp chili powder",
        "1 tsp paprika",
        "1 tsp onion powder",
        "1 tsp garlic powder",
        "1 tsp cumin",
        "1 tsp salt",
        "1/2 tsp sugar",
        "2 Tbsp oil",
        "1 lime",
        "Flour tortillas and sour cream"
      ],
      "steps": [
        {
          "title": "Heat the oven",
          "detail": "Heat oven to 425°F. Line a big sheet pan with foil."
        },
        {
          "title": "Season everything",
          "detail": "On the pan, toss chicken strips, peppers, and onions with oil and all the spices (or one fajita packet). Spread in a single layer — use two pans if crowded."
        },
        {
          "title": "Roast",
          "detail": "Roast 20–25 minutes, stirring once, until chicken hits 165°F and peppers are soft with browned edges."
        },
        {
          "title": "Finish",
          "detail": "Squeeze lime over the pan. Warm tortillas. Serve with sour cream."
        }
      ],
      "doneness": "Chicken strips must reach 165°F. No pink in the middle.",
      "tip": "Pre-cut fajita veggies and chicken strips cut the prep almost in half."
    },
    "kielbasa": {
      "servings": "5",
      "prep": "10 min",
      "cook": "About 45 min",
      "equipment": "Sheet pan, oven",
      "ingredients": [
        "2 lb small red potatoes, halved",
        "2 packs kielbasa, sliced into coins",
        "1 onion, sliced",
        "1 lb frozen green beans",
        "2–3 Tbsp olive oil",
        "Steak seasoning (or salt, pepper, garlic powder)"
      ],
      "steps": [
        {
          "title": "Heat oven",
          "detail": "Heat oven to 400°F. Line a sheet pan with foil."
        },
        {
          "title": "Season potatoes first",
          "detail": "Toss potatoes and onion with oil and steak seasoning. Spread on the pan. Roast 20 minutes."
        },
        {
          "title": "Add kielbasa and beans",
          "detail": "Add kielbasa coins and frozen green beans. Toss everything. Roast 20–25 more minutes until potatoes are tender and kielbasa is browned."
        },
        {
          "title": "Serve",
          "detail": "Taste for salt. Serve straight from the pan."
        }
      ],
      "doneness": "Potatoes should pierce easily with a fork. Kielbasa is pre-cooked — heat until hot and browned.",
      "tip": "Frozen green beans go on in the second half so they do not get mushy."
    },
    "honeymustard": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 45 min",
      "equipment": "Sheet pan, oven, small bowl",
      "ingredients": [
        "2 Tbsp mayo",
        "2 Tbsp Dijon mustard",
        "1 Tbsp yellow mustard",
        "2 Tbsp honey",
        "1 tsp cider vinegar",
        "1 tsp garlic powder",
        "1/2 tsp paprika",
        "Salt and pepper",
        "2 lb boneless chicken thighs",
        "1.5 lb red potatoes, halved",
        "1 red onion, wedges",
        "About 12 oz green beans and 8 oz baby carrots",
        "Oil"
      ],
      "steps": [
        {
          "title": "Heat oven",
          "detail": "Heat oven to 400°F. Line a sheet pan with foil and oil it lightly."
        },
        {
          "title": "Mix the sauce",
          "detail": "Stir mayo, both mustards, honey, vinegar, garlic powder, paprika, salt, and pepper in a bowl."
        },
        {
          "title": "Arrange and coat",
          "detail": "Spread potatoes, onion, green beans, and carrots on the pan. Nestle chicken thighs among the veggies. Brush chicken with the honey mustard. Drizzle veggies with a little oil and salt."
        },
        {
          "title": "Bake",
          "detail": "Bake about 40–45 minutes until chicken hits 165°F and potatoes are tender."
        }
      ],
      "doneness": "Chicken thighs to 165°F. Potatoes fork-tender.",
      "tip": "If veggies brown too fast, tent the pan with foil for the last 10 minutes."
    },
    "drumsticks": {
      "servings": "5",
      "prep": "5–10 min",
      "cook": "About 45 min",
      "equipment": "Sheet pan, oven, pot for rice",
      "ingredients": [
        "10 chicken drumsticks (about 3.5 lb, 2 per person)",
        "1 tsp smoked paprika",
        "1 tsp garlic powder",
        "1 tsp onion powder",
        "1 tsp oregano",
        "1 tsp salt",
        "1/2 tsp black pepper",
        "1–2 Tbsp oil",
        "White rice (about 2 cups dry for 5 people)",
        "1 bag frozen green beans"
      ],
      "steps": [
        {
          "title": "Heat the oven",
          "detail": "Heat oven to 425°F. Line a sheet pan with foil for easier cleanup."
        },
        {
          "title": "Season the chicken",
          "detail": "Pat drumsticks dry with paper towels. Toss with oil, paprika, garlic powder, onion powder, oregano, salt, and pepper until coated. Spread in a single layer on the pan."
        },
        {
          "title": "Bake",
          "detail": "Bake about 40–45 minutes, flipping once halfway, until the thickest part hits 165°F and juices run clear (not pink)."
        },
        {
          "title": "Cook rice and beans",
          "detail": "While chicken bakes, cook rice per package directions. Steam or microwave frozen green beans with a pinch of salt until hot."
        },
        {
          "title": "Serve",
          "detail": "Plate drumsticks with rice and green beans. Wash anything that touched raw chicken."
        }
      ],
      "doneness": "Drumsticks must reach 165°F at the thickest part near the bone. No pink juice.",
      "tip": "Drying the skin first helps it crisp. Do not rinse raw chicken — just pat dry."
    },
    "tortillacasserole": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 35–40 min bake (about 50 min total)",
      "equipment": "9×13 baking dish, oven, mixing bowl",
      "ingredients": [
        "3 cups shredded rotisserie chicken",
        "1 taco seasoning packet",
        "1 can (4 oz) diced green chiles",
        "2 cups frozen corn",
        "1 can (10 oz) red enchilada sauce",
        "8 corn tortillas, cut in half",
        "2 cups shredded Mexican-blend cheese"
      ],
      "steps": [
        {
          "title": "Heat the oven",
          "detail": "Heat oven to 375°F. Lightly grease a 9×13 baking dish."
        },
        {
          "title": "Mix the filling",
          "detail": "In a big bowl, stir shredded chicken, taco seasoning, green chiles, frozen corn, and about half the enchilada sauce until coated."
        },
        {
          "title": "Layer",
          "detail": "Spread a thin spoon of enchilada sauce on the bottom of the dish. Lay half the tortilla halves to cover. Add half the chicken mix, then half the cheese. Repeat with remaining tortillas, chicken, sauce, and cheese on top."
        },
        {
          "title": "Bake",
          "detail": "Bake uncovered 35–40 minutes until the cheese is melted and bubbly and the center is hot."
        },
        {
          "title": "Rest and serve",
          "detail": "Let it sit 5 minutes so it slices cleaner. Serve with salsa or sour cream if you have them."
        }
      ],
      "doneness": "Center should be steaming hot (about 165°F). Cheese melted and edges lightly browned.",
      "tip": "Shred rotisserie chicken while it is still warm — it is easier."
    },
    "burritocasserole": {
      "servings": "5",
      "prep": "10 min (if beef and rice are already cooked)",
      "cook": "About 35–40 min bake (about 50 min total)",
      "equipment": "9×13 baking dish, oven",
      "ingredients": [
        "1/2–1 lb ground beef, browned and drained",
        "4 cups cooked white rice",
        "1 can black beans, drained and rinsed",
        "1 jar (16 oz) salsa",
        "2 green onions, sliced",
        "1 tsp chili powder",
        "4 oz cream cheese, cubed",
        "1 cup shredded cheddar"
      ],
      "steps": [
        {
          "title": "Heat the oven",
          "detail": "Heat oven to 375°F. Grease a 9×13 dish."
        },
        {
          "title": "Mix",
          "detail": "In the dish or a big bowl, mix cooked beef, rice, black beans, salsa, green onions, chili powder, and cream cheese cubes until mostly combined."
        },
        {
          "title": "Top and bake",
          "detail": "Spread in the dish. Sprinkle cheddar on top. Bake 35–40 minutes until hot and cheese is melted."
        },
        {
          "title": "Rest",
          "detail": "Wait 5 minutes, then scoop into bowls."
        }
      ],
      "doneness": "Center should be steaming hot (165°F). Cream cheese should be melted into the rice.",
      "tip": "Brown the beef and cook the rice on Sunday so this night is mostly dump-and-bake."
    },
    "tacocasserole": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 45 min",
      "equipment": "Skillet, 9×13 baking dish, oven",
      "ingredients": [
        "1 lb ground beef",
        "1/2 onion, diced",
        "1 green bell pepper, diced",
        "1 Tbsp chili powder",
        "1 tsp cumin",
        "1 tsp paprika",
        "1/2 tsp oregano",
        "Salt and pepper",
        "16 oz salsa",
        "1 can black beans, drained",
        "2 cups shredded cheddar",
        "6 burrito-size flour tortillas"
      ],
      "steps": [
        {
          "title": "Heat oven and brown beef",
          "detail": "Heat oven to 375°F. Brown beef with onion and bell pepper. Drain. Stir in spices, then most of the salsa and the black beans."
        },
        {
          "title": "Layer",
          "detail": "In a greased 9×13, layer tortillas, beef mix, and cheese. Repeat, ending with cheese. Spoon a little leftover salsa on top."
        },
        {
          "title": "Bake",
          "detail": "Bake about 25–30 minutes until bubbly and hot in the center."
        },
        {
          "title": "Rest",
          "detail": "Cool 5 minutes, then cut into squares."
        }
      ],
      "doneness": "Beef fully browned before baking. Casserole center steaming hot (165°F).",
      "tip": "Warm tortillas 10 seconds so they do not crack when you layer them."
    },
    "beefbowls": {
      "servings": "5",
      "prep": "10 min",
      "cook": "About 30 min",
      "equipment": "Large pot with lid",
      "ingredients": [
        "1 lb ground beef",
        "1 cup beef broth",
        "1 taco seasoning packet",
        "1 can corn, drained",
        "1 can black beans, drained and rinsed",
        "1 cup salsa",
        "1 can (4.5 oz) green chiles",
        "1 cup long-grain white rice",
        "1 cup shredded cheese"
      ],
      "steps": [
        {
          "title": "Brown the beef",
          "detail": "In a large pot, cook ground beef over medium heat until no pink remains. Drain extra fat. Stir in the taco seasoning."
        },
        {
          "title": "Add rice and the rest",
          "detail": "Stir in broth, rice, corn, beans, salsa, and green chiles. Bring to a boil."
        },
        {
          "title": "Simmer",
          "detail": "Cover and cook on low 18–20 minutes, until the rice is tender. Add a splash of water if the pot looks dry before the rice is done."
        },
        {
          "title": "Finish",
          "detail": "Stir, sprinkle cheese on top, and cover 2 minutes so it melts."
        }
      ],
      "doneness": "Ground beef fully browned (160°F) before the rice goes in. Rice tender, not crunchy. Center steaming hot.",
      "tip": "One pot on the stove. Keep the lid on while the rice cooks so it steams evenly."
    },
    "onepotteriyaki": {
      "servings": "5",
      "prep": "15 min",
      "cook": "About 35 min",
      "equipment": "Large pot or deep skillet with lid (or Instant Pot)",
      "ingredients": [
        "1.5 lb chicken breast in small pieces",
        "1 Tbsp oil",
        "2 garlic cloves, minced",
        "1 tsp grated ginger",
        "1.5 cups jasmine rice",
        "2.5 cups water",
        "12–16 oz frozen stir-fry veggies",
        "1/4 cup soy sauce",
        "2 Tbsp brown sugar",
        "1 tsp sesame oil",
        "Green onions"
      ],
      "steps": [
        {
          "title": "Brown the chicken",
          "detail": "Heat oil in a large pot. Cook chicken pieces until no pink remains (165°F). Stir in garlic and ginger for 30 seconds."
        },
        {
          "title": "Add rice and water",
          "detail": "Add rice and water. Bring to a boil, then cover and simmer on low 12 minutes."
        },
        {
          "title": "Add veggies and sauce",
          "detail": "Stir in frozen veggies, soy sauce, brown sugar, and sesame oil. Cover and cook 8–10 more minutes until rice is tender and veggies are hot."
        },
        {
          "title": "Serve",
          "detail": "Fluff with a fork. Top with sliced green onions."
        }
      ],
      "doneness": "Chicken to 165°F. Rice soft, veggies hot.",
      "tip": "Keep the lid on while the rice cooks so it steams evenly."
    }
  },
  "sundayByWeek": {
    "1": {
      "servings": "5",
      "prep": "5–10 min",
      "cook": "About 20–25 min",
      "equipment": "Big pot, colander, skillet",
      "ingredients": [
        "1 box spaghetti (use about 12 oz of a 16 oz box, or the whole box if everyone is hungry)",
        "1 jar pasta sauce",
        "Grated cheese if you have it"
      ],
      "steps": [
        {
          "title": "Boil the pasta",
          "detail": "Bring a big pot of salted water to a boil. Cook about 12 oz spaghetti (three-quarters of a 16 oz box) per the box time, or the whole box for bigger appetites. Drain."
        },
        {
          "title": "Warm the sauce",
          "detail": "Warm the jarred sauce in a skillet. Toss with the pasta."
        },
        {
          "title": "Serve",
          "detail": "Plate and top with grated cheese if you have it."
        }
      ],
      "doneness": "Pasta is ready when it is soft enough to chew easily, with a little bite in the middle.",
      "tip": "A 16 oz box and a jar of sauce are the usual grocery packages — cook 12 oz for 5 plates, and save the rest of the dry pasta."
    },
    "2": {
      "servings": "5",
      "prep": "10 min",
      "cook": "About 20 min",
      "equipment": "Skillet or griddle",
      "ingredients": [
        "10 flour or corn tortillas",
        "10 eggs (2 per person)",
        "Shredded cheese (about 2 cups)",
        "Butter or oil",
        "Optional: leftover salsa, beans, or veggies",
        "Salt and pepper"
      ],
      "steps": [
        {
          "title": "Scramble the eggs",
          "detail": "Beat eggs with a pinch of salt and pepper. Scramble in a buttered skillet until just set. Move to a plate."
        },
        {
          "title": "Build quesadillas",
          "detail": "Wipe the skillet. Lay a tortilla, sprinkle cheese, add scrambled egg, add more cheese, top with a second tortilla."
        },
        {
          "title": "Toast",
          "detail": "Cook on medium 2–3 minutes per side until golden and cheese melts. Repeat."
        },
        {
          "title": "Serve",
          "detail": "Cut into wedges. Serve with salsa or leftover beans if you have them."
        }
      ],
      "doneness": "Eggs fully set (no runny raw egg). Cheese melted. Serve hot.",
      "tip": "Uses eggs, tortillas, and cheese already on hand."
    }
  }
};
});
