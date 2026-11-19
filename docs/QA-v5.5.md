# QA MOTION-404 Ultimate Studio v5.5.0 RC

Fecha: 17-11-2026. Entorno de ejecución: contenedor Linux x64, Node.js v22.16, Python 3.13, Chromium headless del sistema. **No es Linux Mint ni Windows 11; no hay dispositivo iOS conectado.**

## Ejecución y resultados

| Prueba | Resultado | Alcance exacto |
| --- | --- | --- |
| `npm run check` | **71/71 PASS** | Sintaxis JS y pruebas automatizadas de biblioteca, editor, grupos, keyframes, exportaciones, migración, core v2 y puentes |
| `npm run qa:device` | **PASS** | Preflight local de Node y Python con recursos existentes, MIME, CSP, manifiesto y 404 |
| `python3 tests/browser-v4-synthetic.py` | **PASS** | Chromium con DOM inyectado: patrones, exportación, migración, responsive |
| `python3 tests/browser-v52.py` | **PASS** | Chromium con DOM inyectado: Timeline/keyframes, HUD, selección múltiple y exportación |
| `python3 tests/browser-v53.py` | **PASS** | Chromium con DOM inyectado: grupos geométricos, arrastre real y guardado, HTML/JSX exportado, móvil emulado |
| Importación con fixture local | **PASS 3/3** | Copia reversible, integración generada, API de runtime y protección del original |
| `npm run qa:legacy` | **PENDIENTE** | La suite histórica requiere completar su flujo de importación y ejecutar el navegador específico |
| `tests/browser-smoke.py` | **NO EJECUTABLE aquí** | Instalación Playwright no incluye Chromium empaquetado; además la navegación localhost está bloqueada |
| Navegación HTTP desde Chromium | **BLOCKED** | `net::ERR_BLOCKED_BY_ADMINISTRATOR` incluso contra localhost y `file://` |
| Windows 11 BAT doble clic | **NO PROBADO** | No existe dispositivo Windows 11 accesible |
| Linux Mint Cinnamon | **NO PROBADO** | El contenedor Linux no equivale a Linux Mint ni prueba `xdg-open` real |
| Safari/iPhone PWA | **NO PROBADO** | No hay un dispositivo Apple ni HTTPS staging accesibles |
| PWA instalada y offline real | **NO PROBADO** | El preflight HTTP y las simulaciones de SW no prueban instalación/actualización real |

## Integración

La release mantiene el runtime histórico en `original-runtime/`, separado del estudio moderno. El puente comunica el origen controlado y el código de migración comparte datos sin escribir las claves históricas. Esta arquitectura protege compatibilidad y permite integrar progresivamente presets, exportaciones y migraciones sin fusionar el DOM antiguo.

El antiguo DOM se muestra dentro de Ultimate y usa el generador original en el panel Motion DNA una vez importado. La refactorización a un DOM único sigue pendiente.

## Estado de certificación

La aplicación está publicada como RC. La validación automatizada de código, recursos, biblioteca, editor, exportaciones y navegación pasa. La certificación física de Windows 11, Linux Mint, Safari/iPhone y PWA instalada sigue marcada como NO PROBADO y requiere ejecutar `docs/QA-DISPOSITIVOS-v5.5.md` con evidencia del dispositivo.
