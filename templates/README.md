# MOTION-404 · Web Templates Studio

Ruta: `/templates/` · Inicio: enlace «Crear web completa» en la portada.

## Incluido

- Ocho páginas editables: Portfolio, Ecommerce, Dashboard, Gaming, Restaurante, Viajes, Automoción y Arquitectura.
- Modificación instantánea de marca, titular, descripción, CTA, destino, tema oscuro/claro y color.
- Vista previa aislada por `iframe.srcdoc` y selector de anchura móvil/escritorio.
- Exportación HTML y copia de código desde el navegador; no necesita cuenta, backend, CDN de scripts ni dependencias externas.
- Seguridad: textos escapados, URLs de botones restringidas a HTTP(S) o anclas seguras, y colores limitados a una paleta local.
- Reducción de movimiento mediante `prefers-reduced-motion`.

## Importante

- Las imágenes de muestra se enlazan a los recursos del repositorio publicado en GitHub Pages y **requieren conexión**. Sustitúyelas por tus propios recursos para una página offline.
- Los enlaces y bloques de producto son elementos de presentación; no implementan pagos, reservas, autenticación ni analítica.
- Las plantillas son una nueva funcionalidad independiente: no reemplazan el catálogo de 90 patrones ni el editor de proyectos existente.
- La exportación genera un único HTML editable con CSS integrado y sin JavaScript de terceros.
- Al elegir otra plantilla se restablecen los campos de edición de la anterior. Exporta primero el HTML si quieres conservar los cambios.

## Desarrollo

```bash
npm start
# abrir http://127.0.0.1:8080/templates/
npm run check
```

Comprobar manualmente cada plantilla en tamaños 390 px y escritorio, exportar HTML, abrirlo en una pestaña nueva y revisar que texto, estilos y enlaces son correctos. Para certificación completa también hay que probar Safari iOS y los lanzadores locales.
