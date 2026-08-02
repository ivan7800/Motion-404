const CATALOG_VERSION = 1;
const STORAGE_KEY = 'motion404-state-v1';
const PAGE_SIZE = 12;
const MAX_CUSTOM_PROMPTS = 200;
const MAX_PROMPT_LENGTH = 100_000;
const MAX_IMPORT_BYTES = 2_000_000;

const categories = ['Todos','Landing','Aplicación','Portfolio','E-commerce','Dashboard','Editorial','Experiencia 3D','Arquitectura','Restauración','Gaming'];
const stacks = ['HTML + CSS + JS','React + CSS Modules','React + Tailwind','React + Framer Motion','React + GSAP','Three.js + GSAP'];
const styles = ['Brutalismo editorial','Futurismo orgánico','Minimalismo cinético','Neo-retro digital','Lujo monocromo','Tecnología translúcida','Collage tipográfico','Industrial táctil','Gradiente espacial','Editorial mediterráneo'];
const motions = ['Microinteracciones suaves','Scroll cinematográfico','Parallax multicapa','Tipografía cinética','Transiciones de máscara','Objetos 3D reactivos','Cursor magnético','Revelado secuencial'];
const industries = ['Arquitectura','IA y software','Restauración','Moda','Música','Videojuegos','Viajes','Finanzas','Salud y bienestar','Educación','Inmobiliaria','Fotografía','Automoción','Cultura','E-commerce','Consultoría','Deporte','Sostenibilidad'];
const concepts = [
  ['Atlas Habitat','Arquitectura','Arquitectura','Un estudio de arquitectura con proyectos inmersivos, planos editoriales y transiciones espaciales.'],
  ['Neural Atlas','Landing','IA y software','Una landing de producto IA que convierte datos complejos en una narrativa visual clara.'],
  ['Mesa Nómada','Restauración','Restauración','Un restaurante de cocina viajera con carta visual, reservas y una identidad cálida.'],
  ['Nocturne Records','Editorial','Música','Un sello musical independiente con lanzamientos, artistas y escucha editorial.'],
  ['Void Runner','Gaming','Videojuegos','Un videojuego sci-fi con universo narrativo, personajes y llamada a la acción enérgica.'],
  ['Asteria Journeys','Landing','Viajes','Una agencia de viajes de autor con destinos inmersivos y storytelling fotográfico.'],
  ['Lumen Capital','Dashboard','Finanzas','Un panel financiero sobrio con métricas, escenarios y visualización accionable.'],
  ['Pulse Studio','Aplicación','Salud y bienestar','Una app de hábitos y entrenamiento con progreso, rutinas y motivación sin ruido.'],
  ['Forma Academy','Aplicación','Educación','Una plataforma educativa con itinerarios, clases y seguimiento del aprendizaje.'],
  ['Nexo Living','E-commerce','Inmobiliaria','Un catálogo inmobiliario premium con filtros, visitas y fichas de alto impacto.'],
  ['Grain & Light','Portfolio','Fotografía','Un portfolio fotográfico con ritmo editorial, series y navegación inmersiva.'],
  ['Torque Lab','Landing','Automoción','Un laboratorio de movilidad y prototipos con lenguaje industrial y precisión técnica.'],
  ['Archivo Vivo','Editorial','Cultura','Un archivo cultural digital con exposiciones, cronologías y exploración no lineal.'],
  ['Serein Objects','E-commerce','E-commerce','Una tienda de objetos de diseño con fotografía protagonista y compra fluida.'],
  ['Northbound','Landing','Consultoría','Una consultora estratégica con tesis claras, casos y credibilidad ejecutiva.'],
  ['Kinetic Club','Aplicación','Deporte','Una app social deportiva con retos, equipos y resultados en tiempo real.'],
  ['Terra Loop','Landing','Sostenibilidad','Una iniciativa climática con impacto medible, proyectos y participación ciudadana.'],
  ['Mono Studio','Portfolio','Arquitectura','Un portfolio minimalista que presenta procesos, maquetas y obras construidas.'],
  ['Signal OS','Aplicación','IA y software','Una aplicación de productividad con comandos rápidos, automatización y panel modular.'],
  ['Fire & Ferment','Restauración','Restauración','Una experiencia gastronómica centrada en fuego, fermentos y origen del producto.'],
  ['Eclipse Festival','Landing','Música','Una landing de festival con programación, artistas y entradas en una atmósfera nocturna.'],
  ['Arcadia Bestiary','Gaming','Videojuegos','Una enciclopedia fantástica interactiva con criaturas, mapas y lore desbloqueable.'],
  ['Drift House','Experiencia 3D','Viajes','Un refugio remoto presentado como recorrido 3D contemplativo y sensorial.'],
  ['Flux Ledger','Dashboard','Finanzas','Un dashboard fintech con cartera, alertas y simulaciones de riesgo comprensibles.'],
  ['Still Mind','Aplicación','Salud y bienestar','Una app de respiración y descanso con sesiones, ambiente y estadísticas discretas.'],
  ['Orbit Learn','Aplicación','Educación','Una experiencia de aprendizaje espacial basada en mapas de conocimiento y progreso.'],
  ['Casa Clara','Arquitectura','Inmobiliaria','Una promoción residencial mediterránea con planos, entorno y visitas guiadas.'],
  ['Rare Frames','Portfolio','Fotografía','Un portfolio cinematográfico con proyectos, making-of y contacto directo.'],
  ['Volta EV','Experiencia 3D','Automoción','Un configurador conceptual de vehículo eléctrico con detalles 3D y narrativa tecnológica.'],
  ['Museo 404','Editorial','Cultura','Un museo digital experimental con salas temáticas, obras y navegación accesible.']
];

