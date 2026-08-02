# Changelog

## 1.2.0 — 2026-08-02

- Integrado el icono original Universo 404 en cabecera, pie, favicon y PWA.
- Sustituidas las previsualizaciones abstractas por ocho miniaturas fotorealistas locales.
- Añadida selección contextual de imagen por sector y fallback determinista.
- Mejoradas las vistas de tarjeta y diálogo, con lazy loading y prevención de CLS.
- Actualizada la caché offline y los iconos del manifest.
- Revisadas rutas, CSP, assets y regresiones funcionales.


## 1.1.1 — 2026-08-02

### Corregido

- El botón **Instalar** permanece oculto hasta recibir `beforeinstallprompt`; ya no se muestra como control inerte en contextos no instalables.
- El Service Worker elimina únicamente cachés propias de Motion 404 y deja intactas las cachés de otras aplicaciones alojadas en el mismo dominio.
- Las lecturas runtime del Service Worker quedan aisladas en la caché de Motion 404.
- Al alcanzar el límite de 200 prompts personalizados se eliminan también los favoritos que apuntaban al elemento expulsado.
- El nombre del proyecto rechaza valores formados solo por espacios.
- El fallback de copia gestiona navegadores donde `execCommand('copy')` lanza una excepción.
- El foco se conserva al marcar una tarjeta como favorita y vuelve a un control válido si la tarjeta desaparece.
- Las pestañas del diálogo envuelven correctamente con flechas y soportan `Home` y `End`.
- Los resultados generados reciben foco programático y los controles móviles del pie tienen áreas táctiles mayores.
- Se eliminó la afirmación visual “A11y ready” y se añadió un aviso útil cuando JavaScript está desactivado.
- El lanzador BAT usa un arranque más simple y menos sensible a rutas con espacios.

### Pruebas

- Regresiones para caché compartida de GitHub Pages, botón de instalación, límite de datos, foco, validación en blanco, fallback de copia, arranque con almacenamiento corrupto o bloqueado y ejecución sin JavaScript.
- Comprobación de todos los enlaces locales e internos.
- Captura PWA actualizada desde la versión corregida.

## 1.1.0 — 2026-08-02

### Corregido

- El Service Worker ya no puede sustituir la caché de `index.html` con una navegación a `README.md` u otro recurso.
- Los estados corruptos o manipulados de `localStorage` se normalizan antes de renderizar y dejan de poder romper el catálogo.
- La importación valida la identidad del backup, limita y normaliza campos, gestiona errores de lectura y solicita confirmación antes de sustituir datos.
- Las operaciones informan cuando el almacenamiento está bloqueado y los cambios solo durarán durante la sesión.
- Contraste del texto naranja en el tema claro.
- Nombre accesible de diálogos y navegación por teclado de las pestañas.
- Color `theme-color` sincronizado con el tema activo.
- Descargas Blob con revocación diferida para mejorar compatibilidad.
- Lanzador BAT con detección de puerto libre, comprobación de arranque y fallback portátil.

### Añadido

- Borrado de datos locales desde la interfaz.
- `id`, dirección y captura de pantalla en el manifest PWA.
- Generador reproducible de la versión portátil con CSP basada en hashes.
- Prueba funcional ampliada de seguridad, validación, accesibilidad, importación, responsive y movimiento reducido.
- `.gitignore` y limpieza de recursos obsoletos.

## 1.0.1 — 2026-08-02

### Corregido

- Pantalla vacía al abrir `index.html` directamente mediante `file://`.
- `app.js` deja de cargarse como módulo y pasa a ser un script clásico con `defer`.
- El contenido permanece visible si JavaScript no llega a ejecutarse.
- El Service Worker ya no intenta registrarse fuera de HTTP/HTTPS.

### Añadido

- Lanzador `ABRIR-MOTION-404.bat` para Windows.
- Pruebas de regresión específicas para el arranque local.

## 1.0.0 — 2026-08-02

- Primera versión funcional.
- Catálogo de 180 prompts originales.
- Filtros, búsqueda, favoritos y selección aleatoria.
- Generador de prompts personalizados.
- Exportación/importación local y descarga Markdown.
- Tema claro/oscuro, accesibilidad, responsive y PWA offline.
