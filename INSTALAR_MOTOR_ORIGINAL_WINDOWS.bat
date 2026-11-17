@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title MOTION-404 - Integrar runtime DOM original
echo.
echo Este proceso descarga Motion-404 v2.0.2 original en original-runtime.
echo No modifica el repositorio GitHub ni los guardados.
echo.
where node.exe >nul 2>&1
if errorlevel 1 (
  echo ERROR: necesita Node.js instalado.
  goto :END
)
where git.exe >nul 2>&1
if errorlevel 1 (
  echo ERROR: necesita Git para clonar el repositorio.
  echo Alternativa: npm run import:original -- --source RUTA_LOCAL_REPOSITORIO
  goto :END
)
node tools\import-original.mjs
if errorlevel 1 (
  echo ERROR: no se ha importado el runtime. El anterior permanece intacto.
) else (
  echo Motor original integrado. Ejecuta INICIAR_WINDOWS.bat.
)
:END
pause