const previewImages = {
  'Arquitectura':'assets/examples/architecture.webp',
  'IA y software':'assets/examples/dashboard.webp',
  'Finanzas':'assets/examples/dashboard.webp',
  'Viajes':'assets/examples/travel.webp',
  'E-commerce':'assets/examples/ecommerce.webp',
  'Inmobiliaria':'assets/examples/architecture.webp',
  'Restauración':'assets/examples/restaurant.webp',
  'Fotografía':'assets/examples/portfolio.webp',
  'Cultura':'assets/examples/portfolio.webp',
  'Videojuegos':'assets/examples/gaming.webp',
  'Automoción':'assets/examples/automotive.webp'
};
const fallbackPreviewImages = [
  'assets/examples/architecture.webp','assets/examples/dashboard.webp','assets/examples/travel.webp',
  'assets/examples/ecommerce.webp','assets/examples/restaurant.webp','assets/examples/portfolio.webp',
  'assets/examples/gaming.webp','assets/examples/automotive.webp'
];

const palettes = [
  ['#ff6b35','#9d7cff','#11141c'],['#b8ff5a','#4eb8ff','#0a1015'],['#ff4d8d','#ffb454','#15101d'],
  ['#9d7cff','#60e6c5','#0d0c17'],['#f2d27e','#f05c3b','#15130f'],['#54b8ff','#ff6b35','#0b1118'],
  ['#ff835d','#d7ff70','#18120f'],['#c8a4ff','#f3f0e8','#121118'],['#43e0b0','#5271ff','#08120f'],['#ff5e6c','#f0c75e','#161016']
];

const checkItems = [
  'La jerarquía visual se entiende sin animación.',
  'Todos los controles funcionan con ratón, teclado y táctil.',
  'El diseño responde correctamente entre 320 px y pantallas grandes.',
  'Se respeta prefers-reduced-motion y el foco es visible.',
  'No hay errores en consola, rutas rotas ni assets ausentes.',
  'La carga inicial evita bloqueos y movimientos bruscos de layout.',
  'Los datos del usuario se validan antes de guardarse o importarse.',
  'La publicación bajo una subruta de GitHub Pages conserva los recursos.'
];

function buildPrompt({title, category, industry, description, style, motion, stack, level}) {
  const isThree = stack.includes('Three.js');
  const isReact = stack.startsWith('React');
  return `# ${title} — Prompt profesional de construcción web

Actúa como un equipo senior de producto digital compuesto por dirección creativa, UX/UI, frontend, accesibilidad, rendimiento, seguridad y QA.

## OBJETIVO
Diseña e implementa una ${category.toLowerCase()} para **${title}**, dentro del sector **${industry}**. ${description}

La pieza debe sentirse original, contemporánea y lista para producción. No copies webs existentes, marcas, textos, ilustraciones ni recursos de terceros.

## TECNOLOGÍA
- Stack principal: ${stack}.
- ${isReact ? 'Usa componentes pequeños, estado predecible, claves estables y efectos con limpieza.' : 'Usa HTML semántico, CSS organizado y JavaScript modular sin dependencias innecesarias.'}
- ${isThree ? 'Carga la escena 3D de forma progresiva, limita el coste de GPU y ofrece una alternativa estática.' : 'Evita librerías pesadas cuando CSS y APIs nativas sean suficientes.'}
- Debe funcionar en una subruta de GitHub Pages y también con servidor local.

## DIRECCIÓN DE ARTE
- Lenguaje visual: **${style}**.
- Movimiento: **${motion}**.
- Composición con contraste, espacios respirables y una jerarquía tipográfica contundente.
- Crea un sistema coherente de color, espaciado, radios, sombras y estados interactivos.
- Evita el aspecto de plantilla genérica, tarjetas repetitivas sin intención, exceso de glassmorphism y gradientes decorativos sin función.

## ESTRUCTURA
1. Navegación clara y compacta.
2. Hero con propuesta de valor, apoyo visual y llamada a la acción.
3. Bloque narrativo que explique el problema y la solución.
4. Sección principal adaptada al sector ${industry}.
5. Prueba social, datos o casos cuando tenga sentido.
6. Llamada a la acción final.
7. Footer útil con información real, legal y contacto.

## EXPERIENCIA Y MOVIMIENTO
- Define una entrada de página sobria y no bloqueante.
- Usa el movimiento para guiar atención, explicar relaciones o dar continuidad.
- Incluye hover, focus, pressed, loading, success, empty y error donde correspondan.
- Ninguna animación debe impedir leer, pulsar o navegar.
- Respeta prefers-reduced-motion y evita scroll hijacking.

## RESPONSIVE
- Mobile first desde 320 px.
- Optimiza navegación, ritmo, tipografía, tablas, formularios y controles táctiles.
- Sin scroll horizontal accidental.
- Áreas táctiles de al menos 44 × 44 px cuando sea posible.

## ACCESIBILIDAD
- HTML semántico, idioma correcto, landmarks, encabezados ordenados y nombres accesibles.
- Navegación completa por teclado, foco visible, contraste suficiente y textos alternativos.
- Diálogos con foco controlado y cierre mediante Escape.
- No dependas únicamente del color o del movimiento para comunicar estado.

## SEGURIDAD Y PRIVACIDAD
- No incluyas secretos, claves ni telemetría.
- Valida entradas y evita inyección mediante contenido HTML no confiable.
- Enlaces externos con protecciones adecuadas.
- Si hay persistencia, usa un esquema versionado y tolerante a datos corruptos.

## RENDIMIENTO
- Optimiza imágenes y fuentes; reserva dimensiones para evitar CLS.
- Carga diferida para contenido no crítico.
- Evita listeners duplicados, animaciones de propiedades costosas y renders innecesarios.
- Mantén una experiencia fluida en un móvil de gama media.

## ENTREGA
- Proporciona el árbol de archivos y todos los archivos completos.
- Incluye README con instalación, ejecución, pruebas y publicación en GitHub Pages.
- Ejecuta las comprobaciones disponibles: sintaxis, build, lint, typecheck y pruebas.
- Comprueba botones, formularios, navegación, rutas, recarga, responsive y consola.
- Indica con honestidad qué se ha ejecutado y qué queda como “No verificado”.

## CRITERIO DE ACEPTACIÓN
El resultado final debe ser visualmente distintivo, utilizable sin explicación, accesible, rápido, sin errores visibles y preparado para evolucionar sin reescribir la base.`;
}

