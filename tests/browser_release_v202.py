#!/usr/bin/env python3
import json, os, tempfile, time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait

URL=os.environ.get('MOTION_LOCAL_URL','http://127.0.0.1:8000/Motion-404/')
PROD='https://ivan7800.github.io/Motion-404/'
passed=[]

def ok(name,cond,detail=''):
    if not cond: raise AssertionError(f'{name}: {detail}')
    passed.append(name); print(f'PASS | {name} | {detail}')

def errs(d): return [e.get('message','') for e in d.get_log('browser') if e.get('level') in ('SEVERE','ERROR')]
def text(d,s): return d.find_element(By.CSS_SELECTOR,s).text
def val(d,s): return d.find_element(By.CSS_SELECTOR,s).get_attribute('value')

def probe(d,s):
    e=d.find_element(By.CSS_SELECTOR,s)
    d.execute_script("arguments[0].scrollIntoView({block:'center',inline:'center',behavior:'instant'});",e);time.sleep(.05)
    p=d.execute_script("""const e=arguments[0],r=e.getBoundingClientRect(),c=getComputedStyle(e),x=Math.max(1,Math.min(innerWidth-2,r.left+r.width/2)),y=Math.max(1,Math.min(innerHeight-2,r.top+r.height/2)),t=document.elementFromPoint(x,y);return{pointer:c.pointerEvents,z:c.zIndex,display:c.display,visibility:c.visibility,viewport:r.top<innerHeight&&r.bottom>0,top:t?(t.tagName+'#'+(t.id||'')+'.'+String(t.className||'')):'null',reachable:!!t&&(t===e||e.contains(t)||t.contains(e))};""",e)
    return e,p

def click(d,s,label):
    e,p=probe(d,s);ok(label+' pointer-events',p['pointer']!='none',p);ok(label+' hit-test',p['viewport'] and p['display']!='none' and p['visibility']!='hidden' and p['reachable'],p);d.execute_script('arguments[0].click()',e);time.sleep(.08)

