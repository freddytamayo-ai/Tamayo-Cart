"""Exercise the live-camera path with Chrome's fake camera (no price in it, so we expect
the 'couldn't read' confirm sheet) and screenshot the camera viewfinder."""
import os, subprocess, sys, time
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8767', '--bind', '127.0.0.1'], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
errs = []
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'])
        ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, permissions=['camera'])
        pg = ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('http://localhost:8767/index.html'); pg.wait_for_load_state('networkidle')
        pg.click('#scanBtn')
        pg.wait_for_function('document.getElementById("video").videoWidth > 0', timeout=20000)
        pg.wait_for_function('/Hold steady/.test(document.getElementById("camStatus").textContent)', timeout=60000)
        pg.screenshot(path=os.path.join(ROOT, 'screenshots', '05_camera_viewfinder.png'))
        pg.click('#shutter')
        pg.wait_for_selector('#sheetWrap:not([hidden])', timeout=60000)
        stopped = pg.evaluate('document.getElementById("camera").hidden')
        print('PASS live camera opened, snapped, OCR ran, confirm sheet shown; camera released =', stopped)
        print('sheet note:', pg.inner_text('#ocrNote'))
        b.close()
finally:
    srv.terminate()
print('JS errors:', errs or 'none')
