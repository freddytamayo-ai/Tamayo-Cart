"""Headless browser test: loads the app from a local http.server, checks for JS errors,
exercises the UI, runs the real in-browser OCR pipeline on generated tags, checks offline
reload via the service worker, and saves phone-size screenshots.
Run from the grocery-scanner folder:  python3 tests/browser_test.py"""
import json, os, subprocess, sys, time, base64
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8765
URL = f'http://localhost:{PORT}/index.html'
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1'], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
errors, results, ok = [], {}, True
def check(cond, msg):
    global ok
    print(('PASS ' if cond else 'FAIL ') + msg); ok = ok and cond
try:
    with sync_playwright() as p:
        exe = '/usr/bin/google-chrome'
        b = p.chromium.launch(executable_path=exe if os.path.exists(exe) else None, headless=True)
        ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True,
                            color_scheme='light', user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        page = ctx.new_page()
        page.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
        page.on('console', lambda m: errors.append('console.' + m.type + ': ' + m.text) if m.type == 'error' else None)
        page.goto(URL); page.wait_for_load_state('networkidle')
        check(page.title() == 'Tamayo Cart', 'title is Tamayo Cart')
        check(page.inner_text('#remaining') == '$325.00', 'fresh install default weekly budget is $325.00')
        # wait for SW to control the page
        page.wait_for_function('navigator.serviceWorker && navigator.serviceWorker.ready.then(()=>true)', timeout=60000)
        page.reload(); page.wait_for_function('!!navigator.serviceWorker.controller', timeout=60000)
        check(True, 'service worker installed and controlling page')
        manifest = page.evaluate("fetch('manifest.webmanifest').then(r=>r.json())")
        check(manifest['display'] == 'standalone' and len(manifest['icons']) >= 2, 'manifest ok (standalone, icons)')

        # --- budget
        page.click('#budgetBtn'); page.fill('#bIn', '60'); page.click('#bSave')
        check(page.inner_text('#remaining') == '$60.00', 'budget set: remaining $60.00')
        # --- manual add
        def add(price, name='', qty=None, taxable=False):
            page.click('#addBtn'); page.fill('#fPrice', price); page.fill('#fName', name)
            if qty: page.fill('#fQty', str(qty))
            if taxable: page.click('label.toggle:has(#fTaxable)')
            page.click('#sheetSave')
        add('3.99', 'Whole milk 1 gal'); add('2.50', 'Barilla pasta', qty=2)
        add('5.99', 'Eggs 18 ct'); add('6.49', 'Paper towels', taxable=True)
        page.click('.item:has-text("Barilla") [data-act=plus]')  # qty 3
        # 3.99 + 7.50 + 5.99 + 6.49 = 23.97 ; tax 10.25% of 6.49 = 0.67 -> 24.64
        check(page.inner_text('#total') == '$24.64', 'running total with tax on taxable item only = $24.64 (got %s)' % page.inner_text('#total'))
        check(page.get_attribute('#summary', 'data-level') == 'ok', 'bar level ok (<80%)')
        page.click('#store'); page.fill('#store', 'Food 4 Less – Downey'); page.keyboard.press('Tab')
        page.wait_for_timeout(2500)
        page.screenshot(path=os.path.join(ROOT, 'screenshots', '01_cart_light.png'))
        add('22.00', 'Chicken thighs family pack')   # 46.64 -> 77.7% ok
        add('2.00', 'Tortillas')                       # 48.64 -> 81% warn
        check(page.get_attribute('#summary', 'data-level') == 'warn', 'bar turns amber at >=80%')
        add('15.00', 'Coffee')                         # 63.64 over
        check(page.get_attribute('#summary', 'data-level') == 'over', 'bar turns red when over budget')
        check('over' in page.inner_text('#remaining'), 'remaining shows "over": ' + page.inner_text('#remaining'))
        # edit + remove + undo
        page.click('.item:has-text("Coffee") .info'); page.fill('#fPrice', '9.00'); page.click('#sheetSave')
        check(page.inner_text('#total') == '$57.64', 'edit item price -> $57.64 (got %s)' % page.inner_text('#total'))
        page.click('.item:has-text("Coffee") [data-act=del]')
        check(page.inner_text('#total') == '$48.64', 'remove item -> $48.64')
        page.click('#toastAct')
        check(page.inner_text('#total') == '$57.64', 'undo remove -> $57.64')
        # persistence
        page.reload(); page.wait_for_load_state('networkidle')
        check(page.inner_text('#total') == '$57.64', 'cart persists across reload (localStorage)')

        # --- OCR on generated tags (real in-browser pipeline, vendored Tesseract)
        exp = json.load(open(os.path.join(ROOT, 'tests', 'tags', 'expected.json')))
        page.evaluate('TamayoOCR.getWorker()')
        for name, want in exp.items():
            b64 = base64.b64encode(open(os.path.join(ROOT, 'tests', 'tags', name + '.png'), 'rb').read()).decode()
            t0 = time.time()
            r = page.evaluate('''async (b64) => {
                const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
                const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
                c.getContext('2d').drawImage(img, 0, 0);
                const r = await TamayoOCR.readTag(c);
                return {price: r.price, note: r.note, name: r.name, text: r.text, alts: (r.candidates||[]).slice(0,4).map(c=>c.price)};
            }''', b64)
            dt = time.time() - t0
            hit = r['price'] == want
            in_alts = want in r['alts']
            results[name] = dict(expected=want, got=r['price'], ok=hit, inAlternatives=in_alts, note=r['note'], name=r['name'], secs=round(dt, 1), text=(r['text'] or '').strip()[:160])
            print(('OCR PASS ' if hit else ('OCR ALT  ' if in_alts else 'OCR FAIL ')) + f"{name}: want {want} got {r['price']} alts {r['alts']} name={r['name']!r} note={r['note']!r} ({dt:.1f}s)")

        # --- confirm sheet screenshot using the scan flow with a photo file (simulates camera snap)
        page.set_input_files('#fileInput', os.path.join(ROOT, 'tests', 'tags', '03_yellow_multibuy.png'))
        page.wait_for_selector('#sheetWrap:not([hidden])', timeout=60000)
        page.wait_for_timeout(400)
        check(page.input_value('#fPrice') == '2.50', 'scan flow (photo) prefilled price 2.50 from 2/$5 (got %s)' % page.input_value('#fPrice'))
        page.screenshot(path=os.path.join(ROOT, 'screenshots', '02_scan_confirm.png'))
        page.click('#sheetSave')

        # --- finish trip -> history
        page.on('dialog', lambda d: d.accept())
        page.click('#finishBtn')
        check(page.inner_text('#total') == '$0.00', 'finish trip empties cart')
        page.click('#historyBtn')
        check('Food 4 Less' in page.inner_text('#dlgBody'), 'trip saved in history with store name')
        page.click('#dlgClose')

        # --- offline: block network, reload, app still works (served from SW cache)
        ctx.set_offline(True)
        page.reload(); page.wait_for_load_state('domcontentloaded'); page.wait_for_timeout(500)
        check(page.title() == 'Tamayo Cart' and page.is_visible('#scanBtn'), 'app loads offline from service worker cache')
        ctx.set_offline(False)

        # --- dark mode screenshot with a populated cart
        dctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, color_scheme='dark')
        dp = dctx.new_page(); dp.on('pageerror', lambda e: errors.append('pageerror(dark): ' + str(e)))
        dp.goto(URL); dp.wait_for_load_state('networkidle')
        dp.evaluate('''() => { localStorage.setItem('tamayoCart.v1', JSON.stringify({budget:55, store:'Northgate Market', taxOn:true, taxRate:10.25, theme:'auto', nextId:9, items:[
          {id:1,name:'Tortillas de maiz 30 ct',price:2.99,qty:1},{id:2,name:'Whole milk 1 gal',price:3.49,qty:2},
          {id:3,name:'Ground beef 80/20',price:4.49,qty:2.3,perWeight:true,note:'per lb'},{id:4,name:'Barilla pasta',price:2.5,qty:4,note:'2 for $5.00'},
          {id:5,name:'Paper towels 6 roll',price:8.99,qty:1,taxable:true},{id:6,name:'Bananas',price:0.59,qty:3.1,perWeight:true},
          {id:7,name:'Coca-Cola 12 pk',price:7.99,qty:1,taxable:true},{id:8,name:'Eggs 18 ct',price:5.99,qty:1}]})); }''')
        dp.reload(); dp.wait_for_load_state('networkidle')
        dp.screenshot(path=os.path.join(ROOT, 'screenshots', '03_cart_dark_over_budget.png'))
        dp.click('#budgetBtn'); dp.wait_for_timeout(300)
        dp.screenshot(path=os.path.join(ROOT, 'screenshots', '04_budget_dialog_dark.png'))
        b.close()
finally:
    srv.terminate()
real_errors = [e for e in errors if 'favicon' not in e]
check(not real_errors, 'no JS errors' + ('' if not real_errors else ': ' + ' | '.join(real_errors)))
n = len(results); hits = sum(r['ok'] for r in results.values()); alts = sum(r['inAlternatives'] for r in results.values())
print(f'OCR: {hits}/{n} exact top pick, {alts}/{n} correct price among offered chips')
json.dump(results, open(os.path.join(ROOT, 'tests', 'ocr_results.json'), 'w'), indent=1)
print('ALL PASS' if ok else 'SOME CHECKS FAILED')
sys.exit(0 if ok else 1)
