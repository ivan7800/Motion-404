"""v5.3 real Chromium DOM regression (resource-injection due to network navigation policy).
This is not a real Service Worker/PWA install or a Windows/Safari test.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,re,json
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
 return '(function(){\n'+'\n'.join(parts)+'\n})();'
def project(page):
 return page.evaluate("() => {const d=JSON.parse(localStorage.getItem('motion404-ultimate-v4-projects'));return d.projects.find(p=>p.id===d.active)}")
def run():
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.getenv('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--no-proxy-server'])
  page=browser.new_page(viewport={'width':1500,'height':900},accept_downloads=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  html=(ROOT/'index.html').read_text()
  html=re.sub(r'<script[^>]+src="[^"]+"[^>]*></script>','',html)
  html=re.sub(r'<link[^>]+href="\./src/[^>]+>','',html)
  page.set_content(html)
  page.evaluate('''() => {
    const data=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k),clear:()=>data.clear()}});
    history.replaceState=()=>{};window.scrollTo=()=>{};window.fetch=async()=>({ok:false,status:404});navigator.clipboard={writeText:async()=>{}};
  }''')
  for name in CSS:page.add_style_tag(content=(ROOT/name).read_text())
  for name in CLASSIC:page.add_script_tag(content=(ROOT/name).read_text())
  page.add_script_tag(content=bundle())
  assert not errors,errors
  page.locator('[data-pro-go="editor"]').first.click()
  page.locator('#m52-all').click()
  page.locator('#m52-group').click()
  assert len(set(b['group'] for b in project(page)['blocks']))==1
  assert page.locator('#m4-stage-host').evaluate("el=>el.shadowRoot.querySelectorAll('.m404-group-grid').length")==1
  page.locator('[data-m53-select-group]').first.click()
  assert page.locator('#m4-inspector [data-m53-group-prop="layout"]').count()==1
  page.locator('#m4-inspector [data-m53-group-prop="layout"]').select_option('free')
  assert project(page)['groups'][0]['layout']=='free'
  assert page.locator('#m4-stage-host').evaluate("el=>el.shadowRoot.querySelectorAll('.m53-drag-handle').length")==4
  # Mouse/Pointer test: drag a free-positioned block through its real handle.
  page.locator('#m4-stage-host .m53-drag-handle').first.scroll_into_view_if_needed()
  rect=page.locator('#m4-stage-host .m53-drag-handle').first.bounding_box()
  assert rect is not None,'El manejador de arrastre debe estar visible'
  before=project(page)['blocks'][0]['position'].copy()
  page.mouse.move(rect['x']+rect['width']/2,rect['y']+rect['height']/2)
  page.mouse.down()
  page.mouse.move(rect['x']+rect['width']/2+42,rect['y']+rect['height']/2+25,steps=6)
  page.mouse.up()
  moved=project(page)['blocks'][0]['position']
  assert moved['x']!=before['x'] or moved['y']!=before['y'],f'Arrastre no se guardó: {before} -> {moved}'
  page.locator('#m5-layers [data-m5-select]').first.click()
  page.locator('#m4-inspector [data-m53-pos="x"]').fill('200')
  page.locator('#m4-inspector [data-m53-pos="x"]').dispatch_event('change')
  assert project(page)['blocks'][0]['position']['x']==200
  assert page.locator('#m4-stage-host').evaluate("el=>el.shadowRoot.querySelector('[data-block-id]').style.left")== '200px'
  page.locator('[data-m53-select-group]').first.click()
  page.locator('#m4-inspector [data-m53-group-prop="gap"]').fill('24')
  page.locator('#m4-inspector [data-m53-group-prop="gap"]').dispatch_event('change')
  assert project(page)['groups'][0]['gap']==24
  page.locator('#m5-layers [data-m5-select]').first.click()
  with page.expect_download() as info:page.locator('#m4-html').click()
  exported=ROOT/'tests'/'export-v53-groups.html';info.value.save_as(str(exported))
  txt=exported.read_text();assert 'm404-group-free' in txt and 'left:200px' in txt
  viewer=browser.new_page();viewer_errors=[];viewer.on('pageerror',lambda e:viewer_errors.append(str(e)))
  viewer.set_content(txt)
  assert viewer.locator('.m404-group-free').count()==1
  assert viewer.locator('.m404-group-free > .m404-block').count()==4
  assert viewer.evaluate("getComputedStyle(document.querySelector('.m404-group-free')).position")=='relative'
  assert not viewer_errors,viewer_errors
  viewer.close()
  with page.expect_download() as jsx:page.locator('#m4-react').click()
  jsx_file=ROOT/'tests'/'export-v53-groups.jsx';jsx.value.save_as(str(jsx_file))
  assert 'm404-group-free' in jsx_file.read_text()
  page.screenshot(path=str(ROOT/'tests'/'v53-editor-desktop.png'),full_page=True)
  page.set_viewport_size({'width':390,'height':844})
  page.screenshot(path=str(ROOT/'tests'/'v53-editor-mobile.png'),full_page=True)
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
  assert not errors,errors
  print('PASS Chromium v5.3 geometric group, group inspector, grid→free, custom geometry, saved state, HTML render, JSX, responsive mobile, 0 JS exceptions')
  browser.close()
if __name__=='__main__':run()
