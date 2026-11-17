@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
cd /d "%~dp0"
title MOTION-404 ULTIMATE STUDIO - Lanzador Windows
echo.
echo ==============================================
echo    MOTION-404 ULTIMATE STUDIO - INICIAR
echo ==============================================
echo.
set "MOTION_OPEN_BROWSER=1"
where node.exe >nul 2>&1
if not errorlevel 1 goto :NODE
where py.exe >nul 2>&1
if not errorlevel 1 goto :PY
where python.exe >nul 2>&1
if not errorlevel 1 goto :PYTHON
goto :MISSING
:NODE
echo Motor encontrado: Node.js
node "%~dp0server.mjs"
goto :END
:PY
echo Motor encontrado: Python launcher
py -3 "%~dp0tools\launch.py"
if not errorlevel 1 goto :END
echo Python launcher fallo. Probando python.exe...
where python.exe >nul 2>&1
if not errorlevel 1 goto :PYTHON
goto :END
:PYTHON
echo Motor encontrado: Python
python "%~dp0tools\launch.py"
goto :END
:MISSING
echo ERROR: no se ha encontrado Node.js ni Python 3.
echo Instala Node.js LTS desde https://nodejs.org/ o Python 3 desde https://python.org/
echo No se abrira index.html directamente porque puede fallar fuera de localhost.
:END
echo.
echo Si no se ha abierto la web, revisa el mensaje de arriba.
echo Este terminal queda abierto para mostrar errores.
pause
