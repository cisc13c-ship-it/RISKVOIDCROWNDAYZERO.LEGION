#!/bin/bash
F="$1"; V="${2:-1.0.0}"; D=$(date -u +%Y%m%d)
[ -f "$F" ] || { echo "uso: $0 file.html 1.2.3"; exit 1; }
echo "Stamped $F -> $V ($D)"
