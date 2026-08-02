# Despliegue en GitHub Pages

1. Sube el contenido de esta carpeta a la raíz de la rama principal del repositorio `Motion-404`.
2. Abre **Settings → Pages**.
3. Selecciona **Deploy from a branch**, la rama principal y `/ (root)`.
4. Espera a que GitHub publique `https://ivan7800.github.io/Motion-404/`.
5. Abre DevTools y comprueba que no existen errores 404 ni excepciones.
6. En **Application**, confirma manifest, iconos, `start_url`, `scope` y registro de `sw.js`.
7. Recarga una vez, activa modo offline y vuelve a cargar.
8. Publica una modificación menor, vuelve a abrir y confirma que la caché anterior se elimina.
9. Comprueba instalación y modo standalone en escritorio y móvil.
10. Valida `robots.txt`, `sitemap.xml` y la previsualización social.

Tras cambios de archivos críticos, incrementa la versión de `CACHE` en `sw.js` y regenera `Motion-404-PORTABLE.html`.
