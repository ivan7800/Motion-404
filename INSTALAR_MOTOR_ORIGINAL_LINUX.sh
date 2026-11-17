#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"
if ! command -v node >/dev/null; then echo 'Falta Node.js 20+' >&2; exit 1; fi
if ! command -v git >/dev/null; then echo 'Falta Git. Usa --source con una copia ya clonada.' >&2; exit 1; fi
node tools/import-original.mjs
printf '\nMotor importado. Arranca con bash INICIAR_LINUX.sh\n'
