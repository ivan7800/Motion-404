/* Motion404 • original dependency-free demo engine • 2026 */
(function(global){
'use strict';
const states=new WeakMap();
const defaults=()=>({on:false,done:false,open:false,step:0,tab:0,range:35,number:2,text:'',items:[],tags:['motion','404'],checks:[false,true,false,false],rating:0,cart:0,loading:false});
const state=root=>{if(!states.has(root))states.set(root,defaults());return states.get(root)};
const opts=root=>({accent:root.dataset.accent||'#a78bfa',speed:Number(root.dataset.speed||1),text:root.dataset.text??'El umbral permanece abierto.'});
function reduced(root){return root.dataset.reduced==='true'||!!root.closest('.reduce-motion')||global.matchMedia?.('(prefers-reduced-motion: reduce)').matches}
function paint(root){if(!root)return;const id=Number(root.dataset.demoId),fn=global.M404_DEMOS?.[id];if(!fn)throw Error('Patrón no implementado: '+id);root.style.setProperty('--accent',opts(root).accent);root.style.setProperty('--speed',opts(root).speed);const body=root.querySelector('.demo-stage');if(body){
 const active=root.getRootNode().activeElement, controls=[...body.querySelectorAll('button,input,select,textarea,summary,a[href]')], focusIndex=controls.indexOf(active);
 body.innerHTML=fn(state(root),opts(root));
 for(const animation of root.getAnimations?.({subtree:true})||[])animation.playbackRate=opts(root).speed;
 if(focusIndex>=0)body.querySelectorAll('button,input,select,textarea,summary,a[href]')[focusIndex]?.focus({preventScroll:true});
 }}
function mount(el,id,options={}){
 const numericId=Number(id);if(!global.M404_DEMOS?.[numericId])throw Error('ID no soportado '+id);
 const safe=global.M404_H.esc;el.innerHTML=`<div class="demo-root" data-demo-id="${numericId}" data-accent="${safe(options.accent||'#a78bfa')}" data-speed="${Math.max(.5,Math.min(2,Number(options.speed)||1))}" data-reduced="${options.reduced===true}" data-text="${safe(options.text??'El umbral permanece abierto.')}"><div class="demo-stage"></div></div>`;
 const root=el.firstElementChild;paint(root);return root;
}
function update(root,settings={}){if(!root)return;for(const key of ['accent','speed','text','reduced'])if(settings[key]!==undefined)root.dataset[key]=settings[key];paint(root)}
const toast=(msg)=>{if(typeof global.Motion404?.onToast==='function')global.Motion404.onToast(msg)};
async function copy(text){try{await navigator.clipboard.writeText(text);return true}catch{const el=document.createElement('textarea');el.value=text;el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();let result=false;try{result=document.execCommand('copy')}catch{}el.remove();return result}}
let ac=null,osc=null,gain=null;
function playTone(on){try{if(!on){if(gain&&ac)gain.gain.setTargetAtTime(0,ac.currentTime,.05);if(osc){const old=osc;setTimeout(()=>{try{old.stop()}catch{}},300);osc=null}return}const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ac=ac||new C();void ac.resume();osc=ac.createOscillator();gain=ac.createGain();osc.type='sine';osc.frequency.value=110;gain.gain.value=.00001;osc.connect(gain).connect(ac.destination);osc.start();gain.gain.setTargetAtTime(.028,ac.currentTime,.15)}catch(err){console.warn('Audio no disponible',err)}}
function action(root,act,value){const s=state(root);let render=true;
 switch(act){
 case 'toggle':s.on=!s.on;break;
 case 'menu':s.open=!s.open;break;
 case 'tab':s.tab=Number(value)||0;if(Number(root.dataset.demoId)===11)s.open=false;break;
 case 'choose':s.tab=Number(value)||0;s.open=false;break;
 case 'next':s.step++;break;
 case 'prev':s.step=Math.max(0,s.step-1);break;
 case 'step':s.step=(s.step+1)%4;break;
 case 'setstep':s.step=Number(value)||0;break;
 case 'done':s.done=true;break;
 case 'reset':s.step=0;s.done=false;break;
 case 'rate':s.rating=Number(value)||0;break;
 case 'increment':s.number=Math.min(99,s.number+1);break;
 case 'decrement':s.number=Math.max(0,s.number-1);break;
 case 'cart':s.cart++;break;
 case 'tag':{const el=root.querySelector('[data-field="tag"]');const v=el?.value.trim().slice(0,36);if(v&&!s.tags.includes(v)&&s.tags.length<15)s.tags.push(v);else {toast('Introduce una etiqueta válida');render=false}break;}
 case 'del-tag':s.tags.splice(Number(value),1);break;
 case 'invite':{const e=root.querySelector('[data-field="email"]');if(e&&e.checkValidity()&&e.value.trim()){s.items.push(e.value.trim().slice(0,70));toast('Invitación preparada: no se ha enviado nada')}else {toast('Escribe un email válido');render=false}break;}
 case 'refresh':s.step++;s.loading=true;setTimeout(()=>{s.loading=false;if(root.isConnected)paint(root)},650);break;
 case 'success':if(s.loading){render=false;break};s.loading=true;s.done=false;setTimeout(()=>{s.loading=false;s.done=true;if(root.isConnected)paint(root)},950);break;
 case 'copy-demo':copy(opts(root).text).then(ok=>toast(ok?'Texto copiado':'Copia no disponible'));s.done=true;break;
 case 'stream':{
  if(s.loading){render=false;break};s.text='';s.loading=true;
  let i=0;const message='Este es un ejemplo de streaming local. No se ha conectado a una inteligencia artificial ni a un servidor.';
  const timer=setInterval(()=>{if(!root.isConnected){clearInterval(timer);return};s.text=message.slice(0,++i);const el=root.querySelector('.stream-box');if(el)el.textContent=s.text+(i<message.length?'▌':'');if(i>=message.length){clearInterval(timer);s.loading=false;paint(root)}},28);break;
 }
 case 'scramble':{
  const el=root.querySelector('.scramble-text');const message=opts(root).text;if(!el)break;
  if(reduced(root)){el.textContent=message;render=false;break}const chars='░▒▓⟡·◉#?';let i=0;
  const timer=setInterval(()=>{if(!root.isConnected){clearInterval(timer);return};el.textContent=[...message].map((c,k)=>k<=i/2?c:chars[Math.random()*chars.length|0]).join('');i++;if(i>=message.length*2+2){clearInterval(timer);el.textContent=message}},38);
  render=false;break;
 }
 case 'copy-command-text':
  copy(opts(root).text).then(ok=>{root.querySelector('.local-commands output').textContent=ok?'Texto copiado':'Copia no disponible'});
  render=false;break;
 case 'command-motion':
  root.dataset.reduced=String(root.dataset.reduced!=='true');
  root.querySelector('.local-commands output').textContent=root.dataset.reduced==='true'?'Movimiento reducido':'Movimiento normal';
  render=false;break;
 case 'palette':global.Motion404?.openPalette?.();render=false;break;
 case 'allow':s.message='Permiso simulado concedido';break;
 case 'deny':s.message='Permiso simulado denegado';break;
 case 'feedback':s.done=true;s.open=false;break;
 case 'clear-sign':{const canvas=root.querySelector('canvas');canvas?.getContext('2d')?.clearRect(0,0,canvas.width,canvas.height);render=false;break;}
 case 'music':s.on=!s.on;playTone(s.on);break;
 default:render=false;
 }
 if(render)paint(root);
}
function startHold(root,hold){const s=state(root);if(s.holding||s.done)return;s.holding=true;hold.classList.add('holding');hold.style.setProperty('--hold','100%');s.timer=setTimeout(()=>{if(s.holding&&root.isConnected&&!document.hidden){s.done=true;s.holding=false;paint(root);toast('Acción confirmada en la demostración')}},1200)}
const boundTargets=new WeakSet();
function bind(target=document){if(boundTargets.has(target))return;boundTargets.add(target);if(target===document)global.__M404_BOUND=true;
 target.addEventListener('click',e=>{const node=e.target.closest?.('[data-act]');if(!node)return;const root=node.closest('.demo-root');if(!root)return;e.preventDefault();action(root,node.dataset.act,node.dataset.val)});
 target.addEventListener('input',e=>{const node=e.target,root=node.closest?.('.demo-root');if(!root)return;const s=state(root),f=node.dataset.field;
  if(f==='range'||f==='slide'){s.range=Number(node.value);const bar=root.querySelector('.d-meter i');if(bar)bar.style.width=s.range+'%';const label=root.querySelector('.d-pill');if(label&&[12,51].includes(Number(root.dataset.demoId)))label.textContent=s.range+'%';if(f==='slide'&&s.range>=95){s.done=true;paint(root)}}
  if(f==='reveal'){s.range=Number(node.value);root.querySelector('.split-reveal')?.style.setProperty('--reveal',s.range+'%');root.querySelector('output').textContent=s.range+'%'}
  if(f==='text'||f==='suggestion')s.text=node.value;
  if(f==='password'){s.text=node.value;s.score=Math.min(4,(s.text.length>=6?1:0)+(s.text.length>=10?1:0)+(/[A-Z]/.test(s.text)&&/[a-z]/.test(s.text)?1:0)+(/[0-9]/.test(s.text)&&/[^\w]/.test(s.text)?1:0));root.querySelectorAll('.strength-bars i').forEach((v,i)=>v.classList.toggle('lit',s.score>i));const p=root.querySelector('.d-pill');if(p)p.textContent=['Sin evaluar','Débil','Aceptable','Buena','Fuerte'][s.score]}
  if(f==='card'){s.text=node.value.replace(/\D/g,'').slice(0,4);const v=root.querySelector('.fake-payment strong');if(v)v.textContent='•••• •••• •••• '+s.text.padStart(4,'0')}
  if(f==='file'){s.file=node.files?.[0]?.name.slice(0,72)||'';paint(root)}
  if(node.hasAttribute('data-otp')){const index=Number(node.dataset.otp),digits=[...root.querySelectorAll('[data-otp]')];node.value=node.value.replace(/\D/g,'').slice(-1);if(node.value&&index<digits.length-1)digits[index+1].focus();s.text=digits.map(el=>el.value).join('');const p=root.querySelector('.d-pill');if(p)p.textContent=s.text.length===6?'Código completo':'Introduce seis cifras'}
  const counter=root.querySelector('.d-counter');if(f==='text'&&counter)counter.textContent=s.text.length+' / 80';
 });
 target.addEventListener('change',e=>{const node=e.target,root=node.closest?.('.demo-root');if(!root)return;const s=state(root);if(node.hasAttribute('data-check')){s.checks[Number(node.dataset.check)]=node.checked;paint(root)}if(node.dataset.field==='range'){paint(root)}});
 target.addEventListener('keydown',e=>{const node=e.target,root=node.closest?.('.demo-root');if(!root)return;const s=state(root);
  if((e.key===' '||e.key==='Enter')&&node.matches('[data-hold]')){e.preventDefault();if(!e.repeat)startHold(root,node)}
  if(e.key==='Enter'&&node.dataset.field==='tag'){e.preventDefault();action(root,'tag')}
  if(e.key==='ArrowRight'&&node.dataset.field==='suggestion'&&node.selectionStart===node.value.length&&node.value.trim()&&!node.value.endsWith(' en el abismo')){e.preventDefault();s.text=node.value+' en el abismo';node.value=s.text}
  if(e.key==='Backspace'&&node.hasAttribute('data-otp')&&!node.value){const i=Number(node.dataset.otp);if(i>0)root.querySelector(`[data-otp="${i-1}"]`)?.focus()}
 });
 target.addEventListener('pointerdown',e=>{const node=e.target,root=node.closest?.('.demo-root');if(!root)return;const s=state(root),hold=node.closest('[data-hold]');
  if(hold&&e.button===0){hold.setPointerCapture?.(e.pointerId);startHold(root,hold)}
  if(node.matches('.signature-canvas')){s.drawing=true;node.setPointerCapture?.(e.pointerId);const r=node.getBoundingClientRect(),c=node.getContext('2d');c.strokeStyle=opts(root).accent;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo((e.clientX-r.left)*node.width/r.width,(e.clientY-r.top)*node.height/r.height)}
 });
 target.addEventListener('pointermove',e=>{const node=e.target,root=node.closest?.('.demo-root');if(!root)return;const s=state(root);if(s.drawing){const canvas=root.querySelector('.signature-canvas');if(canvas){const r=canvas.getBoundingClientRect(),ctx=canvas.getContext('2d');ctx.lineTo((e.clientX-r.left)*canvas.width/r.width,(e.clientY-r.top)*canvas.height/r.height);ctx.stroke()}return}
  if(reduced(root)||e.pointerType==='touch')return;
  const spotlight=root.querySelector('.spotlight-card');if(spotlight){const r=spotlight.getBoundingClientRect();spotlight.style.setProperty('--spot-x',(e.clientX-r.left)+'px');spotlight.style.setProperty('--spot-y',(e.clientY-r.top)+'px')}
  const magnet=root.querySelector('.magnetic'),zone=root.querySelector('.magnetic-zone');if(magnet&&zone){const r=zone.getBoundingClientRect();magnet.style.transform=`translate(${Math.max(-22,Math.min(22,(e.clientX-r.left-r.width/2)*.14))}px,${Math.max(-16,Math.min(16,(e.clientY-r.top-r.height/2)*.14))}px)`}
  const card=root.querySelector('.parallax-ticket');if(card){const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(700px) rotateY(${x*13}deg) rotateX(${-y*12}deg)`}
  const lens=root.querySelector('.lens'),glass=root.querySelector('.glass-card');if(lens&&glass){const r=glass.getBoundingClientRect();lens.style.left=Math.max(20,Math.min(r.width-20,e.clientX-r.left))+'px';lens.style.top=Math.max(20,Math.min(r.height-20,e.clientY-r.top))+'px'}
 });
 const end=e=>{const node=e.target,root=node.closest?.('.demo-root');if(!root)return;const s=state(root);if(s.drawing){s.drawing=false;root.querySelector('.signature-canvas')?.getContext('2d')?.closePath()}if(s.holding){s.holding=false;clearTimeout(s.timer);const h=root.querySelector('[data-hold]');h?.classList.remove('holding');h?.style.setProperty('--hold','0%')}const m=root.querySelector('.magnetic');if(m)m.style.transform='';const c=root.querySelector('.parallax-ticket');if(c)c.style.transform=''};
 target.addEventListener('pointerup',end);target.addEventListener('pointercancel',end);
 target.addEventListener('keyup',e=>{if((e.key===' '||e.key==='Enter')&&e.target.matches?.('[data-hold]'))end(e)});
 target.addEventListener('focusout',e=>{if(e.target.matches?.('[data-hold]'))end(e)});
 target.addEventListener('pointerout',e=>{const root=e.target.closest?.('.demo-root');if(root&&!root.contains(e.relatedTarget)){const m=root.querySelector('.magnetic'),c=root.querySelector('.parallax-ticket');if(m)m.style.transform='';if(c)c.style.transform=''}});
}
bind();
global.Motion404={mount,update,paint,copy,bind,onToast:null,openPalette:null,version:'5.5.0',count:Object.keys(global.M404_DEMOS).length};
})(window);
