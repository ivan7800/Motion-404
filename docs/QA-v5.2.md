# MOTION-404 Ultimate Studio v5.2.0 RC1 — Informe de calidad

**Fecha:** 17 de noviembre de 2026. **Destino:** paquete local, sin publicación en GitHub.

## Alcance de cambios

1. **Núcleo original v2.0.2 portado parcialmente:** `src/motion-v2-core.js` incorpora los 30 conceptos y el generador de 180 presets (IDs `m404-001…180`), las fórmulas de `riskFrom`, recomendaciones, timeline planificado y `buildQa` tomados del repositorio original Motion-404. Motion DNA Lab consume estos datos y presenta riesgo y puntuación QA. **Esto NO incluye el runtime DOM, la UI ni la cadena de 90 pruebas de navegador de la app original.** La carpeta `original/` puede llenarse mediante `npm run import:original` en un equipo con red y Git; sigue siendo una aplicación aparte hasta completar la refactorización.
2. **Timeline WAAPI verdadero:** `src/keyframes.mjs` y `src/timeline-pro.mjs`, máximo 12 keyframes por bloque, opacidad, traslación XY, escala, 8 easings, control play/pause/stop, scrub, edición y arrastre de los keyframes interiores. El editor escribe los datos normalizados en el proyecto y genera exportaciones con animación funcional.
3. **Visual Composer:** selección múltiple por Ctrl/⌘/Shift + clic, seleccionar todos, agrupar lógicamente, desagrupar, alinear y cambiar ancho en lote. Continúan drag/drop, historial 80 estados, inspector, biblioteca de 84 patrones, vista móvil y exportaciones.
4. **Game UI Forge integrado en el Composer:** tres HUD originales personalizables (terror/cordura, fantasía/maná, ciencia ficción/escudos). Son diseños DOM/CSS con porcentajes de estado, exportables sin red.
5. **PWA:** caché `motion-404-ultimate-v5.2-rc1`, archivos nuevos precargados, eliminación limitada a cachés de esta aplicación y error de recurso real en lugar de HTML para JS faltante.
6. **Migración:** se conserva `motion404-ultimate-v4-projects` (schema 4) y la clave legacy `motion404-v2-state`. Importación de backups JSON con validación y duplicados no destructiva. No existe transferencia automática entre distintos orígenes (localhost y GitHub Pages).

## Pruebas ejecutadas en el entorno

| Comprobación | Resultado | Alcance real |
|---|---|---|
| `npm run check` | **48/48 PASS** | Sintaxis, catálogos, datos v2, keyframes, exportación, HUDs, backup, launcher Node, PWA simulada |
| `python3 tests/browser-v4-synthetic.py` | **PASS** | Chromium real con DOM inyectado (sin navegación HTTP), regresión de edición, patrones, bridges, HTML/ZIP, migración |
| `python3 tests/browser-v52.py` | **PASS** | Chromium real con DOM inyectado, 180 presets v2, 3 HUDs, selección múltiple, grupos, alineación, timeline, render HTML animado, móvil |
| Sintaxis JSX con transpiler TypeScript | **PASS: 0 diagnósticos** | Compilación sintáctica, no integración en un proyecto React completo |
| `node --check`, `bash -n`, `python -m py_compile` | **PASS** | Archivos probados, no doble clic en Windows real |
| ZIP de release | **PASS** | `zipfile.testzip()`, inventario y SHA-256 en la entrega |

**Importante:** Chromium se ejecutó sobre `about:blank` con HTML/CSS/JS inyectados, por restricciones administrativas que bloquean navegación localhost. Esto verifica un DOM real e interacciones, pero **no demuestra** instalación real del Service Worker ni PWA offline en un dispositivo real. Los tests PWA simulan los eventos y respuestas.

## Limitaciones abiertas / criterios de publicación

- **Bloqueante 1 — fusión completa:** Portado el núcleo de presets/riesgo/QA, pero **no** el runtime y UI original v2.0.2 en un único motor. No se han reejecutado las 90 pruebas originales en la versión fusionada.
- **Bloqueante 2 — navegadores y SO reales:** Sin pruebas de doble clic BAT en Windows 11, doble clic shell en Mint, Safari/iOS, Android, lectores de pantalla, ni reinstalación/actualización PWA sobre el origen público.
- **Bloqueante 3 — React completo:** JSX transpila, pero falta construir/probar un proyecto React/Vite final e instalarlo en dispositivo objetivo.
- **Limitación de edición:** Los grupos son metadatos de selección y operación en lote; todavía no son contenedores con transformaciones geométricas propias. Las guías inteligentes de píxeles/snap no están implementadas.
- **Rendimiento:** No hay métricas Web Vitals, FPS prolongado, consumo de memoria ni prueba de 100 bloques en dispositivos de gama baja.
- **Accessibility:** Existen teclado, controles nativos, reduced-motion y etiquetas, pero falta auditoría con lector de pantalla y WCAG manual.

**Veredicto:** v5.2 **Release Candidate local**. Es un avance sustancial y demostrable sobre la beta v5, pero NO es correcto garantizar aún superioridad global respecto a v2.0.2 ni reemplazar `main`.

## Ejecución reproducible

```bash
npm run check
python3 tests/browser-v4-synthetic.py
python3 tests/browser-v52.py
bash -n INICIAR_LINUX.sh
python3 -m py_compile tools/launch.py
```

Las pruebas Chromium necesitan Python Playwright + navegador Chromium instalado. Las pruebas Node usan módulos estándar de Node.js 20+ y no instalan dependencias. La aplicación se sirve en `localhost` con `INICIAR_WINDOWS.bat`, `INICIAR_LINUX.sh` o `node server.mjs`. No requiere Internet para el estudio integrado, siempre que los archivos estén presentes.
