/* Motion-404 v2.0.2 functional core, ported from owner's repository.
 * Pure evaluation, preset synthesis and timeline planning; DOM runtime/UI remains separate.
 * Source: https://github.com/ivan7800/Motion-404/blob/main/motion-v2.0.2.js
 * No legacy storage keys are written by this adapter.
 */
(function(global){'use strict';
const dna=['cinematic','minimal','kinetic','editorial','brutal','spatial'];
const concepts=[
 ['Atlas Habitat','Arquitectura','Arquitectura','Estudio de arquitectura con proyectos inmersivos y planos editoriales.'],
 ['Neural Atlas','Landing','IA y software','Producto IA que traduce datos complejos a una narrativa visual clara.'],
 ['Mesa Nómada','Restauración','Restauración','Restaurante de cocina viajera con carta visual y reservas.'],
 ['Nocturne Records','Editorial','Música','Sello independiente con lanzamientos, artistas y escucha editorial.'],
 ['Void Runner','Gaming','Videojuegos','Videojuego sci-fi con universo narrativo y llamada a la acción.'],
 ['Asteria Journeys','Landing','Viajes','Viajes de autor con destinos inmersivos y storytelling fotográfico.'],
 ['Lumen Capital','Dashboard','Finanzas','Panel financiero sobrio con métricas y escenarios accionables.'],
 ['Pulse Studio','Aplicación','Salud y bienestar','App de hábitos y entrenamiento con progreso y rutinas.'],
 ['Forma Academy','Aplicación','Educación','Plataforma educativa con itinerarios y seguimiento.'],
 ['Nexo Living','E-commerce','Inmobiliaria','Catálogo inmobiliario premium con filtros y visitas.'],
 ['Grain & Light','Portfolio','Fotografía','Portfolio fotográfico con ritmo editorial y series.'],
 ['Torque Lab','Landing','Automoción','Laboratorio de movilidad con lenguaje industrial.'],
 ['Archivo Vivo','Editorial','Cultura','Archivo cultural con exposiciones y cronologías.'],
 ['Serein Objects','E-commerce','E-commerce','Tienda de objetos de diseño con fotografía protagonista.'],
 ['Northbound','Landing','Consultoría','Consultora estratégica con tesis claras y casos.'],
 ['Kinetic Club','Aplicación','Deporte','App deportiva con retos, equipos y resultados.'],
 ['Terra Loop','Landing','Sostenibilidad','Iniciativa climática con impacto medible.'],
 ['Mono Studio','Portfolio','Arquitectura','Portfolio minimalista de procesos, maquetas y obra.'],
 ['Signal OS','Aplicación','IA y software','Productividad con comandos y panel modular.'],
 ['Fire & Ferment','Restauración','Restauración','Experiencia gastronómica de fuego, fermentos y origen.'],
 ['Eclipse Festival','Landing','Música','Festival con programación, artistas y entradas.'],
 ['Arcadia Bestiary','Gaming','Videojuegos','Enciclopedia fantástica con criaturas, mapas y lore.'],
 ['Drift House','Experiencia 3D','Viajes','Refugio remoto presentado como recorrido 3D contemplativo.'],
 ['Flux Ledger','Dashboard','Finanzas','Dashboard fintech con cartera y simulación de riesgo.'],
 ['Still Mind','Aplicación','Salud y bienestar','App de respiración y descanso con estadísticas discretas.'],
 ['Orbit Learn','Aplicación','Educación','Aprendizaje espacial basado en mapas de conocimiento.'],
 ['Casa Clara','Arquitectura','Inmobiliaria','Promoción residencial mediterránea con planos.'],
 ['Rare Frames','Portfolio','Fotografía','Portfolio cinematográfico con proyectos y making-of.'],
 ['Volta EV','Experiencia 3D','Automoción','Configurador conceptual de vehículo eléctrico.'],
 ['Museo 404','Editorial','Cultura','Museo digital experimental con salas temáticas.']
];
const suffixes=['Core','Flow','Studio','Motion','Canvas','XR'];
const visuals=['Brutalismo editorial','Futurismo orgánico','Minimalismo cinético','Neo-retro digital','Lujo monocromo','Tecnología translúcida','Collage tipográfico','Industrial táctil','Gradiente espacial','Editorial mediterráneo'];
const stacks=['HTML + CSS + JS','React + CSS Modules','React + Tailwind','React + Framer Motion','React + GSAP','Three.js + GSAP'];
const motions=['Microinteracciones suaves','Scroll cinematográfico','Parallax multicapa','Tipografía cinética','Transiciones de máscara','Objetos 3D reactivos','Cursor magnético','Revelado secuencial'];
const profile={
 cinematic:{label:'Cinematic',easing:'cubic-bezier(.22,.61,.36,1)',duration:'520–900 ms',stagger:'70–120 ms',character:'Narrativo, inmersivo y deliberado',enter:'Máscara + profundidad leve',hover:'Microdesplazamiento + luz',scroll:'Secciones con continuidad y progresión',avoid:'Parallax simultáneo en demasiadas capas'},
 minimal:{label:'Minimal',easing:'cubic-bezier(.2,.8,.2,1)',duration:'180–360 ms',stagger:'30–60 ms',character:'Preciso, silencioso y funcional',enter:'Opacity + translate 8–16 px',hover:'Contraste, escala ≤1.02',scroll:'Revelados discretos',avoid:'Decoración cinética sin función'},
 kinetic:{label:'Kinetic',easing:'cubic-bezier(.16,1,.3,1)',duration:'240–520 ms',stagger:'24–48 ms',character:'Energético, tipográfico y rítmico',enter:'Split/reveal tipográfico',hover:'Respuesta elástica contenida',scroll:'Ritmo marcado por copy y CTA',avoid:'Animar párrafos largos carácter a carácter'},
 editorial:{label:'Editorial',easing:'cubic-bezier(.25,.46,.45,.94)',duration:'320–620 ms',stagger:'50–90 ms',character:'Jerárquico, cultural y legible',enter:'Revelado por bloques',hover:'Subrayado, crop o shift',scroll:'Capítulos y cambios de escala',avoid:'Romper lectura con scroll hijacking'},
 brutal:{label:'Brutalist',easing:'steps(1,end)',duration:'90–220 ms',stagger:'0–30 ms',character:'Directo, gráfico y abrupto',enter:'Cuts y cambios de estado',hover:'Inversión, borde, desplazamiento seco',scroll:'Cambios de bloque explícitos',avoid:'Mezclar brutalismo con easing flotante continuo'},
 spatial:{label:'Spatial',easing:'cubic-bezier(.19,1,.22,1)',duration:'450–850 ms',stagger:'60–110 ms',character:'Profundo, físico y reactivo',enter:'Z-depth + scale controlado',hover:'Tilt ≤4° + parallax local',scroll:'Cámara o capas con límite',avoid:'3D continuo en móvil sin fallback'}
};
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
function presets(){const out=[];for(let round=0;round<6;round++){concepts.forEach((c,i)=>{const[base,category,industry,description]=c;out.push({id:`m404-${String(round*concepts.length+i+1).padStart(3,'0')}`,title:round?`${base} ${suffixes[round]}`:base,category,industry,description,dna:dna[(i+round)%dna.length],intensity:1+((i+round*2)%5),pace:['calm','balanced','fast'][(i+round)%3],depth:['flat','layered','spatial'][(i+round*2)%3],visual:visuals[(i+round*2)%visuals.length],stack:stacks[(i+round)%stacks.length],motion:motions[(i*2+round)%motions.length],accentIndex:(i+round)%6});});}return out;}
function riskFrom(d){let perf=d.intensity*8,cog=d.intensity*7,a11y=d.intensity*4;if(d.depth==='layered')perf+=10;if(d.depth==='spatial'){perf+=26;cog+=8;a11y+=8;}if(d.stack.includes('Three.js'))perf+=18;if(d.features.includes('3d-reactive'))perf+=22;if(d.features.includes('cursor-effects')){perf+=6;a11y+=12;}if(d.features.includes('kinetic-type'))cog+=16;if(d.features.includes('scroll-story'))cog+=7;if(d.features.length>=5){perf+=10;cog+=12;}if(d.dna==='cinematic')perf+=6;if(d.dna==='spatial')perf+=10;if(d.dna==='brutal')a11y+=5;if(d.pace==='fast'){cog+=11;a11y+=5;}if(d.pace==='calm')cog-=5;perf=clamp(perf,4,100);cog=clamp(cog,4,100);a11y=clamp(a11y,4,100);return{perf,cog,a11y,total:Math.round(perf*.42+cog*.34+a11y*.24)};}
function recommendations(d,r){const list=[];if(r.perf>60)list.push('Reduce efectos simultáneos y prioriza transform/opacity; pausa escenas fuera del viewport.');if(d.depth==='spatial')list.push('Define fallback 2D para móvil, limita DPR y suspende 3D con la pestaña oculta.');if(d.features.includes('cursor-effects'))list.push('Desactiva cursor effects en touch y no los uses como único feedback.');if(d.features.includes('kinetic-type'))list.push('Reserva tipografía cinética a titulares cortos; el cuerpo debe permanecer estable.');if(d.intensity>=4)list.push('Limita a una animación protagonista por viewport.');if(d.pace==='fast')list.push('Mantén tiempos de lectura y devuelve control antes de encadenar transiciones.');if(!list.length)list.push('Configuración contenida: una animación protagonista y microinteracciones para feedback.');list.push('Implementa siempre prefers-reduced-motion con una experiencia equivalente.');return list.slice(0,5);}
function paceMs(pace,intensity){const base=pace==='calm'?620:pace==='fast'?280:420;return Math.round(base*(1+(intensity-3)*.07));}
function buildTimeline(d){const unit=paceMs(d.pace,d.intensity),items=[];let t=0;const push=(name,detail,duration)=>{items.push({time:t,name,detail,duration});t+=duration;};push('Page shell','Fondo, navegación y layout crítico visibles',Math.round(unit*.35));push('Hero eyebrow','Opacity + translate corto',Math.round(unit*.45));push('Hero headline',profile[d.dna]?.enter||profile.cinematic.enter,Math.round(unit*.85));push('Hero support','Texto y CTA con stagger moderado',Math.round(unit*.55));if(d.features.includes('scroll-story'))push('Scroll chapter 01','Revelado al 18–42% del viewport',Math.round(unit*1.2));if(d.features.includes('kinetic-type'))push('Kinetic headline','Sólo titular; detener al salir del viewport',Math.round(unit*.8));if(d.depth!=='flat')push('Depth layer','Parallax local ≤ 10–18 px; sin afectar lectura',Math.round(unit*1.05));if(d.features.includes('3d-reactive'))push('3D scene','Entrada progresiva; fallback y pause offscreen',Math.round(unit*1.4));push('Primary CTA feedback','Pressed 90–140 ms + confirmación visible',130);push('Page transition','Salida no bloqueante y restauración de foco',Math.round(unit*.75));return items;}
function buildQa(d,r){const checks=[];const add=(status,title,detail)=>checks.push({status,title,detail});add('pass','Reduced motion obligatorio','La spec incluye una ruta equivalente para prefers-reduced-motion.');add(d.intensity<=3?'pass':'warn','Intensidad global',d.intensity<=3?'Dentro del rango recomendado.':'Reserva intensidad alta para momentos protagonistas.');add(r.perf<60?'pass':'warn','Presupuesto de animación',r.perf<60?'Riesgo técnico contenido.':'Reduce 3D, filtros, capas simultáneas o duración.');add(d.depth==='spatial'||d.features.includes('3d-reactive')?'warn':'pass','Fallback móvil',d.depth==='spatial'||d.features.includes('3d-reactive')?'Obligatorio: versión 2D/estática para dispositivos limitados.':'No se detecta dependencia fuerte de 3D.');add(d.features.includes('cursor-effects')?'warn':'pass','Entrada táctil',d.features.includes('cursor-effects')?'Desactiva efectos de cursor en touch y teclado.':'No hay comportamiento dependiente del puntero.');add(d.features.includes('kinetic-type')?'warn':'pass','Legibilidad tipográfica',d.features.includes('kinetic-type')?'No animes párrafos, formularios ni lectura sostenida.':'La tipografía puede permanecer estable.');add('pass','Propiedades de bajo coste','Priorizar transform y opacity.');add('pass','Control del usuario','Sin scroll hijacking; focus, Escape y pressed disponibles.');add('pass','Objetivo de fluidez','Diseñar para 60 fps y degradar efectos si el dispositivo no sostiene el presupuesto.');const warnings=checks.filter(x=>x.status==='warn').length;return{checks,score:Math.round(clamp(100-warnings*7-Math.max(0,r.total-45)*.35,55,100))};}

function cleanInput(raw){const d=raw&&typeof raw==='object'?raw:{};
 const features=['page-transitions','scroll-story','microinteractions','kinetic-type','cursor-effects','3d-reactive'];
 const allowed=['Landing page','Aplicación web','Portfolio','E-commerce','Dashboard','Editorial','Experiencia 3D'];
 return {project:String(d.project||'Nuevo sistema').trim().slice(0,80),experience:allowed.includes(d.experience)?d.experience:'Aplicación web',industry:String(d.industry||'IA y software').slice(0,70),stack:stacks.includes(d.stack)?d.stack:stacks[0],visual:visuals.includes(d.visual)?d.visual:visuals[1],dna:dna.includes(d.dna)?d.dna:'minimal',pace:['calm','balanced','fast'].includes(d.pace)?d.pace:'balanced',depth:['flat','layered','spatial'].includes(d.depth)?d.depth:'layered',intensity:clamp(Math.round(Number(d.intensity)||3),1,5),features:Array.isArray(d.features)?[...new Set(d.features.filter(v=>features.includes(v)))]:[],context:String(d.context||'').slice(0,600)};
}
function buildSpec(d,p,r,recs,timeline,qa){const features=d.features.length?d.features.join(', '):'microinteracciones esenciales';return `# ${d.project} — Motion Design System

Motion 404 v2.0.2 · integrado en Ultimate Studio

## 1. MOTION DNA
- Perfil: ${p.label}
- Carácter: ${p.character}
- Intensidad: ${d.intensity}/5
- Ritmo: ${d.pace}
- Profundidad: ${d.depth}
- Easing principal: ${p.easing}
- Duración base: ${p.duration}
- Stagger: ${p.stagger}
- Entrada característica: ${p.enter}
- Hover/focus: ${p.hover}
- Scroll: ${p.scroll}
- Evitar: ${p.avoid}

## 2. CONTEXTO DE PRODUCTO
- Experiencia: ${d.experience}
- Sector: ${d.industry}
- Stack: ${d.stack}
- Dirección visual: ${d.visual}
- Capacidades: ${features}
${d.context?`- Contexto adicional: ${d.context}
`:''}
## 3. TOKENS DE MOVIMIENTO
\`\`\`css
:root {
  --motion-fast: 140ms;
  --motion-base: ${paceMs(d.pace,d.intensity)}ms;
  --motion-slow: ${Math.round(paceMs(d.pace,d.intensity)*1.65)}ms;
  --motion-ease: ${p.easing};
  --motion-distance: ${8+d.intensity*3}px;
  --motion-scale: ${d.intensity>=4?'1.035':'1.02'};
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; } }
\`\`\`

## 4. REGLAS DEL SISTEMA
1. Máximo una animación protagonista por viewport.
2. Microinteracciones sólo para affordance, estado o continuidad.
3. Priorizar transform y opacity.
4. No bloquear click, teclado, lectura ni scroll.
5. Las animaciones decorativas pueden eliminarse sin perder información.
6. prefers-reduced-motion recibe una experiencia equivalente.
7. En móvil se reduce distancia, profundidad, blur y elementos simultáneos.
8. Escenas pesadas se pausan fuera del viewport y con pestaña oculta.

## 5. COMPONENT CONTRACT
### Navigation
- Entrada: ${p.enter}.
- Cambio de estado: ≤ 220 ms.
- Focus visible independiente del movimiento.

### Hero
- Secuencia: eyebrow → headline → supporting copy → CTA.
- Stagger recomendado: ${p.stagger}.
- CTA interactuable antes de finalizar decoración.

### Cards / modules
- Hover: ${p.hover}.
- Touch: pressed/selected en lugar de hover.
- Sin mover layout al hacer hover.

### Page transitions
- Máximo recomendado: ${d.pace==='calm'?'650':'450'} ms.
- Restaurar foco e historial.

## 6. TIMELINE BASE
${timeline.map((x,i)=>`${i+1}. T+${x.time}ms — ${x.name}: ${x.detail} (${x.duration}ms)`).join('\n')}

## 7. PERFORMANCE BUDGET
- Riesgo estimado: ${r.total}/100.
- GPU/CPU: ${r.perf}/100.
- Carga cognitiva: ${r.cog}/100.
- Riesgo accesibilidad: ${r.a11y}/100.
- Objetivo: 60 fps; evitar long tasks durante interacción.
- Evitar layout thrashing y listeners de scroll sin rAF/IntersectionObserver.
- 3D/vídeo: carga progresiva, DPR limitado y fallback estático.

## 8. ACCESSIBILITY CONTRACT
- prefers-reduced-motion obligatorio.
- Ninguna información depende sólo de movimiento.
- Focus visible persistente.
- Compatible con zoom 200%.
- Sin parpadeos rápidos ni ciclos infinitos de alta atención.

## 9. ANTI-OVERANIMATION
${recs.map((x,i)=>`${i+1}. ${x}`).join('\n')}

## 10. QA GATE — ${qa.score}/100
${qa.checks.map(x=>`- ${x.status==='pass'?'PASS':'REVIEW'} — ${x.title}: ${x.detail}`).join('\n')}

## 11. DEFINITION OF DONE
- [ ] Jerarquía comprensible sin animación.
- [ ] Ratón, teclado y touch probados.
- [ ] prefers-reduced-motion probado.
- [ ] Sin scroll horizontal ni CLS causado por motion.
- [ ] Sin animaciones que bloqueen interacción.
- [ ] Escenas pesadas con fallback y pausa.
- [ ] Consola limpia.
- [ ] Rendimiento validado en móvil real.
`;}
function generateSystem(raw){const input=cleanInput(raw),p=profile[input.dna],risk=riskFrom(input),recommendationsList=recommendations(input,risk),timeline=buildTimeline(input),qa=buildQa(input,risk);return {id:`sys-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,created:new Date().toISOString(),project:input.project,input,profile:{key:input.dna,...p},risk,recommendations:recommendationsList,timeline,qa,spec:buildSpec(input,p,risk,recommendationsList,timeline,qa)};}
const originalPresets=presets();
global.M404_V2_CORE=Object.freeze({version:'2.0.2',presets:originalPresets,profiles:profile,riskFrom,recommendations,buildTimeline,buildQa,paceMs,cleanInput,buildSpec,generateSystem});
})(typeof window==='undefined'?globalThis:window);
