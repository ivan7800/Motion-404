#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class AuditParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.refs: list[str] = []
        self.lang = None
        self.buttons: list[dict[str, str | None]] = []
        self.anchors: list[str] = []
        self._button_depth = 0
        self._button_has_text: list[bool] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == 'html': self.lang = data.get('lang')
        if data.get('id'): self.ids.append(str(data['id']))
        if tag in {'script','link','img'}:
            ref = data.get('src') or data.get('href')
            if ref and not str(ref).startswith(('http:','https:','data:','#')): self.refs.append(str(ref))
        if tag == 'a' and data.get('href'):
            self.anchors.append(str(data['href']))
        if tag == 'button':
            self.buttons.append(data)
            self._button_depth += 1
            self._button_has_text.append(False)

    def handle_endtag(self, tag: str) -> None:
        if tag == 'button' and self._button_depth:
            attrs = self.buttons[-self._button_depth]
            has_name = bool(attrs.get('aria-label') or attrs.get('title') or self._button_has_text[-self._button_depth])
            assert has_name, f'Button without accessible name: {attrs}'
            self._button_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._button_depth and data.strip():
            self._button_has_text[-self._button_depth] = True


def balanced(text: str, left: str, right: str) -> bool:
    return text.count(left) == text.count(right)


def main() -> None:
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    css = (ROOT / 'styles.css').read_text(encoding='utf-8')
    js = (ROOT / 'app.js').read_text(encoding='utf-8')
    portable = (ROOT / 'Motion-404-PORTABLE.html').read_text(encoding='utf-8')

    parser = AuditParser(); parser.feed(html)
    assert parser.lang == 'es'
    assert len(parser.ids) == len(set(parser.ids)), 'Duplicate HTML ids found.'
    assert 'Content-Security-Policy' in html
    assert '<script defer src="app.js"></script>' in html, 'app.js must load as a classic deferred script for file:// compatibility.'
    assert 'type="module" src="app.js"' not in html, 'Module scripts are blocked when opened directly from file://.'
    assert '.reveal{opacity:1;transform:none}' in css, 'Content must remain visible if JavaScript does not run.'
    assert '<style>' in portable and '<script>' in portable, 'Portable build must inline CSS and JavaScript.'
    assert 'src="app.js"' not in portable and 'href="styles.css"' not in portable, 'Portable build must not depend on external app resources.'
    assert 'Content-Security-Policy' in portable and "'unsafe-inline'" not in portable, 'Portable build must use a hash-based CSP without unsafe-inline.'
    assert 'skip-link' in html
    assert 'aria-labelledby="dialogTitle"' in html and 'aria-labelledby="infoDialogTitle"' in html
    assert 'id="clearDataButton"' in html
    assert '<noscript>' in html and 'noscript-warning' in css
    assert '[hidden]{display:none!important}' in css, 'Author display rules must not expose controls marked hidden.'
    assert 'aria-labelledby="generatedTitle"' in html and 'id="generatedTitle" tabindex="-1"' in html
    assert 'A11y ready' not in html
    assert 'assets/universo-404.webp' in html
    assert 'assets/examples/architecture.webp' in js
    assert 'class="example-image"' in js, 'Do not claim complete accessibility without a full audit.'
    assert '--accent-text:#b63a12' in css, 'Light-theme accent text must preserve readable contrast.'
    assert '.site-footer>div>a,.site-footer>div>button{min-height:44px}' in css, 'Footer actions need usable mobile touch targets.'
    assert 'prefers-reduced-motion' in css
    assert balanced(css, '{', '}')
    assert balanced(js, '(', ')')
    assert balanced(js, '{', '}')

    for ref in parser.refs:
        path = (ROOT / ref.split('?',1)[0]).resolve()
        assert path.exists(), f'Missing local resource: {ref}'

    known_ids = set(parser.ids)
    for href in parser.anchors:
        if href.startswith('#'):
            assert href[1:] in known_ids, f'Broken internal anchor: {href}'
        elif not href.startswith(('http:','https:','mailto:','tel:')):
            path = (ROOT / href.split('#',1)[0].split('?',1)[0]).resolve()
            assert path.exists(), f'Broken local link: {href}'

    manifest = json.loads((ROOT / 'manifest.webmanifest').read_text(encoding='utf-8'))
    assert manifest.get('id') == './' and manifest.get('start_url') == './' and manifest.get('scope') == './'
    for icon in manifest['icons']:
        assert (ROOT / icon['src']).exists(), f"Missing manifest icon: {icon['src']}"
    for screenshot in manifest.get('screenshots', []):
        assert (ROOT / screenshot['src']).exists(), f"Missing manifest screenshot: {screenshot['src']}"

    sw = (ROOT / 'sw.js').read_text(encoding='utf-8')
    core_match = re.search(r'const CORE = \[(.*?)\];', sw, re.S)
    assert core_match
    assert "cache.put(request" in sw, 'Navigation responses must be cached under their own request.'
    assert "cache.put(APP_SHELL" not in sw, 'Non-app navigations must not overwrite the app shell cache.'
    assert "const CACHE_PREFIX = 'motion-404-'" in sw
    assert 'motion-404-${' not in sw
    assert 'v1.3.1' in sw
    assert 'key.startsWith(CACHE_PREFIX) && key !== CACHE' in sw, 'Activation must not delete caches belonging to other GitHub Pages apps.'
    assert 'const cached = await cache.match(request)' in sw, 'Runtime lookup must be isolated to the Motion 404 cache.'
    assert 'caches.match(event.request)' not in sw and 'caches.match(request)' not in sw, 'Avoid cross-application cache lookups on a shared origin.'
    for rel in re.findall(r"'([^']+)'", core_match.group(1)):
        if rel == './': continue
        assert (ROOT / rel.removeprefix('./')).exists(), f'Missing cached resource: {rel}'

    assert 'for (let round = 0; round < 6;' in js
    assert js.count("['") >= 30
    subprocess.run(['python3',str(ROOT/'tools/build_portable.py'),'--check'],check=True)
    subprocess.run(['node','--check',str(ROOT/'app.js')],check=True)
    subprocess.run(['node','--check',str(ROOT/'sw.js')],check=True)
    print('PASS: static structure, local resources, manifest, service worker and JavaScript syntax validated.')

if __name__ == '__main__':
    main()
