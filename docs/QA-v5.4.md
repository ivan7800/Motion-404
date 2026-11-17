# QA MOTION-404 Ultimate Studio v5.4.0 RC1

Fecha: 17-11-2026. Entorno de ejecución: contenedor Linux x64, Node.js v22.16, Python 3.13, Chromium headless del sistema. **No es Linux Mint ni Windows 11; no hay dispositivo iOS conectado.**

## Ejecución y resultados

| Prueba | Resultado | Alcance exacto |
| --- | --- | --- |
| `npm run check` | **66/66 PASS** | Sintaxis JS y pruebas automatizadas de editor, grupos, keyframes, exportaciones, migración, core v2 y puente/importador nuevo |
| `npm run qa:device` | **190 PASS** | Preflight en Linux: Node y Python sirven 32 rutas HTTP con MIME/404 correctos; iconos, manifiesto y recursos estáticos |
| `python3 tests/browser-v4-synthetic.py` | **PASS** | Chromium con DOM inyectado: patrones, exportación, migración, responsive |
| `python3 tests/browser-v52.py` | **PASS** | Chromium con DOM inyectado: Timeline/keyframes, HUD, selección múltiple y exportación |
| `python3 tests/browser-v53.py` | **PASS** | Chromium con DOM inyectado: grupos geométricos, arrastre real y guardado, HTML/JSX exportado, móvil emulado |
| Importación con fixture local | **PASS 3/3** | Copia reversible, integración generada, API de runtime y protección del original |
| `npm run qa:legacy` | **BLOCKED (código 2)** | Faltan archivos originales en el paquete; sin clonado GitHub en el contenedor |
| `tests/browser-smoke.py` | **NO EJECUTABLE aquí** | Instalación Playwright no incluye Chromium empaquetado; además la navegación localhost está bloqueada |
| Navegación HTTP desde Chromium | **BLOCKED** | `net::ERR_BLOCKED_BY_ADMINISTRATOR` incluso contra localhost y `file://` |
| Windows 11 BAT doble clic | **NO PROBADO** | No existe dispositivo Windows 11 accesible |
| Linux Mint Cinnamon | **NO PROBADO** | El contenedor Linux no equivale a Linux Mint ni prueba `xdg-open` real |
| Safari/iPhone PWA | **NO PROBADO** | No hay un dispositivo Apple ni HTTPS staging accesibles |
| PWA instalada y offline real | **NO PROBADO** | El preflight HTTP y las simulaciones de SW no prueban instalación/actualización real |

## Integración

La candidata proporciona un importador seguro, script puente original y reutilización de generador lógico. Conserva los archivos históricos JS/CSS sin sobrescribir y adapta la copia en un JS separado. **No se puede afirmar que se haya incorporado físicamente el runtime completo en este paquete:** la copia de origen requiere `npm run import:original` desde otro equipo o disponer del checkout completo.

El antiguo DOM se muestra dentro de Ultimate y usa el generador original en el panel Motion DNA una vez importado. La refactorización a un DOM único sigue pendiente.

## Gate para publicar

NO PUBLICAR EN `main` hasta: (1) importar físicamente el repositorio y confirmar el SHA del original; (2) ejecutar `npm run qa:legacy` y documentar las 90 comprobaciones; (3) ejecutar el checklist de Windows, Linux Mint, Safari/iPhone y PWA offline contra staging HTTPS, conservando evidencia; (4) validar proyectos y sistemas existentes sin pérdida de datos. No se ha hecho push, commit ni PR.
