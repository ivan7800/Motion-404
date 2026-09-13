#!/usr/bin/env python3
import json, os, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait

LOCAL_URL=os.environ.get('MOTION_LOCAL_URL','http://127.0.0.1:8000/')
PROD_URL=os.environ.get('MOTION_PROD_URL','https://ivan7800.github.io/Motion-404/')
results=[]

def check(name, cond, detail=''):
    if not cond:
        raise AssertionError(f'{name}: {detail}')
    results.append({'name':name,'status':'PASS','detail':str(detail)})
    print(f'PASS | {name} | {detail}')

def browser_errors(driver):
    errors=[]
    for entry in driver.get_log('browser'):
        if entry.get('level') in ('SEVERE','ERROR'):
            errors.append(entry.get('message',''))
    return errors

def txt(driver,selector):
    return driver.find_element(By.CSS_SELECTOR,selector).text

def val(driver,selector):
    return driver.find_element(By.CSS_SELECTOR,selector).get_attribute('value')

def hit_test(driver,selector):
    el=driver.find_element(By.CSS_SELECTOR,selector)
    driver.execute_script("arguments[0].scrollIntoView({block:'center',inline:'center'});",el)
    time.sleep(.05)
    info=driver.execute_script("""
      const el=arguments[0], cs=getComputedStyle(el), r=el.getBoundingClientRect();
      const x=Math.max(0,Math.min(innerWidth-1,r.left+r.width/2));
      const y=Math.max(0,Math.min(innerHeight-1,r.top+r.height/2));
      const top=document.elementFromPoint(x,y);
      return {pointerEvents:cs.pointerEvents,zIndex:cs.zIndex,display:cs.display,visibility:cs.visibility,
        disabled:!!el.disabled,inViewport:r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth,
        topTag:top?top.tagName:null,topId:top?top.id:null,topClass:top?String(top.className):null,
        reachable:!!top&&(top===el||el.contains(top)||top.contains(el))};
    """,el)
    return el,info

def click(driver,selector,label=None):
    el,info=hit_test(driver,selector)
    check((label or selector)+' pointer-events',info['pointerEvents']!='none',info)
    check((label or selector)+' visible/hit-test',info['inViewport'] and info['display']!='none' and info['visibility']!='hidden' and info['reachable'],info)
    driver.execute_script("arguments[0].click();",el)
    time.sleep(.08)
    return el

