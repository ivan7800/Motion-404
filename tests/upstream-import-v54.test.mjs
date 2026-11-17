import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,copyFile,stat,rm} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const src=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function fixture(){
 const root=await mkdtemp(path.join(tmpdir(),'motion-original-import-test-'));
 const original=path.join(root,'upstream'),app=path.join(root,'studio');
 await mkdir(path.join(original,'assets/icons'),{recursive:true});await mkdir(path.join(original,'tests'),{recursive:true});await mkdir(path.join(app,'tools'),{recursive:true});
 for(const [file,contents] of Object.entries({
  'index.html':'<!doctype html><html><head><script src="motion-v2.0.2.js"></script></head><body><h1>Motion 404</h1></body></html>',
  'motion-v2.0.2.js':"'use strict';(() => {const VERSION='2.0.2',STORAGE_KEY = 'motion404-v2-state',presets=[],DNA_PROFILES={};const generateSystem=()=>({}),riskFrom=()=>({}),buildQa=()=>({}),recommendations=()=>[],buildTimeline=()=>[];window.__MOTION404_READY__=true;})();",
  'motion-v2.css':'body { color: red }','manifest.webmanifest':'{"name":"Motion 404"}',
  'sw.js':'self.addEventListener("install",()=>{})','assets/icons/icon-192.png':'TESTPNG', 'assets/universo-404.webp':'TESTWEBP', 'tests/browser_release_v202.py':'# synthetic test fixture'
 })){const p=path.join(original,file);await writeFile(p,contents)}
 await copyFile(path.join(src,'tools/import-original.mjs'),path.join(app,'tools/import-original.mjs'));
 await copyFile(path.join(src,'tools/ultimate-original-bridge.js'),path.join(app,'tools/ultimate-original-bridge.js'));
 return {root,original,app};
}
test('full runtime import is safe, reversible, and preserves upstream JS byte-for-byte',async()=>{
 const f=await fixture();try{
  const result=spawnSync(process.execPath,[path.join(f.app,'tools/import-original.mjs'),'--source',f.original],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  const dst=path.join(f.app,'original-runtime');
  assert.equal(await readFile(path.join(dst,'motion-v2.0.2.js'),'utf8'),await readFile(path.join(f.original,'motion-v2.0.2.js'),'utf8'));
  assert.match(await readFile(path.join(dst,'index.html'),'utf8'),/ultimate-bridge\.js/);
  assert.equal(await readFile(path.join(dst,'index.original.html'),'utf8'),await readFile(path.join(f.original,'index.html'),'utf8'));
  assert.match(await readFile(path.join(dst,'index.html'),'utf8'),/motion-v2\.0\.2\.integrated\.js/);
  const context={window:{}};vm.runInNewContext(await readFile(path.join(dst,'motion-v2.0.2.integrated.js'),'utf8'),context);
  assert.equal(context.window.M404_ORIGINAL_RUNTIME.version,'2.0.2');
  assert.equal(typeof context.window.M404_ORIGINAL_RUNTIME.generateSystem,'function');
  assert.match(await readFile(path.join(dst,'UPSTREAM-IMPORT.json'),'utf8'),/sha|version|files/);
  const second=spawnSync(process.execPath,[path.join(f.app,'tools/import-original.mjs'),'--source',f.original],{encoding:'utf8'});
  assert.equal(second.status,0,second.stderr);
  assert.ok((await stat(path.join(f.app,'original-runtime.previous','motion-v2.0.2.js'))).size>0);
 }finally{await rm(f.root,{recursive:true,force:true})}
});
test('invalid upstream source must not destroy existing imported runtime',async()=>{
 const f=await fixture();try{
  const importer=path.join(f.app,'tools/import-original.mjs');
  assert.equal(spawnSync(process.execPath,[importer,'--source',f.original],{encoding:'utf8'}).status,0);
  const pathOriginal=path.join(f.app,'original-runtime','motion-v2.0.2.js');
  const before=await readFile(pathOriginal,'utf8');
  await writeFile(path.join(f.original,'motion-v2.0.2.js'),'invalid code');
  const result=spawnSync(process.execPath,[importer,'--source',f.original],{encoding:'utf8'});
  assert.notEqual(result.status,0);
  assert.equal(await readFile(pathOriginal,'utf8'),before);
 }finally{await rm(f.root,{recursive:true,force:true})}
});
test('HTTP server explicitly permits only same-origin framing of the original DOM',async()=>{
 const source=await readFile(path.join(src,'server.mjs'),'utf8');
 assert.match(source,/legacyFrame\?/);
 assert.match(source,/frame-ancestors/);
});
test('bridge verifies parent origin and never writes historical localStorage key',async()=>{
 const bridge=await readFile(path.join(src,'tools/ultimate-original-bridge.js'),'utf8');
 assert.match(bridge,/event\.source!==window\.parent\|\|event\.origin!==ORIGIN/);
 assert.doesNotMatch(bridge,/localStorage\.setItem/);
 assert.match(bridge,/motion404-v2-state/);
});
