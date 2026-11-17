/** Imports the full original Motion-404 checkout in a contained, reversible way.
 * Usage: npm run import:original -- --source /path/to/Motion-404
 *        npm run import:original        (Git clone on an internet-enabled device)
 * Never mutates GitHub or writes the legacy storage key. */
import {spawnSync} from 'node:child_process';
import {mkdtemp,cp,rm,readFile,writeFile,rename,stat,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dest=path.join(root,'original-runtime');
const tmp=await mkdtemp(path.join(tmpdir(),'motion-original-'));
const required=['index.html','motion-v2.0.2.js','motion-v2.css','manifest.webmanifest','sw.js','assets/icons/icon-192.png','assets/universo-404.webp','tests/browser_release_v202.py'];
const sourceArg=process.argv.indexOf('--source');
const source=sourceArg>=0?path.resolve(process.argv[sourceArg+1]||''):path.join(tmp,'source');
const sha256=s=>crypto.createHash('sha256').update(s).digest('hex');
try{
 if(sourceArg<0){
  const result=spawnSync('git',['clone','--depth','1','--branch','main','https://github.com/ivan7800/Motion-404.git',source],{stdio:'inherit',timeout:120000});
  if(result.status!==0)throw Error('No se pudo descargar Motion-404. En un PC con Internet, clona el repositorio y ejecuta npm run import:original -- --source RUTA');
 }
 const manifest={repo:'https://github.com/ivan7800/Motion-404',version:'2.0.2',createdAt:new Date().toISOString(),files:{}};
 for(const file of required){const content=await readFile(path.join(source,file));if(!content.length)throw Error(`Falta o está vacío el archivo original: ${file}`);manifest.files[file]=sha256(content)}
 const html=(await readFile(path.join(source,'index.html'),'utf8'));
 const runtime=(await readFile(path.join(source,'motion-v2.0.2.js'),'utf8'));
 if(!html.includes('motion-v2.0.2.js')||!runtime.includes("STORAGE_KEY = 'motion404-v2-state'"))throw Error('El código obtenido no corresponde al runtime v2.0.2 esperado. No se reemplaza la copia anterior.');
 const staged=path.join(tmp,'staged');
 await cp(source,staged,{recursive:true,filter:p=>!p.split(path.sep).some(n=>n==='.git'||n==='.github'||n==='node_modules')});
 // Bridge added as a separate script: original JavaScript and CSS remain byte-for-byte intact.
 const bridgeTag='  <script defer src="./ultimate-bridge.js"></script>';
 const stagedHtml=path.join(staged,'index.html');
 await writeFile(path.join(staged,'index.original.html'),html);
 // Adapted runtime retains its original implementation. The untouched source is kept alongside it.
 // Expose the same original generator to Ultimate so both workspaces use ONE Motion DNA implementation.
 const integrated='motion-v2.0.2.integrated.js';
 const footer=`
  window.M404_ORIGINAL_RUNTIME=Object.freeze({version:VERSION,presets,DNA_PROFILES,generateSystem,riskFrom,buildQa,recommendations,buildTimeline});
})();`;
 const pos=runtime.lastIndexOf('})();');
 if(pos<0||pos<runtime.length-20)throw Error('El runtime original cambió: no se ha podido exponer la API sin revisión.');
 await writeFile(path.join(staged,integrated),runtime.slice(0,pos)+footer+runtime.slice(pos+5));
 await writeFile(stagedHtml,html.replace('motion-v2.0.2.js',integrated).replace('</body>',bridgeTag+'\n</body>'));
 await cp(path.join(root,'tools','ultimate-original-bridge.js'),path.join(staged,'ultimate-bridge.js'));
 await writeFile(path.join(staged,'UPSTREAM-IMPORT.json'),JSON.stringify(manifest,null,2));
 const backup=path.join(root,'original-runtime.previous');
 await rm(backup,{force:true,recursive:true});
 let old=false;
 try{await rename(dest,backup);old=true}catch(err){if(err.code!=='ENOENT')throw err}
 try{await rename(staged,dest)}catch(err){if(old)await rename(backup,dest);throw err}
 console.log(`Motion-404 original v2.0.2 importado (${Object.keys(manifest.files).length} archivos críticos verificados).`);
 console.log('Abre Ultimate → Motion-404 original. Conexión y guardados compartidos en el mismo origen, sin modificar main.');
}catch(err){console.error('Importación fallida:',err.message);process.exitCode=1}finally{await rm(tmp,{force:true,recursive:true})}
