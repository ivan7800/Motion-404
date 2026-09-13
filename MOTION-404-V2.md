# Motion 404 v2.0 — Motion Design System

Preview pública: `https://ivan7800.github.io/Motion-404/v2.html`

La v2 convive con `index.html` para mantener la versión 1.3.1 como rollback estable mientras se valida el nuevo producto.

## Qué cambia

Motion 404 deja de ser únicamente una biblioteca/generador de prompts y pasa a producir un contrato de movimiento reutilizable para diseño y frontend.

### Motion DNA

- 6 perfiles: Cinematic, Minimal, Kinetic, Editorial, Brutalist y Spatial.
- Intensidad 1–5.
- Ritmo calmado/equilibrado/rápido.
- Profundidad 2D/capas/espacial.
- Easing, duración, stagger, entrada, hover/focus, scroll y anti-patrones.

### Preset Library

- 180 presets generados a partir de 30 conceptos × 6 variantes.
- Filtro por categoría y Motion DNA.
- Búsqueda local.
- Carga progresiva.
- Acción `Usar preset` para trasladar el sistema al Motion Studio.

### Motion Inspector

Calcula de forma predictiva:

- riesgo GPU/CPU;
- carga cognitiva;
- riesgo de accesibilidad;
- riesgo total de sobreanimación.

Añade recomendaciones específicas cuando detecta 3D, cursor effects, tipografía cinética, intensidad elevada o demasiados efectos simultáneos.

### Motion Spec

Genera Markdown con:

- DNA completo;
- contexto de producto;
- tokens CSS de movimiento;
- reglas globales;
- contrato por componente;
- timeline base;
- performance budget;
- accessibility contract;
- anti-overanimation;
- QA gate;
- Definition of Done.

### Timeline

Secuencia temporal para hero, scroll chapters, tipografía cinética, profundidad, 3D, CTA y page transitions, adaptada al ritmo e intensidad elegidos.

### Performance / Accessibility QA

QA predictivo con puntuación y checks sobre:

- `prefers-reduced-motion`;
- intensidad;
- presupuesto de animación;
- fallback móvil;
- entrada táctil;
- legibilidad;
- propiedades de bajo coste;
- control del usuario;
- objetivo de fluidez.

### Persistencia local

- Guardado en `localStorage`.
- Máximo de 50 Motion Systems.
- Importación/exportación JSON.
- Sin cuentas, cookies, backend ni telemetría.

## QA ejecutado antes de publicar

- `node --check motion-v2.js`: OK.
- Referencias JS → IDs DOM: 0 referencias ausentes.
- IDs HTML duplicados: 0.
- Botones HTML sin `type`: 0.
- 30 conceptos × 6 rondas = 180 presets: OK.
- CSS y JS externos compatibles con CSP restrictiva: OK.
- Responsive y `prefers-reduced-motion` definidos en CSS.

## Estado

`v2.html` es la preview de validación. `index.html` permanece intacto hasta completar prueba manual en navegador/escritorio/móvil y decidir promoción de v2 a release principal.
