/* Motion-404 Ultimate Pro. Capa de navegación/presentación, sin alterar almacenamiento o motores. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const html=`
<section class="pro-overview" id="pro-overview" aria-labelledby="pro-overview-title">
  <div class="pro-section-label"><span class="pro-signal"></span> CONTROL CENTER <span class="pro-label-right">YOUR CREATIVE SPACE / 001</span></div>
  <div class="pro-heading-row"><div><h2 id="pro-overview-title">Todo tu universo.<br><span>Un solo estudio.</span></h2><p>Del primer concepto al componente listo para integrar. Elige un laboratorio y empieza a crear.</p></div><span class="pro-index-mark">M—404<span>®</span></span></div>
  <div class="pro-stats" aria-label="Capacidades del estudio"><div><strong>90</strong><span>COMPONENTES INTERACTIVOS</span></div><div><strong>180</strong><span>PRESETS DE MOTION DNA</span></div><div><strong>08</strong><span>LABORATORIOS CREATIVOS</span></div><div><strong>46</strong><span>RECURSOS SELECCIONADOS</span></div></div>
  <div class="pro-card-intro"><h3>Workspaces <span class="pro-mini">/ EXPLORE</span></h3><p>Herramientas conectadas. Crea, previsualiza y exporta.</p></div>
  <div class="pro-workspace-grid">
  <button type="button" data-pro-go="catalog" class="pro-workspace pro-workspace-featured"><div class="pro-workspace-top"><span>01 / LIBRARY</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-components"><span class="demo-mini-pill">INTERACTIVE</span><div class="art-ui art-ui-a"><i></i><b>Explore motion</b><small>↗</small></div><div class="art-ui art-ui-b"><span></span><span></span><span></span></div></div><div class="pro-card-foot"><div><h4>Component Library</h4><p>90 patrones que puedes tocar, modificar y exportar.</p></div><span class="pro-foot-number">90</span></div></button>
  <button type="button" data-pro-go="motion" class="pro-workspace"><div class="pro-workspace-top"><span>02 / MOTION DNA</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-motion"><div class="pro-orbit-ring ring-one"></div><div class="pro-orbit-ring ring-two"></div><div class="pro-orbit-dot"></div><span class="art-coordinates">EASE 0.22, 0.61<br>DURATION 680MS</span></div><div class="pro-card-foot"><div><h4>Motion DNA</h4><p>Sistemas de movimiento y especificaciones visuales.</p></div><span class="pro-foot-number">180</span></div></button>
  <button type="button" data-pro-go="design" class="pro-workspace"><div class="pro-workspace-top"><span>03 / DESIGN SYSTEMS</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-design"><span class="pro-type-art">Aa</span><div class="pro-swatches"><i></i><i></i><i></i><i></i><i></i></div><span class="art-caption">MAKE EVERYTHING COHERENT</span></div><div class="pro-card-foot"><div><h4>Design Studio</h4><p>Color, tipografía y tokens para tu próxima interfaz.</p></div></div></button>
  <button type="button" data-pro-go="timeline" class="pro-workspace"><div class="pro-workspace-top"><span>04 / ANIMATION</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-timeline"><span class="pro-timecode">00:00:01:24</span><div class="pro-time-line"><b></b><b></b><b></b></div><div class="pro-time-line alt"><b></b><b></b></div><div class="pro-time-line third"><b></b></div></div><div class="pro-card-foot"><div><h4>Timeline Editor</h4><p>Compón secuencias con curvas, retrasos y capas.</p></div></div></button>
  <button type="button" data-pro-go="effects" class="pro-workspace"><div class="pro-workspace-top"><span>05 / EXPERIMENTAL</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-effects"><div class="pro-effect-core"></div><span class="pro-effect-label">SIGNAL / DISTORTION</span></div><div class="pro-card-foot"><div><h4>Effects Lab</h4><p>Explora distorsiones, texturas y efectos visuales.</p></div></div></button>
  <button type="button" data-pro-go="game" class="pro-workspace"><div class="pro-workspace-top"><span>06 / GAME DESIGN</span><span class="pro-card-arrow">↗</span></div><div class="pro-preview-art art-game"><div class="pro-game-horizon"></div><div class="pro-game-ui"><b>HP</b><i></i><small>078 / 100</small></div><span class="pro-game-crosshair">⌖</span><div class="pro-game-coordinates">ENTITY UNKNOWN<br>SECTOR 04</div></div><div class="pro-card-foot"><div><h4>Game UI Forge</h4><p>HUD, terror, inventarios y ficción interactiva.</p></div></div></button>
  </div>
  <div class="pro-bottom-banner"><div><span>EXTEND YOUR WORKFLOW</span><h3>Las mejores herramientas, <em>en un solo lugar.</em></h3><p>Explora nuestra selección de recursos de diseño, tipografía, iconos y tecnología creativa.</p></div><button data-pro-go="resources" type="button">Abrir Design Library <span>↗</span></button></div>
</section>`;
const catalog=$('#catalogo'),root=$('.page-content');if(!catalog||!root)return;
const host=document.createElement('div');host.innerHTML=html;root.insertBefore(host.firstElementChild,catalog);
const titles={catalog:'Component Library',motion:'Motion DNA',editor:'Visual Composer',design:'Design Studio',timeline:'Timeline Editor',effects:'Effects Lab',game:'Game UI Forge',resources:'Design Library',backups:'Backups',original:'Motion-404 original',overview:'Overview'};
const overview=$('#pro-overview'),hero=$('.hero'),workspace=$('#ultimate-workspace');
const nav=$('.side-nav');const title=document.createElement('div');title.className='pro-sidebar-heading';title.textContent='CREATIVE SUITE';nav.parentElement.insertBefore(title,nav);
const menu=document.createElement('div');menu.className='pro-suite-nav';
const icons={overview:'◫',catalog:'▦',motion:'◉',editor:'◧',design:'◈',timeline:'≋',effects:'✳',game:'⌘',resources:'◇',backups:'⇣'};
for(const [id,label] of Object.entries(titles)){const b=document.createElement('button');b.type='button';b.className='pro-nav-item';b.dataset.proGo=id;b.innerHTML=`<span aria-hidden="true">${icons[id]||'○'}</span><span>${label}</span>${id==='catalog'?'<small>90</small>':id==='motion'?'<small>180</small>':''}`;menu.append(b)}
nav.parentElement.insertBefore(menu,nav);
const heading=document.createElement('div');heading.className='pro-legacy-title';heading.textContent='COMPONENT FILTERS';nav.parentElement.insertBefore(heading,nav);
const b=$('#pro-breadcrumb');const updateNav=id=>{document.querySelectorAll('.pro-nav-item').forEach(x=>{const active=x.dataset.proGo===id;x.classList.toggle('active',active);if(active)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')});if(b)b.textContent=titles[id]||'Overview'};
function go(id){if(!titles[id])return;const isOverview=id==='overview',isCatalog=id==='catalog';overview.hidden=!isOverview;hero.hidden=!isOverview;catalog.hidden=!isCatalog;workspace.hidden=isOverview||isCatalog;
  if(!isOverview&&!isCatalog){const btn=document.querySelector(`[data-u-tab="${id}"]`);if(btn)btn.click()}
  nav.classList.toggle('pro-hidden-filter',!isCatalog);const label=$('.pro-legacy-title');if(label)label.hidden=!isCatalog;
  updateNav(id);if(id==='catalog'){catalog.scrollIntoView({block:'start',behavior:'instant'})}else if(id==='overview'){window.scrollTo({top:0,behavior:'instant'})}else {workspace.scrollIntoView({block:'start',behavior:'instant'})}
  history.replaceState(null,'',id==='overview'?location.pathname+location.search:`#${encodeURIComponent(id)}`);
  $('#sidebar')?.classList.remove('open');
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-pro-go]');if(t){e.preventDefault();go(t.dataset.proGo)}});
const cta=$('#explore-cta');if(cta)cta.addEventListener('click',()=>go('catalog'));
const openCatalog=$('#random-component');if(openCatalog)openCatalog.addEventListener('click',()=>{go('catalog')},{capture:true});
const quick=document.createElement('button');quick.type='button';quick.className='pro-top-create';quick.textContent='+ New system';quick.addEventListener('click',()=>go('editor'));$('.top-actions')?.prepend(quick);
const footer=$('.sidebar-footer');if(footer){const v=document.createElement('div');v.className='pro-workspace-status';v.innerHTML='<span class="pro-signal"></span><span><b>All systems operational</b><small>Local workspace · No tracking</small></span>';footer.parentElement.insertBefore(v,footer)}
if(workspace){const h=workspace.querySelector('h2');if(h)h.innerHTML='Build your <em>next idea.</em>';const p=workspace.querySelector('h2+p');if(p)p.textContent='Un entorno profesional para diseñar, animar, explorar y exportar. Todas las herramientas listas para trabajar.';}
function init(){const hash=decodeURIComponent(location.hash.slice(1));go(titles[hash]?hash:'overview')}
window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(titles[id])go(id)});
init();window.__MOTION404_PRO_READY__=true;
})();