function createCatalog() {
  const items = [];
  for (let round = 0; round < 6; round += 1) {
    concepts.forEach((concept, index) => {
      const [baseTitle, category, industry, description] = concept;
      const style = styles[(index + round * 2) % styles.length];
      const motion = motions[(index * 2 + round) % motions.length];
      const stack = stacks[(index + round) % stacks.length];
      const level = round < 2 ? 'Esencial' : round < 5 ? 'Avanzado' : 'Experimental';
      const suffixes = ['Core','Flow','Studio','Motion','Canvas','XR'];
      const title = round === 0 ? baseTitle : `${baseTitle} ${suffixes[round]}`;
      const id = `m404-${String(index + round * concepts.length + 1).padStart(3,'0')}`;
      items.push({
        id,title,category,industry,description,style,motion,stack,level,paletteIndex:(index + round) % palettes.length,
        featured: (index + round) % 7 === 0 || round === 0,
        created: 180 - (index + round * concepts.length),
        prompt: buildPrompt({title,category,industry,description,style,motion,stack,level}),
        checklist: checkItems
      });
    });
  }
  return items;
}

const basePrompts = createCatalog();
let stateRecoveryNotice = false;
let storageAvailable = true;

function freshDefaultState() {
  return {version:CATALOG_VERSION,favorites:[],customPrompts:[],theme:'dark'};
}
function safeString(value, fallback='', maxLength=200) {
  return typeof value === 'string' ? value.trim().slice(0,maxLength) || fallback : fallback;
}
function normalizeChecklist(value) {
  if (!Array.isArray(value)) return [...checkItems];
  const safe=value.filter(item=>typeof item==='string').map(item=>item.trim().slice(0,500)).filter(Boolean).slice(0,20);
  return safe.length ? safe : [...checkItems];
}
function normalizeCustomPrompts(value) {
  if (!Array.isArray(value)) return [];
  const usedIds=new Set(basePrompts.map(item=>item.id));
  return value.slice(0,MAX_CUSTOM_PROMPTS).flatMap((item,index)=>{
    if (!item || typeof item !== 'object') return [];
    const title=safeString(item.title,'',100); const prompt=safeString(item.prompt,'',MAX_PROMPT_LENGTH);
    if (!title || !prompt) return [];
    let id=safeString(item.id,'',120);
    if (!/^custom-[a-zA-Z0-9._:-]+$/.test(id) || usedIds.has(id)) id=`custom-import-${Date.now()}-${index}`;
    usedIds.add(id);
    const created=Number(item.created);
    return [{
      id,title,prompt,custom:true,
      category:categories.includes(item.category)&&item.category!=='Todos'?item.category:'Aplicación',
      industry:safeString(item.industry,'Tecnología',80),
      description:safeString(item.description,'Prompt personalizado importado.',300),
      style:styles.includes(item.style)?item.style:styles[0],
      motion:motions.includes(item.motion)?item.motion:motions[0],
      stack:stacks.includes(item.stack)?item.stack:stacks[0],
      level:'Personalizado',featured:Boolean(item.featured),
      created:Number.isFinite(created)&&created>0?Math.min(created,Number.MAX_SAFE_INTEGER):Date.now(),
      paletteIndex:Number.isInteger(item.paletteIndex)?Math.max(0,Math.min(palettes.length-1,item.paletteIndex)):0,
      checklist:normalizeChecklist(item.checklist)
    }];
  });
}
function normalizeState(value) {
  if (!value || typeof value !== 'object' || value.version !== CATALOG_VERSION) return freshDefaultState();
  const customPrompts=normalizeCustomPrompts(value.customPrompts);
  const validIds=new Set([...basePrompts.map(item=>item.id),...customPrompts.map(item=>item.id)]);
  const favorites=Array.isArray(value.favorites)?[...new Set(value.favorites.filter(id=>typeof id==='string'&&validIds.has(id)).slice(0,1000))]:[];
  return {version:CATALOG_VERSION,favorites,customPrompts,theme:value.theme==='light'?'light':'dark'};
}
function loadState() {
  let raw;
  try { raw=localStorage.getItem(STORAGE_KEY); }
  catch { storageAvailable=false; stateRecoveryNotice=true; return freshDefaultState(); }
  if(!raw)return freshDefaultState();
  try {
    const parsed=JSON.parse(raw); const normalized=normalizeState(parsed);
    const validShape=parsed&&parsed.version===CATALOG_VERSION&&Array.isArray(parsed.favorites)&&Array.isArray(parsed.customPrompts)&&['dark','light'].includes(parsed.theme);
    if(!validShape||normalized.customPrompts.length!==parsed.customPrompts.length||normalized.favorites.length!==new Set(parsed.favorites.filter(id=>typeof id==='string')).size)stateRecoveryNotice=true;
    return normalized;
  } catch {
    stateRecoveryNotice=true; try{localStorage.removeItem(STORAGE_KEY);}catch{storageAvailable=false;} return freshDefaultState();
  }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(persisted)); storageAvailable=true; return true; }
  catch { storageAvailable=false; return false; }
}

