#!/usr/bin/env bash
set -u
cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" || exit 1
printf '\n==============================================\n  MOTION-404 ULTIMATE STUDIO — Linux\n==============================================\n\n'
export MOTION_OPEN_BROWSER=1
if command -v node >/dev/null 2>&1; then
  echo 'Motor: Node.js'
  node server.mjs
elif command -v python3 >/dev/null 2>&1; then
  echo 'Motor: Python 3'
  python3 tools/launch.py
else
  echo 'ERROR: instala Node.js o Python 3 para iniciar el servidor local.' >&2
  exit 1
fi
status=$?
if [ "$status" -ne 0 ]; then
  printf '\nNo se ha podido iniciar (codigo %s).\n' "$status" >&2
fi
exit "$status"
