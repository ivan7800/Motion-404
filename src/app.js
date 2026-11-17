/* MOTION-404 STUDIO • UI / offline-first client • sin telemetría */
(()=>{
'use strict';
const catalog=window.M404_CATALOG||[], engine=window.Motion404, $=id=>document.getElementById(id), safe=window.M404_H.esc;
const categories=[['All','✧','Todos'],['Buttons','◈','Botones'],['Inputs','⌘','Inputs'],['Navigation','☷','Navegación'],['Cards','▦','Tarjetas'],['AI','◎','IA'],['Text','A','Texto'],['Saved','♡','Guardados']];
const colors=['#a78bfa','#75d9e8','#f2a0ca','#f2c17e','#9adeb8','#ec8d86'];
const defaults={category:'All',query:'',sort:'original',page:1,perPage:12,view:'grid',selected:null,device:'desktop'};
let stored={};try{stored=JSON.parse(localStorage.getItem('motion404_state')||'{}')}catch{}
const ui={...defaults,theme:stored.theme==='light'?'light':'dark',saved:new Set(Array.isArray(stored.saved)?stored.saved:[]),configs:stored.configs||{}};
let toastTimer=0,lastFocus=null;
const save=()=>{try{localStorage.setItem('motion404_state',JSON.stringify({saved:[...ui.saved],theme:ui.theme,configs:ui.configs}))}catch{notify('El navegador ha bloqueado el almacenamiento local')}};
const notify=message=>{const t=$('toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600)};
engine.onToast=notify;engine.openPalette=()=>openCommands();
const config=id=>({accent:'#a78bfa',speed:1,text:'El umbral permanece abierto.',...(ui.configs[id]||{})});
const setTheme=()=>{document.body.classList.toggle('light',ui.theme==='light');$('theme-toggle').textContent=ui.theme==='dark'?'☀':'☾';$('theme-toggle').title=ui.theme==='dark'?'Cambiar a tema claro':'Cambiar a tema oscuro'};
const count=cat=>cat==='Saved'?ui.saved.size:cat==='All'?catalog.length:catalog.filter(x=>x.category===cat).length;
function sidebar(){
 $('side-nav').innerHTML=categories.map(([id,icon,title])=>`<button class="side-link ${ui.category===id?'active':''}" data-category="${id}"><span class="nav-symbol">${icon}</span><span>${title}</span><span class="nav-count">${count(id).toString().padStart(2,'0')}</span></button>`).join('');
 $('filter-chips').innerHTML=categories.map(([id,,title])=>`<button class="chip ${ui.category===id?'selected':''}" data-category="${id}">${title}<span class="chip-count">${count(id)}</span></button>`).join('');
}
const searchString=x=>(x.name+' '+x.category+' '+x.provider+' '+x.slug).toLocaleLowerCase('es');
function results(){let a=catalog.filter(x=>(ui.category==='All'||(ui.category==='Saved'?ui.saved.has(x.id):x.category===ui.category))&&searchString(x).includes(ui.query.toLocaleLowerCase('es').trim()));if(ui.sort==='az')a.sort((a,b)=>a.name.localeCompare(b.name,'es'));if(ui.sort==='za')a.sort((a,b)=>b.name.localeCompare(a.name,'es'));if(ui.sort==='source')a.sort((a,b)=>a.provider.localeCompare(b.provider,'es')||a.id-b.id);return a}
function render(){
 sidebar();const list=results(),pages=Math.max(1,Math.ceil(list.length/ui.perPage));ui.page=Math.max(1,Math.min(ui.page,pages));const visible=list.slice((ui.page-1)*ui.perPage,ui.page*ui.perPage);
 $('result-count').textContent=`${list.length} componente${list.length===1?'':'s'} · ${ui.category==='All'?'Todas las colecciones':categories.find(c=>c[0]===ui.category)?.[2]||''}`;
 $('component-grid').classList.toggle('list-view',ui.view==='list');$('layout-grid').classList.toggle('selected',ui.view==='grid');$('layout-list').classList.toggle('selected',ui.view==='list');
 $('component-grid').innerHTML=visible.map(x=>`<article class="component-card" data-card="${x.id}"><div class="card-top"><span class="card-id">PATTERN_${String(x.id).padStart(3,'0')}</span><span class="source-tag">${safe(x.provider)}</span></div><div class="card-demo" id="card-demo-${x.id}" aria-label="Demo interactiva: ${safe(x.name)}"></div><div class="card-bottom"><div class="card-title-area"><h3>${safe(x.name)}</h3><p>${safe(x.category)} · Recreación original</p></div><button class="favorite-btn ${ui.saved.has(x.id)?'active':''}" data-favorite="${x.id}" aria-label="${ui.saved.has(x.id)?'Quitar de favoritos':'Guardar favorito'}: ${safe(x.name)}" aria-pressed="${ui.saved.has(x.id)}">${ui.saved.has(x.id)?'♥':'♡'}</button><button class="inspect-btn" data-inspect="${x.id}" aria-label="Inspeccionar ${safe(x.name)}" title="Abrir editor">↗</button></div></article>`).join('');
 for(const item of visible){try{engine.mount($(`card-demo-${item.id}`),item.id,config(item.id))}catch(err){console.error(item.id,err);$(`card-demo-${item.id}`).textContent='No se pudo iniciar este ejemplo'}}
 $('empty-state').hidden=list.length!==0;$('pagination-summary').textContent=list.length?`Mostrando ${(ui.page-1)*ui.perPage+1}–${Math.min(ui.page*ui.perPage,list.length)} de ${list.length}`:'No hay resultados';
 $('pagination-controls').innerHTML=list.length?`<button data-page="prev" ${ui.page===1?'disabled':''} aria-label="Anterior">←</button>${Array.from({length:pages},(_,i)=>`<button data-page="${i+1}" class="${ui.page===i+1?'active':''}" aria-label="Página ${i+1}" ${ui.page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')}<button data-page="next" ${ui.page===pages?'disabled':''} aria-label="Siguiente">→</button>`:'';
}
const setCategory=cat=>{ui.category=cat;ui.page=1;render();$('sidebar').classList.remove('open')};
const clearFilters=()=>{ui.query='';ui.category='All';ui.sort='original';ui.page=1;$('search').value='';$('sort').value='original';render()};
function openDetail(id){const item=catalog.find(x=>x.id===Number(id));if(!item)return;lastFocus=document.activeElement;ui.selected=item.id;ui.device='desktop';$('detail-title').textContent=item.name;$('detail-id').textContent='/ '+String(item.id).padStart(3,'0');$('detail-overlay').hidden=false;document.body.style.overflow='hidden';
 const c=config(item.id);$('custom-text').value=c.text;$('custom-speed').value=c.speed;$('speed-readout').textContent=Number(c.speed).toFixed(2)+'×';$('reduce-motion').checked=false;$('detail-preview-wrapper').className='detail-preview-wrapper';$('detail-overlay').classList.remove('reduce-motion');renderSwatches();engine.mount($('detail-preview'),item.id,c);
 $('source-info').innerHTML=`<strong>Procedencia de la idea</strong><div>Patrón conocido como «${safe(item.name)}».</div><div>Referencia: <a href="${safe(item.reference)}" target="_blank" rel="noopener noreferrer">${safe(item.provider)} ↗</a></div><div>Implementación original de MOTION-404. No se distribuye código ni material protegido de terceros.</div>`;
 document.querySelectorAll('.device-btn[data-device]').forEach(b=>b.classList.toggle('selected',b.dataset.device==='desktop'));$('close-detail').focus();
}
function closeDetail(){$('detail-overlay').hidden=true;ui.selected=null;document.body.style.overflow='';lastFocus?.focus?.()}
function preview(){if(ui.selected===null)return;const c=config(ui.selected),root=$('detail-preview').querySelector('.demo-root');engine.update(root,c);const card=$('card-demo-'+ui.selected)?.querySelector('.demo-root');engine.update(card,c)}
function renderSwatches(){const c=config(ui.selected);$('color-options').innerHTML=colors.map(v=>`<button class="swatch ${v===c.accent?'selected':''}" style="--swatch:${v}" data-swatch="${v}" title="Color ${v}" aria-label="Aplicar color ${v}" aria-pressed="${v===c.accent}"></button>`).join('')}
function setConfig(key,value){if(ui.selected===null)return;ui.configs[ui.selected]={...config(ui.selected),[key]:value};save();if(key==='accent')renderSwatches();preview()}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500)}
function integration(id){const c=config(id);return `<!-- MOTION-404-STUDIO · patrón #${id} · código propio -->\n<link rel="stylesheet" href="./src/style.css">\n<div id="componente-404"></div>\n<script src="./src/components.js"><\/script>\n<script src="./src/engine.js"><\/script>\n<script>Motion404.mount(document.getElementById('componente-404'), ${id}, ${JSON.stringify(c)});<\/script>`}
function standalone(id){const c=config(id),source=window.M404_EXPORT;if(!source)throw Error('El exportador no está cargado');const item=catalog.find(x=>x.id===id);const escapeScript=s=>s.replace(/<\/script/gi,'<\\/script');
 return `<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOTION-404 · ${safe(item.name)}</title><style>${source.css}</style><style>body{min-height:100vh;display:grid;place-items:center;background:#090b11;margin:0}.demo-root{width:min(90vw,480px);min-height:320px}</style></head><body><div id="preview"></div><script>${escapeScript(source.components)}<\/script><script>${escapeScript(source.engine)}<\/script><script>Motion404.mount(document.getElementById('preview'),${id},${JSON.stringify(c).replace(/</g,'\\u003c')});<\/script></body></html>`;
}
function exportSelected(){if(ui.selected===null)return;const item=catalog.find(x=>x.id===ui.selected);try{download(new Blob([standalone(item.id)],{type:'text/html;charset=utf-8'}),`MOTION404-${item.slug}.html`);notify('HTML autónomo creado')}catch(err){notify('Error al exportar: '+err.message)}}
function copyIntegration(){if(ui.selected===null)return;engine.copy(integration(ui.selected)).then(ok=>notify(ok?'Código de integración copiado':'No se ha podido copiar'))}
function copyAgentPrompt(){if(ui.selected===null)return;const x=catalog.find(v=>v.id===ui.selected),prompt=`Integra el patrón interactivo original ${x.name} (#${x.id}) de MOTION-404-STUDIO en mi proyecto. Revisa src/components.js y src/engine.js, conserva las interacciones, respeta reducción de movimiento y permite personalizar color y velocidad. No copies código, marcas ni recursos de terceros. Valida en escritorio y móvil.`;engine.copy(prompt).then(ok=>notify(ok?'Prompt para Codex copiado':'No se ha podido copiar'))}
function openCommands(){lastFocus=document.activeElement;$('command-overlay').hidden=false;$('command-input').value='';renderCommands();$('command-input').focus()}
function closeCommands(){$('command-overlay').hidden=true;lastFocus?.focus?.()}
function renderCommands(){const q=$('command-input').value.toLocaleLowerCase('es').trim();const commands=[{id:'all',name:'Mostrar todos los componentes',category:'Acción'},{id:'saved',name:'Ver favoritos',category:'Acción'},{id:'theme',name:'Alternar tema',category:'Acción'}];const matching=catalog.filter(v=>searchString(v).includes(q)).slice(0,q?9:6).map(v=>({id:v.id,name:v.name,category:v.category}));const actions=commands.filter(v=>!q||(v.name.toLocaleLowerCase('es').includes(q)));
 $('command-results').innerHTML=[...actions,...matching].map(v=>`<button class="command-item" data-command="${v.id}"><span>${safe(v.name)}</span><small>${safe(v.category)} ↗</small></button>`).join('')||'<div class="d-muted" style="padding:15px">Sin resultados</div>'}
function command(id){closeCommands();if(id==='all'){clearFilters();$('catalogo').scrollIntoView({behavior:'smooth'});return}if(id==='saved'){setCategory('Saved');$('catalogo').scrollIntoView({behavior:'smooth'});return}if(id==='theme'){$('theme-toggle').click();return}openDetail(Number(id))}
// Eventos de UI (los eventos internos de cada demostración se manejan en engine.js)
document.addEventListener('click',e=>{
 const n=e.target.closest('[data-category]');if(n){setCategory(n.dataset.category);return}
 const fav=e.target.closest('[data-favorite]');if(fav){const id=Number(fav.dataset.favorite);ui.saved.has(id)?ui.saved.delete(id):ui.saved.add(id);save();render();return}
 const inspect=e.target.closest('[data-inspect]');if(inspect){openDetail(inspect.dataset.inspect);return}
 const pg=e.target.closest('[data-page]');if(pg){const value=pg.dataset.page;ui.page=value==='prev'?ui.page-1:value==='next'?ui.page+1:Number(value);render();$('catalogo').scrollIntoView({behavior:'smooth'});return}
 const sw=e.target.closest('[data-swatch]');if(sw){setConfig('accent',sw.dataset.swatch);return}
 const dev=e.target.closest('[data-device]');if(dev){ui.device=dev.dataset.device;$('detail-preview-wrapper').classList.toggle('mobile',ui.device==='mobile');document.querySelectorAll('.device-btn[data-device]').forEach(b=>b.classList.toggle('selected',b.dataset.device===ui.device));return}
 const cmd=e.target.closest('[data-command]');if(cmd){command(cmd.dataset.command);return}
 const backdrop=e.target.closest('[data-close]');if(backdrop){backdrop.dataset.close==='detail'?closeDetail():closeCommands();return}
});
$('search').addEventListener('input',e=>{ui.query=e.target.value;ui.page=1;render()});$('sort').addEventListener('change',e=>{ui.sort=e.target.value;ui.page=1;render()});
$('clear-filters').addEventListener('click',clearFilters);$('empty-clear').addEventListener('click',clearFilters);
$('layout-grid').addEventListener('click',()=>{ui.view='grid';render()});$('layout-list').addEventListener('click',()=>{ui.view='list';render()});
$('theme-toggle').addEventListener('click',()=>{ui.theme=ui.theme==='dark'?'light':'dark';setTheme();save()});
$('open-commands').addEventListener('click',openCommands);$('close-detail').addEventListener('click',closeDetail);$('reset-demo').addEventListener('click',()=>{if(ui.selected!==null)engine.mount($('detail-preview'),ui.selected,config(ui.selected));notify('Demostración reiniciada')});
$('toggle-sidebar').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
$('custom-text').addEventListener('input',e=>setConfig('text',e.target.value.slice(0,140)));
$('custom-speed').addEventListener('input',e=>{const n=Number(e.target.value);$('speed-readout').textContent=n.toFixed(2)+'×';setConfig('speed',n)});
$('reduce-motion').addEventListener('change',e=>$('detail-overlay').classList.toggle('reduce-motion',e.target.checked));
$('download-component').addEventListener('click',exportSelected);$('copy-component').addEventListener('click',copyIntegration);$('copy-agent-prompt').addEventListener('click',copyAgentPrompt);
$('random-component').addEventListener('click',()=>openDetail(catalog[Math.floor(Math.random()*catalog.length)].id));
$('explore-cta').addEventListener('click',()=>$('catalogo').scrollIntoView({behavior:'smooth'}));
$('export-catalog').addEventListener('click',()=>{const data={application:'MOTION-404-STUDIO',version:engine.version,generated:'2026-11-17',description:'Catálogo referencial de patrones; implementaciones originales dentro de este proyecto.',catalog};download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),'MOTION-404-CATALOGO.json');notify('Catálogo JSON exportado')});
$('command-input').addEventListener('input',renderCommands);
document.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('command-overlay').hidden?openCommands():closeCommands();return}
 if(e.key==='Escape'){if(!$('command-overlay').hidden)closeCommands();else if(!$('detail-overlay').hidden)closeDetail();else $('sidebar').classList.remove('open');return}
 if(e.key==='/'&&document.activeElement?.tagName!=='INPUT'&&document.activeElement?.tagName!=='TEXTAREA'&&$('detail-overlay').hidden&&$('command-overlay').hidden){e.preventDefault();$('search').focus()}
 if(e.key==='Enter'&&!$('command-overlay').hidden&&document.activeElement===$('command-input')){const a=$('command-results').querySelector('[data-command]');if(a)command(a.dataset.command)}
});
setTheme();render();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./service-worker.js').catch(err=>console.info('Sin SW:',err.message));
})();
