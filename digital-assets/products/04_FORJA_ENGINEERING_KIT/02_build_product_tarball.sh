#!/bin/bash
set -e
NAME="$1"; SRC_DIR="$2"; OUT_DIR="${3:-dist}"
[ -n "$NAME" ] && [ -d "$SRC_DIR" ] || { echo "uso: $0 NAME SRC_DIR [OUT]"; exit 1; }
mkdir -p "$OUT_DIR"
STAMP=$(date -u +%Y%m%d)
TAR="$OUT_DIR/${NAME}_v${STAMP}.tar.gz"
tar -czf "$TAR" -C "$SRC_DIR" .
sha256sum "$TAR" | tee "$TAR.sha256"
ls -lh "$TAR"
