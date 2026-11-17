# Arquitectura v4

## Carga

`index.html` → catálogo/engine v1 → `ultimate-data.js` → `ultimate.js` v3 → `pro.js` (navegación) → `editor.js` (ES Modules). La navegación integrada permite intercambiar los laboratorios sin recargar la aplicación.

## Modelos

- `src/editor-core.mjs`: modelo v4, 13 tipos de bloques, normalización estricta, HTML/CSS/JS/JSX y sanitización.
- `src/bridges.mjs`: adaptadores puros desde Motion DNA, Design Studio, Timeline, Game UI Forge y sistema guardado original v2. No escriben datos históricos.
- `src/legacy-migration.mjs`: clasificación y validación de backups v2/v3/v4, combinación por identificador sin sobrescritura.
- `src/editor.js`: interfaz visual, ShadowRoot, interacciones, guardado, previsualización y coordinación de adaptadores.
- `src/zip-utils.mjs`: escritor ZIP sin dependencias (Store + CRC32).
- `src/engine.js`: motor de patrones v1 enlazable a Document y ShadowRoot por `Motion404.bind(root)`.

## Renderización y exportaciones

En modo edición el lienzo se monta dentro de un ShadowRoot, aislado de las reglas del dashboard. Se insertan patrones mediante el motor de componentes existente y se les enlazan eventos. La vista previa usa `iframe.srcdoc` con `sandbox=allow-scripts` y el HTML exportado es autónomo. El ZIP incluye HTML separado, CSS, JS, JSX, JSON y, si hay patrones, sus tres recursos originales.

Las exportaciones React ofrecen un componente JSX compatible con proyectos React 18+; no incluyen ni instalan React. La compatibilidad visual en compiladores concretos requiere una comprobación adicional.

## Persistencia

Cada familia mantiene su propia clave. Las importaciones v2 solicitan aprobación, descargan una copia del estado anterior, y los IDs duplicados se omiten. El conversor crea un ID v4 nuevo sin alterar un sistema v2. El backup integral incluye copias de datos locales, nunca almacena tokens de GitHub ni contraseñas.

## Limitaciones técnicas

El repositorio original `Motion-404` v2.0.2 no está físicamente dentro del paquete por falta de descarga a esta sesión. `tools/import-original.mjs` incorpora su rama `main` de manera local y voluntaria, sin escrituras remotas. El importador no acopla el runtime original al mismo proceso del Composer; la interoperabilidad actual ocurre mediante JSON y adaptadores puros. No confundir eso con una fusión de código original completa.
