# Testing — Motion 404 v2.0.1

## Comprobaciones automáticas mínimas

```bash
node --check motion-v2.js
node --check motion-v2.0.1-preflight.js
node --check motion-v2.0.1-patch.js
node --check sw.js
```

Valida además `manifest.webmanifest` como JSON.

## Regresión funcional manual

### Preset Library

- Carga inicial: 180 presets totales, 18 visibles.
- Buscar por texto.
- Filtrar por categoría.
- Filtrar por Motion DNA.
- Limpiar filtros.
- Mostrar más.
- Sorpréndeme.
- `Usar preset` debe rellenar Motion Studio.
- `DNA` debe generar una salida válida.

### Motion Studio

- Cambiar todos los selects.
- Intensidad 1–5.
- Activar/desactivar las seis capacidades.
- Verificar que Motion Inspector cambia riesgo y recomendaciones.
- Generar Motion System.
- Abrir las cuatro tabs.
- Navegar tabs con flechas, Home y End.
- Copiar salida.
- Descargar Markdown.

### Persistencia

- Guardar sistema.
- Recargar página y comprobar persistencia.
- Abrir guardado y comprobar que formulario y salida se sincronizan.
- Eliminar sistema.
- Exportar JSON.
- Importar JSON válido.
- Intentar importar JSON corrupto y confirmar rechazo sin romper la app.

### PWA / Offline

- Confirmar registro de `sw.js`.
- Confirmar cache `motion-404-v2.0.1`.
- Recargar una vez para tomar control del Service Worker.
- Pasar a offline y recargar.
- La shell debe seguir cargando.

### Accesibilidad

- Navegación completa por teclado.
- Foco visible.
- Zoom 200%.
- `prefers-reduced-motion: reduce`.
- Táctil sin dependencia de hover/cursor.

### Responsive

Probar al menos:

- 320–430 px.
- 700 px.
- 1050 px.
- escritorio ancho.

## Estado QA de la release

Consulta `QA-REPORT.md`.

La suite estructural disponible pasó 24/24 y la lógica de generación pasó completa. La validación Chromium headless del entorno quedó bloqueada por política organizativa del navegador, por lo que los clics físicos en ese navegador deben comprobarse manualmente en un navegador normal.