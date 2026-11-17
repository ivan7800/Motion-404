@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Motion 404

set "PYTHON_CMD="
where py >nul 2>nul && set "PYTHON_CMD=py -3"
if not defined PYTHON_CMD (
  where python >nul 2>nul && set "PYTHON_CMD=python"
)

if not defined PYTHON_CMD goto :portable

set "PORT=4040"
where powershell >nul 2>nul
if %errorlevel%==0 (
  for /f %%P in ('powershell -NoProfile -Command "$p=4040; while(Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue){$p++}; $p"') do set "PORT=%%P"
)

echo Iniciando Motion 404 en http://127.0.0.1:%PORT%/ ...
start "Motion 404 Server" /min %PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1

where powershell >nul 2>nul
if not %errorlevel%==0 goto :open
for /l %%I in (1,1,10) do (
  powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 'http://127.0.0.1:%PORT%/'; if($r.StatusCode -eq 200){exit 0} } catch {}; exit 1" >nul 2>nul
  if not errorlevel 1 goto :open
  timeout /t 1 /nobreak >nul
)

echo [AVISO] El servidor no respondio. Se abrira la version portatil.
goto :portable

:open
start "" "http://127.0.0.1:%PORT%/"
goto :end

:portable
echo Python no esta disponible o el servidor no pudo iniciarse.
echo Abriendo Motion-404-PORTABLE.html ...
start "" "%~dp0Motion-404-PORTABLE.html"

:end
endlocal
