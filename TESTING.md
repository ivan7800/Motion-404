# Pruebas

## Preparación

```bash
python -m pip install -r requirements-dev.txt
playwright install chromium
```

## Ejecución

```bash
python tools/build_portable.py --check
python tests/static_check.py
python tests/portable_smoke.py
python tests/functional_audit.py
python tests/smoke.py
```

## Cobertura

- Estructura, rutas locales, sintaxis JavaScript, manifest y Service Worker.
- Renderizado de la edición portable.
- Búsqueda, filtros, favoritos, diálogos, generador, copia, descarga, importación, exportación, borrado, tema y persistencia simulada.
- Teclado, foco, ancho de 320 px, reducción de movimiento y ausencia de JavaScript.
- La prueba HTTP añade registro del Service Worker y modo offline.

## Matriz manual pendiente

Validar en la URL HTTPS publicada: Chrome, Edge, Firefox, Safari, Chrome Android y Safari iOS; instalación, actualización de caché, modo standalone, rotación, zoom al 200 % y lector de pantalla.
