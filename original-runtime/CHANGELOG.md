# Changelog

## [2.0.1] — 2026-09-13

### Release oficial — Motion Design System

- Promovido Motion 404 v2 como `index.html` oficial de GitHub Pages.
- Evolución de biblioteca de prompts a sistema de diseño de movimiento con **Motion DNA + Motion Spec + Timeline + Performance/Accessibility QA**.
- 180 presets y 6 perfiles Motion DNA: Cinematic, Minimal, Kinetic, Editorial, Brutalist y Spatial.
- Motion Inspector con estimación de riesgo GPU/CPU, carga cognitiva, accesibilidad y sobreanimación.
- Generación de Motion Spec con tokens, contrato por componentes, presupuesto de rendimiento y Definition of Done.
- Timeline adaptado a ritmo, intensidad, profundidad y capacidades activadas.
- QA predictivo y recomendaciones de reduced motion, touch, 3D, tipografía cinética y cursor effects.

### Hardening

- Añadido preflight defensivo de `localStorage` antes de arrancar el motor.
- Endurecida la validación de importaciones JSON y sistemas guardados.
- Sistemas corruptos o con features desconocidas se rechazan sin romper la interfaz.
- Al reabrir un sistema guardado, formulario y salida vuelven a quedar sincronizados.
- Exportaciones JSON identificadas como v2.0.1.
- Restaurado y actualizado el registro PWA para la nueva arquitectura.
- Manifest actualizado a Motion Design System.
- Service Worker actualizado a caché `motion-404-v2.0.1` con shell y scripts v2.
- CSP mantiene scripts inline deshabilitados y permite únicamente los atributos de estilo dinámicos necesarios por el motor visual.

### QA

- QA estructural: 24/24 PASS.
- QA de lógica: PASS.
- 180 presets e IDs únicos verificados.
- Riesgo predictivo probado de 6/100 en configuración contenida a 83/100 en escenario extremo.
- QA predictivo probado de 100/100 a 55/100 en escenario extremo.
- `prefers-reduced-motion`, breakpoints, manifest, cache offline y rutas de GitHub Pages comprobados de forma estructural.
- La prueba física con Chromium headless del entorno quedó bloqueada por una política organizativa que impide abrir `localhost` y `file://`; no se atribuye ese bloqueo a Motion 404 ni se inventan resultados de interacción.

### Rollback

- Punto anterior a la promoción oficial: `c82ec8b5ec970bbe72f640f9ab7f04ad8d5ba08b`.

## [1.3.1] — 2026-08-02

### Corregido
- La búsqueda ya ignora tildes y diacríticos: `aplicacion`, `automocion`, `tipografia` y `diseno` encuentran sus equivalentes acentuados.
- El número de sectores se calcula desde el catálogo real en lugar de estar codificado manualmente.
- `tests/smoke.py` obtiene la versión vigente desde el changelog y la contrasta con README y Service Worker.
- El enlace de documentación abre el diálogo interno, válido también en GitHub Pages y en la versión portátil.

### Mejorado
- Logo convertido de PNG a WebP: aproximadamente 464 KB → 81 KB.
- Iconos PWA cuantizados sin cambiar dimensiones ni rutas: aproximadamente 576 KB → 125 KB.
- Eliminado CSS obsoleto de las antiguas previsualizaciones `.card-mock`.
- Caché PWA actualizada a `v1.3.1` y versión portátil regenerada.
- Añadidas regresiones automáticas para búsquedas sin tildes y coherencia de versión.

## 1.3.0 — 2026-08-02

### Corregido

- Eliminada una condición duplicada en la navegación por teclado de las pestañas del diálogo.
- Eliminado el aviso de consola al fallar el registro del Service Worker; ahora se informa de forma accesible en la interfaz.

### Mejorado

- Añadido estado accesible de conexión: avisa cuando la aplicación queda sin red y cuando la conexión vuelve.
- Renovada la estrategia PWA: navegación `network-first` y recursos estáticos `stale-while-revalidate`.
- Añadida la captura social a la precaché y actualizada la caché a `v1.3.0`.
- Mostrada la versión real de la aplicación en el pie y en “Acerca de”.
- Ampliadas las pruebas automáticas para cubrir el estado online/offline y la nueva estrategia de caché.
- Regenerada la versión portátil desde los archivos fuente.

## 1.2.1 — Preparación pública y operativa

- Añadidos canonical, Open Graph y Twitter Card con URL pública estable.
- Añadidos `robots.txt` y `sitemap.xml`.
- Añadida documentación específica de seguridad, privacidad, pruebas, despliegue y riesgos conocidos.
- Incrementada la versión de caché del Service Worker para publicar los metadatos nuevos sin conservar el shell anterior.


## 1.2.1 — 2026-08-02

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