let persisted = loadState();
let state = {
  query:'',category:'Todos',stack:'all',level:'all',sort:'featured',favoritesOnly:false,visible:PAGE_SIZE,
  selectedId:null,generatedText:'',generatedMeta:null
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const els = {
  promptCount:$('#promptCount'), grid:$('#promptGrid'), results:$('#resultsCount'), activeFilter:$('#activeFilterText'),
  empty:$('#emptyState'), loadMore:$('#loadMoreButton'), categoryFilters:$('#categoryFilters'), search:$('#searchInput'),
  stack:$('#stackFilter'), level:$('#levelFilter'), sort:$('#sortFilter'), favToggle:$('#favoritesToggle'), favCount:$('#favoriteCount'),
  dialog:$('#promptDialog'), dialogTitle:$('#dialogTitle'), dialogDescription:$('#dialogDescription'), dialogPreview:$('#dialogPreview'),
  dialogBadges:$('#dialogBadges'), dialogPrompt:$('#dialogPrompt'), dialogChecklist:$('#dialogChecklist'), dialogFavorite:$('#dialogFavorite'),
  generatedPanel:$('#generatedPanel'), generatedPrompt:$('#generatedPrompt'), generatedTitle:$('#generatedTitle'), generatedMeta:$('#generatedMeta'),
  infoDialog:$('#infoDialog'), infoEyebrow:$('#infoDialogEyebrow'), infoTitle:$('#infoDialogTitle'), infoBody:$('#infoDialogBody'),
  themeColor:$('#themeColorMeta'), toast:$('#toastRegion')
};

function allPrompts() { return [...persisted.customPrompts,...basePrompts]; }
function escapeHTML(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function slugify(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60) || 'prompt-motion-404'; }
function isFavorite(id) { return persisted.favorites.includes(id); }
function toggleFavorite(id) {
  if (!id || !findPrompt(id)) return;
  const activeAction=document.activeElement?.dataset?.action;
  const activeCardId=document.activeElement?.closest?.('[data-id]')?.dataset?.id;
  const adding=!isFavorite(id);
  if (adding) persisted.favorites.unshift(id);
  else persisted.favorites=persisted.favorites.filter(item=>item!==id);
  const saved=saveState(); render(); updateDialogFavorite();
  if(activeCardId&&activeAction){
    requestAnimationFrame(()=>{
      const replacement=els.grid.querySelector(`[data-id="${CSS.escape(activeCardId)}"] [data-action="${CSS.escape(activeAction)}"]`);
      (replacement||els.favToggle).focus();
    });
  }
  toast(saved?(adding?'Guardado en favoritos.':'Eliminado de favoritos.'):'Cambio aplicado solo durante esta sesión: el almacenamiento no está disponible.');
}
function toast(message) {
  const item = document.createElement('div'); item.className='toast'; item.textContent=message; els.toast.append(item);
  setTimeout(()=>item.remove(),2600);
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('Prompt copiado al portapapeles.'); }
  catch {
    const area=document.createElement('textarea'); area.value=text; area.className='clipboard-proxy'; document.body.append(area); area.select();
    let ok=false;
    try { ok=Boolean(document.execCommand?.('copy')); }
    catch { ok=false; }
    area.remove(); toast(ok?'Prompt copiado.':'No se pudo copiar.');
  }
}

function paletteClass(prompt) { const index = Number.isInteger(prompt.paletteIndex) ? prompt.paletteIndex : 0; return `palette-${Math.max(0, Math.min(9, index))}`; }
function previewImageFor(prompt) {
  return previewImages[prompt.industry] || fallbackPreviewImages[Math.abs(Number(prompt.paletteIndex)||0) % fallbackPreviewImages.length];
}
function makePreview(prompt, large=false) {
  const src=previewImageFor(prompt);
  return `<img class="example-image" src="${escapeHTML(src)}" alt="Ejemplo visual realista para ${escapeHTML(prompt.title)}" width="720" height="420" loading="${large?'eager':'lazy'}" decoding="async"><div class="preview-overlay" aria-hidden="true"></div><div class="preview-caption"><small>${escapeHTML(prompt.industry)}</small><strong>${escapeHTML(prompt.title)}</strong></div>`;
}

