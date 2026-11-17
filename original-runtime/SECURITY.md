# Seguridad

## Alcance
Motion 404 es una aplicación estática ejecutada en el navegador, sin backend, cuentas, telemetría ni secretos de producción.

## Reporte responsable
No publiques detalles explotables en una incidencia pública. Contacta primero con el propietario del repositorio e incluye versión, navegador, pasos de reproducción, impacto y una prueba mínima no destructiva.

## Datos y límites
Los favoritos, preferencias y prompts guardados permanecen en `localStorage`. No deben introducirse credenciales, claves API ni información confidencial. La importación JSON se valida y normaliza, pero debe tratarse siempre como contenido no confiable.

## Dependencias
La versión publicada no carga librerías, scripts, fuentes ni servicios de terceros. Las herramientas de prueba de `requirements-dev.txt` solo se usan en desarrollo.

## Cabeceras
La aplicación incluye una CSP mediante `meta`. Cabeceras como HSTS, Permissions-Policy o una CSP HTTP dependen del proveedor de alojamiento y no pueden configurarse completamente desde GitHub Pages.
