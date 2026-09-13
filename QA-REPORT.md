# Motion 404 v2.0.2 — QA Report

Fecha: 2026-09-13

Estado: **RELEASE CANDIDATE — CORRECCIÓN DE ARRANQUE Y BOTONES VALIDADA**

## Causa raíz confirmada en producción

La versión 2.0.1 publicada mostraba correctamente HTML/CSS, pero el runtime no llegaba a inicializarse. Un navegador Chrome real contra `https://ivan7800.github.io/Motion-404/` registró exactamente:

```text
motion-v2.js 78:7 Uncaught SyntaxError: Unexpected end of input
motion-v2.0.1-patch.js 21:10 Uncaught ReferenceError: validSaved is not defined
```

Consecuencia observable:

- `window.__MOTION404_READY__` no existía / era falso.
- 0 tarjetas `.preset-card` renderizadas.
- `init()` no completaba.
- Los listeners de botones/filtros no llegaban a enlazarse.
- El parche 2.0.1 dependía de símbolos del runtime anterior y fallaba en cascada.

Esto explica exactamente el síntoma: shell visual disponible, catálogo vacío y botones inertes.

## Corrección v2.0.2

- Eliminada del `index.html` la cadena frágil `preflight → motion-v2.js → patch`.
- Nuevo runtime único: `motion-v2.0.2.js`.
- Inicialización atómica con comprobación previa de todos los IDs DOM requeridos.
- Diagnóstico `window.__MOTION404_QA__` y `window.__MOTION404_READY__` sólo después de completar render y listeners.
- Normalización defensiva de `localStorage` e imports JSON.
- Mensaje visible de error de arranque si el runtime no puede inicializar.
- Service Worker actualizado a caché `motion-404-v2.0.2`.
- Eliminados del precache los runtimes rotos 2.0.1.
- Navegación sigue usando `network-first`; la shell y estáticos disponen de fallback offline.

## Browser QA real

GitHub Actions ejecutó Chrome/Selenium contra la aplicación servida bajo:

```text
http://127.0.0.1:8000/Motion-404/
```

Esto reproduce la subruta usada por GitHub Pages.

### Resultado: 90 comprobaciones PASS

Comprobaciones funcionales ejecutadas individualmente:

- runtime 2.0.2 listo;
- listeners enlazados;
- 180 presets generados;
- 18 tarjetas iniciales;
- Mostrar más → 36 tarjetas;
- búsqueda;
- limpiar filtros;
- filtro categoría Gaming → 12 presets;
- filtro DNA Cinematic → 30 presets;
- Sorpréndeme;
- Usar preset;
- DNA preview;
- Motion Inspector reactivo;
- Inspeccionar riesgo;
- Generar Motion System;
- Motion Spec identifica v2.0.2;
- tabs Motion DNA / Motion Spec / Timeline / QA;
- copiar;
- descargar;
- guardar;
- abrir guardado y resincronizar formulario;
- exportar JSON;
- eliminar guardado;
- importar JSON mediante `input[type=file]` real;
- borrar todos los guardados con confirmación;
- cambiar tema;
- restablecer formulario;
- atajo `/` para búsqueda.

### Capas, pointer-events y z-index

Se hizo hit-test mediante `document.elementFromPoint()` sobre los controles críticos después de posicionarlos en el viewport.

Resultado:

- `pointer-events: auto` en todos los controles comprobados.
- el elemento superior en el punto central es el propio botón o un descendiente suyo;
- ninguna capa invisible intercepta los controles;
- no se detectó un problema de z-index como causa de los botones inertes.

Controles verificados: `Sorpréndeme`, `Limpiar filtros`, `Mostrar más`, `Inspeccionar`, `Generar`, `Guardar`, `Copiar`, `Descargar`, `Exportar`, `Borrar guardados` y `Tema`, además de los botones dinámicos de preset y sistema guardado.

### Consola

- Errores de página en la rama corregida: **0**.
- Errores `console.error` / SEVERE: **0**.

### Service Worker / caché / offline

- Service Worker registrado correctamente.
- Caché activa comprobada: `motion-404-v2.0.2`.
- Después de recargar, `navigator.serviceWorker.controller === true`.
- Recarga con red emulada como offline: **PASS**.
- Tras la recarga offline vuelven a renderizarse 18 tarjetas iniciales.

## Rutas / GitHub Pages

Todos los recursos principales devolvieron HTTP 200 dentro de `/Motion-404/`:

- `index.html`
- `motion-v2.css`
- `motion-v2.0.2.js`
- `manifest.webmanifest`
- `sw.js`
- iconos PWA
- `assets/universo-404.webp`
- `assets/preview.jpg`

## Veredicto

**CORRECCIÓN FUNCIONAL VALIDADA.**

La causa raíz está demostrada con errores de consola capturados en la versión pública anterior y la v2.0.2 pasa 90 comprobaciones de navegador, incluyendo acciones individuales, hit-testing de capas, consola, subruta GitHub Pages, importación real y offline.