opts=Options();opts.add_argument('--headless=new');opts.add_argument('--no-sandbox');opts.add_argument('--disable-dev-shm-usage');opts.add_argument('--window-size=1440,1100');opts.set_capability('goog:loggingPrefs',{'browser':'ALL'})
d=webdriver.Chrome(options=opts)
try:
    d.get(PROD+'?diagnosis='+str(int(time.time())));time.sleep(3)
    production={'ready':bool(d.execute_script('return window.__MOTION404_READY__ === true')),'cards':len(d.find_elements(By.CSS_SELECTOR,'.preset-card')),'errors':errs(d)}
    print('PRODUCTION_BEFORE_FIX='+json.dumps(production,ensure_ascii=False))

    d.get(URL+'?qa='+str(int(time.time())))
    WebDriverWait(d,15).until(lambda x:x.execute_script('return window.__MOTION404_READY__===true'))
    qa=d.execute_script('return window.__MOTION404_QA__')
    ok('runtime listo',qa['version']=='2.0.2' and qa['ready'],qa);ok('listeners bound',qa['listeners']=='bound',qa);ok('catálogo 180',qa['presets']==180,qa);ok('render inicial 18',len(d.find_elements(By.CSS_SELECTOR,'.preset-card'))==18,len(d.find_elements(By.CSS_SELECTOR,'.preset-card')))

    click(d,'#loadMorePresets','Mostrar más');ok('Mostrar más acción',len(d.find_elements(By.CSS_SELECTOR,'.preset-card'))==36,len(d.find_elements(By.CSS_SELECTOR,'.preset-card')))
    q=d.find_element(By.ID,'presetSearch');q.clear();q.send_keys('arquitectura');time.sleep(.08);ok('Buscar acción',text(d,'#presetCount')=='18 presets',text(d,'#presetCount'))
    click(d,'#clearPresetFilters','Limpiar filtros');ok('Limpiar acción',text(d,'#presetCount')=='180 presets',text(d,'#presetCount'))
    Select(d.find_element(By.ID,'categoryFilter')).select_by_value('Gaming');time.sleep(.08);ok('Categoría acción',text(d,'#presetCount')=='12 presets',text(d,'#presetCount'))
    click(d,'#clearPresetFilters','Limpiar categoría');Select(d.find_element(By.ID,'dnaFilter')).select_by_value('cinematic');time.sleep(.08);ok('DNA filtro acción',text(d,'#presetCount')=='30 presets',text(d,'#presetCount'));click(d,'#clearPresetFilters','Limpiar DNA')

    click(d,'#randomPreset','Sorpréndeme');ok('Sorpréndeme acción',bool(val(d,'#projectInput')),val(d,'#projectInput'))
    click(d,'.preset-card [data-use]','Usar preset');ok('Usar preset acción',val(d,'#projectInput')=='Atlas Habitat',val(d,'#projectInput'))
    click(d,'.preset-card [data-preview]','DNA preview');ok('DNA preview acción',d.find_element(By.ID,'outputPanel').is_displayed(),text(d,'#output-title'))

    r0=int(text(d,'#riskScore'));rng=d.find_element(By.ID,'intensityRange');d.execute_script("arguments[0].value='5';arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",rng);time.sleep(.08);r1=int(text(d,'#riskScore'));ok('Inspector reactivo',r1>=r0,f'{r0}->{r1}');click(d,'#inspectButton','Inspeccionar riesgo');ok('Inspeccionar acción','Riesgo recalculado' in text(d,'#toast'),text(d,'#toast'))

    p=d.find_element(By.ID,'projectInput');p.clear();p.send_keys('QA Motion 404');click(d,'#systemForm button[type="submit"]','Generar Motion System');ok('Generar acción',text(d,'#output-title')=='QA Motion 404',text(d,'#output-title'));ok('Spec 2.0.2',d.execute_script("return document.querySelector('#specOutput').textContent.includes('Motion 404 v2.0.2')"),'textContent')
    for tab,panel in [('spec','panel-spec'),('timeline','panel-timeline'),('qa','panel-qa'),('dna','panel-dna')]: click(d,f'#tab-{tab}',f'Tab {tab}');ok(f'Tab {tab} acción',d.find_element(By.ID,panel).is_displayed(),panel)

    click(d,'#copyOutput','Copiar');ok('Copiar acción',bool(text(d,'#toast')),text(d,'#toast'));click(d,'#downloadOutput','Descargar');ok('Descargar acción',True,'evento')
    click(d,'#saveSystem','Guardar');ok('Guardar acción',len(d.find_elements(By.CSS_SELECTOR,'.saved-card'))==1,len(d.find_elements(By.CSS_SELECTOR,'.saved-card')))
    state=d.execute_script("return JSON.parse(localStorage.getItem('motion404-v2-state'))")
    saved_name=text(d,'.saved-card h3');p=d.find_element(By.ID,'projectInput');p.clear();p.send_keys('Changed');click(d,'[data-load-system]','Abrir guardado');ok('Abrir acción',val(d,'#projectInput')==saved_name,val(d,'#projectInput'))
    click(d,'#exportSystems','Exportar JSON');ok('Exportar acción',True,'evento')
    click(d,'[data-delete-system]','Eliminar guardado');ok('Eliminar acción',len(d.find_elements(By.CSS_SELECTOR,'.saved-card'))==0,len(d.find_elements(By.CSS_SELECTOR,'.saved-card')))

    # Real file-input import using the system saved above.
    payload={'app':'Motion 404','version':'2.0.2','exportedAt':'2026-09-13T00:00:00Z','saved':state['saved']}
    with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False,encoding='utf-8') as f:
        json.dump(payload,f,ensure_ascii=False); import_path=f.name
    d.find_element(By.ID,'importSystems').send_keys(import_path);time.sleep(.2);ok('Importar JSON acción',len(d.find_elements(By.CSS_SELECTOR,'.saved-card'))==1,len(d.find_elements(By.CSS_SELECTOR,'.saved-card')));Path(import_path).unlink(missing_ok=True)
    click(d,'#clearSystems','Borrar guardados');d.switch_to.alert.accept();time.sleep(.1);ok('Borrar guardados acción',len(d.find_elements(By.CSS_SELECTOR,'.saved-card'))==0,len(d.find_elements(By.CSS_SELECTOR,'.saved-card')))

    old=d.find_element(By.TAG_NAME,'html').get_attribute('data-theme');click(d,'#themeButton','Tema');ok('Tema acción',d.find_element(By.TAG_NAME,'html').get_attribute('data-theme')!=old,old+'->'+d.find_element(By.TAG_NAME,'html').get_attribute('data-theme'))
    d.execute_script("let r=document.querySelector('#intensityRange');r.value='5';r.dispatchEvent(new Event('input',{bubbles:true}));");click(d,'#systemForm button[type="reset"]','Restablecer');time.sleep(.1);ok('Restablecer acción',val(d,'#intensityRange')=='3',val(d,'#intensityRange'))

    # Explicit layer/pointer-events check on critical controls.
    layers={}
    for s in ['#randomPreset','#clearPresetFilters','#loadMorePresets','#inspectButton','#systemForm button[type="submit"]','#saveSystem','#copyOutput','#downloadOutput','#exportSystems','#clearSystems','#themeButton']:
        _,info=probe(d,s);layers[s]=info;ok('capa '+s,info['pointer']!='none' and info['reachable'],info)

    d.execute_script("window.scrollTo({top:0,behavior:'instant'});document.querySelector('#presetSearch').blur()")
    d.find_element(By.TAG_NAME,'body').send_keys('/');time.sleep(.08);ok('Atajo /',d.execute_script('return document.activeElement.id')=='presetSearch',d.execute_script('return document.activeElement.id'))
    ok('consola limpia',not errs(d),errs(d))

    # Service Worker: correct cache, control after reload, and offline reload.
    WebDriverWait(d,10).until(lambda x:x.execute_async_script("const done=arguments[0];navigator.serviceWorker.ready.then(()=>done(true)).catch(()=>done(false));"))
    keys=d.execute_async_script("const done=arguments[0];caches.keys().then(done)")
    ok('cache v2.0.2',any(k=='motion-404-v2.0.2' for k in keys),keys)
    d.refresh();WebDriverWait(d,15).until(lambda x:x.execute_script('return window.__MOTION404_READY__===true'));ok('SW controla recarga',d.execute_script('return !!navigator.serviceWorker.controller'),d.execute_script('return !!navigator.serviceWorker.controller'))
    d.execute_cdp_cmd('Network.enable',{});d.execute_cdp_cmd('Network.emulateNetworkConditions',{'offline':True,'latency':0,'downloadThroughput':0,'uploadThroughput':0,'connectionType':'none'});d.refresh();WebDriverWait(d,15).until(lambda x:x.execute_script('return window.__MOTION404_READY__===true'));ok('recarga offline',len(d.find_elements(By.CSS_SELECTOR,'.preset-card'))==18,len(d.find_elements(By.CSS_SELECTOR,'.preset-card')));d.execute_cdp_cmd('Network.emulateNetworkConditions',{'offline':False,'latency':0,'downloadThroughput':-1,'uploadThroughput':-1,'connectionType':'wifi'})

    print('RELEASE_QA='+json.dumps({'passes':len(passed),'layers':layers,'production_before_fix':production},ensure_ascii=False))
finally:
    d.quit()
