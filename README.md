# MOTION-404 ULTIMATE STUDIO v5.4.0 — Candidata local

Suite local-first con 84 patrones, editor visual de grupos geométricos y ajuste magnético, Timeline con keyframes, HUDs, importación v2, React y exportación HTML/CSS/JS/ZIP.

## Estado importante

**La copia física completa de Motion-404 v2.0.2 no está incluida en este ZIP:** el entorno de construcción no tiene acceso de clonación a GitHub. El ZIP contiene la **integración preparada y probada con un repositorio de prueba**, no el contenido histórico íntegro. Para completarla, ejecuta el instalador del runtime original (requiere Internet) en tu equipo. Con eso se copia todo el checkout a `original-runtime/`, se mantiene una copia SHA-256 del origen y se crea un adaptador de su runtime real. La base JS/CSS original se conserva byte a byte.

**No se ha certificado hardware Windows 11, Linux Mint ni iPhone/Safari.** Ver `docs/QA-v5.4.md` y `docs/QA-DISPOSITIVOS-v5.4.md`. No publicar en `main` sin superar la matriz.

## Arranque del estudio

- **Windows 11:** descomprime y ejecuta `INICIAR_WINDOWS.bat`.
- **Linux Mint:** `bash INICIAR_LINUX.sh`.
- **Manual:** `npm start`; en ausencia de Node, `python3 tools/launch.py`.

Los lanzadores utilizan `127.0.0.1`, normalmente en el puerto 8080 o en otro disponible. El almacenamiento del navegador es **por origen y puerto**. Al cambiar de puerto pueden parecer ausentes tus proyectos; usa la copia JSON antes de actualizar.

## Incorporar realmente el runtime original v2.0.2

Este es el paso necesario para terminar la integración desde un equipo con Internet:

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
npm run check                     # 66 pruebas Node + sintaxis
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

El estudio no escribe en la clave histórica, salvo que uses explícitamente la interfaz del propio original importado. La aplicación publicada en GitHub Pages tiene **otro origen**; exporta su JSON de sistemas, impórtalo desde Ultimate, comprueba los registros y conserva un backup antes de cambiar de versión.

## Requisitos y alcance

Node 20+ o Python 3 para el servidor local. Git y conexión para incorporar el original desde GitHub. Todas las funciones de Ultimate siguen disponibles sin el original importado. No hay sincronización remota de proyectos ni cambios en GitHub por ejecutar estos scripts.

Consulta `docs/QA-v5.4.md` para los resultados reales y los bloqueantes.
