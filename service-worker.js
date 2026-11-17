/* MOTION-404 v5.5 — own-cache cleanup, offline shell, never turn failed JS into HTML. */
const PREFIX='motion-404-ultimate-';
const CACHE=PREFIX+'v5.5-rc1';
const RESOURCES=['./','./index.html','./manifest.webmanifest','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-192.png','./assets/icon-maskable-512.png','./assets/apple-touch-icon.png','./src/style.css','./src/catalog.js','./src/components.js','./src/engine.js','./src/export-payload.js','./src/app.js','./src/library-model.js','./src/library.css','./src/ultimate-data.js','./src/motion-v2-core.js','./src/ultimate.js','./src/ultimate.css','./src/pro.css','./src/pro.js','./src/editor.js','./src/editor.css','./src/editor-core.mjs','./src/group-layout.mjs','./src/timeline-pro.mjs','./src/keyframes.mjs','./src/zip-utils.mjs','./src/legacy-migration.mjs','./src/bridges.mjs'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(RESOURCES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 const navigation=request.mode==='navigate';
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(navigation){try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response}catch{return (await cache.match(request))||(await cache.match('./index.html'))||Response.error()}}
  const cached=await cache.match(request);
  if(cached)return cached;
  try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response}catch{return Response.error()}
 })());
});
