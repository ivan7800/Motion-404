# MOTION-404 ULTIMATE STUDIO v5.5.0 RC — GitHub Pages

Suite local-first con 90 patrones, editor visual de grupos geométricos y ajuste magnético, Timeline con keyframes, HUDs, importación v2, React y exportación HTML/CSS/JS/ZIP.

## Biblioteca interactiva v5.5

- **90 demostraciones:** 84 patrones de referencia y seis diseños originales nuevos (Spotlight card, Disclosure stack, Orbit selector, Split reveal, Ripple action y Flip counter).
- Acceso a código y prompts desde las tarjetas; inspector con cuatro variantes, comparación con el original, enlace directo y HTML autónomo.
- Favoritos con sus ajustes: exportación e importación JSON, fusionando la colección del navegador. Los ajustes de componentes coincidentes se actualizan con los del archivo importado.
- Movimiento reducido global y por componente, animaciones fuera de pantalla en pausa, confirmación mantenida con teclado y conservación del foco al interactuar.
- Los seis componentes nuevos también están disponibles como patrones dentro del compositor visual.

Abre [la biblioteca](https://ivan7800.github.io/Motion-404/#catalog) y pulsa **6 nuevos · Originals**. Los enlaces de componente identifican el patrón; para compartir tus ajustes, exporta el HTML o la copia de guardados.

Para regenerar los recursos autocontenidos tras editar motor/componentes/CSS: `npm run build:exports`. La suite detecta cualquier desincronización. QA del navegador: `npm run qa:library` (Playwright y Chromium; variables `MOTION_URL`, `CHROMIUM_PATH` y `MOTION_QA_OUTPUT`).

## Estado importante

**La versión web del repositorio incorpora físicamente Motion-404 v2.0.2 en `/original-runtime/`**, con su JavaScript, CSS, recursos y pruebas originales conservados. Ultimate se publica en `/` y muestra el DOM original dentro de un panel del mismo origen. El código histórico permanece independiente; no se ha refactorizado a un único DOM.

**No se ha certificado hardware Windows 11, Linux Mint ni iPhone/Safari.** Ver `docs/QA-v5.5.md` y `docs/QA-DISPOSITIVOS-v5.5.md`. La versión web se publica como **RC** por petición expresa, con pruebas físicas de Windows 11, Linux Mint y Safari/iPhone todavía pendientes.

## Arranque del estudio

- **Windows 11:** descomprime y ejecuta `INICIAR_WINDOWS.bat`.
- **Linux Mint:** `bash INICIAR_LINUX.sh`.
- **Manual:** `npm start`; en ausencia de Node, `python3 tools/launch.py`.

Los lanzadores utilizan `127.0.0.1`, normalmente en el puerto 8080 o en otro disponible. El almacenamiento del navegador es **por origen y puerto**. Al cambiar de puerto pueden parecer ausentes tus proyectos; usa la copia JSON antes de actualizar.

## Incorporar realmente el runtime original v2.0.2

**Solo para paquetes locales sin los archivos originales:**

**Windows:** ejecuta `INSTALAR_MOTOR_ORIGINAL_WINDOWS.bat` (requiere Git y Node.js).

**Linux:** `bash INSTALAR_MOTOR_ORIGINAL_LINUX.sh`.

Alternativa en ambos sistemas:

```bash
npm run import:original
```

O, con una copia de GitHub ya descargada:

```bash
npm run import:original -- --source /ruta/a/Motion-404
```

El importador valida la estructura v2.0.2, copia íntegramente los archivos del repositorio, conserva la versión original de `motion-v2.0.2.js` y produce un `motion-v2.0.2.integrated.js` que publica la API original al estudio. El panel **«Motion-404 original»** muestra su interfaz y permite enviar presets, consultar y exportar sus guardados en el mismo origen. Ultimate prioriza el generador original cuando está cargado; si no lo está, conserva el núcleo portado para no dejar de funcionar.

**Limitación arquitectónica:** se comparte el generador original de Motion DNA, pero el DOM histórico sigue aislado dentro de un marco del mismo origen; **no es una refactorización total a un único árbol DOM**.

## Pruebas

```bash
npm run check                     # 71 pruebas Node + sintaxis
npm run qa:device                 # HTTP, manifiesto, rutas, MIME y PWA preflight
python3 tests/browser-v4-synthetic.py
python3 tests/browser-v52.py
python3 tests/browser-v53.py
npm run qa:legacy                 # Tras importar fuente; Selenium + Chrome/Chromedriver
```

`qa:legacy` se bloquea expresamente si falta el runtime original o Selenium. Ejecuta la suite histórica contra `original-runtime/` y **no contacta con la URL pública de producción** para su diagnóstico inicial. Las comprobaciones de PWA en un navegador y hardware real requieren acceso al dispositivo.

## Guardados, migración y recuperación

- Proyectos v4/v5: `motion404-ultimate-v4-projects` (schema 4).
- Ultimate v3: `motion404-ultimate-v3`.
- Histórico v2.0.2: `motion404-v2-state`.

El estudio no escribe en la clave histórica, salvo que uses explícitamente la interfaz original. La actualización en la misma dirección GitHub Pages conserva el origen; aun así, exporta primero una copia JSON de tus sistemas y proyectos.

## Requisitos y alcance

Node 20+ o Python 3 para el servidor local. Git y conexión para incorporar el original desde GitHub. Todas las funciones de Ultimate siguen disponibles sin el original importado. En el despliegue GitHub Pages, el original ya está disponible en `/original-runtime/`.

Consulta `docs/QA-v5.5.md` para los resultados reales y los bloqueantes.

## URLs publicadas

- Ultimate Studio: `https://ivan7800.github.io/Motion-404/`
- Motion-404 v2.0.2 original: `https://ivan7800.github.io/Motion-404/original-runtime/`

La suite histórica ahora se ejecuta desde `.github/workflows/v202-browser-qa.yml` sobre el subdirectorio original. Las pruebas físicas siguen sin certificarse. El runtime histórico se mantiene aislado para proteger compatibilidad y datos, y se conecta mediante el puente de origen controlado. La integración progresiva comparte generador, presets y migraciones sin fusionar todavía el DOM.
