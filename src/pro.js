/* Motion-404 Ultimate Pro. Capa de navegación/presentación, sin alterar almacenamiento o motores. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const html=`
<section class="pro-overview" id="pro-overview" aria-labelledby="pro-overview-title">
  <div class="pro-section-label"><span class="pro-signal"></span> CONTROL CENTER <span class="pro-label-right">YOUR CREATIVE SPACE / 001</span></div>
  <div class="pro-heading-row"><div><h2 id="pro-overview-title">Todo tu universo.<br><span>Un solo estudio.</span></h2><p>Del primer concepto al componente listo para integrar. Elige un laboratorio y empieza a crear.</p></div><span class="pro-index-mark">M—404<span>®</span></span></div>
  <div class="pro-card-intro"><h3>Herramientas del estudio</h3><p>Empieza en la biblioteca o abre una herramienta para una tarea concreta.</p></div>
  <div class="pro-workspace-grid">
  <button type="button" data-pro-go="catalog" class="pro-workspace pro-workspace-featured"><div class="pro-workspace-top"><span>01 / LIBRARY</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-components"><span class="demo-mini-pill">INTERACTIVE</span><div class="art-ui art-ui-a"><i></i><b>Explore motion</b><small>↗</small></div><div class="art-ui art-ui-b"><span></span><span></span><span></span></div></div><div class="pro-card-foot"><div><h4>Biblioteca de componentes</h4><p>90 patrones que puedes tocar, modificar y exportar.</p></div><span class="pro-foot-number">90</span></div></button>
  <button type="button" data-pro-go="motion" class="pro-workspace"><div class="pro-workspace-top"><span>02 / MOTION DNA</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-motion"><div class="pro-orbit-ring ring-one"></div><div class="pro-orbit-ring ring-two"></div><div class="pro-orbit-dot"></div><span class="art-coordinates">EASE 0.22, 0.61<br>DURATION 680MS</span></div><div class="pro-card-foot"><div><h4>Motion DNA</h4><p>Sistemas de movimiento y especificaciones visuales.</p></div><span class="pro-foot-number">180</span></div></button>
  <button type="button" data-pro-go="design" class="pro-workspace"><div class="pro-workspace-top"><span>03 / DESIGN SYSTEMS</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-design"><span class="pro-type-art">Aa</span><div class="pro-swatches"><i></i><i></i><i></i><i></i><i></i></div><span class="art-caption">MAKE EVERYTHING COHERENT</span></div><div class="pro-card-foot"><div><h4>Estudio de diseño</h4><p>Color, tipografía y tokens para tu próxima interfaz.</p></div></div></button>
  <button type="button" data-pro-go="timeline" class="pro-workspace"><div class="pro-workspace-top"><span>04 / ANIMATION</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-timeline"><span class="pro-timecode">00:00:01:24</span><div class="pro-time-line"><b></b><b></b><b></b></div><div class="pro-time-line alt"><b></b><b></b></div><div class="pro-time-line third"><b></b></div></div><div class="pro-card-foot"><div><h4>Secuenciador de tres pistas</h4><p>Compón secuencias con curvas, retrasos y capas.</p></div></div></button>
  <button type="button" data-pro-go="effects" class="pro-workspace"><div class="pro-workspace-top"><span>05 / EXPERIMENTAL</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-effects"><div class="pro-effect-core"></div><span class="pro-effect-label">SIGNAL / DISTORTION</span></div><div class="pro-card-foot"><div><h4>Efectos</h4><p>Explora distorsiones, texturas y efectos visuales.</p></div></div></button>
  <button type="button" data-pro-go="game" class="pro-workspace"><div class="pro-workspace-top"><span>06 / GAME DESIGN</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-game"><div class="pro-game-horizon"></div><div class="pro-game-ui"><b>HP</b><i></i><small>078 / 100</small></div><span class="pro-game-crosshair">⌖</span><div class="pro-game-coordinates">ENTITY UNKNOWN<br>SECTOR 04</div></div><div class="pro-card-foot"><div><h4>Interfaz de juego</h4><p>HUD, terror, inventarios y ficción interactiva.</p></div></div></button>
  </div>
  <div class="pro-bottom-banner"><div><span>EXTEND YOUR WORKFLOW</span><h3>Las mejores herramientas, <em>en un solo lugar.</em></h3><p>Explora nuestra selección de recursos de diseño, tipografía, iconos y tecnología creativa.</p></div><button data-pro-go="resources" type="button">Abrir Recursos de diseño <span>↗</span></button></div>
</section>`;
const catalog=$('#catalogo'),root=$('.page-content');if(!catalog||!root)return;
const host=document.createElement('div');host.innerHTML=html;root.insertBefore(host.firstElementChild,catalog);
const titles={overview:'Inicio',catalog:'Biblioteca de componentes',motion:'Motion DNA',editor:'Compositor visual',design:'Estudio de diseño',timeline:'Secuenciador de tres pistas',effects:'Efectos',game:'Interfaz de juego',resources:'Recursos de diseño',backups:'Copias de seguridad',original:'Archivo histórico · v2.0.2'};
const overview=$('#pro-overview'),hero=$('.hero'),workspace=$('#ultimate-workspace');
const nav=$('#side-nav');
const menu=document.createElement('nav');
menu.className='pro-suite-nav';
menu.setAttribute('aria-label','Secciones del estudio');
const icons={overview:'◫',catalog:'▦',motion:'◉',editor:'◧',design:'◈',timeline:'≋',effects:'✳',game:'⌘',resources:'◇',backups:'⇣'};
const sections = [
  ['Crear', ['overview', 'catalog', 'editor']],
  ['Herramientas avanzadas', ['motion', 'design', 'timeline', 'effects', 'game']],
  ['Recursos y datos', ['resources', 'backups', 'original']]
];
for (const [heading, ids] of sections) {
  const label = document.createElement('strong');
  label.className = 'pro-menu-heading';
  label.textContent = heading;
  menu.append(label);
  for (const id of ids) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pro-nav-item';
    button.dataset.proGo = id;
    button.innerHTML = `<span aria-hidden="true">${icons[id] || '○'}</span><span>${titles[id]}</span>`;
    menu.append(button);
  }
}
nav.parentElement.insertBefore(menu,nav);
const b=$('#pro-breadcrumb');const updateNav=id=>{document.querySelectorAll('.pro-nav-item').forEach(x=>{const active=x.dataset.proGo===id;x.classList.toggle('active',active);if(active)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')});if(b)b.textContent=titles[id]||'Inicio'};
function go(id, record=true){if(!Object.hasOwn(titles,id))return;const isOverview=id==='overview',isCatalog=id==='catalog';overview.hidden=!isOverview;hero.hidden=!isOverview;catalog.hidden=!isCatalog;workspace.hidden=isOverview||isCatalog;
  if(!isOverview&&!isCatalog){const btn=document.querySelector(`[data-u-tab="${id}"]`);if(btn)btn.click()}

  updateNav(id);if(id==='catalog'){catalog.scrollIntoView({block:'start',behavior:'instant'})}else if(id==='overview'){window.scrollTo({top:0,behavior:'instant'})}else {workspace.scrollIntoView({block:'start',behavior:'instant'})}
  if(record){
    const url=new URL(location.href);
    url.searchParams.delete('component');
    url.hash=isOverview?'':id;
    if(url.href!==location.href)history.pushState(null,'',url);
  }
  const wasOpen=sidebar.classList.contains('open');
  setDrawer(false);
  if(wasOpen)toggle.focus();
}
const sidebar=$('#sidebar'),toggle=$('#toggle-sidebar');
const mobile=matchMedia('(max-width:780px)');
const dismiss=$('#close-sidebar'),backdrop=$('#sidebar-backdrop');
function setDrawer(open){
  open=mobile.matches&&open;
  sidebar.classList.toggle('open',open);
  sidebar.inert=mobile.matches&&!open;
  $('#main').inert=open;
  backdrop.hidden=!open;
  toggle.setAttribute('aria-expanded',String(open));
  if(open)dismiss.focus();
}
function closeDrawer(){setDrawer(false);toggle.focus()}
toggle.addEventListener('click',()=>setDrawer(true));
dismiss.addEventListener('click',closeDrawer);
backdrop.addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{
  if(!sidebar.classList.contains('open'))return;
  if(e.key==='Escape'){e.preventDefault();closeDrawer()}
  if(e.key==='Tab'){
    const buttons=[...sidebar.querySelectorAll('button')].filter(el=>el.getClientRects().length);
    const first=buttons[0],last=buttons.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
},true);
mobile.addEventListener('change',()=>setDrawer(false));
document.addEventListener('click',e=>{const t=e.target.closest('[data-pro-go]');if(t){e.preventDefault();go(t.dataset.proGo)}});
const cta=$('#explore-cta');if(cta)cta.addEventListener('click',()=>go('catalog'));
const openCatalog=$('#random-component');if(openCatalog)openCatalog.addEventListener('click',()=>{go('catalog')},{capture:true});
const quick=document.createElement('button');quick.type='button';quick.className='pro-top-create';quick.textContent='Abrir compositor';quick.addEventListener('click',()=>go('editor'));$('.top-actions')?.prepend(quick);
function restoreRoute(){
  const key=location.hash.slice(1);
  go(Object.hasOwn(titles,key)?key:'overview',false);
}
window.addEventListener('hashchange',restoreRoute);
restoreRoute();window.__MOTION404_PRO_READY__=true;
})();
