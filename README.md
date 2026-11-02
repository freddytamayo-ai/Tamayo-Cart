# Tamayo Cart 🛒

Scan-as-you-shop grocery total for the Tamayo family. Snap a shelf price tag (or type a price),
confirm it, and watch the running total against your budget — so there are no surprises at checkout.

* 100% static + offline PWA. No accounts, no server, no tracking, no ads. Data lives in the phone's localStorage.
* OCR: Tesseract.js 5.1.1 (LSTM, `eng` 4.0.0_best_int), vendored in `vendor/tesseract/` — no CDN.
* Hosting how-to: see `HOSTING.md` (not deployed).
* Default weekly budget: **$325** (tap the budget pill to change it; "No budget" turns it off).

## 📋 Meal plan shopping list
The **Meal plan list** tab turns the 2-week dinner plan from the *Tamayo Weeknight Meals* page into a store-ready list.

* Pick **Week 1** or **Week 2** to see that week's dinners (tap a dinner for its core ingredients) and one combined,
  de-duplicated grocery list grouped by store section (produce, meat, dairy, tortillas, canned, pantry, frozen, snacks).
* **Check off** an item with the big box (e.g. you already have it), or tap the item → **Scan price** / **Type price**:
  the cart line is linked to that list item, so it's checked off with its real price. When you add any item from the
  dock, the sheet suggests a matching list item ("✓ Check off “Milk”?") or you can pick one from the dropdown.
* The top card shows **Estimated remaining** (estimates of unchecked items), what you've **scanned** for list items,
  and cart total + estimated remaining vs. the budget. Linked prices follow edits; deleting the cart line unchecks it;
  after **Finish trip** the checked items keep their prices for the rest of the week.
* **＋ Add item** for your own things (household, pet food…), remove items from the item menu (with Undo / Restore),
  and **↺ Reset week** to start the week over (your cart is not touched). Everything is saved in localStorage
  (`tamayoCart.plan.v1`).
* Week 1 is the page's own list (~$280; includes breakfasts, lunches, snacks). The page has no week 2 list, so week 2
  (~$111) is built from week 2's recipes and covers **dinners only**; all its prices are estimates (week 1 prices where
  the item repeats, otherwise rough guesses). Spices, oil and rice are listed under "Check the pantry first".

### Updating the meals
Edit **`meals.js`** only: `meals` (the 19 dinners), `weeks['1'|'2'].dinners` and `.items`
(`{ id, section, name, qty, est }`). Keep item `id`s stable (check-offs are saved by id), then bump `VERSION` in
`sw.js` so installed phones pick up the change.

## Files
| file | purpose |
|---|---|
| `index.html` | UI markup |
| `styles.css` | styles (light/dark, big touch targets) |
| `app.js` | UI logic, camera, OCR pipeline, storage |
| `parser.js` | pure price parser + cart math (shared by browser and Node tests) |
| `meals.js` | meal plan data: 19 dinners, 2-week plan, week 1 + week 2 grocery lists |
| `mealplan.js` | pure shopping-list logic: grouping, check-off/link, totals, name matching, budget migration |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA: offline cache + home-screen install |
| `vendor/tesseract/` | Tesseract.js, wasm cores (SIMD + non-SIMD), eng traineddata, licenses |
| `tests/` | `parser.test.js`, `mealplan.test.js` (node), `make_tags.py`, `browser_test.py`, `meal_list_test.py`, `camera_test.py` |
| `screenshots/` | `01`–`05` cart/scan/camera, `06_meal_list.png`, `07_meal_list_checked.png` |

## Run tests
```bash
node --test tests/*.test.js
python3 tests/make_tags.py && python3 tests/browser_test.py && python3 tests/meal_list_test.py && python3 tests/camera_test.py
```

## Tips for good scans
Fill the box with just the tag, hold steady, tilt slightly to kill glare from shelf lights, use 🔦 (Android) in dim aisles.
Always glance at the detected price before tapping **Add to cart** — tap one of the alternative chips if it grabbed the wrong number.
