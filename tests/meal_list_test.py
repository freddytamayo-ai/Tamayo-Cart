"""Headless browser test for the meal-plan shopping list: week switch, dinners, grouped list, check-off,
linking a typed/scanned price to a list item, custom items, remove/restore, reset week, persistence,
budget default + migration, dark mode, and offline (new files in the SW cache). Saves screenshots
06_meal_list.png (light) and 07_meal_list_checked.png.  Run from grocery-scanner:  python3 tests/meal_list_test.py"""
import os, subprocess, sys, time, base64, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8768
URL = f'http://localhost:{PORT}/index.html'
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1'], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
errors, ok, report = [], True, {}
def check(cond, msg):
    global ok
    print(('PASS ' if cond else 'FAIL ') + msg); ok = ok and cond
SHOTS = os.path.join(ROOT, 'screenshots')
try:
    with sync_playwright() as p:
        exe = '/usr/bin/google-chrome'
        b = p.chromium.launch(executable_path=exe if os.path.exists(exe) else None, headless=True)
        def mk(scheme):
            ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, color_scheme=scheme)
            pg = ctx.new_page()
            pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
            pg.on('console', lambda m: errors.append('console.' + m.type + ': ' + m.text) if m.type == 'error' else None)
            pg.on('dialog', lambda d: d.accept())
            return ctx, pg
        ctx, page = mk('light')
        page.goto(URL); page.wait_for_load_state('networkidle')
        check(page.inner_text('#remaining') == '$325.00', 'fresh install: default budget $325 (got %s)' % page.inner_text('#remaining'))

        page.click('#tabPlan')
        check(page.is_visible('#planView') and not page.is_visible('#cartView'), 'Meal plan tab shows the list view')
        def dinners(): return [t.strip() for t in page.eval_on_selector_all('#dinners .dinner', 'els => els.map(e => e.querySelector(".day").textContent + " " + e.querySelector(".dt").textContent)')]
        def est_total(): return page.evaluate("TamayoPlan.summary(TamayoPlan.weekItems(TamayoMeals, JSON.parse(localStorage.getItem('tamayoCart.plan.v1')||'{}').weeks ? TamayoPlan.normalizePlan(JSON.parse(localStorage.getItem('tamayoCart.plan.v1')), TamayoMeals) : TamayoPlan.normalizePlan({}, TamayoMeals), document.querySelector('#weekSeg .on').dataset.week, [])).estTotal")
        w1 = dinners(); cap1 = page.inner_text('#planCaption'); rem1 = page.inner_text('#planRemaining')
        check(len(w1) == 7 and w1[0].startswith('Mon Salsa Chicken'), 'week 1 shows 7 days of dinners')
        check('list estimate $270.00' in cap1 and rem1 == '$270.00', 'week 1 list estimate $270 and est. remaining $270 (%s / %s)' % (rem1, cap1.splitlines()[0]))
        secs = page.eval_on_selector_all('.sec-h span:first-child', 'els => els.map(e => e.textContent)')
        check(secs[0].endswith('Produce') and any('Meat' in s for s in secs) and any('Frozen' in s for s in secs), 'grouped by store section: ' + ', '.join(secs))
        check(page.locator('.pitem').count() == 51, 'week 1 has 51 list items')
        page.wait_for_selector('#toast:not(.show)', state='attached', timeout=10000); page.wait_for_timeout(400)
        page.set_viewport_size({'width': 390, 'height': 1500})  # tall phone capture: picker, totals, dinners and the start of the list
        page.wait_for_timeout(300)
        page.screenshot(path=os.path.join(SHOTS, '06_meal_list.png'))
        page.set_viewport_size({'width': 390, 'height': 844})

        page.click('#weekSeg [data-week="2"]')
        w2 = dinners(); cap2 = page.inner_text('#planCaption'); rem2 = page.inner_text('#planRemaining')
        check(len(w2) == 7 and w2[0].startswith('Mon White Chicken Chili'), 'week 2 shows its dinners')
        check('list estimate $99.00' in cap2, 'week 2 list estimate $99 (%s)' % cap2.splitlines()[0])
        check('estimates' in page.inner_text('#planNote'), 'week 2 note says prices are estimates')
        report['week1'] = {'dinners': w1, 'caption': cap1, 'remaining': rem1}
        report['week2'] = {'dinners': w2, 'caption': cap2, 'remaining': rem2, 'items': page.locator('.pitem').count()}
        page.click('#weekSeg [data-week="1"]')

        # manual check-off (already have it)
        page.click('.pitem[data-id="garlic"] .pcheck')
        check(page.get_attribute('.pitem[data-id="garlic"]', 'class').find('done') >= 0, 'tap checkbox checks item off')
        check(page.inner_text('#planRemaining') == '$269.00', 'manual check removes its estimate from remaining -> $269.00')

        # type a price for a list item from its menu
        page.click('.pitem[data-id="onions"] .pinfo'); page.click('#mType')
        check(page.input_value('#fName') == 'Onions' and page.input_value('#fList') == 'onions', 'Type price from list item prefills name + link')
        page.fill('#fPrice', '2.99'); page.click('#sheetSave')
        check('$2.99' in page.inner_text('.pitem[data-id="onions"] .pprice'), 'linked item shows real scanned price')
        check(page.inner_text('#total') == '$2.99', 'linked item counts toward running cart total')

        # add from the dock, with name suggestion -> check off
        page.click('#addBtn'); page.fill('#fPrice', '4.19'); page.fill('#fName', 'Whole milk 1 gal'); page.fill('#fQty', '2')
        check(page.is_visible('#listSuggest') and 'Milk' in page.inner_text('#listSuggest'), 'name suggests matching list item: ' + page.inner_text('#listSuggest'))
        page.click('#listSuggest'); page.click('#sheetSave')
        check('$8.38' in page.inner_text('.pitem[data-id="milk"] .pprice'), 'suggested link: milk checked with $8.38')

        # scan flow: photo of a tag, linked to "Bananas" from the item menu
        page.click('.pitem[data-id="bananas"] .pinfo'); page.click('#mScan')
        page.set_input_files('#fileInput', os.path.join(ROOT, 'tests', 'tags', '03_yellow_multibuy.png'))
        page.wait_for_selector('#sheetWrap:not([hidden])', timeout=90000); page.wait_for_timeout(300)
        check(page.input_value('#fList') == 'bananas', 'scan from list item keeps the link in the confirm sheet')
        scanned = page.input_value('#fPrice'); page.click('#sheetSave')
        check(page.get_attribute('.pitem[data-id="bananas"]', 'class').find('done') >= 0, 'scanned price (%s) checks off Bananas' % scanned)

        # custom item
        page.click('#planAddBtn'); page.fill('#aName', 'Dog food'); page.fill('#aQty', '30 lb bag'); page.fill('#aEst', '32.50'); page.click('#aSave')
        check(page.locator('.pitem:has-text("Dog food")').count() == 1 and 'household' in page.inner_text('.plan-sec:has-text("Dog food") .sec-h').lower(), 'custom item added under Household & pet')
        # remove + restore
        page.click('.pitem[data-id="popcorn"] .pinfo'); page.click('#mDel')
        check(page.locator('.pitem[data-id="popcorn"]').count() == 0 and page.is_visible('#planRestoreBtn'), 'remove item from list; restore button shows')
        s = page.evaluate("TamayoPlan.summary(TamayoPlan.weekItems(TamayoMeals, TamayoPlan.normalizePlan(JSON.parse(localStorage.getItem('tamayoCart.plan.v1')), TamayoMeals), '1', JSON.parse(localStorage.getItem('tamayoCart.v1')).items))")
        # remaining = 270 - garlic1 - onions3 - milk8 - bananas3 - popcorn3 + dog 32.5 = 284.5
        check(abs(s['remaining'] - 284.5) < 0.001, 'estimated remaining after edits = $284.50 (got %s)' % s['remaining'])
        check(page.inner_text('#planRemaining') == '$284.50', 'UI shows estimated remaining $284.50')

        # persistence
        page.reload(); page.wait_for_load_state('networkidle')
        check(page.is_visible('#planView') and page.locator('.pitem.done').count() == 4 and page.locator('.pitem:has-text("Dog food")').count() == 1, 'list state persists across reload')
        # scroll so the Produce section (onions, garlic, bananas checked) sits just under the sticky header
        page.evaluate("const h = document.getElementById('summary').offsetHeight; const y = document.querySelector('.plan-sec').getBoundingClientRect().top + window.scrollY - h - 8; window.scrollTo(0, y)")
        page.wait_for_selector('#toast:not(.show)', state='attached', timeout=10000); page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(SHOTS, '07_meal_list_checked.png'))

        # deleting the linked cart line unchecks the list item; undo restores it
        page.click('#tabCart'); page.click('.item:has-text("Onions") [data-act=del]')
        page.click('#tabPlan')
        check('done' not in page.get_attribute('.pitem[data-id="onions"]', 'class'), 'deleting cart line unchecks list item')
        page.click('#tabCart'); page.click('#clearBtn'); page.wait_for_timeout(100)
        page.click('#toastAct')  # undo clear
        page.click('#tabPlan')
        # finish trip keeps checked items with their prices
        page.click('#tabCart'); page.click('#finishBtn'); page.click('#tabPlan')
        check('$8.38' in page.inner_text('.pitem[data-id="milk"] .pprice'), 'after Finish trip, milk stays checked at $8.38')

        # reset week
        page.click('#planResetBtn')
        check(page.locator('.pitem.done').count() == 0 and page.locator('.pitem').count() == 51 and page.inner_text('#planRemaining') == '$270.00', 'Reset week clears checks, custom & removed items')

        # offline: new data files come from the SW cache
        page.wait_for_function('navigator.serviceWorker && navigator.serviceWorker.ready.then(()=>true)', timeout=60000)
        page.reload(); page.wait_for_function('!!navigator.serviceWorker.controller', timeout=60000)
        keys = page.evaluate("caches.keys()")
        check('tamayo-cart-v2' in keys, 'service worker cache bumped to tamayo-cart-v2 (%s)' % keys)
        cached = page.evaluate("caches.open('tamayo-cart-v2').then(c => Promise.all(['meals.js','mealplan.js'].map(f => c.match(f).then(r => !!r))))")
        check(all(cached), 'meals.js and mealplan.js are precached')
        ctx.set_offline(True); page.reload(); page.wait_for_load_state('domcontentloaded'); page.wait_for_timeout(500)
        check(page.locator('#dinners .dinner').count() == 7, 'meal list works offline')
        ctx.set_offline(False); ctx.close()

        # budget migration: saved old default (0) -> 325; a custom budget is kept
        for saved, want in [(0, '$325.00'), (60, '$60.00')]:
            c2, p2 = mk('light'); p2.goto(URL); p2.wait_for_load_state('networkidle')
            p2.evaluate("b => localStorage.setItem('tamayoCart.v1', JSON.stringify({items:[], budget:b, store:'', taxOn:true, taxRate:10.25, theme:'auto', nextId:1}))", saved)
            p2.reload(); p2.wait_for_load_state('networkidle')
            check(p2.inner_text('#remaining') == want, 'migration: saved budget %s -> %s (got %s)' % (saved, want, p2.inner_text('#remaining')))
            if saved == 0:
                p2.click('#budgetBtn'); p2.click('#bClear'); p2.reload(); p2.wait_for_load_state('networkidle')
                check(p2.inner_text('#remaining') == 'Set budget', 'choosing "No budget" after upgrade sticks')
            c2.close()

        # dark mode render
        c3, p3 = mk('dark'); p3.goto(URL); p3.wait_for_load_state('networkidle'); p3.click('#tabPlan'); p3.click('.pitem[data-id="eggs"] .pcheck')
        bg = p3.evaluate("getComputedStyle(document.querySelector('.plist')).backgroundColor")
        check(bg == 'rgb(20, 33, 27)', 'dark mode list card colour ' + bg)
        p3.screenshot(path='/tmp/meal_dark.png'); c3.close()
        b.close()
finally:
    srv.terminate()
real = [e for e in errors if 'favicon' not in e]
check(not real, 'no JS errors' + ('' if not real else ': ' + ' | '.join(real)))
json.dump(report, open('/tmp/meal_report.json', 'w'), indent=1)
print('ALL PASS' if ok else 'SOME CHECKS FAILED')
sys.exit(0 if ok else 1)
