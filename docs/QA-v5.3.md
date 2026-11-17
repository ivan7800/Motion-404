# MOTION-404 Ultimate Studio v5.3.0 — informe QA local

## Alcance

Edición de `MOTION-404-ULTIMATE-STUDIO-V5.2`, sin cambios en GitHub. Se incorporan contenedores geométricos, modo libre, arrastre, cuadrícula de 8px, guías magnéticas y exportación con su geometría. El core original v2.0.2 portado incluye los seis perfiles completos, 180 presets, riesgo, recomendaciones, timeline, score predictivo, 11 apartados de Motion Spec y generador de sistemas. **No se ha copiado ni fusionado todo `motion-v2.0.2.js` ni su interfaz DOM original.**

## Pruebas realizadas en el entorno de generación

| Prueba | Resultado | Alcance real |
|---|---|---|
| `npm run check` | **62 PASS, 0 FAIL** | Node, unitarias/regresión, sin hardware |
| `python3 tests/browser-v4-synthetic.py` | **PASS** | DOM Chromium aislado; 84 patrones, puentes, exportación, migración, móvil |
| `python3 tests/browser-v52.py` | **PASS** | DOM Chromium aislado; DNA v2, Timeline, HUDs, keyframes y export HTML |
| `python3 tests/browser-v53.py` | **PASS** | DOM Chromium aislado; grupos físicos, inspector, arrastre real por mouse, HTML y JSX, viewport móvil y 0 JS exceptions |
| `npm run qa:device` | **188 PASS** | Dos servidores HTTP reales: Node y Python; rutas, MIME, precaché, iconos PNG y manifest |
| JSX React exportado | **0 errores sintácticos** | Transpilado con TypeScript local, NO ejecución React/Vite en proyecto completo |
| `bash -n INICIAR_LINUX.sh` | **PASS** | Sintaxis del shell, NO Mint real |
| `python3 -m py_compile tools/launch.py` | **PASS** | Sintaxis Python, NO GUI |

### Limitaciones / bloqueantes de publicación

1. **Fusión original incompleta:** motor funcional de Motion DNA portado, no runtime DOM original completo. Los **90 checks históricos originales** siguen **NO EJECUTADOS en v5.3**. La comprobación original en GitHub Actions no acredita esta nueva versión.
2. **Dispositivos reales NO PROBADOS:** Windows 11 BAT con doble clic, Linux Mint GUI, Safari/iPhone, PWA instalada y actualización offline.
3. **Navegador en HTTP local restringido por políticas del entorno:** las pruebas Chromium se hacen con DOM real y scripts/estilos inyectados, no con navegación normal mediante URL HTTP y SW real. Se comprueba HTTP 200/MIME por separado.
4. **Exportación React:** JSX transpila, pero falta prueba de build/ejecución completa con React/Vite y test de eventos del producto consumidor.
5. **Grupos v5.3:** agrupación física responsive y arrastre libre probados; no hay auto-layout complejo estilo Figma ni constraints/cambios por breakpoint individuales.

## Trazabilidad

- Código fuente histórico original: `https://github.com/ivan7800/Motion-404/blob/main/motion-v2.0.2.js` (consultado en GitHub conectado).
- No se han modificado ramas ni archivos remotos.
- Los datos usan `motion404-ultimate-v4-projects` y esquema `4` para proyectos Ultimate; `motion404-v2-state` se preserva para importación de sistemas originales.
- `npm run qa:device` proporciona una batería repetible de prerrequisitos PWA. Protocolo de aceptación en [`QA-DISPOSITIVOS-v5.3.md`](QA-DISPOSITIVOS-v5.3.md).

**Decisión:** candidata local de pruebas; **NO certificada para reemplazar la versión pública**.
