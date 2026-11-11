# Tamayo Cart 🛒

Scan-as-you-shop grocery total for the Tamayo family. Snap a shelf price tag (or type a price),
confirm it, and watch the running total against your budget — so there are no surprises at checkout.

* 100% static + offline PWA. No accounts, no server, no tracking, no ads. Data lives in the phone's localStorage.
* OCR: Tesseract.js 5.1.1 (LSTM, `eng` 4.0.0_best_int), vendored in `vendor/tesseract/` — no CDN.
* Hosting how-to: see `HOSTING.md` (not deployed).
* Default **2-week** budget: **$325** (the saved number is not changed by the list; tap the budget pill to edit it; "No budget" turns it off).

## 📋 Meal plan shopping list
The **Meal plan list** tab turns the 2-week dinner plan from the *Tamayo Weeknight Meals* page into a store-ready list.

* **One combined 2-week shopping list** (since Nov 10, 2026): week 1 and week 2 are merged into a single list with one total, so the family can shop both weeks in one trip. Items used in both weeks become one line showing each week's amount ("Wk 1: … · Wk 2: …"), and their estimates are added together (never lowered). **Week 1 / Week 2** only switches the dinners shown. The list is built in `meals.js` (`lists.both`, from `combineWeeks`). Estimates were raised to the real El Super (South Gate) prices paid on Nov 10, 2026 where those were higher (`elSuperPaid`; never lowered), so the 2-week list estimate is about $451. The list is de-duplicated and grouped by store section (produce, meat, dairy, tortillas, canned, pantry, frozen, snacks).
* **Check off** an item with the big box (e.g. you already have it), or tap the item → **Scan price** / **Type price**:
  the cart line is linked to that list item, so it's checked off with its real price. When you add any item from the
  dock, the sheet suggests a matching list item ("✓ Check off “Milk”?") or you can pick one from the dropdown.
* The top card shows **Estimated remaining** (unchecked items on the combined list), **Spent so far** (real prices of those check-offs, plus anything in the cart that is not already a check-off), and **Spent + est. remaining ≈ one total** against the **2-week budget**. The cart pill uses that same 2-week total, not a single week. Linked prices follow edits; deleting the cart line unchecks it;
  after **Finish trip** the checked items keep their prices.
* **＋ Add item** for your own things (household, pet food…), remove items from the item menu (with Undo / Restore),
  and **↺ Reset list** to start the list over (your cart is not touched). Everything is saved in localStorage
  (`tamayoCart.plan.v1`).
* The app does not show a week 1 total or a week 2 total. Week 1's source list includes breakfasts, lunches, and snacks; week 2's source list is dinners only, built from that week's recipes. Spices, oil and rice are listed under "Check the pantry first".

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
