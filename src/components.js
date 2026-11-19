/* 90 patrones de interfaz: recreaciones originales, NO código de DesignBookmark ni de proveedores externos. */
(function(){
const H={
 esc:v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])),
 btn:(label,act,cls='',val='')=>`<button type="button" class="d-btn ${cls}" data-act="${act}" data-val="${val}">${label}</button>`,
 pill:t=>`<span class="d-pill">${t}</span>`,
 heading:(a,b='')=>`<div class="d-head">${a}</div>${b?`<p class="d-muted">${b}</p>`:''}`,
 row:t=>`<div class="d-row">${t}</div>`,
 box:t=>`<div class="d-box">${t}</div>`,
 range:(val=35,field='range')=>`<input class="d-range" data-field="${field}" type="range" min="0" max="100" value="${val}">`,
 tabs:(items,s)=>`<div class="d-tabs">${items.map((v,i)=>`<button class="${(s.tab||0)===i?'active':''}" data-act="tab" data-val="${i}">${v}</button>`).join('')}</div>`,
};
window.M404_H=H;
const {esc,btn,pill,heading:hd,row,box,range,tabs}=H;
function paletteButton(label) {
  if (window.Motion404?.openPalette) return btn(label,'palette','wide');
  return `<details class="local-commands"><summary>${label}</summary>
    <button type="button" class="d-btn" data-act="copy-command-text">Copiar texto</button>
    <button type="button" class="d-btn" data-act="command-motion">Alternar movimiento reducido</button>
    <output role="status"></output></details>`;
}
window.M404_DEMOS={
1:(s,o)=>box(hd('Invita a tu equipo','Espacio colaborativo')+row('<input class="d-input" type="email" placeholder="correo@ejemplo.com" data-field="email">'+btn('Invitar','invite'))+`<div class="d-avatars"><span>IR</span><span>AL</span><span>MX</span>${(s.items||[]).map(v=>`<span>${esc(v.slice(0,2))}</span>`).join('')}</div>`+pill((s.items||[]).length?'Invitaciones preparadas: '+s.items.length:'3 personas en el espacio')),
2:(s)=>box(hd('Modo concentración')+btn(s.on?'Desactivar':'Activar enfoque','toggle','wide')+`<div class="focus-demo ${s.on?'active':''}">UNA TAREA · UNA MENTE</div>`),
3:(s)=>box(hd('Selecciona tu plan')+tabs(['Free','Plus','Studio'],s)+`<div class="d-figure">${['0 €','12 €','29 €'][s.tab||0]}<small> / mes</small></div>`+pill(['Empezar','Crear','Escalar'][s.tab||0])),
4:(s)=>box(hd('Límite de caracteres','80 caracteres disponibles')+`<textarea class="d-input d-area" maxlength="80" data-field="text" placeholder="Tu mensaje...">${esc(s.text||'')}</textarea><div class="d-counter">${(s.text||'').length} / 80</div>`),
5:(s)=>box(hd('Tira de la cuerda')+`<button class="cord-demo ${s.on?'pulled':''}" data-act="toggle" aria-label="Tirar cuerda"><span></span><b></b></button>`+pill(s.on?'Interruptor activado':'Tira hacia abajo')),
6:(s)=>box(hd('Ayuda contextual')+`<div class="tooltip-demo ${s.on?'pinned':''}"><button type="button" class="d-btn tooltip-trigger" aria-pressed="${s.on}" data-act="toggle">${s.on?'Soltar ayuda':'Fijar ayuda'}</button><span class="tip-content">Puedes fijar esta ayuda con un toque.</span></div>`+pill(s.on?'Ayuda fijada':'Pasa el cursor o enfoca el botón')),
7:(s)=>box(hd('Lista elástica')+btn(['Niebla','Umbral','Ecos'][s.tab||0]+' ⌄','menu','wide')+(s.open?`<div class="d-popup">${['Niebla','Umbral','Ecos'].map((t,i)=>btn(t,'choose','',''+i)).join('')}</div>`:'')),
8:(s)=>box(hd('Entrega de archivos')+`<label class="file-zone">↥<strong>${esc(s.file||'Seleccionar archivo')}</strong><small>Solo lectura local · No se envía</small><input data-field="file" type="file" aria-label="Selecciona archivo"></label>`),
9:()=>box(hd('Botón de comandos')+paletteButton('⌕  Abrir paleta')+pill('⌘ / Ctrl + K')),
10:(s)=>box(hd('Indicador expandible')+`<button class="island-demo ${s.on?'expanded':''}" data-act="toggle">${s.on?'✦ Sistema conectado · 3 tareas':'● Actividad'}</button>`+pill('Clic para transformar')),
11:(s)=>box(hd('Menú orgánico')+`<div class="goo-cluster ${s.open?'expanded':''}">
  <button type="button" class="d-btn goo-center" data-act="menu" aria-label="Opciones" aria-expanded="${!!s.open}">✦</button>
  ${s.open ? ['Buscar','Favoritos','Ajustes'].map((label,i)=>
    `<button type="button" class="d-btn goo-child goo-${i}" data-act="tab" data-val="${i}" aria-label="${label}">${['⌕','♡','⚙'][i]}</button>`
  ).join('') : ''}
</div>`+pill('Opción '+((s.tab||0)+1))),
12:(s)=>box(hd('Deslizador flexible')+`<div class="d-meter"><i style="width:${s.range??35}%"></i></div>`+range(s.range??35)+pill((s.range??35)+'% intensidad')),
13:(s)=>box(hd('Mantén para publicar','1,2 segundos para confirmar')+`<button class="d-btn wide hold-btn" data-hold="publish" style="--hold:0%">${s.done?'✓ Publicado (demo)':'Mantén pulsado'}</button>`+pill('Sin publicación real')),
14:(s)=>box(hd('Cartas deslizantes')+`<div class="swipe-deck" data-act="next"><i></i><i></i><strong>${['01 · La niebla','02 · La señal','03 · El eco'][s.step%3||0]}</strong></div>`+row(btn('←','prev','outline')+btn('Siguiente →','next'))),
15:(s)=>box(hd('Campo con rebote')+`<input class="spring-input" data-field="text" placeholder="Escribe una idea" value="${esc(s.text||'')}">`+pill('Foco con transición suave')),
16:(s)=>box(hd('Dock elástico')+`<div class="rubber-dock">${['⌂','⌕','✧','♡','⚙'].map((t,i)=>btn(t,'tab',(s.tab||0)===i?'chosen':'',i)).join('')}</div>`+pill('Icono '+((s.tab||0)+1))),
17:()=>box(`<div class="parallax-ticket"><small>NOCTURNE / 404</small><strong>PASSAGE</strong><p>Un viaje a ninguna parte</p><b>✧</b></div>`+pill('Mueve el cursor sobre la tarjeta')),
18:(s,o)=>box(`<div class="glass-card"><strong>FRAGMENTO 04</strong><p>${esc(o.text)}</p><i class="lens">✦</i></div>`+pill('Explora con el cursor')),
19:(s)=>box(hd('Actualizar al instante')+`<div class="refresh-symbol ${s.loading?'spin':''}">↻</div>`+btn('Actualizar','refresh')+pill('Actualizaciones: '+s.step)),
20:(s)=>box(hd('Palabras rotatorias')+`<div class="d-figure animated-word">${['NIEBLA','UMBRAL','ABISMO','ECO'][s.step%4||0]}</div>`+btn('Cambiar ↻','next')),
21:()=>box(hd('Tipografía variable')+`<div class="weight-wave">${[...'NOCTURNE'].map((x,i)=>`<span style="animation-delay:${i*90}ms">${x}</span>`).join('')}</div>`+pill('Animación CSS continua')),
22:(s)=>box(hd('Forma gelatinosa')+`<button class="goo-blob ${s.on?'alternate':''}" data-act="toggle" aria-label="Cambiar forma"><span aria-hidden="true">✦</span></button>`+pill('Pulsa para alterar')),
23:(s,o)=>box(hd('Texto encriptado')+`<div class="scramble-text">${esc(s.text||o.text)}</div>`+btn('Descifrar','scramble')),
24:(s)=>box(hd('Lectura asistida')+`<div class="read-along">${'La puerta nunca estuvo cerrada'.split(' ').map((w,i)=>`<span class="${i===s.step%5?'current':''}">${w}</span>`).join(' ')}</div>`+btn('Siguiente palabra','next')),
25:(s)=>box(hd('Enlaces en movimiento')+`<div class="roll-links">${['Explorar','Crear','Descubrir'].map((label,i)=>`<button type="button" data-act="tab" data-val="${i}" aria-pressed="${s.tab===i}">${label} ↗</button>`).join('')}</div>`+pill(['Colección de patrones','Mesa de composición','Selección destacada'][s.tab])),
26:(s)=>box(hd('Prompt para IA','Interfaz de ejemplo; sin conexión a modelos')+`<textarea class="d-input d-area" data-field="text" placeholder="¿Qué quieres construir?">${esc(s.text||'')}</textarea>`+btn('Enviar demo ↗','done')+(s.done?pill('Prompt local recibido'):'')),
27:(s)=>box(hd('Respuesta progresiva','Simulación local, sin IA')+`<div class="stream-box">${esc(s.text||'Pulsa iniciar para ver la demostración.')}${s.loading?'▌':''}</div>`+btn('Iniciar streaming','stream')),
28:(s)=>box(hd('Sugerencia fantasma')+`<input class="d-input" data-field="suggestion" value="${esc(s.text||'')}" placeholder="Escribe algo..."><small class="d-muted">Flecha → al final para completar: «en el abismo»</small>`),
};
Object.assign(window.M404_DEMOS,{
29:()=>box(hd('Procesando…')+'<div class="thinking-dots"><i></i><i></i><i></i></div>'+pill('Animación de espera')),
30:(s)=>box(`<button class="expand-card" data-act="toggle"><small>ARCHIVO 017</small><strong>La puerta bajo el agua</strong><p>${s.on?'Alguien había dejado la luz encendida al otro lado de una pared que no existía.':'Pulsa para descubrir el fragmento.'}</p></button>`),
31:(s)=>box(hd('Tarjetas en abanico')+`<div class="fan-stack" style="--twist:${s.step*10}deg"><i>I</i><i>II</i><i>III</i></div>`+btn('Cambiar disposición','next')),
32:(s)=>box(hd('Métrica animada')+`<div class="metric-demo"><small>EXPLORACIONES</small><strong>${1240+s.step*117}</strong><span>↗ +${(4.2+s.step*.3).toFixed(1)}%</span></div>`+btn('Actualizar valores','next')),
33:(s)=>box(`<div class="profile-preview"><div class="profile-icon">✧</div><strong>Archivo Nocturno</strong><small>Diseño y movimiento</small></div>`+btn(s.on?'Siguiendo ✓':'Seguir +','toggle','wide')),
34:(s)=>box(hd('Atracción magnética')+`<div class="magnetic-zone"><button class="d-btn magnetic" data-act="toggle">${s.on?'Activado ✓':'Acércate y pulsa'}</button></div>`),
35:(s)=>box(hd('Espera y confirma')+btn(s.done?'✓ Completado':s.loading?'◌ Procesando…':'Iniciar proceso','success','wide')+pill('Acción local simulada')),
36:(s,o)=>box(hd('Copia con confirmación')+`<code class="copy-example">${esc(o.text)}</code>`+btn(s.done?'Copiado ✓':'Copiar texto','copy-demo')),
37:(s)=>box(hd('Reacción instantánea')+`<button class="heart-demo ${s.on?'liked':''}" data-act="toggle">♥</button>`+pill((s.on?13:12)+' corazones')),
38:(s)=>box(hd('Pestañas en cápsula')+tabs(['Inicio','Biblioteca','Perfil'],s)+pill('Vista '+['Inicio','Biblioteca','Perfil'][s.tab||0])),
39:(s)=>box(hd('Barra inferior')+`<div class="bottom-nav">${['⌂','◎','＋','♡','⚙'].map((c,i)=>btn(c,'tab',(s.tab||0)===i?'active':'',i)).join('')}</div>`),
40:(s)=>box(hd('Acciones contextuales')+btn('Opciones ···','menu')+(s.open?`<div class="d-popup">${['Nuevo','Editar','Compartir'].map((t,i)=>btn(t,'choose','',''+i)).join('')}</div>`:'')+pill('Acción '+((s.tab||0)+1))),
41:(s)=>box(hd('Control segmentado')+tabs(['Claro','Oscuro','Auto'],s)+pill('Tema '+['claro','oscuro','automático'][s.tab||0])),
42:(s)=>box(hd('Barra plegable')+`<div class="mini-sidebar ${s.on?'collapsed':''}"><button data-act="toggle">☰</button><span>⌂ <b>Inicio</b></span><span>⌕ <b>Buscar</b></span><span>⚙ <b>Ajustes</b></span></div>`),
43:(s)=>box(hd('Paginación flexible')+`<div class="d-figure">${s.step%5+1}<small> / 5</small></div><div class="page-dots">${Array.from({length:5},(_,i)=>btn('','setstep',i===s.step%5?'active':'',i)).join('')}</div>`+row(btn('←','prev','outline')+btn('→','next'))),
44:()=>box(hd('Paleta de comandos')+paletteButton('⌕  Buscar una acción')+pill('⌘ / Ctrl + K')),
45:(s)=>box(hd('Pasos progresivos')+`<div class="step-flow">${['Inicio','Diseño','Test','Fin'].map((v,i)=>`<div class="${i<=s.step%4?'complete':''}"><b>${i+1}</b><small>${v}</small></div>`).join('')}</div>`+row(btn('← Atrás','prev','outline')+btn('Avanzar →','step'))),
46:(s)=>box(hd('Verificación de 6 dígitos','Sin servicio externo')+`<div class="otp-digits">${Array.from({length:6},(_,i)=>`<input maxlength="1" inputmode="numeric" data-otp="${i}" aria-label="Dígito ${i+1}" value="${esc((s.text||'')[i]||'')}">`).join('')}</div>`+pill((s.text||'').length===6?'Código completo':'Introduce seis cifras')),
47:(s)=>box(hd('Conmutador')+`<button role="switch" aria-checked="${!!s.on}" class="toggle-demo ${s.on?'active':''}" data-act="toggle"><i></i></button>`+pill(s.on?'Activado':'Desactivado')),
48:(s)=>box(hd('Valora la experiencia')+`<div class="star-demo">${[1,2,3,4,5].map(v=>btn('★','rate',v<=(s.rating||0)?'active':'',v)).join('')}</div>`+pill(s.rating?s.rating+' de 5':'Elige estrellas')),
49:(s)=>box(hd('Etiquetas editables')+`<div class="tag-list">${(s.tags||['motion','404']).map((v,i)=>btn(esc(v)+' ×','del-tag','outline',i)).join('')}</div>`+row('<input data-field="tag" class="d-input" placeholder="Nueva etiqueta + Enter">'+btn('Añadir','tag'))),
50:(s)=>box(hd('Cantidad')+`<div class="stepper-demo">${btn('−','decrement','outline')}<strong>${s.number??2}</strong>${btn('+','increment')}</div>`+pill('De 0 a 99')),
51:(s)=>box(hd('Control de rango')+range(s.range??35)+`<div class="d-meter"><i style="width:${s.range??35}%"></i></div>`+pill((s.range??35)+'%')),
52:(s)=>box(hd('Fortaleza de contraseña')+`<input type="password" class="d-input" autocomplete="off" placeholder="Prueba una contraseña" data-field="password" value="${esc(s.text||'')}"><div class="strength-bars">${[1,2,3,4].map(i=>`<i class="${(s.score||0)>=i?'lit':''}"></i>`).join('')}</div>`+pill(['Sin evaluar','Débil','Aceptable','Buena','Fuerte'][s.score||0])),
53:(s)=>box(hd('Lista de validación')+['Inspeccionar','Implementar','Probar'].map((t,i)=>`<label class="check-line"><input type="checkbox" data-check="${i}" ${s.checks?.[i]?'checked':''}>${t}</label>`).join('')+pill((s.checks||[]).filter(Boolean).length+'/3 completados')),
54:(s)=>box(hd('Control giratorio')+`<div class="dial-control" style="--angle:${(s.range??35)*2.7-135}deg"><i></i><strong>${s.range??35}°</strong></div>`+range(s.range??35)),
55:(s)=>box(hd('Esfera reactiva','Sin captura de micrófono')+`<button aria-label="Activar orbe" class="siri-orb ${s.on?'awake':''}" data-act="toggle"><i></i></button>`+pill(s.on?'Orbe animado':'Pulsa la esfera')),
56:(s)=>box(hd('Pasos de un agente','Progreso simulado sin IA')+`<div class="agent-steps">${['Analizar petición','Buscar alternativas','Sintetizar respuesta','Terminar'].map((v,i)=>`<div><b>${i<=s.step%4?'✓':'○'}</b>${v}</div>`).join('')}</div>`+btn('Siguiente estado','next')),
});
Object.assign(window.M404_DEMOS,{
57:(s)=>box(hd('Confirmación prolongada')+`<button class="d-btn hold-btn wide" data-hold="confirm" style="--hold:0%">${s.done?'✓ Confirmado (demo)':'Mantén durante 1,2 s'}</button>`),
58:(s)=>box(hd('Exposición gradual')+`<div class="exposure-demo" style="filter:brightness(${.4+(s.range??35)/50})">☽<small>HORIZON / 404</small></div>`+range(s.range??35)),
59:(s)=>box(`<div class="boarding-pass"><div>NOCTURNE AIR <b>✦</b></div><strong>BCN → ECL</strong><div>PUERTA 04 <span>ASIENTO 13A</span></div></div>`+btn(s.on?'Ocultar detalles':'Ampliar tarjeta','toggle')+(s.on?pill('Vuelo ficticio: 404'):'')),
60:(s)=>box(hd('Resaltado de palabras')+`<p class="marker-demo ${s.on?'lit':''}">Lo invisible deja huellas.</p>`+btn('Resaltar texto','toggle')),
61:(s)=>box(hd('Contenido por pestañas')+tabs(['Vista','Eventos','Datos'],s)+`<div class="tab-panel">${['Elige una escena para comenzar','Último evento: hoy','Estado del sistema: estable'][s.tab||0]}</div>`),
62:(s)=>box(hd('Desbloqueo facial simulado','No recopila datos biométricos')+`<div class="face-demo ${s.on?'unlocked':''}">${s.on?'✓':'⌗'}</div>`+btn(s.on?'Bloquear':'Simular desbloqueo','toggle')),
63:(s)=>box(hd('Desliza y confirma')+`<div class="slide-confirm"><span>${s.done?'✓ Confirmado (demo)':'Desliza a la derecha →'}</span>${range(s.done?100:(s.range===35?0:s.range),'slide')}</div>`),
64:(s)=>box(hd('Notificaciones en pila')+`<div class="notice-stack">${['Nueva actividad','Archivo guardado','Proceso finalizado'].slice(s.step%3).map((v,i)=>`<div style="--n:${i}">● ${v}</div>`).join('')}</div>`+row(btn('Descartar','next','outline')+btn('Restablecer','reset'))),
65:(s)=>box(hd('Selector circular')+`<div class="wheel-demo"><small>${(s.number??2)+11}</small><strong>${(s.number??2)+12}</strong><small>${(s.number??2)+13}</small></div>`+row(btn('−','decrement','outline')+btn('+','increment'))),
66:(s)=>box(hd('Palabras que evolucionan')+`<div class="dynamic-type">${['IMAGINA','CONSTRUYE','EXPLORA','TRANSFORMA'][s.step%4]}<span> / 404</span></div>`+btn('Nuevo concepto','next')),
67:(s)=>box(hd('Entrada de voz','Solo visualización. No activa el micro.')+`<div class="voice-bars ${s.on?'awake':''}">${[1,2,3,4,5,6,7].map(i=>`<i style="animation-delay:${i*75}ms"></i>`).join('')}</div>`+btn(s.on?'Detener visualización':'Animar visualización','toggle')),
68:(s)=>box(hd('Aprobación de herramientas')+`<div class="tool-permission"><code>$ npm test</code><small>Demostración: no ejecuta comandos</small></div>`+row(btn('Denegar','deny','outline')+btn('Autorizar','allow'))+(s.message?pill(esc(s.message)):'')),
69:(s)=>box(hd('Herramientas compactas')+`<div class="toolbar-demo">${['B','I','U','≡','⋯'].map((v,i)=>btn(v,'tab',(s.tab||0)===i?'active':'',i)).join('')}</div>`+pill('Herramienta '+((s.tab||0)+1))),
70:(s)=>box(hd('Barra de reproducción')+`<div class="timeline-demo"><span>00:${String(Math.round((s.range??35)*1.2)).padStart(2,'0')}</span><div class="d-meter"><i style="width:${s.range??35}%"></i></div><span>02:00</span></div>`+range(s.range??35)),
71:(s)=>box(hd('Carrito contextual')+row('<span>☕ Café de medianoche</span>'+btn('Añadir','cart'))+row('<span>✧ Amuleto</span>'+btn('Añadir','cart','outline'))+pill('Cesta: '+(s.cart||0)+' artículo(s)')),
72:(s)=>box(hd('Paginador tridimensional')+`<div class="flip-book ${s.step%2?'turned':''}"><span>CAPÍTULO<br><strong>${s.step%5+1}</strong></span></div>`+row(btn('←','prev','outline')+btn('Pasar página →','next'))),
73:()=>box(hd('Firma digital local','Dibuja en el lienzo')+`<canvas class="signature-canvas" width="480" height="140" aria-label="Lienzo de firma"></canvas>`+btn('Borrar firma','clear-sign','outline')),
74:(s)=>box(hd('Acción reversible')+pill(s.on?'Elemento archivado en esta demo':'Elemento disponible')+btn(s.on?'↶ Deshacer':'Archivar','toggle')),
75:(s)=>box(hd('Tarjeta visual','No introduzcas números reales')+`<div class="fake-payment"><small>STUDIO 404</small><strong>•••• •••• •••• ${esc((s.text||'0000').slice(-4).padStart(4,'0'))}</strong></div><input class="d-input" maxlength="4" inputmode="numeric" data-field="card" placeholder="4 dígitos de prueba">`+pill('No almacena ni envía datos de pago')),
76:(s)=>box(hd('Navegación en capas')+`<div class="stack-menu"><strong>${['Ajustes','Cuenta','Apariencia','Avisos'][s.step%4]}</strong><small>Nivel ${s.step%4+1}</small></div>`+row(btn('Volver','prev','outline')+btn('Entrar →','next'))),
77:(s,o)=>box(hd('Texto mecanografiado')+`<div class="typewriter-demo" style="--chars:${o.text.length}">${esc(o.text)}</div>`+btn('Repetir animación','next')),
78:()=>box(hd('Procesamiento textual')+`<div class="thinking-text">Calculando<span>...</span></div>`+pill('Modo de ejemplo')),
79:(s)=>box(hd('Reproductor visual','No contiene pistas comerciales')+`<div class="record-ui ${s.on?'playing':''}"><div class="vinyl-disc"></div><div><strong>Low Tide</strong><small>Sin audio en esta demo</small></div></div>`+btn(s.on?'Pausar animación':'Reproducir animación','toggle')),
80:(s)=>box(hd('Suscripción a avisos')+btn(s.on?'✓ Activado':'♧ Activar alertas','toggle','wide')+pill('Estado visual, sin servidor')),
81:(s)=>box(hd('Popover de opiniones')+btn('Dar opinión','menu')+(s.open?`<div class="feedback-popup">${['👍','💜','✨'].map(x=>btn(x,'feedback','outline')).join('')}<small>¿Te ha gustado?</small></div>`:'')+(s.done?pill('¡Gracias por participar!'):'')),
82:(s)=>box(hd('Lista de tareas')+['Crear la escena','Añadir la animación','Revisar contraste','Comprobar móvil'].map((v,i)=>`<label class="check-line"><input data-check="${i}" type="checkbox" ${s.checks?.[i]?'checked':''}>${v}</label>`).join('')+pill((s.checks||[]).filter(Boolean).length+' tareas completadas')),
83:(s)=>box(hd('Ambiente sintetizado','Tono original generado localmente')+`<div class="audio-bars ${s.on?'awake':''}">${[1,2,3,4,5,6,7,8].map(i=>`<i style="animation-delay:${i*70}ms"></i>`).join('')}</div>`+btn(s.on?'■ Silenciar':'▶ Activar ambiente','music')),
84:()=>box(hd('Lanzador de comandos')+paletteButton('⌕  Command 404')+pill('Busca una acción rápida')),
});
Object.assign(window.M404_DEMOS, {
85: (s,o)=>box(`<button type="button" class="spotlight-card ${s.on?'is-lit':''}" data-act="toggle" aria-pressed="${s.on}"><span class="spotlight-grid" aria-hidden="true"></span><small>ARCHIVO / 404</small><strong>${esc(o.text)}</strong><span>${s.on?'✓ Fragmento descubierto':'Explora la luz · pulsa para revelar'}</span></button>`),
86: ()=>box(hd('Capas del archivo')+`<div class="disclosure-stack">${[['La señal','Una frecuencia cruza la niebla.'],['El umbral','El siguiente paso empieza aquí.'],['El regreso','Guarda una luz para el camino.']].map(([t,d])=>`<details><summary>${t}<span aria-hidden="true">+</span></summary><p>${d}</p></details>`).join('')}</div>`),
87: (s)=>box(hd('Órbita de navegación')+`<div class="orbit-selector" style="--orbit-index:${s.tab}"><i aria-hidden="true"></i><strong>${['Crear','Explorar','Guardar'][s.tab]}</strong>${['Crear','Explorar','Guardar'].map((t,i)=>`<button type="button" data-act="tab" data-val="${i}" class="orbit-stop orbit-stop-${i}" aria-label="${t}" aria-pressed="${s.tab===i}">${['✦','⌕','♡'][i]}</button>`).join('')}</div>`),
88: (s)=>box(hd('Dos atmósferas')+`<div class="split-reveal" style="--reveal:${s.range}%"><div class="reveal-world reveal-before"><b>NOCHE</b><i></i></div><div class="reveal-world reveal-after"><b>AURORA</b><i></i></div><span class="reveal-line" aria-hidden="true"></span></div><label class="reveal-control">Revelar <input aria-label="Porcentaje de aurora" class="d-range" type="range" data-field="reveal" min="0" max="100" value="${s.range}"><output>${s.range}%</output></label>`),
89: (s)=>box(hd('Pulso de confirmación')+`<button type="button" class="ripple-action ${s.on?'is-active':''}" data-act="toggle" aria-pressed="${s.on}"><span class="ripple-ring" aria-hidden="true"></span><span>${s.on?'✓ Señal enviada':'Emitir señal ↗'}</span></button>`+pill('Interacción local · pulsa para alternar')),
90: (s)=>box(hd('Contador de expediciones')+`<div class="flip-counter" aria-live="polite" aria-atomic="true">${String(s.number).padStart(2,'0').split('').map(d=>`<span>${d}</span>`).join('')}</div>`+row(`<button type="button" class="d-btn outline" data-act="decrement" aria-label="Restar expedición" ${s.number===0?'disabled':''}>−</button><button type="button" class="d-btn" data-act="increment" aria-label="Añadir expedición" ${s.number===99?'disabled':''}>+</button>`))
});
})();
