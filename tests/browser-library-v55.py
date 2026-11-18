"""Real HTTP/browser coverage for the live library; requires Playwright and Chromium.

MOTION_URL may point at a GitHub Pages subpath. Artifacts go to MOTION_QA_OUTPUT.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

URL = os.getenv('MOTION_URL', 'http://127.0.0.1:8095/').rstrip('/') + '/'
OUT = Path(os.getenv('MOTION_QA_OUTPUT', '/tmp/motion-library-qa'))
OUT.mkdir(parents=True, exist_ok=True)


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.getenv('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(URL + '#catalog')
        expect(page.locator('#result-count')).to_contain_text('90 componentes')
        expect(page.locator('.component-card')).to_have_count(12)
        # Navigate through the normal controls. Header, active panel and URL agree.
        menu = page.locator('.pro-suite-nav')
        for key in ['original', 'motion', 'design', 'effects', 'game', 'resources', 'backups', 'timeline']:
            link = menu.locator(f'[data-pro-go="{key}"]')
            link.click()
            expect(page.locator(f'.ultimate-panel.active[data-panel="{key}"]')).to_be_visible()
            expect(page.locator('#pro-breadcrumb')).to_have_text(link.locator('span').nth(1).inner_text())
            assert page.url.endswith('#' + key)
        page.locator('[data-m52-jump="editor"]').click()
        expect(menu.locator('[data-pro-go="editor"]')).to_have_attribute('aria-current', 'page')
        assert page.url.endswith('#editor')
        page.go_back()
        expect(page.locator('[data-panel="timeline"]')).to_be_visible()
        page.go_forward()
        expect(page.locator('[data-panel="editor"]')).to_be_visible()
        menu.locator('[data-pro-go="catalog"]').click()
        before = page.evaluate("localStorage.getItem('motion404-ultimate-v4-projects')")
        page.locator('#search').focus()
        page.keyboard.press('Tab')
        page.keyboard.press('Delete')
        assert page.evaluate("localStorage.getItem('motion404-ultimate-v4-projects')") == before
        # Every catalog item has a working renderer in a real DOM.
        assert page.evaluate('''() => {
          const host=document.createElement('div');document.body.append(host);
          try {return M404_CATALOG.every(item=>{Motion404.mount(host,item.id);return host.querySelector('.demo-stage').textContent.trim().length>0})}
          finally {host.remove()}
        }''')
        page.locator('#library-new').click()
        expect(page.locator('.component-card')).to_have_count(6)
        page.screenshot(path=str(OUT / 'library-desktop.png'), full_page=True)
        # Original interactions, including continuous range updates and native details.
        page.locator('#card-demo-85 button').click()
        expect(page.locator('#card-demo-85 button')).to_have_attribute('aria-pressed', 'true')
        page.locator('#card-demo-86 summary').first.click()
        expect(page.locator('#card-demo-86 details').first).to_have_attribute('open', '')
        page.locator('#card-demo-87 [data-val="2"]').click()
        expect(page.locator('#card-demo-87 .orbit-selector > strong')).to_have_text('Guardar')
        page.locator('#card-demo-88 input').fill('74')
        expect(page.locator('#card-demo-88 output')).to_have_text('74%')
        assert page.locator('#card-demo-88 .split-reveal').evaluate("el=>el.style.getPropertyValue('--reveal')") == '74%'
        page.locator('#card-demo-89 button').click()
        expect(page.locator('#card-demo-89 button')).to_have_attribute('aria-pressed', 'true')
        page.locator('#card-demo-90 [data-act="increment"]').click()
        expect(page.locator('#card-demo-90 .flip-counter')).to_have_text('03')
        assert page.evaluate("document.activeElement.dataset.act") == 'increment'
        # Inspector, persistent variant, comparison and safe source display.
        page.locator('[data-inspect="85"]').click()
        page.locator('[data-preset="cinema"]').click()
        text = '</script><script>window.UNSAFE=1</script>'
        page.locator('#custom-text').fill(text)
        page.locator('#compare-variants').check()
        expect(page.locator('#baseline-preview .demo-root')).to_have_count(1)
        expect(page.locator('#detail-preview .spotlight-card strong')).to_have_text(text)
        assert page.locator('#detail-preview .demo-root').get_attribute('data-speed') == '0.75'
        assert page.locator('#baseline-preview .demo-root').get_attribute('data-speed') == '1'
        page.locator('#reduce-motion').check()
        page.locator('#detail-save').click()
        expect(page.locator('#detail-save')).to_have_attribute('aria-pressed', 'true')
        page.screenshot(path=str(OUT / 'variant-comparison.png'), full_page=True)
        page.locator('#detail-code summary').click()
        code = page.locator('#component-code').inner_text()
        assert '\\u003c/script>' in code
        # Capture clipboard calls, not OS clipboard permissions, for content assertions.
        page.evaluate('window.Motion404.copy=async text=>{window.COPIED=text;return true}')
        page.locator('#copy-claude-prompt').click()
        assert 'component=85' in page.evaluate('window.COPIED')
        assert '0.75' in page.evaluate('window.COPIED')
        page.locator('#detail-share').click()
        share = page.evaluate('window.COPIED')
        assert 'component=85' in share
        with page.expect_download() as info:
            page.locator('#download-component').click()
        exported = OUT / 'spotlight.html'
        info.value.save_as(str(exported))
        standalone = context.new_page()
        standalone.on('pageerror', lambda e: errors.append(str(e)))
        standalone.goto(exported.as_uri())
        expect(standalone.locator('.spotlight-card strong')).to_have_text(text)
        assert standalone.evaluate('window.UNSAFE') is None
        expect(standalone.locator('.demo-root')).to_have_attribute('data-reduced', 'true')
        standalone.locator('button').click()
        expect(standalone.locator('button')).to_have_attribute('aria-pressed', 'true')
        standalone.close()
        page.locator('#close-detail').click()
        page.reload()
        page.locator('#library-saved').click()
        expect(page.locator('.component-card')).to_have_count(1)
        with page.expect_download() as info:
            page.locator('#library-backup').click()
        backup = OUT / 'favorites.json'
        info.value.save_as(str(backup))
        assert json.loads(backup.read_text())['configs']['85']['speed'] == 0.75
        # Fresh storage imports the collection and preserves existing other favorites.
        clean = browser.new_context(viewport={'width': 1440, 'height': 1000})
        restored = clean.new_page()
        restored.on('pageerror', lambda e: errors.append(str(e)))
        restored.goto(URL + '#catalog')
        restored.locator('[data-favorite="1"]').click()
        restored.locator('#library-file').set_input_files(str(backup))
        expect(restored.locator('#toast')).to_contain_text('1 favoritos importados')
        restored.locator('#library-saved').click()
        expect(restored.locator('.component-card')).to_have_count(2)
        restored.goto(share)
        expect(restored.locator('#detail-title')).to_have_text('Spotlight card')
        expect(restored.locator('#custom-text')).to_have_value(text)
        expect(restored.locator('#reduce-motion')).to_be_checked()
        restored.locator('#close-detail').click()
        # Focus confinement and the keyboard hold interaction including cancellation.
        restored.locator('#search').fill('Hold to publish')
        restored.locator('[data-inspect="13"]').click()
        hold = restored.locator('#detail-preview [data-hold]')
        hold.focus()
        restored.keyboard.down('Space')
        restored.wait_for_timeout(150)
        restored.keyboard.up('Space')
        expect(hold).to_have_text('Mantén pulsado')
        restored.keyboard.down('Space')
        restored.wait_for_timeout(1300)
        restored.keyboard.up('Space')
        expect(hold).to_contain_text('Publicado')
        assert restored.evaluate("document.activeElement.matches('[data-hold]')")
        restored.locator('#close-detail').focus()
        restored.keyboard.press('Shift+Tab')
        assert restored.evaluate("!!document.activeElement.closest('#detail-overlay')")
        restored.keyboard.press('Escape')
        # All six new exports run without the studio or network resources.
        restored.locator('#library-new').click()
        for id in range(85, 91):
            restored.locator(f'[data-inspect="{id}"]').click()
            with restored.expect_download() as info:
                restored.locator('#download-component').click()
            path = OUT / f'pattern-{id}.html'
            info.value.save_as(str(path))
            viewer = clean.new_page()
            viewer.on('pageerror', lambda e: errors.append(str(e)))
            viewer.goto(path.as_uri())
            expect(viewer.locator(f'.demo-root[data-demo-id="{id}"]')).to_have_count(1)
            assert viewer.evaluate('performance.getEntriesByType("resource").length') == 0
            viewer.close()
            restored.locator('#close-detail').click()
        # The composer must retain the new IDs rather than clamping them to 84.
        restored.locator('[data-pro-go="editor"]').first.click()
        for id in range(85, 91):
            restored.locator('#m4-pattern-select').select_option(str(id))
            restored.locator('#m4-add-pattern').click()
            expect(restored.locator(f'#m4-stage-host .demo-root[data-demo-id="{id}"]')).to_have_count(1)
        with restored.expect_download() as info:
            restored.locator('#m4-html').click()
        composed = OUT / 'composer-originals.html'
        info.value.save_as(str(composed))
        viewer = clean.new_page()
        viewer.on('pageerror', lambda e: errors.append(str(e)))
        viewer.goto(composed.as_uri())
        for id in range(85, 91):
            expect(viewer.locator(f'.demo-root[data-demo-id="{id}"]')).to_have_count(1)
        viewer.close()
        # Touch viewport, mobile dialog, light theme and system reduced motion.
        mobile_context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, reduced_motion='reduce')
        mobile = mobile_context.new_page()
        mobile.on('pageerror', lambda e: errors.append(str(e)))
        mobile.goto(URL + '#catalog')
        await_drawer = mobile.locator('#toggle-sidebar')
        await_drawer.tap()
        expect(await_drawer).to_have_attribute('aria-expanded', 'true')
        mobile.locator('.pro-suite-nav [data-pro-go="backups"]').tap()
        expect(mobile.locator('[data-panel="backups"]')).to_be_visible()
        expect(await_drawer).to_have_attribute('aria-expanded', 'false')
        await_drawer.tap()
        mobile.locator('.pro-suite-nav [data-pro-go="catalog"]').tap()
        mobile.locator('#library-new').click()
        mobile.locator('#theme-toggle').click()
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
        mobile.screenshot(path=str(OUT / 'library-mobile-light.png'), full_page=True)
        mobile.locator('[data-inspect="89"]').click()
        mobile.locator('#compare-variants').check()
        mobile.locator('#detail-preview button').tap()
        assert mobile.locator('#detail-preview .ripple-ring').evaluate('el=>getComputedStyle(el).animationName') == 'none'
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
        mobile.screenshot(path=str(OUT / 'comparison-mobile.png'), full_page=True)
        # Real SW activation + offline reload at the actual subpath.
        page.goto(URL + '#catalog')
        page.evaluate('navigator.serviceWorker.ready')
        page.reload()
        page.wait_for_function('!!navigator.serviceWorker.controller')
        context.set_offline(True)
        page.reload()
        expect(page.locator('#result-count')).to_contain_text('90 componentes')
        page.locator('#library-new').click()
        expect(page.locator('.component-card')).to_have_count(6)
        assert not errors, errors
        print('PASS: 90 DOM renderers; 6 new interactions and standalone exports; variants; safe source; persistent favorites; backup merge; deep links; keyboard hold/cancel; focus; touch viewport; light theme; reduced motion; real offline SW; 0 JS errors')
        browser.close()


if __name__ == '__main__':
    run()
