"""QA opcional: python tests/browser-smoke.py [http://127.0.0.1:8080]
Requiere playwright y Chromium instalados. No modifica la app ni GitHub.
"""
from pathlib import Path
import os
from playwright.sync_api import sync_playwright
import sys

URL = sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8080'

def run():
    with sync_playwright() as p:
        launch = {"headless": True}
        if os.environ.get("CHROMIUM_PATH"):
            launch["executable_path"] = os.environ["CHROMIUM_PATH"]
        browser = p.chromium.launch(**launch)
        page = browser.new_page(viewport={'width': 1440,'height': 900}, accept_downloads=True)
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        page.goto(URL,wait_until='domcontentloaded')
        page.locator('[data-pro-go="catalog"]').first.click()
        page.locator('.component-card').first.wait_for()
        assert page.locator('.component-card').count()==12
        assert page.locator('#result-count').inner_text().startswith('90')
        assert page.evaluate('Object.keys(window.M404_DEMOS).length')==90
        assert page.evaluate('window.M404_CATALOG.length')==90
        page.locator('#search').fill('Scramble text')
        assert page.locator('.component-card').count()==1
        page.locator('[data-inspect="23"]').click()
        assert page.locator('#detail-title').inner_text()=='Scramble text'
        page.locator('#custom-text').fill('Prueba local')
        page.locator('[data-swatch="#75d9e8"]').click()
        with page.expect_download() as info: page.locator('#download-component').click()
        download=info.value
        assert download.suggested_filename.endswith('.html')
        dest=Path(__file__).parent / 'standalone-test.html'
        download.save_as(str(dest))
        page.locator('#close-detail').click()
        page.locator('#search').fill('')
        page.locator('[data-favorite="1"]').click()
        page.locator('#library-saved').click()
        assert page.locator('.component-card').count()==1
        page.locator('[data-inspect="1"]').click()
        page.locator('#detail-preview [data-field="email"]').fill('ejemplo@ejemplo.com')
        page.locator('#detail-preview [data-act="invite"]').click()
        assert 'Invitaciones preparadas: 1' in page.locator('#detail-preview').inner_text()
        page.locator('#close-detail').click()
        standalone=browser.new_page()
        standalone_errors=[]
        standalone.on('pageerror',lambda e:standalone_errors.append(str(e)))
        standalone.goto(dest.as_uri(),wait_until='domcontentloaded')
        assert standalone.locator('.demo-root').count()==1
        assert 'Prueba local' in standalone.locator('.scramble-text').inner_text()
        assert not standalone_errors,standalone_errors
        mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        mobile.goto(URL,wait_until='domcontentloaded')
        assert mobile.locator('.component-card').count()==12
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
        mobile.screenshot(path=str(Path(__file__).parent / 'mobile-preview.png'),full_page=True)
        page.screenshot(path=str(Path(__file__).parent / 'desktop-preview.png'),full_page=True)
        assert not errors,errors
        browser.close()
        print('PASS: catálogo, filtros, inspector, export HTML autónomo, favoritos, interacción, móvil y consola')

if __name__=='__main__': run()
