#!/bin/bash
F="$1"; SKU="${2:-SKU}"; V="${3:-1.0.0}"; O="${4:-../dist}"
mkdir -p "$O"
H=$(sha256sum "$F"|awk '{print $1}')
T=$(date -u +%Y%m%dT%H%M%SZ)
cp "$F" "$O/${SKU}_v${V}_${T}_$(basename $F)"
echo "$H" > "$O/${SKU}_v${V}_${T}_$(basename $F).sha256"
echo stamped $H
