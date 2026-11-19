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



def exercise_catalog(browser):
    """Walk the published UI, including the commands exposed after a demo expands."""
    page = browser.new_page(viewport={'width': 1440, 'height': 960})
    errors = []
    page.on('pageerror', lambda exc: errors.append(str(exc)))
    page.goto(URL + '#catalog')
    seen_patterns = set()
    activations = {}
    for number in range(1, 9):
        page.locator(f'#pagination-controls [data-page="{number}"]').click()
        cards = page.locator('[data-inspect]').evaluate_all('els => els.map(el => el.dataset.inspect)')
        for pattern in cards:
            page.locator(f'[data-inspect="{pattern}"]').click()
            demo = page.locator('#detail-preview .demo-root')
            expect(demo).to_have_attribute('data-demo-id', pattern)
            visited = set()
            while True:
                buttons = demo.locator('[data-act]:visible:not(:disabled)')
                candidates = buttons.evaluate_all("""els => els.map(el =>
                    [el.dataset.act, el.dataset.val || '', el.textContent.trim().slice(0,40)])""")
                index = next((i for i, key in enumerate(candidates) if tuple(key[:2]) not in visited), None)
                if index is None:
                    break
                action, value, _ = candidates[index]
                visited.add((action, value))
                buttons.nth(index).click(timeout=4500)
                if page.locator('#command-overlay').is_visible():
                    page.keyboard.press('Escape')
            if pattern == '11':
                trigger = demo.get_by_role('button', name='Opciones')
                for i, label in enumerate(['Buscar', 'Favoritos', 'Ajustes']):
                    expect(trigger).to_have_attribute('aria-expanded', 'false')
                    expect(demo.locator('.goo-child')).to_have_count(0)
                    trigger.click()
                    demo.get_by_role('button', name=label).click()
                    expect(trigger).to_be_focused()
                    expect(demo).to_contain_text(f'Opción {i+1}')
                    visited.add(('tab', str(i)))
            activations[pattern] = sorted(visited)
            seen_patterns.add(int(pattern))
            page.locator('#close-detail').click()
    assert seen_patterns == set(range(1, 91))
    assert not errors, errors
    (OUT / 'catalog-controls.json').write_text(json.dumps(activations, indent=2))
    print('Catalog inspection:', len(seen_patterns), 'patterns,', sum(map(len, activations.values())), 'demo commands')
    page.close()


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.getenv('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
        exercise_catalog(browser)
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
        page.locator('#layout-list').click()
        expect(page.locator('.component-card').first).to_have_css('display', 'grid')
        page.locator('#layout-grid').click()
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
        pane = page.locator('#detail-preview').locator('..')
        desktop_width = pane.bounding_box()['width']
        page.locator('[data-device="mobile"]').click()
        assert pane.bounding_box()['width'] <= 280 < desktop_width
        page.locator('[data-device="desktop"]').click()
        assert pane.bounding_box()['width'] == desktop_width
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
        # Transfer a customized library pattern, then reopen the exported project.
        restored.locator('[data-inspect="13"]').click()
        restored.locator('[data-preset="cinema"]').click()
        restored.locator('#custom-text').fill('Variante de prueba')
        restored.locator('#reduce-motion').check()
        restored.locator('#detail-compose').click()
        expect(restored.locator('#m4-name')).to_be_visible()
        restored.locator('#m4-save').click()
        restored.reload()
        with restored.expect_download() as output:
            restored.locator('#m4-html').click()
        path = OUT / 'variante-compuesta.html'
        output.value.save_as(str(path))
        viewer = clean.new_page()
        viewer.goto(path.as_uri())
        root = viewer.locator('.demo-root[data-demo-id="13"]')
        for key, value in {'text':'Variante de prueba','accent':'#f2a0ca','speed':'0.75','reduced':'true'}.items():
            expect(root).to_have_attribute('data-' + key, value)
        viewer.close()
        # A project backup containing v3 data must restore without replacing local projects.
        restored.locator('.pro-suite-nav [data-pro-go="design"]').click()
        restored.locator('#u-save-design').click()
        restored.locator('.pro-suite-nav [data-pro-go="editor"]').click()
        with restored.expect_download() as output:
            restored.locator('#m4-backup-all').click()
        backup_path = OUT / 'studio.json'
        output.value.save_as(str(backup_path))
        restored.once('dialog', lambda dialog: dialog.accept())
        restored.locator('#m4-import-file').set_input_files(str(backup_path))
        expect(restored.locator('#m4-live-region')).to_contain_text('Backup fusionado')
        assert restored.evaluate("JSON.parse(localStorage.getItem('motion404-v4-imported-v3')).data.designs.length") == 1
        restored.locator('.pro-suite-nav [data-pro-go="catalog"]').click()
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
        # Each sequencer track uses its own timing, including on repeated playback.
        restored.locator('.pro-suite-nav [data-pro-go="timeline"]').click()
        restored.locator('#u-title-delay').fill('830')
        restored.locator('#u-play').click()
        timings = restored.locator('#u-anim-target [data-track]').evaluate_all(
            'els => els.map(el => el.getAnimations()[0].effect.getTiming().delay)')
        assert timings == [0, 830, 440], timings
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
        for destination in ['overview','editor','motion','design','timeline','effects','game','resources','original','catalog']:
            await_drawer.tap()
            mobile.locator(f'.pro-suite-nav [data-pro-go="{destination}"]').tap()
            assert mobile.url.endswith('#' + destination) if destination != 'overview' else not mobile.url.endswith('#catalog')
            assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth+1'), destination
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
