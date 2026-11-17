# Motion 404 v2.0.1 — Motion Design System

**Motion 404** es una herramienta local-first para definir un sistema de movimiento web antes de implementarlo: **Motion DNA + Motion Spec + Timeline + Performance/Accessibility QA**.

🌐 Producción: https://ivan7800.github.io/Motion-404/

## Qué incluye

- **180 presets** de partida.
- **6 perfiles Motion DNA**: Cinematic, Minimal, Kinetic, Editorial, Brutalist y Spatial.
- Intensidad 1–5, ritmo y profundidad 2D / capas / espacial.
- **Motion Inspector** con riesgo GPU/CPU, carga cognitiva y accesibilidad.
- **Motion Spec** exportable con tokens, reglas, performance budget y Definition of Done.
- **Timeline** adaptado a las capacidades seleccionadas.
- **QA predictivo** con warnings de sobreanimación, 3D, cursor effects y tipografía cinética.
- Guardado local de hasta 50 Motion Systems.
- Importación/exportación JSON validada.
- Tema oscuro/claro.
- PWA y modo offline.
- Sin cuentas, backend, cookies ni telemetría.

## Uso

1. Abre la biblioteca y elige un preset o entra directamente en **Motion Studio**.
2. Define sector, stack, dirección visual, Motion DNA, ritmo, profundidad e intensidad.
3. Activa únicamente las capacidades necesarias.
4. Revisa el **Motion Inspector** y reduce riesgo si aparece MEDIO/ALTO.
5. Genera el sistema.
6. Revisa **Motion DNA**, **Motion Spec**, **Timeline** y **Performance / A11y QA**.
7. Guarda localmente o descarga el sistema en Markdown.

## Arquitectura

Aplicación estática preparada para GitHub Pages:

```text
index.html
motion-v2.css
motion-v2.js
motion-v2.0.1-preflight.js
motion-v2.0.1-patch.js
manifest.webmanifest
sw.js
assets/
```

`motion-v2.0.1-preflight.js` sanea el estado local antes del arranque. `motion-v2.0.1-patch.js` añade el hardening de la release 2.0.1, validación estricta de backups, sincronización de sistemas guardados, versión de exportación y registro PWA.

## Privacidad

Motion 404 procesa y guarda datos en el navegador. No necesita cuenta, servidor propio ni telemetría. Los sistemas guardados permanecen en `localStorage` hasta que el usuario los exporta o elimina.

## Accesibilidad y rendimiento

- `prefers-reduced-motion`.
- Foco visible.
- Navegación por teclado en tabs.
- Breakpoints específicos para móvil.
- Recomendación de `transform`/`opacity` frente a propiedades que fuerzan layout.
- Fallback obligatorio para experiencias 3D pesadas.
- Política CSP restrictiva; scripts inline deshabilitados.

## QA v2.0.1

- QA estructural: **24/24 PASS**.
- QA de lógica: **PASS**.
- 180 presets e IDs únicos validados.
- Escenario de riesgo mínimo/extremo: **6 → 83**.
- QA predictivo mínimo/extremo: **100 → 55**.
- Imports corruptos y features desconocidas rechazados.
- Manifest y Service Worker actualizados para la release oficial.

Consulta `QA-REPORT.md` para las evidencias y la limitación del navegador headless del entorno de pruebas.

## Rollback

Commit anterior a la promoción oficial de v2.0.1:

```text
c82ec8b5ec970bbe72f640f9ab7f04ad8d5ba08b
```

## Licencia

Consulta `LICENSE`.
