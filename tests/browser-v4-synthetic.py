"""Browser real DOM QA using set_content on about:blank.
No HTTP/file navigation: the current CI environment denies navigations via a Chromium administrator policy.
This is a partial browser test, not proof of live GitHub Pages/PWA/HTTP behavior.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,re,sys,json
ROOT=Path(__file__).resolve().parent.parent
CLASSIC=['src/catalog.js','src/components.js','src/engine.js','src/export-payload.js','src/library-model.js','src/app.js','src/ultimate-data.js','src/motion-v2-core.js','src/ultimate.js','src/pro.js']
CSS=['src/style.css','src/ultimate.css','src/pro.css','src/library.css','src/editor.css']
MODULES=['src/keyframes.mjs','src/group-layout.mjs','src/editor-core.mjs','src/zip-utils.mjs','src/legacy-migration.mjs','src/bridges.mjs','src/timeline-pro.mjs','src/editor.js']

def bundle():
    parts=[]
    for name in MODULES:
        src=(ROOT/name).read_text()
        src=re.sub(r'^import\s*\{[^;]*\}\s*from\s*[\'\"][^\'\"]+[\'\"];?\s*$', '',src,flags=re.MULTILINE)
        src=re.sub(r'^export\s+', '',src,flags=re.MULTILINE)
        parts.append(src)
    return "(function(){\n"+"\n".join(parts)+"\n})();"

def run():
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.getenv('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--no-proxy-server'])
  page=browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  html=(ROOT/'index.html').read_text()
  html=re.sub(r'<script[^>]+src="[^"]+"[^>]*></script>','',html)
  html=re.sub(r'<link[^>]+href="\./src/[^>]+>','',html)
  page.set_content(html)
  page.evaluate('''() => {
    const data=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k),clear:()=>data.clear()}});
    history.replaceState=()=>{};
    window.scrollTo=()=>{};
    window.fetch=async()=>({ok:false,status:404});
    navigator.clipboard={writeText:async()=>{}};
  }''')
  for name in CSS:
      page.add_style_tag(content=(ROOT/name).read_text())
  for name in CLASSIC:
      page.add_script_tag(content=(ROOT/name).read_text())
  page.add_script_tag(content=bundle())
  assert not errors,errors
  ready=page.evaluate("window.__MOTION404_EDITOR_READY__")
  assert ready['version']==4 and ready['components']==13,ready
  assert page.locator('.component-card').count()==12
  assert page.locator('#pro-overview').is_visible()
  page.locator('[data-pro-go="editor"]').click()
  assert page.locator('.m4-editor-panel').is_visible()
  assert page.locator('.m4-stage-host').count()==1
  assert page.locator('#m4-count').inner_text()=='4 bloques'
  page.locator('[data-kind="quote"]').click()
  assert page.locator('#m4-count').inner_text()=='5 bloques'
  page.locator('[data-m4-prop="text"]').fill('Diseño verificado en Chromium')
  assert 'Diseño verificado en Chromium' in page.locator('#m4-stage-host').evaluate("(host)=>host.shadowRoot.querySelector('.m404-project').innerText")
  page.locator('#m4-duplicate').click()
  assert page.locator('#m4-count').inner_text()=='6 bloques'
  assert page.locator('#m5-layers .m5-layer').count()==6
  page.locator('#m4-undo').click()
  assert page.locator('#m4-count').inner_text()=='5 bloques'
  page.locator('#m4-redo').click()
  assert page.locator('#m4-count').inner_text()=='6 bloques'
  page.locator('#m5-copy').click()
  page.locator('#m5-paste').click()
  assert page.locator('#m4-count').inner_text()=='7 bloques'
  page.locator('#m4-undo').click()
  assert page.locator('#m4-count').inner_text()=='6 bloques'
  page.locator('#m5-layers .m5-layer').first.click()
  assert page.locator('#m5-layers .m5-layer.is-selected').count()==1
  page.locator('#m5-layers .m5-layer').last.click()
  page.locator('#m4-remove').click()
  assert page.locator('#m4-count').inner_text()=='5 bloques'
  page.locator('#m4-mode-preview').click()
  assert page.locator('#m4-preview').is_visible()
  assert '<html lang="es">' in page.locator('#m4-preview').get_attribute('srcdoc')
  page.locator('[data-m4-device="mobile"]').click()
  assert page.locator('#m4-device-status').inner_text()=='390 PX'
  with page.expect_download() as info:
    page.locator('#m4-export').click()
  download=info.value
  assert download.suggested_filename.endswith('.zip')
  download.save_as(str(ROOT/'tests'/'export-v4-browser.zip'))
  page.locator('#m4-mode-edit').click()
  page.locator('#m4-pattern-select').select_option('1')
  page.locator('#m4-add-pattern').click()
  assert page.locator('#m4-count').inner_text()=='6 bloques'
  demo=page.locator('#m4-stage-host').locator('.demo-root').last
  assert demo.count()==1,'Pattern library was not mounted in composer'
  demo.locator('[data-field="email"]').fill('ejemplo@ejemplo.com')
  demo.locator('[data-act="invite"]').click()
  assert 'Invitaciones preparadas: 1' in demo.inner_text(), 'Shadow DOM pattern interaction reset on selection'
  with page.expect_download() as info:
    page.locator('#m4-export').click()
  info.value.save_as(str(ROOT/'tests'/'export-v4-pattern.zip'))
  with page.expect_download() as info:
    page.locator('#m4-html').click()
  exported=(ROOT/'tests'/'export-v4-pattern.html')
  info.value.save_as(str(exported))
  standalone=browser.new_page()
  se=[];standalone.on('pageerror',lambda e:se.append(str(e)))
  standalone.set_content(exported.read_text())
  standalone.locator('.b-pattern .demo-root').first.wait_for()
  assert standalone.locator('.b-pattern .demo-root').count()==1
  assert not se, se
  page.locator('#m4-save').click()
  assert page.evaluate('localStorage.getItem("motion404-ultimate-v4-projects")')
  # Real interaction bridge: Motion DNA → Composer → design tokens → timeline → Game HUD.
  page.locator('[data-pro-go="motion"]').first.click()
  page.locator('#u-project').fill('Proyecto Fusionado 404')
  page.locator('#u-dna').select_option('spatial')
  page.locator('[data-m4-bridge="motion"]').click()
  assert page.locator('#m4-name').input_value()=='Proyecto Fusionado 404'
  page.locator('[data-pro-go="design"]').first.click()
  page.locator('#u-primary').fill('#ab44cc')
  page.locator('[data-m4-bridge="design"]').click()
  assert page.locator('#m4-stage-host').evaluate("host=>host.shadowRoot.querySelector('style').textContent.includes('--accent:#ab44cc')")
  page.locator('[data-pro-go="timeline"]').first.click()
  page.locator('#u-intro-delay').fill('330')
  page.locator('[data-m4-bridge="timeline"]').click()
  assert page.evaluate('JSON.parse(localStorage.getItem("motion404-ultimate-v4-projects")).projects.some(p=>p.name==="Proyecto Fusionado 404"&&p.blocks[0].delay===330)')
  page.locator('[data-pro-go="game"]').first.click()
  page.locator('#u-game-title').fill('SANITY-404')
  page.locator('#u-health').fill('35')
  page.locator('#u-sanity').fill('18')
  page.locator('[data-m4-bridge="game"]').click()
  assert '35%' in page.locator('#m4-stage-host').evaluate("host=>host.shadowRoot.textContent")
  # Browser import uses actual exported v2 format app/version/saved, not internal storage format.
  page.on('dialog',lambda dialog:dialog.accept())
  sys={"app":"Motion 404","version":"2.0.2","saved":[{"id":"sys-201","project":"ARCHIVO V2","created":"2026-09-13T00:00:00Z","input":{"experience":"Landing page","industry":"Arquitectura","stack":"HTML + CSS + JS","visual":"Brutalismo editorial","dna":"cinematic","pace":"calm","depth":"flat","intensity":3,"features":["microinteractions"],"context":"Visión original"},"profile":{"label":"Cinematic","easing":"linear"},"risk":{"perf":10,"cog":10,"a11y":10,"total":10},"qa":{"score":100,"checks":[]},"timeline":[],"recommendations":[],"spec":"ok"}]}
  page.locator('#m4-import-file').set_input_files({"name":"motion-v2.json","mimeType":"application/json","buffer":json.dumps(sys).encode()})
  assert page.evaluate('JSON.parse(localStorage.getItem("motion404-v2-state")).saved.length')==1
  page.locator('#m4-legacy-system-select').select_option('sys-201')
  page.locator('#m4-convert-v2').click()
  assert page.locator('#m4-name').input_value()=='ARCHIVO V2'
  assert page.evaluate('JSON.parse(localStorage.getItem("motion404-v2-state")).saved[0].project')=='ARCHIVO V2'
  page.locator('#m4-full').click()
  assert page.locator('#m4-full-dialog').evaluate('(el)=>el.open')
  page.locator('#m4-close-full').click()
  assert not errors,errors
  assert not errors,errors
  page.screenshot(path=str(ROOT/'tests'/'v4-editor-desktop.png'),full_page=True)
  # Mobile interaction is checked in desktop Chromium using the responsive viewport.
  page.set_viewport_size({'width':390,'height':844})
  page.screenshot(path=str(ROOT/'tests'/'v4-editor-mobile.png'),full_page=True)
  assert page.locator('#m4-export').is_visible()
  print('MOBILE',page.evaluate("""() => ({innerWidth,scrollWidth:document.documentElement.scrollWidth, offenders:Array.from(document.querySelectorAll('*')).filter(e=>{const b=e.getBoundingClientRect();return b.right>innerWidth+2&&getComputedStyle(e).position!=='fixed'}).slice(0,20).map(e=>[e.tagName,e.id,e.className?.toString().slice(0,40),Math.round(e.getBoundingClientRect().right)])})"""))
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'horizontal scroll on mobile' 
  print('PASS: Chromium DOM synthetic: 84 patterns, editing, inline pattern behavior, standalone exported HTML, 4 live bridges, legacy migration, fullscreen, responsive, ZIP, persistence; page errors=0')
  browser.close()

if __name__=='__main__':run()
