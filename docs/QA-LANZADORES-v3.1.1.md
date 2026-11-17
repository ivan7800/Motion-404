# QA de lanzadores v3.1.1 — 17 noviembre 2026

## Causa identificada
- Windows abría la URL antes de que el servidor Node empezase a escuchar.
- Linux esperaba un tiempo fijo de 1 segundo, independiente del arranque real.
- Sin Node.js, ambos pasaban a `file://`, sin servicio HTTP ni funcionamiento PWA fiable.
- Puerto 8080 ocupado podía cerrar el servidor sin solución automática.

## Reparaciones
- Node abre navegador al entrar en el evento `listening` y utiliza puerto efímero si el configurado está ocupado.
- Python 3 sirve como alternativa sin instalar paquetes.
- BAT conserva la ventana, detecta motores y comunica fallos.
- Bash usa el mismo criterio de detección y no utiliza esperas fijas.

## Pruebas ejecutadas
- `npm run check`: **19/19 PASS** (incluye dos tests HTTP reales del servidor Node y puerto alternativo).
- `python3 -m py_compile tools/launch.py`: PASS.
- `bash -n INICIAR_LINUX.sh`: PASS.
- Python con PORT=0: GET / y GET /src/ultimate.js -> **HTTP 200**.
- Archivos ZIP y sintaxis: comprobados después de empaquetar.

## Pendiente de verificar fuera de este entorno
- Ejecutar `INICIAR_WINDOWS.bat` en Windows 10/11 y confirmar apertura real del navegador.
- Doble clic Linux y comportamiento con configuración de entorno gráfico particular.
- Suite completa de interfaz en navegador gráfico.
