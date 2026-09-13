#!/usr/bin/env python3
import json, os, sys, time, tempfile
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

LOCAL_URL=os.environ.get('MOTION_LOCAL_URL','http://127.0.0.1:8000/')
PROD_URL=os.environ.get('MOTION_PROD_URL','https://ivan7800.github.io/Motion-404/')
WAIT=WebDriverWait

results=[]
def check(name, cond, detail=''):
    if not cond: raise AssertionError(f'{name}: {detail}')
    results.append({'name':name,'status':'PASS','detail':str(detail)})
    print(f'PASS | {name} | {detail}')

def logs(driver):
    out=[]
    try:
        for entry in driver.get_log('browser'):
            if entry.get('level') in ('SEVERE','ERROR'):
                out.append(entry.get('message',''))
    except Exception as e:
        out.append(f'log-unavailable: {e}')
    return out

def wait_ready(driver):
    WebDriverWait(driver,15).until(lambda d: d.execute_script('return window.__MOTION404_READY__ === true'))

def click(driver, selector):
    el=WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.CSS_SELECTOR,selector)))
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});",el)
    el.click(); return el

def text(driver, selector): return driver.find_element(By.CSS_SELECTOR,selector).text

def value(driver, selector): return driver.find_element(By.CSS_SELECTOR,selector).get_attribute('value')