function promptCard(prompt) {
  const favorite = isFavorite(prompt.id);
  return `<article class="prompt-card" data-id="${escapeHTML(prompt.id)}">
    <div class="card-preview ${paletteClass(prompt)}">
      ${makePreview(prompt)}
      <div class="card-top-actions">
        <button class="card-icon-button ${favorite?'favorite':''}" type="button" data-action="favorite" aria-label="${favorite?'Quitar de':'Añadir a'} favoritos" aria-pressed="${favorite}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 20.7-1.45-1.32C5.4 14.7 2 11.62 2 7.85 2 4.77 4.42 2.35 7.5 2.35c1.74 0 3.41.81 4.5 2.09a6.02 6.02 0 0 1 4.5-2.09c3.08 0 5.5 2.42 5.5 5.5 0 3.77-3.4 6.85-8.55 11.54L12 20.7Z"/></svg></button>
        <button class="card-icon-button" type="button" data-action="copy" aria-label="Copiar prompt"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
      </div>
    </div>
    <div class="card-content"><div class="card-meta"><span>${escapeHTML(prompt.category)}</span><span>·</span><span>${escapeHTML(prompt.level)}</span></div><h3>${escapeHTML(prompt.title)}</h3><p>${escapeHTML(prompt.description)}</p><div class="card-footer"><div class="tech-tags"><span>${escapeHTML(prompt.stack.split(' + ')[0])}</span><span>${escapeHTML(prompt.motion.split(' ')[0])}</span></div><button class="open-prompt" type="button" data-action="open" aria-label="Abrir ${escapeHTML(prompt.title)}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div></div>
  </article>`;
}

function getFilteredPrompts() {
  const query = state.query.trim().toLocaleLowerCase('es');
  let list = allPrompts().filter(prompt => {
    const haystack = [prompt.title,prompt.category,prompt.industry,prompt.description,prompt.style,prompt.motion,prompt.stack,prompt.level].join(' ').toLocaleLowerCase('es');
    return (!query || haystack.includes(query)) &&
      (state.category === 'Todos' || prompt.category === state.category) &&
      (state.stack === 'all' || prompt.stack === state.stack) &&
      (state.level === 'all' || prompt.level === state.level) &&
      (!state.favoritesOnly || isFavorite(prompt.id));
  });
  if (state.sort === 'az') list.sort((a,b)=>a.title.localeCompare(b.title,'es'));
  if (state.sort === 'newest') list.sort((a,b)=>(b.created||999)-(a.created||999));
  if (state.sort === 'featured') list.sort((a,b)=>Number(b.featured)-Number(a.featured) || (b.created||0)-(a.created||0));
  return list;
}

