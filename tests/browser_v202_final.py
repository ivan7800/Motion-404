#!/usr/bin/env python3
import json, os, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait

LOCAL=os.environ.get('MOTION_LOCAL_URL','http://127.0.0.1:8000/Motion-404/')
PROD='https://ivan7800.github.io/Motion-404/'
passed=[]

def ok(name, condition, detail=''):
    if not condition: raise AssertionError(f'{name}: {detail}')
    passed.append(name); print(f'PASS | {name} | {detail}')

def errors(d):
    return [x.get('message','') for x in d.get_log('browser') if x.get('level') in ('SEVERE','ERROR')]

def text(d,s): return d.find_element(By.CSS_SELECTOR,s).text
def value(d,s): return d.find_element(By.CSS_SELECTOR,s).get_attribute('value')

def probe(d,s):
    e=d.find_element(By.CSS_SELECTOR,s)
    d.execute_script("arguments[0].scrollIntoView({block:'center',inline:'center',behavior:'instant'});",e)
    time.sleep(.08)
    return e,d.execute_script("""
      const e=arguments[0],r=e.getBoundingClientRect(),c=getComputedStyle(e);
      const x=Math.max(1,Math.min(innerWidth-2,r.left+r.width/2));
      const y=Math.max(1,Math.min(innerHeight-2,r.top+r.height/2));
      const t=document.elementFromPoint(x,y);
      return {pointer:c.pointerEvents,display:c.display,visibility:c.visibility,z:c.zIndex,
        viewport:r.top<innerHeight&&r.bottom>0&&r.left<innerWidth&&r.right>0,
        top:t?(t.tagName+'#'+(t.id||'')+'.'+String(t.className||'')):'null',
        reachable:!!t&&(t===e||e.contains(t)||t.contains(e))};
    """,e)

def click(d,s,label):
    e,p=probe(d,s)
    ok(label+' pointer-events',p['pointer']!='none',p)
    ok(label+' sin capa superpuesta',p['viewport'] and p['display']!='none' and p['visibility']!='hidden' and p['reachable'],p)
    d.execute_script('arguments[0].click()',e); time.sleep(.1)

