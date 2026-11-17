import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL(`../${f}`,import.meta.url),'utf8');
test('PRO: estilos y controlador se cargan después de los motores',()=>{
 const html=read('index.html');
 assert.ok(html.indexOf('src/ultimate.js')<html.indexOf('src/pro.js'));
 assert.ok(html.indexOf('src/ultimate.css')<html.indexOf('src/pro.css'));
 assert.ok(html.includes('pro-breadcrumb'));
});
test('PRO: navegación enlaza todos los laboratorios existentes',()=>{
 const pro=read('src/pro.js'),ultimate=read('src/ultimate.js');
 for(const id of ['catalog','motion','design','timeline','effects','game','resources','backups']){
  assert.ok(pro.includes(`data-pro-go="${id}"`) || pro.includes(`${id}:`),`Sin enlace ${id}`);
  if(id!=='catalog') assert.ok(ultimate.includes(`PANEL('${id}'`),`Sin panel ${id}`);
 }
 assert.ok(pro.includes('history.replaceState'));
 assert.ok(pro.includes('window.__MOTION404_PRO_READY__'));
});
test('PRO: rediseño no modifica almacenamiento de datos ni recursos existentes',()=>{
 const pro=read('src/pro.js');
 assert.ok(!/localStorage\s*\.|sessionStorage\s*\./.test(pro));
 assert.ok(!/fetch\s*\(/.test(pro));
 assert.ok(!/localStorage\s*\[|localStorage\s*\.|indexedDB\s*\./.test(pro));
});
test('PRO: caché PWA incluye recursos visuales nuevos',()=>{
 const sw=read('service-worker.js');
 assert.ok(sw.includes('src/pro.js')&&sw.includes('src/pro.css'));
 assert.ok(sw.includes('v5.5-rc1'));
});
test('PRO: CSS contiene estados responsive, teclado y movimiento reducido',()=>{
 const css=read('src/pro.css');
 for(const needle of ['max-width:780px','max-width:560px','prefers-reduced-motion','focus-visible','.pro-workspace-grid','.ultimate-nav'])assert.ok(css.includes(needle),needle)
});