function renderFilters() {
  els.categoryFilters.innerHTML = categories.map(cat=>`<button class="filter-chip" type="button" data-category="${escapeHTML(cat)}" aria-pressed="${state.category===cat}">${escapeHTML(cat)}</button>`).join('');
  els.stack.innerHTML = '<option value="all">Todos</option>' + stacks.map(s=>`<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join('');
  els.stack.value=state.stack;
}
function render() {
  const list=getFilteredPrompts(); const visible=list.slice(0,state.visible);
  els.grid.innerHTML=visible.map(promptCard).join('');
  els.results.textContent=`${list.length} ${list.length===1?'resultado':'resultados'}`;
  els.activeFilter.textContent=state.favoritesOnly?'Mostrando solo favoritos':'';
  els.empty.hidden=list.length>0; els.grid.hidden=list.length===0;
  els.loadMore.parentElement.hidden=list.length<=state.visible;
  els.favCount.textContent=persisted.favorites.length;
  els.favToggle.setAttribute('aria-pressed',String(state.favoritesOnly));
  els.promptCount.textContent=allPrompts().length;
  $$('[data-category]',els.categoryFilters).forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.category===state.category)));
}
function resetFilters() {
  state={...state,query:'',category:'Todos',stack:'all',level:'all',sort:'featured',favoritesOnly:false,visible:PAGE_SIZE};
  els.search.value=''; els.stack.value='all'; els.level.value='all'; els.sort.value='featured'; render();
}
function findPrompt(id) { return allPrompts().find(item=>item.id===id); }
function openPrompt(id) {
  const prompt=findPrompt(id); if(!prompt)return; state.selectedId=id;
  els.dialogTitle.textContent=prompt.title; els.dialogDescription.textContent=prompt.description; els.dialogPrompt.textContent=prompt.prompt;
  els.dialogBadges.innerHTML=[prompt.category,prompt.industry,prompt.stack,prompt.level].map(item=>`<span>${escapeHTML(item)}</span>`).join('');
  els.dialogChecklist.innerHTML=prompt.checklist.map(item=>`<li>${escapeHTML(item)}</li>`).join('');
  els.dialogPreview.className=`dialog-preview ${paletteClass(prompt)}`; els.dialogPreview.innerHTML=makePreview(prompt,true);
  showPromptTab(); updateDialogFavorite(); els.dialog.showModal();
}
function updateDialogFavorite() {
  if(!state.selectedId)return; const favorite=isFavorite(state.selectedId); els.dialogFavorite.textContent=favorite?'Quitar de favoritos':'Guardar favorito'; els.dialogFavorite.setAttribute('aria-pressed',String(favorite));
}
function showPromptTab(focus=false) {
  $('#tabPrompt').hidden=false; $('#tabChecklist').hidden=true;
  $('#promptTab').setAttribute('aria-selected','true'); $('#promptTab').tabIndex=0;
  $('#checklistTab').setAttribute('aria-selected','false'); $('#checklistTab').tabIndex=-1;
  if(focus)$('#promptTab').focus();
}
function showChecklistTab(focus=false) {
  $('#tabPrompt').hidden=true; $('#tabChecklist').hidden=false;
  $('#promptTab').setAttribute('aria-selected','false'); $('#promptTab').tabIndex=-1;
  $('#checklistTab').setAttribute('aria-selected','true'); $('#checklistTab').tabIndex=0;
  if(focus)$('#checklistTab').focus();
}
function handleTabKeydown(event) {
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  if(event.key==='Home')showPromptTab(true);
  else if(event.key==='End')showChecklistTab(true);
  else if(event.currentTarget.id==='promptTab')showChecklistTab(true);
  else showPromptTab(true);
}

function fillGeneratorOptions() {
  $('#industrySelect').innerHTML=industries.map(v=>`<option>${escapeHTML(v)}</option>`).join('');
  $('#generatorStack').innerHTML=stacks.map(v=>`<option>${escapeHTML(v)}</option>`).join('');
  $('#styleSelect').innerHTML=styles.map(v=>`<option>${escapeHTML(v)}</option>`).join('');
  $('#motionSelect').innerHTML=motions.map(v=>`<option>${escapeHTML(v)}</option>`).join('');
}
function generateCustomPrompt(form) {
  const data=new FormData(form); const project=String(data.get('project')||'').trim();
  const type=String(data.get('type')); const industry=String(data.get('industry')); const stack=String(data.get('stack')); const style=String(data.get('style')); const motion=String(data.get('motion')); const context=String(data.get('context')||'').trim();
  const features=data.getAll('features').map(String);
  const featureText=features.length?features.map((item,i)=>`${i+1}. ${item}.`).join('\n'):'1. No se han definido funciones adicionales; propón solo las imprescindibles.';
  const text=`# ${project} — Prompt maestro Motion 404

Actúa como un equipo senior formado por Product Lead, dirección creativa, UX/UI, arquitectura frontend, accesibilidad, seguridad, rendimiento y QA.

## MISIÓN
Diseña, implementa, prueba y documenta una **${type.toLowerCase()}** para **${project}**, un proyecto del sector **${industry}**. Entrega un producto funcional, original y preparado para producción; no una maqueta estática ni una colección de recomendaciones.
${context?`\n## CONTEXTO DEL PROYECTO\n${context}\n`:''}
## CONTRATO TÉCNICO
- Stack: ${stack}.
- Dirección visual: ${style}.
- Sistema de movimiento: ${motion}.
- Arquitectura mantenible, sin dependencias innecesarias ni secretos.
- Compatible con móvil, escritorio y publicación en una subruta de GitHub Pages.
- Conserva una ruta de reversión y documenta decisiones relevantes.

## FUNCIONES
${featureText}

## EXPERIENCIA
- Explica la propuesta de valor en el primer viewport.
- Diseña una navegación clara, jerarquía tipográfica fuerte y llamadas a la acción inequívocas.
- Incluye estados vacío, carga, error, éxito, hover, focus y pressed donde apliquen.
- El movimiento debe aportar orientación y continuidad, nunca bloquear interacción.
- Evita patrones genéricos repetidos, texto de relleno y recursos sin licencia.

## ACCESIBILIDAD
- Semántica, landmarks, encabezados, nombres accesibles y foco visible.
- Uso completo con teclado y controles táctiles adecuados.
- Contraste suficiente, textos alternativos y mensajes de error asociados.
- Respeta prefers-reduced-motion y zoom al 200%.

## SEGURIDAD Y DATOS
- Valida entradas, URLs e importaciones.
- No uses innerHTML con contenido no confiable.
- Si persistes datos, define versión de esquema, recuperación ante corrupción, migración y exportación.
- Sin telemetría, cookies ni envío de datos salvo requisito explícito.

## RENDIMIENTO
- Presupuesto razonable de JavaScript, imágenes optimizadas y fuentes controladas.
- Evita CLS, tareas largas, listeners duplicados y animaciones de layout.
- Carga progresiva para 3D, vídeo o contenido pesado.

## LOOP ENGINEERING
Trabaja en ciclos: descubrir → priorizar → formular hipótesis → definir evidencia → aplicar cambio mínimo → probar → comprobar regresiones → intentar romper → decidir.
Usa los estados CONTINUAR, CORREGIR, REVERTIR, BLOQUEADO y FINALIZADO. No declares éxito sin evidencia.

## PRUEBAS OBLIGATORIAS
- Sintaxis, build, lint, typecheck y tests cuando existan.
- Todos los botones, enlaces, formularios, filtros, modales y persistencia.
- Ratón, teclado, táctil, redimensionado y movimiento reducido.
- Rutas, assets, manifest, Service Worker, modo offline y recarga bajo GitHub Pages.
- Consola sin errores ni promesas rechazadas.

## ENTREGA
1. Árbol de archivos.
2. Archivos completos modificados o creados.
3. Resumen de causas y decisiones.
4. Comandos exactos para ejecutar, probar y publicar.
5. Evidencias con: 🔎 Inspeccionado, ▶️ Ejecutado, 🧪 Probado, 🌐 Validado en destino, ⚠️ Parcial, ❌ Fallido, ⏳ Pendiente o 🚫 No aplicable.
6. Veredicto final: FINALIZADO, FINALIZADO CON LIMITACIONES, BLOQUEADO o FALLIDO.

No inventes resultados. Marca como “No verificado” todo lo que no hayas ejecutado realmente.`;
  return {project,type,industry,stack,style,motion,context,features,text};
}
function showGenerated(meta) {
  state.generatedText=meta.text; state.generatedMeta=meta; els.generatedTitle.textContent=meta.project; els.generatedPrompt.textContent=meta.text;
  els.generatedMeta.textContent=`${meta.stack} · ${meta.style} · ${meta.text.length.toLocaleString('es')} caracteres`;
  els.generatedPanel.hidden=false; els.generatedPanel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  els.generatedTitle.focus({preventScroll:true});
}
function saveGenerated() {
  if(!state.generatedMeta)return;
  if(persisted.customPrompts.some(item=>item.prompt===state.generatedText)){toast('Este prompt ya está guardado.');return;}
  const categoryMap={'Landing page':'Landing','Aplicación web':'Aplicación','Portfolio':'Portfolio','E-commerce':'E-commerce','Dashboard':'Dashboard','Editorial':'Editorial'};
  const item={id:`custom-${Date.now()}`,title:state.generatedMeta.project,category:categoryMap[state.generatedMeta.type]||'Aplicación',industry:state.generatedMeta.industry,description:`Prompt personalizado para ${state.generatedMeta.project}.`,style:state.generatedMeta.style,motion:state.generatedMeta.motion,stack:state.generatedMeta.stack,level:'Personalizado',paletteIndex:Math.floor(Math.random()*palettes.length),featured:true,created:Date.now(),prompt:state.generatedMeta.text,checklist:checkItems,custom:true};
  persisted.customPrompts.unshift(item); persisted.customPrompts=persisted.customPrompts.slice(0,MAX_CUSTOM_PROMPTS); persisted.favorites=[item.id,...persisted.favorites.filter(id=>id!==item.id)];
  const validIds=new Set([...basePrompts.map(prompt=>prompt.id),...persisted.customPrompts.map(prompt=>prompt.id)]);
  persisted.favorites=persisted.favorites.filter(id=>validIds.has(id));
  const saved=saveState(); render(); toast(saved?'Prompt guardado en tu biblioteca.':'Prompt añadido solo durante esta sesión: el almacenamiento no está disponible.');
}
function downloadText(filename,text,type='text/markdown') {
  const blob=new Blob([text],{type:`${type};charset=utf-8`}); const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download=filename; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportData() {
  const payload={app:'Motion 404',exportedAt:new Date().toISOString(),schemaVersion:CATALOG_VERSION,theme:persisted.theme,favorites:persisted.favorites,customPrompts:persisted.customPrompts};
  downloadText(`motion-404-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(payload,null,2),'application/json'); toast('Copia de seguridad exportada.');
}
function importData(file) {
  if(!file||file.size>MAX_IMPORT_BYTES){toast('Archivo no válido o demasiado grande.');return;}
  const reader=new FileReader();
  reader.onerror=()=>toast('No se pudo leer el archivo seleccionado.');
  reader.onload=()=>{
    try {
      const data=JSON.parse(String(reader.result));
      if(data.app!=='Motion 404'||data.schemaVersion!==CATALOG_VERSION||!Array.isArray(data.favorites)||!Array.isArray(data.customPrompts))throw new Error('schema');
      if((persisted.favorites.length||persisted.customPrompts.length)&&!window.confirm('La importación sustituirá tus favoritos y prompts personalizados actuales. ¿Continuar?')){toast('Importación cancelada.');return;}
      const next=normalizeState({version:CATALOG_VERSION,theme:['dark','light'].includes(data.theme)?data.theme:persisted.theme,favorites:data.favorites,customPrompts:data.customPrompts});
      persisted=next; applyTheme(persisted.theme,false); const saved=saveState(); render();
      toast(saved?'Datos importados correctamente.':'Datos importados solo para esta sesión: el almacenamiento no está disponible.');
    } catch {toast('El archivo no corresponde a una copia válida de Motion 404.');}
  };
  reader.readAsText(file);
}
function clearLocalData() {
  if(!window.confirm('Se borrarán favoritos, prompts personalizados y preferencias de este navegador. ¿Continuar?'))return;
  persisted=freshDefaultState(); state={...state,query:'',category:'Todos',stack:'all',level:'all',sort:'featured',favoritesOnly:false,visible:PAGE_SIZE,selectedId:null,generatedText:'',generatedMeta:null};
  let removed=true; try{localStorage.removeItem(STORAGE_KEY);storageAvailable=true;}catch{removed=false;storageAvailable=false;}
  $('#generatorForm').reset(); els.generatedPanel.hidden=true; applyTheme('dark',false); resetFilters();
  toast(removed?'Datos locales borrados.':'Los datos se han borrado de esta sesión, pero el navegador bloqueó el almacenamiento.');
}
function openInfo(type) {
  els.infoBody.replaceChildren();
  const addParagraph=text=>{const paragraph=document.createElement('p');paragraph.textContent=text;els.infoBody.append(paragraph);};
  if(type==='about'){
    els.infoEyebrow.textContent='Acerca de'; els.infoTitle.textContent='Motion 404';
    addParagraph('Biblioteca y laboratorio local de prompts para diseñar productos digitales con asistentes de IA. El catálogo es original y se genera dentro de la propia aplicación.');
    addParagraph('No está afiliada a MotionSites ni reutiliza sus prompts premium, marca o recursos visuales.');
  } else if(type==='privacy') {
    els.infoEyebrow.textContent='Privacidad'; els.infoTitle.textContent='Sin rastreo.';
    addParagraph('Motion 404 no necesita cuenta, backend, cookies de seguimiento ni telemetría. Favoritos, tema y prompts personalizados se guardan en localStorage.');
    const list=document.createElement('ul');
    ['Puedes exportar tus datos en JSON.','Puedes borrar todos los datos desde el pie de página.','La aplicación no envía el contenido de tus prompts.'].forEach(text=>{const item=document.createElement('li');item.textContent=text;list.append(item);});
    els.infoBody.append(list);
  } else {
    els.infoEyebrow.textContent='Documentación'; els.infoTitle.textContent='Uso de la versión portátil';
    addParagraph('Explora la biblioteca, genera prompts y exporta tus datos desde este único archivo. La instalación PWA y el modo offline con Service Worker requieren abrir la versión completa mediante el lanzador BAT o un servidor local.');
  }
  els.infoDialog.showModal();
}
function applyTheme(theme,persist=true) {
  const safeTheme=theme==='light'?'light':'dark'; persisted.theme=safeTheme; document.documentElement.dataset.theme=safeTheme;
  if(els.themeColor)els.themeColor.content=safeTheme==='dark'?'#07090d':'#f0eee9';
  $('#themeButton').setAttribute('aria-label',safeTheme==='dark'?'Activar tema claro':'Activar tema oscuro');
  if(persist&&!saveState())toast('Tema aplicado solo durante esta sesión: el almacenamiento no está disponible.');
}

