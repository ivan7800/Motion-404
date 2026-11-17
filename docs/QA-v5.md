# MOTION-404 Ultimate Studio v5 beta — QA y límites

## Cambios implementados
- Panel de capas seleccionables sincronizado con el lienzo.
- Historial deshacer/rehacer (hasta 80 pasos), accesible por Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y.
- Copiar/pegar bloques dentro del editor y duplicación con identificadores nuevos.
- Se conserva el modelo de proyectos v4, sus exportaciones y la importación de backups v2.
- Actualización de versión visible y caché PWA para evitar recursos antiguos.

## Pruebas
- `npm run check`: sintaxis JS y pruebas unitarias/estructurales.
- `python tests/browser-v4-synthetic.py`: navegador Chromium con DOM real, recursos insertados en about:blank, sin red. Incluye operaciones nuevas de capas, deshacer, rehacer y portapapeles.
- El navegador HTTP real, el service worker offline y el BAT de Windows 11 **no** se han validado en equipo real.

## Bloqueantes para reemplazar producción
1. El código de `Motion-404` v2.0.2 **no está físicamente fusionado**: la copia `original/` requiere `npm run import:original` con red y Git, y permanece como app separada. Los datos v2 sí pueden migrarse mediante JSON.
2. El Timeline existente no dispone aún de edición gráfica de keyframes con scrub y curvas Bézier.
3. No hay selección múltiple ni guías inteligentes de alineación.
4. No se han repetido en el runtime fusionado las 90 comprobaciones de navegador del original.
5. No hay QA completa en Windows 11, Linux Mint, Safari, móvil ni actualización PWA real.

**Veredicto:** beta local, no sustituir `main`.
