"""Browser real DOM QA using set_content on about:blank.
No HTTP/file navigation: the current CI environment denies navigations via a Chromium administrator policy.
This is a partial browser test, not proof of live GitHub Pages/PWA/HTTP behavior.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,re,sys,json
ROOT=Path(__file__).resolve().parent.parent
CLASSIC=['src/catalog.js','src/components.js','src/engine.js','src/export-payload.js','src/app.js','src/ultimate-data.js','src/motion-v2-core.js','src/ultimate.js','src/pro.js']
CSS=['src/style.css','src/ultimate.css','src/pro.css','src/editor.css']
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
  assert page.evaluate('window.M404_V2_CORE.presets.length')==180
  page.locator('[data-pro-go="motion"]').first.click()
  assert page.locator('#u-preset-select option').count()==180
  assert 'QA ' in page.locator('#u-risk-text').inner_text()
  page.locator('[data-pro-go="editor"]').first.click()
  assert page.locator('#m52-timeline-host .m52-track').count()==4
  for mode in ['fantasy','scifi','sanity']:
    page.locator(f'[data-m52-hud="{mode}"]').click()
    stored=page.evaluate("() => {let d=JSON.parse(localStorage.getItem('motion404-ultimate-v4-projects'));return d.projects.find(p=>p.id===d.active).blocks.at(-1).hudStyle}")
    assert stored==mode,(mode,stored)
  page.locator('#m52-all').click()
  assert page.locator('#m5-layers .is-selected').count()==7
  page.locator('#m52-group').click()
  groupIds=page.evaluate("() => {let d=JSON.parse(localStorage.getItem('motion404-ultimate-v4-projects'));return d.projects.find(p=>p.id===d.active).blocks.map(b=>b.group)}")
  assert len(set(groupIds))==1 and bool(groupIds[0]),groupIds
  page.locator('[data-m52-align="center"]').click()
  assert page.evaluate("() => {let d=JSON.parse(localStorage.getItem('motion404-ultimate-v4-projects'));return d.projects.find(p=>p.id===d.active).blocks.every(b=>b.align==='center')}")
  page.locator('#m52-ungroup').click()
  assert page.evaluate("() => {let d=JSON.parse(localStorage.getItem('motion404-ultimate-v4-projects'));return d.projects.find(p=>p.id===d.active).blocks.every(b=>!b.group)}")
  page.locator('#m5-layers .m5-layer').first.click()
  assert page.locator('#m5-layers .is-selected').count()==1
  page.locator('#m52-playhead').evaluate("el=>{el.value='180';el.dispatchEvent(new Event('input',{bubbles:true}))}")
  page.locator('[data-tl="add"]').click()
  frames=page.evaluate("() => {let d=JSON.parse(localStorage.getItem('motion404-ultimate-v4-projects'));return d.projects.find(p=>p.id===d.active).blocks[0].keyframes}")
  assert len(frames)==3,frames
  page.locator('#m52-easing').select_option('ease-in')
  assert page.evaluate("() => {let d=JSON.parse(localStorage.getItem('motion404-ultimate-v4-projects'));return d.projects.find(p=>p.id===d.active).blocks[0].easing}")=='ease-in'
  page.locator('#m52-opacity').fill('0.55')
  page.locator('#m52-opacity').dispatch_event('change')
  assert page.evaluate("() => {let d=JSON.parse(localStorage.getItem('motion404-ultimate-v4-projects'));return d.projects.find(p=>p.id===d.active).blocks[0].keyframes.some(k=>k.opacity===0.55)}")
  page.locator('[data-tl="play"]').click()
  assert page.locator('#m4-stage-host').evaluate("host => Array.from(host.shadowRoot.querySelectorAll('[data-block-id]')).some(n=>n.getAnimations().length>0)")
  page.locator('[data-tl="stop"]').click()
  with page.expect_download() as info:page.locator('#m4-html').click()
  exported=ROOT/'tests'/'export-v52-keyframes.html';info.value.save_as(str(exported))
  assert 'motion404Animations=' in exported.read_text()
  test=browser.new_page();export_errors=[];test.on('pageerror',lambda e:export_errors.append(str(e)))
  test.set_content(exported.read_text())
  assert test.locator('[data-motion-custom="true"]').count()==1
  assert test.evaluate("document.querySelector('[data-motion-custom=true]').getAnimations().length>0")
  assert not export_errors,export_errors
  test.close()
  page.screenshot(path=str(ROOT/'tests'/'v52-editor-desktop.png'),full_page=True)
  page.set_viewport_size({'width':390,'height':844})
  page.screenshot(path=str(ROOT/'tests'/'v52-editor-mobile.png'),full_page=True)
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
  assert not errors,errors
  print('PASS Chromium v5.2: 180 v2 presets, 3 HUDs, multi-select, group/align/ungroup, keyframes, easing, preview, HTML animation, mobile viewport; page errors=0')
  browser.close()

if __name__=='__main__':run()
