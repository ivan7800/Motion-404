import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import net from 'node:net';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function runServer(port){
 const child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:String(port),MOTION_OPEN_BROWSER:'0'},stdio:['ignore','pipe','pipe']});
 let out='';let errors='';child.stdout.on('data',b=>out+=b);child.stderr.on('data',b=>errors+=b);
 for(let i=0;i<80;i++){
  const match=out.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
  if(match)return{child,port:Number(match[1]),out,errors};
  if(child.exitCode!==null)throw new Error('Servidor fallo: '+errors);
  await delay(50);
 }
 child.kill();throw new Error('Timeout de arranque: '+out+' '+errors);
}
async function stop(child){child.kill();await Promise.race([once(child,'exit'),delay(1000)]);}
test('lanzador Node arranca HTTP real y sirve shell y scripts',async()=>{
 const s=await runServer(0);
 try{
  for(const file of ['/','/index.html','/src/pro.js','/src/ultimate.js','/manifest.webmanifest','/src/editor-core.mjs','/src/bridges.mjs']){
   const r=await fetch(`http://127.0.0.1:${s.port}${file}`);
   assert.equal(r.status,200,file);if(file.endsWith('.mjs'))assert.match(r.headers.get('content-type'),/text\/javascript/);assert.ok((await r.text()).length>20,file);
  }
 }finally{await stop(s.child);}
});
test('lanzador Node usa puerto alternativo cuando el preferido esta ocupado',async()=>{
 const blocker=net.createServer();await new Promise(resolve=>blocker.listen(0,'127.0.0.1',resolve));
 const busy=blocker.address().port;
 try{
  const s=await runServer(busy);
  try{assert.notEqual(s.port,busy);assert.equal((await fetch(`http://127.0.0.1:${s.port}/`)).status,200);}
  finally{await stop(s.child);}
 }finally{await new Promise(resolve=>blocker.close(resolve));}
});
