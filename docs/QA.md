# QA de MOTION-404-STUDIO v1.0.0

Fecha: 17-11-2026. Sin conexión a GitHub.

## Comprobaciones efectivamente ejecutadas

- `node --check` para `catalog.js`, `components.js`, `engine.js`, `export-payload.js` y `app.js`: OK.
- `npm run check`: **6/6 tests correctos**.
- Cobertura estática de **84/84 IDs** con renderizadores diferenciados, categoría y procedencia: OK.
- La carga del exportador coincide byte a byte con CSS, componente y motor originales de este paquete: OK.
- Verificación documental de `package.json`: 0 dependencias de npm.
- Servidor Node local: respuesta HTTP 200 desde `127.0.0.1:8099` mediante `curl`.

## Comprobaciones pendientes y limitación real

Se intentó abrir la app con Chromium/Playwright tanto desde `http://127.0.0.1:8099` como `file:///.../index.html`. Ambos accesos fallaron con **ERR_BLOCKED_BY_ADMINISTRATOR** por la política administrada del navegador de este entorno. No significa que la web tenga ese fallo; significa que no fue posible completar una prueba E2E en este navegador. Por tanto **no se declara una prueba funcional completa en navegador**.

El archivo `tests/browser-smoke.py` permite repetir la batería en un entorno con Chromium sin ese bloqueo. Incluye pruebas de búsqueda, inspector, favoritos, exportación HTML, interacción, consola y diseño móvil.

Quedan pendientes para una versión publicable una ejecución E2E en Chrome/Firefox/Edge de escritorio, auditoría de accesibilidad manual y contraste con dispositivos táctiles reales.

## Criterio de entrega

Se entrega un proyecto **funcional por diseño y validado estáticamente**, con 84 demostraciones originales y pruebas automáticas locales satisfactorias. El comportamiento interactivo extremo a extremo **no ha sido verificado por navegador en este entorno**.
