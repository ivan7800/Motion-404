# MOTION-404 v5.5 — protocolo de pruebas en dispositivos reales

**Estado:** procedimientos preparados, pendientes de ejecución en hardware real. Ningún resultado de este documento debe marcarse PASS sin ejecutarlo en el dispositivo indicado.

## Antes de empezar

1. Conserva el ZIP de v5.2 y exporta en la aplicación publicada el JSON v2.0.2 de **Sistemas guardados**. Exporta también un backup del Ultimate antes de actualizar.
2. Abre v5.5 en una carpeta independiente y conserva una copia de los backups de v5.2/v5.4.
3. No pruebes la actualización de la PWA sobre la URL pública de producción: usa un origen HTTPS **de staging** o una copia de laboratorio del perfil.
4. Ejecuta `npm run check` y `npm run qa:device`; este último comprueba servidores Node/Python, recursos de la caché, iconos, CSP y tipos MIME, pero no abre un navegador ni instala una PWA.
5. Asegura que el teléfono y el ordenador usan el **mismo origen web** cuando compruebes guardados. `localStorage` no se comparte entre dominios, protocolos ni puertos.

## Windows 11 — BAT + Chrome/Edge

- [ ] Doble clic en `INICIAR_WINDOWS.bat`; el terminal indica el puerto real y abre el navegador. No necesita privilegios de administrador.
- [ ] Si el puerto 8080 está ocupado, el terminal muestra un puerto libre y la URL correcta.
- [ ] Cerrar el terminal detiene el servidor; los guardados permanecen al volver a arrancar **en el mismo puerto**.
- [ ] Repetir el arranque sin Node.js disponible para comprobar el fallback con `py -3` o `python` instalado.
- [ ] Abrir Visual Composer, crear 2 bloques, agruparlos, pasar el contenedor a `Libre`, arrastrar uno y observar ajuste de 8 px y guías respecto a otros bloques.
- [ ] Añadir 3 keyframes, pulsar Play/Pause/Stop y exportar HTML; verificar que se reproduce fuera del editor.
- [ ] Importar backup v2, comprobar que no se pierden IDs ni sistemas existentes; guardar, cerrar y reabrir.
- [ ] Ejecutar `npm run qa:device` y guardar salida de consola.

## Linux Mint Cinnamon — lanzamiento y navegador

- [ ] Abrir terminal en la carpeta y ejecutar `bash INICIAR_LINUX.sh`.
- [ ] Comprobar que la URL se abre con `xdg-open` (o copiarla manualmente si no hay navegador predeterminado).
- [ ] Validar fallback Python 3 sin Node si es un escenario de uso esperado.
- [ ] Verificar carga de módulos `.mjs` sin errores `MIME` en la consola del navegador.
- [ ] Repetir editor, arrastre, group/free, Timeline, guardado, exportación HTML/React/ZIP e importación v2.
- [ ] Ejecutar `npm run qa:device` y guardar salida de consola.

## Safari / iPhone — URL HTTPS de staging

- [ ] Acceder **por HTTPS** a una versión candidata de prueba. `http://127.0.0.1` en el teléfono señala al propio iPhone, **no** al servidor del PC. Una dirección LAN HTTP normalmente no cumple el contexto seguro requerido por Service Workers.
- [ ] Probar navegación táctil, botones, inspector, vista de 390 px, teclado virtual y zoom sin desbordamiento horizontal.
- [ ] Instalar mediante *Compartir → Añadir a pantalla de inicio*, abrir desde el icono y confirmar imagen/título correctos.
- [ ] Una vez cargada la app conectada, activar modo avión y volver a abrirla: catálogo, editor, CSS y módulos deben cargar offline; crear y guardar un proyecto nuevo.
- [ ] Reestablecer red, desplegar una nueva versión en **staging** con nueva caché y comprobar que la app instalada utiliza los recursos nuevos.
- [ ] Validar que los backups existentes se recuperan si se vacía almacenamiento del sitio. No depender solo del almacenamiento local para copias irremplazables.

## Chrome/Edge Desktop — PWA y migración offline

- [ ] En un origen HTTPS de staging o localhost, DevTools → Application → Service Workers: SW instalado, activado y controlando la página.
- [ ] Cache Storage contiene `motion-404-ultimate-v5.5-rc1-studio3` con todos los recursos indicados en `service-worker.js`.
- [ ] Instalación PWA: abrir como ventana independiente, navegar por todas las pestañas y exportar un proyecto.
- [ ] Network → Offline y recargar: la aplicación y el editor deben cargar. No hay recursos CDN obligatorios.
- [ ] Repetir sin conexión la importación desde archivo local, la exportación HTML y la apertura de proyectos guardados.
- [ ] Comprobar actualización de v5.4→v5.5: se elimina la caché antigua **propia**, no otras apps; no se borran `localStorage` ni backups.
- [ ] Probar un JSON v2 con registros válidos, un backup duplicado y un JSON manipulado. Sólo el válido puede importarse; la importación no elimina datos.

## Criterios de salida

**PASS** únicamente cuando hay evidencia: dispositivo/SO/navegador, fecha, acción, resultado, captura/log y commit o hash del ZIP. **FAIL** si existe pérdida de datos, interfaz bloqueada, recurso offline ausente, error de consola, exportación no ejecutable o migración corrupta. **NO PROBADO** para cualquier escenario sin prueba real.

Sin completar esta matriz, la certificación física debe permanecer **NO PROBADA**. El runtime DOM legado se mantiene como archivo histórico aislado; su integración progresiva se valida mediante el puente y migraciones, sin fusionar el DOM ni poner en riesgo los datos guardados.
