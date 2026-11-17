# QA — Motion-404 Ultimate Studio PRO v3.1.0

## Alcance

Rediseño visual y de navegación sobre la versión Ultimate Studio v3.0.0. No se sustituyen ni se modifican los motores de catálogo, componentes, exportación ni las claves de persistencia.

## Comprobaciones reproducibles

- `npm run check` — comprueba sintaxis de los motores originales y ejecuta pruebas del catálogo y de Ultimate Studio.
- `node --check src/pro.js` — valida la sintaxis del controlador de navegación.
- `node --test tests/pro.test.mjs` — valida la presencia, integración y aislamiento de la capa PRO.
- `npm start` — inicia servidor para revisión visual local.
- `python tests/browser-smoke.py` — prueba opcional con Playwright; adaptarla a la nueva navegación si es preciso.

## Limitaciones

Se intentó arrancar Chromium contra `http://127.0.0.1:8080` pero la navegación fue bloqueada por el entorno (`ERR_BLOCKED_BY_ADMINISTRATOR`). Por tanto no hay verificación visual real de esta edición ni capturas certificadas. La ejecución en Windows, Linux, Firefox, Safari y dispositivos físicos permanece pendiente.

El paquete es **la evolución visual del ZIP independiente** Ultimate 3.0.0, no una integración binaria total del repositorio GitHub Motion-404 v2.0.2; sigue incluido el importador local `npm run import:original`.

No hubo publicaciones ni cambios en GitHub.