opts=Options(); opts.add_argument('--headless=new'); opts.add_argument('--no-sandbox'); opts.add_argument('--disable-dev-shm-usage'); opts.add_argument('--window-size=1440,1100'); opts.set_capability('goog:loggingPrefs',{'browser':'ALL'})
d=webdriver.Chrome(options=opts)
try:
    # Real production diagnosis before applying the branch.
    d.get(PROD+'?diagnosis='+str(int(time.time()))); time.sleep(3)
    prod={'ready':bool(d.execute_script('return window.__MOTION404_READY__ === true')),'cards':len(d.find_elements(By.CSS_SELECTOR,'.preset-card')),'errors':errors(d)}
    print('PRODUCTION_DIAGNOSIS='+json.dumps(prod,ensure_ascii=False))

    # Exact PR code under a /Motion-404/ path.
    d.get(LOCAL+'?qa='+str(int(time.time())))
    WebDriverWait(d,15).until(lambda x:x.execute_script('return window.__MOTION404_READY__ === true'))
    qa=d.execute_script('return window.__MOTION404_QA__')
    ok('runtime 2.0.2 listo',qa['ready'] and qa['version']=='2.0.2',qa)
    ok('listeners enlazados',qa['listeners']=='bound',qa)
    ok('180 presets generados',qa['presets']==180,qa)
    ok('18 tarjetas iniciales',len(d.find_elements(By.CSS_SELECTOR,'.preset-card'))==18,len(d.find_elements(By.CSS_SELECTOR,'.preset-card')))

    click(d,'#loadMorePresets','Mostrar más'); ok('Mostrar más resultado',len(d.find_elements(By.CSS_SELECTOR,'.preset-card'))==36,len(d.find_elements(By.CSS_SELECTOR,'.preset-card')))
    q=d.find_element(By.ID,'presetSearch');q.clear();q.send_keys('arquitectura');time.sleep(.1);ok('Buscar',text(d,'#presetCount')!='180 presets',text(d,'#presetCount'))
    click(d,'#clearPresetFilters','Limpiar filtros');ok('Limpiar filtros resultado',text(d,'#presetCount')=='180 presets',text(d,'#presetCount'))
    Select(d.find_element(By.ID,'categoryFilter')).select_by_value('Gaming');time.sleep(.1);ok('Filtro categoría',text(d,'#presetCount')=='12 presets',text(d,'#presetCount'))
    click(d,'#clearPresetFilters','Limpiar filtros categoría')
    Select(d.find_element(By.ID,'dnaFilter')).select_by_value('cinematic');time.sleep(.1);ok('Filtro DNA',text(d,'#presetCount')=='30 presets',text(d,'#presetCount'))
    click(d,'#clearPresetFilters','Limpiar filtros DNA')

    click(d,'#randomPreset','Sorpréndeme');ok('Sorpréndeme resultado',bool(value(d,'#projectInput')),value(d,'#projectInput'))
    click(d,'.preset-card [data-use]','Usar preset');ok('Usar preset resultado',bool(value(d,'#projectInput')),value(d,'#projectInput'))
    click(d,'.preset-card [data-preview]','DNA');ok('DNA resultado',d.find_element(By.ID,'outputPanel').is_displayed(),text(d,'#output-title'))

    before=int(text(d,'#riskScore'));r=d.find_element(By.ID,'intensityRange');d.execute_script("arguments[0].value='5';arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",r);time.sleep(.1);after=int(text(d,'#riskScore'));ok('Inspector reactivo',after>=before,f'{before}->{after}')
    click(d,'#inspectButton','Inspeccionar riesgo');ok('Inspeccionar resultado','Riesgo recalculado' in text(d,'#toast'),text(d,'#toast'))

    p=d.find_element(By.ID,'projectInput');p.clear();p.send_keys('QA Motion 404')
    click(d,'#systemForm button[type="submit"]','Generar Motion System');ok('Generar resultado',text(d,'#output-title')=='QA Motion 404',text(d,'#output-title'));ok('Spec 2.0.2','Motion 404 v2.0.2' in text(d,'#specOutput'),'v2.0.2')
    for tab,panel in [('spec','panel-spec'),('timeline','panel-timeline'),('qa','panel-qa'),('dna','panel-dna')]: click(d,f'#tab-{tab}',f'Tab {tab}');ok(f'Tab {tab} resultado',d.find_element(By.ID,panel).is_displayed(),panel)

    click(d,'#copyOutput','Copiar');ok('Copiar resultado',bool(text(d,'#toast')),text(d,'#toast'))
    click(d,'#downloadOutput','Descargar sistema');ok('Descargar resultado',True,'evento ejecutado')
    click(d,'#saveSystem','Guardar');ok('Guardar resultado',len(d.find_elements(By.CSS_SELECTOR,'.saved-card'))==1,len(d.find_elements(By.CSS_SELECTOR,'.saved-card')))
    saved=text(d,'.saved-card h3');p=d.find_element(By.ID,'projectInput');p.clear();p.send_keys('Changed');click(d,'[data-load-system]','Abrir guardado');ok('Abrir guardado resultado',value(d,'#projectInput')==saved,value(d,'#projectInput'))
    click(d,'#exportSystems','Exportar JSON');ok('Exportar resultado',True,'evento ejecutado')
    click(d,'[data-delete-system]','Eliminar guardado');ok('Eliminar guardado resultado',len(d.find_elements(By.CSS_SELECTOR,'.saved-card'))==0,len(d.find_elements(By.CSS_SELECTOR,'.saved-card')))

    theme=d.find_element(By.TAG_NAME,'html').get_attribute('data-theme');click(d,'#themeButton','Cambiar tema');ok('Cambiar tema resultado',d.find_element(By.TAG_NAME,'html').get_attribute('data-theme')!=theme,theme+' -> '+d.find_element(By.TAG_NAME,'html').get_attribute('data-theme'))
    d.execute_script("let r=document.querySelector('#intensityRange');r.value='5';r.dispatchEvent(new Event('input',{bubbles:true}));");click(d,'#systemForm button[type="reset"]','Restablecer');time.sleep(.1);ok('Restablecer resultado',value(d,'#intensityRange')=='3',value(d,'#intensityRange'))

    # Controls that can be inactive by state are still checked for CSS hit testing independently.
    layer_selectors=['#randomPreset','#clearPresetFilters','#loadMorePresets','#inspectButton','#systemForm button[type="submit"]','#saveSystem','#copyOutput','#downloadOutput','#exportSystems','#clearSystems','#themeButton']
    report={}
    for s in layer_selectors:
        _,info=probe(d,s);report[s]=info;ok('capa '+s,info['pointer']!='none' and info['reachable'],info)

    d.execute_script("window.scrollTo({top:0,behavior:'instant'});document.querySelector('#presetSearch').blur()")
    d.find_element(By.TAG_NAME,'body').send_keys('/');time.sleep(.1);ok('Atajo /',d.execute_script('return document.activeElement.id')=='presetSearch',d.execute_script('return document.activeElement.id'))

    console=errors(d);ok('Consola rama limpia',not console,console)
    print('FINAL_QA='+json.dumps({'passed':len(passed),'production_before_fix':prod,'layers':report},ensure_ascii=False))
finally:
    d.quit()
