# Motion-404 Ultimate Studio v4.0.0 — Informe de QA

Fecha: 2026-11-17. Estado: **Release Candidate local, NO aprobada para sustituir la versión pública**.

## Evidencia de ejecución

| Revisión | Resultado | Alcance y límites |
|---|---|---|
| `npm run check` | **30/30 PASS** | 84 componentes originales, generación, seguridad, exportadores, React, adaptadores, migración v2/v3/v4, MIME y servidores Node |
| Chromium Playwright `tests/browser-v4-synthetic.py` | **PASS, cero errores `pageerror`** | DOM inyectado por bloqueo administrativo, no E2E HTTP |
| Editor | **PASS** | Añadir, modificar, duplicar, eliminar, guardar, deshacer y vistas de dispositivo |
| Motion Library 84 en Composer | **PASS** | Se insertó un patrón de invitación, aceptó correo y produjo confirmación, también en HTML exportado |
| Puentes Motion DNA, Design Tokens, Timeline, Game HUD | **PASS** | Se transfirieron a un mismo proyecto en navegador; inspector y texto de HUD actualizados |
| Importación JSON v2 | **PASS** | Formato público `{app:"Motion 404",version:"2.0.2",saved:[...]}`, se conserva `motion404-v2-state` y se convierte a v4 sin modificar el original |
| Exportación ZIP | **PASS** | ZIP real generado en Chromium: `unzip -t` sin errores; el paquete con patrones incluye JS/CSS del motor |
| React JSX | **PASS de sintaxis** | Compilación sintáctica con TypeScript `transpileModule`, no prueba de un montaje React en producción |
| Mobile 390px | **PASS para anchura** | `scrollWidth===390`, ningún elemento principal sobresale; no es prueba táctil en dispositivo real |
| Node HTTP | **PASS** | `200` en HTML y módulos `.mjs` con `text/javascript` y selección de puerto alternativo |
| Python HTTP | **PASS** | `200` para HTML/JS/módulos `.mjs` con `text/javascript` |
| Bash launcher | **PASS sintáctico** | `bash -n`; ejecución GUI terminal y apertura automática no verificadas |
| Windows BAT | **Inspección estática** | No hay Windows real en esta sesión; doble clic y apertura del navegador pendientes |
| PWA offline/instalación | **No verificado E2E** | Recursos listados en service-worker.js y servidos por HTTP, pero test Chromium HTTP bloqueado |
| Safari/Firefox/iPhone/Android, A11y con lector, rendimiento de 60 FPS | **Pendiente** | Requiere hardware/navegadores externos y mediciones |

## Bugs detectados y corregidos durante desarrollo

1. ZIP exportado en descarga inválido por conversión incorrecta de bytes a Blob: corregido con `new Blob([Uint8Array])` y validado con `unzip -t`.
2. Desbordamiento horizontal de la barra superior en pantallas de 390 px: corregidos flex/padding y navegación.
3. `application/octet-stream` para módulos `.mjs` con `nosniff`: Node y Python ahora sirven `text/javascript`.
4. Patrones Motion no interactivos en Shadow DOM: `Motion404.bind(root)` enlaza los listeners y los patrones pueden seleccionarse sin resetear su estado.
5. Exportación ZIP sin script de inicialización de patrones: `projectJS(p)` ahora recibe el proyecto en vez de omitirse.
6. JSON de un solo proyecto v4 no reimportable: el clasificador acepta proyectos individuales además de colecciones.
7. Importación completa parcialmente mutable: validación previa de límites y sistemas v2 y recuperación de claves en caso de fallo de almacenamiento.
8. Desajuste de backup Ultimate v3: la exportación v4 envuelve los datos v3 en la estructura versionada que el importador acepta.

## Pendientes bloqueantes de publicación

- Ejecutar E2E real en `localhost` y comprobar el Service Worker tras recarga/offline, registro PWA y actualización de caché.
- Ejecutar el BAT en Windows 11, validar cierre del servidor y fallback Python, y una prueba real Linux Mint.
- Validar las exportaciones React y HTML en proyectos anfitriones (Vite/React, Pages) y en Firefox/Safari.
- Completar fusión de runtime **original** de Motion-404 v2.0.2; este ZIP conserva puentes de datos y un importador separado del código GitHub, no incluye físicamente su motor v2.0.2.
- Probar migración con una exportación real del usuario de su sitio publicado, y restauración completa ante error con límites de almacenamiento.

## Regla de publicación

No publicar ni reemplazar `main` sin resolver los puntos bloqueantes y disponer de un plan de rollback. Mantener como estable el repositorio GitHub actual mientras se valida esta Release Candidate local.
