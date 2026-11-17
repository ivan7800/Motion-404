/** Historical full-runtime browser QA; requires a real source checkout imported first.
 * Prerequisites: npm run import:original; python3 -m pip install selenium; Chromium/Chrome and chromedriver. */
import {readFile,stat,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {spawn,spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=path.join(root,'original-runtime');
const required=['index.html','motion-v2.0.2.js','motion-v2.css','sw.js','assets/icons/icon-192.png','tests/browser_release_v202.py','UPSTREAM-IMPORT.json'];
let manifest;
try{
 for(const file of required){const st=await stat(path.join(src,file));if(!st.isFile()||st.size===0)throw Error(file+' vacío');}
 manifest=JSON.parse(await readFile(path.join(src,'UPSTREAM-IMPORT.json'),'utf8'));
 for(const [file,expected] of Object.entries(manifest.files)){
  const filePath=file==='index.html'?'index.original.html':file;
  const actual=crypto.createHash('sha256').update(await readFile(path.join(src,filePath))).digest('hex');
  if(expected!==actual)throw Error(`${file}: checksum no coincide con la fuente`);
 }
 console.log('PASS: árbol original presente y SHA-256 de los archivos importados verificados');
}catch(error){console.error('BLOCKED: runtime original NO incorporado o incompleto:',error.message);console.error('Ejecuta npm run import:original (con Internet) o npm run import:original -- --source /ruta/repo');process.exit(2);}
const py=process.platform==='win32'?'py':'python3';
const pyBase=process.platform==='win32'?['-3']:[];
const pre=spawnSync(py,[...pyBase,'-c','import selenium'],{stdio:'ignore'});
if(pre.status!==0){console.error('BLOCKED: falta Selenium. Instala python -m pip install selenium y Chrome/Chromium + chromedriver compatibles.');process.exit(2)}
const tmp=await mkdtemp(path.join(tmpdir(),'motion-legacy-qa-'));
const runner=path.join(tmp,'browser_release_v202.py');
let child;
try{
 // Change only the production-baseline diagnostic URL (not assertions or original source);
 // otherwise the historical test cannot run offline even against local source.
 let test=await readFile(path.join(src,'tests/browser_release_v202.py'),'utf8');
 test=test.replace(/^PROD='https:\/\/ivan7800\.github\.io\/Motion-404\/'/m,"PROD=URL");
 await writeFile(runner,test);
 child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:'0',MOTION_OPEN_BROWSER:'0'},stdio:['ignore','pipe','pipe']});
 const url=await new Promise((resolve,reject)=>{
  let output='';const timer=setTimeout(()=>reject(Error('HTTP server no arrancó')),12000);
  child.stdout.on('data',x=>{output+=x;const m=output.match(/http:\/\/127\.0\.0\.1:(\d+)\//);if(m){clearTimeout(timer);resolve(m[0])}});
  child.on('exit',code=>{clearTimeout(timer);reject(Error('Servidor terminó con '+code+' '+output))});
 });
 console.log('Ejecutando Selenium en: '+url+'original-runtime/');
 const result=spawnSync(py,[...pyBase,runner],{cwd:root,stdio:'inherit',env:{...process.env,MOTION_LOCAL_URL:url+'original-runtime/'},timeout:180000});
 if(result.status!==0)throw Error(`Prueba histórica no superada (código ${result.status}; error ${result.error?.message||'-'})`);
 console.log('PASS: regresión histórica del runtime original superada.');
}catch(error){console.error('FAIL:',error.message);process.exitCode=1}finally{child?.kill();await rm(tmp,{recursive:true,force:true})}
