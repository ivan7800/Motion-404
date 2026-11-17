/* Motion-404 v2.0.2 => Ultimate Studio communication layer.
 * The historical runtime is NOT changed. Only sends structured, read-only exports
 * and handles explicit commands from same-origin parent. */
(()=>{'use strict';
 if(window.parent===window)return;
 const ORIGIN=location.origin;
 const send=(type,data={})=>{try{window.parent.postMessage({channel:'motion404-original-v2',type,data},ORIGIN)}catch{}};
 const query=()=>window.__MOTION404_QA__||{};
 const getSystems=()=>{try{
   const raw=localStorage.getItem('motion404-v2-state');const obj=JSON.parse(raw||'null');
   return Array.isArray(obj?.saved)?obj.saved.slice(0,50):[];
 }catch{return[]}};
 const validId=id=>typeof id==='string'&&/^m404-\d{3}$/.test(id);
 const report=()=>send('STATUS',{ready:window.__MOTION404_READY__===true,qa:query(),systems:getSystems()});
 window.addEventListener('message',event=>{
  if(event.source!==window.parent||event.origin!==ORIGIN)return;
  const msg=event.data;
  if(msg?.channel!=='motion404-ultimate-v5')return;
  if(msg.type==='GET_STATUS'){report();return;}
  if(msg.type==='USE_PRESET'&&validId(msg.id)){
   const btn=[...document.querySelectorAll('[data-use]')].find(x=>x.dataset.use===msg.id);
   if(btn){btn.click();send('PRESET_APPLIED',{id:msg.id})}
   return;
  }
  if(msg.type==='EXPORT_SYSTEMS')send('SYSTEMS',{systems:getSystems()});
 });
 document.addEventListener('click',event=>{
  const element=event.target.closest?.('[data-use],#saveSystem,#exportSystems');
  if(element)setTimeout(report,100);
 });
 const poll=setInterval(()=>{if(window.__MOTION404_READY__===true){clearInterval(poll);report()}},150);
 setTimeout(()=>{clearInterval(poll);report()},10000);
})();