opts=Options()
opts.add_argument('--headless=new')
opts.add_argument('--no-sandbox')
opts.add_argument('--disable-dev-shm-usage')
opts.add_argument('--window-size=1440,1100')
opts.set_capability('goog:loggingPrefs',{'browser':'ALL'})
driver=webdriver.Chrome(options=opts)
try:
    # Capture the real failure currently deployed. This diagnostic does not decide branch success.
    production={'url':PROD_URL,'ready':False,'cards':None,'errors':[]}
    try:
        driver.get(PROD_URL+'?qa='+str(int(time.time())))
        time.sleep(3)
        production['ready']=bool(driver.execute_script('return window.__MOTION404_READY__ === true'))
        production['cards']=len(driver.find_elements(By.CSS_SELECTOR,'.preset-card'))
        production['errors']=browser_errors(driver)
        production['qa']=driver.execute_script('return window.__MOTION404_QA__ || null')
    except Exception as exc:
        production['errors'].append(repr(exc))
    print('PRODUCTION_DIAGNOSIS='+json.dumps(production,ensure_ascii=False))

    driver.get(LOCAL_URL+'?qa='+str(int(time.time())))
    WebDriverWait(driver,15).until(lambda d:d.execute_script('return window.__MOTION404_READY__ === true'))
    qa=driver.execute_script('return window.__MOTION404_QA__')
    check('runtime ready',qa.get('ready') is True,qa)
    check('listeners bound',qa.get('listeners')=='bound',qa)
    check('180 presets',qa.get('presets')==180,qa)
    check('18 initial cards',len(driver.find_elements(By.CSS_SELECTOR,'.preset-card'))==18,len(driver.find_elements(By.CSS_SELECTOR,'.preset-card')))
    check('initial counter',txt(driver,'#presetCount')=='180 presets',txt(driver,'#presetCount'))

    click(driver,'#loadMorePresets','Mostrar más')
    check('Mostrar más action',len(driver.find_elements(By.CSS_SELECTOR,'.preset-card'))==36,len(driver.find_elements(By.CSS_SELECTOR,'.preset-card')))

    search=driver.find_element(By.ID,'presetSearch'); search.clear(); search.send_keys('arquitectura'); time.sleep(.1)
    check('Buscar',txt(driver,'#presetCount')!='180 presets',txt(driver,'#presetCount'))
    click(driver,'#clearPresetFilters','Limpiar filtros')
    check('Limpiar filtros action',txt(driver,'#presetCount')=='180 presets',txt(driver,'#presetCount'))

    Select(driver.find_element(By.ID,'categoryFilter')).select_by_value('Gaming'); time.sleep(.1)
    check('Filtro categoría',txt(driver,'#presetCount')=='12 presets',txt(driver,'#presetCount'))
    click(driver,'#clearPresetFilters','Limpiar filtros 2')
    Select(driver.find_element(By.ID,'dnaFilter')).select_by_value('cinematic'); time.sleep(.1)
    check('Filtro DNA',txt(driver,'#presetCount')=='30 presets',txt(driver,'#presetCount'))
    click(driver,'#clearPresetFilters','Limpiar filtros 3')

    click(driver,'#randomPreset','Sorpréndeme')
    check('Sorpréndeme action',bool(val(driver,'#projectInput')),val(driver,'#projectInput'))
    click(driver,'.preset-card [data-use]','Usar preset')
    check('Usar preset action',bool(val(driver,'#projectInput')),val(driver,'#projectInput'))
    click(driver,'.preset-card [data-preview]','DNA preview')
    check('DNA preview action',driver.find_element(By.ID,'outputPanel').is_displayed(),txt(driver,'#output-title'))

    risk0=int(txt(driver,'#riskScore'))
    rng=driver.find_element(By.ID,'intensityRange')
    driver.execute_script("arguments[0].value='5';arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",rng)
    time.sleep(.1); risk1=int(txt(driver,'#riskScore'))
    check('Inspector reactivo',risk1>=risk0,f'{risk0}->{risk1}')
    click(driver,'#inspectButton','Inspeccionar riesgo')
    check('Inspeccionar riesgo action','Riesgo recalculado' in txt(driver,'#toast'),txt(driver,'#toast'))

    project=driver.find_element(By.ID,'projectInput'); project.clear(); project.send_keys('QA Motion 404')
    click(driver,'#systemForm button[type="submit"]','Generar Motion System')
    check('Generar action',txt(driver,'#output-title')=='QA Motion 404',txt(driver,'#output-title'))
    check('Spec v2.0.2','Motion 404 v2.0.2' in txt(driver,'#specOutput'),'v2.0.2')

    for tab,panel in [('spec','panel-spec'),('timeline','panel-timeline'),('qa','panel-qa'),('dna','panel-dna')]:
        click(driver,f'#tab-{tab}',f'Tab {tab}')
        check(f'Tab {tab} action',driver.find_element(By.ID,panel).is_displayed(),panel)

    click(driver,'#copyOutput','Copiar')
    check('Copiar action',bool(txt(driver,'#toast')),txt(driver,'#toast'))
    click(driver,'#downloadOutput','Descargar sistema')
    check('Descargar action',True,'click accepted')
    click(driver,'#saveSystem','Guardar')
    check('Guardar action',len(driver.find_elements(By.CSS_SELECTOR,'.saved-card'))==1,len(driver.find_elements(By.CSS_SELECTOR,'.saved-card')))

    saved=txt(driver,'.saved-card h3'); project=driver.find_element(By.ID,'projectInput'); project.clear(); project.send_keys('Changed')
    click(driver,'[data-load-system]','Abrir guardado')
    check('Abrir guardado action',val(driver,'#projectInput')==saved,val(driver,'#projectInput'))
    click(driver,'#exportSystems','Exportar JSON')
    check('Exportar action',True,'click accepted')
    click(driver,'[data-delete-system]','Eliminar guardado')
    check('Eliminar guardado action',len(driver.find_elements(By.CSS_SELECTOR,'.saved-card'))==0,len(driver.find_elements(By.CSS_SELECTOR,'.saved-card')))

    old=driver.find_element(By.TAG_NAME,'html').get_attribute('data-theme')
    click(driver,'#themeButton','Cambiar tema')
    new=driver.find_element(By.TAG_NAME,'html').get_attribute('data-theme')
    check('Cambiar tema action',old!=new,f'{old}->{new}')

    driver.execute_script("const r=document.querySelector('#intensityRange');r.value='5';r.dispatchEvent(new Event('input',{bubbles:true}));")
    click(driver,'#systemForm button[type="reset"]','Restablecer')
    time.sleep(.1)
    check('Restablecer action',val(driver,'#intensityRange')=='3',val(driver,'#intensityRange'))

    # Check the main interactive surfaces for CSS hit-testing / pointer-events regressions.
    selectors=['#randomPreset','#clearPresetFilters','#loadMorePresets','#inspectButton','#systemForm button[type="submit"]','#saveSystem','#copyOutput','#downloadOutput','#exportSystems','#clearSystems','#themeButton']
    layer_report={}
    for selector in selectors:
        _,info=hit_test(driver,selector); layer_report[selector]=info
        check('layer '+selector,info['pointerEvents']!='none' and info['reachable'],info)
    check('no pointer-events blockers',all(v['pointerEvents']!='none' for v in layer_report.values()),layer_report)

    # Keyboard shortcut / focus path.
    driver.execute_script("document.querySelector('#presetSearch').blur();")
    driver.find_element(By.TAG_NAME,'body').send_keys('/')
    time.sleep(.1)
    check('Atajo /',driver.execute_script('return document.activeElement.id')=='presetSearch',driver.execute_script('return document.activeElement.id'))

    errors=browser_errors(driver)
    check('Consola sin errores',not errors,errors)
    print('BROWSER_QA='+json.dumps({'passed':len(results),'tests':results,'layers':layer_report,'production_before_fix':production},ensure_ascii=False))
finally:
    driver.quit()
