# Despliegue — Motion 404 v2.0.1

Producción: `https://ivan7800.github.io/Motion-404/`

## GitHub Pages

1. Publica la rama `main` desde `/ (root)` mediante **Settings → Pages → Deploy from a branch**.
2. Confirma que la raíz sirve `index.html`, que desde v2.0.1 corresponde a **Motion Design System**.
3. Comprueba que cargan sin 404: `motion-v2.css`, `motion-v2.js`, `motion-v2.0.1-preflight.js`, `motion-v2.0.1-patch.js`, `manifest.webmanifest`, `sw.js`, iconos y `assets/universo-404.webp`.
4. En DevTools → Console confirma ausencia de excepciones y bloqueos CSP.
5. En DevTools → Application confirma manifest, iconos, `start_url`, `scope` y registro de `sw.js`.
6. Recarga una vez para que el Service Worker tome control.
7. Confirma la caché `motion-404-v2.0.1`.
8. Activa modo offline y recarga: la shell principal debe seguir disponible.
9. Prueba instalación/standalone en escritorio y móvil cuando el navegador lo permita.
10. Verifica `robots.txt`, `sitemap.xml` y metadatos sociales.

## Regresión obligatoria tras cambios críticos

Si se modifica `index.html`, scripts, CSS, manifest o assets precacheados:

- incrementa la versión `CACHE` en `sw.js`;
- añade o elimina entradas de `CORE` según corresponda;
- ejecuta las pruebas de `TESTING.md`;
- comprueba la subruta de GitHub Pages, recarga y offline;
- actualiza `CHANGELOG.md` y `QA-REPORT.md` si cambia comportamiento.

## Rollback

Punto estable anterior a la promoción oficial de v2.0.1:

```text
c82ec8b5ec970bbe72f640f9ab7f04ad8d5ba08b
```

Para una reversión de emergencia, restaura el árbol de ese commit y vuelve a publicar `main`. Después fuerza una nueva versión de cache si se conserva el Service Worker de v2 en clientes ya visitados.

## Nota sobre la versión portátil

`Motion-404-PORTABLE.html` pertenece a la línea v1.x y no representa todavía Motion Design System v2.0.1. No debe anunciarse como equivalente funcional de la release web hasta regenerarlo específicamente desde la arquitectura v2.