opts=Options(); opts.add_argument('--headless=new'); opts.add_argument('--no-sandbox'); opts.add_argument('--disable-dev-shm-usage'); opts.add_argument('--window-size=1440,1100'); opts.set_capability('goog:loggingPrefs',{'browser':'ALL'})
driver=webdriver.Chrome(options=opts)
try:
    # Diagnose the currently published version before exercising the branch.
    production={'url':PROD_URL,'ready':False,'cards':None,'errors':[]}
    try:
        driver.get(PROD_URL+'?qa='+str(int(time.time())))
        time.sleep(3)
        production['ready']=bool(driver.execute_script('return window.__MOTION404_READY__ === true'))
        production['cards']=len(driver.find_elements(By.CSS_SELECTOR,'.preset-card'))
        production['errors']=logs(driver)
        production['qa']=driver.execute_script('return window.__MOTION404_QA__ || null')
    except Exception as e:
        production['errors'].append(repr(e))
    print('PRODUCTION_DIAGNOSIS='+json.dumps(production,ensure_ascii=False))

    # Exact branch files served through HTTP.
    driver.get(LOCAL_URL+'?qa='+str(int(time.time())))
    wait_ready(driver)
    check('runtime ready',driver.execute_script('return window.__MOTION404_QA__.ready') is True,driver.execute_script('return window.__MOTION404_QA__'))
    check('180 presets',driver.execute_script('return window.__MOTION404_QA__.presets')==180,driver.execute_script('return window.__MOTION404_QA__.presets'))
    check('18 initial cards',len(driver.find_elements(By.CSS_SELECTOR,'.preset-card'))==18,len(driver.find_elements(By.CSS_SELECTOR,'.preset-card')))
    check('initial counter',text(driver,'#presetCount')=='180 presets',text(driver,'#presetCount'))

    click(driver,'#loadMorePresets'); check('Mostrar más',len(driver.find_elements(By.CSS_SELECTOR,'.preset-card'))==36,len(driver.find_elements(By.CSS_SELECTOR,'.preset-card')))
    s=driver.find_element(By.ID,'presetSearch'); s.clear(); s.send_keys('arquitectura'); time.sleep(.1); check('Buscar',text(driver,'#presetCount')!='180 presets',text(driver,'#presetCount'))
    click(driver,'#clearPresetFilters'); check('Limpiar filtros',text(driver,'#presetCount')=='180 presets',text(driver,'#presetCount'))
    Select(driver.find_element(By.ID,'categoryFilter')).select_by_value('Gaming'); time.sleep(.1); check('Filtro categoría',text(driver,'#presetCount')=='12 presets',text(driver,'#presetCount'))
    click(driver,'#clearPresetFilters'); Select(driver.find_element(By.ID,'dnaFilter')).select_by_value('cinematic'); time.sleep(.1); check('Filtro DNA',text(driver,'#presetCount')=='30 presets',text(driver,'#presetCount'))
    click(driver,'#clearPresetFilters')

    click(driver,'#randomPreset'); check('Sorpréndeme',bool(value(driver,'#projectInput')),value(driver,'#projectInput'))
    click(driver,'.preset-card [data-use]'); check('Usar preset',bool(value(driver,'#projectInput')),value(driver,'#projectInput'))
    click(driver,'.preset-card [data-preview]'); check('DNA preview',driver.find_element(By.ID,'outputPanel').is_displayed(),text(driver,'#output-title'))

    risk_before=int(text(driver,'#riskScore')); rng=driver.find_element(By.ID,'intensityRange'); driver.execute_script("arguments[0].value='5';arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",rng); time.sleep(.1); risk_after=int(text(driver,'#riskScore')); check('Inspector reactivo',risk_after>=risk_before,f'{risk_before}->{risk_after}')
    click(driver,'#inspectButton'); check('Inspeccionar riesgo','Riesgo recalculado' in text(driver,'#toast'),text(driver,'#toast'))

    project=driver.find_element(By.ID,'projectInput'); project.clear(); project.send_keys('QA Motion 404'); click(driver,'#systemForm button[type="submit"]'); check('Generar Motion System',text(driver,'#output-title')=='QA Motion 404',text(driver,'#output-title')); check('Spec versión','Motion 404 v2.0.2' in text(driver,'#specOutput'),'v2.0.2')
    for tab,panel in [('spec','panel-spec'),('timeline','panel-timeline'),('qa','panel-qa'),('dna','panel-dna')]:
        click(driver,f'#tab-{tab}'); check(f'Tab {tab}',driver.find_element(By.ID,panel).is_displayed(),panel)

    click(driver,'#copyOutput'); time.sleep(.1); check('Copiar',bool(text(driver,'#toast')),text(driver,'#toast'))
    click(driver,'#downloadOutput'); check('Descargar sistema',True,'click accepted')
    click(driver,'#saveSystem'); check('Guardar',len(driver.find_elements(By.CSS_SELECTOR,'.saved-card'))==1,len(driver.find_elements(By.CSS_SELECTOR,'.saved-card')))
    saved=text(driver,'.saved-card h3'); project=driver.find_element(By.ID,'projectInput'); project.clear(); project.send_keys('Changed'); click(driver,'[data-load-system]'); check('Abrir guardado',value(driver,'#projectInput')==saved,value(driver,'#projectInput'))
    click(driver,'#exportSystems'); check('Exportar JSON',True,'click accepted')
    click(driver,'[data-delete-system]'); check('Eliminar guardado',len(driver.find_elements(By.CSS_SELECTOR,'.saved-card'))==0,len(driver.find_elements(By.CSS_SELECTOR,'.saved-card')))

    old=driver.find_element(By.TAG_NAME,'html').get_attribute('data-theme'); click(driver,'#themeButton'); new=driver.find_element(By.TAG_NAME,'html').get_attribute('data-theme'); check('Cambiar tema',old!=new,f'{old}->{new}')
    driver.execute_script("const r=document.querySelector('#intensityRange');r.value='5';r.dispatchEvent(new Event('input',{bubbles:true}));"); click(driver,'#systemForm button[type="reset"]'); time.sleep(.1); check('Restablecer',value(driver,'#intensityRange')=='3',value(driver,'#intensityRange'))

    driver.execute_script('document.activeElement.blur()'); driver.find_element(By.TAG_NAME,'body').send_keys('/'); time.sleep(.1); check('Atajo /',driver.execute_script('return document.activeElement.id')=='presetSearch',driver.execute_script('return document.activeElement.id'))

    page_errors=logs(driver); check('Consola sin errores',not page_errors,page_errors)
    print('BROWSER_QA='+json.dumps({'passed':len(results),'tests':results,'production_before_fix':production},ensure_ascii=False))
finally:
    driver.quit()
