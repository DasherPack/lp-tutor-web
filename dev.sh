#!/usr/bin/env bash
# Arranca el servidor de desarrollo usando node de LM Studio si no está en PATH
NODE="${LMSTUDIO_NODE:-/home/asegarra/.lmstudio/.internal/utils/node}"
if [[ -x "$NODE" ]]; then
  export PATH="$(dirname "$NODE"):$PATH"
fi
exec "$(dirname "$0")/node_modules/.bin/next" dev