renderFilters(); fillGeneratorOptions(); applyTheme(persisted.theme,false); render(); $('#year').textContent=new Date().getFullYear();
if(stateRecoveryNotice)setTimeout(()=>toast(storageAvailable?'Se recuperaron datos locales dañados o incompatibles.':'El almacenamiento local no está disponible; los cambios durarán solo esta sesión.'),0);

els.search.addEventListener('input',e=>{state.query=e.target.value;state.visible=PAGE_SIZE;render();});
els.stack.addEventListener('change',e=>{state.stack=e.target.value;state.visible=PAGE_SIZE;render();});
els.level.addEventListener('change',e=>{state.level=e.target.value;state.visible=PAGE_SIZE;render();});
els.sort.addEventListener('change',e=>{state.sort=e.target.value;render();});
els.categoryFilters.addEventListener('click',e=>{const button=e.target.closest('[data-category]');if(!button)return;state.category=button.dataset.category;state.visible=PAGE_SIZE;render();});
els.grid.addEventListener('click',e=>{const button=e.target.closest('[data-action]');if(!button)return;const card=button.closest('[data-id]');const prompt=findPrompt(card?.dataset.id);if(!prompt)return;if(button.dataset.action==='favorite')toggleFavorite(prompt.id);if(button.dataset.action==='copy')copyText(prompt.prompt);if(button.dataset.action==='open')openPrompt(prompt.id);});
els.favToggle.addEventListener('click',()=>{state.favoritesOnly=!state.favoritesOnly;state.visible=PAGE_SIZE;render();});
$('#randomButton').addEventListener('click',()=>{const list=getFilteredPrompts();if(!list.length){toast('No hay prompts con estos filtros.');return;}openPrompt(list[Math.floor(Math.random()*list.length)].id);});
$('#clearFilters').addEventListener('click',resetFilters);$('#emptyReset').addEventListener('click',resetFilters);els.loadMore.addEventListener('click',()=>{state.visible+=PAGE_SIZE;render();});
$('#promptTab').addEventListener('click',()=>showPromptTab());$('#checklistTab').addEventListener('click',()=>showChecklistTab());$('#promptTab').addEventListener('keydown',handleTabKeydown);$('#checklistTab').addEventListener('keydown',handleTabKeydown);els.dialogFavorite.addEventListener('click',()=>toggleFavorite(state.selectedId));$('#dialogCopy').addEventListener('click',()=>{const prompt=findPrompt(state.selectedId);if(prompt)copyText(prompt.prompt);});
$$('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();}));
$('#generatorForm').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;const projectInput=form.elements.project;projectInput.setCustomValidity(projectInput.value.trim()?'':'Escribe un nombre de proyecto que no esté vacío.');if(!form.reportValidity())return;projectInput.setCustomValidity('');showGenerated(generateCustomPrompt(form));});
$('#generatorForm').elements.project.addEventListener('input',e=>e.currentTarget.setCustomValidity(''));
$('#resetGenerator').addEventListener('click',()=>{setTimeout(()=>{els.generatedPanel.hidden=true;state.generatedText='';state.generatedMeta=null;},0);});
$('#copyGenerated').addEventListener('click',()=>state.generatedText&&copyText(state.generatedText));$('#saveGenerated').addEventListener('click',saveGenerated);$('#downloadGenerated').addEventListener('click',()=>{if(state.generatedMeta)downloadText(`${slugify(state.generatedMeta.project)}-prompt.md`,state.generatedText);});
$('#exportDataButton').addEventListener('click',exportData);$('#importDataButton').addEventListener('click',()=>$('#importFileInput').click());$('#importFileInput').addEventListener('change',e=>{importData(e.target.files?.[0]);e.target.value='';});$('#clearDataButton').addEventListener('click',clearLocalData);
$('#aboutButton').addEventListener('click',()=>openInfo('about'));$('#privacyButton').addEventListener('click',()=>openInfo('privacy'));$('#portableDocsButton')?.addEventListener('click',()=>openInfo('docs'));$('#themeButton').addEventListener('click',()=>applyTheme(persisted.theme==='dark'?'light':'dark'));

document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();els.search.focus();}if(e.key==='Escape'&&document.activeElement===els.search){els.search.blur();}});

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});
  $$('.reveal').forEach(el=>observer.observe(el));
} else {
  $$('.reveal').forEach(el=>el.classList.add('is-visible'));
}

let deferredInstall=null; const installButton=$('#installButton');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;installButton.hidden=false;});
installButton.addEventListener('click',async()=>{if(!deferredInstall)return;try{deferredInstall.prompt();await deferredInstall.userChoice;}catch{toast('No se pudo iniciar la instalación.');}finally{deferredInstall=null;installButton.hidden=true;}});
window.addEventListener('appinstalled',()=>toast('Motion 404 se ha instalado.'));

if ('serviceWorker' in navigator && ['http:','https:'].includes(location.protocol)) {
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>console.warn('Service Worker no disponible en este contexto.')));
}
