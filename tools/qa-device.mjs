/** Local server + offline-installation prerequisites smoke check.
 * This is not hardware validation and does not claim Service Worker installation.
 * Run after extracting the ZIP: npm run qa:device
 */
import {spawn} from 'node:child_process';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sw=await readFile(path.join(root,'service-worker.js'),'utf8');
const matched=sw.match(/const RESOURCES\s*=\s*(\[[\s\S]*?\]);/);
assert.ok(matched,'No se ha encontrado el inventario de precaché');
const files=vm.runInNewContext(matched[1]);
const resources=[...new Set([...files,'./server.mjs','./tools/launch.py'])];
let originalReady=false;
try{
 const source=await stat(path.join(root,'original-runtime','index.html'));
 if(source.isFile()){
   originalReady=true;
   // The historical DOM runs from its original runtime files. The bridge is
   // loaded by the host when available and is not a generated replacement.
   resources.push(...['./original-runtime/index.html','./original-runtime/motion-v2.0.2.js','./original-runtime/motion-v2.css','./original-runtime/ultimate-bridge.js','./original-runtime/sw.js']);
 }
}catch{}
let passed=0;
const ok=(condition,message)=>{assert.ok(condition,message);passed++;};

async function checkStatic(){
 const manifest=JSON.parse(await readFile(path.join(root,'manifest.webmanifest'),'utf8'));
 ok(manifest.display==='standalone','manifest display debe ser standalone');
 ok(manifest.start_url==='./'&&manifest.scope==='./','manifest URL/scope deben ser relativos a GitHub Pages');
 for(const item of manifest.icons){
  ok(/^\.\/assets\/icon[-a-z0-9]+\.png$/.test(item.src),'ruta de icono insegura');
  const b=await readFile(path.join(root,item.src));
  ok(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'icono no es PNG');
  const [w,h]=[b.readUInt32BE(16),b.readUInt32BE(20)];
  const [expected]=item.sizes.split('x').map(Number);
  ok(w===expected&&h===expected,`dimensiones PNG incorrectas: ${item.src}`);
 }
 for(const item of files){const p=path.resolve(root,item.replace(/^\.\//,''));ok(p===root||p.startsWith(root+path.sep),'precaché fuera de raíz');ok((await stat(p)).isFile()||p===root,'recurso precaché no existe: '+item)}
 console.log(`✓ Manifest, tamaños PNG, scope y ${files.length} recursos precaché presentes`);
}

async function start(runtime,command,args){
 return new Promise((resolve,reject)=>{
  let output='';const child=spawn(command,args,{cwd:root,env:{...process.env,PORT:'0',MOTION_OPEN_BROWSER:'0'},stdio:['ignore','pipe','pipe']});
  let settled=false;
  const fail=(e)=>{if(settled)return;settled=true;child.kill();reject(e)};
  const timer=setTimeout(()=>fail(new Error(`${runtime}: no ha arrancado: ${output}`)),10000);
  const watch=data=>{output+=data.toString();const match=output.match(/http:\/\/127\.0\.0\.1:(\d+)\//);if(match&&!settled){settled=true;clearTimeout(timer);resolve({child,url:match[0]})}};
  child.stdout.on('data',watch);child.stderr.on('data',watch);
  child.once('error',e=>{clearTimeout(timer);fail(e)});
  child.once('exit',code=>{if(!settled){clearTimeout(timer);fail(new Error(`${runtime} finalizó con código ${code}: ${output}`))}});
 });
}

async function checkRuntime(label,cmd,args){
 const {child,url}=await start(label,cmd,args);
 try{
  for(const resource of resources){
   const r=await fetch(new URL(resource,url),{signal:AbortSignal.timeout(8000)});
   ok(r.status===200,`${label}: HTTP ${r.status} en ${resource}`);
   const mime=r.headers.get('content-type')||'';
   if(resource==='./' || resource==='./original-runtime/index.html'){const csp=r.headers.get('content-security-policy')||'';const expected=resource==='./'?"frame-ancestors 'none'":"frame-ancestors 'self'";ok(csp.includes(expected),`${label}: CSP incorrecta en ${resource}: ${csp}`);}
   if(/\.(mjs|js)$/.test(resource))ok(/javascript/.test(mime),`${label}: MIME incorrecto en ${resource}: ${mime}`);
   if(/\.webmanifest$/.test(resource))ok(/manifest|json/.test(mime),`${label}: MIME manifest incorrecto: ${mime}`);
   if(/\.png$/.test(resource))ok(/image\/png/.test(mime),`${label}: MIME icono incorrecto: ${mime}`);
   await r.arrayBuffer();
  }
  const missing=await fetch(new URL('/not-a-real-module.mjs',url));
  ok(missing.status===404,`${label}: recurso inexistente debe devolver 404`);
  console.log(`✓ ${label}: ${resources.length} rutas con HTTP 200, MIME y 404 correctos`);
 }finally{child.kill();}
}

await checkStatic();
await checkRuntime('Node.js','node',['server.mjs']);
const python=process.platform==='win32'?'py':'python3';
const pyargs=process.platform==='win32'?['-3','tools/launch.py']:['tools/launch.py'];
try{await checkRuntime('Python 3',python,pyargs)}catch(err){if(err.code==='ENOENT')console.warn('Python 3 no disponible: smoke Python omitido');else throw err}
console.log(`\nPASS ${passed} comprobaciones locales. Plataforma: ${process.platform} / ${process.arch}.`);
console.log('RUNTIME HISTÓRICO:',originalReady?'PRESENTE — archivos críticos servidos por HTTP':'NO IMPORTADO — pruebas históricas bloqueadas');
console.log('NO CERTIFICA: doble clic del BAT, Safari/iPhone, PWA instalada, SW offline ni navegación Chromium HTTP.');
console.log('Para terminar QA real, completa los pasos de docs/QA-DISPOSITIVOS-v5.5.md en cada dispositivo.');
