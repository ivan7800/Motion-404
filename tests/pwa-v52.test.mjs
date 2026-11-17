import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function setup({offline=false}={}){
 const events={},deleted=[],cacheName='motion-404-ultimate-v5.4-rc1';
 const cached={status:200,type:'basic',text:async()=>'<html>offline</html>'};
 const store=new Map([['http://test.local/app/index.html',cached]]);
 const cache={addAll:async()=>{},match:async key=>store.get(typeof key==='string'?(key.startsWith('./')?'http://test.local/app/'+key.slice(2):key):key.url),put:async(req,res)=>{store.set(req.url,res)}};
 const caches={open:async()=>cache,keys:async()=>['motion-404-ultimate-v5.0-beta1','motion-404-ultimate-v5.2-rc1','other-app-cache',cacheName],delete:async key=>{deleted.push(key);return true}};
 const self={location:{origin:'http://test.local'},addEventListener:(type,fn)=>events[type]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}};
 const Response={error:()=>({status:0,error:true})};
 const network=async req=>{if(offline)throw Error('offline');return{status:200,ok:true,clone(){return this}}};
 const context={self,caches,fetch:network,Response,URL,Promise};
 const source=readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');vm.runInNewContext(source,context);
 return{events,deleted,store,cacheName};
}
const trigger=(fn,request)=>{let p;fn({request,respondWith:v=>{p=v}});return p};
test('PWA deletes only its own older caches, not other sites',async()=>{const t=setup();let promise;t.events.activate({waitUntil:p=>{promise=p}});await promise;assert.deepEqual(t.deleted,['motion-404-ultimate-v5.0-beta1','motion-404-ultimate-v5.2-rc1'])});
test('PWA serves cached shell offline for navigation',async()=>{const t=setup({offline:true});const res=await trigger(t.events.fetch,{method:'GET',mode:'navigate',url:'http://test.local/app/new-route'});assert.equal(res.status,200);assert.equal(await res.text(),'<html>offline</html>')});
test('PWA never serves HTML in place of missing JavaScript modules offline',async()=>{const t=setup({offline:true});const res=await trigger(t.events.fetch,{method:'GET',mode:'cors',url:'http://test.local/app/src/missing.mjs'});assert.equal(res.status,0);assert.equal(res.error,true)});
