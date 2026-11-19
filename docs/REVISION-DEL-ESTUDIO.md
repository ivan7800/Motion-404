# Revisión del estudio

Base examinada: `b354c64`, versión 5.5.0 RC1. Las 71 pruebas de Node pasaron antes de esta revisión. La aplicación es estática; el paso de generación recompone los recursos de los HTML autónomos.

| Dónde y cómo repetir | Qué ocurría y por qué | Resultado esperado tras la corrección |
| --- | --- | --- |
| Desde Inicio, pulsar ULTIMATE STUDIO en la cabecera | El enlace apuntaba a un ancla que el enrutador trataba como Inicio. | La cabecera ofrece el compositor con una ruta válida. |
| En Estudio de diseño, pulsar Empezar proyecto | Era un botón de muestra sin acción. | La muestra se identifica como tal; Aplicar colores y radios modifica el proyecto activo. |
| Personalizar un patrón y seguir al compositor | El inspector solo ofrecía guardar o exportar. Insertar el mismo patrón desde el editor no llevaba los ajustes. | Añadir al proyecto conserva el patrón, texto, color, velocidad y movimiento reducido, también al recargar y exportar. |
| Abrir el enlace compartido de un patrón y recargarlo | El salto al catálogo retiraba el parámetro del componente durante la carga. | El enlace permanece mientras el inspector está abierto. |
| Personalizar un patrón sin marcarlo favorito y descargar la copia de biblioteca | La copia recorría solo los identificadores favoritos. | La copia contiene también los ajustes de los demás patrones personalizados. |
| Cambiar el retardo de la segunda pista y reproducir | Solo se animaba un elemento durante la duración total. | Las tres pistas usan sus tiempos individuales. Los tiempos de hasta cinco segundos también se conservan al transferirlos. |
| Guardar un diseño, exportar la copia de proyectos e importarla | La importación llamaba a un validador que el módulo no importaba. Los archivos v3 previamente archivados tampoco se leían al restaurar. | Se validan y fusionan los archivos, se omiten entradas idénticas y se conservan las variantes. Una copia incompatible se rechaza antes de escribir. |

La organización del menú es una decisión de producto. Biblioteca y Compositor quedan en Crear. El secuenciador conserva su exportación independiente y el compositor mantiene la edición por fotogramas. Recursos, copias y archivo histórico quedan al final.

Para repetir la validación automatizada, ejecutar `npm run check`, `npm run qa:device` y los flujos de GitHub Actions «Live library browser QA» y «Motion 404 Ultimate v5.5 + Original v2 Browser QA». La prueba de biblioteca emplea Chromium, un perfil limpio, descargas reales y una ventana táctil emulada. El test de contenido del portapapeles usa una captura de las llamadas a copiar. Los destinos de terceros pueden cambiar con independencia de esta publicación.
